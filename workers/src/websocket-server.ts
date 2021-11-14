// Manage a group of websockets on the server

interface WebSocketSession {
  socket: CloudflareWebsocket;
}

type Message = Object | string;

export class WebSocketServer {
  sessions: WebSocketSession[];

  constructor() {
    this.sessions = [];
  }

  count() {
    return this.sessions.length;
  }

  sendMessage(session, message: Message) {
    if (typeof message !== 'string') {
      message = JSON.stringify(message);
    }
    try {
      session.socket.send(message);
    } catch (e) {
      // error sending messsage, remove this session
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

  async handleSocket(socket: CloudflareWebsocket) {
    let mySocket = { socket };

    socket.accept();
    this.sessions.push(mySocket);

    socket.addEventListener('message', async message => {
      this.broadcast(message);
    });

    socket.addEventListener('close', async message => {
      this.sessions = this.sessions.filter(sess => {
        return sess !== mySocket;
      });

      this.broadcast(message);
    });
  }
}
