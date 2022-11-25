const { Result } = require("../types/index");
const { STATUS } = require("../utils/constant");
const { notifyUser, instanceMap } = require("../utils/ws");

const messageService = {
  send: (req, res) => {
    // TODO: 发消息时要根据 token 确定发送人的身份
    try {
      // rid: , uid: 回复人 id, type: 消息类型
      const { rid, content, title, headUrl, contentUrl, aid, uid, type } = req.body;
      const info = notifyUser(
        parseInt(rid),
        content,
        title,
        headUrl,
        contentUrl,
        aid,
        uid,
        type
      );
      res.send(new Result({ code: STATUS.success, info }));
    } catch (e) {
      console.log(e);
      res.send(new Result({ code: STATUS.error, info: e }));
    }
  },
  getClients: (req, res) => {
    try {
      if (process.env.NODE_ENV === "dev") {
        res.send(
          new Result({ code: STATUS.success, data: Array.from(instanceMap) })
        );
      } else {
        res.send(new Result({ code: STATUS.success }));
      }
    } catch (e) {
      console.log(e);
      res.send(new Result({ code: STATUS.error, info: e }));
    }
  },
};

module.exports = messageService;
