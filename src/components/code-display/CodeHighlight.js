import React, {useEffect, useRef} from 'react';
import {findDOMNode} from 'react-dom';
import hljs from 'highlight.js';
import './highlight-styles/xcode.scss'; // examples of options, most need to be downloaded: https://highlightjs.org/static/demo/
import './highlight-styles/hidden.scss'; // examples of options, most need to be downloaded: https://highlightjs.org/static/demo/

/**
 * Required Props:
 * language {String} - "java", "javascript", etc
 *
 * Optional Props:
 * isHidden {Boolean} - defaults to false, true to "gray" out code
 *
 * Children:
 * Any text to be highlighted should be a child.
 *
 * Example usage:
 * <CodeHighlight language="java">int x = 5;</CodeHighlight>
 */
function CodeHighlight(props) {
  const {language, children, isHidden} = props;
  const codeRef = useRef(null);

  useEffect(() => {
    hljs.highlightBlock(findDOMNode(codeRef.current));
  });

  return (
    <div className={isHidden ? "hidden-code" : "standard-code"}>
      <pre className="code-format">
        <code className={language} ref={codeRef}>
          {children}
        </code>
      </pre>
    </div>
  );
}

export default CodeHighlight;
