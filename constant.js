const config = {};
const templateStart = `
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
const templateEnd = `
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

  <script src="./lib/vue@3.2.6/vue.global.prod.js"></script>
  <script src="./lib/axios@0.21.1.js"></script>
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
</html>
`;

config.templateEnd = templateEnd;
config.templateStart = templateStart;
config.line = function line(d) {
  let data = d.split("\n");
  for (let i = 0; i < data.length; i++) {
    if (data[i].length == 0) data.splice(i, 1);
  }
  return data;
};
config.loadJSON = function loadJSON(d) {
  for (let i = 0; i < d.length; i++) d[i] = JSON.parse(d[i]);
  return d;
};
module.exports = config;
