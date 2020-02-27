import React, {useState} from 'react';
import {Link} from 'react-router-dom';

/**
 * Required Props:
 * moduleTitle {String} - Name of the module
 * link {String} - Path to the module. Example: /linked-list/reverse-list
 *
 * Optional Props:
 * completionState {String} - One of "completed", "flagged" or "incomplete". Defaults "incomplete"
 * selected {boolean} - Defaults false. True if is current sub-module
 * onClickLink {Function} - Function to be called when the link is clicked
 * completionStateChanged {Function} - Function called when completion state is changed
 */
function SubModuleProgressRow(props) {
  const {completionState, completionStateChanged, link, moduleTitle, selected, onClickLink} = props;
  const [isCompleted, setIsCompleted] = useState(completionState);

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
    <div className={containerClass}>
      <div className="progress-circle-filled" onClick={toggleCompletionState}>{progressIcon}</div>
      <div className="sub-module-title-container">
        <Link to={link} onClick={onClickLink}>
          <p>{moduleTitle}</p>
        </Link>
      </div>
    </div>
  );
}

export default SubModuleProgressRow;
