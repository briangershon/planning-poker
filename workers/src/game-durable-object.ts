import { getCurrentUserFromSessionId, getCurrentUserFromCookie } from './auth';
import {
  WebSocketServer,
  WebSocketSession
} from './websocket/websocket-server';

interface Env {
  USER: {
    get(key: string, options: Object): Promise<any>;
    put(key: string, value: string): Promise<void>;
  };
  GAME: {
    delete(key: string): Promise<void>;
  };
}

interface State {
  storage: {
    get(key: string): Promise<any>;
    put(key: string, value: string): Promise<void>;
    delete(key: string): Promise<any>;
    deleteAll(): Promise<void>;
    list(options: Object): Promise<Map<string, any>>;
  };
}

interface PlayerPrivateMetadata {
  id: string;
  name: string;
  avatarUrl: string;
}

interface PlayerPublicMetadata {
  name: string;
  vote: string | null;
  avatarUrl: string;
}

export class GameDO {
  state: State;
  env: Env;
  story: string;
  initializePromise: Promise<void>;
  sockets: WebSocketServer;

  constructor(state: State, env: Env) {
    this.state = state;
    this.env = env;

    function onJoin(session) {
      this.broadcastExceptSender(session, {
        eventId: 'game-state-change'
      });
    }
    function onLeave(metadata) {
      this.broadcast({
        eventId: 'game-state-change'
      });
    }

    this.sockets = new WebSocketServer({
      onJoin,
      onLeave
    });
  }

  async fetch(request) {
    let url = new URL(request.url);

    switch (url.pathname) {
      case '/api/ws/':
        const upgradeHeader = request.headers.get('Upgrade');
        if (upgradeHeader !== 'websocket') {
          return new Response('Expected websocket', { status: 400 });
        }

        let metadata: PlayerPrivateMetadata = {
          id: '',
          name: '',
          avatarUrl: ''
        };
        const loggedInUser = await getCurrentUserFromCookie(request, this.env);
        if (loggedInUser) {
          const { id, name, avatarUrl } = loggedInUser;
          metadata.id = id;
          metadata.name = name;
          metadata.avatarUrl = avatarUrl;
        }

        // without declaring types for client and server, run time error was being raised
        let client: CloudflareWebsocket;
        let server: CloudflareWebsocket;
        try {
          [client, server] = Object.values(new WebSocketPair());
        } catch (e) {
          console.log('Unable to create websocket due to', e);
        }

        const session: WebSocketSession = { socket: server, metadata: {} };
        let mySocket = await this.sockets.handleSocket({
          socket: server,
          metadata
        });

        server.addEventListener('close', () => {
          console.log('websocket closed');
        });

        server.addEventListener('error', e => {
          console.log('websocket error', e);
        });

        server.addEventListener('message', async event => {
          const { sessionId, gameId, eventId, eventData } = JSON.parse(
            event.data
          );

          // retrieve and verify user for each message
          const user = await getCurrentUserFromSessionId(sessionId, this.env);
          if (!user) {
            console.log('invalid user');
            return;
          }

          // process message
          switch (eventId) {
            case 'update-game-state':
              await this.state.storage.put('gameState', eventData);
              this.sockets.broadcastExceptSender(mySocket, {
                eventId: 'game-state-change'
              });
              break;

            case 'vote':
              let newVote = eventData;

              // update vote, or set to null if unknown value
              if (newVote !== 'undefined') {
                if (
                  !['XS', 'S', 'M', 'L', 'XL', 'XXL', '?'].includes(newVote)
                ) {
                  newVote = null;
                }

                const { id } = user;
                await this.state.storage.put(`VOTE|${id}`, newVote);

                // 'complete' game if all votes are in and at least 2 players
                const votes = Array.from(
                  await this.state.storage.list({ prefix: 'VOTE|' })
                );
                const invalidVotes = votes.filter(vote => {
                  return vote[1] === null;
                });
                if (votes.length > 1 && invalidVotes.length === 0) {
                  await this.state.storage.put('gameState', 'complete');
                }
                this.sockets.broadcastExceptSender(mySocket, {
                  eventId: 'game-state-change'
                });
              }
              break;

            case 'update-story':
              const newStory = eventData;

              if (newStory !== 'undefined') {
                await this.state.storage.put('story', newStory);
                this.sockets.broadcastExceptSender(mySocket, {
                  eventId: 'game-state-change'
                });
              }
              break;

            case 'restart-game':
              // loop through all votes and remove them, set state back to 'lobby'
              const votes = await this.state.storage.list({ prefix: 'VOTE|' });
              for (let key of Array.from(votes.keys())) {
                await this.state.storage.delete(key);
              }
              await this.state.storage.put('gameState', 'lobby');
              this.sockets.broadcastExceptSender(mySocket, {
                eventId: 'game-state-change'
              });
              break;

            case 'delete-game':
              await this.state.storage.deleteAll();
              this.sockets.broadcastExceptSender(mySocket, {
                eventId: 'game-delete'
              });

              const { id } = user;
              await this.env.GAME.delete(`${id}:${gameId}`);
              break;

            default:
              console.log('unknown websocket event', event.data);
          }
        });

        return new Response(null, {
          status: 101,
          webSocket: client
        });

      case '/':
        const voteList = await this.state.storage.list({ prefix: 'VOTE|' });
        const { id } = JSON.parse(url.searchParams.get('user'));
        const rawVotes = Object.fromEntries(voteList);

        const youInfo = await this.env.USER.get(id, {
          type: 'json'
        });
        youInfo.id = id;

        let you = {
          id: youInfo.id,
          name: youInfo.name,
          vote: null,
          avatarUrl: youInfo.avatarUrl
        };
        let votes = [];

        const userKeys = Object.keys(rawVotes);
        for (let i = 0; i < userKeys.length; i++) {
          let key = userKeys[i];

          // update "you"
          if (key === `VOTE|${id}`) {
            you.vote = rawVotes[key];
          }

          // update other players
          if (key !== `VOTE|${id}`) {
            // convert IDs to names
            const playerId = key.slice(-(key.length - 'VOTE|'.length));
            const userInfo = await this.env.USER.get(playerId, {
              type: 'json'
            });

            votes.push({
              name: userInfo.name,
              vote: rawVotes[key],
              avatarUrl: userInfo.avatarUrl
            });
          }
        }

        // Return an array of other users that are present but haven't voted.
        // Remove ID field, remove duplicates, remove current user, remove any that already have votes
        // const allSocketUsers: PlayerPrivateMetadata = this.sockets.allMetadata();

        let playersPresent: PlayerPublicMetadata[] = [];
        const allPlayerMetadata = this.sockets.allMetadata() as PlayerPrivateMetadata[];

        for (let i = 0; i < allPlayerMetadata.length; i++) {
          let p = allPlayerMetadata[i];
          // skip YOU
          if (p.id === you.id) continue;

          // return public properties, so exclude 'id'
          playersPresent.push({
            name: p.name,
            avatarUrl: p.avatarUrl,
            vote: null
          });
        }

        // return public properties, so exclude 'id'
        const publicYou: PlayerPublicMetadata = {
          name: you.name,
          vote: you.vote,
          avatarUrl: you.avatarUrl
        };

        return new Response(
          JSON.stringify({
            gameState: (await this.state.storage.get('gameState')) || 'lobby',
            story: await this.state.storage.get('story'),
            votes: votes,
            you: publicYou,
            playersPresent
          }),
          {
            headers: {
              'content-type': 'application/json;charset=UTF-8'
            }
          }
        );
      default:
        return new Response('Not found', { status: 404 });
    }
  }
}
