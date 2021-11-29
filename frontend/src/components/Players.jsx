import React from 'react';
import styles from './Players.module.css';
import CardVisible from './CardVisible';
import CardHidden from './CardHidden';
import { InviteesAwaitingVote } from './InviteesAwaitingVote';

function Players({ you, players, playersPresent, showCards }) {
  console.log('you', you);
  console.log('playersPresent', playersPresent);
  return (
    <>
      <ul className={styles.ul}>
        <li key={you.name} className={styles.li}>
          {you.vote ? (
            <CardVisible name={you.name} value={you.vote} />
          ) : (
            <CardHidden name={you.name} />
          )}
        </li>
        {players.map((p) => {
          return (
            <li key={p.name} className={styles.li}>
              {showCards ? (
                <CardVisible name={p.name} value={p.vote} cardState="visible" />
              ) : (
                <CardHidden name={p.name} />
              )}
            </li>
          );
        })}
        <InviteesAwaitingVote players={playersPresent} />
      </ul>
      {/* <button className={styles.button}>Invite players</button> */}
    </>
  );
}

export default Players;
