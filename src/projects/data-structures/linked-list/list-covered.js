import { EventEmitter } from 'events';
import uuidV4 from 'uuid/v4';

class Node extends EventEmitter {
  constructor(data = null) {
    super();
    this.emit('NODE_STEP', { nodeType: '"ExpressionStatement"', code: 'super();', variables: {} });
    this.id = uuidV4();
    this.emit('NODE_STEP', {
      nodeType: '"ExpressionStatement"',
      code: 'this.id = uuidV4();',
      variables: {},
    });
    this.data = data;
    this.emit('NODE_STEP', {
      nodeType: '"ExpressionStatement"',
      code: 'this.data = data;',
      variables: {},
    });
    this.next = null;
    this.emit('NODE_STEP', {
      nodeType: '"ExpressionStatement"',
      code: 'this.next = null;',
      variables: {},
    });
  }
}
export const EVENTS = {
  EVENT_EMITTED: 'EVENT_EMITTED',
  CALL_APPEND: 'CALL_APPEND',
  CALL_REMOVE: 'CALL_REMOVE',
  CALL_APPEND_AT: 'CALL_APPEND_AT',
  CALL_REMOVE_AT: 'CALL_REMOVE_AT',
  CALL_LENGTH: 'CALL_LENGTH',
  CALL_IS_EMPTY: 'CALL_IS_EMPTY',
  CALL_TRAVERSE: 'CALL_TRAVERSE',
  CALL_REVERSE: 'CALL_REVERSE',
  CALL_SWAP: 'CALL_SWAP',
  CALL_SEARCH: 'CALL_SEARCH',
  CALL_REMOVE_DUPLICATES: 'CALL_REMOVE_DUPLICATES',
  CHANGE_CURRENT: 'CHANGE_CURRENT',
};
export default class LinkedList extends EventEmitter {
  constructor() {
    super();
    this.emit('NODE_STEP', { nodeType: '"ExpressionStatement"', code: 'super();', variables: {} });
    this.head = new Node();
    this.emit('NODE_STEP', {
      nodeType: '"ExpressionStatement"',
      code: 'this.head = new Node();',
      variables: {},
    });
    this.events = [];
    this.emit('NODE_STEP', {
      nodeType: '"ExpressionStatement"',
      code: 'this.events = [];',
      variables: {},
    });
  }
  append(item) {
    let current = this.head;
    this.emit('NODE_STEP', {
      nodeType: '"VariableDeclaration"',
      code: 'let current = this.head;',
      variables: { current },
    });
    const newNode = new Node(item);
    this.emit('NODE_STEP', {
      nodeType: '"VariableDeclaration"',
      code: 'const newNode = new Node(item);',
      variables: { newNode },
    });
    while (current.next !== null) {
      current = current.next;
      this.emit('NODE_STEP', {
        nodeType: '"ExpressionStatement"',
        code: 'current = current.next;',
        variables: { current },
      });
    }
    this.emit('NODE_STEP', {
      nodeType: '"WhileStatement"',
      code: 'while (current.next !== null) {\n    current = current.next;\n}',
      variables: {},
    });
    current.next = newNode;
    this.emit('NODE_STEP', {
      nodeType: '"ExpressionStatement"',
      code: 'current.next = newNode;',
      variables: { current },
    });
  }
  remove(item) {
    this.emit(EVENTS.CALL_REMOVE, { item });
    this.emit('NODE_STEP', {
      nodeType: '"ExpressionStatement"',
      code: 'this.emit(EVENTS.CALL_REMOVE, {\n    item\n});',
      variables: {},
    });
    if (!item) {
      console.log('No item to remove');
      this.emit('NODE_STEP', {
        nodeType: '"ExpressionStatement"',
        code: 'console.log("No item to remove");',
        variables: {},
      });
      return false;
      this.emit('NODE_STEP', {
        nodeType: '"ReturnStatement"',
        code: 'return false;',
        variables: {},
      });
    }
    let current = this.head;
    this.emit('NODE_STEP', {
      nodeType: '"VariableDeclaration"',
      code: 'let current = this.head;',
      variables: { current },
    });
    while (current !== null) {
      const previous = current;
      this.emit('NODE_STEP', {
        nodeType: '"VariableDeclaration"',
        code: 'const previous = current;',
        variables: { previous },
      });
      current = current.next;
      this.emit('NODE_STEP', {
        nodeType: '"ExpressionStatement"',
        code: 'current = current.next;',
        variables: { current },
      });
      if (current.data === item) {
        previous.next = current.next;
        this.emit('NODE_STEP', {
          nodeType: '"ExpressionStatement"',
          code: 'previous.next = current.next;',
          variables: { previous },
        });
        return true;
        this.emit('NODE_STEP', {
          nodeType: '"ReturnStatement"',
          code: 'return true;',
          variables: {},
        });
      }
    }
    this.emit('NODE_STEP', {
      nodeType: '"WhileStatement"',
      code:
        'while (current !== null) {\n    const previous = current;\n    current = current.next;\n\n    if (current.data === item) {\n        previous.next = current.next;\n        return true;\n    }\n}',
      variables: {},
    });
    return false;
    this.emit('NODE_STEP', { nodeType: '"ReturnStatement"', code: 'return false;', variables: {} });
  }
  appendAt(pos, item) {
    this.emit(EVENTS.CALL_APPEND_AT, { pos, item });
    this.emit('NODE_STEP', {
      nodeType: '"ExpressionStatement"',
      code: 'this.emit(EVENTS.CALL_APPEND_AT, {\n    pos,\n    item\n});',
      variables: {},
    });
    let counter = 0;
    this.emit('NODE_STEP', {
      nodeType: '"VariableDeclaration"',
      code: 'let counter = 0;',
      variables: { counter },
    });
    let current = this.head;
    this.emit('NODE_STEP', {
      nodeType: '"VariableDeclaration"',
      code: 'let current = this.head;',
      variables: { current },
    });
    const newNode = new Node(item);
    this.emit('NODE_STEP', {
      nodeType: '"VariableDeclaration"',
      code: 'const newNode = new Node(item);',
      variables: { newNode },
    });
    while (current.next != null) {
      if (counter === pos) {
        newNode.next = current.next;
        this.emit('NODE_STEP', {
          nodeType: '"ExpressionStatement"',
          code: 'newNode.next = current.next;',
          variables: { newNode },
        });
        current.next = newNode;
        this.emit('NODE_STEP', {
          nodeType: '"ExpressionStatement"',
          code: 'current.next = newNode;',
          variables: { current },
        });
        return true;
        this.emit('NODE_STEP', {
          nodeType: '"ReturnStatement"',
          code: 'return true;',
          variables: {},
        });
      }
      current = current.next;
      this.emit('NODE_STEP', {
        nodeType: '"ExpressionStatement"',
        code: 'current = current.next;',
        variables: { current },
      });
      counter += 1;
      this.emit('NODE_STEP', {
        nodeType: '"ExpressionStatement"',
        code: 'counter += 1;',
        variables: { counter },
      });
    }
    this.emit('NODE_STEP', {
      nodeType: '"WhileStatement"',
      code:
        'while (current.next != null) {\n    if (counter === pos) {\n        newNode.next = current.next;\n        current.next = newNode;\n        return true;\n    }\n\n    current = current.next;\n    counter += 1;\n}',
      variables: {},
    });
    return false;
    this.emit('NODE_STEP', { nodeType: '"ReturnStatement"', code: 'return false;', variables: {} });
  }
  removeAt(pos) {
    this.emit(EVENTS.CALL_REMOVE_AT, { pos });
    this.emit('NODE_STEP', {
      nodeType: '"ExpressionStatement"',
      code: 'this.emit(EVENTS.CALL_REMOVE_AT, {\n    pos\n});',
      variables: {},
    });
    if (pos >= this.length() || pos < 0) {
      console.log("ERROR: 'REMOVE_AT' position out of range!");
      this.emit('NODE_STEP', {
        nodeType: '"ExpressionStatement"',
        code: 'console.log("ERROR: \'REMOVE_AT\' position out of range!");',
        variables: {},
      });
      return false;
      this.emit('NODE_STEP', {
        nodeType: '"ReturnStatement"',
        code: 'return false;',
        variables: {},
      });
    }
    let counter = 0;
    this.emit('NODE_STEP', {
      nodeType: '"VariableDeclaration"',
      code: 'let counter = 0;',
      variables: { counter },
    });
    let current = this.head;
    this.emit('NODE_STEP', {
      nodeType: '"VariableDeclaration"',
      code: 'let current = this.head;',
      variables: { current },
    });
    while (current.next !== null) {
      const previous = current;
      this.emit('NODE_STEP', {
        nodeType: '"VariableDeclaration"',
        code: 'const previous = current;',
        variables: { previous },
      });
      current = current.next;
      this.emit('NODE_STEP', {
        nodeType: '"ExpressionStatement"',
        code: 'current = current.next;',
        variables: { current },
      });
      if (counter === pos) {
        previous.next = current.next;
        this.emit('NODE_STEP', {
          nodeType: '"ExpressionStatement"',
          code: 'previous.next = current.next;',
          variables: { previous },
        });
        return true;
        this.emit('NODE_STEP', {
          nodeType: '"ReturnStatement"',
          code: 'return true;',
          variables: {},
        });
      }
      counter += 1;
      this.emit('NODE_STEP', {
        nodeType: '"ExpressionStatement"',
        code: 'counter += 1;',
        variables: { counter },
      });
    }
    this.emit('NODE_STEP', {
      nodeType: '"WhileStatement"',
      code:
        'while (current.next !== null) {\n    const previous = current;\n    current = current.next;\n\n    if (counter === pos) {\n        previous.next = current.next;\n        return true;\n    }\n\n    counter += 1;\n}',
      variables: {},
    });
    return false;
    this.emit('NODE_STEP', { nodeType: '"ReturnStatement"', code: 'return false;', variables: {} });
  }
  length() {
    this.emit(EVENTS.CALL_LENGTH);
    this.emit('NODE_STEP', {
      nodeType: '"ExpressionStatement"',
      code: 'this.emit(EVENTS.CALL_LENGTH);',
      variables: {},
    });
    let current = this.head;
    this.emit('NODE_STEP', {
      nodeType: '"VariableDeclaration"',
      code: 'let current = this.head;',
      variables: { current },
    });
    let length = 0;
    this.emit('NODE_STEP', {
      nodeType: '"VariableDeclaration"',
      code: 'let length = 0;',
      variables: { length },
    });
    while (current.next !== null) {
      length += 1;
      this.emit('NODE_STEP', {
        nodeType: '"ExpressionStatement"',
        code: 'length += 1;',
        variables: { length },
      });
      current = current.next;
      this.emit('NODE_STEP', {
        nodeType: '"ExpressionStatement"',
        code: 'current = current.next;',
        variables: { current },
      });
    }
    this.emit('NODE_STEP', {
      nodeType: '"WhileStatement"',
      code: 'while (current.next !== null) {\n    length += 1;\n    current = current.next;\n}',
      variables: {},
    });
    return length;
    this.emit('NODE_STEP', {
      nodeType: '"ReturnStatement"',
      code: 'return length;',
      variables: {},
    });
  }
  isEmpty() {
    this.emit(EVENTS.CALL_IS_EMPTY);
    this.emit('NODE_STEP', {
      nodeType: '"ExpressionStatement"',
      code: 'this.emit(EVENTS.CALL_IS_EMPTY);',
      variables: {},
    });
    return this.length() < 1;
    this.emit('NODE_STEP', {
      nodeType: '"ReturnStatement"',
      code: 'return this.length() < 1;',
      variables: {},
    });
  }
  traverse(fn) {
    this.emit(EVENTS.CALL_TRAVERSE, { fn });
    this.emit('NODE_STEP', {
      nodeType: '"ExpressionStatement"',
      code: 'this.emit(EVENTS.CALL_TRAVERSE, {\n    fn\n});',
      variables: {},
    });
    if (!fn || typeof fn !== 'function') {
      throw new Error("ERROR: 'TRAVERSE' function is undefined!");
      this.emit('NODE_STEP', {
        nodeType: '"ThrowStatement"',
        code: 'throw new Error("ERROR: \'TRAVERSE\' function is undefined!");',
        variables: {},
      });
    }
    let current = this.head;
    this.emit('NODE_STEP', {
      nodeType: '"VariableDeclaration"',
      code: 'let current = this.head;',
      variables: { current },
    });
    let counter = 0;
    this.emit('NODE_STEP', {
      nodeType: '"VariableDeclaration"',
      code: 'let counter = 0;',
      variables: { counter },
    });
    while (current != null) {
      fn.call(this, current, counter);
      this.emit('NODE_STEP', {
        nodeType: '"ExpressionStatement"',
        code: 'fn.call(this, current, counter);',
        variables: {},
      });
      current = current.next;
      this.emit('NODE_STEP', {
        nodeType: '"ExpressionStatement"',
        code: 'current = current.next;',
        variables: { current },
      });
      counter += 1;
      this.emit('NODE_STEP', {
        nodeType: '"ExpressionStatement"',
        code: 'counter += 1;',
        variables: { counter },
      });
    }
    this.emit('NODE_STEP', {
      nodeType: '"WhileStatement"',
      code:
        'while (current != null) {\n    fn.call(this, current, counter);\n    current = current.next;\n    counter += 1;\n}',
      variables: {},
    });
    return true;
    this.emit('NODE_STEP', { nodeType: '"ReturnStatement"', code: 'return true;', variables: {} });
  }
  reverse() {
    this.emit(EVENTS.CALL_REVERSE);
    this.emit('NODE_STEP', {
      nodeType: '"ExpressionStatement"',
      code: 'this.emit(EVENTS.CALL_REVERSE);',
      variables: {},
    });
    let current = this.head.next;
    this.emit('NODE_STEP', {
      nodeType: '"VariableDeclaration"',
      code: 'let current = this.head.next;',
      variables: { current },
    });
    let prev = null;
    this.emit('NODE_STEP', {
      nodeType: '"VariableDeclaration"',
      code: 'let prev = null;',
      variables: { prev },
    });
    while (current !== null) {
      const { next } = current;
      this.emit('NODE_STEP', {
        nodeType: '"VariableDeclaration"',
        code: 'const {\n    next\n} = current;',
        variables: { undefined },
      });
      current.next = prev;
      this.emit('NODE_STEP', {
        nodeType: '"ExpressionStatement"',
        code: 'current.next = prev;',
        variables: { current },
      });
      prev = current;
      this.emit('NODE_STEP', {
        nodeType: '"ExpressionStatement"',
        code: 'prev = current;',
        variables: { prev },
      });
      current = next;
      this.emit('NODE_STEP', {
        nodeType: '"ExpressionStatement"',
        code: 'current = next;',
        variables: { current },
      });
    }
    this.emit('NODE_STEP', {
      nodeType: '"WhileStatement"',
      code:
        'while (current !== null) {\n    const {\n        next\n    } = current;\n\n    current.next = prev;\n    prev = current;\n    current = next;\n}',
      variables: {},
    });
    this.head.next = prev;
    this.emit('NODE_STEP', {
      nodeType: '"ExpressionStatement"',
      code: 'this.head.next = prev;',
      variables: {},
    });
    return true;
    this.emit('NODE_STEP', { nodeType: '"ReturnStatement"', code: 'return true;', variables: {} });
  }
  swap(firstIndex, secondIndex) {
    this.emit(EVENTS.CALL_SWAP, { firstIndex, secondIndex });
    this.emit('NODE_STEP', {
      nodeType: '"ExpressionStatement"',
      code: 'this.emit(EVENTS.CALL_SWAP, {\n    firstIndex,\n    secondIndex\n});',
      variables: {},
    });
    let current = this.head;
    this.emit('NODE_STEP', {
      nodeType: '"VariableDeclaration"',
      code: 'let current = this.head;',
      variables: { current },
    });
    let counter = 0;
    this.emit('NODE_STEP', {
      nodeType: '"VariableDeclaration"',
      code: 'let counter = 0;',
      variables: { counter },
    });
    let firstNode;
    this.emit('NODE_STEP', {
      nodeType: '"VariableDeclaration"',
      code: 'let firstNode;',
      variables: { firstNode },
    });
    if (firstIndex === secondIndex) {
      throw new Error('ERROR: "SWAP" both the nodes must be different');
      this.emit('NODE_STEP', {
        nodeType: '"ThrowStatement"',
        code: 'throw new Error("ERROR: \\"SWAP\\" both the nodes must be different");',
        variables: {},
      });
    } else if (firstIndex > secondIndex) {
      const temp = firstIndex;
      this.emit('NODE_STEP', {
        nodeType: '"VariableDeclaration"',
        code: 'const temp = firstIndex;',
        variables: { temp },
      });
      firstIndex = secondIndex;
      this.emit('NODE_STEP', {
        nodeType: '"ExpressionStatement"',
        code: 'firstIndex = secondIndex;',
        variables: { firstIndex },
      });
      secondIndex = temp;
      this.emit('NODE_STEP', {
        nodeType: '"ExpressionStatement"',
        code: 'secondIndex = temp;',
        variables: { secondIndex },
      });
    }
    if (firstIndex < 0 || secondIndex < 0) {
      throw new Error('ERROR: "SWAP" both the nodes must be positive index');
      this.emit('NODE_STEP', {
        nodeType: '"ThrowStatement"',
        code: 'throw new Error("ERROR: \\"SWAP\\" both the nodes must be positive index");',
        variables: {},
      });
    }
    while (current !== null) {
      current = current.next;
      this.emit('NODE_STEP', {
        nodeType: '"ExpressionStatement"',
        code: 'current = current.next;',
        variables: { current },
      });
      if (counter === firstIndex) {
        firstNode = current;
        this.emit('NODE_STEP', {
          nodeType: '"ExpressionStatement"',
          code: 'firstNode = current;',
          variables: { firstNode },
        });
      } else if (counter === secondIndex) {
        const temp = current.data;
        this.emit('NODE_STEP', {
          nodeType: '"VariableDeclaration"',
          code: 'const temp = current.data;',
          variables: { temp },
        });
        current.data = firstNode.data;
        this.emit('NODE_STEP', {
          nodeType: '"ExpressionStatement"',
          code: 'current.data = firstNode.data;',
          variables: { current },
        });
        firstNode.data = temp;
        this.emit('NODE_STEP', {
          nodeType: '"ExpressionStatement"',
          code: 'firstNode.data = temp;',
          variables: { firstNode },
        });
        return true;
        this.emit('NODE_STEP', {
          nodeType: '"ReturnStatement"',
          code: 'return true;',
          variables: {},
        });
      }
      counter += 1;
      this.emit('NODE_STEP', {
        nodeType: '"ExpressionStatement"',
        code: 'counter += 1;',
        variables: { counter },
      });
    }
    this.emit('NODE_STEP', {
      nodeType: '"WhileStatement"',
      code:
        'while (current !== null) {\n    current = current.next;\n\n    if (counter === firstIndex) {\n        firstNode = current;\n    } else if (counter === secondIndex) {\n        const temp = current.data;\n        current.data = firstNode.data;\n        firstNode.data = temp;\n        return true;\n    }\n\n    counter += 1;\n}',
      variables: {},
    });
    return true;
    this.emit('NODE_STEP', { nodeType: '"ReturnStatement"', code: 'return true;', variables: {} });
  }
  search(item) {
    this.emit(EVENTS.CALL_SEARCH, { item });
    this.emit('NODE_STEP', {
      nodeType: '"ExpressionStatement"',
      code: 'this.emit(EVENTS.CALL_SEARCH, {\n    item\n});',
      variables: {},
    });
    let current = this.head.next;
    this.emit('NODE_STEP', {
      nodeType: '"VariableDeclaration"',
      code: 'let current = this.head.next;',
      variables: { current },
    });
    let counter = 0;
    this.emit('NODE_STEP', {
      nodeType: '"VariableDeclaration"',
      code: 'let counter = 0;',
      variables: { counter },
    });
    while (current != null) {
      if (current.data === item) {
        return counter;
        this.emit('NODE_STEP', {
          nodeType: '"ReturnStatement"',
          code: 'return counter;',
          variables: {},
        });
      }
      current = current.next;
      this.emit('NODE_STEP', {
        nodeType: '"ExpressionStatement"',
        code: 'current = current.next;',
        variables: { current },
      });
      counter += 1;
      this.emit('NODE_STEP', {
        nodeType: '"ExpressionStatement"',
        code: 'counter += 1;',
        variables: { counter },
      });
    }
    this.emit('NODE_STEP', {
      nodeType: '"WhileStatement"',
      code:
        'while (current != null) {\n    if (current.data === item) {\n        return counter;\n    }\n\n    current = current.next;\n    counter += 1;\n}',
      variables: {},
    });
    return -1;
    this.emit('NODE_STEP', { nodeType: '"ReturnStatement"', code: 'return -1;', variables: {} });
  }
  removeDuplicates() {
    this.emit(EVENTS.CALL_REMOVE_DUPLICATES);
    this.emit('NODE_STEP', {
      nodeType: '"ExpressionStatement"',
      code: 'this.emit(EVENTS.CALL_REMOVE_DUPLICATES);',
      variables: {},
    });
    let current = this.head;
    this.emit('NODE_STEP', {
      nodeType: '"VariableDeclaration"',
      code: 'let current = this.head;',
      variables: { current },
    });
    while (current.next) {
      current = current.next;
      this.emit('NODE_STEP', {
        nodeType: '"ExpressionStatement"',
        code: 'current = current.next;',
        variables: { current },
      });
      let runner = current;
      this.emit('NODE_STEP', {
        nodeType: '"VariableDeclaration"',
        code: 'let runner = current;',
        variables: { runner },
      });
      while (runner.next) {
        const prev = runner;
        this.emit('NODE_STEP', {
          nodeType: '"VariableDeclaration"',
          code: 'const prev = runner;',
          variables: { prev },
        });
        runner = runner.next;
        this.emit('NODE_STEP', {
          nodeType: '"ExpressionStatement"',
          code: 'runner = runner.next;',
          variables: { runner },
        });
        if (runner.data == current.data) {
          prev.next = runner.next;
          this.emit('NODE_STEP', {
            nodeType: '"ExpressionStatement"',
            code: 'prev.next = runner.next;',
            variables: { prev },
          });
          runner = prev;
          this.emit('NODE_STEP', {
            nodeType: '"ExpressionStatement"',
            code: 'runner = prev;',
            variables: { runner },
          });
        }
      }
      this.emit('NODE_STEP', {
        nodeType: '"WhileStatement"',
        code:
          'while (runner.next) {\n    const prev = runner;\n    runner = runner.next;\n\n    if (runner.data == current.data) {\n        prev.next = runner.next;\n        runner = prev;\n    }\n}',
        variables: {},
      });
    }
    this.emit('NODE_STEP', {
      nodeType: '"WhileStatement"',
      code:
        'while (current.next) {\n    current = current.next;\n    let runner = current;\n\n    while (runner.next) {\n        const prev = runner;\n        runner = runner.next;\n\n        if (runner.data == current.data) {\n            prev.next = runner.next;\n            runner = prev;\n        }\n    }\n}',
      variables: {},
    });
  }
}
