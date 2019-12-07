const fs = require('fs');
const readline = require('readline');
const filename = process.argv[2] || './call_graph_60_no_param.txt';
const outputName = process.argv[3] || 'graph';

const reader = readline.createInterface({
  input: fs.createReadStream(filename)
});

const nodes = {
  root: {
    id: '-1',
    name: 'root',
    value: 0,
    children: {}
  }
};
const edges = [];
let count = 1;

const shouldFilterOut = name => {
  if (
    name.indexOf('java.') !== -1 ||
    name.indexOf('javax.') !== -1 ||
    name.indexOf('org.eclipse.') !== -1 ||
    name.indexOf('.compiler') !== -1
  ) {
    return true;
  }
  return false;
};

reader.on('line', function(line) {
  if (!line) {
    return;
  }
  if (line.startsWith('M:')) {
    line = line.substring(2).trim();
    parts = line.split('*');
    const caller = parts[0];
    const callee = parts[2];
    if (shouldFilterOut(caller) || shouldFilterOut(callee)) {
      return;
    }
    if (!nodes[caller]) {
      nodes[caller] = {
        id: `${count++}`,
        name: caller,
        value: 1,
        children: { [callee]: true }
      };
    }

    if (!nodes[callee]) {
      nodes[callee] = {
        id: `${count++}`,
        name: callee,
        value: 1,
        children: {}
      };
    }
    nodes[caller].value++;
    if (!nodes[caller].children[callee]) {
      nodes[caller].children[callee] = true;
      edges.push({
        source: nodes[caller].id,
        target: nodes[callee].id
      });
    }
  } else if (line.startsWith('contains:')) {
    line = line.substring(9).trim();
    parts = line.split('*');
    const className = parts[0];
    const methodName = parts[1];
    if (shouldFilterOut(className) || shouldFilterOut(methodName)) {
      return;
    }
    if (!nodes[className]) {
      nodes[className] = {
        id: `${count++}`,
        name: className,
        value: 1,
        children: { [methodName]: true }
      };
      edges.push({
        source: -1,
        target: nodes[className].id
      });
    }

    if (!nodes[methodName]) {
      nodes[methodName] = {
        id: `${count++}`,
        name: methodName,
        value: 1,
        children: {}
      };
    }
    nodes[className].value++;
    if (!nodes[className].children[methodName]) {
      nodes[className].children[methodName] = true;
      edges.push({
        source: nodes[className].id,
        target: nodes[methodName].id
      });
    }
  }
});

reader.on('close', function() {
  const seenId = {};
  const nodeArray = Object.keys(nodes).map(key => {
    nodes[key].children = Object.keys(nodes[key].children);
    return nodes[key];
  });
  console.log(`Number of nodes: ${nodeArray.length}`);
  console.log(`Number of edges: ${edges.length}`);
  const result = JSON.stringify({ nodes: nodeArray, edges });
  fs.writeFile(`${outputName}.json`, result, err => {
    err && console.log(err);
  });
});
