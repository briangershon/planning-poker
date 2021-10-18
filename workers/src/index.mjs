import { Router } from 'itty-router';
import { createOAuthUserAuth } from '@octokit/auth-oauth-user';
import { Octokit } from 'octokit';
import { parse, serialize } from 'cookie';
export { Game } from './game.mjs';
import { AuthUser } from './auth-user.ts';
import { AuthSession } from './auth-session.ts';

const router = Router();

const withUser = (request, env) => {
  request.user = new AuthUser(env);
};

// requireUser optionally returns (early) if user not found on request
const requireUser = request => {
  if (!request.user) {
    return new Response('Not Authenticated', { status: 401 });
  }
  // // is there a session? Is session valid?
  // return Response.redirect(
  //   `https://github.com/login/oauth/authorize?client_id=${env.GITHUB_CLIENT_ID}`,
  //   302
  // );
};

router.get('/api/login/github', async (request, env) => {
  return Response.redirect(
    `https://github.com/login/oauth/authorize?client_id=${env.GITHUB_CLIENT_ID}`,
    302
  );
});

router.get('/api/login/github/callback', async (request, env) => {
  console.log('request.headers', request.headers);
  let existingSessionId = null;
  const existingCookie = request.headers.get('cookie');
  console.log('existingCookie', existingCookie);
  if (existingCookie) {
    const parsedCookie = parse(existingCookie);
    console.log('parsedCookie', parsedCookie);
    if (parsedCookie.session) {
      existingSessionId = parsedCookie.session;
    }
  }
  console.log('existingSessionId', existingSessionId);

  const auth = createOAuthUserAuth({
    clientId: env.GITHUB_CLIENT_ID,
    clientSecret: env.GITHUB_CLIENT_SECRET,
    code: request.query.code
  });

  const { token } = await auth();
  const octokit = new Octokit({ auth: token });

  const user = await octokit.request('GET /user');
  // console.log('octokit data', user.data);

  const emails = await octokit.request('GET /user/emails');
  // console.log('octokit data', emails.data);

  // add/update user in KV store
  const authUser = new AuthUser(env);
  const { id, name, avatar_url } = user.data;
  await authUser.saveGithubUser(id, {
    name,
    avatarUrl: avatar_url,
    token
  });

  console.log('RETRIEVE', await authUser.getGithubUser(id));

  // does existing session exist? If not, create a new one.
  if (!(existingSessionId && (await env.SESSION.get(existingSessionId)))) {
    // create session and send cookie
    const sessionId = AuthSession.generateSessionId();
    console.log('Create new session', sessionId);

    const cookie = serialize('session', sessionId, {
      maxAge: 60 * 60 * 24 * 14, // 2 weeks
      path: '/'
    });

    // TODO: expire in 2 weeks to match cookie
    const userKey = `GITHUB:${id}`;
    await env.SESSION.put(sessionId, userKey, { expirationTtl: 60 });
    const sessionKVValue = await env.SESSION.get(sessionId);
    console.log('sessionKVValue', sessionKVValue);

    return new Response('', {
      status: 302,
      headers: {
        Location: env.GITHUB_CLIENT_SUCCESS_URL,
        'Set-Cookie': cookie
      }
    });
  }

  return new Response('', {
    status: 302,
    headers: {
      Location: env.GITHUB_CLIENT_SUCCESS_URL
    }
  });
});

router.get('/api/me', withUser, requireUser, async (request, env) => {
  // TODO: find Github User id via session
  const id = 'xxx';
  const user = await request.user.getGithubUser(id);
  console.log('USER IS ', user);
  if (user !== null) {
    const { name, avatarUrl } = user;
    return new Response(JSON.stringify({ name, avatarUrl }), {
      headers: {
        'content-type': 'application/json;charset=UTF-8'
      }
    });
  }
  return new Response(JSON.stringify(null, {
    headers: {
      'content-type': 'application/json;charset=UTF-8'
    }
  }));
});

router.post(
  '/api/games/:gameId/join',
  withUser,
  requireUser,
  async (request, env) => {
    const { params, query } = request;

    const body = await request.json();
    const { name } = body;
    if (!name) {
      throw new Error('Missing Name field in request body.');
    }

    let id = env.GAME.idFromName('1234');
    let obj = env.GAME.get(id);
    let resp = await obj.fetch(new Request('http://durable/'));
    let results = JSON.stringify(await resp.json(), null, 2);

    // TODO: REMOVE CORS -- not needed anymore
    return new Response(results, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
        'Access-Control-Allow-Headers': '*',
        'content-type': 'application/json;charset=UTF-8'
      }
    });
  }
);

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
