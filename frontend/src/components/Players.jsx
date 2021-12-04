import React from 'react';
import styles from './Players.module.css';
import CardVisible from './CardVisible';
import CardHidden from './CardHidden';

function Players({ you, players, playersPresent, showCards }) {
  return (
    <>
      <div>
        <div>
          <ul className={styles.ul}>
            <li key={you.name} className={styles.li}>
              {you.vote ? (
                <CardVisible
                  name={you.name}
                  value={you.vote}
                  avatarUrl={you.avatarUrl}
                />
              ) : (
                <CardHidden
                  name={you.name}
                  vote={you.vote}
                  avatarUrl={you.avatarUrl}
                />
              )}
            </li>
            {players.map((p) => {
              return (
                <li key={p.name} className={styles.li}>
                  {showCards ? (
                    <CardVisible
                      name={p.name}
                      value={p.vote}
                      avatarUrl={p.avatarUrl}
                      cardState="visible"
                    />
                  ) : (
                    <CardHidden
                      name={p.name}
                      vote={p.vote}
                      avatarUrl={p.avatarUrl}
                    />
                  )}
                </li>
              );
            })}
            {playersPresent.map((p) => {
              return (
                <li key={p.name} className={styles.li}>
                  <CardHidden
                    name={p.name}
                    vote={p.vote}
                    avatarUrl={p.avatarUrl}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}

export default Players;
