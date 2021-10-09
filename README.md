# planning-poker

Live site hosted at <https://planning-poker.pages.dev/>

![Build Status](https://github.com/briangershon/planning-poker/workflows/Continuous%20Integration/badge.svg)

## Front-end

### Run front-end locally

    cd frontend
    npm install
    npm start
    # visit http://localhost:8080/

### Run front-end tests

    cd frontend
    npm test

### Package project up in dist folder for release to server

    cd frontend
    npm run build

## Run back-end locally

### Run Cloudflare worker locally

    cd workers
    nvm use         # miniflare needs Node > 12.x
    npm run dev   # uses miniflare instead of `wrangler dev`
    # visit http://127.0.0.1:8787

## Publish Cloudflare worker

    cd workers
    wrangler publish
