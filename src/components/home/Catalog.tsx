import React, { Fragment } from "react";

function Catalog() {
  return (
    <Fragment>
      <div className="img-container left-image catalog-card-container-homepage">
        <div className="catalog-card-homepage">
          <div className="card-circle" />
          <h2>Linked Lists</h2>
        </div>
        <div className="catalog-card-homepage">
          <div className="card-circle" />
          <h2>Arrays</h2>
        </div>
        <div className="catalog-card-homepage">
          <div className="card-circle" />
          <h2>Stacks</h2>
        </div>
        <div className="catalog-card-homepage">
          <div className="card-circle" />
          <h2>Queues</h2>
        </div>
        <div className="catalog-card-homepage">
          <div className="card-circle" />
          <h2>Trees</h2>
        </div>
        <div className="catalog-card-homepage">
          <div className="card-circle" />
          <h2>Graphs</h2>
        </div>
      </div>
      <div className="text-container">
        <h1>A growing catalog of content.</h1>
        <p>
          We are committed to covering the basics of computer science data
          structures. You can look forward to modules ranging from Linked Lists
          to Heaps and everything in between.
        </p>
      </div>
    </Fragment>
  );
}

export default Catalog;
