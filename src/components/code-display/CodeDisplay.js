import React from 'react';
import CodeChunk from './CodeChunk';

/**
 * Required Props:
 * language {String} - "java", "javascript", etc
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
  const {codeData, language} = props;

  let currLineNumber = 1;
  const codeChunks = codeData.map((chunkObj, index) => {
    const codeChunk = (
      <CodeChunk
        language={language}
        code={chunkObj.code[language]}
        lineNumberStart={currLineNumber}
        key={index} />
    );
    currLineNumber += chunkObj.code[language].length;
    return codeChunk;
  });

  return (
    <div>
      {codeChunks}
    </div>
  );
}

export default CodeDisplay;
