import React, { useState } from 'react';
import { Row, Col, Layout } from 'antd';
import Graph from './components/Graph';
import { data, metaData } from './mock/data';
import MetaDisplay from './components/MetaDisplay';
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
        <Header>Call Graph Visualization</Header>
        <Content
          style={{
            background: '#fff',
            margin: '24px 16px 0'
          }}
        >
          <Row>
            <Col span={16}>
              <Graph
                style={{ border: '1px solid black' }}
                data={data}
                handleNodeClick={handleNodeClick}
              ></Graph>
            </Col>
            <Col span={8}>
              <MetaDisplay
                selectedId={selectedId}
                metaData={metaData}
              ></MetaDisplay>
            </Col>
          </Row>
        </Content>
        <Footer>footer</Footer>
      </Layout>
    </div>
  );
}

export default App;
