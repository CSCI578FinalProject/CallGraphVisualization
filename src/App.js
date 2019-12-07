import React, { useState } from 'react';
import { Row, Col, Layout } from 'antd';
import Graph from './components/Graph';
import 'antd/dist/antd.css';

const { Header, Content, Footer } = Layout;

function App() {
  const [selectedId, setSelectedId] = useState('-1');

  const handleNodeClick = item => {
    const model = item.getModel();
    setSelectedId(model.id);
  };

  return (
    <div className="App">
      <Layout>
        <Header>
          <h1 style={{ color: 'white' }}>Call Graph Visualization</h1>
        </Header>
        <Content
          style={{
            background: '#fff',
            margin: '24px 16px 0'
          }}
        >
          <Row>
            <Graph
              style={{
                border: '1px solid black',
                width: '100%',
                height: '800px'
              }}
              handleNodeClick={handleNodeClick}
            ></Graph>
          </Row>
        </Content>
      </Layout>
    </div>
  );
}

export default App;
