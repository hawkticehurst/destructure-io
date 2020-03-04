import React from 'react';

/**
 * Required Props:
 * pointerID {String} - ID to apply to the node such as "node1"
 * name {String} - Display name of the pointer
 */
function LinkedListPointer(props) {
  const { pointerID, name } = props;

  return (
    <svg x="100px" y="calc((100vh - 6.5em) / 2 + 60px)">
      <g id={pointerID} className="hidden">
        <rect
          id={pointerID + '-tip'}
          width="4px"
          height="75px"
          x="20px" / >
        <circle r="4px" cx="22px" cy="75px"/ >
        <text x="0px" y="100px">{name}</text>
      </g>
    </svg>
  );
}

export default LinkedListPointer;
