import React, { Fragment } from "react";

function Team() {
  return (
    <Fragment>
      <h1>Team</h1>
      <div className="team-card-container">
        <div className="team-card">
          <img src={require("./images/conner-profile.jpg")} alt="Conner" />
          <h2>Conner Ardman</h2>
          <a href="mailto:ardmanc@uw.edu">ardmanc@uw.edu</a>
        </div>
        <div className="team-card">
          <img src={require("./images/hawk-profile.jpg")} alt="Hawk" />
          <h2>Hawk Ticehurst</h2>
          <a href="mailto:hawkt88@uw.edu">hawkt88@uw.edu</a>
        </div>
        <div className="team-card">
          <img src={require("./images/hari-profile.png")} alt="Hari" />
          <h2>Hari Kaushik</h2>
          <a href="mailto:harik98@uw.edu">harik98@uw.edu</a>
        </div>
        <div className="team-card">
          <img src={require("./images/zach-profile.jpg")} alt="Zach" />
          <h2>Zach Palmer</h2>
          <a href="mailto:zachbhs@uw.edu">zachbhs@uw.edu</a>
        </div>
      </div>
    </Fragment>
  );
}

export default Team;
