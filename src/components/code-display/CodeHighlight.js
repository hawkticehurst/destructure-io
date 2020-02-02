import React, {useEffect, useRef} from 'react';
import {findDOMNode} from 'react-dom';
import hljs from 'highlight.js';
import './highlight-styles/xcode.css'; // examples of options: https://highlightjs.org/static/demo/

/**
 * Required Props:
 * language {String} - "java", "javascript", etc
 *
 * Children:
 * Any text to be highlighted should be a child.
 *
 * Example usage:
 * <CodeHighlight language="java">int x = 5;</CodeHighlight>
 */
function CodeHighlight(props) {
  const {language, children} = props;
  const codeRef = useRef(null);

  useEffect(() => {
    hljs.highlightBlock(findDOMNode(codeRef.current));
  });

  return (
    <pre className="code-format">
      <code className={language} ref={codeRef}>
        {children}
      </code>
    </pre>
  );
}

export default CodeHighlight;
