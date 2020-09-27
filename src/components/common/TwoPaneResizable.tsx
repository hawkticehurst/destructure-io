import React, { useEffect, useRef, useState } from 'react';

type FixMeLater = any;

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
type Props = {
  firstComponent: React.Component,
  secondComponent: React.Component,
  initialStartSize?: number,
  splitHorizontal?: boolean,
  firstComponentRef?: FixMeLater,
  firstComponentName?: string,
  secondComponentName?: string
}

function TwoPaneResizable({
  firstComponent,
  secondComponent,
  initialStartSize,
  splitHorizontal,
  firstComponentRef,
  firstComponentName,
  secondComponentName
}: Props) {
  const [startSize, setstartSize] = useState(initialStartSize != null ? initialStartSize : 50);
  const [isResizing, setIsResizing] = useState(false);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);

    return () => {
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mousemove', onMouseMove);
    };
  });

  const onMouseMove = (event: FixMeLater) => {
    if (!isResizing) {
      return;
    }

    if (container.current !== null) {
      const clientStart = splitHorizontal ? event.clientY : event.clientX;
      const bound = container.current.getBoundingClientRect();
      const boundStart = splitHorizontal ? bound.top : bound.left;
      const containerSize = splitHorizontal ? container.current.offsetHeight : container.current.offsetWidth;
      setstartSize((clientStart - boundStart) / containerSize * 100);
    }
  };

  const onMouseUp = () => {
    setIsResizing(false);
  };

  const onMouseDown = (event: FixMeLater) => {
    event.preventDefault();
    setIsResizing(true);
  };

  const containerClass = splitHorizontal ? 'two-column-container-horizontal' : 'two-column-container';
  const dividerClass = splitHorizontal ? 'two-column-divider-horizontal' : 'two-column-divider';
  const paneClass = isResizing ? (splitHorizontal ? 'pane pane-resizing-horizontal' : 'pane pane-resizing') : 'pane';

  return (
    <div className={containerClass} ref={container}>
      <div ref={firstComponentRef} className={paneClass} style={{ flex: startSize }}>
        {
          firstComponentName != null ? (
            <h2 className="pane-title">{firstComponentName}</h2>
          ) : null
        }
        {firstComponent}
      </div>
      <div className={dividerClass} onMouseDown={onMouseDown} />
      <div className={paneClass + ' second-pane'} style={{ flex: 100 - startSize }}>
        {
          secondComponentName != null ? (
            <h2 className="pane-title">{secondComponentName}</h2>
          ) : null
        }
        {secondComponent}
      </div>
    </div>
  );
}

export default TwoPaneResizable;
