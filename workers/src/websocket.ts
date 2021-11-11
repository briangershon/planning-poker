import { getCurrentUserFromCookie, getCurrentUserFromSessionId } from './auth';

export async function handleSocket(request, env) {
  const user = await getCurrentUserFromCookie(request, env);
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

  server.addEventListener('message', async event => {
    server.send('message received for game' + event.data);
    const { sessionId, gameId, eventId, eventData } = JSON.parse(event.data);

    // retrieve and verify user
    const user = await getCurrentUserFromSessionId(sessionId, env);
    if (!user) {
      console.log('invalid user');
      return;
    }

    // TODO: retrieve and verify gameId

    const id = env.GAME_DO.idFromName(gameId);
    const obj = env.GAME_DO.get(id);
    let resp;

    // process message
    switch (eventId) {
      case 'vote':
        const vote = eventData;
        resp = await obj.fetch(
          new Request(
            `http://durable/update?` +
              new URLSearchParams({ vote, user: JSON.stringify(user) })
          )
        );
        break;
      case 'update-story':
        const newStory = eventData;
        resp = await obj.fetch(
          new Request(
            `http://durable/update?` +
              new URLSearchParams({ story: newStory, user: JSON.stringify(user) })
          )
        );
        break;
    }
  });

  return new Response(null, {
    status: 101,
    webSocket: client
  });
}
