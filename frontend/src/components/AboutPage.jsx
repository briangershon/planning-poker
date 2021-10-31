import React from 'react';

function AboutPage() {
  return (
    <div>
      <h1>About Planning Poker</h1>

      <p>
        The game is an entry in the{' '}
        <a href="https://challenge.developers.cloudflare.com" target="_blank">
          Cloudflare Developer Challenge
        </a>
        .
      </p>

      <p>
        The Cloudflare Developer Challenge is an event where developers are
        challenged to build an application using at least two of the products
        from the Cloudflare developer platform.
      </p>

      <p>
        For this project, I used Cloudflare Pages, Workers, Durable Objects and
        KV store.
      </p>

      <p>
        This was a good fit for Cloudflare Durable Objects in that each game
        manages game state and state for multiple players.
      </p>

      <p>
        The live application can be found at{' '}
        <a href="https://planningpoker.games">planningpoker.games</a> and code
        is available at{' '}
        <a href="https://github.com/briangershon/planning-poker">
          github.com/briangershon/planning-poker
        </a>
        .
      </p>
    </div>
  );
}

export default AboutPage;
