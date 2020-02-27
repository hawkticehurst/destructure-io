import React, { useState } from 'react';
import NavBar from '../common/NavBar';
import { useHistory, Link } from "react-router-dom";
import { doSignInWithEmailAndPassword, doCreateUserWithEmailAndPassword } from '../../firebase/firebase';

/**
 * Optional props:
 * isSignIn: {boolean} - Defaults false, true to show sign in instead of sign up
 */
function SignInUp(props) {
  const { isSignIn } = props;
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const isValidEmail = email => {
    // eslint-disable-next-line
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  const onSubmit = event => {
    event.preventDefault();
    if (!isValidEmail(email)) {
      setError("Invalid email address");
      return;
    } else if (isSignIn) {
      signIn();
    } else {
      signUp();
    }
  };

  const didSignIn = () => {
    history.push('/learn');
  };

  const signIn = () => {
    doSignInWithEmailAndPassword(email, password)
      .then(didSignIn)
      .catch(setError);
  };

  const signUp = () => {
    doCreateUserWithEmailAndPassword(email, password)
      .then(didSignIn)
      .catch(setError);
  };

  const headerText = isSignIn ? 'Sign In' : 'Sign Up';

  const footerPrompt = isSignIn ? (
    <p>
      Not a member? <Link to="/signup">Sign up for free!</Link>
    </p>
  ) : (
    <p>
      Not ready to sign up yet? <Link to="/learn">Continue as guest</Link>
    </p>
  );

  return (
    <div>
      <NavBar navBarType="sign-in-up" />
        {
          error != null ? (
            <div className="sign-in-up-error">{error}</div>
          ) : null
        }
      <div className="sign-in-up-container">
        <h1>{headerText}</h1>
        <div>
          <input
            className="sign-in-up-input"
            id="email"
            name="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="text"
            placeholder="Email Address"
          />
          <input
            id="password"
            className="sign-in-up-input password"
            name="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            placeholder="Password"
          />
        </div>
        <button onClick={onSubmit} className="hero-btn sign-in-up-button">
          <span className="bold">{headerText}</span>
        </button>
        {footerPrompt}
      </div>
    </div>
  );
}

export default SignInUp;
