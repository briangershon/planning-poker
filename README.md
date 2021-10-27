# planningpoker.games

Live website hosted at <https://planningpoker.games/>

API hosted at <https://planningpoker.games/api>

![Build Status](https://github.com/briangershon/planning-poker/workflows/Continuous%20Integration/badge.svg)

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

## Publish

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
