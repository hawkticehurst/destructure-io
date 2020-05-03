import React, { useState, useEffect, useRef, Fragment } from 'react';
import Tour from 'reactour';
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
  const [tourStep, setTourStep] = useState(0);
  const [tourOpen, setTourOpen] = useState(true);
  const learningContentPaneRef = useRef(null);
  const visualizationRef = useRef(null);
  const { module, submodule } = useParams();
  const history = useHistory();
  const {
    getCompletionState,
    updateCompletionState
  } = useModuleCompletionState(module);

  const OPEN_HIDDEN_TOUR_INDEX = 3; // Index of when we should open code before highlighting
  const STEP_TOUR_INDEX = 4; // Index of when pressing step moves tour step forward
  const START_TOUR_INDEX = 7; // Index of when pressing play moves step forward
  const STOP_TOUR_INDEX = 8; // Index of when pressing pause moves step forward
  const SHOW_SIDEBAR_TOUR_INDEX = 9;
  const tourSteps = [
    {
      visibleSidebar: false,
      selector: '',
      content: `Welcome to destructure.io! Click through this tutorial to learn
                how to use the site and all of its features.`,
    },
    {
      visibleSidebar: false,
      selector: '.text-content-paragraphs',
      content: `Each lesson will start with a detailed explanation of what you will
                learn, building off the previous lessons.`,
    },
    {
      visibleSidebar: false,
      selector: '.code-display-container',
      content: `With each lesson, there will also be a block of example code.
                Don't worry about this code yet, you'll learn all this and more soon!`,
    },
    {
      visibleSidebar: false,
      selector: '.hidden-chunk',
      content: `Some code will start off collapsed. This code is supplementary to the
                material of the current lesson, but always feel free to open it up to get more context!`,
      position: 'top'
    },
    {
      nextOverride: () => {
        visualizationRef.current.nextLine();
        setTourStep(tourStep + 1);
      },
      visibleSidebar: false,
      selector: '.step-btn',
      content: `To start an animation, press the step button.
                This will animate one line of code at a time. Go ahead and press it a few times!`,
    },
    {
      visibleSidebar: false,
      selector: '.visualization',
      content: `As you step through code, the visualization will update one step at a time!`,
      position: 'left'
    },
    {
      visibleSidebar: false,
      selector: '.selected-line',
      content: `With each step of the animation, the related line of code will highlight!`,
      position: 'left'
    },
    {
      visibleSidebar: false,
      selector: '.play-btn',
      content: `Alternatively, you can play the entire animation at once by clicking play!`,
    },
    {
      visibleSidebar: false,
      selector: '.pause-btn',
      content: `And of course you can pause animations if they are in progress!`,
    },
    {
      nextOverride: () => {
        setSideBarShown(true);
        setTimeout(() => setTourStep(tourStep + 1), 500);
      },
      visibleSidebar: false,
      selector: '.hamburger-icon',
      content: `Click on the menu icon to open the sidebar and track your progress!`,
    },
    {
      visibleSidebar: true,
      selector: '.progress-circle-filled',
      content: `Click these circles to flag lessons for later or mark them as complete.`,
    },
    {
      visibleSidebar: false,
      selector: '.next-btn',
      content: `That's all for now, press next to move on to the first lesson!`,
    }
  ];

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
                const nextAnimation = (code[language][i].animations[loopIteration] != null &&
                                       code[language][i].animations[loopIteration].length > 0) ?
                                       code[language][i].animations[loopIteration] : null;
                tempAnimationStrings = [...tempAnimationStrings, nextAnimation];
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
    setTourStep(0);
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
    if (tourStep === STEP_TOUR_INDEX) {
      nextTourStep();
    }

    if (animationComplete) {
      setAnimationComplete(false);
    }
    visualizationRef.current.nextLine();
  };

  const startAnimation = () => {
    if (tourStep === START_TOUR_INDEX) {
      nextTourStep();
    }

    visualizationRef.current.playFullAnimation();
  };

  const stopAnimation = () => {
    if (tourStep === STOP_TOUR_INDEX) {
      nextTourStep();
    }

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

  const nextTourStep = () => {
    if (tourSteps[tourStep].nextOverride != null) {
      tourSteps[tourStep].nextOverride();
      return;
    }

    if (tourStep + 1 === OPEN_HIDDEN_TOUR_INDEX && document.querySelector('.chunk-collapsed') != null) {
      document.querySelector('.chevron.right').click();
      setTimeout(() => {
        setTourStep(prev => (prev < tourSteps.length - 1 ? prev + 1 : prev));
      }, 500);
      return;
    }

    if (tourStep + 1 < tourSteps.length &&
      tourSteps[tourStep].visibleSidebar && !tourSteps[tourStep + 1].visibleSidebar) {
      setSideBarShown(false);
    }

    setTourStep(prev => (prev < tourSteps.length - 1 ? prev + 1 : prev));
  };

  const prevTourStep = () => {
    if (tourStep - 1 === OPEN_HIDDEN_TOUR_INDEX && document.querySelector('.chunk-collapsed') != null) {
      document.querySelector('.chevron.right').click();
      setTimeout(() => {
        setTourStep(OPEN_HIDDEN_TOUR_INDEX);
      }, 500);
      return;
    }

    if (tourStep === SHOW_SIDEBAR_TOUR_INDEX + 1) {
      setSideBarShown(true);
      // Add a delay so the sidebar can come back out
      setTimeout(() => setTourStep(SHOW_SIDEBAR_TOUR_INDEX), 500);
      return;
    } else if (tourStep === SHOW_SIDEBAR_TOUR_INDEX) {
        setSideBarShown(false);
        // Add a delay so the sidebar can have time to go away
        setTimeout(() => setTourStep(SHOW_SIDEBAR_TOUR_INDEX - 1), 500);
        return;
      }

    setTourStep(prev => (prev > 0 ? prev - 1 : prev));
  };

  const gotoTourStep = (step) => {
    if (tourSteps[step].visibleSidebar && !sideBarShown) {
      setSideBarShown(true);
      setTimeout(() => setTourStep(step), 500);
      return;
    } else if (!tourSteps[step].visibleSidebar && sideBarShown) {
      setSideBarShown(false);
      setTimeout(() => setTourStep(step), 500);
      return;
    } else if (step === OPEN_HIDDEN_TOUR_INDEX && document.querySelector('.chunk-collapsed') != null) {
      document.querySelector('.chevron.right').click();
      setTimeout(() => setTourStep(step), 500);
      return;
    }
    setTourStep(step);
  };

  return (
    <Fragment>
      <div>
        <SideBar showBackToSummary={true} headerText={moduleName + ' Lessons'} summaryLink={'/learn/' + module} setSideBarShown={setSideBarShown} sideBarShown={sideBarShown}>
          {
            subModuleList.map((subModule, index) => {
              return (
                <SubModuleProgressRow
                  onClickLink={() => setSideBarShown(false)}
                  link={filenameToPath(subModule.filename)}
                  moduleTitle={index + '. ' + subModule.name}
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
          toggleSideBar={() => {
            if (tourStep === SHOW_SIDEBAR_TOUR_INDEX) {
              setTimeout(() => nextTourStep(), 500);
            }
            setSideBarShown(!sideBarShown);
          }}
          SubModuleTitle={(selectedSubModuleIndex - 1) + '. ' + selectedSubmoduleName} />
        <div className="learning-module-container">
          <TwoPaneResizable
            firstComponentRef={learningContentPaneRef}
            firstComponentName="Learn"
            secondComponentName="Visualization"
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
                <button className="play-btn" onClick={startAnimation} disabled={playDisabled || animationComplete}>Play</button>
                <button className="pause-btn" onClick={stopAnimation} disabled={!playDisabled}>Pause</button>
                <button className="step-btn" onClick={setNextLine} disabled={playDisabled}>{animationComplete ? 'Reset' : 'Step'}</button>
              </div>
            )
          }
          <div className="back-next-container next-btn">
            <button className="next-btn" onClick={onClickNext}>
              {
                selectedSubModuleIndex < subModuleList.length ? 'Next' : 'Finish'
              }
            </button>
          </div>
        </div>
      </div>
      {
        submodule === 'walkthrough' ? (
          <Tour
            accentColor="#5d42ff"
            closeWithMask={false}
            nextStep={nextTourStep}
            prevStep={prevTourStep}
            dotClick={gotoTourStep}
            goToStep={tourStep}
            steps={tourSteps}
            isOpen={tourOpen}
            onRequestClose={() => setTourOpen(false)}
            rounded={8}
             />
        ) : null
      }
    </Fragment>
  );
}

export default LearningModule;
