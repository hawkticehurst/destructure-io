import React from 'react';
import { useHistory } from "react-router-dom";

function Hero() {
  const history = useHistory();

  const onClickHeroBtn = () => {
    history.push('/learn');
  };

  const onClickHeroChevron = () => {
    const linkedList = document.getElementById('linked-list');
    if (linkedList != null) {
      linkedList.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="landing-hero-container">
      <h1>An interactive visualization platform for learning data structures.</h1>
      <button onClick={onClickHeroBtn} className="hero-btn">
        <span className="bold">Get Started</span> – It's free!
      </button>
      <span id="chevron" className="hero-circle" onClick={onClickHeroChevron}>
        <img src={require('./images/arrow-down.svg')} alt="Arrow Down Icon" />
      </span>
    </div>
  );
}

export default Hero;
