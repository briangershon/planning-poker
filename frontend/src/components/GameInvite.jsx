import React, { useState } from 'react';
import styles from './GameInvite.module.css';

export function GameInvite({ gameInviteUrl }) {
  const [message, updateMessage] = useState('');

  function onClick() {
    navigator.clipboard.writeText(gameInviteUrl);
    updateMessage(`URL copied to clipboard!`);
    setTimeout(() => {
      updateMessage('');
    }, 2000);
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.message}>{message}</div>
        <button className={styles.button} onClick={onClick}>
          Invite players via <img src="/link-45deg.svg" />
        </button>
      </div>
    </>
  );
}
