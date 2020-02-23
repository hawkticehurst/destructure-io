import React from 'react';

/**
 * Required Props:
 * navBarType {String} - String representing which version of the navbar to render
 *    Nav Bar Types: 'module', 'homepage', 'catalog', and (??)
 * 
 * TODO: Include props for other nav bar information/links
 */
function NavBar(props) {
  const { navBarType } = props;

  let navBackBtn = undefined;
  let navBarContainer = "nav-bar-container";
  const navBarLinks = [];

  if (navBarType === "homepage") {
    navBackBtn = "hidden";
    navBarContainer += " homepage-nav-bar";
    navBarLinks.push("Log In");
    navBarLinks.push("Get Started");
  } else if (navBarType === "module") {
    navBackBtn = "nav-back-btn";
    navBarContainer += " module-nav-bar";
    navBarLinks.push("Account");
  } else if (navBarType === "catalog") {
    navBackBtn = "hidden";
    navBarContainer += " homepage-nav-bar";
    navBarLinks.push("Catalog");
    navBarLinks.push("Account");
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
        {/* TODO: How to dynamically set href? */}
        {navBarLinks.map((link, index) => <a key={index} href={"/"}>{link}</a>)}
        {/* <div className="user-account-circle"></div> */}
      </div>
    </div>
  );
}

export default NavBar;
