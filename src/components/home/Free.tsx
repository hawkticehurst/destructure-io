import React from "react";
import { useHistory } from "react-router-dom";
import RightArrowIcon from "./images/arrow-right.svg";

type Props = {
  landing?: boolean;
};

function Free({ landing }: Props) {
  const history = useHistory();

  const getStarted = () => {
    history.push("/learn");
  };

  const getStartedLink = !landing ? (
    <h2 onClick={getStarted} className="bold">
      Get Started
    </h2>
  ) : null;
  const getStartedArrow = !landing ? (
    <img src={RightArrowIcon} alt="Arrow Right Icon" />
  ) : null;

  return (
    <div id="free-card-container">
      <div className="text-container">
        <h1>Free. &nbsp;For everyone.</h1>
        <p>
          Destructure.io is a platform created by software engineers who believe
          quality programming resources should be accessible to anyone,
          anywhere.
        </p>
        <div className="inline-block">
          <div id="free-get-started-container">
            {getStartedLink}
            {getStartedArrow}
          </div>
        </div>
      </div>
      <div className="img-container right-image">
        <svg id="free-node-1" x="0px" y="0px" viewBox="0 0 150 100">
          <g className="node">
            <rect x="0" y="0" rx="12px" />
            <g className="node-data-field">
              <text x="10px" y="55px">
                data
              </text>
              <text x="60px" y="55px">
                =
              </text>
              <rect x="85px" y="39px" />
              <rect x="85px" y="39px" />
              <text
                className="node-data-text"
                x="110px"
                y="51px"
                dominantBaseline="middle"
                textAnchor="middle">
                42
              </text>
            </g>
            <g className="node-next-field">
              <text x="10px" y="82px">
                next
              </text>
              <text x="60px" y="82px">
                =
              </text>
              <rect x="85px" y="66px" />
              <g className="node-pointer">
                <circle
                  r="7px"
                  cx="110px"
                  cy="76px"
                  dominantBaseline="middle"
                  textAnchor="middle"
                />
                <rect width="0px" x="110px" y="74px" />
              </g>
            </g>
          </g>
        </svg>
        <svg id="free-node-2" x="0px" y="0px" viewBox="0 0 150 100">
          <g className="node">
            <rect x="0" y="0" rx="12px" />
            <g className="node-header">
              <text x="50px" y="20px">
                Node
              </text>
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

export default Free;
