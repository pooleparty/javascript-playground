require('babel-register');
require('babel-polyfill');
const fs = require('fs');
const recast = require('recast');
const requireFromString = require('require-from-string');
const LinkedList = require('../data-structures/linked-list').default;
const Instrumenter = require('./instrumentor');
const stringify = require('../utils/stringify').default;

const filename = 'list-covered.js';

function testCovered(covered) {
  const CoveredLinkedList = require(`./${filename}`).default;
  const list = new CoveredLinkedList();
  list.on('NODE_STEP', (e) => {
    console.log(e);
  });
  list.append(1);
  console.log(list);
}

const instrumenter = new Instrumenter({
  debug: false,
  walkDebug: false,
  coverageVariable: '__coverage__',
  codeGenerationOptions: undefined,
  noAutoWrap: false,
  noCompact: false,
  embedSource: false,
  preserveComments: false,
  esModules: true,
});

const code = fs.readFileSync('../data-structures/linked-list/index.js', { encoding: 'UTF-8' });
const covered = instrumenter.instrumentSync(code, 'append');

fs.writeFile(filename, covered, (e) => {
  if (e) {
    console.error(e);
  } else {
    console.log('File write finished.');
    testCovered(covered);
  }
});
