import React, { useEffect } from 'react';
import CodeChunk from './CodeChunk';

/**
 * Required Props:
 * language {String} - "java", "javascript", etc
 * selectedLine {number} - line number to highlight, -1 to highlight nothing
 * codeData {Array<Obj>} - Code data as a JS object in format:
 [
    {
      type: "auto", "loop", "hidden", "skipped" // optional, default auto, how to display code (if it is looped over, never stopped on or grayed out/hidden)
      loopCounter: [ints] // Required only for type "loop". Number of times the code executes. If array size > 1, it should be the same size as dropDownOptions, with the counts aligning to those.
      code: {
        java: [ // Array of objects, each representing 1 line of code.
          {
            given: "code as string",
            dropdownOptions: ["option 1", "option 2"] // optional, default [],
            dropdownLocation: number // optional index in line to put dropdown, defaults to -1 (end of line),
            fillInBlankLocation: number // optional index of fill in blank. -1 = end of line, unspecified = none,
          },
        ]
      },
      animations: [] // array of animations to play for line
    },
  ]
 */
function CodeDisplay(props) {
  const { codeData, language, selectedLine } = props;

  // This is a bit hacky, but it listens for horizontal scrolls on the code display
  // If any happen, it makes sure all lines stay the full width of the container,
  // which keeps the background colors visable.
  useEffect(() => {
    document.querySelector('.code-display-container').addEventListener('scroll', () => {
      const chunks = document.querySelectorAll('.chunk');
      let maxWidth = 0;
      chunks.forEach((line) => {
        if (line.scrollWidth > maxWidth) {
          maxWidth = line.scrollWidth;
        }
      });
      chunks.forEach((line) => {
        line.style.width = maxWidth + "px";
      });
    });
  }, []);

  let currLineNumber = 1;
  const codeChunks = codeData.map((chunkObj, index) => {
    const { code, type } = chunkObj;
    const codeChunk = (
      <CodeChunk
        language={language}
        code={code[language]}
        lineNumberStart={currLineNumber}
        isHidden={type === "hidden"}
        selectedLine={selectedLine}
        key={index} />
    );
    currLineNumber += code[language].length;
    return codeChunk;
  });
  return (
    <div className="code-display-container">
      {codeChunks}
    </div>
  );
}

export default CodeDisplay;
