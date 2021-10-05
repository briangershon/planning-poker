import React from 'react';
import styles from './Card.module.css';

function CardVisible({ name = '(?)', value = '?' }) {
  return (
    <div className={styles.cardWrapper}>
      <div className={styles.card}>{value}</div>
      <div className={styles.cardName}>{name}</div>
    </div>
  );
}

export default CardVisible;
