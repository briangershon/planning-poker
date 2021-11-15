# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

- N/A

## [2.0.0] - 2021-11-14

### Added

- Add Websocket support
  - use websocket for updating story text and player votes and notifying other game participants about changes
  - websocket server management of sessions and message broadcasting via `WebSocketServer` module; includes tests and mock
  - move all game logic out of Cloudflare Worker and into the Cloudflare Durable Object
  - configure websocket support for local development using miniflare and proxy
  - add Cloudflare TypeScript typings for CloudflareWebSocket. Add `tsconfig.json` for VSCode support.
  - authenticate user session/auth before setting up websocket connection.

### Removed

- Removed http polling. Remove http updating. Still use http for retrieving full game state.

## [1.0.1] - 2021-11-03

### Added

- Feedback link pointing to Github Issues

## [1.0.0] - 2021-11-01

- Initial release. Fully working Planning Poker supporting multiple participants.
- Submission for Cloudflare Developer Challenge.

## [0.0.1] - 2021-10-03

### Added

- React site skeleton
- Development environment based on Snowpack
- Jest test runner
- Hosted on Cloudflare Pages
- Changelog

[Unreleased]: https://github.com/briangershon/planning-poker/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/briangershon/planning-poker/releases/tag/v2.0.0
[1.0.1]: https://github.com/briangershon/planning-poker/releases/tag/v1.0.1
[1.0.0]: https://github.com/briangershon/planning-poker/releases/tag/v1.0.0
[0.0.1]: https://github.com/briangershon/planning-poker/releases/tag/v0.0.1
