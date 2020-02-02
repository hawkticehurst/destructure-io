import React from 'react';
import TwoPaneResizable from './common/TwoPaneResizable';
import CodeDisplay from './code-display/CodeDisplay';
import '../App.css';

// TODO Remove this. We will probably want to load these in from some submodule component later
import data from "../code-files/example.json";

function App() {
  return (
    <div className="App">
      {/* TODO these inline styles are just temporary */}
      <div style={{margin: "5px", border: "solid black 2px", height: "90vh"}}>
        <TwoPaneResizable
          firstComponent={
            <TwoPaneResizable
              firstComponent={
                <div>
                  Text explanation going here
                </div>
              }
              secondComponent={
                <div>
                  <CodeDisplay language="java" codeData={data} />
                </div>
              }
              initialStartSize={30}
              splitHorizontal={true}
              />
          }
          secondComponent={
            <div>
              Visualization here
            </div>
          }
          initialStartSize={40}
           />
      </div>
    </div>
  );
}

export default App;
