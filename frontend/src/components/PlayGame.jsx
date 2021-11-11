import React, { useState, useEffect, useRef } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
const { SITE_URL, WEBSOCKET_URL } = import.meta.env;
import { deleteGameId } from '../store/userSlice';
import Cookies from 'js-cookie';

import Players from './Players';
import styles from './PlayGame.module.css';

import { useSelector, useDispatch } from 'react-redux';
import {
  showCards,
  hideCards,
  vote,
  updateStory,
  updatePlayers,
} from '../store/pokerSlice';

import { WebsocketClient } from '../lib/websocket_client';

function PlayGame() {
  const game = useSelector((state) => state.poker);
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  const [isPolling, setIsPolling] = useState(true);
  const [storyEditBuffer, setStoryEditBuffer] = useState('');
  const [isUpdatingStory, setUpdatingStory] = useState(false);

  let { gameId } = useParams();

  let history = useHistory();

  const ws = useRef(null);

  function initWebsocket() {
    const sessionId = Cookies.get('session');
    ws.current = new WebsocketClient({ url: WEBSOCKET_URL, sessionId, gameId });
    ws.current.init();
  }

  useEffect(() => {
    initWebsocket();
  }, []);

  function refresh() {
    fetch(`${SITE_URL}/api/games/${gameId}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data !== null) {
          dispatch(updateStory(data.story));
          dispatch(updatePlayers(data.votes));
          dispatch(vote(data.you.vote));
        }
      })
      .catch((e) => {
        console.log('server error', e);
      });
  }

  // refresh votes when page first loads
  useEffect(() => {
    refresh();
  }, []);

  // auto-refresh votes on an interval
  useEffect(() => {
    if (isPolling) {
      const interval = setInterval(() => {
        refresh();
      }, 5000);
      return () => {
        return clearInterval(interval);
      };
    }
  }, [isPolling]);

  // turn off auto-refresh after certain time period
  useEffect(() => {
    if (isPolling) {
      const timer = setTimeout(() => {
        setIsPolling(false);
      }, 120000);
      return () => {
        return clearTimeout(timer);
      };
    }
  }, [isPolling]);

  async function deleteCurrentGame() {
    if (confirm('Are you sure you want to delete?')) {
      const response = await fetch(`${SITE_URL}/api/games/${gameId}`, {
        method: 'DELETE',
      });
      history.push(`/`);
      dispatch(deleteGameId(gameId));
    }
  }

  async function updateStoryBuffer(event) {
    const newStory = event.target.value;
    setStoryEditBuffer(newStory);
  }

  async function sendStoryUpdate() {
    setUpdatingStory(true);
    const response = await fetch(
      `${SITE_URL}/api/games/${gameId}?` +
        new URLSearchParams({ story: storyEditBuffer }),
      {
        method: 'PUT',
      }
    );
    dispatch(updateStory(storyEditBuffer));
    setStoryEditBuffer('');
    setUpdatingStory(false);
  }

  async function sendVote(voteCasted) {
    ws.current.sendVote(voteCasted);
    dispatch(vote(voteCasted));
  }

  const relativeGameInviteUrl = `/games/${gameId}`;
  const gameInviteUrl = `${SITE_URL}/games/${gameId}`;
  const loginWithRedirect = `/api/login/github?redirect=${gameInviteUrl}`;

  return (
    <div>
      {!isLoggedIn && (
        <div>
          Click <a href={loginWithRedirect}>here to login</a> and continue to
          the plannnig poker game.
        </div>
      )}

      {isLoggedIn && (
        <div>
          <h2>1. Invite</h2>
          <div className={styles.inviteLink}>
            Invite others by sending them to:{' '}
            <Link to={relativeGameInviteUrl}>{gameInviteUrl}</Link>
          </div>

          <h2>2. Story</h2>

          <div className={styles.story}>
            <p>What story are you estimating?</p>

            {game.story ? (
              <div>
                Story: <strong>{game.story}</strong>
              </div>
            ) : (
              <strong>Please add a story.</strong>
            )}
          </div>
          <div>
            Update story:{' '}
            <input
              disabled={isUpdatingStory}
              value={storyEditBuffer}
              onChange={updateStoryBuffer}
            />{' '}
            <button disabled={isUpdatingStory} onClick={sendStoryUpdate}>
              Update
            </button>
          </div>

          <h2>3. Cast your vote</h2>
          <div>
            {/* <p>Vote here:</p> */}
            <ul className={styles.vote}>
              <li>
                <button onClick={() => sendVote('XS')}>XS</button>
              </li>
              <li>
                <button onClick={() => sendVote('S')}>S</button>
              </li>
              <li>
                <button onClick={() => sendVote('M')}>M</button>
              </li>
              <li>
                <button onClick={() => sendVote('L')}>L</button>
              </li>
              <li>
                <button onClick={() => sendVote('XL')}>XL</button>
              </li>
              <li>
                <button onClick={() => sendVote('XXL')}>XXL</button>
              </li>
              <li>
                <button onClick={() => sendVote('?')}>?</button>
              </li>
              <li>
                <button onClick={() => sendVote(null)}>Clear</button>
              </li>
            </ul>
          </div>

          <Players
            you={game.you}
            players={game.players}
            showCards={game.showCards}
          />

          <div>
            {game.showCards ? (
              <button onClick={() => dispatch(hideCards())}>Hide Cards</button>
            ) : (
              <button onClick={() => dispatch(showCards())}>Show Cards</button>
            )}
          </div>

          <div>
            {isPolling && (
              <div>
                Auto refresh: <strong>on</strong>. Updates every 5 seconds over
                120 seconds.
              </div>
            )}
            {!isPolling && (
              <div>
                <strong>Auto refresh is off so data is not updating.</strong>{' '}
                Press start button to continue.{' '}
                <button
                  onClick={() => {
                    setIsPolling(true);
                  }}
                >
                  Start
                </button>
              </div>
            )}
          </div>

          <hr />
          <div>
            <button onClick={deleteCurrentGame}>Delete Game</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlayGame;
