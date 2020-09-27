import React from 'react';
import NavBar from '../common/NavBar';
import Footer from '../common/Footer';
import Team from './Team';

function About() {
  return (
    <div>
      <NavBar navBarType="homepage" />
      <main>
        <div className="team-container">
          <div className="about-text-container">
            <h1>What's this for?</h1>
            <p>
              Data structures are notoriously challenging programming concepts for students who are trying to learn to code.
              We want to help develop strong mental models of data structures and increase a student's ability to succeed in technical challenges.
            </p>
          </div>
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
      <Footer githubLink={true} />
    </div>
  );
}

export default About;