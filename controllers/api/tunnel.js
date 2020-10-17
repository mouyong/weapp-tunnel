const Router = require("koa-router");
const md5 = require("../../utils/md5");
const { check,compute } = require("../../utils/signature");
const config = require("../../config/index");
const router = new Router();

// 业务服务器需要提供，token，url，signature
router.post("/get/tunnels", ctx => {
  console.log(global.tunnels);

  ctx.body = {
    code: 0,
    data: global.tunnels
  };
});

module.exports = router;
