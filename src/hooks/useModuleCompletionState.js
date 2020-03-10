import { useEffect, useState } from 'react';
import { useFirebaseUser } from './user';
import { updateUserModule, getUserModule } from '../firebase/firebase';

export const filenameToSubModuleKey = filename => {
  return filename.substring(0, filename.length - '.json'.length);
};

// Custom hook for handling completion state of submodules
function useModuleCompletionState(module) {
  const [completionState, setCompletionState] = useState({});
  const user = useFirebaseUser();

  useEffect(() => {
    if (user == null) {
      setCompletionState(JSON.parse(window.localStorage.getItem(module)));
    } else {
      getUserModule(module).then(setCompletionState);
    }
  }, [module, user]);

  useEffect(() => {
    if (completionState == null || Object.keys(completionState).length === 0) {
      return;
    }
    if (user == null) {
      window.localStorage.setItem(module, JSON.stringify(completionState));
    } else {
      updateUserModule(module, completionState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completionState]);

  const updateCompletionState = (submodule, state) => {
    if (state === 'complete') {
      state = 'completed';
    }
    const tempCompletionState = {...completionState};
    tempCompletionState[filenameToSubModuleKey(submodule)] = state;
    setCompletionState(tempCompletionState);
  };

  const getCompletionState = filename => {
    const key = filenameToSubModuleKey(filename);
    if (completionState != null && key in completionState) {
      return completionState[key];
    } return 'incomplete';
  };

  const getCurrentSubmodule = submodules => {
    const lastViewed = window.localStorage.getItem('last-viewed-' + module);
    if (lastViewed != null) {
      return lastViewed;
    }

    if (completionState != null) {
      const currentSubmodule = submodules.find(subModule => {
        return completionState[filenameToSubModuleKey(subModule.filename)] !== 'completed'
      });
      if (currentSubmodule == null) {
        return filenameToSubModuleKey(submodules[submodules.length - 1].filename);
      } return filenameToSubModuleKey(currentSubmodule.filename);
    }
    return filenameToSubModuleKey(submodules[0].filename);
  };

  return {
    completionState,
    updateCompletionState,
    getCompletionState,
    getCurrentSubmodule
  };
}

export default useModuleCompletionState;
