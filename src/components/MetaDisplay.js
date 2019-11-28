import React from 'react';

export default function MetaDisplay(props) {
  const { selectedId, metaData, ...rest } = props;
  const selectedItem = metaData[selectedId];
  return (
    <div {...rest}>
      {selectedItem
        ? selectedItem.message
        : 'Select a node to view source code'}
    </div>
  );
}
