var fs = require("fs");
var HTMLParser = require("node-html-parser");
const config = require("./constant");
fs.readFile("./html/273.html", (err, data) => {
  if (err) console.error(err);
  const root = HTMLParser.parse(data.toString());
  root.querySelector(".main").innerHTML = "<p>test2</p>"
  let template =
    config.templateStart +
    root.querySelector(".main").innerHTML +
    config.templateEnd;
  fs.writeFile("./html/273.html", template, (err) => {
    if (err) console.error(err);
  });
});