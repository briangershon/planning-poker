# planning-poker

![Build Status](https://github.com/briangershon/planning-poker/workflows/Continuous%20Integration/badge.svg)

## About

This game began as an entry in the [Cloudflare Developer Challenge](https://challenge.developers.cloudflare.com). See [Changelog](./CHANGELOG.md) for `v1.0.0`.

Websocket support was added in `v2.0.0`.

The Cloudflare Developer Challenge is an event where developers are challenged to build an application using at least two of the products from the Cloudflare developer platform.

This project uses Cloudflare Workers, Workers KV, Durable Objects, Websockets and Cloudflare Pages. Also React, Redux Toolkit, TypeScript and Snowpack.

Cloudflare `Durable Objects` was ideal for maintaining persistent state for each game and its players, as well as being the central point for consolidating `Websocket` requests coming in from the network edge.

## Screenshot

![Planning Poker screenshot](planning-poker-screenshot.png?raw=true)

## What's new?

See [Changelog](./CHANGELOG.md).

## Github publishing instructions

- Create PR.
- Update changelog in the feature branch. Remember to add link at the bottom too. Commit and push.
- Merge PR.
- Bring down `main` branch.
- Tag it. For example `git tag -a v2.0.0 -m "Add full websocket support"`
- Push tag. For example `git push origin v2.0.0`

## Run application locally

    # setup nvm to manage Node.js versions

    # in on terminal window run the backend
    cd workers
    nvm use       # miniflare needs Node > 12.x

    # create and add development env SECRETS
    cp .env.TEMPLATE .env.local
    # edit .env.local
    GITHUB_CLIENT_ID
    GITHUB_CLIENT_SECRET
    GITHUB_CLIENT_SUCCESS_URL to http://localhost:8080


    npm run dev   # uses miniflare instead of `wrangler dev`
    # api is running at http://localhost:8787/api

    # in second terminal window run the frontend
    cd frontend
    nvm use
    npm install
    npm start
    # visit http://localhost:8080/

### Run front-end tests

    cd frontend
    npm test

## Deploy / Publish

### Frontend

Setup Cloudflare Pages for PRODUCTION:

- Build command: `npm run build:prod`
- Build output directory: `/build`
- Root directory: `/frontend`

To deploy, `push` commits to this github repo.

### Backend / Cloudflare worker

    # setup Github oAuth secrets for production via wrangler
    wrangler secret put GITHUB_CLIENT_ID
    wrangler secret put GITHUB_CLIENT_SECRET
    wrangler secret put GITHUB_CLIENT_SUCCESS_URL to https://planningpoker.games

    cd workers
    nvm use
    npm i @cloudflare/wrangler -g
    wrangler publish

## What is the game architecture?

Scope:

- A game has an ID, a status, a story sentence, and array of users and their card votes.
- No concept of game ownership/admin. Anyone can join and do anything in a game if they have the ID.
- Real-time updates via websockets

Workflow:

- Logged-in user creates game
  - create unique gameId to be used in both route and in Durable Object ID
  - persist gameId by user -- key: `userId:gameId` with value of `createDate` so we can delete games later.
- Visit any valid game route to participate in game. (Participant needs to be logged in)
- Users can cast votes, change story sentence, flip cards
- Poll for updates
- Only creator of game can delete it, albeit `delete` button shows up for all users.

## How is this project organized?

- `/frontend` for static React site.

  - `./src/containers` are components that pull in data from websockets, redux, api calls.
  - `./src/components` should be presentation-only React components.
  - `./src/lib` code modules that don't have a UI

- `/workers` for back-end Cloudflare code.

### SVG Assets

- T-shirt SVG from <https://svgsilh.com/image/34481.html>
- Link icon from <https://icons.getbootstrap.com>

## FAQs

### When running locally, I see a "TypeError"

When running locally, if you see `TypeError` and `The first argument must be of type string or an instance of Buffer. Received an instance of Uint8Array` you're using an old version of Node.js. Run `nvm use` to get the latest version.
