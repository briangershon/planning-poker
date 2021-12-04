import React from 'react';

export function GameInvite({ relativeGameInviteUrl, gameInviteUrl }) {
  function onClick() {
    navigator.clipboard.writeText(gameInviteUrl);
    alert(`${gameInviteUrl} url copied! Sent to other players.`);
  }

  return (
    <>
      <button onClick={onClick}>Invite Players</button>
    </>
  );
}
