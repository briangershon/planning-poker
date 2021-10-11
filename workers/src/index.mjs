export { Game } from './game.mjs';

export default {
  async fetch(request, env) {
    try {
      return await handleRequest(request, env);
    } catch (e) {
      return new Response(e.message, { status: 400 });
    }
  }
};

async function handleRequest(request, env) {
  let url = new URL(request.url);

  // Add user to a game: `/games/:gameId/join`
  const re = request.url.match(/games\/(?<gameId>[0-9]+)\/join/);
  if (request.method.toUpperCase() === 'POST' && re) {
    const body = await request.json();
    const { name } = body;
    if (!name) {
      throw new Error('Missing Name field in request body.');
    }
    console.log(`${name} joining game "${re.groups.gameId}"`);
  }

  let id = env.GAME.idFromName('1234');
  let obj = env.GAME.get(id);
  let resp = await obj.fetch(new Request('http://durable/'));
  let results = JSON.stringify(await resp.json(), null, 2);
  return new Response(results, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
      'Access-Control-Allow-Headers': '*',
      'content-type': 'application/json;charset=UTF-8'
    }
  });
}
