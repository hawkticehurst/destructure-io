import React from "react";
import { Link } from "react-router-dom";

type Props = {
  about: boolean;
};

function LandingNavBar({ about }: Props) {
  const landingLink = about ? (
    <Link to="/landing">Home</Link>
  ) : (
    <Link to="/about">About</Link>
  );

  return (
    <div className="nav-bar-container homepage-nav-bar">
      <h1>destructure.io</h1>
      <div className="nav-links-container">{landingLink}</div>
    </div>
  );
}

export default LandingNavBar;
