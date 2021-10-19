import React from 'react';
import PropTypes from 'prop-types';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from 'react-router-dom';
import styles from './App.module.css';

import HomePage from './HomePage';
import AboutPage from './AboutPage';

import PlayGame from './PlayGame';

function App() {
  return (
    <Router>
      <div className={styles.app}>
        <div>
          <nav className={styles.nav}>
            <ul>
              <li>
                <NavLink to="/" exact activeClassName={styles.active}>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" activeClassName={styles.active}>
                  About
                </NavLink>
              </li>
              <li>
                <a href="/api/login/github" target="_self">
                  Login
                </a>
              </li>
              <li>
                <a href="/api/logout" target="_self">
                  Logout
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className={styles.content}>
          <Switch>
            <Route exact path="/">
              <HomePage />
            </Route>
            <Route path="/about">
              <AboutPage />
            </Route>
            <Route path="/game/:gameId">
              <PlayGame />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
