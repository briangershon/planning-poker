/** @type {import("snowpack").SnowpackUserConfig } */
import proxy from 'http2-proxy';

console.log('NODE_ENV', process.env.NODE_ENV);

export default {
  env: {
    SITE_URL: 'http://localhost:8080',
    WEBSOCKET_URL: 'ws://localhost:8080/api/ws/',
  },
  mount: {
    public: '/',
    src: '/dist',
  },
  routes: [
    {
      src: '/api/ws/',
      upgrade: (req, socket, head) => {
        const defaultWSHandler = (err, req, socket, head) => {
          if (err) {
            console.error('proxy error', err);
            socket.destroy();
          }
        };

        proxy.ws(
          req,
          socket,
          head,
          {
            hostname: 'localhost',
            port: 8787,
          },
          defaultWSHandler
        );
      },
    },
    {
      src: '/api/.*',
      dest: (req, res) => {
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
