const { Pool } = require("../models/db");
const articleModel = require("../models/articleModel");
const { Result } = require("../types/index");
const { STATUS } = require("../utils/constant");

const articleService = {
  getArticleList: (req, res) => {
    const offset = req.query.offset ? Number(req.query.offset) * 10 : 0;
    Pool.query(articleModel.selectList, [offset], function (error, result) {
      if (error) throw error;
      res.send(new Result({ code: STATUS.success, data: result }));
    });
  },
  getUserArticleList: (req, res) => {
    Pool.query(
      articleModel.selectUserList,
      [req.query.userAccount],
      function (error, result) {
        if (error) throw error;
        res.send(new Result({ code: STATUS.success, data: result }));
      }
    );
  },
  getAuthorInfo: (req, res) => {
    const fanId = req.query.fan_id;
    const authorId = req.query.blogger_id;
    new Promise((resolve, reject) => {
      Pool.query(
        articleModel.selectRelate,
        [authorId, fanId],
        function (error, result) {
          if (error) reject(error);
          resolve(result.length ? true : false);
        }
      );
    })
      .then((relate) => {
        Pool.query(
          articleModel.selectFanTotal,
          [authorId],
          function (error, result) {
            if (error) throw error;
            res.send(
              new Result({
                code: STATUS.success,
                data: {
                  relate: relate,
                  fanTotal: result[0].total,
                },
              })
            );
          }
        );
      })
      .catch((err) => {
        console.error("服务器出错了" + err);
        res.send(new Result({ code: STATUS.error, info: "查询失败" }));
      });
  },
  insertFollow: (req, res) => {
    const { blogger_id, fan_id } = req.body;
    Pool.query(
      articleModel.insertFollow,
      [blogger_id, fan_id],
      function (error, result) {
        if (error) throw error;
        res.send(
          new Result({
            code: STATUS.success,
            info: "success",
          })
        );
      }
    );
  },
  deleteFollow: (req, res) => {
    const { blogger_id, fan_id } = req.body;
    Pool.query(
      articleModel.deleteFollow,
      [blogger_id, fan_id],
      function (error, result) {
        if (error) throw error;
        res.send(
          new Result({
            code: STATUS.success,
            info: "success",
          })
        );
      }
    );
  },
  getArticleDetail: (req, res) => {
    const { aid } = req.query;
    Pool.query(articleModel.getArticleDetail, [aid], function (error, result) {
      if (error) throw error;
      try {
        res.send(
          new Result({
            code: STATUS.success,
            info: "success",
            data: result && result.length && result.length > 0 && result[0],
          })
        );
      } catch (error) {
        console.log(error);
      }
    });
  },
};

module.exports = articleService;
