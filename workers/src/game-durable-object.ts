interface Env {
  USER: {
    get(key: string): Promise<any>;
    put(key: string, value: string): Promise<void>;
  };
}

interface State {
  storage: {
    get(key: string): Promise<any>;
    put(key: string, value: string): Promise<void>;
    deleteAll(): Promise<void>;
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
      case '/update-story':
        const newStory = url.searchParams.get('story');
        if (newStory) {
          await this.state.storage.put('story', newStory);
          this.story = newStory;
        }
        break;
      case '/deallocate':
        await this.state.storage.deleteAll();
        break;
      case '/':
        break;
      default:
        return new Response('Not found', { status: 404 });
    }

    return new Response(JSON.stringify({ story: this.story }), {
      headers: {
        'content-type': 'application/json;charset=UTF-8'
      }
    });
  }
}
