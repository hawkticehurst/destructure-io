import React from 'react';
import NavBar from '../common/NavBar';
import Footer from '../common/Footer';
import LinkedList from './LinkedList';
import GuidedLearning from './GuidedLearning';
import Catalog from './Catalog';
import Free from './Free';
import Hero from './Hero';

function HomePage() {
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
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;
