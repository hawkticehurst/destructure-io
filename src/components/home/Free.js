import React, { Fragment } from 'react';
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
    <Fragment>
      <div className="text-container">
        <h1>Free. &nbsp;For everyone.</h1>
        <p>
          Destructure.io is created by people who believe that quality programming resources
          should be available to all.
        </p>
        <h2 onClick={getStarted} className="bold">
          Get Started &#10141;
        </h2>
        {/* <button onClick={getStarted} className="hero-btn">
          <span className="bold">Get Started</span>
        </button> */}
      </div>
      <div className="img-container right-image">
        <div className="free-hero-circle" />
        {/* <button onClick={getStarted} className="hero-btn">
          <span className="bold">Get Started</span>
        </button> */}
      </div>
    </Fragment>
  );
}

export default Free;
