import React from 'react';
import LandingNavBar from '../common/LandingNavBar';
import Footer from '../common/Footer';
import LinkedList from './LinkedList';
import GuidedLearning from './GuidedLearning';
import Catalog from './Catalog';
import Free from './Free';
import Hero from './Hero';

function LandingPage() {
  return (
    <div>
      <LandingNavBar about={false} />
      <main>
        <Hero landing={true} />
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
          <Free landing={true} />
        </div>
      </main>
      <Footer landing={true} />
    </div>
  );
}

export default LandingPage;
