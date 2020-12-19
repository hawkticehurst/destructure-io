import React, { Fragment } from "react";
import ConnerProfile from "./images/conner-profile.jpg";
import HawkProfile from "./images/hawk-profile.jpg";
import HariProfile from "./images/hari-profile.png";
import ZachProfile from "./images/zach-profile.jpg";

function Team() {
  return (
    <Fragment>
      <h1>Team</h1>
      <div className="team-card-container">
        <div className="team-card">
          <img src={ConnerProfile} alt="Conner" />
          <h2>Conner Ardman</h2>
          <a href="https://github.com/ConnerArdman">GitHub</a>
        </div>
        <div className="team-card">
          <img src={HawkProfile} alt="Hawk" />
          <h2>Hawk Ticehurst</h2>
          <a href="https://github.com/hawkticehurst">GitHub</a>
        </div>
        <div className="team-card">
          <img src={HariProfile} alt="Hari" />
          <h2>Hari Kaushik</h2>
          <a href="https://github.com/harik98">GitHub</a>
        </div>
        <div className="team-card">
          <img src={ZachProfile} alt="Zach" />
          <h2>Zach Palmer</h2>
          <a href="https://github.com/zachp98">GitHub</a>
        </div>
      </div>
    </Fragment>
  );
}

export default Team;
