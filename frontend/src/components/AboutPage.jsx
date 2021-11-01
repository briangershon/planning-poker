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
        This project uses Cloudflare Workers, Workers KV, Durable Objects, and
        Cloudflare Pages. Also React, Redux Toolkit, TypeScript and Snowpack.
      </p>

      <p>
        This was a good fit for Cloudflare <strong>Durable Objects</strong>{' '}
        since each game manages state for multiple players.
      </p>

      <p>
        The code is available at{' '}
        <a
          href="https://github.com/briangershon/planning-poker"
          target="_blank"
        >
          github.com/briangershon/planning-poker
        </a>
        .
      </p>

      <h2>Data Privacy</h2>
      <p>
        When you login via Github, this app only has permissions to public
        information from your Github profile, including your name, avatar URL,
        Github user name and token.
      </p>
    </div>
  );
}

export default AboutPage;
