import firebase from 'firebase/app';

// TODO: Use async/await eventually
// TODO: Reference inline TODOs below

type FixMeLater = any

export const doCreateUserWithEmailAndPassword = (email: string, password: string) => {
  return new Promise((resolve, reject) => {
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
      const { code, message } = error;
      if (code === 'auth/weak-password') {
        reject("Password is too weak, please use a stronger password.")
      } else {
        reject(message);
      }
    }).then(() => {
      resolve(true);
    });
    firebase.database().ref('users/' + firebase.auth().currentUser).set({
      email: email
    });
  });
}

export const doSignInWithEmailAndPassword = (email: string, password: string) => {
  let errorMsg = "";
  return new Promise((resolve, reject) => {
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
      const { code, message } = error;
      if (code === 'auth/wrong-password') {
        errorMsg = "Incorrect password. Please try again.";
      } else {
        errorMsg = message;
      }
      reject(errorMsg);
    }).then(() => {
      resolve(true);
    });
  });
}

export const doSignOut = () => {
  return firebase.auth().signOut();
}

// TODO: Confirm that using console is the correct choice here.
export const deleteUser = () => {
  let user = firebase.auth().currentUser;
  if (user) {
    user.delete().then(res => {
      console.log('User removed');
    }).catch(function (error) {
      console.error('Could not delete the user');
    });
  }
}

export const addModule = (moduleData: FixMeLater) => {
  // Get a key for a new set.
  let newModuleKey = firebase.database().ref().child('modules').push().key;

  let updates: FixMeLater = {};
  updates['/modules/' + newModuleKey] = moduleData;

  firebase.database().ref().update(updates);
  return newModuleKey;
}

export const updateUserModule = (moduleKey: string, moduleData: FixMeLater) => {
  const currentlySignedInUser = firebase.auth().currentUser;
  if (currentlySignedInUser) {
    const uid = currentlySignedInUser.uid;

    let updates: FixMeLater = {};
    // This code will come into play when the user attempts a module
    // The module id will be written under their user id, fixing the many-many
    // relationship of modules to users
    updates['/user-modules/' + uid + '/' + moduleKey] = moduleData;

    firebase.database().ref().update(updates);

    return moduleData;
  } else {
    // TODO: Case where no user is currently signed in
  }
}

export const getUserModule = (moduleKey: string) => {
  const currentlySignedInUser = firebase.auth().currentUser;
  if (currentlySignedInUser) {
    const uid = currentlySignedInUser.uid;
    return firebase.database().ref('/user-modules/' + uid + '/' + moduleKey)
      .once('value')
      .then(function (snapshot) {
        return snapshot.val();
      });
  } else {
    // TODO: Case where no user is currently signed in
  }
};
