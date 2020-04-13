import React from 'react';

/**
 * Required Props:
 * pointerID {String} - ID to apply to the node such as "node1"
 * name {String} - Display name of the pointer
 * hasVariableTable {boolean} - Determines the y position
 * animationHeight {number} - px height of the animation svg
 */
function LinkedListPointer(props) {
  const { animationHeight, pointerID, name, hasVariableTable } = props;

  // TODO this is a hack, because "curr" takes less space than "head", find a way to calc this
  const textOffset = name === 'curr' ? '5px' : '0px';

  const yValue = hasVariableTable ? (animationHeight / 2) + 85 : (animationHeight / 2) + 60;
  return (
    <svg id={pointerID + '-container'} x="100px" y={yValue}>
      <g id={pointerID} className="hidden">
        <rect
          id={pointerID + '-tip'}
          width="4px"
          height="75px"
          x="20px" / >
        <circle r="4px" cx="22px" cy="75px"/ >
        <text x={textOffset} y="100px">{name}</text>
      </g>
    </svg>
  );
}

export default LinkedListPointer;
