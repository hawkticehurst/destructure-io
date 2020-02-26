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
      <h1>Node Warrior</h1>
      <p>
        An interactive visualization platform for learning data structures.
      </p>
      <button onClick={onClickHeroBtn} className="hero-btn">
        <span className="bold">Get Started</span> – It's free!
      </button>
      <div id="chevron" className="hero-circle">
        <span className="bold">&#8675;</span>
      </div>
    </div>
  );
}

export default Hero;
