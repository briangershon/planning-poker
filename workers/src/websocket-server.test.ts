import { WebSocketServer } from './websocket-server';
import { MockSocket } from './mocksocket';

describe('WebSocketServer', () => {
  let ws: WebSocketServer;

  beforeEach(() => {
    ws = new WebSocketServer();
  });

  test('adds a new socket', async () => {
    const m = new MockSocket();
    await ws.handleSocket(m);
    expect(ws.count()).toEqual(1);
  });

  test('calls accept() for new socket', async () => {
    const m = new MockSocket();
    jest.spyOn(m, 'accept');
    await ws.handleSocket(m);
    expect(m.accept).toHaveBeenCalled();
  });

  test('socket receives a message from client and broadcasts it', async () => {
    const m = new MockSocket();
    await ws.handleSocket(m);

    const message = { name: 'Brian' };
    const receivedMessage = JSON.stringify(message);

    jest.spyOn(m, 'send');
    m.sendMessageFromClient(message);
    expect(m.send).toHaveBeenCalledWith(receivedMessage);
  });

  test('broadcast sends message to everyone', async () => {
    const m = new MockSocket();
    const m2 = new MockSocket();
    const m3 = new MockSocket();
    await ws.handleSocket(m);
    await ws.handleSocket(m2);
    await ws.handleSocket(m3);

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

  test('when socket closes, no longer send messages to it', async () => {
    const m = new MockSocket();
    await ws.handleSocket(m);
    m.sendCloseFromClient();

    const message = { name: 'Brian' };

    jest.spyOn(m, 'send');
    m.sendMessageFromClient(message);
    expect(m.send).not.toHaveBeenCalled();
  });

  test('when there are multiple sessions, make sure we close the right one', async () => {
    const m = new MockSocket();
    const m2 = new MockSocket();
    const m3 = new MockSocket();
    await ws.handleSocket(m);
    await ws.handleSocket(m2);
    await ws.handleSocket(m3);
    m2.sendCloseFromClient();

    const message = { name: 'Brian' };

    jest.spyOn(m, 'send');
    m.sendMessageFromClient(message);
    expect(m.send).toHaveBeenCalled();

    jest.spyOn(m2, 'send');
    m2.sendMessageFromClient(message);
    expect(m2.send).not.toHaveBeenCalled();

    jest.spyOn(m3, 'send');
    m3.sendMessageFromClient(message);
    expect(m3.send).toHaveBeenCalled();
  });

  test('if socket is closed or throws an error, remove session', async () => {
    const m = new MockSocket();
    await ws.handleSocket(m);

    const message = { name: 'Brian' };

    jest.spyOn(m, 'send').mockImplementation(() => {
      throw new Error();
    });
    m.sendMessageFromClient(message);

    // send errors out and there should be no sessions
    expect(ws.count()).toEqual(0);
  });
});
