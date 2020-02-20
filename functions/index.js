// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

// CORS Express middleware to enable CORS Requests.
const cors = require('cors')({
  origin: true,
});

const crypto = require('crypto');
function hashedString(string) {
  return crypto.createHash('md5').update(string).digest('hex');
}

  // Listens for new messages added to
exports.addModuleToUserModules = functions.database.ref('/modules/{moduleKey}/')
.onCreate((snapshot, context) => {
  // Grab the current value of what was written to the Realtime Database.
  const original = snapshot.val();
  const uid = original.uid;
  const moduleKey = context.params.moduleKey;
  const numberOfQuestions = original.length;
  const newValue = { userScore:0, possibleScore:numberOfQuestions, completed:false};
  // You must return a Promise when performing asynchronous tasks inside a Functions such as
  // writing to the Firebase Realtime Database.
  return snapshot.ref.parent.parent.child('/user-modules/' + uid + "/" + moduleKey + "/").set(newValue);
});


// On account creating add their email to users in the database.
exports.addUserToDB = functions.auth.user().onCreate(async(user) => {
  let initialDisplayName = user.email.split('@')[0];

  let snap = await admin.database().ref('users/').once('value');
  let usersInDB = snap.val()
  // I wrote this as a set of promises because this function could
  // potentially be asynchronous?
  let promises = Object.keys(usersInDB).map((userUID) => {
    let userInDB = usersInDB[userUID];
    return new Promise((resolve, reject) => {
      if (userInDB.displayName === initialDisplayName) {
        initialDisplayName = hashedString(user.uid);
      }
      resolve();
    });
  });

  let test = await Promise.all(promises);

  return admin.database().ref('/users/' + user.uid).set({
    email: user.email,
    displayName: initialDisplayName
  });
});


exports.displayNameExists = functions.https.onRequest(async(req, res) => {
  cors(req, res, () => {});
  let displayName;
  let uid;
  uid = req.query.uid;
  displayName = req.query.displayName;
  if (!displayName || !uid) {
    res.sendStatus(400);
  }
  let snap = await admin.database().ref('users/').once('value');
  let users = snap.val()
  // I wrote this as a set of promises because this function could
  // potentially be asynchronous?
  let promises = Object.keys(users).map((userUID) => {
    let user = users[userUID];
    return new Promise((resolve, reject) => {
      if (user.displayName === displayName) {
        res.status(200).send(true);
        return;
      }
      resolve();
    });
  });

  let test = await Promise.all(promises);
  if (test.length === 0 && promises.length !== 0) {
    res.status(200).send(true);
  } else {
    admin.database().ref(`/users/${uid}`).child('displayName').set(displayName)
    .then(res.status(200).send(false))
    .catch(error => res.sendStatus(400))
  }
});
