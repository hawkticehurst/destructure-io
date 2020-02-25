import React, {useEffect, useRef, useState} from 'react';

/**
 * Required Props:
 * firstComponent {React Component} - Component for left/top pane
 * secondComponent {React Component} - Component for right/bottom pane
 *
 * Optional props:
 * initialStartSize {number} - Starting size percentage of left/top pane, defaults to 50%
 * splitHorizontal {boolean} - True = horizontal divider, defaults to false
 * firstComponentRef {Ref} - Ref created with useRef to be the container div of firstComponent
 *                           This is useful for resetting scroll heights
 */
function TwoPaneResizable(props) {
  const {firstComponent, secondComponent, initialStartSize, splitHorizontal, firstComponentRef} = props;
  const [startSize, setstartSize] = useState(initialStartSize != null ? initialStartSize : 50);
  const [isResizing, setIsResizing] = useState(false);
  const container = useRef(null);

  useEffect(() => {
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);

    return () => {
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mousemove', onMouseMove);
    };
  });

  const onMouseMove = (event) => {
    if (!isResizing) {
      return;
    }

    const clientStart = splitHorizontal ? event.clientY : event.clientX;
    const bound = container.current.getBoundingClientRect();
    const boundStart = splitHorizontal ? bound.top : bound.left;
    const containerSize = splitHorizontal ? container.current.offsetHeight : container.current.offsetWidth;
    setstartSize((clientStart - boundStart) / containerSize * 100);
  };

  const onMouseUp = () => {
    setIsResizing(false);
  };

  const onMouseDown = (event) => {
    event.preventDefault();
    setIsResizing(true);
  };

  const containerClass = splitHorizontal ? 'two-column-container-horizontal' : 'two-column-container';
  const dividerClass = splitHorizontal ? 'two-column-divider-horizontal' : 'two-column-divider';
  const paneClass = isResizing ? (splitHorizontal ? 'pane pane-resizing-horizontal' : 'pane pane-resizing') : 'pane';

  return (
    <div className={containerClass} ref={container}>
      <div ref={firstComponentRef} className={paneClass} style={{flex: startSize}}>
        {firstComponent}
      </div>
      <div className={dividerClass} onMouseDown={onMouseDown} />
      <div className={paneClass} style={{flex: 100 - startSize}}>
        {secondComponent}
      </div>
    </div>
  );
}

export default TwoPaneResizable;
