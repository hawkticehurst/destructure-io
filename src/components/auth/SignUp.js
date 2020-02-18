import React from 'react';

function SignUp() {

	const INITIAL_STATE = {
    email: '',
    password: '',
    error: null,
	};

	isValidEmail = email => {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  onSubmit = event => {
    event.preventDefault();
    const { email, password} = this.state;
    if (!this.isValidEmail(email)) {
        alert("Invalid email address");
        return;
    } else {
      this.props.firebase
      .doCreateUserWithEmailAndPassword(email, password)
      .then(authUser => {
          this.setState({ ...INITIAL_STATE });
          console.log("signed in redirect them....");
          this.props.history.push('/home'); 
          return true;
      })
      .catch(error => {
          console.log(error);
          this.setState({ error });
      });
    }
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  return (
    <div>Sign Up</div>
    <p>Enter your email and password below to sign up</p>
      <form class="accForm" onSubmit={this.onSubmit}>
        <input
	        name="email"
	        value={email}
	        onChange={this.onChange}
	        type="text"
	        placeholder="Email Address"
        />
        <input
	        name="password"
	        value={password}
	        onChange={this.onChange}
	        type="password"
	        placeholder="Password"
        />
        <button id="signupButton" type="submit">Sign Up</button>
        {error && <p>{error.message}</p>}
      </form>
  );
}

export default SignUp;
