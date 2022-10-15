const jwt = require("./jwt");

const WebSocketServer = require("ws").Server;
const wss = new WebSocketServer({ port: 8181 }); //服务端口8181
// map 保证 userId 唯一
const map = new Map();
wss.on("connection", function (ws, req) {
  // "/?id=1005" <=> 1005
  try {
    // 需要对 id 进行校验
    const searchParams = new URLSearchParams(req.url.replace(/^\/+/, ""));
    const id = searchParams.get("id"),
      token = searchParams.get("token");
    if (!jwt.verify(token)) {
      throw new Error("身份验证失败");
    }
    console.log(`服务端：user: ${id} 已连接`);
    const clientManager = map.get(id.toString());
    if (clientManager && clientManager.client) {
      /**
       * 客户端断开连接并且没
       * 有关闭 ws 连接
       */
      clientManager.client = ws;
      clientManager.msgs = [];
    } else if (clientManager && !clientManager.client) {
      /**
       * 客户端存在且不活跃
       * 初始化客户端并发送缓存消息
       */
      clientManager.client = ws;
      clientManager.client.send(JSON.stringify(clientManager.msgs));
    } else {
      // 客户端不存在
      map.set(id.toString(), wsMsgTemplate(ws));
    }
    ws.on("message", function (message) {});
    ws.on("close", (msg) => {
      map.delete(id.toString());
      console.log(`与前端 ${id} 断开连接`);
    });
  } catch (err) {
    console.log(err);
    ws.close();
  }
});

function sendMsg(id, content, title, headUrl, contentUrl, aid, uid) {
  const msg = {
    id: id,
    content: content,
    title,
    headUrl: headUrl,
    contentUrl: contentUrl,
    aid: aid,
    uid: uid,
  };
  const clientManager = map.get(id.toString());
  let res = undefined;
  if (clientManager && clientManager.client) {
    /**
     * 客户端存在且活跃，直接发送消息
     * 并置空 msgs 消息队列
     * websocket.send() 不支持发送数组
     * 前端只能接收到 Blob，需要使用 JSON
     */
    clientManager.msgs = [];
    clientManager.client.send(JSON.stringify([msg]));
    res = "发送成功";
  } else if (clientManager && !clientManager.client) {
    /**
     * 客户端存在且不活跃
     * 缓存消息到 msgs 消息队列
     */
    clientManager.msgs.push(msg);
    res = "未在线";
  } else {
    // 客户端不存在
    map.set(id.toString(), wsMsgTemplate(null, [msg]));
    res = "未在线";
  }
  console.log(JSON.stringify(msg));
  return res;
}

function wsMsgTemplate(ws, arr = []) {
  return {
    client: ws,
    msgs: arr,
  };
}

/**
 * 通知作者有人回复
 * @param {number} id
 * @param {string} content
 * @param {string} name
 * @param {string} headUrl
 * @param {string} contentUrl
 * @param {string} aid
 */
function notifyAuthor(id, content, name, headUrl, contentUrl, aid) {
  connection.query(
    "select new_owner_id as aid from new where new_id = ?",
    [newId],
    function (err, result) {
      sendMsg(parseInt(result[0].aid), content, name, headUrl, contentUrl, aid);
    }
  );
}

/**
 * 通知用户有人回复
 * @param {number} id
 * @param {string} content
 * @param {string} title
 * @param {string} headUrl
 * @param {string} contentUrl
 * @param {number} aid
 * @param {number} uid
 */
function notifyUser(id, content, title, headUrl, contentUrl, aid, uid) {
  const res = sendMsg(
    parseInt(id),
    content,
    title,
    headUrl,
    contentUrl,
    aid,
    uid
  );
  return res;
}

module.exports = {
  instance: wss,
  instanceMap: map,
  sendMsg,
  notifyAuthor,
  notifyUser,
};
