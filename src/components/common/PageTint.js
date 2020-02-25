import React, {useEffect, useState} from 'react';

/**
 * Optional Props:
 * clickedTint {Function} - Called when the tint is clicked on
 * tintShown {boolean} - true if tint is shown, false otherwise
 */
function PageTint(props) {
  const {clickedTint, tintShown} = props;
  const [render, setRender] = useState(tintShown);

  useEffect(() => {
    if (tintShown) {
      setRender(true);
    }
  }, [tintShown]);

  const onAnimationEnd = () => {
    if (!tintShown) {
      setRender(false);
    }
  };

  const onClick = (event) => {
    event.stopPropagation();
    if (clickedTint != null) {
      clickedTint();
    }
  };

  const animationClass = tintShown ? 'tint-fade-in' : 'tint-fade-out';
  return render ? (
      <div
        className={'page-tint ' + animationClass}
        onAnimationEnd={onAnimationEnd}
        onClick={onClick} />
    ) : null
}

export default PageTint;
