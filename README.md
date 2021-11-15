# planningpoker.games

![Build Status](https://github.com/briangershon/planning-poker/workflows/Continuous%20Integration/badge.svg)

## About

The game is an entry in the [Cloudflare Developer Challenge](https://challenge.developers.cloudflare.com).

The Cloudflare Developer Challenge is an event where developers are challenged to build an application using at least two of the products from the Cloudflare developer platform.

This project uses Cloudflare Workers, Workers KV, Durable Objects, and Cloudflare Pages. Also React, Redux Toolkit, TypeScript and Snowpack.

This was a good fit for Cloudflare `Durable Objects` since each game manages state for multiple players.

## Screenshot

![Planning Poker screenshot](planning-poker-screenshot.png?raw=true)

## What's new?

See [Changelog](./CHANGELOG.md).

## Where is the site?

Live website hosted at <https://planningpoker.games/>

API hosted at <https://planningpoker.games/api>

## Github publishing instructions

- Update changelog in the feature branch, and remember to add link to the bottom and updated the `unreleased` link too. Commit and push.
- `git tag -a v1.2.3`
- `git push origin v1.2.3`

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
- Get it working with polling (then use realtime websocket)

Workflow:

- Logged-in user creates game
  - create unique gameId to be used in both route and in Durable Object ID
  - persist gameId by user -- key: `userId:gameId` with value of `createDate` so we can delete games later.
- Visit any valid game route to participate in game. (Participant needs to be logged in)
- Users can cast votes, change story sentence, flip cards
- Poll for updates
- Only creator of game can delete it, albeit `delete` button shows up for all users.

## FAQs

### When running locally, I see a "TypeError"

When running locally, if you see `TypeError` and `The first argument must be of type string or an instance of Buffer. Received an instance of Uint8Array` you're using an old version of Node.js. Run `nvm use` to get the latest version.
