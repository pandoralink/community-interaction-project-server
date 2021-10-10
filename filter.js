var fs = require("fs");

function line(d) {
  let data = d.split("\n");
  for (let i = 0; i < data.length; i++) {
    if (data[i].length == 0 || !/http:\/\/toutiao\.com/.test(data[i]) || data[i] == "undefined") data.splice(i, 1);
  }
  return data;
}
function generateStr(d) {
  let str = "";
  for (let i = 0; i < d.length; i++) {
    str += d[i] + "\n";
  }
  return str;
}
fs.readFile("./resource/urlGroup2.txt", function (err, data) {
  if (err) console.error(err);
  else {
    const d = line(data.toString());
    const r = generateStr(d);
    fs.writeFile('./resource/urlGroup3.txt', r, err => {
      if (err) console.error(err);
    });
  }
});