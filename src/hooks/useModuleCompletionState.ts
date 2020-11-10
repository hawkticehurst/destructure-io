import { useEffect, useState } from 'react';
import { useFirebaseUser } from './user';
import { updateUserModule, getUserModule } from '../firebase/firebase';

type FixMeLater = any;

export const filenameToSubModuleKey = (filename: string) => {
  return filename.substring(0, filename.length - '.json'.length);
};

export const getApproveCookie = () => {
  const cookies = "; " + document.cookie;
  const cookieComponents = cookies.split("; destructure-cookie-approve=");
  if (cookieComponents.length === 2) {
    const destructureCookieApproveVal = cookieComponents.pop();
    if (destructureCookieApproveVal) {
      return destructureCookieApproveVal.split(";").shift() === "true"; // TODO: Confirm this works!!
    }
  }
  return false;
};

// Custom hook for handling completion state of submodules
function useModuleCompletionState(module: FixMeLater) {
  const [completionState, setCompletionState] = useState<FixMeLater>({});
  const user = useFirebaseUser();
  const hasApprovedCookies = getApproveCookie();

  useEffect(() => {
    if (!hasApprovedCookies) {
      return;
    }

    if (user === null) {
      const localModuleString = window.localStorage.getItem(module);
      if (localModuleString) {
        setCompletionState(JSON.parse(localModuleString));
      }
    } else {
      const userModule = getUserModule(module);
      if (userModule) {
        userModule.then(setCompletionState);
      }
    }
  }, [module, user, hasApprovedCookies]);

  const updateCompletionState = (submodule: FixMeLater, state: string) => {
    if (!hasApprovedCookies) {
      return;
    }

    if (state === 'complete') {
      state = 'completed';
    }

    const tempCompletionState: FixMeLater = { ...completionState };
    tempCompletionState[filenameToSubModuleKey(submodule)] = state;
    setCompletionState(tempCompletionState);

    if (user == null) {
      window.localStorage.setItem(module, JSON.stringify(tempCompletionState));
    } else {
      updateUserModule(module, tempCompletionState);
    }
  };

  const getCompletionState = (filename: string) => {
    if (!hasApprovedCookies) {
      return 'incomplete';
    }

    const key = filenameToSubModuleKey(filename);
    if (completionState !== null && key in completionState) {
      return completionState[key];
    } return 'incomplete';
  };

  const getCurrentSubmodule = (submodules: FixMeLater) => {
    if (!hasApprovedCookies) {
      return filenameToSubModuleKey(submodules[0].filename);
    };

    const lastViewed = window.localStorage.getItem('last-viewed-' + module);
    if (lastViewed != null) {
      return lastViewed;
    }

    if (completionState != null) {
      const currentSubmodule = submodules.find((subModule: FixMeLater) => {
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
