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
    if (data.error) {
      alert(
        `Unable to create additional games, due to ${data.error}. You can delete existing games by viewing then, then choosing Delete button at the bottom.`
      );
    } else {
      dispatch(addGameId({ gameId: data.gameId }));
      history.push(`/games/${data.gameId}`);
    }
  }

  return (
    <div>
      {!isLoggedIn && (
        <div>
          <h1>Welcome to Planning Poker!</h1>
          <h2>What</h2>
          <p>
            Estimate the t-shirt size of software stories with your team in
            real-time.
          </p>
          <h2>How</h2>
          <p>
            Please <a href="/api/login/github">login</a> to create a game to
            play.
          </p>
          <p>
            For information about this site and a link to source code, please
            visit <Link to="/about">About</Link>.
          </p>
        </div>
      )}

      {userGameIds.length === 0 && isLoggedIn && <p>No active games.</p>}

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
