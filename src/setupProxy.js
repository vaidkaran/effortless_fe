const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/proxy',
    createProxyMiddleware({
      changeOrigin: true,
      logger: console,
      pathRewrite: (path, req) => {
        const url = new URL(req.headers.target);
        return(url.pathname);
      },
      router: (req) => {
        const url = new URL(req.headers.target);
        return(url.origin);
      }
    }),
  );
};