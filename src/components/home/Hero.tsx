import React from "react";
import { useHistory } from "react-router-dom";
import DownArrowIcon from "./images/arrow-down.svg";

type Props = {
  landing?: boolean;
};

function Hero({ landing }: Props) {
  const history = useHistory();

  const onClickHeroBtn = () => {
    history.push("/learn");
  };

  const onClickHeroChevron = () => {
    const linkedList = document.getElementById("linked-list");
    if (linkedList != null) {
      linkedList.scrollIntoView({ behavior: "smooth" });
    }
  };

  const button = !landing ? (
    <button onClick={onClickHeroBtn} className="hero-btn">
      <span className="bold">Get Started</span> – It's free!
    </button>
  ) : null;

  return (
    <div className="landing-hero-container">
      <h1>
        An interactive visualization platform for learning data structures.
      </h1>
      {button}
      <span id="chevron" className="hero-circle" onClick={onClickHeroChevron}>
        <img src={DownArrowIcon} alt="Arrow Down Icon" />
      </span>
    </div>
  );
}

export default Hero;
