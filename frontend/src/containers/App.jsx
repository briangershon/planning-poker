import React, { useEffect } from 'react';
import { updateUser } from '../store/userSlice';
const { SITE_URL } = import.meta.env;

import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from 'react-router-dom';
import styles from './App.module.css';

import HomePage from './HomePage';
import AboutPage from '../components/AboutPage';
import WalkThroughPage from '../components/WalkThroughPage';

import PlayGame from './PlayGame';

import { useSelector, useDispatch } from 'react-redux';

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    fetch(`${SITE_URL}/api/me`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data !== null) {
          dispatch(updateUser({ ...data }));
          return;
        }
      })
      .catch((e) => {
        console.log('server error', e);
      });
  }, []);

  return (
    <Router>
      <div className={styles.app}>
        <div>
          <div className={styles.login}>
            {user.name && (
              <div>
                <img src={user.avatarUrl} width="40" /> {user.name}{' '}
                <div>
                  <a href="/api/logout" target="_self">
                    Logout
                  </a>
                </div>
              </div>
            )}
            {!user.name && (
              <div>
                <a href="/api/login/github" target="_self">
                  Github Login
                </a>
              </div>
            )}
          </div>
          <nav className={styles.nav}>
            <ul>
              <li>
                <NavLink to="/" exact activeClassName={styles.active}>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/documentation" activeClassName={styles.active}>
                  Docs
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" activeClassName={styles.active}>
                  About
                </NavLink>
              </li>
            </ul>
            <ul className={styles.tinyNav}>
              <li>
                <a
                  href="https://github.com/briangershon/planning-poker/issues/new"
                  target="_blank"
                >
                  Send feedback
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/briangershon/planning-poker/blob/main/CHANGELOG.md"
                  target="_blank"
                >
                  Changelog
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className={styles.contentWrapper}>
          <div className={styles.content}>
            <Switch>
              <Route exact path="/">
                <HomePage />
              </Route>
              <Route path="/documentation">
                <WalkThroughPage />
              </Route>
              <Route path="/about">
                <AboutPage />
              </Route>
              <Route path="/games/:gameId">
                <PlayGame />
              </Route>
            </Switch>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
