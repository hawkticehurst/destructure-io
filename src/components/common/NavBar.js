import React from 'react';

/**
 * Required Props:
 * brandTitle {string} - String representing the website brand name
 * toggleSideBar {function} - Callback for toggling the sidebar
 * TODO: Include other nav bar links
 */
function NavBar(props) {
  const { brandTitle, toggleSideBar } = props;

  return (
    <div className="nav-bar-container">
      <div className="nav-back-btn">
        <svg className="hamburger-icon" onClick={toggleSideBar}>
          <use xlinkHref="/website-icons.svg#hamburger-icon"></use>
        </svg>
        <p>3. Linked List Insertion</p>
      </div>
      <h1><a href="/">{brandTitle}</a></h1>
      <div className="nav-links-container">
        {/* <div className="user-account-circle"></div> */}
        <a href="/">Account</a>
      </div>
    </div>
  );
}

export default NavBar;
