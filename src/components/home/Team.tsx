import React, { Fragment } from "react";
import HawkProfile from "./images/hawk-profile.jpg";

function Team() {
  return (
    <Fragment>
      <h1>Active Team</h1>
      <div className="team-card-container">
        <div className="team-card">
          <img src={HawkProfile} alt="Hawk" />
          <h2>Hawk Ticehurst</h2>
          <a href="mailto:hawkticehurst@gmail.com">Email</a>
        </div>
      </div>
    </Fragment>
  );
}

export default Team;
