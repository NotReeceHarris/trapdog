const Koa = require('koa');
const Router = require('@koa/router');
const trapdog = require('../dist/index');

const app = new Koa();
const router = new Router();
const port = 3000;

app.use(trapdog({}));

router.get('/', (ctx) => {
  ctx.body = 'Hello World!';
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});