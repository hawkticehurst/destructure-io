import React from 'react';
import NavBar from './NavBar';
import { Link } from 'react-router-dom';

function PageNotFound() {
  return (
    <div>
      <NavBar navBarType="homepage" />
      <div className="page-not-found">
        <h1>Oops!</h1>
        <p>We can't find the page you are looking for.</p>
        <p>
          <Link to="/">Click here to go back home.</Link>
        </p>
      </div>
    </div>
  );
}

export default PageNotFound;
