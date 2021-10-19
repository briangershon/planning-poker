import { v4 as uuid } from 'uuid';
import { parse, serialize } from 'cookie';

const COOKIE_NAME = 'session';

type userID = string;
type sessionID = string;
type cookieHeader = string | null;

interface Env {
  SESSION: {
    get(key: string): Promise<userID>;
    put(key: string, value: string, options: object): Promise<void>;
    delete(key: string): Promise<void>;
  };
}

export class AuthSession {
  env: Env;
  constructor(env: Env) {
    this.env = env;
  }

  static sessionIdFromCookieHeader(
    rawCookieHeader: cookieHeader
  ): sessionID | null {
    if (rawCookieHeader === null) {
      return null;
    }
    const parsedCookie = parse(rawCookieHeader);
    if (parsedCookie[COOKIE_NAME]) {
      return parsedCookie[COOKIE_NAME];
    }
    return null;
  }

  async addSession(userId: userID, expireSeconds: number): Promise<sessionID> {
    const id = uuid();
    await this.env.SESSION.put(id, userId, { expirationTtl: expireSeconds });
    return id;
  }

  async getUserBySession(sessionId: sessionID): Promise<userID | null> {
    return this.env.SESSION.get(sessionId);
  }

  async deleteSession(sessionId: sessionID): Promise<void> {
    return this.env.SESSION.delete(sessionId);
  }
}
