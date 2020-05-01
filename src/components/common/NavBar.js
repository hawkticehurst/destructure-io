import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doSignOut } from '../../firebase/firebase';
import { useFirebaseUser } from '../../hooks/user';
import SignInUpInputs from '../auth/SignInUpInputs';

/**
 * Required Props:
 * toggleSideBar {function} - Callback for toggling the sidebar
 * SubModuleTitle {String} - Title of current submodule
 * navBarType {String} - String representing which version of the navbar to render
 *    Nav Bar Types: 'summary', 'module', 'homepage', 'catalog', 'sign-in', 'sign-up'
 */
function NavBar(props) {
  const { toggleSideBar, SubModuleTitle, navBarType } = props;
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const user = useFirebaseUser();

  useEffect(() => {
    const onClickPageShouldCloseLogin = (event) => {
      if (showLoginDropdown &&
          event.path.find(el => el.classList != null &&
          el.classList.contains('sign-in-dropdown')) == null) {
          setShowLoginDropdown(false);
      }
    };

    if (showLoginDropdown) {
      document.addEventListener('click', onClickPageShouldCloseLogin);
    }
    return () => document.removeEventListener('click', onClickPageShouldCloseLogin);
  }, [showLoginDropdown]);

  let containerClass = "nav-bar-container";
  if (['homepage', 'catalog', 'sign-in', 'sign-up'].includes(navBarType)) {
    containerClass += " homepage-nav-bar";
  } else if (navBarType === "module") {
    containerClass += " module-nav-bar";
  }

  const backBtn = navBarType === "module" ? (
    <div className="nav-back-btn">
      <svg className="hamburger-icon" onClick={toggleSideBar}>
        <use xlinkHref="/website-icons.svg#hamburger-icon"></use>
      </svg>
      <p onClick={toggleSideBar}>{SubModuleTitle}</p>
    </div>
  ) : null;

  // Using a link here is a bit hacky but makes sure we don't have different styles compared to actual links
  const signOutLink = user != null ? (
    <Link to={window.location.pathname} onClick={doSignOut}>Log Out</Link>
  ) : null;

  const signInLink = user == null ? navBarType === 'module' ? (
    <Link to={window.location.pathname} onClick={() => setShowLoginDropdown(!showLoginDropdown)}>Log In</Link>
  ) : <Link to="/signin">Log In</Link> : null;

  const signUpLink = user == null ? (
    <Link to="/signup">Sign Up</Link>
  ) : null;

  const catalogLink = <Link to="/learn">Catalog</Link>;

  return (
    <div className={containerClass}>
      {showLoginDropdown ? (
        <div className="sign-in-dropdown">
          <SignInUpInputs isSignIn={true} onSignIn={() => setShowLoginDropdown(false)} />
        </div>
      ) : null}
      {backBtn}
      <h1><Link to="/">destructure.io</Link></h1>
      <div className="nav-links-container">
        {catalogLink}
        {signInLink}
        {signUpLink}
        {signOutLink}
      </div>
    </div>
  );
}

export default NavBar;
