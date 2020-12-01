import { createContext, useContext, useState, useEffect } from "react";
import firebase from "firebase/app";

type FixMeLater = any;

export const UserContext = createContext<
  { user: firebase.User } | { user: null }
>({ user: null });

export const useFirebaseUser = () => {
  return useContext(UserContext).user;
};

export const useAuth = () => {
  const [state, setState] = useState(() => {
    const user = firebase.auth().currentUser;
    return {
      initializing: !user,
      user,
    };
  });

  function onChange(user: FixMeLater) {
    setState({
      initializing: false,
      user,
    });
  }

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(onChange);
    return () => unsubscribe();
  }, []);

  return state;
};
