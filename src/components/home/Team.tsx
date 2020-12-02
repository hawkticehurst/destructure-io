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
          <a href="mailto:ardmanc@uw.edu">ardmanc@uw.edu</a>
        </div>
        <div className="team-card">
          <img src={HawkProfile} alt="Hawk" />
          <h2>Hawk Ticehurst</h2>
          <a href="mailto:hawkt88@uw.edu">hawkt88@uw.edu</a>
        </div>
        <div className="team-card">
          <img src={HariProfile} alt="Hari" />
          <h2>Hari Kaushik</h2>
          <a href="mailto:harik98@uw.edu">harik98@uw.edu</a>
        </div>
        <div className="team-card">
          <img src={ZachProfile} alt="Zach" />
          <h2>Zach Palmer</h2>
          <a href="mailto:zachbhs@uw.edu">zachbhs@uw.edu</a>
        </div>
      </div>
    </Fragment>
  );
}

export default Team;
