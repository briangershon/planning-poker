import React from 'react';

function WalkThroughPage() {
  return (
    <div>
      <h1>Documentation</h1>

      <h2>Walk Through</h2>

      <p>
        Here's the home page:
        <img
          width="100%"
          src="/walk-through/home-logged-out.png"
          alt="Home page, not yet logged-in"
        />
      </p>
      <p>
        If you are not logged in, choose <strong>Login</strong> to login via
        your Github account:{' '}
        <img
          width="100%"
          src="/walk-through/home.png"
          alt="Home page, logged-in and awaiting to create a new game"
        />
      </p>
      <p>
        Click on <strong>New Game</strong> to create a new game, then type in a
        story at the top:{' '}
        <img
          width="100%"
          src="/walk-through/new-game.png"
          alt="A new game was created and story text was added"
        />
      </p>

      <p>
        Invite player(s) by clicking the <strong>Invite Players</strong> button
        to copy the game's URL to the clipboard. Send that URL to the other
        players so they can join.{' '}
        <em>
          Note that this URL is the same one as the game's URL in the address
          bar.
        </em>
        <img
          width="100%"
          src="/walk-through/invite.png"
          alt="The game's URL is copied to clipboard to be sent to other players to join the game"
        />
      </p>
      <p>
        Here's the other player joining. Both players see each other:{' '}
        <img
          width="100%"
          src="/walk-through/other-player.png"
          alt="Once the other player(s) join, the players appear in both user's game"
        />
      </p>
      <p>
        One player votes:
        <img
          width="100%"
          src="/walk-through/cast-a-vote.png"
          alt="First player casts a vote and that vote is visible in their view."
        />
      </p>

      <p>
        For the other players, the vote appears as a green t-shirt to show they
        have voted, but their vote is still hidden:
        <img
          width="100%"
          src="/walk-through/other-player-sees-green.png"
          alt="For the other players, the vote appears as a green t-shirt to show they have voted, but their vote is still hidden."
        />
      </p>
      <p>
        When all players vote (or when the <strong>End Game</strong> is pressed)
        the final view appears. Optionally, you can click the{' '}
        <strong>Retry Game</strong> button.
        <img
          width="100%"
          src="/walk-through/final.png"
          alt="Once all players have voted, all votes are revealed."
        />
      </p>
    </div>
  );
}

export default WalkThroughPage;
