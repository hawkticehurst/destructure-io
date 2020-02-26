import React from 'react';
import {useHistory} from "react-router-dom";

/**
 * Required Props:
 * title {String} – String representing the card title
 * description {String} – String representing the card description
 *
 * Optional Props:
 * link {String} - link to module
 */
function CatalogCard(props) {
  const { link, title, description } = props;
  const history = useHistory();

  const onClick = () => {
    if (link) {
      history.push(link);
    }
  };

  const className = link == null ? 'catalog-card coming-soon' : 'catalog-card';

  return (
    <div className={className} onClick={onClick}>
      <h2>{title}</h2>
      <p>{link != null ? description : 'Coming Soon'}</p>
    </div>
  );
}

export default CatalogCard;
