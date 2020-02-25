import React from 'react';

/**
 * Required Props:
 * brandTitle {string} - String representing the website brand name
 * toggleSideBar {function} - Callback for toggling the sidebar
 * SubModuleTitle {String} - Title of current submodule
 */
function NavBar(props) {
  const { brandTitle, toggleSideBar, SubModuleTitle } = props;

  return (
    <div className="nav-bar-container">
      <div className="nav-back-btn">
        <svg className="hamburger-icon" onClick={toggleSideBar}>
          <use xlinkHref="/website-icons.svg#hamburger-icon"></use>
        </svg>
        <p>{SubModuleTitle}</p>
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
