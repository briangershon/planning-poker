import { describe, expect, test } from '@jest/globals';
import { AuthSession } from './auth-session';

describe('has NO session due to', () => {
  test('null cookie', () => {
    expect(AuthSession.sessionIdFromCookieHeader(null)).toBeNull();
  });

  test('empty cookie', () => {
    expect(AuthSession.sessionIdFromCookieHeader('')).toBeNull();
  });

  test('no session key', () => {
    expect(
      AuthSession.sessionIdFromCookieHeader('cookie1=value1; cookie2=value2')
    ).toBeNull();
  });
});

describe('has a session', () => {
  test('cookie having session', () => {
    expect(
      AuthSession.sessionIdFromCookieHeader(
        'session=123; cookie1=value1; cookie2=value2'
      )
    ).toEqual('123');
  });
});
