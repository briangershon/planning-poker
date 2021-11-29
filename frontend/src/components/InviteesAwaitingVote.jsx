import React from 'react';
import styles from './Invitees.module.css';

export function InviteesAwaitingVote({ players }) {
  if (players.length === 0) return null;
  return (
    <>
      <p>Awaiting votes:</p>
      <ul className={styles.ul}>
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
