import React from 'react';
import styles from './Card.module.css';

function CardHidden({ name = '(?)', vote = null, avatarUrl }) {
  return (
    <div className={styles.cardWrapper}>
      {vote === null && (
        <div className={`${styles.card} ${styles.hidden}`}>&nbsp;</div>
      )}
      {vote !== null && (
        <div
          className={`${styles.card} ${styles.hidden} ${styles.voted}`}
        >&nbsp;</div>
      )}
      <div>
        <img src={avatarUrl} width="50" />
      </div>
      <div className={styles.cardName}>{name}</div>
    </div>
  );
}

export default CardHidden;
