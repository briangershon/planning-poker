import { v4 as uuid } from 'uuid';

export class AuthSession {
  static generateSessionId() {
    return uuid();
  }
}
