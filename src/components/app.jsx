import React from 'react';
import PropTypes from 'prop-types';

function App({ message }) {
  return (
    <>
      <h1>Hello</h1>
      <main id="main" className="content">
        {message}
      </main>
    </>
  );
}

App.propTypes = {
  message: PropTypes.string,
};

export default App;
