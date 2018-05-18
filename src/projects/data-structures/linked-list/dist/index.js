'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EVENTS = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('events');

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint-disable no-param-reassign */
/* eslint-disable eqeqeq */
/* eslint-disable class-methods-use-this */


// A Linked List is a linear collection of data elements, called nodes,
// pointing to the neighbouring node by means of pointer.

var Node = function (_EventEmitter) {
  _inherits(Node, _EventEmitter);

  function Node() {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    _classCallCheck(this, Node);

    var _this = _possibleConstructorReturn(this, (Node.__proto__ || Object.getPrototypeOf(Node)).call(this));

    _this.id = (0, _v2.default)();
    _this.data = data;
    _this.next = null;
    return _this;
  }

  return Node;
}(_events.EventEmitter);

var EVENTS = exports.EVENTS = {
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
  CHANGE_CURRENT: 'CHANGE_CURRENT'
};

// TODO: Investigate having a Proxy LinkedList instead of emitting event
// TODO: move function logic into new functions so they can be called
// and handled by the Proxy (e.g. findNextNull(), incrementCurrent())

var LinkedList = function (_EventEmitter2) {
  _inherits(LinkedList, _EventEmitter2);

  function LinkedList() {
    _classCallCheck(this, LinkedList);

    var _this2 = _possibleConstructorReturn(this, (LinkedList.__proto__ || Object.getPrototypeOf(LinkedList)).call(this));

    _this2.head = new Node();
    _this2.events = [];
    return _this2;
  }

  // emit(e, ...args) {
  //   const event = { event: e, args };
  //   this.events.push(event);
  //   super.emit(EVENTS.EVENT_EMITTED, event);
  //   super.emit(e, ...args);
  // }

  _createClass(LinkedList, [{
    key: 'append',
    value: function append(item) {
      var current = this.head;
      var newNode = new Node(item);
      while (current.next !== null) {
        current = current.next;
      }
      current.next = newNode;
    }
  }, {
    key: 'remove',
    value: function remove(item) {
      this.emit(EVENTS.CALL_REMOVE, { item: item });
      if (!item) {
        console.log('No item to remove');
        return false;
      }
      var current = this.head;
      while (current !== null) {
        var previous = current;
        current = current.next;
        if (current.data === item) {
          previous.next = current.next;
          return true;
        }
      }
      return false;
    }
  }, {
    key: 'appendAt',
    value: function appendAt(pos, item) {
      this.emit(EVENTS.CALL_APPEND_AT, { pos: pos, item: item });
      var counter = 0;
      var current = this.head;
      var newNode = new Node(item);
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
  }, {
    key: 'removeAt',
    value: function removeAt(pos) {
      this.emit(EVENTS.CALL_REMOVE_AT, { pos: pos });
      if (pos >= this.length() || pos < 0) {
        console.log("ERROR: 'REMOVE_AT' position out of range!");
        return false;
      }

      var counter = 0;
      var current = this.head;
      while (current.next !== null) {
        var previous = current;
        current = current.next;
        if (counter === pos) {
          previous.next = current.next;
          return true;
        }
        counter += 1;
      }
      return false;
    }
  }, {
    key: 'length',
    value: function length() {
      this.emit(EVENTS.CALL_LENGTH);
      var current = this.head;
      var length = 0;
      while (current.next !== null) {
        length += 1;
        current = current.next;
      }
      return length;
    }
  }, {
    key: 'isEmpty',
    value: function isEmpty() {
      this.emit(EVENTS.CALL_IS_EMPTY);
      return this.length() < 1;
    }
  }, {
    key: 'traverse',
    value: function traverse(fn) {
      this.emit(EVENTS.CALL_TRAVERSE, { fn: fn });
      if (!fn || typeof fn !== 'function') {
        throw new Error("ERROR: 'TRAVERSE' function is undefined!");
      }
      var current = this.head;
      var counter = 0;
      while (current != null) {
        fn.call(this, current, counter);
        current = current.next;
        counter += 1;
      }
      return true;
    }
  }, {
    key: 'reverse',
    value: function reverse() {
      this.emit(EVENTS.CALL_REVERSE);
      var current = this.head.next;
      var prev = null;
      while (current !== null) {
        var _current = current,
            next = _current.next;

        current.next = prev;
        prev = current;
        current = next;
      }
      this.head.next = prev;
      return true;
    }
  }, {
    key: 'swap',
    value: function swap(firstIndex, secondIndex) {
      this.emit(EVENTS.CALL_SWAP, { firstIndex: firstIndex, secondIndex: secondIndex });
      var current = this.head;
      var counter = 0;
      var firstNode = void 0;

      if (firstIndex === secondIndex) {
        throw new Error('ERROR: "SWAP" both the nodes must be different');
      } else if (firstIndex > secondIndex) {
        var temp = firstIndex;
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
          var _temp = current.data;
          current.data = firstNode.data;
          firstNode.data = _temp;
          return true;
        }
        counter += 1;
      }

      return true;
    }
  }, {
    key: 'search',
    value: function search(item) {
      this.emit(EVENTS.CALL_SEARCH, { item: item });
      var current = this.head.next;
      var counter = 0;
      while (current != null) {
        if (current.data === item) {
          return counter;
        }
        current = current.next;
        counter += 1;
      }
      return -1;
    }
  }, {
    key: 'removeDuplicates',
    value: function removeDuplicates() {
      this.emit(EVENTS.CALL_REMOVE_DUPLICATES);
      var current = this.head;
      while (current.next) {
        current = current.next;
        var runner = current;
        while (runner.next) {
          var prev = runner;
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

  }]);

  return LinkedList;
}(_events.EventEmitter);

exports.default = LinkedList;
