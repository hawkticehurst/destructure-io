import React from 'react';

/**
 * Required Props:
 * navBarType {String} - String representing which version of the navbar to render
 *    Nav Bar Types: 'module', 'homepage', 'landing', and (??)
 * 
 * TODO: Include props for other nav bar information/links
 */
function NavBar(props) {
  const { navBarType } = props;

  let navBackBtn = undefined;
  let navBarContainer = "nav-bar-container";

  if (navBarType == "module") {
    navBackBtn = "nav-back-btn";
    navBarContainer += " module-nav-bar";
  } else if (navBarType == "homepage") {
    navBackBtn = "hidden";
    navBarContainer += " homepage-nav-bar";
  }

  return (
    <div className={navBarContainer}>
      <div className={navBackBtn}>
        <svg className="hamburger-icon">
          <use xlinkHref="/website-icons.svg#hamburger-icon"></use>
        </svg>
        <a href="/">3. Linked List Insertion</a>
      </div>
      <h1><a href="/">Node Warrior</a></h1>
      <div className="nav-links-container">
        {/* <div className="user-account-circle"></div> */}
        <a href="/">Account</a>
      </div>
    </div>
  );
}

export default NavBar;
