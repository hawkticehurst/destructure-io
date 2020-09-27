import React from 'react';
import NavBar from '../common/NavBar';
import SignInUpInputs from './SignInUpInputs';

// TODO: Confirm props are actually optional and that isSignIn is the only prop
/**
 * Optional props:
 * isSignIn: {boolean} - Defaults false, true to show sign in instead of sign up
 */
type Props = {
  isSignIn?: boolean
}

function SignInUp({ isSignIn }: Props) {
  const navBarType = isSignIn ? 'sign-in' : 'sign-up';
  return (
    <div>
      <NavBar navBarType={navBarType} />
      <SignInUpInputs isSignIn={isSignIn} />
    </div>
  );
}

export default SignInUp;
