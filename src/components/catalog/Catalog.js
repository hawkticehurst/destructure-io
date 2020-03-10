import React from 'react';
import CatalogCard from './CatalogCard';
import NavBar from '../common/NavBar';
import Footer from '../common/Footer';

function Catalog(props) {
  return (
    <div className="catalog-page">
      <NavBar navBarType="catalog" />
      <div className="catalog-hero-container">
        <h1>Content Catalog</h1>
        <p>Discover a whole new way of approaching data structures.</p>
        <hr />
      </div>
      <div className="catalog-card-container">
        <CatalogCard title="Learn Arrays" description="Learn one of the most fundamental data structures in computer science." />
        <CatalogCard title="Learn Nodes" description="Learn one of the most fundamental data structures in computer science." />
        <CatalogCard link="/learn/linked-list" title="Learn Linked Lists" description="Learn one of the most fundamental data structures in computer science." />
        <CatalogCard title="Learn Stacks" description="Learn one of the most fundamental data structures in computer science." />
        <CatalogCard title="Learn Queues" description="Learn one of the most fundamental data structures in computer science." />
        <CatalogCard title="Learn Maps" description="Learn one of the most fundamental data structures in computer science." />
        <CatalogCard title="Learn Trees" description="Learn one of the most fundamental data structures in computer science." />
        <CatalogCard title="Learn Graphs" description="Learn one of the most fundamental data structures in computer science." />
      </div>
      <hr />
      <Footer />
    </div>
  );
}

export default Catalog;
