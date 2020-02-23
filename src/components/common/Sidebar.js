import React, {useEffect, useState, Fragment} from 'react';
import PageTint from './PageTint';

/**
 * Required Props:
 * content {React Node} - Content to be contained in the sidebar
 * setSidebarShown {function} - set if the sidebar should be shown
 * sidebarShown {boolean} - true if sidebar is showing, else false
 */
function Sidebar(props) {
  const {content, setSidebarShown, sidebarShown} = props;
  const [render, setRender] = useState(sidebarShown);

  useEffect(() => {
    if (sidebarShown) {
      setRender(true);
    }
  }, [sidebarShown]);

  const onAnimationEnd = () => {
    if (!sidebarShown) {
      setRender(false);
    }
  };

  // Don't click on things below the sidebar
  const stopPropagation = (event) => {
    event.stopPropagation();
  };

  return (
    render ? (
      <Fragment>
        <PageTint clickedTint={() => setSidebarShown(false)} tintShown={sidebarShown} />
        <div
          className="sidebar"
          style={{ animation: `${sidebarShown ? "sidebarFadeIn" : "sidebarFadeOut"} .5s` }}
          onClick={stopPropagation}
          onAnimationEnd={onAnimationEnd}>
            {content}
        </div>
      </Fragment>
    ) : null
  );
}

export default Sidebar;
