import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { createGame } from '../store/pokerSlice';
import { addGameId } from '../store/userSlice';
const { API_URL } = import.meta.env;

function HomePage() {
  const userGameIds = useSelector((state) => state.user.gameIds);
  const gameId = useSelector((state) => state.poker.gameId);
  const dispatch = useDispatch();

  return (
    <div>
      {userGameIds && <div>{JSON.stringify(userGameIds)}</div>}
      {gameId && (
        <div>
          Go to <Link to={`/game/${gameId}`}>game in progress</Link>.
        </div>
      )}

      {!gameId && (
        <button
          onClick={() => {
            dispatch(createGame());
            fetch(`${API_URL}/games`, {
              method: 'POST',
            })
              .then((response) => response.json())
              .then((data) => {
                dispatch(addGameId({ gameId: data.gameId }));
              })
              .catch((e) => {
                console.log('server error', e);
              });
          }}
        >
          New Game
        </button>
      )}
    </div>
  );
}

export default HomePage;
