import React from 'react';
import styles from './Card.module.css';

function CardPlaceholder({ name = '(?)' }) {
  return (
    <div className={styles.cardWrapper}>
      <div className={`${styles.card} ${styles.placeholder}`}>Invite other players by sending them link above!</div>
      <div className={styles.cardName}>{name}</div>
    </div>
  );
}

export default CardPlaceholder;
