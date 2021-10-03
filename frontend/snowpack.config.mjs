/** @type {import("snowpack").SnowpackUserConfig } */

console.log('NODE_ENV', process.env.NODE_ENV);

export default {
  mount: {
    public: '/',
    src: '/dist',
  },
  routes: [
    /* Enable an SPA Fallback in development: */
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
