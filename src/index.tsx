import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import * as serviceWorker from "./serviceWorker";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

// TODO: Update firebase config to reflect app name change
const firebaseConfig = {
  apiKey: "AIzaSyDeMsUdMj0mx6q4VdnxkGcdbJp5OIAL2JI",
  authDomain: "node-warrior.firebaseapp.com",
  databaseURL: "https://node-warrior.firebaseio.com",
  projectId: "node-warrior",
  storageBucket: "node-warrior.appspot.com",
  messagingSenderId: "1044681182278",
  appId: "1:1044681182278:web:5de0f9ea5433e8b7858e47",
  measurementId: "G-W82LT744WE",
};

firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
