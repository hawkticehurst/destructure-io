import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";

type FixMeLater = any;

/**
 * Required Props:
 * completionState {String} - One of "completed", "flagged" or "incomplete". Defaults "incomplete"
 * completionStateChanged {Function} - Function called when completion state is changed
 * link {String} - Path to the module. Example: /linked-list/reverse-list
 * moduleTitle {String} - Name of the module
 * selected {boolean} - Defaults false. True if is current sub-module
 * shouldShowStartBtn {Boolean} - Defaults false. True should be used when on summary page.
 *
 * Optional Props:
 * onClickLink {Function} - Function to be called when the link is clicked
 * rowClass - {String} - CSS class for the container
 */
type Props = {
  completionState: String;
  completionStateChanged: Function;
  link: string;
  moduleTitle: string;
  selected: boolean;
  shouldShowStartBtn: boolean;
  onClickLink?: FixMeLater;
  rowClass?: string;
};

function SubModuleProgressRow({
  completionState,
  completionStateChanged,
  link,
  moduleTitle,
  selected,
  shouldShowStartBtn,
  onClickLink,
  rowClass,
}: Props) {
  const [isCompleted, setIsCompleted] = useState(completionState);
  const history = useHistory();

  useEffect(() => {
    setIsCompleted(completionState);
  }, [completionState]);

  const toggleCompletionState = () => {
    if (isCompleted === "flagged") {
      completionStateChanged("completed");
      setIsCompleted("completed");
    } else if (isCompleted == null || isCompleted === "incomplete") {
      completionStateChanged("flagged");
      setIsCompleted("flagged");
    } else {
      completionStateChanged("incomplete");
      setIsCompleted("incomplete");
    }
  };

  const onClickContainer = () => {
    if (!shouldShowStartBtn) {
      history.push(link);
      if (onClickLink) {
        onClickLink();
      }
    }
  };

  const containerClass = selected
    ? "sub-module-progress-row-container progress-row-selected"
    : "sub-module-progress-row-container";
  const exclamationIcon = (
    <img src={require("./images/exclamation.svg")} alt="Exclamation Icon" />
  );
  const checkmarkIcon = (
    <img src={require("./images/checkmark.svg")} alt="Checkmark Icon" />
  );
  const progressIcon =
    isCompleted === "flagged"
      ? exclamationIcon
      : isCompleted === "completed"
      ? checkmarkIcon
      : "";
  return (
    <div className={containerClass + (rowClass != null ? " " + rowClass : "")}>
      <div className="progress-circle-filled" onClick={toggleCompletionState}>
        {progressIcon}
      </div>
      <div className="sub-module-title-container" onClick={onClickContainer}>
        <h3>
          <Link to={link} onClick={onClickLink}>
            {moduleTitle}
          </Link>
        </h3>
      </div>
      {shouldShowStartBtn ? (
        <Link to={link} onClick={onClickLink}>
          <button className="summary-module-btn">Start</button>
        </Link>
      ) : null}
    </div>
  );
}

export default SubModuleProgressRow;
