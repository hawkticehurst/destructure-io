import React, { Fragment, useState } from 'react';

function LinkedList() {
  const [highlightIndex, setHighlightIndex] = useState(0);
  const NUM_NODES = 5;

  const prevNode = () => {
    if (highlightIndex === 0) {
      setHighlightIndex(NUM_NODES - 1);
    } else {
      setHighlightIndex(highlightIndex - 1);
    }
  };

  const nextNode = () => {
    if (highlightIndex === NUM_NODES - 1) {
      setHighlightIndex(0);
    } else {
      setHighlightIndex(highlightIndex + 1);
    }
  };

  return (
    <Fragment>
      <div className="img-container left-image">
        <div className="linked-list-illustration-container">
          {
            [...Array(NUM_NODES)].map((_, i) =>  {
              const nodeClass = i === highlightIndex ? 'linked-list-node linked-list-highlight' : 'linked-list-node';
              return (
                <Fragment key={i}>
                  <div className={nodeClass}>{i + 1}</div>
                  {i < NUM_NODES -1 ? <div className="linked-list-pointer" /> : null}
                </Fragment>
              );
            })
          }
        </div>
        <div className="linked-list-controls">
          <button
            onClick={prevNode}
            className="hero-btn linked-list-btn">
            Prev Node
          </button>
          <button
            onClick={nextNode}
            className="hero-btn linked-list-btn">
            Next Node
          </button>
        </div>
      </div>
      <div className="text-container">
        <h1>Data structures visualized.</h1>
        <p>
          Develop clear mental models of common computer science data
          structures using intuitive animations and visualizations.
        </p>
      </div>
    </Fragment>
  );
}

export default LinkedList;
