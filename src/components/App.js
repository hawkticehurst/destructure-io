import React from 'react';
import LearningModule from './LearningModule';
import NavBar from './common/NavBar';
import '../App.css';

function App() {
  return (
    <div className="App">
      {/* TODO going to put some form of routing here eventually */}
      <NavBar brandTitle="Node Warrior" />
      <LearningModule />
    </div>
  );
}

export default App;
