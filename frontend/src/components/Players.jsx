import React from 'react';
import styles from './Players.module.css';
import CardVisible from './CardVisible';
import CardHidden from './CardHidden';
import { InviteesAwaitingVote } from './InviteesAwaitingVote';

function Players({ you, players, playersPresent, showCards }) {
  return (
    <>
      <ul className={styles.ul}>
        <li key={you.name} className={styles.li}>
          {you.vote ? (
            <CardVisible name={you.name} value={you.vote} />
          ) : (
            <CardHidden name={you.name} vote={you.vote} />
          )}
        </li>
        {players.map((p) => {
          return (
            <li key={p.name} className={styles.li}>
              {showCards ? (
                <CardVisible name={p.name} value={p.vote} cardState="visible" />
              ) : (
                <CardHidden name={p.name} vote={p.vote} />
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
