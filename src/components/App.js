import React from 'react';
import LearningModule from './learning-module/LearningModule';
import SummaryPage from './learning-module/SummaryPage';
import Catalog from './catalog/Catalog';
import SignInUp from './auth/SignInUp';
import HomePage from './home/HomePage';
import DeviceTooSmall from './common/DeviceTooSmall';
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
            <Route path={'/learn/:module/:submodule'}>
              {
                window.innerWidth <= 768 ? <DeviceTooSmall /> : <LearningModule />
              }
            </Route>
            <Route path={'/learn/:module'}>
              {
                <SummaryPage />
              }
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
