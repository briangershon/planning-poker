import React, { useState, useEffect } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
const { API_URL } = import.meta.env;
import { deleteGameId } from '../store/userSlice';

import Players from './Players';
import styles from './PlayGame.module.css';

import { useSelector, useDispatch } from 'react-redux';
import {
  showCards,
  hideCards,
  endGame,
  vote,
  updateStory,
  updatePlayers,
} from '../store/pokerSlice';

function PlayGame() {
  const game = useSelector((state) => state.poker);
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  const [isPolling, setIsPolling] = useState(true);

  let { gameId } = useParams();

  let history = useHistory();

  function refresh() {
    fetch(`${API_URL}/games/${gameId}`, {
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
      }, 60000);
      return () => {
        return clearTimeout(timer);
      };
    }
  }, [isPolling]);

  async function deleteCurrentGame() {
    const response = await fetch(`${API_URL}/games/${gameId}`, {
      method: 'DELETE',
    });
    history.push(`/`);
    dispatch(deleteGameId(gameId));
  }

  async function sendStoryUpdate(event) {
    const newStory = event.target.value;
    const response = await fetch(
      `${API_URL}/games/${gameId}?` + new URLSearchParams({ story: newStory }),
      {
        method: 'PUT',
      }
    );
    dispatch(updateStory(newStory));
  }

  async function sendVote(voteCasted) {
    const response = await fetch(
      `${API_URL}/games/${gameId}?` + new URLSearchParams({ vote: voteCasted }),
      {
        method: 'PUT',
      }
    );
    dispatch(vote(voteCasted));
  }

  const gameInviteUrl = `/games/${gameId}`;

  return (
    <div>
      {!isLoggedIn && <div>Please login to participate in game.</div>}
      {isLoggedIn && (
        <div>
          <div>
            Invite others by sending them this <Link to={gameInviteUrl}>link</Link>.
          </div>
          <div>
            Story: <strong>{game.story}</strong> (update:{' '}
            <input value={game.story} onChange={sendStoryUpdate} />)
          </div>
          <div>
            Auto refresh: {isPolling && <strong>on</strong>}
            {!isPolling && (
              <button
                onClick={() => {
                  setIsPolling(true);
                }}
              >
                Start
              </button>
            )}
          </div>
          <Players
            you={game.you}
            players={game.players}
            showCards={game.showCards}
          />
          <div>
            <p>Choose your card:</p>
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

          {game.showCards ? (
            <button onClick={() => dispatch(hideCards())}>Hide Cards</button>
          ) : (
            <button onClick={() => dispatch(showCards())}>Show Cards</button>
          )}
          <div>
            <button
              onClick={() => {
                dispatch(endGame());
                history.push('/');
              }}
            >
              End Game
            </button>
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
