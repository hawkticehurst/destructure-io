import React, {useState} from 'react';
import {useHistory} from "react-router-dom";
import {doSignInWithEmailAndPassword} from '../../firebase/firebase';

function SignIn(props) {
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
      // TODO do something other than alert
      alert("Invalid email address");
      return;
    } else {
      doSignInWithEmailAndPassword(email, password)
        .then(authUser => {
          // redirect to home
          history.push('/')
      	})
        .catch(error => {
          setError(error);
        });
    }
  }

  return (
    <div>
    <h1>Sign In</h1>
    <p>Enter your email and password below to sign in</p>
    <form onSubmit={onSubmit}>
      <input
        name="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        type="text"
        placeholder="Email Address"
      />
      <input
        name="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        type="password"
        placeholder="Password"
      />
      <button type="submit">Sign In</button>
      {error && <p>{error.message}</p>}
    </form>
    </div>
  );
}

export default SignIn;

