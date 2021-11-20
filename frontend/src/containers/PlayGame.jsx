import React, { useEffect, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
const { SITE_URL, WEBSOCKET_URL } = import.meta.env;
import { deleteGameId } from '../store/userSlice';
import Cookies from 'js-cookie';

import Players from '../components/Players';

import { useSelector, useDispatch } from 'react-redux';
import {
  vote,
  updateStory,
  updatePlayers,
  resetGame,
  startGame,
  endGame,
  clearAllVotes,
  updateGameState,
} from '../store/pokerSlice';

import { WebsocketClient } from '../lib/websocket_client';

import { GameStory } from '../components/GameStory';
import { GameInvite } from '../components/GameInvite';
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
          dispatch(updateGameState(data.gameState));
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

  function beginGame() {
    ws.current.updateGameState('in-progress');
    dispatch(startGame());
  }

  function completeGame() {
    ws.current.updateGameState('complete');
    dispatch(endGame());
  }

  function restartGame() {
    ws.current.restartGame();
    dispatch(clearAllVotes());
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
              <div>
                <strong>
                  Please add the story you want to estimate, invite players,
                  then <em>Start Game</em>.
                </strong>
              </div>

              <h2>Story</h2>
              <GameStory story={game.story} sendStoryUpdate={sendStoryUpdate} />

              <h2>Invite</h2>
              <GameInvite
                relativeGameInviteUrl={relativeGameInviteUrl}
                gameInviteUrl={gameInviteUrl}
              />

              <h2>Play Game</h2>
              <div>
                <button onClick={beginGame}>Start Game</button>
              </div>
            </>
          )}

          {game.gameState === 'in-progress' && (
            <>
              <h2>Story</h2>
              <GameStory story={game.story} sendStoryUpdate={sendStoryUpdate} />

              <h2>Cast your vote</h2>
              <GameVote sendVote={sendVote} />
              <Players
                you={game.you}
                players={game.players}
                showCards={false}
              />

              <div>
                <p>
                  Votes will be revealed once everyone has voted. You can also
                  manually end the game here.
                </p>
                <button onClick={completeGame}>End Game</button>
              </div>
            </>
          )}

          {game.gameState === 'complete' && (
            <>
              <h2>Story</h2>
              <GameStory story={game.story} />

              <h2>Final Results</h2>

              <Players you={game.you} players={game.players} showCards={true} />

              <div>
                <button onClick={restartGame}>Restart Game</button>
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
