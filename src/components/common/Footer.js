import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Required Props:
 * toggleSideBar {function} - Callback for toggling the sidebar
 * SubModuleTitle {String} - Title of current submodule
 * navBarType {String} - String representing which version of the navbar to render
 *    Nav Bar Types: 'summary', 'module', 'homepage', 'catalog', 'sign-in', 'sign-up'
 */
function Footer(props) {
  const { landing } = props;

  let privacy = <Link to="/privacy">Privacy Policy</Link>;
    
  
  if (landing) {
    privacy = <a href="https://github.com/hawkticehurst/destructure-io" target="_blank">Open sourced on May 22nd, 2020.</a>;
  }

  return (
    <div className="footer-container">
      {/* <div className="footer-link-container">
        <div className="footer-company-column">
          <h2>destructure.io</h2>
          <Link to="/">About</Link>
          <Link to="/">Contact Us</Link>
        </div>
        <div className="footer-catalog-column">
          <h2>Catalog</h2>
          <div className="footer-catalog-links">
            <Link to="/learn">Arrays</Link>
            <Link to="/learn">Nodes</Link>
            <Link to="/learn/linked-list">Linked Lists</Link>
            <Link to="/learn">Stacks</Link>
            <Link to="/learn">Queues</Link>
            <Link to="/learn">Maps</Link>
            <Link to="/learn">Trees</Link>
            <Link to="/learn">Graphs</Link>
          </div>
        </div>
      </div> */}
      {/* <hr /> */}
      <div className="footer-copyright-container">
        <div>
          <img src={require('./images/destructure-icon.svg')} alt="Destructure.io Logo" />
        </div>
        <p>Copyright © 2020 destructure.io</p>
        <div className="footer-legal-container">
          {privacy}
        </div>
      </div>
    </div>
  );
}

export default Footer;
