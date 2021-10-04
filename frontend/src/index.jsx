import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import getMessage from './hello';

ReactDOM.render(
  <App message={getMessage()} />,
  document.getElementById('root')
);
