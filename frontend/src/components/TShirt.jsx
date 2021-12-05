import React from 'react';
import styles from './TShirt.module.css';

export function TShirt({
  name = '(?)',
  hidden = false,
  vote = null,
  avatarUrl,
}) {
  return (
    <div className={styles.cardWrapper}>
      <div className={styles.avatarWrapper}>
        <img src={avatarUrl} />
      </div>

      {!hidden && (
        <div className={`${styles.tshirt} ${styles.active}`}>
          <div>{vote}</div>
        </div>
      )}

      {hidden && vote === null && (
        <div className={`${styles.tshirt}`}>&nbsp;</div>
      )}
      {hidden && vote !== null && (
        <div className={`${styles.tshirt} ${styles.active}`}>&nbsp;</div>
      )}

      <div className={styles.cardName}>{name}</div>
    </div>
  );
}
