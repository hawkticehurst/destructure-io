import React, { useState, useEffect } from 'react';
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
  const { code, language, lineNumberStart, isHidden, selectedLine } = props;
  const [isCollapsed, setIsCollapsed] = useState(isHidden);
  const [maxHeight, setMaxHeight] = useState(null);

  useEffect(() => {
    const calcHeight = () => {
      return document.querySelector('.code-content').offsetHeight;
    };

    const setMaxHeightOneLine = () => {
      setMaxHeight(calcHeight());
    };

    if (isCollapsed) {
      setMaxHeightOneLine();
      window.addEventListener("resize", setMaxHeightOneLine);
    } else if (code.length > 1) {
      window.removeEventListener("resize", setMaxHeightOneLine);
      setMaxHeight(calcHeight() * code.length);
    }

    return () => {
      window.removeEventListener("resize", setMaxHeightOneLine);
    };
  }, [isCollapsed, code.length]);

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
            tooltip={lineData.tooltip}
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

  const style = maxHeight != null ? {
    maxHeight
  } : null;
  return (
    <div className={className} style={style}>
      {codeLines}
    </div>
  );

}

export default CodeChunk;
