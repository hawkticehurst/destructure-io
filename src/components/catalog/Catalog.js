import React from 'react';
import CatalogCard from './CatalogCard';
import NavBar from '../common/NavBar';

function Catalog(props) {
  return (
    <div>
      <NavBar navBarType="catalog" />
      <div className="catalog-hero-container">
        <h1>Content Catalog</h1>
        <p>Discover a whole new way of approaching data structures.</p>
        <hr />
      </div>
      <div className="catalog-card-container">
        <CatalogCard cardTitle="Learn Nodes" cardDescription="Learn one of the most fundamental data structures in computer science." />
        <CatalogCard cardTitle="Learn Linked Lists" cardDescription="Learn one of the most fundamental data structures in computer science." />
        <CatalogCard cardTitle="Learn Arrays" cardDescription="Learn one of the most fundamental data structures in computer science." />
        <CatalogCard cardTitle="Learn Stacks" cardDescription="Learn one of the most fundamental data structures in computer science." />
        <CatalogCard cardTitle="Learn Queues" cardDescription="Learn one of the most fundamental data structures in computer science." />
        <CatalogCard cardTitle="Learn Hash-Maps" cardDescription="Learn one of the most fundamental data structures in computer science." />
        <CatalogCard cardTitle="Learn Trees" cardDescription="Learn one of the most fundamental data structures in computer science." />
        <CatalogCard cardTitle="Learn Graphs" cardDescription="Learn one of the most fundamental data structures in computer science." />
        <CatalogCard cardTitle="Learn Heaps" cardDescription="Learn one of the most fundamental data structures in computer science." />
      </div>
    </div>
  );
}

export default Catalog;
