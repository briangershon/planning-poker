import { describe, expect, test } from '@jest/globals';
import { GameState } from './gamestate';

describe('GameState for current user', () => {
  test('returns default public fields', () => {
    const voteList = new Map();
    const loggedInPlayerId = 'GITHUB:123';
    const youInfo = {
      id: loggedInPlayerId,
      name: 'Brian Here',
      avatarUrl: 'https://avatars.githubusercontent.com/u/123?v=4',
      token: 'gho_555',
      login: 'brianhere'
    };
    const gameState = new GameState({
      voteList,
      loggedInPlayerId,
      youInfo,
      allPlayersPresent: [],
      onRetrievePlayer: undefined
    });

    const you = gameState.you();

    expect(you).toEqual({
      name: 'Brian Here',
      vote: null,
      avatarUrl: 'https://avatars.githubusercontent.com/u/123?v=4'
    });
  });

  test('returns proper vote', () => {
    const voteList = new Map();
    voteList.set('VOTE|GITHUB:123', 'XXL');

    const loggedInPlayerId = 'GITHUB:123';
    const youInfo = {
      id: loggedInPlayerId,
      name: 'Brian Here',
      avatarUrl: 'https://avatars.githubusercontent.com/u/123?v=4',
      token: 'gho_555',
      login: 'brianhere'
    };
    const gameState = new GameState({
      voteList,
      loggedInPlayerId,
      youInfo,
      allPlayersPresent: [],
      onRetrievePlayer: undefined
    });

    const you = gameState.you();

    expect(you).toEqual({
      name: 'Brian Here',
      vote: 'XXL',
      avatarUrl: 'https://avatars.githubusercontent.com/u/123?v=4'
    });
  });

  test('returns votes for all players except logged-in player', async () => {
    const voteList = new Map();
    voteList.set('VOTE|GITHUB:123', 'XXL');
    voteList.set('VOTE|GITHUB:456', 'L');
    voteList.set('VOTE|GITHUB:789', '?');

    const loggedInPlayerId = 'GITHUB:123';
    const youInfo = {
      id: loggedInPlayerId,
      name: 'Brian Here',
      avatarUrl: 'https://avatars.githubusercontent.com/u/123?v=4',
      token: 'gho_555',
      login: 'brianhere'
    };

    // (playerId: string) => Promise<PlayerPublicMetadata>
    const onRetrievePlayer = jest.fn();
    onRetrievePlayer.mockReturnValueOnce(
      Promise.resolve({
        name: 'Samantha',
        vote: null,
        avatarUrl: ''
      })
    );

    onRetrievePlayer.mockReturnValueOnce(
      Promise.resolve({
        name: 'Joe',
        vote: null,
        avatarUrl: ''
      })
    );

    const gameState = new GameState({
      voteList,
      loggedInPlayerId,
      youInfo,
      allPlayersPresent: [],
      onRetrievePlayer
    });

    const otherVotes = await gameState.otherVotes();

    expect(otherVotes).toEqual([
      { id: 'GITHUB:456', name: 'Samantha', vote: 'L', avatarUrl: '' },
      { id: 'GITHUB:789', name: 'Joe', vote: '?', avatarUrl: '' }
    ]);
  });

  test('returns all present players; filter out logged-in player and players with votes', async () => {
    const allPlayersPresent = [
      { id: 'GITHUB:123', name: 'Brian is Present', avatarUrl: '' },
      { id: 'GITHUB:456', name: 'Samantha is Present', avatarUrl: '' },
      { id: 'GITHUB:789', name: 'Joe is Present', avatarUrl: '' }
    ];

    const loggedInPlayerId = 'GITHUB:123';

    const voteList = new Map();
    voteList.set('VOTE|GITHUB:123', 'XXL');
    voteList.set('VOTE|GITHUB:456', 'L');

    const youInfo = {
      id: loggedInPlayerId,
      name: 'Brian Here',
      avatarUrl: 'https://avatars.githubusercontent.com/u/123?v=4',
      token: 'gho_555',
      login: 'brianhere'
    };

    const onRetrievePlayer = jest.fn();

    onRetrievePlayer.mockReturnValueOnce(
      Promise.resolve({
        name: 'User 456',
        vote: null,
        avatarUrl: ''
      })
    );

    onRetrievePlayer.mockReturnValueOnce(
      Promise.resolve({
        name: 'User 789',
        vote: null,
        avatarUrl: ''
      })
    );

    const gameState = new GameState({
      voteList,
      loggedInPlayerId,
      youInfo,
      allPlayersPresent,
      onRetrievePlayer
    });

    const otherVotes = await gameState.otherVotes();

    expect(otherVotes).toEqual([
      { id: 'GITHUB:456', name: 'User 456', vote: 'L', avatarUrl: '' }
    ]);

    const playersPresent = await gameState.playersPresent();
    expect(playersPresent).toEqual([
      { name: 'Joe is Present', vote: null, avatarUrl: '' }
    ]);
  });
});
