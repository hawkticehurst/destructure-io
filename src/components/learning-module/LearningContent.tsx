import React, { useMemo } from "react";
import CodeHighlight from "../code-display/CodeHighlight";

type FixMeLater = any;

/**
 * Required Props:
 * contentTitleString {String} – String representing the title a sub module
 * contentParagraphs {Array} – An array of strings representing paragraphs
 *  of content of a sub module
 * codeChunkKeyOffset {String} - unique key used tell which module we are on
 *
 * Optional props:
 * codeDisplay {React Component} - Component for displaying code
 */
type Props = {
  contentTitleString: string;
  contentParagraphs: FixMeLater;
  codeChunkKeyOffset: string;
  codeDisplay?: FixMeLater;
};

function LearningContent({
  contentTitleString,
  contentParagraphs,
  codeChunkKeyOffset,
  codeDisplay,
}: Props) {
  // Memoize the paragraphs split into spans, because its pretty expensive
  const paragraphs = useMemo(
    () =>
      contentParagraphs.map((paragraph: FixMeLater, index: number) => {
        let isInBold = false;
        let isInItalic = false;
        let isInCode = false;
        let remainingNulls = 0;
        const text = [...paragraph]
          .map((character, characterIndex) => {
            if (remainingNulls > 0) {
              remainingNulls--;
              return null;
            } else if (isInBold || isInItalic || isInCode) {
              let endBoldIndex = characterIndex;
              let remainingCloseBrace = 1;
              for (; endBoldIndex < paragraph.length; endBoldIndex++) {
                if (paragraph[endBoldIndex] === ")") {
                  remainingCloseBrace--;
                } else if (paragraph[endBoldIndex] === "(") {
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
                  <CodeHighlight
                    key={(index + 1) * (characterIndex + 1)}
                    language="java"
                    isInline={true}>
                    {paragraph.substring(characterIndex, endBoldIndex)}
                  </CodeHighlight>
                );
              }
              const className = isInBold ? "bold" : isInItalic ? "italic" : "";
              isInBold = false;
              isInItalic = false;
              return (
                <span key={(index + 1) * characterIndex} className={className}>
                  {paragraph.substring(characterIndex, endBoldIndex)}
                </span>
              );
            } else if (
              character === "$" &&
              paragraph.substring(
                characterIndex,
                characterIndex + "$bold(".length
              ) === "$bold("
            ) {
              isInBold = true;
              remainingNulls = "bold(".length;
              return null;
            } else if (
              character === "$" &&
              paragraph.substring(
                characterIndex,
                characterIndex + "$italic(".length
              ) === "$italic("
            ) {
              isInItalic = true;
              remainingNulls = "italic(".length;
              return null;
            } else if (
              character === "$" &&
              paragraph.substring(
                characterIndex,
                characterIndex + "$code(".length
              ) === "$code("
            ) {
              isInCode = true;
              remainingNulls = "code(".length;
              return null;
            }

            let endNormalIndex = characterIndex;
            for (let i = characterIndex; i < paragraph.length; i++) {
              if (paragraph[endNormalIndex] !== "$") {
                endNormalIndex++;
              }
            }
            remainingNulls += endNormalIndex - characterIndex - 1;
            return paragraph.substring(characterIndex, endNormalIndex);
          })
          .filter(Boolean);

        return <p key={index + codeChunkKeyOffset}>{text}</p>;
      }),
    [contentParagraphs, codeChunkKeyOffset]
  );

  return (
    <div className="text-content-container">
      <h1>{contentTitleString}</h1>
      <div className="text-content-paragraphs">{paragraphs}</div>
      <h2>Example Code</h2>
      {codeDisplay}
    </div>
  );
}

export default LearningContent;
