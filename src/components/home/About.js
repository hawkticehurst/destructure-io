import React from 'react';
import NavBar from '../common/NavBar';
import Footer from '../common/Footer';
import Team from './Team';

function About(props) {
  return (
    <div>
      <NavBar navBarType="homepage" />
      <main>
        <div className="team-container">
          <div className="about-text-container">
            <h1>Who's this for?</h1>
            <p>
              We hope this will be a useful educational aid for those learning programming at an intermediate level 
              and for instructors to use as supplementary material for data structures courses.
            </p>
          </div>
        </div>
        <div className="team-container">
          <Team />
        </div>
      </main>
      <Footer landing={true} />
    </div>
  );
}

export default About;