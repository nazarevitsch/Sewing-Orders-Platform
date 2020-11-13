'use strict';

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const { routes } = require('./src/router.js');
const render = require('koa-ejs');

const server = new Koa();
const port = process.env.PORT || 8080;

render(server, {
  root: './public/html',
  layout: false,
  viewExt: 'html',
  cache: false,
});

server.use(bodyParser());
server.use(routes);

server.listen(port, () => {
  console.log(`Server started on port ${port}...`);
});
exports.app = server;
