import React from 'react';
import LearningModule from './learning-module/LearningModule';
import Catalog from './catalog/Catalog';
import SignIn from './auth/SignIn';
import SignUp from './auth/SignUp';
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
        <div className="App">
          <Switch>
            <Route path="/signin">
              <SignIn />
            </Route>
            <Route path="/signup">
              <SignUp />
            </Route>
            <Route path="/catalog">
              <Catalog />
            </Route>
            <Route path={['/learn/:module/:submodule', '/learn/:module']}>
              <LearningModule />
            </Route>
            <Route path="/">
              <div>TODO Landing Page</div>
            </Route>
          </Switch>
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
