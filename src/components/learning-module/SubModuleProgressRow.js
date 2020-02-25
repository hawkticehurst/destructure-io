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
 */
function SubModuleProgressRow(props) {
  const {completionState, link, moduleTitle, selected, onClickLink} = props;
  const [isCompleted, setIsCompleted] = useState(completionState);

  // TODO this needs to also toggle in Firebase or somewhere we store completion state
  const toggleCompletionState = () => {
    if (isCompleted === 'flagged') {
      setIsCompleted('completed');
    } else if (isCompleted === 'incomplete') {
      setIsCompleted('flagged');
    } else {
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
