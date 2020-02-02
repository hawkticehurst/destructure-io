import React from 'react';
import CodeLine from './CodeLine';

/**
 * Required Props:
 * language {String} - "java", "javascript", etc
 * codeData {Array<Obj>} - Code data as a JS object in format:
 [
    {
      code: {
        java: {
          given: "code as string",
          dropdownOptions: ["option 1", "option 2"] // optional, default [],
          dropdownLocation: number // optional index in line to put dropdown, defaults to -1 (end of line),
          fillInBlankLocation: number // optional index of fill in blank. -1 = end of line, unspecified = none,
          isGray: boolean // optional defaults to false. If true, code is grayed out
        }
      },
      animations: [] // array of animations to play for line
    },
  ]
 */
function CodeDisplay(props) {
  const {codeData, language} = props;

  const codeLines = codeData.map((lineObj, index) => {
    return <CodeLine
            language={language}
            code={lineObj.code[language].given}
            lineNumber={index + 1}
            key={index} />
  });

  return (
    <div>
      {codeLines}
    </div>
  );
}

export default CodeDisplay;
