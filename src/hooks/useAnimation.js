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
    setTimeout(callback, delay);
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

  /*
  options: [{
    targets: String selector or DOM element... or Array of those things
    translateY: String exact value or +/-= value
    translateX : ^^
    width: ^^
    height: ^^
    x: ^^
    y: ^^
    opacity: exact value
    duration: number ms
    delay: number ms
  }]
  */
  const addAnimation = (options, shouldRunImmediately = false, onBeginStep, onCompleteStep) => {
    const animations = [];
    let largestDuration = 0;
    options.forEach(optionObj => {
      const {
        targets,
        translateX,
        translateY,
        width,
        height,
        x,
        y,
        opacity,
        duration,
        delay
      } = optionObj;
      const realDelay = !shouldRunImmediately && delay != null ? delay : 0;
      const completeTime = (duration != null ? duration : 1000) + (realDelay != null ? realDelay : 0);
      if (completeTime > largestDuration) {
        largestDuration = completeTime;
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

      animations.push(() => {
        optionalTimeout(() => {
          domElements.forEach(element => {
            const transitionDuration = (duration != null && !shouldRunImmediately) ?
              ((duration / 1000) + 's') :
              (shouldRunImmediately ? '0s' : '1s');
            element.style.transitionDuration = transitionDuration;

            const oldStyle = window.getComputedStyle(element);

            let transformValue;
            let oldTransformX = '0px';
            let oldTransformY = '0px';
            const transformOld = oldStyle.transform ||
                                 oldStyle.webkitTransform ||
                                 oldStyle.mozTransform ||
                                 oldStyle.msTransform ||
                                 oldStyle.oTransform;
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
            if (transformValue != null) {
              transform(element, transformValue);
            }

            if (width != null) {
              element.style.width = getCalculatedValue(width, oldStyle.width);
            }
            if (height != null) {
              element.style.height = getCalculatedValue(height, oldStyle.height);
            }
            if (x != null) {
              element.setAttribute('x', getCalculatedValue(x, element.getAttribute('x')));
            }
            if (y != null) {
              element.setAttribute('y', getCalculatedValue(x, element.getAttribute('y')));
            }
            if (opacity != null) {
              element.style.opacity = opacity;
            }
          });
        }, realDelay);
      });
    });

    const animationCallback = () => {
      if (onBeginStep != null) {
        onBeginStep();
      }

      animations.forEach(animation => {
        if (animation != null) {
          animation();
        }
      });
      if (onCompleteStep != null) {
        setTimeout(onCompleteStep, largestDuration);
      }
    };

    if (shouldRunImmediately) {
      animationCallback();
    } else {
      timeline.current.push(() => {
        animationCallback();

        // If we are on the timeline and reached the end, reset
        if (timelineIndex.current >= timeline.current.length - 1) {
          clearAnimations();
          if (onComplete != null) {
            setTimeout(onComplete, largestDuration);
          }
        }
        if (isPlayingFullAnimation.current && timelineIndex.current < timeline.current.length - 1) {
          setTimeout(stepAnimation, largestDuration);
        }
      });
    }
  };

  const stepAnimation = () => {
    timeline.current[timelineIndex.current]();
    if (timelineIndex.current < timeline.current.length - 1) {
      timelineIndex.current++;
    }
  };

  const playFullAnimation = () => {
    isPlayingFullAnimation.current = true;
    stepAnimation();
  };

  const pauseAnimation = () => {

  };

  const previousLine = () => {

  };

  const clearAnimations = () => {
    timeline.current = [];
    timelineIndex.current = 0;
    isPlayingFullAnimation.current = false;
  };

  return {
    addAnimation,
    stepAnimation,
    playFullAnimation,
    pauseAnimation,
    previousLine,
    clearAnimations,
    isPlayingFullAnimation
  };
}

export default useAnimation;
