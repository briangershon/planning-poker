// Manage a group of websockets on the server

export interface WebSocketSession {
  socket: CloudflareWebsocket;
  metadata?: Object;
}

type Message = Object | string;

type OnJoin = (session: WebSocketSession) => void;
type OnLeave = (metadata?: Object) => void;

// Callbacks called for every socket connection.
// Callbacks include socket and metadata.
// Socket is passed so you can filter out originating socket if desired.
// Don't pass session for onLeave() since session will disappear
export interface WebSocketServerParams {
  onJoin?: OnJoin;
  onLeave?: OnLeave;
}

export class WebSocketServer {
  sessions: WebSocketSession[];
  onJoin?: OnJoin;
  onLeave?: OnLeave;

  constructor(params?: WebSocketServerParams) {
    this.sessions = [];
    if (typeof params !== 'undefined') {
      if (typeof params.onJoin !== 'undefined') {
        this.onJoin = params.onJoin;
      }
      if (typeof params.onLeave !== 'undefined') {
        this.onLeave = params.onLeave;
      }
    }
  }

  count() {
    return this.sessions.length;
  }

  allMetadata(): Object[] {
    return this.sessions
      .filter(sess => sess.metadata)
      .map(sess => sess.metadata);
  }

  sendMessage(session: WebSocketSession, message: Message) {
    let stringMessage: string;
    if (typeof message === 'string') {
      stringMessage = message;
    } else {
      stringMessage = JSON.stringify(message);
    }
    try {
      session.socket.send(stringMessage);
    } catch (e) {
      // error sending messsage, remove this session
      if (typeof this.onLeave !== 'undefined') {
        this.onLeave(session.metadata);
      }
      this.sessions = this.sessions.filter(s => {
        return session !== s;
      });
    }
  }

  broadcast(message: Message) {
    this.sessions.map(sess => {
      this.sendMessage(sess, message);
    });
  }

  broadcastExceptSender(
    senderSessionToExclude: WebSocketSession,
    message: Message
  ) {
    this.sessions.map(sess => {
      if (senderSessionToExclude !== sess) {
        this.sendMessage(sess, message);
      }
    });
  }

  async handleSocket(params: WebSocketSession): Promise<WebSocketSession> {
    const { socket, metadata } = params;
    let mySession = { socket, metadata };

    socket.accept();
    this.sessions.push(mySession);

    socket.addEventListener('close', async () => {
      if (typeof this.onLeave !== 'undefined') {
        this.onLeave(mySession.metadata);
      }
      this.sessions = this.sessions.filter(sess => {
        return sess !== mySession;
      });
    });

    if (typeof this.onJoin !== 'undefined') {
      this.onJoin(mySession);
    }

    return mySession;
  }
}
