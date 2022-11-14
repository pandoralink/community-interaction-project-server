const { promisePool, Pool } = require("../models/db");
const { Result } = require("../types/index");
const userModel = require("../models/userModel");
const { STATUS } = require("../utils/constant");

const jwt = require("../utils/jwt");

// 导入 bcryptjs 加密包
// const bcrypt = require("bcryptjs");

const userService = {
  // 用户名是否被占用（同步方式演示）
  checkUser: (username, res) => {
    Pool.query(userModel.checkByUsername, [username], function (err, rows) {
      if (err) {
        return res.send(new Result({ code: STATUS.error, info: err }));
      }

      if (rows.length > 0) {
        return res.send(
          new Result({
            code: STATUS.error,
            info: "用户名被占用，请更换其他用户名！",
          })
        );
      }
    });
  },

  // 插入新用户
  addUser: (username, password, res) => {
    Pool.query(
      userModel.addUser,
      [{ username: username, password: password }],
      function (err, rows) {
        if (err) {
          return res.send(new Result({ code: STATUS.error, info: err }));
        }

        if (rows.affectedRows !== 1) {
          return res.send(
            new Result({
              code: STATUS.error,
              info: "注册用户失败，请稍后再试！",
            })
          );
        }

        // 注册成功提示
        return res.send(
          new Result({ code: STATUS.success, info: "注册成功！" })
        );
      }
    );
  },

  // 用户登录
  login: (username, password, res) => {
    Pool.query(
      userModel.checkByUsername,
      [username, password],
      function (err, rows) {
        if (err) {
          return res.send(new Result({ code: STATUS.error, info: err }));
        }

        // 用户是否存在
        if (rows.length !== 1) {
          return res.send(
            new Result({ code: STATUS.error, info: "账号或密码错误" })
          );
        }

        // 密码是否正确（使用✨bcrypt.compareSync()对密码进行比较）
        // TODO: 后期添加
        // const compareResult = bcrypt.compareSync(password, rows[0].password);

        // if (!compareResult) {
        //   return res.codeMsg("密码错误！");
        // }

        // 🚩设置token签名
        // 1、生成token
        const user = { ...rows[0], user_password: "" }; // 利用展开运算符的方式排除密码等敏感信息
        const tokenStr = jwt.generate(user);

        // 2、发送token到客户端（header方式）
        // res.header('Authorization', token)
        res.cookie("token", "Bearer " + tokenStr, {
          maxAge: 60 * 60 * 24,
          httpOnly: true,
        });
        return res.send({
          code: 0,
          message: "登录成功",
          data: {
            token: "Bearer " + tokenStr,
            user,
          },
        });
      }
    );
  },

  // 获取 - 用户基本资料
  getUserInfo: async (req, res) => {
    const { userId } = req.query;
    Pool.query(userModel.getUserinfo, [userId], function (error, results) {
      if (error) throw error;
      res.send(
        new Result({
          code: STATUS.success,
          data: results[0],
        })
      );
    });
  },
};

module.exports = userService;
