# planningpoker.games

![Build Status](https://github.com/briangershon/planning-poker/workflows/Continuous%20Integration/badge.svg)

## About

The game is an entry in the [Cloudflare Developer Challenge](https://challenge.developers.cloudflare.com).

The Cloudflare Developer Challenge is an event where developers are challenged to build an application using at least two of the products from the Cloudflare developer platform.

This project used Cloudflare Pages, Workers, Durable Objects and KV store.

This was a good fit for Cloudflare Durable Objects in that each game manages game state and state for multiple players.

## Screenshot

![Planning Poker screenshot](planning-poker-screenshot.png?raw=true)

## Where is site hosted?

Live website hosted at <https://planningpoker.games/>

API hosted at <https://planningpoker.games/api>

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

### Package project up for PRODUCTION

    cd frontend
    npm run build:prod

## Deploy / Publish

### Frontend

    # push to this github repo and Cloudflare pages runs `npm run build:prod`

## Backend / Cloudflare worker

    # setup Github oAuth secrets for production via wrangler
    wrangler secret put GITHUB_CLIENT_ID
    wrangler secret put GITHUB_CLIENT_SECRET
    wrangler secret put GITHUB_CLIENT_SUCCESS_URL to https://planningpoker.games

    cd workers
    nvm use
    npm i @cloudflare/wrangler -g
    wrangler publish

## Sample curl requests

    curl -i --data '{"name": "Brian"}' http://localhost:8787/games/123/join

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

## FAQs

### When running locally, I see a "TypeError"

When running locally, if you see `TypeError` and `The first argument must be of type string or an instance of Buffer. Received an instance of Uint8Array` you're using an old version of Node.js. Run `nvm use` to get the latest version.
