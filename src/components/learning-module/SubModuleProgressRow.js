import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

/**
 * Required Props:
 * moduleTitle {String} - Name of the module
 * link {String} - Path to the module. Example: /linked-list/reverse-list
 * completionState {String} - One of "completed", "flagged" or "incomplete". Defaults "incomplete"
 * selected {boolean} - Defaults false. True if is current sub-module
 * completionStateChanged {Function} - Function called when completion state is changed
 *
 * Optional Props:
 * onClickLink {Function} - Function to be called when the link is clicked
 * rowClass - {String} - CSS class for the container
 */
function SubModuleProgressRow(props) {
  const {
    completionState,
    completionStateChanged,
    link,
    moduleTitle,
    selected,
    onClickLink,
    rowClass
  } = props;
  const [isCompleted, setIsCompleted] = useState(completionState);

  useEffect(() => {
    setIsCompleted(completionState);
  }, [completionState]);

  const toggleCompletionState = () => {
    if (isCompleted === 'flagged') {
      completionStateChanged('completed');
      setIsCompleted('completed');
    } else if (isCompleted == null || isCompleted === 'incomplete') {
      completionStateChanged('flagged');
      setIsCompleted('flagged');
    } else {
      completionStateChanged('incomplete');
      setIsCompleted('incomplete');
    }
  };

  const containerClass = selected ? 'sub-module-progress-row-container progress-row-selected' : 'sub-module-progress-row-container';
  const progressIcon = isCompleted === 'flagged' ? '!' : isCompleted === 'completed' ? '✔' : '';
  return (
    <div className={containerClass + (rowClass != null ? (' ' + rowClass) : '')}>
      <div className="progress-circle-filled" onClick={toggleCompletionState}>{progressIcon}</div>
      <div className="sub-module-title-container">
        <Link to={link} onClick={onClickLink}>
          <h3>{moduleTitle}</h3>
        </Link>
      </div>
      <Link to={link} onClick={onClickLink}>
        <button className="summary-module-btn">Start</button>
      </Link>
    </div>
  );
}

export default SubModuleProgressRow;
