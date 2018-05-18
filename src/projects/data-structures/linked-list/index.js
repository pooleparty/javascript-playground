/* eslint-disable no-param-reassign */
/* eslint-disable eqeqeq */
/* eslint-disable class-methods-use-this */
import { EventEmitter } from 'events';
import uuidV4 from 'uuid/v4';

// A Linked List is a linear collection of data elements, called nodes,
// pointing to the neighbouring node by means of pointer.

class Node extends EventEmitter {
  constructor(data = null) {
    super();
    this.id = uuidV4();
    this.data = data;
    this.next = null;
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

// TODO: Investigate having a Proxy LinkedList instead of emitting event
// TODO: move function logic into new functions so they can be called
// and handled by the Proxy (e.g. findNextNull(), incrementCurrent())

export default class LinkedList extends EventEmitter {
  constructor() {
    super();
    this.head = new Node();
    this.events = [];
  }

  // emit(e, ...args) {
  //   const event = { event: e, args };
  //   this.events.push(event);
  //   super.emit(EVENTS.EVENT_EMITTED, event);
  //   super.emit(e, ...args);
  // }

  append(item) {
    let current = this.head;
    const newNode = new Node(item);
    while (current.next !== null) {
      current = current.next;
    }
    current.next = newNode;
  }

  remove(item) {
    this.emit(EVENTS.CALL_REMOVE, { item });
    if (!item) {
      console.log('No item to remove');
      return false;
    }
    let current = this.head;
    while (current !== null) {
      const previous = current;
      current = current.next;
      if (current.data === item) {
        previous.next = current.next;
        return true;
      }
    }
    return false;
  }

  appendAt(pos, item) {
    this.emit(EVENTS.CALL_APPEND_AT, { pos, item });
    let counter = 0;
    let current = this.head;
    const newNode = new Node(item);
    while (current.next != null) {
      if (counter === pos) {
        newNode.next = current.next;
        current.next = newNode;
        return true;
      }
      current = current.next;
      counter += 1;
    }
    return false;
  }

  removeAt(pos) {
    this.emit(EVENTS.CALL_REMOVE_AT, { pos });
    if (pos >= this.length() || pos < 0) {
      console.log("ERROR: 'REMOVE_AT' position out of range!");
      return false;
    }

    let counter = 0;
    let current = this.head;
    while (current.next !== null) {
      const previous = current;
      current = current.next;
      if (counter === pos) {
        previous.next = current.next;
        return true;
      }
      counter += 1;
    }
    return false;
  }

  length() {
    this.emit(EVENTS.CALL_LENGTH);
    let current = this.head;
    let length = 0;
    while (current.next !== null) {
      length += 1;
      current = current.next;
    }
    return length;
  }

  isEmpty() {
    this.emit(EVENTS.CALL_IS_EMPTY);
    return this.length() < 1;
  }

  traverse(fn) {
    this.emit(EVENTS.CALL_TRAVERSE, { fn });
    if (!fn || typeof fn !== 'function') {
      throw new Error("ERROR: 'TRAVERSE' function is undefined!");
    }
    let current = this.head;
    let counter = 0;
    while (current != null) {
      fn.call(this, current, counter);
      current = current.next;
      counter += 1;
    }
    return true;
  }

  reverse() {
    this.emit(EVENTS.CALL_REVERSE);
    let current = this.head.next;
    let prev = null;
    while (current !== null) {
      const { next } = current;
      current.next = prev;
      prev = current;
      current = next;
    }
    this.head.next = prev;
    return true;
  }

  swap(firstIndex, secondIndex) {
    this.emit(EVENTS.CALL_SWAP, { firstIndex, secondIndex });
    let current = this.head;
    let counter = 0;
    let firstNode;

    if (firstIndex === secondIndex) {
      throw new Error('ERROR: "SWAP" both the nodes must be different');
    } else if (firstIndex > secondIndex) {
      const temp = firstIndex;
      firstIndex = secondIndex;
      secondIndex = temp;
    }

    if (firstIndex < 0 || secondIndex < 0) {
      throw new Error('ERROR: "SWAP" both the nodes must be positive index');
    }

    while (current !== null) {
      current = current.next;
      if (counter === firstIndex) {
        firstNode = current;
      } else if (counter === secondIndex) {
        const temp = current.data;
        current.data = firstNode.data;
        firstNode.data = temp;
        return true;
      }
      counter += 1;
    }

    return true;
  }

  search(item) {
    this.emit(EVENTS.CALL_SEARCH, { item });
    let current = this.head.next;
    let counter = 0;
    while (current != null) {
      if (current.data === item) {
        return counter;
      }
      current = current.next;
      counter += 1;
    }
    return -1;
  }

  removeDuplicates() {
    this.emit(EVENTS.CALL_REMOVE_DUPLICATES);
    let current = this.head;
    while (current.next) {
      current = current.next;
      let runner = current;
      while (runner.next) {
        const prev = runner;
        runner = runner.next;
        if (runner.data == current.data) {
          prev.next = runner.next;
          runner = prev;
        }
      }
    }
  }

  // prettyPrint() {
  //   let current = this.head.next;
  //   const output = [`${chalk.red('Head')} ->`];
  //   while (current !== null) {
  //     output.push(chalk.cyan(current.data));
  //     current = current.next;
  //   }
  //   this.table(output);
  // }

  // table(output) {
  //   const table = new Table({
  //     chars: {
  //       top: '─',
  //       'top-mid': '╤',
  //       'top-left': '╔',
  //       'top-right': '╗',
  //       bottom: '─',
  //       'bottom-mid': '╧',
  //       'bottom-left': '╚',
  //       'bottom-right': '╝',
  //       left: '│',
  //       'left-mid': '╟',
  //       mid: '─',
  //       'mid-mid': '┼',
  //       right: '│',
  //       'right-mid': '╢',
  //       middle: '│',
  //     },
  //     style: { border: ['yellow'] },
  //   });
  //   table.push(output);
  //   console.log(table.toString(), '\n');
  // }
}
