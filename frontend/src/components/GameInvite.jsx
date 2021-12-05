import React from 'react';
import styles from './GameInvite.module.css';

export function GameInvite({ relativeGameInviteUrl, gameInviteUrl }) {
  function onClick() {
    navigator.clipboard.writeText(gameInviteUrl);
    alert(`${gameInviteUrl} url copied! Sent to other players.`);
  }

  return (
    <>
      <div className={styles.container}>
        {/* <div className={styles.label}>Invite players: </div> */}
        <button className={styles.button} onClick={onClick}>
          Invite players via <img src="/link-45deg.svg" />
        </button>
        {/* <div className={styles.shortLink}>{gameInviteUrl}</div> */}
      </div>
    </>
  );
}
