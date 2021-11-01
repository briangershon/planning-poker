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
    deleteAll(): Promise<void>;
    list(options: Object): Promise<Map<string, any>>;
  };
}

export class GameDO {
  state: State;
  env: Env;
  story: string;
  initializePromise: Promise<void>;

  constructor(state: State, env: Env) {
    this.state = state;
    this.env = env;

    // TODO: Miniflare doesn't yet support blockConcurrencyWhile()
    //       so using old `initialize()` style for now.
    // https://github.com/cloudflare/durable-objects-template/commit/5519378a3e553c09873fc0d80cb0257bdb2b03f2
    //
    // `blockConcurrencyWhile()` ensures no requests are delivered until
    // initialization completes.
    // this.state.blockConcurrencyWhile(async () => {
    //   let stored = await this.state.storage.get('value');
    //   this.value = stored || 0;
    // });
  }

  // initialize with saved data if it exists
  async initialize() {
    let stored = await this.state.storage.get('story');
    if (stored === undefined) {
      const defaultValue = '';
      await this.state.storage.put('story', defaultValue);
      this.story = defaultValue;
    } else {
      this.story = stored;
    }
  }

  async fetch(request) {
    // TODO: Miniflare doesn't yet support blockConcurrencyWhile()
    // so using this old method. Also see above.
    if (!this.initializePromise) {
      this.initializePromise = this.initialize().catch(err => {
        this.initializePromise = undefined;
        throw err;
      });
    }
    await this.initializePromise;

    let url = new URL(request.url);

    switch (url.pathname) {
      case '/update':
        let newStory = url.searchParams.get('story');
        if (newStory !== 'undefined') {
          await this.state.storage.put('story', newStory);
          this.story = newStory;
        }

        // update vote
        let newVote = url.searchParams.get('vote');
        if (newVote !== 'undefined') {
          if (!['XS', 'S', 'M', 'L', 'XL', 'XXL', '?'].includes(newVote)) {
            newVote = null;
          }

          const { id } = JSON.parse(url.searchParams.get('user'));
          await this.state.storage.put(`VOTE|${id}`, newVote);
        }

        break;
      case '/deallocate':
        await this.state.storage.deleteAll();
        break;
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
            story: this.story,
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
