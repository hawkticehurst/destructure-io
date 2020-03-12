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
          Destructure.io is created by people who believe that quality programming resources
          should be available to all.
        </p>
        <div onClick={getStarted} id="free-get-started-container">
          <h2 className="bold">Get Started</h2>
          <img src={require('./images/arrow-right.svg')} alt="Arrow Right Icon" />
        </div>
      </div>
      <div className="img-container right-image">
        <img src={require('./images/node.svg')} alt="Node Illustration" />
      </div>
    </div>
  );
}

export default Free;
