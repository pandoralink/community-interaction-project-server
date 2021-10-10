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

app.get("/receive", function (req, res) {
  fs.writeFile('./resource/urlGroup2.txt', req.query.urlGroup, { flag: 'a+' }, err => {
    if (err) console.error(err);
  });
  res.send("success");
});

var server = app.listen(3000, function () {
  console.log("runing 3000...");
});