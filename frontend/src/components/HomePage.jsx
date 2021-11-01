import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addGameId } from '../store/userSlice';
const { SITE_URL } = import.meta.env;

function HomePage() {
  const userGameIds = useSelector((state) => state.user.gameIds);
  const gameId = useSelector((state) => state.poker.gameId);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const dispatch = useDispatch();
  const history = useHistory();

  async function newGame() {
    const response = await fetch(`${SITE_URL}/api/games`, {
      method: 'POST',
    });
    const data = await response.json();
    dispatch(addGameId({ gameId: data.gameId }));
    history.push(`/games/${data.gameId}`);
  }

  return (
    <div>
      {!isLoggedIn && (
        <div>
          <h1>Welcome to Planning Poker!</h1>
          <div>
            Please <a href="/api/login/github">login</a> to play.
            Visit <Link to="/about">about</Link> for more info.
          </div>
        </div>
      )}
      {!userGameIds.length && isLoggedIn && <div>No games in progress.</div>}
      {userGameIds.length > 0 && isLoggedIn && (
        <div>
          <div>Your Games</div>
          <ul>
            {userGameIds.map((gameId) => {
              return (
                <li key={gameId}>
                  <Link to={`/games/${gameId}`}>Play game in progress</Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {isLoggedIn && <button onClick={newGame}>New Game</button>}
    </div>
  );
}

export default HomePage;
