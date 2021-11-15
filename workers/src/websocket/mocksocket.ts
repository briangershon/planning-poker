/*
    A mock server websocket implementation.

    Includes helper functions to simulate calls
    from client socket.
*/

export class MockSocket implements CloudflareWebsocket {
  closeEventCallback: Function;

  accept() {}

  addEventListener(eventType, eventCallback) {
    switch (eventType) {
      case 'close':
        this.closeEventCallback = eventCallback;
        break;

      default:
        console.log('Unknown listener');
        break;
    }
  }

  close() {}

  send() {}

  // helper functions to simulate client websocket actions
  sendCloseFromClient() {
    this.closeEventCallback();
  }
}
