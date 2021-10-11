# planningpoker.games

Live website hosted at <https://planningpoker.games/>

API hosted at <https://planningpoker.games/api>

![Build Status](https://github.com/briangershon/planning-poker/workflows/Continuous%20Integration/badge.svg)

## Run application locally

    # in on terminal window
    cd workers
    nvm use       # miniflare needs Node > 12.x
    npm run dev   # uses miniflare instead of `wrangler dev`
    # api is running at http://localhost:8787/api

    # in 2nd terminal window
    cd frontend
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

Frontend via:

    # push to this github repo and Cloudflare pages runs `npm run build:prod`

Cloudflare worker via

    cd workers
    nvm use
    npm i @cloudflare/wrangler -g
    wrangler publish

## Sample curl requests

    curl -i --data '{"name": "Brian"}' http://localhost:8787/games/123/join
