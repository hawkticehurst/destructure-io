import React from 'react';
import LearningModule from './LearningModule';
import HomePage from './HomePage';
import Catalog from './Catalog';
import SignIn from './auth/SignIn';
import SignUp from './auth/SignUp';
import NavBar from './common/NavBar';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
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
          <Route path="/module">
            <LearningModule
              navBar={<NavBar navBarType="module" />}
            />
          </Route>
          <Route path="/catalog">
            <Catalog
              navBar={<NavBar navBarType="catalog" />}
            />
          </Route>
          <Route path="/">
            <HomePage
              navBar={<NavBar navBarType="homepage" />}
            />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
