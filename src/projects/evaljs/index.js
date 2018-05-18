/* eslint-disable no-bitwise */
/* eslint-disable no-void */
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint-disable no-return-assign */
/* eslint-disable class-methods-use-this */
import { EventEmitter } from 'events';
import { parse } from 'esprima';

// TODO:
// - LabeledStatement -> including use in break/continue
// - nicer error handling?
// -> TESTS
// -> BENCHMARKS

const noop = () => {};

function execute(func) {
  const result = func();
  if (result == null) {
    return result;
  }
  // FIXME: Convert to yield*
  // yield* delegates to another generator or iterable object

  if (result !== undefined) {
    if (result.next) {
      const iter = result;
      let res = iter.next();
      while (!res.done) {
        res = iter.next();
      }
      return res.value;
    }
  }
  return result;
}

function Arguments() {
  // TODO: add es3 'arguments.callee'?
}

Arguments.prototype.toString = () => '[object Arguments]';

function Return(val) {
  this.value = val;
}

function createVarStore(parent, vars) {
  vars = vars || {};
  return {
    parent,
    vars,
  };
}

function addDeclarationsToStore(declarations, varStore) {
  Object.keys(declarations).forEach((key) => {
    if (!Object.keys(varStore.vars).includes(key)) {
      varStore.vars[key] = declarations[key]();
    }
  });
}

// need something unique to compare a against.
const Break = {};
const Continue = {};

export class Environment extends EventEmitter {
  constructor(globalObjects, debug = false) {
    super();
    if (!Array.isArray(globalObjects)) {
      globalObjects = [globalObjects];
    }
    let parent;
    globalObjects.forEach((vars) => {
      parent = createVarStore(parent, vars);
    });
    // the topmost store is our current store
    this.currentVariableStore = parent;
    this.currentDeclarations = {};
    [this.globalObject] = globalObjects;
    this.currentThis = this.globalObject;
    this.boundGenerate = this.generate.bind(this);
    this.DEBUG = debug;
    this.DELAY = 0;
    this.STATE = 'running';
  }

  execute(node) {
    const opts = {
      loc: true,
    };
    if (typeof node === 'string') {
      node = parse(node, opts);
    }
    const resp = this.generate(node);
    addDeclarationsToStore(this.currentDeclarations, this.currentVariableStore);
    this.currentDeclarations = {};
    return resp;
  }

  generate(node) {
    const closure = (
      {
        BinaryExpression: this.generateBinaryExpression,
        LogicalExpression: this.generateBinaryExpression,
        UnaryExpression: this.generateUrnaryExpression,
        UpdateExpression: this.generateUpdateExpression,
        ObjectExpression: this.generateObjectExpression,
        ArrayExpression: this.generateArrayExpression,
        CallExpression: this.generateCallExpression,
        NewExpression: this.generateNewExpression,
        MemberExpression: this.generateMemberExpression,
        ThisExpression: this.generateThisExpression,
        SequenceExpression: this.generateSequenceExpression,
        Literal: this.generateLiteral,
        Identifier: this.generateIdentifier,
        AssignmentExpression: this.generateAssignExpression,
        FunctionDeclaration: this.generateFunctionDeclaration,
        VariableDeclaration: this.generateVariableDeclaration,
        BlockStatement: this.generateBlockStatement,
        Program: this.generateBlockStatement,
        ExpressionStatement: this.generateExpressionStatement,
        EmptyStatement: this.generateEmptyStatement,
        ReturnStatement: this.generateReturnStatement,
        FunctionExpression: this.generateFunctionExpression,
        IfStatement: this.generateIfStatement,
        ConditionalExpression: this.generateConditionalExpression,
        ForStatement: this.generateLoopStatement,
        WhileStatement: this.generateLoopStatement,
        DoWhileStatement: this.generateDoWhileStatement,
        ForInStatement: this.generateForInStatement,
        WithStatement: this.generateWithStatement,
        ThrowStatement: this.generateThrowStatement,
        TryStatement: this.generateTryStatement,
        ContinueStatement: this.generateContinueStatement,
        BreakStatement: this.generateBreakStatement,
        SwitchStatement: this.generateSwitchStatement,
      }[node.type] ||
      function fallback() {
        console.warn(`Not implemented yet: ${node.type}`);
        return noop;
      }
    ).call(this, node);

    this.emit('GENERATE_NODE', {
      node,
      declarations: this.currentDeclarations,
      variables: this.currentVariableStore,
    });

    if (this.DEBUG) {
      return function debug() {
        // let info = `closure for ${node.type} called`;
        // const { line } = (node.loc || {}).start || {};
        // if (line) {
        //   info += `\n\twhile processing line ${line}`;
        // }
        // const resp = closure();
        // info += '. \n\tResult:';
        // console.log(info, resp, '\n\tNode:', node);
        // console.log();
        // return resp;
        console.log(JSON.stringify(node), '\n');
        return closure();
      };
    }
    return closure;
  }

  generateBinaryExpression(node) {
    const a = this.generate(node.left);
    const b = this.generate(node.right);

    function* callExpr(expr) {
      let result;
      if (expr.constructor.name === 'GeneratorFunction') {
        result = yield* expr();
      } else {
        result = expr();
      }
      return result;
    }

    const cmp = {
      '==': function* doubleEqual() {
        // eslint-disable-next-line eqeqeq
        return (yield* callExpr(a)) == (yield* callExpr(b));
      },
      '!=': function* notDoubleEqual() {
        // eslint-disable-next-line eqeqeq
        return (yield* callExpr(a)) != (yield* callExpr(b));
      },
      '===': function* tripleEqual() {
        return (yield* callExpr(a)) === (yield* callExpr(b));
      },
      '!==': function* notTripleEqual() {
        return (yield* callExpr(a)) !== (yield* callExpr(b));
      },
      '<': function* lessThan() {
        return (yield* callExpr(a)) < (yield* callExpr(b));
      },
      '<=': function* lessThanOrEqualTo() {
        return (yield* callExpr(a)) <= (yield* callExpr(b));
      },
      '>': function* greaterThan() {
        return (yield* callExpr(a)) > (yield* callExpr(b));
      },
      '>=': function* greaterThanOrEqualTo() {
        return (yield* callExpr(a)) >= (yield* callExpr(b));
      },
      '<<': function* leftShift() {
        return (yield* callExpr(a)) << (yield* callExpr(b));
      },
      '>>': function* rightShift() {
        return (yield* callExpr(a)) >> (yield* callExpr(b));
      },
      '>>>': function* zeroFillRightShift() {
        return (yield* callExpr(a)) >>> (yield* callExpr(b));
      },
      '+': function* add() {
        return (yield* callExpr(a)) + (yield* callExpr(b));
      },
      '-': function* subtract() {
        return (yield* callExpr(a)) - (yield* callExpr(b));
      },
      '*': function* multiply() {
        return (yield* callExpr(a)) * (yield* callExpr(b));
      },
      '/': function* divide() {
        return (yield* callExpr(a)) / (yield* callExpr(b));
      },
      '%': function* remainder() {
        return (yield* callExpr(a)) % (yield* callExpr(b));
      },
      '|': function* bitwiseOr() {
        return (yield* callExpr(a)) | (yield* callExpr(b));
      },
      '^': function* bitwiseXor() {
        return (yield* callExpr(a)) ^ (yield* callExpr(b));
      },
      '&': function* bitwiseAnd() {
        return (yield* callExpr(a)) & (yield* callExpr(b));
      },
      * in() {
        return (yield* callExpr(a)) in (yield* callExpr(b));
      },
      * instanceof() {
        return (yield* callExpr(a)) instanceof (yield* callExpr(b));
      },
      // logic expressions
      '||': function* logicalOr() {
        return (yield* callExpr(a)) || (yield* callExpr(b));
      },
      '&&': function* logicalAnd() {
        return (yield* callExpr(a)) && (yield* callExpr(b));
      },
    }[node.operator];

    return function exec() {
      // FIXME: Convert to yield*
      const iter = cmp();
      let res = iter.next();
      while (!res.done) {
        res = iter.next();
      }
      return res.value;
    };
  }

  generateUrnaryExpression(node) {
    if (node.operator === 'delete') {
      return this.generateDelete(node);
    }
    const a = this.generate(node.argument);
    const op = {
      '-': function negate() {
        return -a();
      },
      '+': function plus() {
        return +a();
      },
      '!': function not() {
        return !a();
      },
      '~': function pluOneAndNegate() {
        return ~a();
      },
      typeof() {
        return typeof a();
      },
      void() {
        return void a();
      },
    }[node.operator];

    return function execOp() {
      return op();
    };
  }

  generateUpdateExpression(node) {
    const self = this;
    const update = {
      '--true': function decrementPrefix(obj, name) {
        // eslint-disable-next-line no-plusplus
        return --obj[name];
      },
      '--false': function decrementPostfix(obj, name) {
        // eslint-disable-next-line no-plusplus
        return obj[name]--;
      },
      '++true': function incrementPrefix(obj, name) {
        // eslint-disable-next-line no-plusplus
        return ++obj[name];
      },
      '++false': function incrementPostfix(obj, name) {
        // eslint-disable-next-line no-plusplus
        return obj[name]++;
      },
    }[node.operator + node.prefix];
    const obj = this.generateObject(node.argument);
    const name = this.generateName(node.argument);
    return function* exec() {
      self.emit('line', node.loc.start.line);
      yield;
      return update(obj(), name());
    };
  }

  generateAssignExpression(node) {
    const self = this;
    const setter = {
      '=': function assignment(obj, name, val) {
        return (obj[name] = val);
      },
      '+=': function additionAssignment(obj, name, val) {
        return (obj[name] += val);
      },
      '-=': function subtractionAssignment(obj, name, val) {
        return (obj[name] -= val);
      },
      '*=': function multiplicationAssignment(obj, name, val) {
        return (obj[name] *= val);
      },
      '/=': function divisionAssignment(obj, name, val) {
        return (obj[name] /= val);
      },
      '%=': function remainderAssignment(obj, name, val) {
        return (obj[name] %= val);
      },
      '<<=': function leftShiftAssignment(obj, name, val) {
        return (obj[name] <<= val);
      },
      '>>=': function rightShiftAssignment(obj, name, val) {
        return (obj[name] >>= val);
      },
      '>>>=': function unsignedRightShiftAssignment(obj, name, val) {
        return (obj[name] >>>= val);
      },
      '|=': function bitwiseOrAssignment(obj, name, val) {
        return (obj[name] |= val);
      },
      '^=': function bitwiseXorAssignment(obj, name, val) {
        return (obj[name] ^= val);
      },
      '&=': function bitwiseAndAssignment(obj, name, val) {
        return (obj[name] &= val);
      },
    }[node.operator];
    const obj = this.generateObject(node.left);
    const name = this.generateName(node.left);
    const val = this.generate(node.right);

    return function* exec() {
      self.emit('line', node.left.loc.start.line);
      let v = val();
      if (v !== undefined) {
        if (v.next) {
          v = yield* v;
        }
      }
      return setter(obj(), name(), v);
    };
  }

  generateDelete(node) {
    const obj = this.generateObject(node.argument);
    const attr = this.generateName(node.argument);

    return function exec() {
      return delete obj()[attr()];
    };
  }

  generateObjectExpression(node) {
    // TODO: property.kind: don't assume init when it can also be set/get
    const self = this;
    const items = [];
    node.properties.forEach((property) => {
      // object expression keys are static so can be calculated
      // immediately
      const key = self.objectKey(property.key)();
      items.push({
        key,
        getVal: self.generate(property.value),
      });
    });

    return function exec() {
      const result = {};
      items.forEach((item) => {
        result[item.key] = item.getVal();
      });
      return result;
    };
  }

  generateArrayExpression(node) {
    const items = node.elements.map(this.boundGenerate);

    return function exec() {
      return items.map(execute);
    };
  }

  objectKey(node) {
    let key;
    if (node.type === 'Identifier') {
      key = node.name;
    } else {
      key = this.generate(node)();
    }

    return function exec() {
      return key;
    };
  }

  generateCallExpression(node) {
    const self = this;
    let callee;
    if (node.callee.type === 'MemberExpression') {
      const obj = self.generateObject(node.callee);
      const name = self.generateName(node.callee);
      callee = () => {
        const theObj = obj();
        return theObj[name()].bind(theObj);
      };
    } else {
      callee = self.generate(node.callee);
    }
    const args = node.arguments.map(self.generate.bind(self));

    return function* exec() {
      self.emit('line', node.loc.start.line);
      const c = callee();

      if (c === undefined) {
        return c;
      }

      let result;
      let res;

      if (c.next) {
        res = yield* c;
        result = res.apply(self.globalObject, args.map(execute));
      } else {
        result = c.apply(self.globalObject, args.map(execute));
      }

      if (result !== undefined) {
        if (result.next) {
          res = yield* result;
          return res;
        }
      }
      return result;
    };
  }

  generateNewExpression(node) {
    const callee = this.generate(node.callee);
    const args = node.arguments.map(this.boundGenerate);

    return function* exec() {
      const cl = callee();
      const ar = args.map(execute);
      const newObject = Object.create(cl.prototype);
      const constructor = cl.apply(newObject, ar);
      yield* constructor;
      return newObject;
    };
  }

  generateMemberExpression(node) {
    const obj = this.generate(node.object);
    const property = this.memberExpressionProperty(node);

    return function exec() {
      return obj()[property()];
    };
  }

  memberExpressionProperty(node) {
    return node.computed ? this.generate(node.property) : this.objectKey(node.property);
  }

  generateFunctionExpression(node) {
    const self = this;

    const oldDeclarations = self.currentDeclarations;
    self.currentDeclarations = {};
    const body = self.generate(node.body);
    const declarations = self.currentDeclarations;
    self.currentDeclarations = oldDeclarations;

    // reset var store
    return function exec() {
      const parent = self.currentVariableStore;
      return function* execGen(...argus) {
        // build arguments object
        const args = new Arguments();
        args.length = arguments.length;
        for (let i = 0; i < arguments.length; i++) {
          args[i] = argus[i];
        }

        // switch interpreter 'stack'
        const oldStore = self.currentVariableStore;
        const oldThis = self.currentThis;
        self.currentVariableStore = createVarStore(parent);
        self.currentThis = this;

        addDeclarationsToStore(declarations, self.currentVariableStore);
        self.currentVariableStore.vars.arguments = args;

        // add function args to var store
        node.params.forEach((param, i) => {
          self.currentVariableStore.vars[param.name] = args[i];
        });

        // run function body
        const result = yield* body();

        // switch 'stack' back
        self.currentThis = oldThis;
        self.currentVariableStore = oldStore;

        if (result instanceof Return) {
          return result.value;
        }
        return undefined;
      };
    };
  }

  generateThisExpression() {
    const self = this;

    return function exec() {
      return self.currentThis;
    };
  }

  generateSequenceExpression(node) {
    const exprs = node.expressions.map(this.boundGenerate);

    return function exec() {
      let result;
      exprs.forEach((expr) => {
        result = expr();
      });
      return result;
    };
  }

  generateObject(node) {
    if (node.type === 'Identifier') {
      return this.getVariableStore.bind(this, node.name);
    } else if (node.type === 'MemberExpression') {
      return this.generate(node.object);
    }
    console.warn(`Unknown generateObject() type: ${node.type}`);
    return noop;
  }

  generateName(node) {
    if (node.type === 'Identifier') {
      return function exec() {
        return node.name;
      };
    } else if (node.type === 'MemberExpression') {
      return this.memberExpressionProperty(node);
    }
    console.warn(`Unknown _genName() type: ${node.type}`);
    return noop;
  }

  generateLiteral(node) {
    return function exec() {
      return node.value;
    };
  }

  generateIdentifier(node) {
    const self = this;

    return function exec() {
      return self.getVariableStore(node.name)[node.name];
    };
  }

  getVariableStore(name) {
    let store = this.currentVariableStore;
    // eslint-disable-next-line no-cond-assign
    do {
      if (Object.keys(store.vars).includes(name)) {
        return store.vars;
      }
    } while ((store = store.parent));

    // global object as fallback
    return this.globalObject;
  }

  generateFunctionDeclaration(node) {
    this.currentDeclarations[node.id.name] = this.generateFunctionExpression(node);

    return function exec() {
      return noop;
    };
  }

  generateVariableDeclaration(node) {
    const assignments = [];

    for (let i = 0; i < node.declarations.length; i++) {
      const decl = node.declarations[i];
      this.currentDeclarations[decl.id.name] = noop;
      if (decl.init) {
        assignments.push({
          type: 'AssignmentExpression',
          operator: '=',
          left: decl.id,
          right: decl.init,
        });
      }
    }

    return this.generate({
      type: 'BlockStatement',
      body: assignments,
    });
  }

  getState() {
    return this.STATE;
  }

  setState(state) {
    this.STATE = state;
  }

  generateBlockStatement(node) {
    const self = this;
    const stmtClosures = node.body.map(stmt => self.generate(stmt));

    return function* exec() {
      let result;
      for (let i = 0; i < stmtClosures.length; i++) {
        if (stmtClosures[i].constructor.name === 'GeneratorFunction') {
          result = yield* stmtClosures[i]();
          yield;
        } else {
          result = stmtClosures[i]();
          yield;
        }
        if (result === Break || result === Continue || result instanceof Return) {
          break;
        }
      }
      // return last
      return result;
    };
  }

  generateExpressionStatement(node) {
    return this.generate(node.expression);
  }

  generateEmptyStatement() {
    return noop;
  }

  generateReturnStatement(node) {
    const self = this;
    const arg = node.argument ? this.generate(node.argument) : noop;

    return function exec() {
      self.emit('line', node.loc.start.line);
      return new Return(arg());
    };
  }

  generateIfStatement(node) {
    const self = this;
    const test = function test() {
      self.emit('line', node.loc.start.line);
      return self.generate(node.test)();
    };
    const consequent = this.generate(node.consequent);
    const alternate = node.alternate
      ? this.generate(node.alternate)
      : function alternateNoop() {
        return noop;
      };

    return function* exec() {
      const result = test() ? yield* consequent() : yield* alternate();
      return result;
    };
  }

  generateConditionalExpression(node) {
    const self = this;
    const test = function test() {
      self.emit('line', node.loc.start.line);
      return self.generate(node.test)();
    };
    const consequent = this.generate(node.consequent);
    const alternate = node.alternate ? this.generate(node.alternate) : noop;

    return function exec() {
      return test() ? consequent() : alternate();
    };
  }

  generateLoopStatement(node, body) {
    const self = this;
    const init = node.init
      ? this.generate(node.init)
      : function* initNoop() {
        return noop;
      };

    const test = node.test
      ? function* test() {
        self.emit('line', node.loc.start.line);
        return self.generate(node.test)();
      }
      : function* test() {
        return true;
      };

    const update = node.update
      ? this.generate(node.update)
      : function* updateNoop() {
        return noop;
      };

    body = body || this.generate(node.body);

    return function* exec() {
      self.emit('line', node.loc.start.line);
      let resp;
      for (yield* init(); yield* test(); yield* update()) {
        const newResp = yield* body();

        if (newResp === Break) {
          break;
        }
        if (newResp === Continue) {
          continue;
        }
        resp = newResp;
        if (newResp instanceof Return) {
          break;
        }
      }
      return resp;
    };
  }

  generateDoWhileStatement(node) {
    const body = this.generate(node.body);
    const loop = this.generateLoopStatement(node, body);

    return function* exec() {
      yield* body();
      yield* loop();
    };
  }

  generateForInStatement(node) {
    const self = this;
    const right = self.generate(node.right);
    const body = self.generate(node.body);

    let { left } = node;
    if (left.type === 'VariableDeclaration') {
      self.currentDeclarations[left.declarations[0].id.name] = noop;
      left = left.declarations[0].id;
    }
    return function* exec() {
      let resp;
      for (const x in right()) {
        self.emit('line', node.loc.start.line);
        yield* self.generateAssignExpression({
          operator: '=',
          left,
          right: {
            type: 'Literal',
            value: x,
          },
        })();
        resp = yield* body();
      }
      return resp;
    };
  }

  generateWithStatement(node) {
    const self = this;
    const obj = self.generate(node.object);
    const body = self.generate(node.body);

    return function* exec() {
      self.currentVariableStore = createVarStore(self.currentVariableStore, obj());
      const result = yield* body();
      self.currentVariableStore = self.currentVariableStore.parent;
      return result;
    };
  }

  generateThrowStatement(node) {
    const arg = this.generate(node.argument);

    return function exec() {
      throw arg();
    };
  }

  generateTryStatement(node) {
    const block = this.generate(node.block);
    const handler = this.generateCatchHandler(node.handler);
    const finalizer = node.finalizer
      ? this.generate(node.finalizer)
      : function finalizer(x) {
        return x;
      };

    return function exec() {
      try {
        return finalizer(block());
      } catch (err) {
        return finalizer(handler(err));
      }
    };
  }

  generateCatchHandler(node) {
    if (!node) {
      return noop;
    }
    const self = this;
    const body = self.generate(node.body);

    return function exec(err) {
      const old = self.currentVariableStore.vars[node.param.name];
      self.currentVariableStore.vars[node.param.name] = err;
      const resp = body();
      self.currentVariableStore.vars[node.param.name] = old;

      return resp;
    };
  }

  generateContinueStatement() {
    return function exec() {
      return Continue;
    };
  }

  generateBreakStatement() {
    return function exec() {
      return Break;
    };
  }

  generateSwitchStatement(node) {
    const self = this;

    const discriminant = self.generate(node.discriminant);
    const cases = node.cases.map(curCase => ({
      test: curCase.test ? self.generate(curCase.test) : null,
      code: self.generateBlockStatement({ body: curCase.consequent }),
    }));

    return function* exec() {
      let foundMatch = false;
      const discriminantVal = discriminant();
      let resp;
      let defaultCase;

      for (let i = 0; i < cases.length; i++) {
        const curCase = cases[i];
        if (!foundMatch) {
          if (!curCase.test) {
            defaultCase = curCase;
            continue;
          }
          if (discriminantVal !== curCase.test()) {
            continue;
          }
          foundMatch = true;
        }
        // foundMatch is guaranteed to be true here
        const newResp = yield* curCase.code();
        if (newResp === Break) {
          return resp;
        }
        resp = newResp;
        if (resp === Continue || resp instanceof Return) {
          return resp;
        }
      }
      if (!foundMatch && defaultCase) {
        return yield* defaultCase.code();
      }
    };
  }
}

export const evaluate = (code) => {
  const env = new Environment(global);
  const iterator = env.execute(code)();
  let result = iterator.next();
  while (!result.done) {
    result = iterator.next();
  }
  return result.value;
};

// TODO: make evaluate a generator that will
// iterate through all steps of a program
// export function* evaluateGenerator(code) {
//   const env = new Environment(global);
//   const iterator = env.execute(code)();
//   let result = iterator.next();
//   while (!result.done) {
//     result = yield iterator.next();
//   }
//   return result.value;
// }
