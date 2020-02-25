import React, {useEffect, useState, Fragment} from 'react';
import PageTint from '../common/PageTint';

/**
 * Required Props:
 * children {React Node} - Content to be contained in the sideBar
 * headerText {String} - Heading to display for the sidebar
 * setSideBarShown {function} - set if the sideBar should be shown
 * sideBarShown {boolean} - true if sideBar is showing, else false
 */
function SideBar(props) {
  const {children, headerText, setSideBarShown, sideBarShown} = props;
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
  const stopPropagation = (event) => {
    event.stopPropagation();
  };

  const animationClass = sideBarShown ? 'sidebar-fade-in' : 'sidebar-fade-out';
  return (
    render ? (
      <Fragment>
        <PageTint clickedTint={() => setSideBarShown(false)} tintShown={sideBarShown} />
        <div
          className={'sidebar ' + animationClass}
          onClick={stopPropagation}
          onAnimationEnd={onAnimationEnd}>
          <h1 className="sidebar-header">{headerText}</h1>
          {children}
        </div>
      </Fragment>
    ) : null
  );
}

export default SideBar;
