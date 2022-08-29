var express = require("express");
var fs = require("fs");
var mysql = require("mysql");
var HTMLParser = require("node-html-parser");
const config = require("./constant");
var connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  port: process.env.PORT,
  database: process.env.DATABASE,
});

connection.connect();
var app = express();
app.use(express.json());

app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Content-Type", "text/plain;charset=utf-8");
  next();
});
let resultTemplate = {
  code: "",
  msg: "",
  data: "",
};
// result 类

function Result(code, msg, data) {
  this.code = code;
  this.msg = msg;
  this.data = data;
}

app.get("/new", function (req, res) {
  const offset = req.query.offset ? parseInt(req.query.offset) : 0;
  connection.query(
    "select * from new join (select user_id,user_name,user_account,user_head from user) as u on new_owner_id = u.user_id limit ?,10;",
    [offset],
    function (error, result) {
      if (error) throw error;
      resultTemplate.code = 200;
      resultTemplate.msg = "success";
      resultTemplate.data = result;
      res.send(resultTemplate);
    }
  );
});

app.get("/getArticleDetail", function (req, res) {
  const { aid } = req.query;
  connection.query(
    "select * from new where new_id = ?;",
    [aid],
    function (error, result) {
      if (error) {
        console.log(error);
      }
      try {
        resultTemplate.code = 200;
        resultTemplate.msg = "success";
        resultTemplate.data = result && result.length && result.length > 0 && result[0];
        res.send(resultTemplate);
      } catch (error) {
        console.log(error);
      }
    }
  );
});

app.get("/userArticle", function (req, res) {
  connection.query(
    "select * from new join (select user_id,user_name,user_account,user_head from user where user_account = ?) as u on new_owner_id = u.user_id;",
    [req.query.userAccount],
    function (error, result) {
      if (error) throw error;
      resultTemplate.code = 200;
      resultTemplate.msg = "success";
      resultTemplate.data = result;
      res.send(resultTemplate);
    }
  );
});
app.get("/fan", function (req, res) {
  const fanId = req.query.fan_id;
  connection.query(
    `select * from (select * from (select * from fans where fan_id = ?) as f
    join (select user_id,user_name,user_account,user_head from user) as u
    on f.blogger_id = u.user_id) as fu
    join (select * from new) as n on fu.blogger_id = n.new_owner_id;`,
    [fanId],
    function (error, result) {
      if (error) throw error;
      resultTemplate.code = 200;
      resultTemplate.msg = "success";
      resultTemplate.data = result;
      res.send(resultTemplate);
    }
  );
});
app.get("/authorInfo", function (req, res) {
  const fanId = req.query.fan_id;
  const authorId = req.query.blogger_id;
  const promise = new Promise((resolve, reject) => {
    connection.query(
      "select * from fans where blogger_id = ? and fan_id = ?;",
      [authorId, fanId],
      function (error, result) {
        if (error) reject(error);
        resolve(result.length ? true : false);
      }
    );
  });

  promise
    .then((relate) => {
      connection.query(
        "select count(*) as total from fans where blogger_id = ?;",
        [authorId],
        function (error, result) {
          if (error) throw error;
          res.send(
            new Result(200, "success", {
              relate: relate,
              fanTotal: result[0].total,
            })
          );
        }
      );
    })
    .catch((err) => {
      console.error("服务器出错了" + err);
      res.send(new Result(200, "查询失败"));
    });
});
app.get("/addFollow", function (req, res) {
  const authorId = req.query.blogger_id;
  const fanId = req.query.fan_id;
  const r = obEmpty();
  connection.query(
    "INSERT INTO fans(blogger_id,fan_id) VALUES(?,?);",
    [authorId, fanId],
    function (error, result) {
      if (error) throw error;
      r.code = 200;
      r.msg = "success";
      res.send(r);
    }
  );
});
app.get("/cancelFollow", function (req, res) {
  const authorId = req.query.blogger_id;
  const fanId = req.query.fan_id;
  const r = obEmpty();
  connection.query(
    "DELETE FROM fans WHERE blogger_id = ? and fan_id = ?;",
    [authorId, fanId],
    function (error, result) {
      if (error) throw error;
      r.code = 200;
      r.msg = "success";
      res.send(r);
    }
  );
});
app.get("/getCommentData", function (req, res) {
  // resultTemplate.data = testData();
  // res.send(resultTemplate);
  connection.query(
    "select * from comment where new_id = ?",
    [req.query.new_id],
    function (error, result) {
      if (error) throw error;
      resultTemplate.data = dataConvert(result);
      res.send(resultTemplate);
    }
  );
});
function testData() {
  function Comment(id) {
    this.commentator_head_url = "";
    this.commentator_id = 0;
    this.commentator_name = "test";
    this.content = "test";
    this.create_time = "2021-09-04T09:33:12.000Z";
    this.id = id;
    this.new_id = 0;
    this.parent_id = 0;
    this.son = [];
  }
  const res = [];
  for (let i = 0; i < 10000; i++) {
    res.push(new Comment(i));
  }
  // for(let i = 0; i < 10; i++) {
  //   const currComment = new Comment(parseInt("" + i));
  //   const secondComment = [];
  //   for(let j = 0; j < 10; j++) {
  //     const currComment = new Comment(parseInt("" + i + j));
  //     const threeComment = [];
  //     for(let k = 0; k < 10; k++) {
  //       threeComment.push(new Comment(parseInt("" + i + j + k)));
  //     }
  //     currComment.son = threeComment;
  //     secondComment.push(currComment);
  //   }
  //   currComment.son = secondComment;
  //   res.push(currComment);
  // }
  return res;
}
function dataConvert(d) {
  /**
   * dataConvert 为传入的 comment 表数据
   * 添加了两个字段，son and rname，son
   * 是存放第 2 级 - 第 n 级 comment 的
   * 数组，rname 是父评论用户的名称
   */
  const content = d;
  content.forEach((item, index) => {
    content[index].son = [];
  });
  const data = [];
  const key = [];
  let index = 0;
  content.forEach((item) => {
    if (item.parent_id == 0) {
      data.push(item);
      key[item.id] = index;
      index++;
    } else {
      if (key[item.parent_id] == undefined) {
        // 3 - n 级评论
        for (let i = 0; i < key.length; i++) {
          if (key[i] != undefined) {
            data[key[i]].son.forEach((element) => {
              if (element.id == item.parent_id) {
                item.rname = element.commentator_name;
                data[key[i]].son.push(item);
              }
            });
          }
        }
      } else {
        // 2 级评论
        data[key[item.parent_id]].son.push(item);
      }
    }
  });
  /**
   * 时间复杂度
   * a 是 1 级评论最后一位索引
   * 最优：n + (n - a)
   * b 是 2 级评论最后一位索引
   * 最坏：n + ((n - a) - b) * a
   */
  return data;
}
app.get("/addComment", function (req, res) {
  const r = obEmpty();
  connection.query(
    "insert into comment(new_id,content,create_time,commentator_id,commentator_name,commentator_head_url,parent_id) values(?,?,?,?,?,?,?)",
    [
      req.query.new_id,
      req.query.content,
      req.query.create_time,
      req.query.commentator_id,
      req.query.commentator_name,
      req.query.commentator_head_url,
      req.query.parent_id,
    ],
    function (error, result) {
      if (error) throw error;
      else {
        if (req.query.rid != parseInt(req.query.commentator_id)) {
          // parent_id = 0 是回复文章
          // parent_id != 0 是回复其他人
          if (req.query.parent_id === 0) {
            notifyAuthor(
              parseInt(req.query.rid),
              req.query.content,
              req.query.commentator_name,
              req.query.commentator_head_url,
              req.query.contentUrl,
              req.query.new_id
            );
          } else {
            notifyUser(
              parseInt(req.query.rid),
              req.query.content,
              req.query.commentator_name,
              req.query.commentator_head_url,
              req.query.contentUrl,
              req.query.new_id
            );
          }
        }

        r.msg = "success";
        r.data = result.insertId;
        res.send(r);
      }
    }
  );
});
/**
 * 通知作者有人回复
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
 */
function notifyUser(id, content, name, headUrl, contentUrl, aid) {
  sendMsg(parseInt(id), content, name, headUrl, contentUrl, aid);
}

/**
 * 创作模块接口
 */
app.get("/getUserArticles", function (req, res) {
  const { userId } = req.query;
  const sql = "select * from new WHERE new_owner_id = ?;";
  connection.query(sql, [userId], function (error, results) {
    if (error) throw error;
    res.send(results);
  });
});
app.get("/addArticle", function (req, res) {
  let { uid, title, coverUrl, html } = req.query;
  let sql = "select max(new_id) from new";
  connection.query(sql, function (error, results) {
    if (error) throw error;
    let fileName =
      config.localFileDefaultPath + results[0]["max(new_id)"] + ".html";
    console.log(fileName);
    let template = config.templateStart + html + config.templateEnd;
    fs.writeFile(fileName, template, (err) => {
      if (err) console.error(err);
    });
    let user_id = uid;
    sql = "call proc_newByInsert(?,?,?)";
    connection.query(
      sql,
      [user_id, coverUrl, title],
      function (error, results) {
        if (error) throw error;
      }
    );
  });
});
/**
 * 只在数据库层面删除了
 * 文章，服务器存储中并
 * 没有删除
 */
app.get("/deleteUserArticle", function (req, res) {
  const { userId, aid } = req.query;
  const sql = "call proc_articleByDelete(?,?);";
  connection.query(sql, [aid, userId], function (error, results) {
    if (error) {
      res.send("failure");
      throw error;
    }
    res.send("success");
  });
});

app.get("/updateArticle", function (req, res) {
  // 对象模型解构属性名称需相同
  let { title, articleName, aid, html } = req.query;
  // 可以对 articleName 作一定校验
  articleName = config.localFileDefaultPath + articleName;

  const promise = new Promise((resolve, reject) => {
    fs.readFile(articleName, (err, data) => {
      if (err) reject(err);
      const root = HTMLParser.parse(data.toString());
      root.querySelector(".main").innerHTML = html;
      resolve(root.innerHTML);
    });
  });

  promise
    .then((htmlContent) => {
      fs.writeFile(articleName, htmlContent, (err) => {
        if (err) throw err;
      });
    })
    .then(() => {
      const sql = "UPDATE new SET new_name = ? WHERE new_id = ?;";
      connection.query(sql, [title, aid], function (error, results) {
        if (error) throw error;
        res.send(new Result(200, "更新成功"));
      });
    })
    .catch((err) => {
      console.error("服务器出错了" + err);
      res.send(new Result(200, "查询失败"));
    });
});
app.get("/getArticleHtml", function (req, res) {
  let { articleName } = req.query;
  articleName = config.localFileDefaultPath + articleName;
  fs.readFile(articleName, (err, data) => {
    if (err) console.error(err);
    const root = HTMLParser.parse(data.toString());
    const d = {
      content: root.querySelector(".main").innerHTML,
    };
    res.send(d);
  });
});

app.get("/getAuthorId", function (req, res) {
  const { newId } = req.query;
  const sql = "select * from new WHERE new_id = ?;";
  connection.query(sql, [newId], function (error, result) {
    if (error) throw error;
    res.send(result[0]);
  });
});
app.get("/getAuthorInfo", function (req, res) {
  const { authorId } = req.query;
  const sql = "select * from user WHERE user_id = ?;";
  connection.query(sql, [authorId], function (error, results) {
    if (error) throw error;
    res.send(results[0]);
  });
});
function obEmpty() {
  return {
    code: "",
    msg: "",
    data: "",
  };
}
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
var WebSocketServer = require("ws").Server;
wss = new WebSocketServer({ port: 8181 }); //服务端口8181
// map 保证 userId 唯一
const map = new Map();
wss.on("connection", function (ws, req) {
  // "/?id=1005" <=> 1005
  try {
    // 需要对 id 进行校验
    const id = req.url.split("?")[1].split("=")[1];
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
      clientManager.client.send(clientManager.msgs);
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
app.get("/getClients", function (req, res) {
  res.send(Array.from(map));
});

var server = app.listen(3001, function () {
  console.log("runing 3001...");
});

connection.end;
