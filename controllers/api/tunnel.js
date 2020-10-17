const Router = require("koa-router");
const md5 = require("../../utils/md5");
const { check,compute } = require("../../utils/signature");
const config = require("../../config/index");
const router = new Router();

// 查看服务器当前的所有隧道
router.post("/get/tunnels", ctx => {
  const tunnels = []

  Object.keys(global.tunnels).forEach(tunnelId => {
    const tunnel = global.tunnels[tunnelId]

    tunnels.push({
      tunnelId: tunnel.tunnelId,
      url: tunnel.url,
      token: tunnel.token,
      createTime: tunnel.createTime,
      socket: !!tunnel.socket, // 是否建立连接
    })
  });
  
  ctx.body = {
    code: 0,
    data: tunnels
  };
});

module.exports = router;
