import app from 'firebase/app';

  const firebaseConfig = {
    apiKey: "AIzaSyDeMsUdMj0mx6q4VdnxkGcdbJp5OIAL2JI",
      authDomain: "node-warrior.firebaseapp.com",
      databaseURL: "https://node-warrior.firebaseio.com",
      projectId: "node-warrior",
      storageBucket: "node-warrior.appspot.com",
      messagingSenderId: "1044681182278",
      appId: "1:1044681182278:web:5de0f9ea5433e8b7858e47",
      measurementId: "G-W82LT744WE"
  };
  
  class Firebase {
    constructor() {
      app.initializeApp(firebaseConfig);
      this.auth = app.auth();
      this.db = app.database();
    }

    doCreateUserWithEmailAndPassword = (email, password) => {
        return new Promise((resolve, reject) => {
          this.auth.createUserWithEmailAndPassword(email, password).catch(function(error) {
            let errorCode = error.code;
            let errorMessage = error.message;
            if (errorCode === 'auth/weak-password') {
              alert('The password is too weak.');
              reject("The password is too weak.")
            } else {
              alert(errorMessage);
              reject(errorMessage);
            }
            console.log(error);
          }).then(() => {
            resolve(true)
          });
        });
    }

    doSignInWithEmailAndPassword = (email, password) => {  
      let errorMsg = "";   
      return new Promise((resolve, reject) => {
        this.auth.signInWithEmailAndPassword(email, password).catch(function(error) {
          let errorCode = error.code;
          let errorMessage = error.message;
          if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
            errorMsg = "Wrong password";
          } else {
            alert(errorMessage);
            errorMsg = errorMessage;
          }
          reject(errorMsg);
          console.log(error);
        }).then(() => {
          resolve(true)
        });
      });
    }

    doSignOut = () => {
        return this.auth.signOut();
    }

    isSignedIn = () => {
        return this.auth.currentUser !== null;
    }

    deleteUser = () => {
        let user = this.auth.currentUser;
        if (user) {
            user.delete().then(res => {
              alert('User removed');
            }).catch(function(error) {
              alert('Could not delete the user');
            });
        }
    }

    addModule = (moduleJson) => {
        // Get a key for a new set.
        let newModuleKey = this.db.ref().child('modules').push().key;
    
        let updates = {};
        updates['/modules/' + newModuleKey] = moduleJson;
        // User modules is used to connect the many-to-many relationship of users to modules attempted
        updates['/user-modules/' + moduleJson.uid + '/' + newModuleKey]
    
        this.db.ref().update(updates);
        return newModuleKey;
    }
  }
  
  export default Firebase;
