import React from "react";

/**
 * Required Props:
 * variable {string} - The name of the variable
 * value {string} - the starting value of the row
 * rowID {String} - ID of the row
 */
type Props = {
  variable: string;
  value: string;
  rowID: string;
};

function VariableTableRow({ variable, value, rowID }: Props) {
  return (
    <g className="var-table-row" id={rowID}>
      <rect className="row-bg"></rect>
      <rect className="row-cell" x="4px" y="4px" rx="2px"></rect>
      <rect className="row-cell" x="102px" y="4px" rx="2px"></rect>
      <text
        className="variable-value"
        x="49px"
        y="17px"
        dominantBaseline="middle"
        textAnchor="middle">
        {variable}
      </text>
      <g className="data-value-container">
        <text
          className="data-value"
          x="149px"
          y="17px"
          dominantBaseline="middle"
          textAnchor="middle">
          {value}
        </text>
      </g>
    </g>
  );
}

export default VariableTableRow;
