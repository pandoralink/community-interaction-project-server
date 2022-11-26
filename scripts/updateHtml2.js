var fs = require("fs");
var HTMLParser = require("node-html-parser");
var config = require("./constant");

fs.readdir("./html", "utf8", (err, fileList) => {
  if (err) throw err;
  fileList.forEach((item, index) => {
    fileList[index] = "./html/" + item;
  });
  fileList.forEach((item, index) => {
    fs.readFile(item, (err, data) => {
      if (err) console.error(err);
      const root = HTMLParser.parse(data.toString());
      try {
        root.querySelector(".main .footer").remove();
      } catch (err) {
        console.log(item);
        console.log(err);
      }
      let template =
        config.templateStart +
        root.querySelector(".main").innerHTML +
        config.templateEnd;
      fs.writeFile(item, template, (err) => {
        if (err) console.error(err);
      });
    });
  });
});

// 失败的解析
// /<div class="main">(.*)<div class="footer">/.exec(`<div class="main"><p>test</p><div class="footer">`)[1];
