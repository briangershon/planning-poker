import React from 'react';
import styles from './Players.module.css';
import CardVisible from './CardVisible';
import CardHidden from './CardHidden';
import CardPlaceholder from './CardPlaceholder';

function Players({ you, players, showCards }) {
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
        {players.length === 0 && (
          <li key="placeholder" className={styles.li}>
            <CardPlaceholder name={'add player'} />
          </li>
        )}
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
      </ul>
      {/* <button className={styles.button}>Invite players</button> */}
    </>
  );
}

export default Players;
