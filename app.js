const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const articleRouter = require("./routes/article");
const userRouter = require("./routes/user.js");
const messageRouter = require("./routes/message");
const { expressjwt: jwt } = require("express-jwt");
const jwtConfig = require("./config/jwt.config");
const { STATUS } = require("./utils/constant");
const { instance: wss } = require("./utils/ws");
const { Result } = require("./types");

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
app.use(
  jwt({ secret: jwtConfig.jwtSecretKey, algorithms: ["HS256"] }).unless({
    path: [
      /^\/(login|register)/,
      /^\/(article|userArticle|authorInfo|getArticleDetail)/,
    ],
  })
);

app.use("/", articleRouter);
app.use("/", userRouter);
app.use("/", messageRouter);

// 错误级别中间件
app.use(function (err, req, res, next) {
  // 捕获身份认证失败的错误
  if (err.name === "UnauthorizedError") {
    return res.send(
      new Result({ code: STATUS.loginError, info: "身份认证失败！" })
    );
  }

  // 其他未知错误
  console.log(err);
  return res.send(new Result({ code: STATUS.error, info: "身份认证失败！" }));
});

if (process.env.NODE_ENV !== "dev") {
  app.listen(Number(process.env.PORT), () => {
    console.log(`Server start on http://localhost:${process.env.PORT}`);
  });
}

module.exports = app;
