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

  // 2、解密数据（注意👀：为了演示express-jwt包的使用，后续我们不会使用verify()方法）
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
