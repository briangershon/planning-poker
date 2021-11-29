import React from 'react';
import styles from './Card.module.css';

function CardHidden({ name = '(?)', vote = null }) {
  return (
    <div className={styles.cardWrapper}>
      {vote === null && (
        <div className={`${styles.card} ${styles.hidden}`}></div>
      )}
      {vote !== null && (
        <div
          className={`${styles.card} ${styles.hidden} ${styles.voted}`}
        ></div>
      )}
      <div className={styles.cardName}>{name}</div>
    </div>
  );
}

export default CardHidden;
