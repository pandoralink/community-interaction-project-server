const articleModel = {
  insertArticle: "insert into ev_articles set ?",
  countAll: "SELECT COUNT(*) AS total FROM ev_articles",
  // 获取文章列表
  selectList:
    "select new_id, new_owner_id, new_name, article_cover_url, user_id, user_name, user_account, user_head from new join (select user_id,user_name,user_account,user_head from user) as u on new_owner_id = u.user_id limit ?,10;",
  // 获取用户个人文章列表
  selectUserList:
    "select new_id, new_owner_id, new_name, article_cover_url, user_id, user_name, user_account, user_head from new join (select user_id,user_name,user_account,user_head from user where user_account = ?) as u on new_owner_id = u.user_id;",
  // 获取文章作者和当前用户的关系
  selectRelate: "select * from fans where blogger_id = ? and fan_id = ?;",
  // 获取粉丝总数
  selectFanTotal: "select count(*) as total from fans where blogger_id = ?;",
  // 增加关注
  insertFollow: "INSERT INTO fans(blogger_id,fan_id) VALUES(?,?);",
  // 取消关注
  deleteFollow: "DELETE FROM fans WHERE blogger_id = ? and fan_id = ?;",
  // 查询文章详情
  getArticleDetail: "select * from new where new_id = ?;",
  // 查询文章描述信息
  getArticleInfo: "select new_id, new_url, new_owner_id, new_name, article_cover_url from new where new_id = ?;",
};

module.exports = articleModel;
