import React from 'react';
import NavBar from '../common/NavBar';
import SubModuleProgressRow from './SubModuleProgressRow';
import { useParams } from 'react-router-dom';
import { useHistory } from "react-router-dom";
import contentOutline from '../../lesson-content/contentOutline.json';

// TODOS: currentSubmodule should update if they have done something already, completionState

function SummaryPage() {
  const { module } = useParams();
  const history = useHistory();

  const { descriptionParagraphs, submodules } = contentOutline.modules.find(moduleObj => moduleObj.directory === module);
  const currentSubmodule = submodules[0].filename;
  const moduleLink = '/learn/' + module;
  const getStartedLink = moduleLink + '/' + currentSubmodule.substring(0, currentSubmodule.length - '.json'.length);

  const onClickGetStarted = () => {
    history.push(getStartedLink);
  };

  return (
    <div>
      <NavBar navBarType="module" />
      <div className="summary-page">
        <h1>Overview:</h1>
        {
          descriptionParagraphs.map((paragraph, i) => {
            return <p key={i}>{paragraph}</p>
          })
        }
        <div className="summary-get-started-container">
          <button onClick={onClickGetStarted} className="hero-btn">Get Started</button>
        </div>
        <div>
          <h1>Syllabus:</h1>
          {
            submodules.map((submodule, i) => {
              const link = moduleLink + '/' + submodule.filename.substring(0, submodule.filename.length - '.json'.length);
              return <SubModuleProgressRow
                        key={i}
                        moduleTitle={submodule.name}
                        link={link}
                        completionState="completed"
                        selected={false}
                        onClickLink={() =>{}}
                        completionStateChanged={() => {}}
                        rowClass="syllabus-row"
                        />
            })
          }
        </div>
      </div>
    </div>
  );
}

export default SummaryPage;
