const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/branch/*',
    createProxyMiddleware({
      target: 'https://wzhu2.test-app.link',
      changeOrigin: true,
      pathRewrite: {
        '^/branch': '', // remove /branch from the URL
      },
      onProxyRes: function(proxyRes, req, res) {
        // Extract file ID from Branch.io response
        const fileId = req.path.split('/').pop();
        if (fileId) {
          // Redirect to our preview page
          res.redirect(`/preview/${fileId}`);
        }
      },
    })
  );
};
