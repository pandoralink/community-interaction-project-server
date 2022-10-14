const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

// 合法性校验
const expressJoi = require("../schemas//express-joi");
const { userSchema, getUserInfoSchema } = require("../schemas/userSchema");

// 注册
// router.post("/register", expressJoi(userSchema), userController.addUser);

// 登录
router.post("/login", expressJoi(userSchema), userController.login);

router.get(
  "/userInfo",
  expressJoi(getUserInfoSchema),
  userController.getUserInfo
);

module.exports = router;
