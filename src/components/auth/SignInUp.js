import React from 'react';
import NavBar from '../common/NavBar';
import SignInUpInputs from './SignInUpInputs';

/**
 * Optional props:
 * isSignIn: {boolean} - Defaults false, true to show sign in instead of sign up
 */
function SignInUp(props) {
  const navBarType = props.isSignIn ? 'sign-in' : 'sign-up';
  return (
    <div>
      <NavBar navBarType={navBarType}/>
      <SignInUpInputs {...props} />
    </div>
  );
}

export default SignInUp;
