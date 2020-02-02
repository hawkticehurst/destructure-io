import React from 'react';
import CodeHighlight from './CodeHighlight';

/**
 * Required Props:
 * code {String} - The line of code, i.e. "int x = 5"
 * language {String} - "java", "javascript", etc
 * lineNumber {number} - the line number in the code
 */
function CodeLine(props) {
  const {code, language, lineNumber} = props;

  return (
    <div className="code-line">
      <div className="line-number">
        {lineNumber}
      </div>
      <div className="code-content">
        <CodeHighlight language={language}>
          {code}
        </CodeHighlight>
      </div>
    </div>
  );
}

export default CodeLine;
