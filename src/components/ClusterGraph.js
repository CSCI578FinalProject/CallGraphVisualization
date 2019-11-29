import React, { useEffect, useState, useRef } from 'react';
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
  const ref = useRef(null);
  const graphRef = useRef(null);

  const { style, data, handleNodeClick, ...rest } = props;

  const bindEvents = () => {
    if (graphRef.current) {
      graphRef.current.on('node:click', e => {
        const { item } = e;
        console.log(item.getModel());
        handleNodeClick && handleNodeClick(item);
      });
    }
  };

  useEffect(() => {
    const calculatedWidth = ref.current.clientWidth || defaultContainerWidth;
    const calculatedHeight = ref.current.clientHeight || defaultContainerHeight;

    if (!graphRef.current) {
      graphRef.current = new G6.graphRef.current({
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
            },
            {
              type: 'collapse-expand-group',
              trigger: 'click'
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

    graphRef.current.data(data);

    graphRef.current.render();

    const edges = graphRef.current.getEdges();
    graphRef.current.paint();
  }, [data]);

  return <div ref={ref} style={style} {...rest}></div>;
}
