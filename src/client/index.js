import React from 'react';
import { render } from 'react-dom';
import { Jumbotron } from 'react-bootstrap';
import LinkedListComponent from './components/LinkedList';

import './index.scss';

function App() {
  return <LinkedListComponent />;
}

render(<App />, document.getElementById('reactRoot'));
