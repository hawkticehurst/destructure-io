import React, { useState, useEffect, useRef } from 'react';
import TwoPaneResizable from '../common/TwoPaneResizable';
import CodeDisplay from '../code-display/CodeDisplay';
import NavBar from '../common/NavBar';
import PageNotFound from '../common/PageNotFound';
import SideBar from './SideBar';
import SubModuleProgressRow from './SubModuleProgressRow';
import LearningContent from './LearningContent';
import Visualization from '../visualization/Visualization';
import contentOutline from '../../lesson-content/contentOutline.json';
import { useParams, useHistory } from "react-router-dom";
import useModuleCompletionState, { filenameToSubModuleKey } from '../../hooks/useModuleCompletionState';

const language = "java"; // TODO make this selectable

// TODO this component is getting way too big. It really should be broken down more and some of the state doesn't need to be state
function LearningModule() {
  const [selectedLine, setSelectedLine] = useState(-1);
  const [playDisabled, setPlayDisabled] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [hasFinishedAnimation, setHasFinishedAnimation] = useState(false); // have they finished it at least once
  const [sideBarShown, setSideBarShown] = useState(false);
  const [data, setData] = useState(null);
  const [trueSelectedLineMap, setTrueSelectedLineMap] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedSubmoduleName, setSelectedSubModuleName] = useState('');
  const [selectedSubModuleIndex, setSelectedSubModuleIndex] = useState(0);
  const [subModuleList, setSubModuleList] = useState([]);
  const [moduleName, setModuleName] = useState('');
  const [subModuleFilename, setSubmoduleFilename] = useState('');
  const [animationStrings, setAnimationStrings] = useState([]);
  const [preStartAnimations, setPreStartAnimations] = useState([]);
  const learningContentPaneRef = useRef(null);
  const visualizationRef = useRef(null);
  const { module, submodule } = useParams();
  const history = useHistory();
  const {
    getCompletionState,
    updateCompletionState
  } = useModuleCompletionState(module);

  useEffect(() => {
    let tempData;
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
    let tempAnimationStrings = [];
    tempData.codeChunks.forEach(chunkObj => {
      const { code, type, loopCounter } = chunkObj;
      if (type !== 'hidden' && type !== 'skipped') {
        // TODO use loopCounter of selected input box
        let loopIteration = 0;
        let maxLoops = loopCounter != null ? loopCounter[0] : 1;
        while (loopIteration < maxLoops) {
          for (let i = 0; i < code[language].length; i++) {
            tempTrueSelectedLineMap[iterationNumber] = startingLine + i;
            if (code[language][i].animations != null && code[language][i].animations.length > 0) {
              if (Array.isArray(code[language][i].animations[0])) {
                tempAnimationStrings = [...tempAnimationStrings, code[language][i].animations[loopIteration]];
              } else {
                tempAnimationStrings = [...tempAnimationStrings, code[language][i].animations];
              }
            } else {
              tempAnimationStrings.push(null);
            }
            iterationNumber++;
          }
          loopIteration++;
        }
      }
      startingLine += code[language].length;
    });

    if (learningContentPaneRef.current != null) {
      learningContentPaneRef.current.scrollTop = 0;
      learningContentPaneRef.current.scrollLeft = 0;
    }

    // Keep track of which module the resume button on summary page should go to
    window.localStorage.setItem('last-viewed-' + module, submodule);

    setModuleName(moduleData.name);
    setSubModuleList(moduleData.submodules);
    setSelectedSubModuleIndex(tempSelectedSubModuleIndex);
    setSelectedSubModuleName(subModuleData.name);
    setSubmoduleFilename(subModuleData.filename);
    setTrueSelectedLineMap(tempTrueSelectedLineMap);
    setAnimationStrings(tempAnimationStrings);
    setPreStartAnimations(tempData.preStartAnimations);
    setData(tempData);
    setSelectedLine(-1);
    setLoading(false);
    setAnimationComplete(false);
    setHasFinishedAnimation(false);
  }, [module, submodule]); // Only run this function when the module or submodule changes

  // Prevent showing errors while files are loaded in
  if (loading) {
    for (const currModuleIndex in contentOutline.modules) {
      if (contentOutline.modules[currModuleIndex].directory === module) {
        return null;
      }
    }
    return <PageNotFound />
  }

  if (error) {
    return <PageNotFound />
  }

  const setNextLine = () => {
    if (animationComplete) {
      setAnimationComplete(false);
    }
    visualizationRef.current.nextLine();
  };

  // const setPreviousLine = () => {
  //   visualizationRef.current.previousLine();
  // };

  const startAnimation = () => {
    visualizationRef.current.playFullAnimation();
  };

  const stopAnimation = () => {
    visualizationRef.current.pauseAnimation();
  };

  const filenameToPath = filename => {
    return '/learn/' + module + '/' + filenameToSubModuleKey(filename);
  };

  const onClickBack = () => {
    history.push(filenameToPath(subModuleList[selectedSubModuleIndex - 2].filename));
  };

  const onClickNext = () => {
    const currCompletionState = getCompletionState(subModuleFilename);
    const animComplete = hasFinishedAnimation || animationStrings.length === 0 || selectedSubModuleIndex === subModuleList.length;
    if (animComplete && (currCompletionState == null || currCompletionState === 'incomplete')) {
      updateCompletionState(subModuleFilename, 'completed');
    }
    if (selectedSubModuleIndex < subModuleList.length) {
      history.push(filenameToPath(subModuleList[selectedSubModuleIndex].filename));
    } else {
      history.push('/learn/' + module);
    }
  };

  const codeDisplay = (
    <CodeDisplay
      language={language}
      codeData={data.codeChunks}
      selectedLine={trueSelectedLineMap[selectedLine]}
      codeChunkKeyOffset={selectedSubmoduleName} />
  );

  return (
    <div>
      <SideBar headerText={moduleName + ' Lessons'} summaryLink={'/learn/' + module} setSideBarShown={setSideBarShown} sideBarShown={sideBarShown}>
        {
          subModuleList.map((subModule, index) => {
            return (
              <SubModuleProgressRow
                onClickLink={() => setSideBarShown(false)}
                link={filenameToPath(subModule.filename)}
                moduleTitle={index + 1 + '. ' + subModule.name}
                completionState={getCompletionState(subModule.filename)}
                completionStateChanged={(state) => updateCompletionState(subModule.filename, state)}
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
              codeChunkKeyOffset={selectedSubmoduleName}
              codeDisplay={codeDisplay}
            />
          }
          secondComponent={
            <Visualization
              animations={animationStrings}
              preStartAnimations={preStartAnimations != null ? preStartAnimations : []}
              updateLine={setSelectedLine}
              setPlayDisabled={setPlayDisabled}
              setAnimationComplete={(isComplete) => {
                setAnimationComplete(isComplete);
                if (isComplete) {
                  setHasFinishedAnimation(true);
                }
              }}
              ref={visualizationRef} />
          }
          initialStartSize={45}
        />
      </div>
      <div className="module-btn-container">
        <div className="back-next-container">
          {
            selectedSubModuleIndex > 1 ? <button onClick={onClickBack}>Back</button> : null
          }
        </div>
        {
          data.noAnimations ? null : (
            <div className="animate-btn-container">
              <button onClick={startAnimation} disabled={playDisabled || animationComplete}>Play</button>
              <button onClick={stopAnimation} disabled={!playDisabled}>Pause</button>
              {/*<button onClick={setPreviousLine}>Previous Line BROKEN</button> */}
              <button onClick={setNextLine} disabled={playDisabled}>{animationComplete ? 'Reset' : 'Step'}</button>
            </div>
          )
        }
        <div className="back-next-container next-btn">
          <button onClick={onClickNext}>
            {
              selectedSubModuleIndex < subModuleList.length ? 'Next' : 'Finish'
            }
          </button>
        </div>
      </div>
    </div>
  );
}

export default LearningModule;
