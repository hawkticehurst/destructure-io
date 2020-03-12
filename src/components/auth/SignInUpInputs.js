import React, { useState } from 'react';
import { useHistory, Link } from "react-router-dom";
import { doSignInWithEmailAndPassword, doCreateUserWithEmailAndPassword } from '../../firebase/firebase';
import contentOutline from '../../lesson-content/contentOutline.json';
import { updateUserModule } from '../../firebase/firebase';
import { getApproveCookie } from '../../hooks/useModuleCompletionState';

/**
 * Optional props:
 * isSignIn: {boolean} - Defaults false, true to show sign in instead of sign up
 * onSignIn: {function} - Function to call when signed in
 */
function SignInUpInputs(props) {
  const { isSignIn, onSignIn } = props;
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [labelChecked, setLabelChecked] = useState(false);
  const [hasApprovedCookies, setHasApprovedCookies] = useState(getApproveCookie() === 'true');

  const isValidEmail = email => {
    // eslint-disable-next-line
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  const onSubmit = event => {
    event.preventDefault();
    if (!hasApprovedCookies) {
      if (!labelChecked) {
        setError('Please accept the privacy policy before continuing');
        return;
      }
      const date = new Date();
      date.setTime(date.getTime() + (6*30*24*60*60*1000)); // Expires in 6 months
      document.cookie = "destructure-cookie-approve=true;expires=" + date.toUTCString() + ";path=/";
      setHasApprovedCookies(true);
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    } else if (isSignIn) {
      signIn();
    } else {
      signUp();
    }
  };

  const didSignUp = () => {
    contentOutline.modules.map(module => module.directory).forEach(module => {
      updateUserModule(module, JSON.parse(window.localStorage.getItem(module)));
    });
  };

  const didSignIn = () => {
    if (window.location.pathname.startsWith('/learn')) {
      onSignIn();
      return;
    }
    history.push('/learn');
  };

  const signIn = () => {
    doSignInWithEmailAndPassword(email, password)
      .then(didSignIn)
      .catch(setError);
  };

  const signUp = () => {
    doCreateUserWithEmailAndPassword(email, password)
      .then(didSignUp)
      .then(didSignIn)
      .catch(setError);
  };

  const headerText = isSignIn ? 'Log In' : 'Sign Up';

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
    <div className="sign-in-up-flex-container">
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
        {
          !hasApprovedCookies ? (
            <label className="accept-cookie-label">
              I accept the <Link to="/privacy">Privacy Policy</Link> and opt-in to cookies.
              <input
                name="accept-cookie"
                type="checkbox"
                checked={labelChecked}
                onChange={() => setLabelChecked(!labelChecked)} />
              <span className="checkmark" />
            </label>
          ) : null
        }
        </div>
        <button onClick={onSubmit} className="hero-btn sign-in-up-button">
          <span className="bold">{headerText}</span>
        </button>
        {footerPrompt}
      </div>
      {/* Festive background that may be used later. */}
      {/* <div className="sign-in-up-circle-lg"></div>
      <div className="sign-in-up-circle-sm"></div>
      <div className="sign-in-up-circle-md"></div> */}
    </div>
  );
}

export default SignInUpInputs;
