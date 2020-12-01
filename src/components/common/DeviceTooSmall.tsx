import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import { Link } from "react-router-dom";

function DeviceTooSmall() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (windowWidth > 768) {
      window.location.reload();
    }
  }, [windowWidth]);

  const updateSize = () => {
    setWindowWidth(window.innerWidth);
  };

  return (
    <div>
      <NavBar navBarType="homepage" />
      <div className="device-too-small">
        <h1>Sorry, destructure.io requires a computer.</h1>
        <p>
          To properly visualize data structures, we need a larger screen than
          available on mobile devices. Please visit the application from a
          computer.
        </p>
        <p>
          <Link to="/">Back to home.</Link>
        </p>
      </div>
    </div>
  );
}

export default DeviceTooSmall;
