import { v4 as uuid } from 'uuid';
import { parse, serialize } from 'cookie';

const COOKIE_NAME = 'session';

type UserID = string;
export type SessionID = string;
type CookieHeader = string | null;

interface Env {
  SESSION: {
    get(key: string): Promise<UserID>;
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
    rawCookieHeader: CookieHeader
  ): SessionID | null {
    if (rawCookieHeader === null) {
      return null;
    }
    const parsedCookie = parse(rawCookieHeader);
    if (parsedCookie[COOKIE_NAME]) {
      return parsedCookie[COOKIE_NAME];
    }
    return null;
  }

  async addSession(userId: UserID, expireSeconds: number): Promise<SessionID> {
    const id = uuid();
    await this.env.SESSION.put(id, userId, { expirationTtl: expireSeconds });
    return id;
  }

  async getUserBySession(sessionId: SessionID): Promise<UserID | null> {
    return this.env.SESSION.get(sessionId);
  }

  async deleteSession(sessionId: SessionID): Promise<void> {
    return this.env.SESSION.delete(sessionId);
  }
}
