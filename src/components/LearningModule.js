import React, { useState } from 'react';
import TwoPaneResizable from './common/TwoPaneResizable';
import CodeDisplay from './code-display/CodeDisplay';
import TextContent from './common/TextContent';
import useInterval from '../hooks/useInterval';

// TODO Remove this. We will probably want to load these in from some submodule component later
import data from "../code-files/example.json";

const language = "java"; // TODO make this selectable

// We only want to run this code once, so its outside the component. We might need to move it
// into a useEffect somehow once the language is changable from java though.
const trueSelecteLineMap = new Map();
let iterationNumber = 1;
let startingLine = 1;
data.forEach(chunkObj => {
  const { code, type, loopCounter } = chunkObj;
  if (type !== 'hidden' && type !== 'skipped') {
    // TODO use loopCounter of selected input box
    let remainingLoops = loopCounter != null ? loopCounter[0] : 1;
    while (remainingLoops > 0) {
      for (let i = 0; i < code[language].length; i++) {
        trueSelecteLineMap.set(iterationNumber, startingLine + i);
        iterationNumber++;
      }
      remainingLoops--;
    }
  }
  startingLine += code[language].length;
});

/**
 * No props, this is the primary component for a module
 *
 * TODO add props to select a different submodule based on route
 */
function LearningModule() {
  const [selectedLine, setSelectedLine] = useState(-1);
  const [speed, setSpeed] = useState(null);

  useInterval(() => {
    setNextLine();
  }, speed);

  const setNextLine = () => {
    if (selectedLine === -1) {
      setSelectedLine(1);
    } else if (selectedLine === trueSelecteLineMap.size) {
      setSelectedLine(-1);
      stopAnimation();
    } else {
      setSelectedLine(selectedLine + 1);
    }
  };

  const setPreviousLine = () => {
    if (selectedLine <= 1) {
      setSelectedLine(-1);
    } else {
      setSelectedLine(selectedLine - 1);
    }
  };

  const startAnimation = () => {
    setSpeed(500);
  };

  const stopAnimation = () => {
    setSpeed(null);
  };

  return (
    <div>
      {/* TODO these inline styles are just temporary */}
      <div className="learning-module-container">
        <TwoPaneResizable
          firstComponent={
            <TextContent
              contentTitleString="Linked List Insertion"
              contentParagraphs={[
                "Follow along with this visualization to insert into a linked list.",
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis et dapibus massa. Donec laoreet sollicitudin velit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce quis auctor risus. Nulla vitae magna nunc. Nulla ullamcorper pretium neque quis rhoncus. Integer ornare sagittis tellus eu posuere. Nunc luctus mattis semper.",
                "Vestibulum finibus pretium convallis. Sed varius hendrerit posuere. Nam tincidunt elit neque, id luctus leo elementum vel. Cras euismod sem nec enim vehicula, id malesuada augue vehicula. Phasellus sit amet odio felis. Vivamus non nulla in augue vulputate ullamcorper sed quis nulla. Proin vel dui pulvinar, vestibulum augue ac, sodales nibh."
              ]}
              codeDisplay={<CodeDisplay language={language} codeData={data} selectedLine={trueSelecteLineMap.get(selectedLine)} />}
            />
          }
          secondComponent={
            <div className="filler-text">
              Visualization Here
            </div>
          }
          initialStartSize={40}
        />
      </div>
      <div className="animate-btn-container">
        <button onClick={startAnimation} disabled={speed != null}>Play Animation</button>
        <button onClick={stopAnimation} disabled={speed == null}>Pause Animation</button>
        <button onClick={setPreviousLine} disabled={selectedLine <= 0}>Previous Line</button>
        <button onClick={setNextLine}>Next Line</button>
      </div>
    </div>
  );
}

export default LearningModule;
