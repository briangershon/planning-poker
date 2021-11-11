import { vote } from '../store/pokerSlice';

export class WebsocketClient {
  url: string;
  sessionId: string;
  gameId: string;
  websocket: WebSocket;
  initialized: boolean;

  constructor({ url, sessionId, gameId }) {
    this.url = url;
    this.sessionId = sessionId;
    this.gameId = gameId;
    this.websocket = null;
    this.initialized = false;
  }

  init() {
    this.websocket = new WebSocket(this.url);
    try {
      if (!this.websocket) {
        throw new Error("Websocket: Server didn't accept websocket");
      }
      this.websocket.addEventListener('open', () => {
        this.initialized = true;
      });

      this.websocket.addEventListener('message', (event) => {
        console.log('Websocket: Message received from server:', event.data);
      });

      this.websocket.addEventListener('close', () => {
        console.log('Websocket: Closed websocket');
      });
    } catch (e) {
      console.log('WEBSOCKET ERROR', e);
    }
  }

  sendVote(vote) {
    if (!this.initialized) {
      console.log('Websocket not initialized: Can not send vote.');
      return;
    }

    const message = {
      sessionId: this.sessionId,
      gameId: this.gameId,
      eventId: 'vote',
      eventData: vote,
    };
    this.websocket.send(JSON.stringify(message));
    console.log('sent message to server', message);
  }

  sendStory(newStory) {
    if (!this.initialized) {
        console.log('Websocket not initialized: Can not send story.');
        return;
      }
      const message = {
        sessionId: this.sessionId,
        gameId: this.gameId,
        eventId: 'update-story',
        eventData: newStory,
      };
      this.websocket.send(JSON.stringify(message));
      console.log('sent message to server', message);
  }
}