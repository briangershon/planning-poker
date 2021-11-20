import React from 'react';
import { Link } from 'react-router-dom';

import styles from '../containers/PlayGame.module.css';

export function GameInvite({ relativeGameInviteUrl, gameInviteUrl }) {
  return (
    <div className={styles.inviteLink}>
      Invite others by sending them to:{' '}
      <Link to={relativeGameInviteUrl}>{gameInviteUrl}</Link>
    </div>
  );
}
