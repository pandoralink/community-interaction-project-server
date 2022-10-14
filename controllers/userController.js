const userService = require("../services/userService");

// 导入 bcryptjs 加密包
// const bcrypt = require('bcryptjs')

// 注册
exports.register = (req, res) => {
  // 接收数据
  const { username, password } = req.body;

  // 1、合法性校验
  // 1.1、（必传参数）
  // if (!username || !password) {
  //   return res.codeMsg('用户名或密码不能为空')
  // }

  // 2、用户名是否被占用
  userService.checkUser(username, res);

  // 3、插入新用户
  // 3.1、（使用✨bcrypt.hashSync()对密码加密）
  // TODO: 暂时采用明文，后期改进
  // const encryptPassword = bcrypt.hashSync(password, 10)

  // userService.register(username, encryptPassword, res)
  userService.register(username, password, res);
};

// 登录
exports.login = (req, res) => {
  // 接收数据
  const { username, password } = req.body;

  // 1、用户登录
  userService.login(username, password, res);
};

exports.getUserInfo = (req, res) => {
  userService.getUserInfo(req, res);
};
