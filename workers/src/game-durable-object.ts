import { getCurrentUserFromSessionId } from './auth';
import { WebSocketServer } from './websocket/websocket-server';

interface Env {
  USER: {
    get(key: string, options: Object): Promise<any>;
    put(key: string, value: string): Promise<void>;
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

export class GameDO {
  state: State;
  env: Env;
  story: string;
  initializePromise: Promise<void>;
  sockets: WebSocketServer;

  constructor(state: State, env: Env) {
    this.state = state;
    this.env = env;
    this.sockets = new WebSocketServer();
  }

  async fetch(request) {
    let url = new URL(request.url);

    switch (url.pathname) {
      case '/deallocate':
        await this.state.storage.deleteAll();
        break;

      case '/api/ws/':
        const upgradeHeader = request.headers.get('Upgrade');
        if (upgradeHeader !== 'websocket') {
          return new Response('Expected websocket', { status: 400 });
        }

        const [client, server] = Object.values(new WebSocketPair());

        let mySocket = await this.sockets.handleSocket(server);

        server.addEventListener('close', () => {
          console.log('websocket closed');
        });

        server.addEventListener('error', e => {
          console.log('websocket error', e);
        });

        server.addEventListener('message', async event => {
          // server.send(
          //   JSON.stringify({
          //     eventId: 'debug',
          //     eventData: 'message received for game' + event.data
          //   })
          // );
          const { sessionId, gameId, eventId, eventData } = JSON.parse(
            event.data
          );

          // retrieve and verify user
          const user = await getCurrentUserFromSessionId(sessionId, this.env);
          if (!user) {
            console.log('invalid user');
            return;
          }

          // process message
          switch (eventId) {
            case 'update-game-state':
              console.log(eventData);
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

        // Strip out current user, just sent votes back from other players
        let you = {
          vote: null
        };
        let votes = [];

        const userKeys = Object.keys(rawVotes);
        for (let i = 0; i < userKeys.length; i++) {
          let key = userKeys[i];

          // update "you"
          if (key === `VOTE|${id}`) {
            const userInfo = await this.env.USER.get(id, {
              type: 'json'
            });
            you.vote = rawVotes[key];
          }

          // update other players
          if (key !== `VOTE|${id}`) {
            // convert IDs to names
            const playerId = key.slice(-(key.length - 'VOTE|'.length));
            const userInfo = await this.env.USER.get(playerId, {
              type: 'json'
            });
            votes.push({ name: userInfo.name, vote: rawVotes[key] });
          }
        }

        return new Response(
          JSON.stringify({
            gameState: (await this.state.storage.get('gameState')) || 'lobby',
            story: await this.state.storage.get('story'),
            votes: votes,
            you
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

    return new Response(JSON.stringify({ status: 'ok' }), {
      headers: {
        'content-type': 'application/json;charset=UTF-8'
      }
    });
  }
}
