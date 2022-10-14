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
} = require("../schemas/articleSchema");
const { getAuthorInfo } = require("../services/articleService");

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

module.exports = router;
