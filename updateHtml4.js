var fs = require("fs");
var config = require("./constant");
fs.readdir("./html", "utf8", (err, fileList) => {
  if (err) throw err;
  // [100.html,101.html...] => [3.html,34.html...]
  // 如果不是纯数字字符串的话，a - b 会保持原来的结果
  // 需要使用 parseInt() 转换
  fileList.sort(function (a, b) { return parseInt(a) - parseInt(b) });
  fileList.forEach((item, index) => {
    fileList[index] = "./html/" + item;
  });
  fs.readFile("./resource/data4.json", function (err, data) {
    if (err) console.error(err);
    else {
      const result = JSON.parse(data.toString());
      result.forEach((item, index) => {
        let template = config.templateStart + item.article_content + config.templateEnd;
        fs.writeFile(fileList[index], template, (err) => {
          if (err) console.error(err);
        });
      });
    }
  });
});
