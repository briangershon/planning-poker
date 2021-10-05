import React from 'react';
import { useHistory, useParams } from 'react-router-dom';

import Players from './Players';
import styles from './PlayGame.module.css';

import { useSelector, useDispatch } from 'react-redux';
import {
  showCards,
  hideCards,
  addPlayer,
  endGame,
  vote,
} from '../store/pokerSlice';

function PlayGame() {
  const game = useSelector((state) => state.poker);
  const dispatch = useDispatch();

  let { gameId } = useParams();

  let history = useHistory();

  if (!game.gameId) {
    history.push('/');
  }

  return (
    <div>
      Game ID is {gameId}. Game ID in state {game.gameId}.
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
            <button onClick={() => dispatch(vote('?'))}>
              ?
            </button>
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
      </div>
    </div>
  );
}

export default PlayGame;
