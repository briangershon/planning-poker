import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { createGame } from '../store/pokerSlice';

function HomePage() {
  const gameId = useSelector((state) => state.poker.gameId);
  const dispatch = useDispatch();

  return (
    <div>
      {gameId && (
        <div>
          Go to <Link to={`/game/${gameId}`}>game in progress</Link>.
        </div>
      )}

      {!gameId && (
        <button
          onClick={() => {
            dispatch(createGame());
          }}
        >
          New Game
        </button>
      )}
    </div>
  );
}

export default HomePage;
