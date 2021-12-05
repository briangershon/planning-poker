import React from 'react';
import styles from './Players.module.css';
import CardVisible from './CardVisible';

function Players({ you, players, playersPresent, showCards }) {
  return (
    <>
      <div>
        <ul className={styles.ul}>
          <li key={you.name} className={styles.li}>
            {you.vote ? (
              <CardVisible
                name={you.name}
                vote={you.vote}
                avatarUrl={you.avatarUrl}
              />
            ) : (
              <CardVisible
                name={you.name}
                vote={you.vote}
                avatarUrl={you.avatarUrl}
                hidden={true}
              />
            )}
          </li>
          {players.map((p) => {
            return (
              <li key={p.name} className={styles.li}>
                {showCards ? (
                  <CardVisible
                    name={p.name}
                    vote={p.vote}
                    avatarUrl={p.avatarUrl}
                  />
                ) : (
                  <CardVisible
                    name={p.name}
                    vote={p.vote}
                    avatarUrl={p.avatarUrl}
                    hidden={true}
                  />
                )}
              </li>
            );
          })}
          {playersPresent.map((p) => {
            return (
              <li key={p.name} className={styles.li}>
                <CardVisible
                  name={p.name}
                  vote={p.vote}
                  avatarUrl={p.avatarUrl}
                  hidden={true}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

export default Players;
