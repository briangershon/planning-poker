import React, { useEffect, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
const { SITE_URL, WEBSOCKET_URL } = import.meta.env;
import { deleteGameId } from '../store/userSlice';
import Cookies from 'js-cookie';

import { GameInvite } from '../components/GameInvite';

import Players from '../components/Players';
import styles from './PlayGame.module.css';

import { useSelector, useDispatch } from 'react-redux';
import {
  vote,
  updateStory,
  updatePlayers,
  updatePlayersPresent,
  resetGame,
  startGame,
  endGame,
  clearAllVotes,
  updateGameState,
  updateYou,
} from '../store/pokerSlice';

import { WebsocketClient } from '../lib/websocket_client';

import { GameStory } from '../components/GameStory';
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
      case 'game-state-change':
        // socket just letting us know something changed
        // we'll fetch the updated data ourselves via http
        refresh();
        break;
      case 'game-delete':
        window.alert('This game has been deleted.');
        history.push(`/`);
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
    refresh();

    return function cleanup() {
      ws.current.close();
    };
  }, []);

  function refresh() {
    fetch(`${SITE_URL}/api/games/${gameId}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data !== null) {
          dispatch(updateGameState(data.gameState));
          dispatch(updateStory(data.story));
          dispatch(updatePlayers(data.votes));
          dispatch(updatePlayersPresent(data.playersPresent));
          dispatch(updateYou(data.you));
        }
      })
      .catch((e) => {
        console.log('server error', e);
      });
  }

  async function deleteCurrentGame() {
    if (confirm('Are you sure you want to delete?')) {
      ws.current.deleteGame();
      dispatch(deleteGameId(gameId));
      history.push(`/`);
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

  function beginGame() {
    ws.current.updateGameState('in-progress');
    dispatch(startGame());
  }

  function completeGame() {
    ws.current.updateGameState('complete');
    dispatch(endGame());
  }

  function retryGame() {
    ws.current.restartGame();
    dispatch(clearAllVotes());
    refresh();
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
          {game.gameState === 'lobby' && (
            <>
              <GameStory story={game.story} sendStoryUpdate={sendStoryUpdate} />

              <Players
                you={game.you}
                players={game.players}
                playersPresent={game.playersPresent}
                showCards={false}
              />

              <div>
                {game.playersPresent.length === 0 && (
                  <p>
                    <strong>
                      You need at least one other player to start the game.
                    </strong>
                  </p>
                )}

                <div className={styles.center}>
                  <GameInvite
                    relativeGameInviteUrl={relativeGameInviteUrl}
                    gameInviteUrl={gameInviteUrl}
                  />{' '}
                  <button
                    onClick={beginGame}
                    disabled={game.playersPresent.length === 0}
                  >
                    Start Game
                  </button>
                </div>
              </div>
            </>
          )}

          {game.gameState === 'in-progress' && (
            <>
              <GameStory story={game.story} sendStoryUpdate={sendStoryUpdate} />

              <h2>Cast your vote</h2>
              <GameVote sendVote={sendVote} currentVote={game.you.vote} />
              <Players
                you={game.you}
                players={game.players}
                playersPresent={game.playersPresent}
                showCards={false}
              />

              <div className={styles.center}>
                <p>
                  Votes will be revealed once everyone has voted. You can also
                  manually end the game here.
                </p>
                <GameInvite
                  relativeGameInviteUrl={relativeGameInviteUrl}
                  gameInviteUrl={gameInviteUrl}
                />{' '}
                <button onClick={completeGame}>End Game</button>
              </div>
            </>
          )}

          {game.gameState === 'complete' && (
            <>
              <GameStory story={game.story} />

              <h2>Final Results</h2>
              <Players
                you={game.you}
                players={game.players}
                playersPresent={game.playersPresent}
                showCards={true}
              />

              <div>
                <button className={styles.center} onClick={retryGame}>
                  Retry Game
                </button>
              </div>
            </>
          )}

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
