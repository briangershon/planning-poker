import { Router } from 'itty-router';
export { Game } from './game.mjs';

const router = Router();

router.post('/api/games/:gameId/join', async (request, env) => {
  const { params, query } = request;

  const body = await request.json();
  const { name } = body;
  if (!name) {
    throw new Error('Missing Name field in request body.');
  }

  await env.USER.put('someKey', 'BRIAN');
  const valueFromKV = await env.USER.get('someKey');

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
});

router.all('*', () => new Response('Not Found.', { status: 404 }));

export default {
  async fetch(request, env) {
    try {
      return await router.handle(request, env);
    } catch (e) {
      return new Response(e.message, { status: 400 });
    }
  }
};
