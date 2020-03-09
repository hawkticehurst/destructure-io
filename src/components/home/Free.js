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
        <h1>Free. &nbsp;For anyone and everyone.</h1>
        <p>
          Node Warrior is developed by a group of passionate software
          engineers who believe that quality computer science resources
          should be available to all.
        </p>
        <p onClick={getStarted} className="bold">
          Get Started &#10142;
        </p>
        {/* <button onClick={getStarted} className="hero-btn">
          <span className="bold">Get Started</span>
        </button> */}
      </div>
      <div className="img-container right-image">
        {/* <button onClick={getStarted} className="hero-btn">
          <span className="bold">Get Started</span>
        </button> */}
      </div>
    </Fragment>
  );
}

export default Free;
