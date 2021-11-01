/** @type {import("snowpack").SnowpackUserConfig } */
import proxy from 'http2-proxy';

console.log('NODE_ENV', process.env.NODE_ENV);

export default {
  env: {
    SITE_URL: 'http://localhost:8080',
  },
  mount: {
    public: '/',
    src: '/dist',
  },
  routes: [
    {
      src: '/api/.*',
      dest: (req, res) => {
        // remove /api prefix (optional)
        // req.url = req.url.replace(/^/api//, '/');

        return proxy.web(req, res, {
          hostname: 'localhost',
          port: 8787,
        });
      },
    },
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
