import firebase from 'firebase/app';

// TODO we should remove all of the alerts and do something cleaner

export const doCreateUserWithEmailAndPassword = (email, password) => {
  return new Promise((resolve, reject) => {
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
    const {code, message} = error;
    if (code === 'auth/weak-password') {
      alert('The password is too weak.');
      reject("The password is too weak.")
    } else {
      alert(message);
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

export const doSignInWithEmailAndPassword = (email, password) => {
  let errorMsg = "";
  return new Promise((resolve, reject) => {
  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    const {code, message} = error;
    if (code === 'auth/wrong-password') {
      alert('Wrong password.');
      errorMsg = "Wrong password";
    } else {
      alert(message);
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

export const isSignedIn = () => {
  return firebase.auth().currentUser !== null;
}

export const deleteUser = () => {
  let user = firebase.auth().currentUser;
  if (user) {
    user.delete().then(res => {
      alert('User removed');
    }).catch(function(error) {
      alert('Could not delete the user');
    });
  }
}

export const addModule = (moduleJson) => {
  // Get a key for a new set.
  let newModuleKey = firebase.database().ref().child('modules').push().key;

  let updates = {};
  updates['/modules/' + newModuleKey] = moduleJson;

  firebase.database().ref().update(updates);
  return newModuleKey;
}

export const updateUserModule = (moduleKey) => {
  let uid = firebase.auth().currentUser;

  let moduleData = {
    attempted: true
  };

  let updates = {};

  // This code will come into play when the user attempts a module
  // The module id will be written under their user id, fixing the many-many
  // relationship of modules to users
  updates['/user-modules/' + uid + '/' + moduleKey + '/' + moduleData]

  firebase.database().ref().update(updates);
}
