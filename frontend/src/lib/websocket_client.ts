export class WebsocketClient {
  url: string;
  sessionId: string;
  gameId: string;
  websocket: WebSocket;
  initialized: boolean;
  onMessage: Function;

  constructor({ url, sessionId, gameId, onMessage }) {
    this.url = url;
    this.sessionId = sessionId;
    this.gameId = gameId;
    this.websocket = null;
    this.initialized = false;
    this.onMessage = onMessage;
  }

  init() {
    this.websocket = new WebSocket(
      `${this.url}?gameId=${encodeURI(this.gameId)}`
    );
    try {
      if (!this.websocket) {
        throw new Error("Websocket: Server didn't accept websocket");
      }
      this.websocket.addEventListener('open', () => {
        this.initialized = true;
      });

      this.websocket.addEventListener('message', (event) => {
        this.onMessage(JSON.parse(event.data));
      });

      this.websocket.addEventListener('close', () => {
        console.log('Websocket: Closed websocket');
      });
    } catch (e) {
      console.log('WEBSOCKET ERROR', e);
    }
  }

  close() {
    this.websocket.close();
  }

  sendEvent(eventId: string, eventData?: string | Object) {
    if (!this.initialized) {
      console.log('Websocket not initialized: Can not send vote.');
      return;
    }

    const message = {
      sessionId: this.sessionId,
      gameId: this.gameId,
      eventId,
      eventData,
    };
    this.websocket.send(JSON.stringify(message));
  }

  sendVote(vote) {
    this.sendEvent('vote', vote);
  }

  sendStory(newStory) {
    this.sendEvent('update-story', newStory);
  }

  restartGame() {
    this.sendEvent('restart-game');
  }

  updateGameState(newState) {
    this.sendEvent('update-game-state', newState);
  }

  deleteGame() {
    this.sendEvent('delete-game');
  }
}
