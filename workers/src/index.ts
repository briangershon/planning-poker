import { Router } from 'itty-router';
import { createOAuthUserAuth } from '@octokit/auth-oauth-user';
import { Octokit } from 'octokit';
export { Game } from './game';
import { AuthUser } from './auth-user';
import { AuthSession } from './auth-session';
import { serialize } from 'cookie';
import { v4 as uuid } from 'uuid';

const router = Router();

const withUser = async (request, env) => {
  request.user = null;

  const sessionId = AuthSession.sessionIdFromCookieHeader(
    request['headers'].get('cookie')
  );

  if (sessionId) {
    const sessionUser = new AuthSession(env);
    const userId = await sessionUser.getUserBySession(sessionId);
    const authUser = new AuthUser(env);
    request.user = await authUser.getUser(userId);
    request.user.id = userId;
  }
};

// requireUser optionally returns (early) if user not found on request
const requireUser = async request => {
  if (!request.user) {
    return new Response('Not Authenticated', { status: 401 });
  }
};

router.get('/api/login/github', async (request, env) => {
  return Response.redirect(
    `https://github.com/login/oauth/authorize?client_id=${env.GITHUB_CLIENT_ID}`,
    302
  );
});

router.get('/api/login/github/callback', async (request, env) => {
  const session = new AuthSession(env);

  const existingSessionId = AuthSession.sessionIdFromCookieHeader(
    request['headers'].get('cookie')
  );
  if (existingSessionId && existingSessionId !== 'null') {
    await session.deleteSession(existingSessionId);
  }

  const auth = createOAuthUserAuth({
    clientId: env.GITHUB_CLIENT_ID,
    clientSecret: env.GITHUB_CLIENT_SECRET,
    code: request.query.code
  });

  const { token } = await auth();
  const octokit = new Octokit({ auth: token });
  const user = await octokit.request('GET /user');

  const authUser = new AuthUser(env);
  const { id, name, avatar_url } = user.data;

  const userKey = `GITHUB:${id}`;

  await authUser.saveUser(userKey, {
    name,
    avatarUrl: avatar_url,
    token
  });

  const twoWeeks = 60 * 60 * 24 * 14;

  const sessionId = await session.addSession(userKey, twoWeeks);

  const cookie = serialize('session', sessionId, {
    maxAge: twoWeeks,
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

router.get('/api/logout', async (request, env) => {
  const session = new AuthSession(env);

  const existingSessionId = AuthSession.sessionIdFromCookieHeader(
    request['headers'].get('cookie')
  );

  if (existingSessionId) {
    await session.deleteSession(existingSessionId);
  }

  // clear session cookie and delete when browser closes
  const cookie = serialize('session', null, {
    path: '/'
  });

  return new Response('', {
    status: 302,
    headers: {
      Location: '/',
      'Set-Cookie': cookie
    }
  });
});

// Get current user and their games
router.get('/api/me', withUser, async (request, env) => {
  if (request.user !== null) {
    const { id, name, avatarUrl } = request.user;

    const games = await env.GAME.list({ prefix: id });
    const gameIds = games.keys.map(key => {
      return key.name.slice(-(key.name.length - id.length - 1));
    });

    return new Response(JSON.stringify({ name, avatarUrl, gameIds }), {
      headers: {
        'content-type': 'application/json;charset=UTF-8'
      }
    });
  }

  return new Response(JSON.stringify(null), {
    headers: {
      'content-type': 'application/json;charset=UTF-8'
    }
  });
});

// Create game and persist ID
router.post('/api/games', withUser, requireUser, async (request, env) => {
  const userId = request.user.id;
  const gameId = uuid();
  const createdMillis = new Date().getTime();
  await env.GAME.put(
    `${userId}:${gameId}`,
    JSON.stringify({
      createdMillis
    })
  );

  return new Response(JSON.stringify({ gameId, createdMillis }), {
    headers: {
      'content-type': 'application/json;charset=UTF-8'
    }
  });
});

// TODO: Delete game (DELETE /api/games/:gameId)
// TODO: Update vote for user (and add user to game) (PUT /api/games/:gameId)
// TODO: Fetch game status (GET /api/games/:gameId)

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

    return new Response(results, {
      headers: {
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
