import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app';
import getMessage from './hello';

ReactDOM.render(
  <App message={getMessage()} />,
  document.getElementById('root')
);
