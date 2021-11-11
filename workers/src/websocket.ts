declare global {
  interface CloudflareWebsocket {
    accept(): unknown;
    addEventListener(
      event: 'close',
      callbackFunction: (code?: number, reason?: string) => unknown
    ): unknown;
    addEventListener(
      event: 'error',
      callbackFunction: (e: unknown) => unknown
    ): unknown;
    addEventListener(
      event: 'message',
      callbackFunction: (event: { data: any }) => unknown
    ): unknown;

    /**
     * @param code https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
     * @param reason
     */
    close(code?: number, reason?: string): unknown;
    send(message: string | Uint8Array): unknown;
  }

  class WebSocketPair {
    0: CloudflareWebsocket; // Client
    1: CloudflareWebsocket; // Server
  }

  interface ResponseInit {
    webSocket?: CloudflareWebsocket;
  }
}

import { getCurrentUser } from './auth';

export async function handleSocket(request, env) {
  const user = await getCurrentUser(request, env);
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const upgradeHeader = request.headers.get('Upgrade');
  if (upgradeHeader !== 'websocket') {
    return new Response('Expected websocket', { status: 400 });
  }

  const [client, server] = Object.values(new WebSocketPair());

  server.accept();

  server.addEventListener('close', () => {
    console.log('websocket closed');
  });

  server.addEventListener('error', e => {
    console.log('websocket error', e);
  });

  server.addEventListener('message', event => {
    console.log('incoming websocket data:', event.data);
    server.send('howdy, message received');
  });

  return new Response(null, {
    status: 101,
    webSocket: client
  });
}
