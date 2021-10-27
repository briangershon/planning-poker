import { jest, describe, expect, test } from '@jest/globals';
// import { Miniflare } from 'miniflare';
import { router } from './index';

// global.Response = jest.fn();

// const request = require('supertest');
// import index from './index';

// describe('happy path', () => {
//   test('null cookie', async () => {
//     const abc = await index.fetch('/', {});
//     console.log('abc', abc);
//     // expect(AuthSession.sessionIdFromCookieHeader(null)).toBeNull();
//   });
// });

// test('mf', async () => {
//   const mf = new Miniflare({
//     script: `
//   addEventListener("fetch", (event) => {
//     event.respondWith(new Response("Hello Miniflare!"));
//   });
//   `
//   });
//   const res = await mf.dispatchFetch('http://localhost:8787/');
//   console.log(await res.text()); // Hello Miniflare!
// });

// const mockFetchPromise = Promise.resolve({
//   json: () => Promise.resolve({})
// });
// global.fetch = jest.fn(() => mockFetchPromise);

//////

// global.Response = jest.fn();
global.Response.mockResolvedValue('/yoyo');

const buildRequest = ({
  method = 'GET',
  path,
  url = `https://example.com${path}`,
  ...other
}) => ({ method, path, url, ...other });

test('router', async () => {
  //   const basicHandler = jest.fn(req => req.params);
  const result = await router.handle(
    buildRequest({ path: '/api/logout', headers: { get: jest.fn() } }),
    {}
  );
  console.log('result', result);
  //   expect(basicHandler).toHaveReturnedWith({ x: 'a.b' });

  //   console.log('hi');
  //   console.log('router.routes', router.routes);
  // //   console.log('router', JSON.stringify(router));
  //   const abc = router.get('/', () => {});
  //   console.log('abc', abc)
});
