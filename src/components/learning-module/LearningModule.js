import React, { useState, useEffect, useRef } from 'react';
import TwoPaneResizable from '../common/TwoPaneResizable';
import CodeDisplay from '../code-display/CodeDisplay';
import NavBar from '../common/NavBar';
import SideBar from './SideBar';
import SubModuleProgressRow from './SubModuleProgressRow';
import LearningContent from './LearningContent';
import useInterval from '../../hooks/useInterval';
import contentOutline from '../../lesson-content/contentOutline.json';
import {useParams} from "react-router-dom";

const language = "java"; // TODO make this selectable

// TODO this component is getting way too big. It really should be broken down more
function LearningModule() {
  const [selectedLine, setSelectedLine] = useState(-1);
  const [speed, setSpeed] = useState(null);
  const [sideBarShown, setSideBarShown] = useState(false);
  const [data, setData] = useState(null);
  const [trueSelectedLineMap, setTrueSelectedLineMap] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedSubmoduleName, setSelectedSubModuleName] = useState('');
  const [selectedSubModuleIndex, setSelectedSubModuleIndex] = useState(0);
  const [subModuleList, setSubModuleList] = useState([]);
  const [moduleName, setModuleName] = useState('');
  const learningContentPaneRef = useRef(null);
  const {module, submodule} = useParams();

  useInterval(() => {
    setNextLine();
  }, speed);

  useEffect(() => {
    let tempData;
    console.log(module)
    const moduleData = contentOutline.modules.find(moduleObj => moduleObj.directory === module);
    if (moduleData == null) {
      setError(true);
      return;
    }
    let tempSelectedSubModuleIndex = 0;
    let subModuleData = moduleData.submodules.find(submoduleObj => {
      tempSelectedSubModuleIndex++;
      return submoduleObj.filename === (submodule + '.json');
    })
    if (subModuleData == null) {
      subModuleData = moduleData.submodules[0];
      tempSelectedSubModuleIndex = 1;
    }
    try {
      tempData = require('../../lesson-content/' + module + '/' + subModuleData.filename);
    } catch (e) {
      setError(true);
      return;
    }
    const tempTrueSelectedLineMap = [null]; // 0th line is null, lines start at 1, prevent a bunch of +-1
    let iterationNumber = 1;
    let startingLine = 1;
    tempData.codeChunks.forEach(chunkObj => {
      const { code, type, loopCounter } = chunkObj;
      if (type !== 'hidden' && type !== 'skipped') {
        // TODO use loopCounter of selected input box
        let remainingLoops = loopCounter != null ? loopCounter[0] : 1;
        while (remainingLoops > 0) {
          for (let i = 0; i < code[language].length; i++) {
            tempTrueSelectedLineMap[iterationNumber] = startingLine + i;
            iterationNumber++;
          }
          remainingLoops--;
        }
      }
      startingLine += code[language].length;
    });

    if (learningContentPaneRef.current != null) {
      learningContentPaneRef.current.scrollTop = 0;
      learningContentPaneRef.current.scrollLeft = 0;
    }

    setModuleName(moduleData.name);
    setLoading(false);
    setSubModuleList(moduleData.submodules);
    setSelectedSubModuleIndex(tempSelectedSubModuleIndex);
    setSelectedSubModuleName(subModuleData.name)
    setTrueSelectedLineMap(tempTrueSelectedLineMap);
    setData(tempData);
    setSpeed(null);
    setSelectedLine(-1);
  }, [module, submodule]); // Only run this function when the module or submodule changes

  // Prevent showing errors while files are loaded in
  if (loading) {
    // TODO loading indicator
    return null;
  }

  if (error) {
    /* TODO 404 Page ? */
    return <div>Sorry, something went wrong. Please try again later</div>;
  }

  const setNextLine = () => {
    if (selectedLine === -1) {
      setSelectedLine(1);
    } else if (selectedLine === trueSelectedLineMap.length) {
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
      <SideBar headerText={moduleName + ' Lessons'} setSideBarShown={setSideBarShown} sideBarShown={sideBarShown}>
        {
          subModuleList.map((subModule, index) => {
            return (
              <SubModuleProgressRow
                onClickLink={() => setSideBarShown(false)}
                link={'/learn/' + module + '/' + subModule.filename.substring(0, subModule.filename.length - '.json'.length)}
                moduleTitle={index + 1 + '. ' + subModule.name}
                completionState="completed"
                selected={index + 1 === selectedSubModuleIndex}
                key={index} />
            );
          })
        }
      </SideBar>
      <NavBar
        navBarType="module"
        toggleSideBar={() => setSideBarShown(!sideBarShown)}
        SubModuleTitle={selectedSubModuleIndex + '. ' + selectedSubmoduleName} />
      <div className="learning-module-container">
        <TwoPaneResizable
          firstComponentRef={learningContentPaneRef}
          firstComponent={
            <LearningContent
              contentTitleString={selectedSubmoduleName}
              contentParagraphs={data.paragraphs}
              codeDisplay={<CodeDisplay
                              language={language}
                              codeData={data.codeChunks}
                              selectedLine={trueSelectedLineMap[selectedLine]} />}
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
