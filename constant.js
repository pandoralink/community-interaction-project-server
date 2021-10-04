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
      </div>
      <div class="main">
`;
const templateEnd = `
      </div>
      <div class="footer">
        <div class="footer-info">全部评论</div>
        <div class="comment">
          <post-comment
            ref="comment"
            @add="addMessage"
            @reply="replyArticle"
            @cancel="cancel"
            :remote-base-url="remoteBaseUrl"
            :new-id="parseInt(newId)"
            :commentator-id="parseInt(userId)"
            :commentator-name="userName"
            :commentator-head-url="userHeadUrl"
            :rid="parseInt(currentReplyId)"
            :rname="currentReplyUserName"
            :content-url="articleUrl"
            placeholder="回复文章"
          ></post-comment>
          <div class="main">
            <message
              v-for="(item,index) in list"
              :key="index"
              :id="item.id"
              :content="item.content"
              :create-time="item.create_time"
              :son="item.son"
              :uid="item.commentator_id"
              :name="item.commentator_name"
              :head-url="item.commentator_head_url"
              @add="reply"
              first
            ></message>
            <div
              alt="空块，避免回复框挡住评论"
              style="width: 100%; height: 60px"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </body>

  <script src="./lib/vue@3.2.6/vue.global.prod.js"></script>
  <script src="./lib/axios@0.21.1.js"></script>
  <script src="./lib/dayjs.min.js"></script>
  <script type="module">
    import config from "./lib/config.js";
    import Message from "./comment/Message.js";
    import PostComment from "./comment/PostComment.js";
    /**
     * currentReplyId 是当前回复的 <message> 在 comment 表中的 id
     * currentChildArr 是当前回复的 <message> 的 son: Array
     */
    const article = {
      data() {
        return {
          userName: "",
          remoteBaseUrl: "",
          list: [],
          newId: 0,
          userId: 0,
          userHeadUrl: "",
          replayUserFlag: false,
          currentReplyId: 0,
          currentChildArr: [],
          currentReplyUserName: "",
          articleUrl: "",
        };
      },
      created() {
        this.initData();
        this.initCommentData();
      },
      methods: {
        initData() {
          this.userName = config.getQueryVariable("userName")
            ? config.getQueryVariable("userName")
            : null;
          this.userId = config.getQueryVariable("userId")
            ? config.getQueryVariable("userId")
            : null;
          this.userHeadUrl = config.getQueryVariable("userHeadUrl")
            ? config.getQueryVariable("userHeadUrl")
            : "";
          this.newId = config.getQueryVariable("newId")
            ? config.getQueryVariable("newId")
            : null;
          this.articleUrl = window.location.href.split("?")[0];
          console.log(this.articleUrl);
          this.remoteBaseUrl = config.baseUrl ? config.baseUrl : "";
        },
        initCommentData() {
          axios
            .get(config.baseUrl + "/getCommentData" + "?new_id=" + this.newId)
            .then((res) => {
              this.list = res.data.data;
            })
            .catch((err) => {
              console.log(err);
            });
        },
        addMessage(e) {
          if (e.parent_id == 0) this.list.push(e);
          else {
            e.rname = this.currentReplyUserName;
            this.currentChildArr.push(e);
          }
          this.currentReplyId = 0;
          this.$refs.comment.content = "";
        },
        reply(e) {
          this.$refs.comment.content = "";
          this.replayUserFlag = true;
          this.currentChildArr = e.arr;
          this.currentReplyId = e.id;
          this.currentReplyUserName = e.name;
          const commentTextAreaDom = this.$refs.comment.$el.querySelector(
            "textarea"
          );
          commentTextAreaDom.select();
          commentTextAreaDom.placeholder = "回复" + e.name;
        },
        replyArticle() {
          if (!this.replayUserFlag) {
            this.postCommentEmpty();
            this.$refs.comment.$el.querySelector("textarea").placeholder =
              "回复文章";
          }
        },
        cancel() {
          this.replayUserFlag = false;
          // 操作 Dom 元素是因为修改直接修改 placeholder 元素更新失败
          this.$refs.comment.$el.querySelector("textarea").placeholder =
            "回复文章";
        },
        postCommentEmpty() {
          this.currentChildArr = [];
          this.currentReplyUserName = "";
          this.currentReplyId = 0;
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
config.remoteFileDefaultPath = "../News/";
config.localFileDefaultPath = "./html/";
config.loadJSON = function loadJSON(d) {
  for (let i = 0; i < d.length; i++) d[i] = JSON.parse(d[i]);
  return d;
};
module.exports = config;
