import React, { useState } from 'react';
import Graph from './components/Graph';
import { data, metaData } from './mock/data';
import MetaDisplay from './components/MetaDisplay';

function App() {
  const [selectedId, setSelectedId] = useState('-1');

  const handleNodeClick = item => {
    const model = item.getModel();
    setSelectedId(model.id);
  };

  return (
    <div className="App">
      <Graph
        style={{ border: '1px solid black' }}
        data={data}
        handleNodeClick={handleNodeClick}
      ></Graph>
      <MetaDisplay selectedId={selectedId} metaData={metaData}></MetaDisplay>
    </div>
  );
}

export default App;
