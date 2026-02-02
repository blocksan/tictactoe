const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/pg-proxy',
    createProxyMiddleware({
      target: 'https://sandbox.cashfree.com/pg',
      changeOrigin: true,
      pathRewrite: {
        '^/pg-proxy': '', // remove /pg-proxy from path
      },
    })
  );
};
