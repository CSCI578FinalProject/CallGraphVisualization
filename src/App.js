import React from 'react';
import Graph from './components/Graph';
import { data } from './mock/data';

function App() {
  return (
    <div className="App">
      <Graph style={{ border: '1px solid black' }} data={data}></Graph>
    </div>
  );
}

export default App;
