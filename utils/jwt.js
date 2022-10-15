const jsonwebtoken = require("jsonwebtoken");

const { jwtSecretKey, expires } = require("../config/jwt.config");

const jwt = {
  // 1、生成token字符串
  generate(value) {
    // 使用sign函数
    return jsonwebtoken.sign(
      {
        data: value,
      },
      jwtSecretKey,
      {
        expiresIn: expires,
      }
    );
  },

  // 解密数据
  verify(token) {
    try {
      return jsonwebtoken.verify(token.replace("Bearer ", ""), jwtSecretKey, {
        algorithms: ["HS256"],
      });
    } catch (error) {
      console.log(error);
      return false;
    }
  },
};

module.exports = jwt;
