import React from 'react';
import NavBar from '../common/NavBar';
import SignInUpInputs from './SignInUpInputs';

/**
 * Optional props:
 * isSignIn: {boolean} - Defaults false, true to show sign in instead of sign up
 */
function SignInUp(props) {
  return (
    <div>
      <NavBar navBarType="sign-in-up" />
      <SignInUpInputs {...props} />
    </div>
  );
}

export default SignInUp;
