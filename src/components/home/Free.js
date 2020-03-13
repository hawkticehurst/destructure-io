import React from 'react';
import { useHistory } from "react-router-dom";
import { useFirebaseUser } from '../../hooks/user';

function Free() {
  const user = useFirebaseUser();
  const history = useHistory();

  const getStarted = () => {
    if (user == null) {
      history.push('/signup');
    } else {
      history.push('/learn');
    }
  };

  return (
    <div id="free-card-container">
      <div className="text-container">
        <h1>Free. &nbsp;For everyone.</h1>
        <p>
          Destructure.io is created by a group of software engineers who believe that quality programming resources
          should be available to all.
        </p>
        <div style={{ "display": "inline-block" }}>
          <div id="free-get-started-container">
            <h2 onClick={getStarted} className="bold">Get Started</h2>
            <img src={require('./images/arrow-right.svg')} alt="Arrow Right Icon" />
          </div>
        </div>
      </div>
      <div className="img-container right-image">
        <svg id="free-node-1" x="0px" y="0px" viewBox="0 0 150 100">
          <g className="node">
            <rect x="0" y="0" rx="12px" />
            <g className="node-data-field">
              <text x="10px" y="55px">data</text>
              <text x="60px" y="55px">=</text>
              <rect x="85px" y="39px" />
              <rect x="85px" y="39px" />
              <text className="node-data-text" x="110px" y="51px" dominantBaseline="middle" textAnchor="middle">42</text>
            </g>
            <g className="node-next-field">
              <text x="10px" y="82px">next</text>
              <text x="60px" y="82px">=</text>
              <rect x="85px" y="66px" />
              <g className="node-pointer">
                <circle r="7px" cx="110px" cy="76px" dominantBaseline="middle" textAnchor="middle" />
                <rect width="0px" x="110px" y="74px" />
              </g>
            </g>
          </g>
        </svg>
        <svg id="free-node-2" x="0px" y="0px" viewBox="0 0 150 100">
          <g className="node">
            <rect x="0" y="0" rx="12px" />
            <g className="node-header">
              <text x="50px" y="20px">Node</text>
            </g>
          </g>
        </svg>
      </div>
    </div >
  );
}

export default Free;
