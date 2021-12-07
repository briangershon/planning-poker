import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addGameId } from '../store/userSlice';
import { TShirt } from '../components/TShirt';
import styles from './HomePage.module.css';
const { SITE_URL } = import.meta.env;

function HomePage() {
  const userGameIds = useSelector((state) => state.user.gameIds);
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
          <div className={styles.container}>
            <div>
              <p>
                Estimate the t-shirt size of software stories with your team in
                real-time.
              </p>
              <ul>
                <li>
                  <p>
                    <a href="/api/login/github">Login</a> to start a planning
                    poker game.
                  </p>
                </li>
                <li>
                  <p>
                    See <a href="/documentation">docs for a walk through</a> of
                    this app.
                  </p>
                </li>
                <li>
                  <p>
                    Visit <Link to="/about">About</Link> to learn how the game
                    was built and a link to source code.
                  </p>
                </li>
              </ul>
            </div>

            <div className={styles.homePageTShirt}>
              <TShirt
                name={'Player One'}
                vote={'XXL'}
                avatarUrl={
                  'https://avatars.githubusercontent.com/u/93482534?v=4'
                }
              />
            </div>
          </div>
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
      {isLoggedIn && (
        <>
          <button onClick={newGame}>New Game</button>{' '}
          <p>
            See <a href="/documentation">docs for a walk through</a> of this
            app.
          </p>
        </>
      )}
    </div>
  );
}

export default HomePage;
