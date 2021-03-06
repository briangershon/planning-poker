# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

- N/A

## [2.6.0] - 2021-12-08

### Changed

- Updated site metadata and docs.

## [2.5.0] - 2021-12-08

### Added

- Product walk-through. Initial documentation page.

## [2.4.0] - 2021-12-06

### Fixed

- Bug that was allowing players to vote before game started.

### Removed

- Removed the demo game, which was originally created so that people could try out the site without having to login as a second player. However this broke once games could be reset.

## [2.3.1] - 2021-12-04

### Fixed

- Fix bug that showed "You need at least one other player to start the game" warning in case where there were two players and one had voted.

## [2.3.0] - 2021-12-04

### Changed

- Spruce up UI
- Move from Cards UI to T-Shirt UI
- Move invite button to top-right of player area. Copy to Clipboard feature.
- Restyle buttons
- Lightened orange color for better contrast

### Fixed

- Fix "content area scrolling separately from page" bug on mobile.

## [2.2.1] - 2021-12-03

Story editing changes (`<GameStory/>`)

### Fixed

- Fixed JavaScript error when user tries to change story when game has ended

### Changed

- Disable editing story when game has ended
- Switch from contenteditable `<div>` to vanilla `<textarea>` for easy testing

### Added

- Create suite of component tests for `<GameStory/>`

## [2.2.0] - 2021-12-01

### Changed

- Simplify story editing UI with `<StoryEditable/>` (a contenteditable implementation)

## [2.1.0] - 2021-11-29

### Added

- Focus on game play. Overhaul UX.
- Add player presence feature to see real-time which players are connected or not
- When deleting game, notify other players
- Automatically end game when all votes are in
- Code improvements
  - Add game state management: lobby, in-progress, complete
  - Split main game view into separate components and css modules
  - Move state business logic into a new GameState class with tests (and thin out Durable Object)
  - Save player metadata with each socket connection. Add additional websocket tests
  - Add additional TypeScript interfaces

## [2.0.2] - 2021-11-20

### Fixed

- Bug: Github 'login' field wasn't being saved

## [2.0.1] - 2021-11-18

### Fixed

- Bug: Game state was not being cleared when switching between games

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

[unreleased]: https://github.com/briangershon/planning-poker/compare/v2.6.0...HEAD
[2.6.0]: https://github.com/briangershon/planning-poker/releases/tag/v2.6.0
[2.5.0]: https://github.com/briangershon/planning-poker/releases/tag/v2.5.0
[2.4.0]: https://github.com/briangershon/planning-poker/releases/tag/v2.4.0
[2.3.1]: https://github.com/briangershon/planning-poker/releases/tag/v2.3.1
[2.3.0]: https://github.com/briangershon/planning-poker/releases/tag/v2.3.0
[2.2.1]: https://github.com/briangershon/planning-poker/releases/tag/v2.2.1
[2.2.0]: https://github.com/briangershon/planning-poker/releases/tag/v2.2.0
[2.1.0]: https://github.com/briangershon/planning-poker/releases/tag/v2.1.0
[2.0.2]: https://github.com/briangershon/planning-poker/releases/tag/v2.0.2
[2.0.1]: https://github.com/briangershon/planning-poker/releases/tag/v2.0.1
[2.0.0]: https://github.com/briangershon/planning-poker/releases/tag/v2.0.0
[1.0.1]: https://github.com/briangershon/planning-poker/releases/tag/v1.0.1
[1.0.0]: https://github.com/briangershon/planning-poker/releases/tag/v1.0.0
[0.0.1]: https://github.com/briangershon/planning-poker/releases/tag/v0.0.1
