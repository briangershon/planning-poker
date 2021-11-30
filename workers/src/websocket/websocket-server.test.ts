import { WebSocketServer } from './websocket-server';
import { MockSocket } from './mocksocket';

describe('WebSocketServer', () => {
  let ws: WebSocketServer;

  beforeEach(() => {
    ws = new WebSocketServer();
  });

  test('adds a new socket', async () => {
    const m = new MockSocket();
    await ws.handleSocket({ socket: m });
    expect(ws.count()).toEqual(1);
  });

  test('calls accept() for new socket', async () => {
    const m = new MockSocket();
    jest.spyOn(m, 'accept');
    await ws.handleSocket({ socket: m });
    expect(m.accept).toHaveBeenCalled();
  });

  test('broadcast sends message to everyone (including sender)', async () => {
    const m = new MockSocket();
    const m2 = new MockSocket();
    const m3 = new MockSocket();
    await ws.handleSocket({ socket: m });
    await ws.handleSocket({ socket: m2 });
    await ws.handleSocket({ socket: m3 });

    jest.spyOn(m, 'send');
    jest.spyOn(m2, 'send');
    jest.spyOn(m3, 'send');

    const message = { msg: 'hi' };
    const receivedMessage = JSON.stringify(message);

    ws.broadcast(message);

    expect(m.send).toHaveBeenCalledWith(receivedMessage);
    expect(m2.send).toHaveBeenCalledWith(receivedMessage);
    expect(m3.send).toHaveBeenCalledWith(receivedMessage);
  });

  test('broadcast sends message to everyone (EXCEPT sender)', async () => {
    const m = new MockSocket();
    const m2 = new MockSocket();
    const m3 = new MockSocket();
    await ws.handleSocket({ socket: m });
    await ws.handleSocket({ socket: m2 });
    await ws.handleSocket({ socket: m3 });

    const senderSession = ws.sessions[0]; // m socket session

    jest.spyOn(m, 'send');
    jest.spyOn(m2, 'send');
    jest.spyOn(m3, 'send');

    const message = { msg: 'hi' };
    const receivedMessage = JSON.stringify(message);

    ws.broadcastExceptSender(senderSession, message);

    expect(m.send).not.toHaveBeenCalled();
    expect(m2.send).toHaveBeenCalledWith(receivedMessage);
    expect(m3.send).toHaveBeenCalledWith(receivedMessage);
  });

  test('when socket closes, no longer send messages to it', async () => {
    const m = new MockSocket();
    await ws.handleSocket({ socket: m });
    m.sendCloseFromClient();

    const message = { name: 'Brian' };

    jest.spyOn(m, 'send');
    ws.sendMessage(ws.sessions[0], message);
    expect(m.send).not.toHaveBeenCalled();
  });

  test('when there are multiple sessions, make sure we close the right one (m2)', async () => {
    const m = new MockSocket();
    const m2 = new MockSocket();
    const m3 = new MockSocket();
    await ws.handleSocket({ socket: m });
    await ws.handleSocket({ socket: m2 });
    await ws.handleSocket({ socket: m3 });
    m2.sendCloseFromClient();

    const message = { name: 'Brian' };

    jest.spyOn(m, 'send');
    jest.spyOn(m2, 'send');
    jest.spyOn(m3, 'send');
    ws.broadcast(message);
    expect(m.send).toHaveBeenCalled();
    expect(m2.send).not.toHaveBeenCalled();
    expect(m3.send).toHaveBeenCalled();
  });

  test('if socket is closed or throws an error, remove session', async () => {
    const m = new MockSocket();
    await ws.handleSocket({ socket: m });

    const message = { name: 'Brian' };

    jest.spyOn(m, 'send').mockImplementation(() => {
      throw new Error();
    });
    ws.sendMessage(ws.sessions[0], message);
    expect(ws.count()).toEqual(0);
  });

  describe('manage metadata for a websocket session', () => {
    test('can add and retrieve metadata', async () => {
      const m = new MockSocket();
      const metadata = {
        name: 'Brian'
      };
      await ws.handleSocket({ socket: m, metadata });
      const allMetadata = ws.allMetadata();
      expect(allMetadata.length).toEqual(1);
      expect(allMetadata[0]).toEqual(metadata);
    });

    test('session calls onJoin(params) callback once for all sockets when a new session joins', async () => {
      const onJoin = jest.fn();
      const ws = new WebSocketServer({ onJoin });

      const m = new MockSocket();
      const mOther = new MockSocket();

      const sessionOther = await ws.handleSocket({ socket: mOther });

      const metadata = {
        name: 'Brian'
      };

      const sessionM = await ws.handleSocket({ socket: m, metadata });

      expect(onJoin).toHaveBeenCalledTimes(2);
      expect(onJoin.mock.calls[0][0].socket).toBe(sessionOther.socket);
      expect(onJoin.mock.calls[0][0].metadata).toBeUndefined();
      expect(onJoin.mock.calls[1][0].socket).toBe(sessionM.socket);
      expect(onJoin.mock.calls[1][0].metadata).toEqual(metadata);
    });

    test('session calls onLeave() callback when a session closes, with metadata', async () => {
      const onLeave = jest.fn();
      const ws = new WebSocketServer({ onLeave });

      const m = new MockSocket();
      const mOther = new MockSocket();

      const sessionOther = await ws.handleSocket({ socket: mOther });

      const metadata = {
        name: 'Brian'
      };

      const sessionM = await ws.handleSocket({ socket: m, metadata });

      m.sendCloseFromClient();

      expect(onLeave).toHaveBeenCalledTimes(1);
      expect(onLeave.mock.calls[0][0]).toEqual(metadata);
    });

    test.todo(
      'session calls onLeave() callback when a session errors during send, with metadata'
    );
  });
});
