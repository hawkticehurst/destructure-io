import React, {useState} from 'react';
import CodeLine from './CodeLine';

/**
 * Required Props:
 * code {Object} - The chunk of codes data as described in CodeDisplay.js
 * language {String} - "java", "javascript", etc
 * lineNumberStart {number} - the first line number in the code
 *
 * Optional Props:
 * isHidden {Boolean} - Defaults to false, if true it shows as "grayed out"
 * selectedLine {number} - Number of selected line. If undefined or -1 is passed, no lines are selected
 */
function CodeChunk(props) {
  const {code, language, lineNumberStart, isHidden, selectedLine} = props;
  const [isCollapsed, setIsCollapsed] = useState(isHidden);

  const codeLines = code.map((lineData, index) => {
    const lineNumber = index + lineNumberStart;
    return <CodeLine
            language={language}
            code={lineData.given}
            lineNumber={lineNumber}
            onChevronClick={index === 0 ? () => setIsCollapsed(!isCollapsed) : null}
            isCollapsed={isCollapsed}
            isHidden={isHidden}
            isSelected={selectedLine === lineNumber}
            key={index} />
  });

  let className = "chunk";
  if (isCollapsed) {
    className += " chunk-collapsed";
  } else {
    className += " chunk-open"
  }
  if (isHidden) {
    className += " hidden-chunk";
  }

  return (
    <div className={className}>
      {codeLines}
    </div>
  );

}

export default CodeChunk;
