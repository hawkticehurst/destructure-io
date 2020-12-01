import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { doSignOut } from "../../firebase/firebase";
import { useFirebaseUser } from "../../hooks/user";
import SignInUpInputs from "../auth/SignInUpInputs";

type FixMeLater = any;

// TODO: Potentially create a type or interface for the specific navBarType
//       strings defined in the comment below

/**
 * Required Props:
 * toggleSideBar {function} - Callback for toggling the sidebar
 * subModuleTitle {String} - Title of current submodule
 * navBarType {String} - String representing which version of the navbar to render
 *    Nav Bar Types: 'summary', 'module', 'homepage', 'catalog', 'sign-in', 'sign-up'
 */
type Props = {
  toggleSideBar?: FixMeLater;
  subModuleTitle?: string;
  navBarType: string;
};

function NavBar({ toggleSideBar, subModuleTitle, navBarType }: Props) {
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const user = useFirebaseUser();

  useEffect(() => {
    const onClickPageShouldCloseLogin = (event: FixMeLater) => {
      if (
        showLoginDropdown &&
        event.path.find(
          (el: FixMeLater) =>
            el.classList != null && el.classList.contains("sign-in-dropdown")
        ) == null
      ) {
        setShowLoginDropdown(false);
      }
    };

    if (showLoginDropdown) {
      document.addEventListener("click", onClickPageShouldCloseLogin);
    }
    return () =>
      document.removeEventListener("click", onClickPageShouldCloseLogin);
  }, [showLoginDropdown]);

  let containerClass = "nav-bar-container";
  if (["homepage", "catalog", "sign-in", "sign-up"].includes(navBarType)) {
    containerClass += " homepage-nav-bar";
  } else if (navBarType === "module") {
    containerClass += " module-nav-bar";
  }

  const backBtn =
    navBarType === "module" ? (
      <div className="nav-back-btn">
        <svg className="hamburger-icon" onClick={toggleSideBar}>
          <use xlinkHref="/website-icons.svg#hamburger-icon"></use>
        </svg>
        <p onClick={toggleSideBar}>{subModuleTitle}</p>
      </div>
    ) : null;

  // Using a link here is a bit hacky but makes sure we don't have different styles compared to actual links
  const signOutLink =
    user != null ? (
      <Link to={window.location.pathname} onClick={doSignOut}>
        Log Out
      </Link>
    ) : null;

  const signInLink =
    user == null ? (
      navBarType === "module" ? (
        <Link
          to={window.location.pathname}
          onClick={() => setShowLoginDropdown(!showLoginDropdown)}>
          Sign In
        </Link>
      ) : (
        <Link to="/signin">Sign In</Link>
      )
    ) : null;

  const signUpLink = user == null ? <Link to="/signup">Sign Up</Link> : null;

  const catalogLink = <Link to="/learn">Catalog</Link>;

  const aboutLink = <Link to="/about">About</Link>;

  return (
    <div className={containerClass}>
      {showLoginDropdown ? (
        <div className="sign-in-dropdown">
          <SignInUpInputs
            isSignIn={true}
            onSignIn={() => setShowLoginDropdown(false)}
          />
        </div>
      ) : null}
      {backBtn}
      <h1>
        <Link to="/">destructure.io</Link>
      </h1>
      <div className="nav-links-container">
        {aboutLink}
        {catalogLink}
        {signInLink}
        {signUpLink}
        {signOutLink}
      </div>
    </div>
  );
}

export default NavBar;
