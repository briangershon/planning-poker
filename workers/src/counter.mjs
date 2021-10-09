export class Counter {
  constructor(state, env) {
    console.log('CONSTRUCTOR');
    this.state = state;

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
    let stored = await this.state.storage.get('value');
    this.value = stored || 0;
  }

  async fetch(request) {
    if (!this.initializePromise) {
      this.initializePromise = this.initialize();
    }
    await this.initializePromise;

    let url = new URL(request.url);
    let currentValue = this.value;
    switch (url.pathname) {
      case '/increment':
        currentValue = ++this.value;
        await this.state.storage.put('value', this.value);
        break;
      case '/decrement':
        currentValue = --this.value;
        await this.state.storage.put('value', this.value);
        break;
      case '/':
        // Just serve the current value. No storage calls needed!
        break;
      default:
        return new Response('Not found', { status: 404 });
    }

    // Return `currentValue`. Note that `this.value` may have been
    // incremented or decremented by a concurrent request when we
    // yielded the event loop to `await` the `storage.put` above!
    // That's why we stored the counter value created by this
    // request in `currentValue` before we used `await`.
    return new Response(currentValue);
  }
}
