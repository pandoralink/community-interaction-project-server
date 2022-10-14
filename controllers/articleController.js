const articleService = require('../services/articleService')

exports.getArticleList = (req, res) => {
  articleService.getArticleList(req, res)
}

exports.getUserArticleList = (req, res) => {
  articleService.getUserArticleList(req, res)
}

exports.getAuthorInfo = (req, res) => {
  articleService.getAuthorInfo(req, res)
}

exports.insertFollow = (req, res) => {
  articleService.insertFollow(req, res)
}

exports.deleteFollow = (req, res) => {
  articleService.deleteFollow(req, res)
}