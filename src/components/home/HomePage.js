import React from 'react';
import NavBar from '../common/NavBar';
import LinkedList from './LinkedList';
import GuidedLearning from './GuidedLearning';
import Catalog from './Catalog';
import Free from './Free';
import Team from './Team';
import Hero from './Hero';

function HomePage(props) {
  return (
    <div>
      <NavBar navBarType="homepage" />
      <main>
        <Hero />
        <div id="linked-list" className="content-container">
          <LinkedList />
        </div>
        <div id="guided-container" className="content-container">
          <GuidedLearning />
        </div>
        <div id="catalog-container" className="content-container">
          <Catalog />
        </div>
        <div id="free-container" className="content-container">
          <Free />
        </div>
        <div className="team-container">
          <Team />
        </div>
      </main>
      <footer>
        <p>
          This project is a part of the 2020{" "}
          <a target="_blank" rel="noopener noreferrer" href="https://ischool.uw.edu/capstone">
            Capstone Project
          </a>
          course at the University of Washington Information School.
        </p>
      </footer>
    </div>
  );
}

export default HomePage;
