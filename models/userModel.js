const userModel = {
  checkByUsername:
    "select * from user where user_account = ? and user_password = ?",
  addUser: "insert into ev_users set ?",
  getUserinfo: "select * from user WHERE user_id = ?;",
};

module.exports = userModel;
