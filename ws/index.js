const axios = require("axios");
const { check, compute } = require("../utils/signature");

const ws = io => {
  const nsp = io.of("/weapp");
  nsp.on("connection", function(socket) {
    console.debug('nsp connection', socket.handshake.query)

    let { token, signature, tunnelId } = socket.handshake.query;
    if (!token || !signature || !tunnelId) {
      console.debug('参数不正确，转发数据失败')
      return
    }

    const tunnel = global.tunnels[tunnelId];
    if (!tunnel) {
      socket.disconnect(false)
      console.debug(`tunnelId ${tunnelId} 不存在`)
      return
    }
    
    tunnel.socket = socket;
    socket.on("msg", function(data) {
      axios.post(tunnel.url, { tunnelId, token, data }).then(res => {
        tunnel.socket.emit("msg", res.data)
      }).catch(err => {
        tunnel.socket.emit("msg", err)
      });
    });

    socket.on('disconnect',function(){
      // 删除不存在的链接，防止内存溢出
      delete global.tunnels[tunnelId];
    })
  });

  // 凡是不符合的全部关掉
  io.on("connection", function(socket) {
    let { token, signature, tunnelId } = socket.handshake.query;
    if (!token || !signature || !tunnelId) {
      socket.disconnect(false);
      console.debug(`io connection fail 参数不正确`)
      return
    }

    if (!global.tunnels[tunnelId]) {
      socket.disconnect(false);
      console.debug(`io connection fail tunnelId ${tunnelId} 不存在`)
      console.debug(`socket.handshake.query`, socket.handshake.query)
      return
    }

    if (!check(`${token}${tunnelId}`, signature)) {
      socket.disconnect(false);

      const serverSignature = compute(`${token}${tunnelId}`)

      console.debug(`io connection fail 签名验证失败 服务端签名：${serverSignature} 客户端签名: ${signature}`)
      console.debug(`签名数据 ${token} ${tunnelId}`)
      return
    }

    console.debug(`io connection success tunnelId: ${tunnelId}`)
  });
};

module.exports = ws;
