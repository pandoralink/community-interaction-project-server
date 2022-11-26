var fs = require("fs");
var config = require("./constant");
fs.readdir("./html", "utf8", (err, fileList) => {
  if (err) throw err;
  fileList.forEach((item, index) => {
    fileList[index] = "./html/" + item;
  });
  fs.readFile("./resource/JSON.txt", function (err, data) {
    if (err) console.error(err);
    else {
      let d = config.line(data.toString());
      let result = config.loadJSON(d);
      let i = 0;
      result.forEach((item, index) => {
        let template = config.templateStart + item.content + config.templateEnd;
        fs.writeFile(fileList[i], template, (err) => {
          if (err) console.error(err);
        });
        i++;
      });
    }
  });
});
