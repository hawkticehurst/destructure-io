import React, { useMemo } from 'react';
import CodeHighlight from '../code-display/CodeHighlight';

/**
 * Required Props:
 * contentTitleString {String} – String representing the title a sub module
 * contentParagraphs {Array} – An array of strings representing paragraphs
 *  of content of a sub module
 *
 * Optional props:
 * codeDisplay {React Component} - Component for displaying code
 */
function LearningContent(props) {
  const { contentTitleString, contentParagraphs, codeDisplay } = props;

  // Memoize the paragraphs split into spans, because its pretty expensive
  const paragraphs = useMemo(() => contentParagraphs.map((paragraph, index) => {
    let isInBold = false;
    let isInItalic = false;
    let isInCode = false;
    let remainingNulls = 0;
    const text = [...paragraph].map((character, characterIndex) => {
      if (remainingNulls > 0) {
        remainingNulls--;
        return null;
      } else if (isInBold || isInItalic || isInCode) {
        let endBoldIndex = characterIndex;
        let remainingCloseBrace = 1;
        for (; endBoldIndex < paragraph.length; endBoldIndex++) {
          if (paragraph[endBoldIndex] === ')') {
            remainingCloseBrace--;
          } else if (paragraph[endBoldIndex] === '(') {
            remainingCloseBrace++;
          }
          if (remainingCloseBrace === 0) {
            break;
          }
        }
        remainingNulls = endBoldIndex - characterIndex;
        if (isInCode) {
          isInCode = false;
          return (
            <CodeHighlight key={index * characterIndex} language="java" useSpan={true}>
              {paragraph.substring(characterIndex, endBoldIndex)}
            </CodeHighlight>
          )
        }
        const className = isInBold ? 'bold' : isInItalic ? 'italic' : '';
        isInBold = false;
        isInItalic = false;
        return <span key={index * characterIndex} className={className}>{paragraph.substring(characterIndex, endBoldIndex)}</span>
      } else if (character === '$' && paragraph.substring(characterIndex, characterIndex + '$bold('.length) === '$bold(') {
        isInBold = true;
        remainingNulls = 'bold('.length;
        return null;
      } else if (character === '$' && paragraph.substring(characterIndex, characterIndex + '$italic('.length) === '$italic(') {
        isInItalic = true;
        remainingNulls = 'italic('.length;
        return null;
      } else if (character === '$' && paragraph.substring(characterIndex, characterIndex + '$code('.length) === '$code(') {
        isInCode = true;
        remainingNulls = 'code('.length;
        return null;
      }

      let endNormalIndex = characterIndex;
      for (let i = characterIndex; i < paragraph.length; i++) {
        if (paragraph[endNormalIndex] !== '$') {
          endNormalIndex++;
        }
      }
      remainingNulls += (endNormalIndex - characterIndex - 1);
      return paragraph.substring(characterIndex, endNormalIndex);
    }).filter(Boolean);


    return (
      <p key={index}>
        {text}
      </p>
    );
  }), [contentParagraphs]);


  return (
    <div className="text-content-container">
      <h1>{contentTitleString}</h1>
      {paragraphs}
      <h2>{contentTitleString} Code</h2>
      {codeDisplay}
    </div>
  );
}

export default LearningContent;
