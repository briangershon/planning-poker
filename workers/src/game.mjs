export class Game {
  constructor(state, env) {
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
    const initialData = {
      gameMeta: {
        state: 'awaiting_votes',
        story: 'Create a prototype',
        owner: 'user1'
      },
      user1: { id: '123', name: 'Brian', vote: 'XL' }
    };

    let stored = await this.state.storage.get('value');
    this.value = stored || initialData;
  }

  async fetch(request) {
    await this.initialize();

    const valueFromKV = await this.env.USER.get('someKey');

    // let url = new URL(request.url);
    // let currentValue = this.value;
    // switch (url.pathname) {
    //   case '/increment':
    //     currentValue = ++this.value;
    //     await this.state.storage.put('value', this.value);
    //     break;
    //   case '/decrement':
    //     currentValue = --this.value;
    //     await this.state.storage.put('value', this.value);
    //     break;
    //   case '/':
    //     // Just serve the current value. No storage calls needed!
    //     break;
    //   default:
    //     return new Response('Not found', { status: 404 });
    // }
    return new Response(JSON.stringify(this.value), {
      headers: {
        'content-type': 'application/json;charset=UTF-8'
      }
    });
  }
}
