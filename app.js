const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const articleRouter = require("./routes/article");
const userRouter = require("./routes/user.js");
const { expressjwt: jwt } = require("express-jwt");
const jwtConfig = require("./config/jwt.config");
const { STATUS } = require("./utils/constant");
const { instance: wss } = require("./utils/ws");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  cors({
    origin: "http://localhost:19006",
    optionsSuccessStatus: 200,
    credentials: true,
  })
);
app.use(function (req, res, next) {
  // TODO: 后期应将状态值固定
  // code = 0 为成功； code = 1 为失败； 默认将 code 的值设置为 1，方便处理失败的情况
  res.codeMsg = function (err, code = 1, data = {}) {
    res.send({
      // 状态
      code,
      // 状态描述，判断 err 是 错误对象 还是 字符串
      message: err instanceof Error ? err.message : err,
      data,
    });
  };
  next();
});
app.use(
  jwt({ secret: jwtConfig.jwtSecretKey, algorithms: ["HS256"] }).unless({
    path: [/^\/(login|register)/, /^\/(article|userArticle|authorInfo)/],
  })
);

app.use("/", articleRouter);
app.use("/", userRouter);

// 错误级别中间件
app.use(function (err, req, res, next) {
  // 捕获身份认证失败的错误
  if (err.name === "UnauthorizedError")
    return res.codeMsg("身份认证失败！", STATUS.loginError);

  // 其他未知错误
  console.log(err);
  return res.codeMsg(err);
});

app.listen(3001, function () {
  console.log("runing 3001...");
});

module.exports = app;
