const { mod } = require("@tensorflow/tfjs");
const jwt = require("./jwt");

const WebSocketServer = require("ws").Server;
const wss = new WebSocketServer({ port: 8181 }); //服务端口8181
// map 保证 userId 唯一
const map = new Map();
wss.on("connection", function (ws, req) {
  // "/?id=1005" <=> 1005
  try {
    // 需要对 id 进行校验
    const searchParams = new URLSearchParams(req.url);
    const id = searchParams.get("id"),
      token = searchParams.get("token");
    if (!jwt.verify(token)) {
      throw new Error("身份验证失败");
    } else {
      console.log("连接成功");
    }
    // console.log(`服务端：user: ${id} 已连接`);
    // const clientManager = map.get(id.toString());
    // if (clientManager && clientManager.client) {
    //   /**
    //    * 客户端断开连接并且没
    //    * 有关闭 ws 连接
    //    */
    //   clientManager.client = ws;
    //   clientManager.msgs = [];
    // } else if (clientManager && !clientManager.client) {
    //   /**
    //    * 客户端存在且不活跃
    //    * 初始化客户端并发送缓存消息
    //    */
    //   clientManager.client = ws;
    //   clientManager.client.send(clientManager.msgs);
    // } else {
    //   // 客户端不存在
    //   map.set(id.toString(), wsMsgTemplate(ws));
    // }
    ws.on("message", function (message) {});
    // ws.on("close", (msg) => {
    //   map.delete(id.toString());
    //   console.log(`与前端 ${id} 断开连接`);
    // });
  } catch (err) {
    console.log(err);
    // ws.close();
  }
});

module.exports = {
  instance: wss,
  sendMsg,
};
function sendMsg(id, content, name, headUrl, contentUrl, aid) {
  const msg = {
    id: id,
    content: content,
    name: name,
    headUrl: headUrl,
    contentUrl: contentUrl,
    aid: aid,
  };
  const clientManager = map.get(id.toString());
  if (clientManager && clientManager.client) {
    /**
     * 客户端存在且活跃，直接发送消息
     * 并置空 msgs 消息队列
     */
    clientManager.msgs = [];
    clientManager.client.send([msg]);
  } else if (clientManager && !clientManager.client) {
    /**
     * 客户端存在且不活跃
     * 缓存消息到 msgs 消息队列
     */
    clientManager.msgs.push(msg);
  } else {
    // 客户端不存在
    map.set(id.toString(), wsMsgTemplate(null, [msg]));
  }
  console.log(JSON.stringify(msg));
}
function wsMsgTemplate(ws, arr = []) {
  return {
    client: ws,
    msgs: arr,
  };
}
