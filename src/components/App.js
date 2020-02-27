import React from 'react';
import LearningModule from './learning-module/LearningModule';
import Catalog from './catalog/Catalog';
import SignInUp from './auth/SignInUp';
import HomePage from './home/HomePage';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {useAuth, UserContext} from '../hooks/user';
import '../App.css';

function App() {
  const { initializing, user } = useAuth();

  if (initializing) {
    return null;
  }

  return (
    <UserContext.Provider value={{ user }}>
      <Router>
        <div className="app">
          <Switch>
            <Route path="/signin">
              <SignInUp isSignIn={true} />
            </Route>
            <Route path="/signup">
              <SignInUp isSignIn={false} />
            </Route>
            <Route path={['/learn/:module/:submodule', '/learn/:module']}>
              <LearningModule />
            </Route>
            <Route path={['/learn', '/catalog']}>
              <Catalog />
            </Route>
            <Route path="/">
              <HomePage />
            </Route>
          </Switch>
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
