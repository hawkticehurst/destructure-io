import React from 'react';
import CodeHighlight from './CodeHighlight';
import CodeLine from './CodeLine';

/**
 * Required Props:
 * code {String} - The line of code, i.e. "int x = 5"
 * language {String} - "java", "javascript", etc
 * lineNumber {number} - the line number in the code
 */
function CodeChunk(props) {
  const {code, language, lineNumberStart} = props;

  const codeLines = code.map((lineData, index) => {
    return <CodeLine
            language={language}
            code={lineData.given}
            lineNumber={index + lineNumberStart}
            key={index} />
  });

  return (
    <div>
      {codeLines}
    </div>
  );
}

export default CodeChunk;
