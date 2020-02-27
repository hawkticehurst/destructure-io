import React from 'react';
import { Link } from 'react-router-dom';
import { doSignOut } from '../../firebase/firebase';
import { useFirebaseUser } from '../../hooks/user';

/**
 * Required Props:
 * toggleSideBar {function} - Callback for toggling the sidebar
 * SubModuleTitle {String} - Title of current submodule
 * navBarType {String} - String representing which version of the navbar to render
 *    Nav Bar Types: 'module', 'homepage', 'catalog', 'sign-in-up'
 */
function NavBar(props) {
  const { toggleSideBar, SubModuleTitle, navBarType } = props;
  const user = useFirebaseUser();

  let containerClass = "nav-bar-container";
  if (navBarType === "homepage" || navBarType === "catalog" || navBarType === "sign-in-up") {
    containerClass += " homepage-nav-bar";
  } else if (navBarType === "module") {
    containerClass += " module-nav-bar";
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
  const signOutLink = user != null && navBarType !== "sign-in-up" ? (
    <Link to={window.location.pathname} onClick={doSignOut}>Log Out</Link>
  ) : null;

  const signInLink = user == null && navBarType !== "sign-in-up" ? (
    <Link to="/signin">Log In</Link>
  ) : null;

  const signUpLink= user == null && navBarType === 'module' ? (
    <Link to="/signup">Sign Up</Link>
  ) : null;

  const getStartedLink = user == null && navBarType === 'homepage' ? (
    <Link to="/signup">Get Started</Link>
  ) : null;

  const catalogLink = ['homepage', 'module', 'sign-in-up'].includes(navBarType) ? (
    <Link to="/learn">Catalog</Link>
  ) : null;

  return (
    <div className={containerClass}>
      {backBtn}
      <h1><Link to="/">Node Warrior</Link></h1>
      <div className="nav-links-container">
        {getStartedLink}
        {catalogLink}
        {signInLink}
        {signUpLink}
        {signOutLink}
      </div>
    </div>
  );
}

export default NavBar;
