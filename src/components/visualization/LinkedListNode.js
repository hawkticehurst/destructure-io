import React from 'react';

/**
 * Required Props:
 * nodeID {String} - ID to apply to the node such as "node1"
 * data {String} - Initial data to put in the Node
 */
function LinkedListNode(props) {
  const { nodeID, data } = props;

  return (
    <svg x="50px" y="calc(80vh / 2 - 200px)">
      <g id={nodeID} className="node hidden">
        <rect x="0" y="0" rx="12px" />
        <g className="node-header">
          <text x="50px" y="20px">Node</text>
          <rect x="0px" y="28px"/ >
        </g>
        <g className="node-data-field">
          <text x="10px" y="55px">data</text>
          <text x="60px" y="55px">=</text>
          <rect x="85px" y="39px"/ >
          <text id={nodeID + '-data'} x="101px" y="55px">{data}</text>
        </g>
        <g className="node-next-field">
          <text x="10px" y="82px">next</text>
          <text x="60px" y="82px">=</text>
          <rect x="85px" y="66px"/ >
          <g className="node-pointer">
            <circle r="7px" cx="110px" cy="76px"/ >
            <rect id={nodeID + '-pointer'} width="0px" x="110px" y="74px"/ >
          </g>
        </g>
      </g>
    </svg>
  );
}

export default LinkedListNode;
