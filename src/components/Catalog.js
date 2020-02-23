import React from 'react';
import CatalogCard from './common/CatalogCard';

/**
 * Required Props:
 * navBar {React Component} – Component representing the page nav bar
 */
function Catalog(props) {
  const { navBar } = props;

  return (
    <div>
      {navBar}
      <div className="catalog-hero-container">
        <h1>Content Catalog</h1>
        <p>Discover a whole new way of approaching data structures.</p>
        <hr />
      </div>
      <div className="catalog-card-container">
        <CatalogCard cardTitle="Linked Lists" cardDescription="Learn one of the most fundamental data structures in computer science." />
      </div>
    </div>
  );
}

export default Catalog;