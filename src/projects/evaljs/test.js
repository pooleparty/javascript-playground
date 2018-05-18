require('babel-register');
require('babel-polyfill');
const fs = require('fs');
const { parseScript, parseModule } = require('esprima');
const requireFromString = require('require-from-string');
const evaljs = require('./index');
const LinkedList = require('../data-structures/linked-list').default;
const stringify = require('../utils/stringify').default;

const DEBUG = true;

function run(iter) {
  let result = iter.next();
  while (!result.done) {
    result = iter.next();
  }
  return result.value;
}

function evaluate(env, fn) {
  const fnString = stringify(fn);
  // console.log('FUNCTION STRING:', fnString);
  const parsedScript = parseScript(fnString);
  // console.log('PARSED SCRIPT:', parsedScript);
  const iterator = env.execute(parsedScript)();
  run(iterator);
}

{
  const script =
    "(function makeList() { var ll = require('../data-structures/linked-list'); var list = new ll.default(); return list; })()";
  const envGlobal = {
    console,
  };
  envGlobal.global = global;
  const modLocal = {
    require,
  };
  const env = new evaljs.Environment([envGlobal, modLocal], DEBUG);
  env.on('GENERATE_NODE', (node) => {
    console.log(`${'-'.repeat(5)}GENERATE_NODE${'-'.repeat(5)}\n`, JSON.stringify(node.node, null, 2), '\n');
  });
  const list = new LinkedList();
  evaluate(env, list.append);
  // const iterator = env.execute(script)();
  // console.log(run(iterator));

  // const script2 = 'list.append(1); console.log(list);';
  // const iterator2 = env.execute(script2)();
  // run(iterator2);
}

// // basic
// console.log(evaljs.evaluate('1 + 1'));

// let env = new evaljs.Environment([{ console }]);

// // theTest.js
// {
//   const code = fs.readFileSync('theTest.js', { encoding: 'UTF-8' });
//   const parsedCode = parseScript(code, { loc: true });
//   const iter1 = env.execute(parsedCode)();
//   run(iter1);
// }

// webpack index.js
// {
//   const code = fs.readFileSync('./build/index.js', { encoding: 'UTF-8' });
//   const script =
//     "var evaljs = requireFromString(code); console.log('evaljs', evaljs); console.log(evaljs.evaluate('30 + 4'));";
//   const envGlobal = {
//     code,
//     console,
//   };
//   envGlobal.global = global;
//   const modLocal = {
//     requireFromString,
//   };
//   const env = new evaljs.Environment([envGlobal, modLocal]);
//   const iter2New = env.execute(script)();
//   run(iter2New);
// }

// // babel index.js
// {
//   const code = fs.readFileSync('./index-compiled.js', { encoding: 'UTF-8' });
//   const script =
//     "var evaljs = requireFromString(code); console.log('evaljs', evaljs); console.log(evaljs.evaluate('30 + 4'));";
//   const envGlobal = {
//     code,
//     console,
//   };
//   envGlobal.global = global;
//   const modLocal = {
//     requireFromString,
//   };
//   const env = new evaljs.Environment([envGlobal, modLocal], true);
//   // env.on('line', (line) => {
//   //   console.log('line:', line, '\n');
//   // });
//   const iter2New = env.execute(script)();
//   run(iter2New);
// }

// // esprima.js
// {
//   const code = fs.readFileSync(require.resolve('esprima'), { encoding: 'UTF-8' });
//   const envGlobal = { code };
//   const envModules = { requireFromString };
//   env = new evaljs.Environment([envGlobal, envModules]);

//   // load library
//   const iter3 = env.execute('var esprima = requireFromString(code);')();
//   run(iter3);

//   // parse file
//   const iter4 = env.execute("esprima.parse('1 + 1');")();
//   const parsed = run(iter4);

//   // for bonus points: run the parsed expression
//   const iter5 = env.execute(parsed)();
//   console.log(run(iter5));
// }
