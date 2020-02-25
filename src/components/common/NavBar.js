import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Required Props:
 * navBarType {String} - String representing which version of the navbar to render
 *    Nav Bar Types: 'module', 'homepage', 'catalog'
 *
 * TODO: Include props for other nav bar information/links
 */
function NavBar(props) {
  const { navBarType } = props;

  let containerClass = "nav-bar-container";
  const navBarLinks = [];

  if (navBarType === "homepage") {
    containerClass += " homepage-nav-bar";
    navBarLinks.push("Log In");
    navBarLinks.push("Get Started");
  } else if (navBarType === "module") {
    containerClass += " module-nav-bar";
    navBarLinks.push("Account");
  } else if (navBarType === "catalog") {
    containerClass += " homepage-nav-bar";
    navBarLinks.push("Catalog");
    navBarLinks.push("Account");
  }

  const backBtn = navBarType === "module" ? (
    <div className="nav-back-btn">
      <svg className="hamburger-icon">
        <use xlinkHref="/website-icons.svg#hamburger-icon"></use>
      </svg>
      <a href="/">3. Linked List Insertion</a>
    </div>
  ) : null;

  return (
    <div className={containerClass}>
      {backBtn}
      <h1><Link to="/">Node Warrior</Link></h1>
      <div className="nav-links-container">
        {/* TODO: How to dynamically set href? */}
        {navBarLinks.map((link, index) => <Link key={index} to="/">{link}</Link>)}
      </div>
    </div>
  );
}

export default NavBar;
