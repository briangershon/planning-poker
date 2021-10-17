import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { createGame } from '../store/pokerSlice';
const { API_URL } = import.meta.env;

function HomePage() {
  const gameId = useSelector((state) => state.poker.gameId);
  const dispatch = useDispatch();

  useEffect(() => {
    fetch(`${API_URL}/me`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((e) => {
        console.log('server error', e);
      });
  });

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
