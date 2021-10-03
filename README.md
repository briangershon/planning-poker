# react-minimal

A starter React.js project with curated dependencies and tools.

![Build Status](https://github.com/briangershon/react-minimal/workflows/Continuous%20Integration/badge.svg)

* Development environment includes:
  * Support for es6 modules and hot reloading (via Snowpack)
  * Compile to es5 to run across a wide range of browsers
  * Unit tests (via Jest)
  * Continuous Integration workflow with Github Actions
  * Prettier config
  * Snowpack configuration includes a rollup setting to avoid duplicate `react` and `react-dom` when importing CJS modules (which breaks hooks). This setting not used by this starter but avoids potential future problem I've run into with Snowpack projects.

* Styling with default fonts that look great across operating systems.

## Run Local Dev Server

    npm install  # install dependencies

    npm start
    # visit http://localhost:1234

## Run Tests

    npm test

## Package project up in dist folder for release to server

    npm run build
