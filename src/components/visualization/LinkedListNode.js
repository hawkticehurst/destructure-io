import React from 'react';

/**
 * Required Props:
 * nodeID {String} - ID to apply to the node such as "node1"
 * data {String} - Initial data to put in the Node
 * hasVariableTable {boolean} - Determines the y position
 * animationHeight {number} - px height of the animation svg
 */
function LinkedListNode(props) {
  const { animationHeight, nodeID, data, hasVariableTable } = props;

  const yValue = hasVariableTable ? (animationHeight / 2) - 175 : (animationHeight / 2) - 200;
  return (
    <svg x="50px" y={yValue}>
      <g id={nodeID} className="node hidden">
        <rect x="0" y="0" rx="12px" />
        <g className="node-header">
          <text x="50px" y="20px">Node</text>
          <rect x="0px" y="28px" />
        </g>
        <g className="node-data-field">
          <text x="10px" y="55px">data</text>
          <text x="60px" y="55px">=</text>
          <rect x="85px" y="39px"/ >
          <rect x="85px" y="39px" />
          <text className="node-data-text" id={nodeID + '-data'} x="110px" y="51px" dominantBaseline="middle" textAnchor="middle">{data}</text>
        </g>
        <g className="node-next-field">
          <text x="10px" y="82px">next</text>
          <text x="60px" y="82px">=</text>
          <rect x="85px" y="66px" />
          <g className="node-pointer">
            <circle r="7px" cx="110px" cy="76px" dominantBaseline="middle" textAnchor="middle" />
            <rect id={nodeID + '-pointer'} width="0px" x="110px" y="74px" />
          </g>
        </g>
      </g>
    </svg>
  );
}

export default LinkedListNode;
