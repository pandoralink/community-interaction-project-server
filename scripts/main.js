// 1. 通过拼接字符串的方式去生成文章 使用 replace()
// 2. 通过 ES6 模板语法嵌套变量生成
// 3. 为了防止跨站脚本漏洞，应该避免使用 ES6 模板语法，而是使用模板引擎 Mustache、Nunjucks
let templateStart = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title></title>
    <link href="./comment/MessageBoard.css" rel="stylesheet">
  </head>

  <body>
    <div id="app">
      <div class="head">
        <div
          clsss="head-content"
          style="display: flex; justify-content: space-between; align-items: center;"
        >
          <div class="head-left">
            <div class="pl-div">
              <img class="pl-img" :src="headUrl" alt="博主头像" />
            </div>
            <div>{{ ownerName }}</div>
          </div>

          <div class="head-right">
            <button class="pl-btn follow" @click="followStatus = !followStatus">
              {{ followStatus ? "+ 关注" : "✔ 已关注" }}
            </button>
          </div>
        </div>
      </div>
      <div class="main">
`;
let templateEnd = `
</div>
      <div class="footer">
        <div class="comment">
          <post-comment @add="addMessage"></post-comment>
          <div v-if="flag" class="main">
            <message v-for="(item,index) in list" :key="index"
              :id="item.id"
              :content="item.content"
              :createTime="item.create_time"
              :son="item.son"
            ></message>
          </div>
        </div>
      </div>
    </div>
    
  </body>

  <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
  <script src="./lib/vue@3.2.6.js"></script>
  <!-- <script src="lib/config.js"></script> -->
  <script type="module">
    import config from "./lib/config.js";
    import Message from "./comment/Message.js"
    import PostComment from "./comment/PostComment.js"
    const article = {
      data() {
        return {
          headUrl: config.defaultHeadBaseUrl + "default_head.png",
          followStatus: false,
          ownerName: "梁祖豪",
        };
      },
      created() {
        let userName = localStorage.getItem("userName");
        if(userName) {
          this.ownerName = userName;
        }
      },
    };

    const app = Vue.createApp(article);
    app.component('message',Message);
    app.component("PostComment",PostComment);
    app.mount("#app");
  </script>

  <style>
    body,
    html {
      height: 100%;
      margin: 0;
    }
    :root {
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }
    #app {
      padding: 10px;
      font-family: Microsoft YaHei, Avenir, Helvetica, Arial,  sans-serif
    }
    .head-content {
      /* head-content css 代码未生效，原因未知*/
      display: flex;
      justify-content: space-between;
    }
    .head-right {
      display: flex;
    }
    .head-left {
      display: flex;
    }
    .pl-btn {
      border: 0.3em solid #48d597;
      border-radius: 0.8em;
      padding: 5px 10px;
      margin: 5px;
      font-weight: 600;
      font-size: 14px;
      background-color: #ffffff;
      cursor: pointer;
      background: #fff;
      text-align: center;
      color: white;
      outline: 0;
    }
    .pl-btn.follow {
      background-color: #48d597;
    }
    .pl-div {
      position: relative;
      width: 40px;
      height: 40px;
      margin-right: 15px;
      border-radius: 10px;
      outline: 0;
      box-shadow: 1px 1px 4px 2px rgba(0, 0, 0, 0.1);
    }
    .pl-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 10px;
    }
    .main {
      padding: 10px 0px;
    }
    .internal {
      font-weight: bold;
      color: black;
    }
  </style>
</html>
`;

var express = require("express");
var fs = require("fs");
var app = express();
app.use(express.json());

app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Content-Type", "text/plain;charset=utf-8");
  next();
});

app.get("/generate", function (req, res) {
  // 应该对 req.body 进行防跨域脚本检验，但由于时间紧张先不做
  content = req.query.content;
  let template = templateStart + content + templateEnd;
  // 生成模板字符串后再生成本地 HTML 文件
  if (content != null && fs.existsSync("./html/test.html")) {
    fs.writeFile("./html/test.html", template, { flag: "a+" }, (err) => {
      if (err) console.error(err);
    });
  }
  res.send(template);
});

var server = app.listen(3000, function () {
  console.log("runing 3000...");
});
