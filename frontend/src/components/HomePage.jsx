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
          <p>
            Please <a href="/api/login/github">login</a> to play. Visit{' '}
            <Link to="/about">about</Link> for more info.
          </p>
          <p>
            You can also try a{' '}
            <a href="https://planningpoker.games/games/715ffdd8-6a65-42f6-92ff-89f37933acc5">
              Demo Game
            </a>{' '}
            if you don't have a second Github account to test playing a game with
            multiple players.
          </p>
        </div>
      )}
      {!userGameIds.length && isLoggedIn && (
        <p>
          You can also try a{' '}
          <a href="https://planningpoker.games/games/715ffdd8-6a65-42f6-92ff-89f37933acc5">
            Demo Game
          </a>{' '}
          if you don't have a second Github account to test playing a game with
          multiple players.
        </p>
      )}
      {userGameIds.length > 0 && isLoggedIn && (
        <div>
          <div>Your Games</div>
          <ul>
            <li>
              You can also try a{' '}
              <a href="https://planningpoker.games/games/715ffdd8-6a65-42f6-92ff-89f37933acc5">
                Demo Game
              </a>{' '}
              if you don't have a second Github account to test playing a game
              with multiple players.
            </li>
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
