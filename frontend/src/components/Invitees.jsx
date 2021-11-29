import React from 'react';
import styles from './Invitees.module.css';

export function Invitees({ players }) {
  return (
    <>
      <p>Players currently online:</p>
      <ul className={styles.ul}>
        {players.length === 0 && (
          <li key="placeholder" className={styles.li}>
            You need at least one other player to start game.
          </li>
        )}
        {players.map((p) => {
          return (
            <li key={p.name} className={styles.li}>
              <img src={p.avatarUrl} width="40" /> {p.name}{' '}
            </li>
          );
        })}
      </ul>
    </>
  );
}
