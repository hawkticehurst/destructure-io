import React from 'react';
import LearningModule from './LearningModule';
import SignIn from './auth/SignIn';
import SignUp from './auth/SignUp';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import '../App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/signin">
            <SignIn />
          </Route>
          <Route path="/signup">
            <SignUp />
          </Route>
          <Route path="/">
            {/* TODO going to put some form of routing here eventually */}
            <LearningModule />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
