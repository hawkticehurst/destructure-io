import React from 'react';
import { Link } from 'react-router-dom';
import { doSignOut } from '../../firebase/firebase';
import { useFirebaseUser } from '../../hooks/user';

/**
 * Required Props:
 * toggleSideBar {function} - Callback for toggling the sidebar
 * SubModuleTitle {String} - Title of current submodule
 * navBarType {String} - String representing which version of the navbar to render
 *    Nav Bar Types: 'module', 'homepage', 'catalog'
 */
function NavBar(props) {
  const { toggleSideBar, SubModuleTitle, navBarType } = props;
  const user = useFirebaseUser();

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

  // Using a link here is a bit hacky but makes sure we don't have different styles compared to actual links
  const signOutLink = user != null ? (
    <Link to={window.location.pathname} onClick={doSignOut}>Sign Out</Link>
  ) : null;

  return (
    <div className={containerClass}>
      {backBtn}
      <h1><Link to="/">Node Warrior</Link></h1>
      <div className="nav-links-container">
        {/* TODO: How to dynamically set href? */}
        {navBarLinks.map((link, index) => <Link key={index} to="/">{link}</Link>)}
        {signOutLink}
      </div>
    </div>
  );
}

export default NavBar;
