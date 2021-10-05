import React from 'react';
import styles from './Card.module.css';

function CardVisible({ name = '(?)', value = '?' }) {
  return (
    <>
      <div className={styles.card}>{value}</div>
      {name}
    </>
  );
}

export default CardVisible;
