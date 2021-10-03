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
var fs = require("fs");
var config = require("./constant");

/**
 * user 账户的批量初始化
 * 只能执行一次
 */
function userInit() {
  fs.readFile("./resource/data2.json", function (err, data) {
    if (err) console.error(err);
    else {
      let d = JSON.parse(data);
      let temp = {};
      let flag = false;
      let result = d.filter((item, index) => {
        flag = true;
        for (let i = index + 1; i < d.length; i++) {
          if (item.article_author_name == d[i].article_author_name) flag = false;
        }
        return flag;
      })
      result.forEach((item, index) => {
        sql = "call proc_userByInsert2(?,'123456',?,@result)"
        connection.query(sql
          , [item.article_author_name, item.article_author_avatar_url]
          , function (error, results) {
            if (error) throw error;
          });
      });
    }
  });
}

/**
 * 文章的批量初始化
 * 只能执行一次
 */
function articleInit() {
  fs.readFile("./resource/data2.json", function (err, data) {
    if (err) console.error(err);
    else {
      let d = JSON.parse(data);
      let result = d;
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
}

articleInit();

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
      let template = config.templateStart + d[i].article_content + config.templateEnd;
      fs.writeFile(fileName, template, (err) => {
        if (err) console.error(err);
      });
      sql = "select user_id from user where user_name = ?";
      let user_id;
      connection.query(sql, [d[i].article_author_name], function (error, results) {
        if (error) throw error;
        user_id = results[0].user_id;
        sql =
          "call proc_newByInsert(?,?,?)";
        connection.query(
          sql,
          [user_id, d[i].article_cover, d[i].article_title],
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
