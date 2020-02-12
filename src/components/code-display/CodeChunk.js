import React from 'react';
import CodeLine from './CodeLine';

/**
 * Required Props:
 * code {Object} - The chunk of codes data as described in CodeDisplay.js
 * language {String} - "java", "javascript", etc
 * lineNumberStart {number} - the first line number in the code
 *
 * Optional Props:
 * isHidden {Boolean} - Defaults to false, if true it shows as "grayed out"
 */
function CodeChunk(props) {
  const {code, language, lineNumberStart, isHidden} = props;

  const codeLines = code.map((lineData, index) => {
    return <CodeLine
            language={language}
            code={lineData.given}
            lineNumber={index + lineNumberStart}
            isHidden={isHidden}
            key={index} />
  });

  return (
    <div>
      {codeLines}
    </div>
  );
}

export default CodeChunk;
