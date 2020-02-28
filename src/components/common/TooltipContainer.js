import React, { useState, useRef } from 'react';

/**
 * Required Props:
 * tooltipComponent {React Node} - The node to show as a tooltip
 *
 * Children:
 *   The node to show as a tooltip
 */
function TooltipContainer(props) {
  const { children } = props;
  const [isTooltipShown, setIsTooltipShown] = useState(false);
  const [tooltipTop, setTooltipTop] = useState(0);
  const [tooltipLeft, setTooltipLeft] = useState(0);
  const containerRef = useRef(null);
  const tooltipRef = useRef(null);

  const showTooltip = (event) => {
    const size = tooltipRef.current.getBoundingClientRect();
    setTooltipLeft(containerRef.current.getBoundingClientRect().left - 20);
    setTooltipTop(containerRef.current.getBoundingClientRect().bottom - size.height - 25);
    setIsTooltipShown(true);
  };

  const tooltipClass = isTooltipShown ? 'tooltip' : 'tooltip invisible';

  return (
    <div>
      <div style={{zIndex: 4}} ref={containerRef} onMouseEnter={showTooltip} onMouseLeave={() => setIsTooltipShown(false)}>
        <span className="tooltip-indicator" />
      </div>
      <div ref={tooltipRef} className={tooltipClass} style={{top: tooltipTop, left: tooltipLeft}}>
        {children}
      </div>
    </div>
  );
}

export default TooltipContainer;
