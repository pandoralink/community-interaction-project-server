// 将 JSON.txt 的数据修复成 JSON
var fs = require("fs");
const config = require("./constant");
fs.readFile("./resource/JSON.txt", function (err, data) {
  if (err) console.error(err);
  else {
    let d = config.line(data.toString());
    let result = config.loadJSON(d);
    let i = 0;
    let arr = [];
    result.forEach((item, index) => {
      let { content: article_content, onwer_name: article_author_name, name: article_title } = item;
      arr.push({
        article_content: article_content,
        article_cover: "",
        article_author_name: article_author_name,
        article_title: article_title,
        article_author_avatar_url: "",
      })
    });
    console.log(arr.length);
    fs.writeFile("./resource/data3.json", JSON.stringify(arr,null,"\t"), (err) => {
      if (err) console.error(err);
    });
  }
});
