import React, { Fragment } from 'react';

function GuidedLearning() {
  return (
    <Fragment>
      <div className="text-container">
        <h1>Guided learning.</h1>
        <p>
          Access learning modules that guide you through the process
          of understanding and working with each data structure.
        </p>
      </div>
      <div className="img-container right-image">
        <div className="progress-row-container">
          <div className="progress-circle-filled-home">&#10004;</div>
          <div className="progress-line-filled" />
        </div>
        <div className="progress-row-container">
          <div className="progress-circle-filled-home">&#10004;</div>
          <div className="progress-line-filled" />
        </div>
        <div className="progress-row-container">
          <div className="progress-circle-home" />
          <div className="progress-line" />
        </div>
      </div>
    </Fragment>
  );
}

export default GuidedLearning;
