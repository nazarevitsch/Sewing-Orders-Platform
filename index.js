'use strict';

const Koa = require('koa');
const body = require('koa-body');
const { routes } = require('./src/router.js');
const render = require('koa-ejs');
const auth = require('./src/auth/Authorization.js');
const staticKoa = require('koa-static');

const server = new Koa();
const port = process.env.PORT || 8080;

render(server, {
  root: './public',
  layout: false,
  viewExt: 'html',
  cache: false,
});

server.use(staticKoa('./public/static'));

server.use(body({multipart: true, formidable:{ uploadDir: __dirname + '/upload_files', keepExtensions: true}}));

server.use(auth.validateToken);

server.use(routes);
server.listen(port, () => {
  console.log(`Server started on port ${port}...`);
});

exports.app = server;
