const express = require("express");
const router = express.Router();
const expressJoi = require("../schemas/express-joi");
const articleController = require("../controllers/articleController");
const {
  getArticleListSchema,
  getUserArticleListSchema,
  getAuthorInfoSchema,
  insertFollowSchema,
  deleteFollowSchema,
  getArticleDetailSchema,
  getArticleInfoSchema,
} = require("../schemas/articleSchema");

router.get(
  "/article",
  expressJoi(getArticleListSchema),
  articleController.getArticleList
);

router.get(
  "/userArticle",
  expressJoi(getUserArticleListSchema),
  articleController.getUserArticleList
);

router.get(
  "/authorInfo",
  expressJoi(getAuthorInfoSchema),
  articleController.getAuthorInfo
);

router.post(
  "/insertFollow",
  expressJoi(insertFollowSchema),
  articleController.insertFollow
);

router.post(
  "/deleteFollow",
  expressJoi(deleteFollowSchema),
  articleController.deleteFollow
);

router.get(
  "/getArticleDetail",
  expressJoi(getArticleDetailSchema),
  articleController.getArticleDetail
);

router.get(
  "/getArticleInfo",
  expressJoi(getArticleInfoSchema),
  articleController.getArticleInfo
);

module.exports = router;
