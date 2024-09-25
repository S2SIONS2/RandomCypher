import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

module.exports = function(app){
  app.use(
    '/characters',
    createProxyMiddleware({
      target: 'https://api.neople.co.kr',
      changeOrigin: true,
      pathRewrite: {
        '^/characters': '/cy/characters',
      },
    })
  );
  
  app.listen(3001, () => {
    console.log('Proxy server is running on http://localhost:3001');
  });
}
