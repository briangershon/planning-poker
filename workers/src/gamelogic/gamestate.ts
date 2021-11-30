/*
   Generates the main payload holding server-side game state
   along with helper functions.

   'Public' refers to data passed to client without any sensitive info like 'id'.
*/

import { User } from '../auth/auth-user';

export interface PlayerPrivateMetadata {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface PlayerPrivateMetadataWithVote {
  id: string;
  name: string;
  vote: string | null;
  avatarUrl: string;
}

export interface PlayerPublicMetadata {
  name: string;
  vote: string | null;
  avatarUrl: string;
}

export interface VoteResults {
  youVote: string | null;
  otherVotes: PlayerPrivateMetadataWithVote[];
}

export interface GameStateParams {
  voteList: CloudflareStorageList;
  loggedInPlayerId: string;
  youInfo: User;
  allPlayersPresent: PlayerPrivateMetadata[];
  onRetrievePlayer: (playerId: string) => Promise<PlayerPublicMetadata>;
}

type CloudflareStorageList = Map<string, any>;

export class GameState {
  voteList: CloudflareStorageList;
  loggedInPlayerId: string;
  youInfo: User;
  allPlayersPresent: PlayerPrivateMetadata[];
  onRetrievePlayer: (playerId: string) => Promise<PlayerPublicMetadata>;

  constructor({
    voteList,
    loggedInPlayerId,
    youInfo,
    allPlayersPresent,
    onRetrievePlayer
  }: GameStateParams) {
    this.voteList = voteList;
    this.loggedInPlayerId = loggedInPlayerId;
    this.youInfo = youInfo;
    this.allPlayersPresent = allPlayersPresent;
    this.onRetrievePlayer = onRetrievePlayer;
  }

  youVote(): string | null {
    const youId = this.loggedInPlayerId;
    const rawVotes = Object.fromEntries(this.voteList);
    const userKeys = Object.keys(rawVotes);
    for (let i = 0; i < userKeys.length; i++) {
      let key = userKeys[i];
      if (key === `VOTE|${youId}`) {
        return rawVotes[key];
      }
    }
    return null;
  }

  async otherVotes(): Promise<PlayerPrivateMetadataWithVote[]> {
    const rawVotes = Object.fromEntries(this.voteList);
    let votes: PlayerPrivateMetadataWithVote[] = [];
    const userKeys = Object.keys(rawVotes);
    for (let i = 0; i < userKeys.length; i++) {
      let key = userKeys[i];
      if (key !== `VOTE|${this.loggedInPlayerId}`) {
        // convert IDs to names
        const playerId = key.slice(-(key.length - 'VOTE|'.length));
        let userInfo: PlayerPublicMetadata;
        if (typeof this.onRetrievePlayer !== undefined) {
          userInfo = await this.onRetrievePlayer(playerId);
        }

        votes.push({
          id: playerId,
          name: userInfo.name,
          vote: rawVotes[key],
          avatarUrl: userInfo.avatarUrl
        });
      }
    }
    return votes;
  }

  you(): PlayerPublicMetadata {
    return {
      name: this.youInfo.name,
      vote: this.youVote(),
      avatarUrl: this.youInfo.avatarUrl
    };
  }

  async playersPresent(): Promise<PlayerPublicMetadata[]> {
    let playersPresent = [];

    const otherVotes = await this.otherVotes();
    const allVoteIds = otherVotes.map(v => {
      return v.id;
    });

    const allPlayersPresent = this.allPlayersPresent;
    for (let i = 0; i < allPlayersPresent.length; i++) {
      let p = allPlayersPresent[i];

      // skip YOU
      if (p.id === this.loggedInPlayerId) continue;

      // FILTER OUT THOSE WHO HAVE VOTED
      if (allVoteIds.includes(p.id)) continue;

      // return public properties, so exclude 'id'
      playersPresent.push({
        name: p.name,
        avatarUrl: p.avatarUrl,
        vote: null
      });
    }

    return playersPresent;
  }

  async fullState() {
    return {
      you: this.you(),
      votes: await this.otherVotes(),
      playersPresent: await this.playersPresent()
    };
  }
}
