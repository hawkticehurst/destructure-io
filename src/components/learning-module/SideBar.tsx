import React, { useEffect, useState, Fragment } from "react";
import PageTint from "../common/PageTint";
import { useHistory } from "react-router-dom";
import LeftArrowIcon from "./images/arrow-left.svg";
import CloseIcon from "./images/close.svg";

type FixMeLater = any;

/**
 * Required Props:
 * children {React Node} - Content to be contained in the sideBar
 * setSideBarShown {function} - set if the sideBar should be shown
 * sideBarShown {boolean} - true if sideBar is showing, else false
 *
 * Optional Props:
 * headerText {String} - Heading to display for the sidebar
 * summaryLink {String} - Link for clicking header text. i.e. /learn/linked-list
 * isSidebarRight {Boolean} - true ot put sidebar on right side of screen. Defaults false.
 * showBackToSummary {Boolean} - True to add a back to summary page button. False to hide it. Defaults false.
 * hideControlsDivider {Boolean} - True to hide the line under the close button. Defaults false.
 *
 */
type Props = {
  children: JSX.Element;
  setSideBarShown: Function;
  sideBarShown: boolean;
  headerText?: string;
  summaryLink?: string;
  isSidebarRight?: boolean;
  showBackToSummary?: boolean;
  hideControlsDivider?: boolean;
};

function SideBar({
  children,
  headerText,
  summaryLink,
  setSideBarShown,
  sideBarShown,
  isSidebarRight,
  showBackToSummary,
  hideControlsDivider,
}: Props) {
  const history = useHistory();
  const [render, setRender] = useState(sideBarShown);

  useEffect(() => {
    if (sideBarShown) {
      setRender(true);
    }
  }, [sideBarShown]);

  const onAnimationEnd = () => {
    if (!sideBarShown) {
      setRender(false);
    }
  };

  // Don't click on things below the sideBar
  const stopPropagation = (event: FixMeLater) => {
    event.stopPropagation();
  };

  const onClickGoBackSummary = () => {
    if (summaryLink != null) {
      history.push(summaryLink);
    }
  };

  const animationClass = sideBarShown ? "sidebar-fade-in" : "sidebar-fade-out";
  const sidebarRightClass = isSidebarRight === true ? " sidebar-right" : "";
  return render ? (
    <Fragment>
      <PageTint
        clickedTint={() => setSideBarShown(false)}
        tintShown={sideBarShown}
      />
      <div
        className={"sidebar " + animationClass + sidebarRightClass}
        onClick={stopPropagation}
        onAnimationEnd={onAnimationEnd}>
        <div
          className={
            "sidebar-controls" +
            (hideControlsDivider ? " hide-bottom-border" : "")
          }>
          <div className="go-back-summary" onClick={onClickGoBackSummary}>
            {showBackToSummary === true ? (
              <Fragment>
                <img src={LeftArrowIcon} alt="Arrow Left Icon" />
                <p>Back To Module Overview</p>
              </Fragment>
            ) : null}
          </div>
          <img
            className="sidebar-close"
            onClick={() => setSideBarShown(false)}
            src={CloseIcon}
            alt="Close Icon"
          />
        </div>
        {headerText != null ? (
          <h1 className="sidebar-header">{headerText}</h1>
        ) : null}
        {children}
      </div>
    </Fragment>
  ) : null;
}

export default SideBar;
