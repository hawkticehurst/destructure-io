import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Required Props:
 * brandTitle {string} - String representing the website brand name
 * toggleSideBar {function} - Callback for toggling the sidebar
 * SubModuleTitle {String} - Title of current submodule
 * navBarType {String} - String representing which version of the navbar to render
 *    Nav Bar Types: 'module', 'homepage', 'catalog'
 */
function NavBar(props) {
  const { brandTitle, toggleSideBar, SubModuleTitle, navBarType } = props;

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
    <div className="nav-back-btn" onClick={toggleSideBar}>
      <svg className="hamburger-icon">
        <use xlinkHref="/website-icons.svg#hamburger-icon"></use>
      </svg>
      <p>{SubModuleTitle}</p>
    </div>
  ) : null;

  return (
    <div className={containerClass}>
      {backBtn}
      <h1><Link to="/">{brandTitle}</Link></h1>
      <div className="nav-links-container">
        {/* TODO: How to dynamically set href? */}
        {navBarLinks.map((link, index) => <Link key={index} to="/">{link}</Link>)}
      </div>
    </div>
  );
}

export default NavBar;
