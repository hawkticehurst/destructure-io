import React from 'react';

/**
 * Required Props:
 * navBar {React Component} – Component representing the page nav bar
 */
function UserHomePage(props) {
  const { navBar } = props;

  return (
    <div>
      {navBar}
    </div>
  );
}

export default UserHomePage;