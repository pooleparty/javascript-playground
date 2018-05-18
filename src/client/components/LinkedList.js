import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Stage, Layer, Text, Group, Rect, Arrow } from 'react-konva';
import { parseScript } from 'esprima';
// import LinkedList, { EVENTS } from '../../projects/data-structures/linked-list';
import LinkedList, { EVENTS } from '../../projects/data-structures/linked-list/list-covered';
import stringify from '../../projects/utils/stringify';
import evaluate from '../../projects/metajs/evaluate';

const NODE_WIDTH = 75;
const NODE_HEIGHT = 50;
let counter = 0;

let resizeTimeout;
function resizeThrottler(cb) {
  return () => {
    if (!resizeTimeout) {
      resizeTimeout = setTimeout(() => {
        resizeTimeout = null;
        cb();
      }, 500);
    }
  };
}

function evalu(fn) {
  const fnString = stringify(fn);
  const fnAST = parseScript(fnString);
  console.log(fnAST);
  evaluate(fnAST);
}

export default class LinkedListComponent extends Component {
  constructor() {
    super();

    this.state = {
      list: new LinkedList(),
      events: [],
      stageWidth: window.innerWidth,
      stageHeight: window.innerHeight - 200,
    };

    // evalu(this.state.list.append);

    // this.state.list.on(EVENTS.EVENT_EMITTED, (e) => {
    //   console.log(e);
    //   const events = [...this.state.events, e];
    //   this.setState({ events });
    // });

    this.nodeRefs = [];

    const throttled = resizeThrottler(() => {
      this.setState({
        stageWidth: window.innerWidth,
        stageHeight: window.innerHeight - 200,
      });
    });

    window.addEventListener('resize', throttled, false);

    // setInterval(() => {
    //   console.log(this.nodeRefs);
    // }, 2000);
  }

  componentDidMount() {
    // this.setState({ list: this.state.list });
  }

  renderList() {
    const { list } = this.state;
    const nodes = [];
    this.nodeRefs = {};
    let x = 0;
    let y = 0;
    let column = 0;
    const maxRowWidth = this.state.stageWidth - 100;
    list.traverse((node, idx) => {
      x = column * (NODE_WIDTH * 1.5);
      if (x > maxRowWidth) {
        column = 0;
        x = 0;
        y += NODE_HEIGHT * 1.5;
      }
      column++;

      const text = node === this.state.list.head ? 'HEAD' : `Data: ${node.data}`;

      nodes.push(<Group
        key={node.id}
        x={x}
        y={y}
        ref={(n) => {
            if (n) {
              this.nodeRefs[node.id] = n;
            }
          }}
      >
        <Rect width={NODE_WIDTH} height={NODE_HEIGHT} stroke="black" />
        <Text text={text} width={NODE_WIDTH} padding={5} align="center" />
                 </Group>);
    });
    return <Group>{nodes}</Group>;
  }

  renderArrows() {
    const arrows = Object.entries(this.nodeRefs).map((nodeId, node) => {});
  }

  onAppendItem(item) {
    const { list } = this.state;
    const events = [];
    const listener = ({ code, variables }) => {
      events.push({ code, variables });
    };
    list.on('NODE_STEP', listener);
    list.append(item);
    list.removeListener('NODE_STEP', listener);
    this.setState({ list, events });
  }

  render() {
    console.log(this.nodeRefs);
    const renderedList = this.renderList();

    return (
      <div>
        <h1>Linked List Component</h1>
        <pre>{JSON.stringify(this.state, undefined, 2)}</pre>
        <button
          onClick={() => {
            this.onAppendItem(counter++);
          }}
        >
          Append Item
        </button>
        <Stage width={this.state.stageWidth} height={this.state.stageHeight}>
          <Layer x={25} y={25}>
            {renderedList}
          </Layer>
        </Stage>
      </div>
    );
  }
}
