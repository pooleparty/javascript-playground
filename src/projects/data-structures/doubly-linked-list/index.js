/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
import Table from 'cli-table2';
import chalk from 'chalk';

/*
  A doubly linked list is a linked data structure that consists
  of a set of sequentially linked records called nodes. Each
  node contains two fields, called links, that are references
  to the previous and to the next node in the sequence of nodes.

  https://en.wikipedia.org/wiki/Doubly_linked_list
*/

class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
    this.prev = null;
  }
}

export default class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  append(item) {
    const node = new Node(item);
    if (!this.head) {
      this.head = node;
      this.tail = node;
    } else {
      node.prev = this.tail;
      this.tail.next = node;
      this.tail = node;
    }
  }

  appendAt(pos, item) {
    let current = this.head;
    let counter = 1;
    const node = new Node(item);
    if (pos === 0) {
      this.head.prev = node;
      node.next = this.head;
      this.head = node;
    } else {
      while (current) {
        current = current.next;
        if (counter === pos) {
          node.prev = current.prev;
          current.prev.next = node;
          node.next = current;
          current.prev = node;
          return;
        }
        counter += 1;
      }
    }
  }

  // appendAfter(item) {

  // }
  remove(item) {
    let current = this.head;
    while (current) {
      if (current.data === item) {
        if (current === this.head && current === this.tail) {
          this.head = null;
          this.tail = null;
        } else if (current === this.head) {
          this.head = this.head.next;
          this.head.prev = null;
        } else if (current === this.tail) {
          this.tail = this.tail.prev;
          this.tail.next = null;
        } else {
          current.prev.next = current.next;
          current.next.prev = current.prev;
        }
        return;
      }
      current = current.next;
    }
  }

  removeAt(pos) {
    let current = this.head;
    let counter = 1;
    if (pos === 0) {
      this.head = this.head.next;
      this.head.prev = null;
    } else {
      while (current) {
        current = current.next;
        if (current === this.tail) {
          this.tail = this.tail.prev;
          this.tail.next = null;
        } else if (counter === pos) {
          current.next.prev = current.prev;
          current.prev.next = current.next;
          return;
        }
        counter += 1;
      }
    }
  }

  reverse() {
    let current = this.head;
    let prev = null;
    while (current != null) {
      const { next } = current;
      current.next = prev;
      prev = current;
      current = next;
    }
    this.tail = this.head;
    this.head = prev;
  }

  swap(nodeOneIndex, nodeTwoIndex) {
    let current = this.head;
    let counter = 0;
    let firstNode;

    if (nodeOneIndex === nodeTwoIndex) {
      throw new Error('ERROR: "SWAP" both the nodes must be different');
    } else if (nodeOneIndex > nodeTwoIndex) {
      const temp = nodeOneIndex;
      nodeOneIndex = nodeTwoIndex;
      nodeTwoIndex = temp;
    }

    if (nodeOneIndex < 0 || nodeTwoIndex < 0) {
      throw new Error('ERROR: "SWAP" both the nodes must be positive index');
    }

    while (current !== null) {
      current = current.next;
      if (counter === nodeOneIndex) {
        firstNode = current;
      } else if (counter === nodeTwoIndex) {
        const temp = current.data;
        current.data = firstNode.data;
        firstNode.data = temp;
        return;
      }
      counter += 1;
    }
  }

  search(item) {
    let current = this.head;
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

  length() {
    let current = this.head;
    let length = 0;
    while (current != null) {
      length += 1;
      current = current.next;
    }
    return length;
  }

  isEmpty() {
    return this.length() < 1;
  }

  traverse(fn) {
    if (typeof fn !== 'function') {
      throw new Error("ERROR: 'TRAVERSE' function is undefined!");
    }
    let current = this.head;
    let counter = 0;
    while (current) {
      fn.call(this, current, counter);
      current = current.next;
      counter += 1;
    }
  }

  traverseReverse(fn) {
    if (typeof fn !== 'function') {
      throw new Error("ERROR: 'TRAVERSE' function is undefined!");
    }
    let current = this.tail;
    let counter = 0;
    const length = this.length();
    while (current) {
      fn.call(this, current, length - 1 - counter);
      current = current.prev;
      counter += 1;
    }
  }

  /*
	* 	EXTRA
	*/
  prettyPrint() {
    let current = this.head;
    const output = [`${chalk.red('Head')} ->`];
    while (current !== null) {
      output.push(chalk.cyan(current.data));
      current = current.next;
    }
    output.push(`<- ${chalk.red('Tail')}`);
    this.table(output);
    return true;
  } // </ PrettyPrint>

  table(output) {
    const table = new Table({
      chars: {
        top: '─',
        'top-mid': '╤',
        'top-left': '╔',
        'top-right': '╗',
        bottom: '─',
        'bottom-mid': '╧',
        'bottom-left': '╚',
        'bottom-right': '╝',
        left: '│',
        'left-mid': '╟',
        mid: '─',
        'mid-mid': '┼',
        right: '│',
        'right-mid': '╢',
        middle: '│',
      },
      style: { border: ['yellow'] },
    });
    table.push(output);
    console.log(table.toString());
    return true;
  } // </ Table>
}
