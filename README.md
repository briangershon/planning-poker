# planning-poker

Live site hosted at <https://planning-poker.pages.dev/>

![Build Status](https://github.com/briangershon/planning-poker/workflows/Continuous%20Integration/badge.svg)

## Run front-end locally

    cd frontend
    npm install  # install dependencies

    npm start
    # visit http://localhost:8080/

## Run Cloudflare worker locally

    # though doesn't work yet for Durable Objects

    cd workers
    wrangler dev
    # visit http://127.0.0.1:8787

## Publish Cloudflare worker

    cd workers
    wrangler publish

## Run Tests

    cd frontend
    npm test

## Package project up in dist folder for release to server

    cd frontend
    npm run build
