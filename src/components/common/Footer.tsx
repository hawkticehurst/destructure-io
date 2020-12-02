import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="footer-container">
      <div className="footer-link-container">
        <div className="footer-company-column">
          <h2>Destructure.io</h2>
          <Link to="/about">About</Link>
          <a href="https://github.com/hawkticehurst/destructure-io">Github</a>
        </div>
        <div className="footer-catalog-column">
          <h2>Catalog</h2>
          <div className="footer-catalog-links">
            <Link to="/learn/arrays">Arrays</Link>
            <Link to="/learn/linked-list">Linked Lists</Link>
            <Link to="/learn/stacks">Stacks</Link>
            <Link to="/learn/queues">Queues</Link>
            <Link to="/learn/hash-tables">Hash Tables</Link>
            <Link to="/learn/trees">Trees</Link>
            <Link to="/learn/graphs">Graphs</Link>
          </div>
        </div>
      </div>
      <hr />
      <div className="footer-copyright-container">
        <div>
          <img
            src={require("./images/destructure-icon.svg")}
            alt="Destructure.io Logo"
          />
        </div>
        <p>Copyright © {currentYear} destructure.io</p>
        <div className="footer-legal-container">
          <Link to="/privacy">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
}

export default Footer;
