import React, {useEffect, useRef} from 'react';
import {findDOMNode} from 'react-dom';
import hljs from 'highlight.js';
import './highlight-styles/light.scss'; // examples of options, most need to be downloaded: https://highlightjs.org/static/demo/
import './highlight-styles/hidden.scss';

/**
 * Required Props:
 * language {String} - "java", "javascript", etc
 *
 * Optional Props:
 * isHidden {Boolean} - defaults to false, true to "gray" out code
 * isSelected {Boolean} - defaults to false, true to show code as selected
 * isInline {Boolean} - defaults to false, true to make the code inline
 *
 * Children:
 * Any text to be highlighted should be a child.
 *
 * Example usage:
 * <CodeHighlight language="java">int x = 5;</CodeHighlight>
 */
function CodeHighlight(props) {
  const {language, children, isHidden, isSelected, isInline} = props;
  const codeRef = useRef(null);

  useEffect(() => {
    hljs.highlightBlock(findDOMNode(codeRef.current));
  });

  return (
    <span className={isHidden ? "hidden-code" : isSelected ? "selected-code" : "standard-code"}>
      {
        isInline ? (
            <code className={language + 'code-format inline'} ref={codeRef}>
              {children}
            </code>
        ) : (
          <pre className="code-format">
            <code className={language} ref={codeRef}>
              {children}
            </code>
          </pre>
        )
      }
    </span>
  );
}

export default CodeHighlight;
