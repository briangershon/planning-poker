/** @type {import("snowpack").SnowpackUserConfig } */

console.log('NODE_ENV', process.env.NODE_ENV);

export default {
  env: {
    SITE_URL: 'https://planningpoker.games',
  },
  mount: {
    public: '/',
    src: '/dist',
  },
  routes: [
    /* Enable an SPA Fallback */
    { match: 'routes', src: '.*', dest: '/index.html' },
  ],
  optimize: {
    // bundle: true,    // true breaks css modules
    minify: true,
    target: 'es2018',
  },
  packageOptions: {
    /* ... */
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    /* ... */
  },
};
