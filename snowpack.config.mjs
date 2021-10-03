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
    polyfillNode: true,
    rollup: {
      // ensure react/react-dom not duplicated when using CJS modules
      // https://github.com/snowpackjs/snowpack/issues/3033#issuecomment-905481198
      plugins: [
        {
          name: "externalize-react",
          options: (options) => {
            const isSnowpackExternal = options.external;
            options.external = (id) => id === "react" || id === "react-dom" || isSnowpackExternal(id);
          }
        }
      ]
    }
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    /* ... */
  },
};
