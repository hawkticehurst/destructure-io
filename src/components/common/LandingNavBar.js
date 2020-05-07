import React from 'react';
import { Link } from 'react-router-dom';

function LandingNavBar(props) {
  const { about } = props;

  let landingLink = about ? <Link to="/landing">Back to Landing</Link> : <Link to="/about">About</Link>;
  return (
    <div className="nav-bar-container homepage-nav-bar">
      <h1><Link to="/">destructure.io</Link></h1>
      <div className="nav-links-container">
        {landingLink}
      </div>
    </div>
  );
}

export default LandingNavBar;
