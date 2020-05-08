import React from 'react';
import LandingNavBar from '../common/LandingNavBar';
import Footer from '../common/Footer';
import LinkedList from './LinkedList';
import GuidedLearning from './GuidedLearning';
import Catalog from './Catalog';
import Free from './Free';
import Team from './Team';

function About(props) {
  return (
    <div>
      <LandingNavBar about={true} />
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