import { useRef } from 'react';

/**
 * Safer wrapper function around .style.transform = value
 *
 * @param  {HTMLElement} element - element to transform
 * @param  {string} value - the value to transform, example: 'translateY(100vh)'
 */
function transform(element, value) {
  // To be safe with old browsers, use all the prefix versions
  element.style.webkitTransform = value;
  element.style.mozTransform = value;
  element.style.msTransform = value;
  element.style.oTransform = value;
  element.style.transform = value;
}

function optionalTimeout(callback, delay) {
  if (delay != null && delay > 0) {
    return setTimeout(callback, delay);
  } else {
    callback();
  }
}

function getCalculatedValue(value, oldValue) {
  const valueArray = parseValueString(value);
  const unit = valueArray[2] != null && valueArray[2].length > 0 ? valueArray[2] : '';
  if (valueArray[0] === '-=') {
    return parseInt(oldValue) - parseInt(valueArray[1]) + unit;
  } else if (valueArray[0] === '+=') {
    return parseInt(oldValue) + parseInt(valueArray[1]) + unit;
  } else {
    return value;
  }
}

// Converts values like -=10px into array [-=, 10, px]
// Order is always [-/+=, value, unit]
function parseValueString(value) {
  let reg = /^(-=|\+=)?(-?[0-9]+)(.*)/;
  return value.match(reg).splice(1);
}

// Custom hook for animating SVGs
function useAnimation(onComplete) {
  const timeline = useRef([]); // Array of callback functions for each line in animation
  const timelineIndex = useRef(0);
  const isPlayingFullAnimation = useRef(false);
  const nextAnim = useRef(null);

  /*
  Array of animations for the currently active animation in the timeline
  [
    {
    animation: () => void
    delay: time in ms
    timer: timerID, null if had 0 delay
    duration: time in ms
    pause: () => void // function to stop the animation
    }
  ]
  */
  const currentAnimations = useRef([]);
  const currentAnimationValues = useRef([]);
  const startTime = useRef(0); // time unpaused
  const timeElapsed  = useRef(0); // Only updates on pause
  const isPaused = useRef(false);
  const largestCompleteTimes = useRef([]);
  const completeStep = useRef(() => {});
  const completeStepTimer = useRef(null);

  /*
  options: [{
    targets: String selector or DOM element... or Array of those things
    translateY: String exact value or +/-= value
    translateX : ^^
    width: ^^
    height: ^^
    opacity: exact value
    duration: number ms
    delay: number ms
  }]
  */
  const addAnimation = (options, shouldRunImmediately = false, onBeginStep, onCompleteStep) => {
    const animations = [];
    let largestCompleteTime = 0;
    options.forEach(optionObj => {
      const {
        targets,
        translateX,
        translateY,
        width,
        height,
        opacity,
        duration,
        delay
      } = optionObj;
      const realDelay = !shouldRunImmediately && delay != null ? delay : 0;
      const completeTime = (duration != null ? duration : 1000) + (realDelay != null ? realDelay : 0);
      if (completeTime > largestCompleteTime) {
        largestCompleteTime = completeTime;
      }

      const domElements = [];
      if (Array.isArray(targets)) {
        targets.forEach(target => {
          if (typeof target === 'string') {
            domElements.push(document.querySelector(target));
          } else { // dom element
            domElements.push(target);
          }
        });
      } else {
        if (typeof targets === 'string') {
          domElements.push(document.querySelector(targets));
        } else { // dom element
          domElements.push(targets);
        }
      }

      const transitionDuration = (duration != null && !shouldRunImmediately) ?
        ((duration / 1000) + 's') :
        (shouldRunImmediately ? '0s' : '1s');

      animations.push(() => {
        const callAnimationCallback = (isFirstTimeCalled = true, index = 0) => {
          let futureValues;
          if (isFirstTimeCalled) {
            futureValues = domElements.map(element => {
              const style = window.getComputedStyle(element);

              let transformValue;
              let oldTransformX = '0px';
              let oldTransformY = '0px';
              const transformOld = style.transform ||
                                   style.webkitTransform ||
                                   style.mozTransform ||
                                   style.msTransform ||
                                   style.oTransform;
              if (transformOld != null && transformOld !== 'none') {
                const transformMatrix = transformOld.replace(' ', '').split(',');
                oldTransformX = parseInt(transformMatrix[4]) + 'px';
                oldTransformY = parseInt(transformMatrix[5]) + 'px';
              }
              if (translateX != null && translateY != null) {
                const xValue = getCalculatedValue(translateX, oldTransformX);
                const yValue = getCalculatedValue(translateY, oldTransformY);
                transformValue = 'translate(' + xValue + ',' + yValue + ')';
              } else if (translateX != null) {
                const xValue = getCalculatedValue(translateX, oldTransformX);
                transformValue = 'translate(' + xValue + ',' + oldTransformY + ')';
              } else if (translateY != null) {
                const yValue = getCalculatedValue(translateY, oldTransformY);
                transformValue = 'translate(' + oldTransformX + ',' + yValue + ')';
              }

              return {
                transform: transformValue,
                width: width != null ? getCalculatedValue(width, style.width) : style.width,
                height: height != null ? getCalculatedValue(height, style.height) : style.height,
                opacity
              };
            });
            currentAnimationValues.current.push(futureValues);
          } else {
            futureValues = currentAnimationValues.current[index];
          }

          const hasStarted = realDelay < timeElapsed.current;
          const transitionDurationReal = hasStarted ?
                                         (((parseFloat(transitionDuration) * 1000) - (timeElapsed.current - realDelay)) / 1000) + 's' :
                                         transitionDuration;
          domElements.forEach((element, i) => {
            element.style.transitionDuration = transitionDurationReal;
            const futureValue = futureValues[i];

            if (futureValue.transform != null) {
              transform(element, futureValue.transform);
            }

            if (futureValue.width != null) {
              element.style.width = futureValue.width;
            }
            if (futureValue.height != null) {
              element.style.height = futureValue.height;
            }
            if (futureValue.opacity != null) {
              element.style.opacity = futureValue.opacity;
            }
          });
        };
        const timerID = optionalTimeout(callAnimationCallback, realDelay);

        const pause = () => {
          domElements.forEach(element => {
            const style = window.getComputedStyle(element);
            transform(element, style.transform);
            element.style.width = style.width;
            element.style.height = style.height;
            element.style.opacity = style.opacity;
          });
        };

        currentAnimations.current.push({
          animation: callAnimationCallback,
          delay: realDelay,
          duration: transitionDuration,
          timer: timerID,
          pause,
        })
      });
    });

    if (!shouldRunImmediately) {
      largestCompleteTimes.current.push(largestCompleteTime);
    }

    const animationCallback = () => {
      if (onBeginStep != null) {
        onBeginStep();
      }

      currentAnimations.current = [];
      currentAnimationValues.current = [];
      timeElapsed.current = 0;
      completeStep.current = () => {};

      animations.forEach(animation => {
        if (animation != null) {
          animation();
        }
      });

      completeStep.current = () => {
        if (onCompleteStep != null) {
          onCompleteStep();
        }
        if (onComplete != null && timelineIndex.current > 0 && timelineIndex.current > timeline.current.length - 1) {
          clearAnimations();
          onComplete();
        }
      };
      if (!shouldRunImmediately) {
        completeStepTimer.current = setTimeout(completeStep.current, largestCompleteTime);
      }
    };

    if (shouldRunImmediately) {
      animationCallback();
    } else {
      timeline.current.push(() => {
        animationCallback();
        if (isPlayingFullAnimation.current && timelineIndex.current < timeline.current.length - 1) {
          nextAnim.current = setTimeout(stepAnimation, largestCompleteTime);
        }
      });
    }
  };

  const stepAnimation = () => {
    startTime.current = new Date().getTime();
    if (isPaused.current) { // resume after was paused
      isPaused.current = false;
      completeStepTimer.current = setTimeout(completeStep.current, largestCompleteTimes.current[timelineIndex.current - 1] - timeElapsed.current);
      for (let i = 0; i < currentAnimations.current.length; i++) {
        const currAnimation = currentAnimations.current[i];
        const hasStarted = currAnimation.delay < timeElapsed.current;
        if (!hasStarted || (currAnimation.delay + (parseFloat(currAnimation.duration) * 1000)) > timeElapsed.current) {
          currAnimation.timer = optionalTimeout(() => currAnimation.animation(!hasStarted, i), hasStarted ? 0 : currAnimation.delay - timeElapsed.current);
        }
      }
      if (isPlayingFullAnimation.current) {
        nextAnim.current = setTimeout(stepAnimation, largestCompleteTimes.current[timelineIndex.current - 1] - timeElapsed.current);
      }
    } else {
      timeline.current[timelineIndex.current]();
      if (timelineIndex.current < timeline.current.length) {
        timelineIndex.current++;
      }
    }
    isPaused.current = false;
  };

  const playFullAnimation = () => {
    isPlayingFullAnimation.current = true;
    stepAnimation();
  };

  const pauseAnimation = () => {
    isPaused.current = true;

    // Calculate time passed on current animation
    timeElapsed.current += (new Date().getTime() - startTime.current);

    // Stop future animation steps from playing
    isPlayingFullAnimation.current = false;
    clearTimeout(nextAnim.current);

    // Stop future animations in the current step from playing and pause everything that is playing
    for (let i = 0; i < currentAnimations.current.length; i++) {
      const currentAnimation = currentAnimations.current[i];
      clearTimeout(currentAnimation.timer);
      if ((currentAnimation.delay < timeElapsed.current) && ((currentAnimation.delay + (parseFloat(currentAnimation.duration) * 1000)) > timeElapsed.current)) {
        currentAnimation.pause();
      }
    }

    // Stop the onComplete timer
    clearTimeout(completeStepTimer.current);
  };

  const clearAnimations = () => {
    timeline.current = [];
    timelineIndex.current = 0;
    isPlayingFullAnimation.current = false;
    clearTimeout(nextAnim.current);
  };

  return {
    addAnimation,
    stepAnimation,
    playFullAnimation,
    pauseAnimation,
    clearAnimations,
    isPlayingFullAnimation
  };
}

export default useAnimation;
