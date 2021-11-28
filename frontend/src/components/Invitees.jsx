import React from 'react';
import styles from './Invitees.module.css';

export function Invitees({ you, players }) {
  console.log('you', you);
  return (
    <>
      <ul className={styles.ul}>
        <li key={you.name} className={styles.li}>
          <img src={you.avatarUrl} width="40" /> {you.name}{' '}
        </li>
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
