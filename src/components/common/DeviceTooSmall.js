import React from 'react';
import NavBar from './NavBar';
import {Link} from 'react-router-dom';

function DeviceTooSmall() {
  return (
    <div>
      <NavBar navBarType="homepage" />
      <div className="device-too-small">
        <h1>destructure.io Requires A Computer</h1>
        <p>
          In order to properly visualize data structures, we need a larger screen
          than available on mobile devices. To use the product, please visit the
          application from a computer.
        </p>
        <p>
          <Link to="/">Click here to go back home.</Link>
        </p>
      </div>
    </div>
  );
}

export default DeviceTooSmall;
