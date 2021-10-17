import { Router } from 'itty-router';
import { createOAuthUserAuth } from '@octokit/auth-oauth-user';
import { Octokit } from 'octokit';
import { serialize } from 'cookie';
export { Game } from './game.mjs';

const router = Router();

router.get('/api/login/github', async (request, env) => {
  return Response.redirect(
    `https://github.com/login/oauth/authorize?client_id=${env.GITHUB_CLIENT_ID}`,
    302
  );
});

router.get('/api/login/github/callback', async (request, env) => {
  const auth = createOAuthUserAuth({
    clientId: env.GITHUB_CLIENT_ID,
    clientSecret: env.GITHUB_CLIENT_SECRET,
    code: request.query.code
  });

  const { token } = await auth();
  const octokit = new Octokit({ auth: token });

  const user = await octokit.request('GET /user');
  console.log('octokit user', user.data);

  const emails = await octokit.request('GET /user/emails');
  console.log('octokit emails', emails.data);

  // TODO: WRITE SESSION COOKIE!

  const cookie = serialize('session', 'goes-here', {
    maxAge: 60 * 60 * 24 * 14, // 2 weeks
    path: '/'
  });

  return new Response('', {
    status: 302,
    headers: {
      Location: env.GITHUB_CLIENT_SUCCESS_URL,
      'Set-Cookie': cookie
    }
  });
});

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
