import React, { useEffect, useState, useRef } from 'react';
import echarts from 'echarts';
import 'echarts-gl';
import 'echarts-graph-modularity';

export default function Graph(props) {
  const ref = useRef();
  const graphRef = useRef();

  const { style, handleNodeClick, ...rest } = props;

  const bindEvents = () => {};
  const loadGraph = async graph => {
    const response = await fetch('http://localhost:8080/graph.json', {
      mode: 'cors'
    });
    const data = await response.json();
    const nodes = data.nodes;
    let edges = data.edges;

    const nodeIndexMap = {};

    nodes.forEach(function(node, index) {
      // if (node.value > 100) {
      // node.emphasis = {
      //   label: {
      //     show: true
      //   }
      // };
      // }
      if (node.value > 30) {
        node.label = {
          show: true
        };
      }
      nodeIndexMap[node.id] = index;
    });
    edges = edges.filter(
      edge =>
        nodeIndexMap[edge.source] !== undefined &&
        nodeIndexMap[edge.target] !== undefined
    );
    edges = edges.map(edge => ({
      source: nodeIndexMap[edge.source],
      target: nodeIndexMap[edge.target]
    }));
    console.log(nodes, edges);
    graph.setOption({
      backgroundColor: '#000',
      series: [
        {
          color: [
            'rgb(203,239,15)',
            'rgb(73,15,239)',
            'rgb(15,217,239)',
            'rgb(30,15,239)',
            'rgb(15,174,239)',
            'rgb(116,239,15)',
            'rgb(239,15,58)',
            'rgb(15,239,174)',
            'rgb(239,102,15)',
            'rgb(239,15,15)',
            'rgb(15,44,239)',
            'rgb(239,145,15)',
            'rgb(30,239,15)',
            'rgb(239,188,15)',
            'rgb(159,239,15)',
            'rgb(159,15,239)',
            'rgb(15,239,44)',
            'rgb(15,239,87)',
            'rgb(15,239,217)',
            'rgb(203,15,239)',
            'rgb(239,15,188)',
            'rgb(239,15,102)',
            'rgb(239,58,15)',
            'rgb(239,15,145)',
            'rgb(116,15,239)',
            'rgb(15,131,239)',
            'rgb(73,239,15)',
            'rgb(15,239,131)',
            'rgb(15,87,239)',
            'rgb(239,15,231)'
          ],
          type: 'graphGL',
          nodes: nodes,
          edges: edges,
          modularity: {
            resolution: 2,
            sort: true
          },
          lineStyle: {
            color: 'rgba(255,255,255,1)',
            opacity: 0.05,
            width: 1
          },
          itemStyle: {
            opacity: 1
            // borderColor: '#fff',
            // borderWidth: 1
          },
          focusNodeAdjacency: false,
          focusNodeAdjacencyOn: 'click',
          symbolSize: function(value = 0) {
            return Math.sqrt(value / 2);
          },
          label: {
            textStyle: {
              color: '#fff'
            }
          },
          emphasis: {
            label: {
              show: true
            },
            lineStyle: {
              opacity: 0.5,
              width: 1
            }
          },
          forceAtlas2: {
            steps: 5,
            maxSteps: 3000,
            jitterTolerence: 10,
            edgeWeight: [0.2, 1],
            gravity: 5,
            edgeWeightInfluence: 0,
            GPU: true
            // preventOverlap: true
          }
        }
      ]
    });
  };

  useEffect(() => {
    console.log(graphRef.current);
    if (!graphRef.current) {
      graphRef.current = echarts.init(ref.current);
      loadGraph(graphRef.current);
    }
  }, []);

  return <div ref={ref} style={style} {...rest}></div>;
}
