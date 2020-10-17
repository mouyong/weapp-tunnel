const Router = require("koa-router");
const router = new Router();

// 处理信息
const handle = (socket, type, msg, tunnelId) => {
  switch (type) {
    case "send":
      socket.emit("msg", msg);
      break;
    case "close":
      socket.disconnect(true);
      delete global.tunnels[tunnelId];
      break;
    default:
      console.log("指令错误");
  }
};

router.post("/ws/push", ctx => {
  // directive = {"type":"send","msg":{"a":456}}
  const { tunnelIds, directive, signature } = ctx.request.body;
  if (!tunnelIds || !directive || !signature) {
    ctx.body = {
      code: -1,
      msg: "参数不正确"
    };
    return false;
  }

  // TODO 签名验证

  let type, msg
  if (typeof directive === 'string') {
    try {
      directiveObj = JSON.parse(directive)
      type = directiveObj.type
      msg = directiveObj.msg
    } catch(e) {
      ctx.body = {
        code: -1,
        msg: "转发指令格式不正确",
      };
      return
    }
  } else {
    type = directive.type
    msg = directive.msg
  }

  tunnelIds.forEach(tunnelId => {
    if (!global.tunnels[tunnelId]) {
      console.debug(`ws/push tunnelId ${tunnelId} 不存在`)
      return
    }
    
    const { socket } = global.tunnels[tunnelId];
    if (!socket) {
      if (type === 'close') {
        delete global.tunnels[tunnelId]
      }
      return
    }

    handle(socket, type, msg, tunnelId);
  });

  ctx.body = {
    code: 0,
    msg: "成功"
  };
});

module.exports = router;
