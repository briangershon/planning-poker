import React from 'react';

function AboutPage() {
  return (
    <div>
      <h1>About Planning Poker</h1>

      <p>
        This game began as an entry in the{' '}
        <a href="https://challenge.developers.cloudflare.com" target="_blank">
          Cloudflare Developer Challenge
        </a>
        .
      </p>
      <p>
        See the{' '}
        <a
          href="https://github.com/briangershon/planning-poker/blob/main/CHANGELOG.md"
          target="_blank"
        >
          Changelog
        </a>{' '}
        for version v1.0.0 submitted for the challenge, as well as the full
        websocket version that was added in v2.0.0.
      </p>

      <p>
        The Cloudflare Developer Challenge is an event where developers are
        challenged to build an application using at least two of the products
        from the Cloudflare developer platform.
      </p>

      <p>
        This project uses Cloudflare Workers, Workers KV, Durable Objects,
        Websockets and Cloudflare Pages. Also React, Redux Toolkit, TypeScript
        and Snowpack.
      </p>

      <p>
        Cloudflare <strong>Durable Objects</strong> was ideal for maintaining
        persistent state for each game and its players, as well as being the
        central point for consolidating <strong>Websocket</strong> requests
        coming in from the network edge.
      </p>

      <p>
        The code is available at:
        <br />
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
        and Github user name.
      </p>
    </div>
  );
}

export default AboutPage;
