import { useEffect, useState } from 'react';
import { useFirebaseUser } from './user';
import { updateUserModule, getUserModule } from '../firebase/firebase';

export const filenameToSubModuleKey = filename => {
  return filename.substring(0, filename.length - '.json'.length);
};

export const getApproveCookie = () => {
  const cookies = "; " + document.cookie;
  const parts = cookies.split("; destructure-cookie-approve=");
  if (parts.length === 2) {
    return parts.pop().split(";").shift();
  } return false;
};

// Custom hook for handling completion state of submodules
function useModuleCompletionState(module) {
  const [completionState, setCompletionState] = useState({});
  const user = useFirebaseUser();
  const hasApprovedCookies = getApproveCookie() === 'true';

  useEffect(() => {
    if (!hasApprovedCookies) {
      return;
    }

    if (user == null) {
      setCompletionState(JSON.parse(window.localStorage.getItem(module)));
    } else {
      getUserModule(module).then(setCompletionState);
    }
  }, [module, user, hasApprovedCookies]);

  const updateCompletionState = (submodule, state) => {
    if (!hasApprovedCookies) {
      return;
    }

    if (state === 'complete') {
      state = 'completed';
    }
    const tempCompletionState = {...completionState};
    tempCompletionState[filenameToSubModuleKey(submodule)] = state;
    setCompletionState(tempCompletionState);

    if (user == null) {
      window.localStorage.setItem(module, JSON.stringify(tempCompletionState));
    } else {
      updateUserModule(module, completionState);
    }
  };

  const getCompletionState = filename => {
    if (!hasApprovedCookies) {
      return 'incomplete';
    }

    const key = filenameToSubModuleKey(filename);
    if (completionState != null && key in completionState) {
      return completionState[key];
    } return 'incomplete';
  };

  const getCurrentSubmodule = submodules => {
    if (!hasApprovedCookies) {
      return filenameToSubModuleKey(submodules[0].filename);
    };

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
