import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import PageTint from "../common/PageTint";
import useInterval from "../../hooks/useInterval";
import { getApproveCookie } from "../../hooks/useModuleCompletionState";
import { useLocation } from "react-router-dom";

function CookieConsentBanner() {
  // const cookieApprovalStatus = getApproveCookie();
  // const hasApprovedCookies = cookieApprovalStatus === 'true'; // this can return a string, so explicit check false

  // TODO: Maker sure this logic works compared to above
  const hasApprovedCookies = getApproveCookie();
  const [showModal, setShowModal] = useState(false);
  const [showBanner, setShowBanner] = useState(!hasApprovedCookies);
  const [bannerBottom, setBannerBottom] = useState(-150);
  const [speed, setSpeed] = useState(!hasApprovedCookies ? 10 : null);
  const { pathname } = useLocation();
  const [render, setRender] = useState(
    !pathname.startsWith("/signup") &&
      pathname.startsWith("/signin") &&
      !pathname.startsWith("/privacy")
  );

  useInterval(() => {
    setBannerBottom(bannerBottom + 2);
    if (bannerBottom === 20) {
      setSpeed(null);
    }
  }, speed);

  useEffect(() => {
    setRender(
      !pathname.startsWith("/signup") &&
        !pathname.startsWith("/signin") &&
        !pathname.startsWith("/privacy")
    );
  }, [pathname]);

  const setApproveCookie = (value) => {
    const date = new Date();
    date.setTime(date.getTime() + 6 * 30 * 24 * 60 * 60 * 1000); // Expires in 6 months
    document.cookie =
      "destructure-cookie-approve=" +
      value +
      ";expires=" +
      date.toUTCString() +
      ";path=/";
    setShowModal(false);
    setShowBanner(false);
  };

  // sign in / sign up have their own way to enforce cookies
  if (!render) {
    return null;
  }

  return (
    <Fragment>
      {showModal ? (
        <div>
          <PageTint tintShown={true} clickedTint={() => setShowModal(false)} />
          <div className="cookie-deny-modal">
            <h2>Opt Out of Cookies?</h2>
            <p>
              Are you sure you wish to opt-out of non-essential cookies and
              local storage? This will prevent you from saving your progress or
              signing in as you work through our learning modules.
            </p>
            <p>
              Read more about how we use cookies on our{" "}
              <Link to="/privacy" onClick={() => setShowModal(false)}>
                Privacy Policy
              </Link>
              .
            </p>
            <div className="cookie-deny-buttons">
              <button
                className="hero-btn"
                onClick={() => setApproveCookie(false)}>
                <span className="bold">Yes</span> - Opt out of Cookies
              </button>
              <button
                className="hero-btn"
                onClick={() => setApproveCookie(true)}>
                <span className="bold">No</span> - I want these features and
                opt-in to cookies and local storage
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {!showModal && showBanner ? (
        <div className="cookie-consent-banner" style={{ bottom: bannerBottom }}>
          <p>
            This site uses cookies and local web storage to save your progress
            in our learning modules. You can read more about our specific usage
            in our <Link to="/privacy">Privacy Policy</Link>. Do you agree to
            these terms?
          </p>
          <div className="cookie-buttons">
            <button className="hero-btn" onClick={() => setApproveCookie(true)}>
              Accept
            </button>
            <button
              className="hero-btn reject-btn"
              onClick={() => setShowModal(true)}>
              Decline
            </button>
          </div>
        </div>
      ) : null}
    </Fragment>
  );
}

export default CookieConsentBanner;
