import React, { Fragment } from 'react';

function Free() {
  return (
    <Fragment>
      <div className="text-container">
        <h1>Free. &nbsp;For anyone and everyone.</h1>
        <p>
          Node Warrior is developed by a group of passionate software
          engineers who believe that quality computer science resources
          should be available to all.
        </p>
      </div>
      <div className="img-container right-image">
        <button id="cta-btn" className="hero-btn">
          <span className="bold">Get Started</span>
        </button>
      </div>
    </Fragment>
  );
}

export default Free;
