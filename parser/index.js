const fs = require('fs');
const readline = require('readline');
const filename = process.argv[2] || './call_graph_60_no_param.txt';
const outputName = process.argv[3] || 'graph';

const reader = readline.createInterface({
  input: fs.createReadStream(filename)
});

const nodes = {
  root: {
    id: -1,
    name: 'root'
  }
};
const edges = [];
let count = 1;

const shouldFilterOut = name => {
  if (
    name.indexOf('java.') !== -1 ||
    name.indexOf('javax.') !== -1 ||
    name.indexOf('org.eclipse.') !== -1
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
        value: 1
      };
    }

    if (!nodes[callee]) {
      nodes[callee] = {
        id: `${count++}`,
        name: callee,
        value: 1
      };
    }
    nodes[caller].value++;
    nodes[callee].value++;
    edges.push({
      source: nodes[caller].id,
      target: nodes[callee].id
    });
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
        value: 1
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
        value: 1
      };
    }
    nodes[className].value++;
    nodes[methodName].value++;
    edges.push({
      source: nodes[className].id,
      target: nodes[methodName].id
    });
  }
});

reader.on('close', function() {
  const seenId = {};
  const seenName = {};
  const nodeArray = Object.keys(nodes).map(key => nodes[key]);
  for (let node of nodeArray) {
    if (!seenName[node.name]) {
      seenName[node.name] = true;
    } else {
      console.log('hasDuplication');
    }
  }
  const result = JSON.stringify({ nodes: nodeArray, edges });
  fs.writeFile(`${outputName}.json`, result, err => {
    err && console.log(err);
  });
});

// fs.readFile(filename, 'utf8', (err, data) => {
//   if (err) {
//     console.log(err);
//     return;
//   }
//   data = data.replace(/[\u0001-\u0006\u0008-\u0009\u000B-\u001A]/g, '');
//   const parts = data.split('\n').map(s => s.split(' '));
//   const map = {};
//   for (let part of parts) {
//     const cluster = part[1];
//     if (!cluster) {
//       continue;
//     }
//     const element = part[2];
//     if (!map[cluster]) {
//       map[cluster] = [];
//     }
//     map[cluster].push(element);
//   }

//   const tableData = [['Cluster', 'Elements']];
//   for (let key of Object.keys(map)) {
//     let elements = map[key].join('\n');
//     tableData.push([key, elements]);
//   }

//   fs.writeFile(`${outputName}.json`, result, err => {
//     err && console.log(err);
//   });
// });
