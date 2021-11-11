import { User, AuthUser } from './auth-user';
import { AuthSession, SessionID } from './auth-session';

// Return authenticated user, or null if no user
export async function getCurrentUser(request, env): Promise<User | null> {
  const sessionId = AuthSession.sessionIdFromCookieHeader(
    request['headers'].get('cookie')
  );

  if (sessionId) {
    const sessionUser = new AuthSession(env);
    const userId = await sessionUser.getUserBySession(sessionId);
    if (userId) {
      const authUser = new AuthUser(env);
      return await authUser.getUser(userId);
    }
  }
  return null;
}

export async function killCurrentUser(request, env) {
  const session = new AuthSession(env);

  const existingSessionId = AuthSession.sessionIdFromCookieHeader(
    request['headers'].get('cookie')
  );

  if (existingSessionId) {
    await session.deleteSession(existingSessionId);
  }
}

export async function createOrUpdateUser(
  request,
  env,
  user: User,
  expirationSeconds
): Promise<SessionID> {
  const authUser = new AuthUser(env);
  await authUser.saveUser(user);

  const session = new AuthSession(env);
  return await session.addSession(user.id, expirationSeconds);
}
