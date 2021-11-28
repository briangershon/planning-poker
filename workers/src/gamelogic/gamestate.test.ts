import { describe, expect, test } from '@jest/globals';
import { GameState } from './gamestate';

describe('Logged in player ("you")', () => {
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
      onRetrievePlayer: undefined
    });

    const you = gameState.you();

    expect(you).toEqual({
      name: 'Brian Here',
      vote: null,
      avatarUrl: 'https://avatars.githubusercontent.com/u/123?v=4'
    });
  });

  test('returns public fields, when player voted XXL', () => {
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
      onRetrievePlayer: undefined
    });

    const you = gameState.you();

    expect(you).toEqual({
      name: 'Brian Here',
      vote: 'XXL',
      avatarUrl: 'https://avatars.githubusercontent.com/u/123?v=4'
    });
  });

  test('returns votes for all players except logged-in player ("you")', async () => {
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
      onRetrievePlayer
    });

    const otherVotes = await gameState.otherVotes();

    expect(otherVotes).toEqual([
      { id: 'GITHUB:456', name: 'Samantha', vote: 'L', avatarUrl: '' },
      { id: 'GITHUB:789', name: 'Joe', vote: '?', avatarUrl: '' }
    ]);
  });
});
