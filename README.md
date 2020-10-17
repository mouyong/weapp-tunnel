# weapp-tunnel

node版，模仿小程序的Wafer中信道服务，用于在不使用腾讯云时，正常使用功能。


## 支持

Node 8.4 +


## 依赖

Koa 2+
Socket.io 2+


## 基本逻辑

信道提供 WebSocket 服务

- 与用户建立 ws 连接
- 转发用户信息到业务服务器（业务服务器申请时提交）
- 业务服务器可以向信道服务申请信道(/api/get/wsurl)
- 业务服务器可以通过信道向用户推送信息（/api/ws/push）
- 业务服务器可以查看服务器的所有隧道信息（/api/get/tunnels）

## 文档

请查看 DOC.md