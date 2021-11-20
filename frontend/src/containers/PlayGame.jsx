import React, { useEffect, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
const { SITE_URL, WEBSOCKET_URL } = import.meta.env;
import { deleteGameId } from '../store/userSlice';
import Cookies from 'js-cookie';

import Players from '../components/Players';
import styles from './PlayGame.module.css';

import { useSelector, useDispatch } from 'react-redux';
import {
  showCards,
  hideCards,
  vote,
  updateStory,
  updatePlayers,
  resetGame,
} from '../store/pokerSlice';

import { WebsocketClient } from '../lib/websocket_client';

import { GameStory } from '../components/GameStory';
import { GameInvite } from '../components/GameInvite';
import { GameView } from '../components/GameView';
import { GameVote } from '../components/GameVote';

function PlayGame() {
  const game = useSelector((state) => state.poker);
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  let { gameId } = useParams();

  let history = useHistory();

  const ws = useRef(null);

  function onMessage(data) {
    const { eventId, eventData } = data;
    switch (eventId) {
      case 'debug':
        console.log(eventData);
        break;
      case 'game-state-change':
        // socket just letting us know something changed, we'll fetch the updated data ourselves
        refresh();
        break;
      default:
        console.log('unknown incoming websocket event', event);
    }
  }

  function initWebsocket() {
    const sessionId = Cookies.get('session');
    ws.current = new WebsocketClient({
      url: WEBSOCKET_URL,
      sessionId,
      gameId,
      onMessage,
    });
    ws.current.init();
  }

  useEffect(() => {
    initWebsocket();
    dispatch(resetGame());
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

  // refresh all game data when page first loads
  useEffect(() => {
    refresh();
  }, []);

  async function deleteCurrentGame() {
    if (confirm('Are you sure you want to delete?')) {
      const response = await fetch(`${SITE_URL}/api/games/${gameId}`, {
        method: 'DELETE',
      });
      history.push(`/`);
      dispatch(deleteGameId(gameId));
    }
  }

  async function sendStoryUpdate(story) {
    ws.current.sendStory(story);
    dispatch(updateStory(story));
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
          the planning poker game.
        </div>
      )}

      {isLoggedIn && (
        <div>
          <h2>1. Story</h2>
          <GameStory story={game.story} sendStoryUpdate={sendStoryUpdate} />
          <h2>2. Invite</h2>
          <GameInvite
            relativeGameInviteUrl={relativeGameInviteUrl}
            gameInviteUrl={gameInviteUrl}
          />
          {/* <h2>3. Cast your vote</h2>
          <GameVote />
          <GameView /> */}

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
