import React, {useState} from 'react';
import CodeHighlight from './CodeHighlight';

/**
 * Required Props:
 * code {String} - The line of code, i.e. "int x = 5"
 * language {String} - "java", "javascript", etc
 * lineNumber {number} - the line number in the code
 *
 * Optional Props:
 * onChevronClick {function} - Function called when chevron is clicked. If not present, no chevron
 * isCollapsed {Boolean} - Defaults to false
 * isHidden {Boolean} - Defaults to false, if true it shows as "grayed out". Must be true for chevron
 */
function CodeLine(props) {
  const {code, language, lineNumber, isCollapsed, onChevronClick, isHidden} = props;
  const [codeEllipses, setCodeEllipses] = useState(onChevronClick != null && isHidden && isCollapsed ? '...}' : '');

  const clickChevron = () => {
    if (codeEllipses === '') {
      setTimeout(() => setCodeEllipses('...}'), 500);
    } else {
      setCodeEllipses('');
    }
    onChevronClick();
  };

  const chevron = onChevronClick != null && isHidden ?
  <span
    className={isCollapsed ? "chevron right" : "chevron bottom"}
    onClick={clickChevron} />
  : null;

  return (
    <div className="code-line">
      <div className="line-number">
        {lineNumber}
      </div>
      {chevron}
      <div className="code-content">
        <CodeHighlight isHidden={isHidden} language={language}>
          {code + codeEllipses}
        </CodeHighlight>
      </div>
    </div>
  );
}

export default CodeLine;
