var express = require("express");
var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "",
  user: "",
  password: "",
  port: "",
  database: "",
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

app.get("/new", function (req, res) {
  if (req.query.new_owner_id > 0) {
    connection.query(
      "select * from new join (select user_id,user_name,user_account,user_head from user) as u on new_owner_id = u.user_id;",
      function (error, result) {
        if (error) throw error;
        resultTemplate.code = 200;
        resultTemplate.msg = "success";
        resultTemplate.data = result;
        res.send(resultTemplate);
      }
    );
  } else {
    connection.query(
      "select * from new where new_owner_id = ?",
      function (error, result) {
        if (error) throw error;
        resultTemplate.code = 200;
        resultTemplate.msg = "success";
        resultTemplate.data = result;
        res.send(resultTemplate);
      }
    );
  }
});
app.get("/fan", function (req, res) {
  const fanId = req.query.fan_id;
  connection.query(
    "select * from (select * from fans where fan_id = ?) as a join new on new_owner_id = blogger_id;",
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
  connection.query(
    "select user_name,user_head from user where user_id = ?;",
    [authorId],
    function (error, result) {
      if (error) throw error;
      resultTemplate.data = {
        authorName: result[0].user_name,
        authorHeadUrl: result[0].user_head,
        relate: false,
      };
      connection.query(
        "select * from fans where blogger_id = ? and fan_id = ?;",
        [authorId, fanId],
        function (error, result) {
          if (error) throw error;
          resultTemplate.data.relate = result.length ? true : false;
          resultTemplate.code = 200;
          resultTemplate.msg = "success";
          res.send(resultTemplate);
        }
      );
    }
  );
});
app.get("/addFollow", function (req, res) {
  const fanId = req.query.fan_id;
  const authorId = req.query.blogger_id;
});
app.get("/getCommentData", function (req, res) {
  connection.query(
    "select * from comment where new_id = ?",
    [req.query.new_id],
    function (error, result) {
      if (error) throw error;
      resultTemplate.data = result;
      res.send(resultTemplate);
    }
  );
});
app.get("/addComment", function (req, res) {
  connection.query(
    "call proc_commentByInsert(?,?,?,?,?,?,?)",
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
        resultTemplate.msg = "success";
        resultTemplate.data = "";
        res.send(resultTemplate);
      }
    }
  );
});

var server = app.listen(3000, function () {
  console.log("runing 3000...");
});

connection.end;
