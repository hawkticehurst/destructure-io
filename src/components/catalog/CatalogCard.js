import React from 'react';

/**
 * Required Props:
 * cardTitle {String} – String representing the card title
 * cardDescription {String} – String representing the card description
 */
function CatalogCard(props) {
  const { cardTitle, cardDescription } = props;

  return (
    <div className="catalog-card">
      <h2>{cardTitle}</h2>
      <p>{cardDescription}</p>
    </div>
  );
}

export default CatalogCard;