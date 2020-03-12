import React from 'react';
import { useHistory } from "react-router-dom";
import { useFirebaseUser } from '../../hooks/user';

function Hero() {
  const user = useFirebaseUser();
  const history = useHistory();

  const onClickHeroBtn = () => {
    if (user == null) {
      history.push('/signup');
    } else {
      history.push('/learn');
    }
  };

  return (
    <div className="landing-hero-container">
      <h1>An interactive visualization platform for learning data structures.</h1>
      <button onClick={onClickHeroBtn} className="hero-btn">
        <span className="bold">Get Started</span> – It's free!
      </button>
      <a id="chevron" className="hero-circle" href="#linked-list">
        <img src={require('./images/arrow-down.svg')} alt="Arrow Down Icon" />
      </a>
    </div>
  );
}

export default Hero;
