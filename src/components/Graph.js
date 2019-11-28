import React, { useEffect, useState } from 'react';
import G6 from '@antv/g6';
import insertCss from 'insert-css';

import { defaultContainerWidth, defaultContainerHeight } from '../constants';

insertCss(`
  .g6-tooltip {
    border: 1px solid #e2e2e2;
    border-radius: 4px;
    font-size: 12px;
    color: #000;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 10px 8px;
    box-shadow: rgb(174, 174, 174) 0px 0px 10px;
  }
`);

export default function Graph(props) {
  const ref = React.useRef(null);
  let graph = null;

  const { style, data, handleNodeClick, ...rest } = props;

  const bindEvents = () => {
    if (graph) {
      graph.on('node:click', e => {
        const { item } = e;
        console.log(item.getModel());
        handleNodeClick && handleNodeClick(item);
      });
    }
  };

  useEffect(() => {
    const calculatedWidth = ref.current.clientWidth || defaultContainerWidth;
    const calculatedHeight = ref.current.clientHeight || defaultContainerHeight;

    if (!graph) {
      graph = new G6.Graph({
        container: ref.current,
        width: calculatedWidth,
        height: calculatedHeight,
        fitView: true,
        modes: {
          default: [
            'drag-canvas',
            'zoom-canvas',
            'activate-relations',
            {
              type: 'tooltip',
              formatText: model => {
                return model.label;
              }
            }
          ]
        },
        layout: {
          type: 'dagre'
        },
        defaultEdge: {
          size: 1,
          style: {
            stroke: '#e2e2e2'
          }
        },
        nodeStateStyles: {
          active: {
            opacity: 1
          },
          inactive: {
            opacity: 0.2
          }
        },
        edgeStateStyles: {
          active: {
            stroke: '#999'
          }
        }
      });
      bindEvents();
    }

    graph.data(data);

    graph.render();

    const edges = graph.getEdges();
    graph.paint();
  }, [data]);

  return <div ref={ref} style={style} {...rest}></div>;
}
