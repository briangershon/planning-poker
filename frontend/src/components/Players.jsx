import React from 'react';
import styles from './Players.module.css';
import CardVisible from './CardVisible';
import CardHidden from './CardHidden';

function Players({ you, players, showCards }) {
  return (
    <>
      <ul className={styles.ul}>
        <li className={styles.li}>
          {you.value ? (
            <CardVisible name={you.name} value={you.value} />
          ) : (
            <CardHidden name={you.name} />
          )}
        </li>
        {players.map((p) => {
          return (
            <li key={p.name} className={styles.li}>
              {showCards ? (
                <CardVisible
                  name={p.name}
                  value={p.vote}
                  cardState="visible"
                />
              ) : (
                <CardHidden name={p.name} />
              )}
            </li>
          );
        })}
      </ul>
      {/* <button className={styles.button}>Invite players</button> */}
    </>
  );
}

export default Players;
