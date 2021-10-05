import React from 'react';
import styles from './Card.module.css';

function CardHidden({ name = '(?)' }) {
  return (
    <>
      <div className={`${styles.card} ${styles.hidden}`}></div>
      {name}
    </>
  );
}

export default CardHidden;
