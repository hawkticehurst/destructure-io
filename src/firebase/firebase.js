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
  // User modules is used to connect the many-to-many relationship of users to modules attempted

  // TODO this code was here but it didn't assign anything...
  // updates['/user-modules/' + moduleJson.uid + '/' + newModuleKey]

  firebase.database().ref().update(updates);
  return newModuleKey;
}
