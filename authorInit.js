var mysql = require("mysql");
var fs = require("fs");
var connection = mysql.createConnection({
  host: "116.63.152.202",
  user: "poplink",
  password: "1900301125",
  port: "3306",
  database: "examdb",
});

connection.connect();

function line(d) {
  let data = d.split("\n");
  for (let i = 0; i < data.length; i++) {
    if (data[i].length == 0) data.splice(i, 1);
  }
  return data;
}
function loadJSON(d) {
  for (let i = 0; i < d.length; i++) d[i] = JSON.parse(d[i]);
  return d;
}
let templateStart = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title></title>
    <link href="./comment/MessageBoard.css" rel="stylesheet" />
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
            <div>{{ author }}</div>
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
          <!-- <post-comment> 一定要和 <message> 解耦，不能相互嵌套！ -->
          <post-comment
            @add="addMessage"
            :remote-base-url="remoteBaseUrl"
            :new-id="newId"
            :commentator-id="userId"
            :commentator-name="userName"
            :commentator-head-url="userHeadUrl"
          ></post-comment>
          <div class="main">
            <message
              v-for="(item,index) in list"
              :key="index"
              :id="item.comment_id"
              :content="item.content"
              :create-time="item.create_time"
              :son="item.son"
              :remote-base-url="remoteBaseUrl"
              :name="item.commentator_name"
              :head-url="item.commentator_head_url"
              :new-id="newId"
              :commentator-id="userId"
              :commentator-name="userName"
              :commentator-head-url="userHeadUrl"
            ></message>
          </div>
        </div>
      </div>
    </div>
  </body>

  <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
  <script src="./lib/vue@3.2.6.js"></script>
  <script type="module">
    import config from "./lib/config.js";
    import Message from "./comment/Message.js";
    import PostComment from "./comment/PostComment.js";
    const article = {
      data() {
        return {
          headUrl: config.defaultHeadBaseUrl + "default_head.png",
          followStatus: false,
          author: "",
          authorHeadUrl: "",
          userName: "",
          remoteBaseUrl: "",
          list: "",
          newId: "",
          userId: "",
          userHeadUrl: "",
        };
      },
      created() {
        this.initData();
        this.initCommentData();
      },
      methods: {
        initData() {
          this.author = localStorage.getItem("author")
            ? localStorage.getItem("author")
            : "error";
          this.authorHeadUrl = localStorage.getItem("authorHeadUrl")
            ? localStorage.getItem("authorHeadUrl")
            : "http://116.63.152.202:5002/userHead/default_head.png";
          this.userName = localStorage.getItem("userName")
            ? localStorage.getItem("userName")
            : null;
          this.userId = localStorage.getItem("userId")
            ? localStorage.getItem("userId")
            : null;
          this.userHeadUrl = localStorage.getItem("userHeadUrl")
            ? localStorage.getItem("userHeadUrl")
            : "";
          this.newId = localStorage.getItem("newId")
            ? localStorage.getItem("newId")
            : null;
          this.remoteBaseUrl = config.baseUrl ? config.baseUrl : "";
        },
        initCommentData() {
          axios
            .get(config.baseUrl + "/getCommentData" + "?new_id=" + this.newId)
            .then((res) => {
              let content = res.data.data;
              content.forEach((item, index) => {
                content[index].son = [];
              });
              let data = [];
              let key = [];
              let index = 0;
              content.forEach((item) => {
                if (item.parent_id == 0) {
                  data.push(item);
                  console.log(item.comment_id);
                  key[item.comment_id] = index;
                  index++;
                } else {
                  console.log(item.parent_id,key[1]);
                  if (key[item.parent_id] == undefined) {
                    for (let i = 0; i < key.length; i++) {
                      if (key[i] != undefined) {
                        data[key[i]].son.forEach((element) => {
                          if (element.comment_id == item.parent_id)
                            data[key[i]].son.push(item);
                        });
                      }
                    }
                  } else data[key[item.parent_id]].son.push(item);
                }
              });
              this.list = data;
              this.flag = true;
            })
            .catch((err) => {
              console.log(err);
            });
        },
        addMessage(e) {
          this.list.push(e);
        },
      },
    };

    const app = Vue.createApp(article);
    app.component("message", Message);
    app.component("PostComment", PostComment);
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
      font-family: Microsoft YaHei, Avenir, Helvetica, Arial, sans-serif;
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

fs.readFile("./resource/JSON.txt", function (err, data) {
  if (err) console.error(err);
  else {
    let d = line(data.toString());
    let result = loadJSON(d);
    // result.forEach((item,index) => {
    //   sql = "call proc_userByInsert(?,'123456',@result)"
    //   connection.query(sql
    //     ,[item.onwer_name]
    //     ,function (error, results) {
    //       if (error) throw error;
    //     });
    // });
    /**
     * 用一种类似递归的方式去等待异步完成
     * 也可以使用 async / await
    */
    init(result, 0);
  }
});

function init(d, i) {
  if (i >= d.length) {
    return;
  }
  else {
    let sql = "select max(new_id) from new";
    connection.query(sql, function (error, results) {
      if (error) throw error;
      let fileName = "./html/" + results[0]["max(new_id)"] + ".html";
      console.log(fileName);
      let template = templateStart + d[i].content + templateEnd;
      fs.writeFile(fileName, template, (err) => {
        if (err) console.error(err);
      });
      sql = "select user_id from user where user_name = ?";
      let user_id;
      connection.query(sql, [d[i].onwer_name], function (error, results) {
        if (error) throw error;
        user_id = results[0].user_id;
        sql =
          "call proc_newByInsert(?,'http://116.63.152.202:5002/userHead/default_head.png',?)";
        connection.query(
          sql,
          [user_id, d[i].name],
          function (error, results) {
            if (error) throw error;
            i++;
            init(d, i);
          }
        );
      });
    });
  }
}

connection.end;
