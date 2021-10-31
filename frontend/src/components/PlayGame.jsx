import React, { useEffect } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
const { API_URL } = import.meta.env;
import { deleteGameId } from '../store/userSlice';

import Players from './Players';
import styles from './PlayGame.module.css';

import { useSelector, useDispatch } from 'react-redux';
import {
  showCards,
  hideCards,
  addPlayer,
  endGame,
  vote,
  updateStory,
} from '../store/pokerSlice';

function PlayGame() {
  const game = useSelector((state) => state.poker);
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  let { gameId } = useParams();

  let history = useHistory();

  useEffect(() => {
    fetch(`${API_URL}/games/${gameId}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data !== null) {
          dispatch(updateStory(data.story));
        }
      })
      .catch((e) => {
        console.log('server error', e);
      });
  }, []);

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

  const gameInviteUrl = `/games/${gameId}`;

  return (
    <div>
      {!isLoggedIn && <div>Please login to participate in game.</div>}
      {isLoggedIn && (
        <div>
          <div>
            Share this <Link to={gameInviteUrl}>URL</Link> to invite others to
            the game.
          </div>
          <div>
            Story: <strong>{game.story}</strong> (update:{' '}
            <input value={game.story} onChange={sendStoryUpdate} />)
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
                <button onClick={() => dispatch(vote('XS'))}>XS</button>
              </li>
              <li>
                <button onClick={() => dispatch(vote('S'))}>S</button>
              </li>
              <li>
                <button onClick={() => dispatch(vote('M'))}>M</button>
              </li>
              <li>
                <button onClick={() => dispatch(vote('L'))}>L</button>
              </li>
              <li>
                <button onClick={() => dispatch(vote('XL'))}>XL</button>
              </li>
              <li>
                <button onClick={() => dispatch(vote('XXL'))}>XXL</button>
              </li>
              <li>
                <button onClick={() => dispatch(vote('?'))}>?</button>
              </li>
              <li>
                <button onClick={() => dispatch(vote(null))}>Clear</button>
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
            <button
              onClick={() =>
                dispatch(
                  addPlayer({
                    name: 'New',
                    value: null,
                  })
                )
              }
            >
              Add Player
            </button>
            <button onClick={deleteCurrentGame}>Delete Game</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlayGame;
