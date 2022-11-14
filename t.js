const http = require("http");

const data = JSON.stringify({
  username: "10182821",
  password: "123456"
});

const options = {
  hostname: "localhost",
  port: 3001,
  path: "/login",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": data.length
  },
};

const req = http
  .request(options, (res) => {
    let data = "";

    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      console.log(JSON.parse(data));
    });
  })
  .on("error", (err) => {
    console.log("Error: ", err.message);
  });

req.write(data);
req.end();
