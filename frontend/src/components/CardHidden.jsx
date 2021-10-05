import React from 'react';
import styles from './Card.module.css';

function CardHidden({ name = '(?)' }) {
  return (
    <div className={styles.cardWrapper}>
      <div className={`${styles.card} ${styles.hidden}`}></div>
      <div className={styles.cardName}>{name}</div>
    </div>
  );
}

export default CardHidden;
