const joi = require("joi");

const offset = [joi.string().required(), joi.number().required()];
const userAccount = joi.string().required();
const blogger_id = joi.number().required();
const fan_id = joi.number().required();

exports.getArticleListSchema = {
  query: {
    offset,
  },
};

exports.getUserArticleListSchema = {
  query: {
    userAccount,
  },
};

exports.getAuthorInfoSchema = {
  query: {
    blogger_id,
    fan_id,
  },
};

exports.insertFollowSchema = {
  body: {
    blogger_id,
    fan_id,
  },
};

exports.deleteFollowSchema = {
  body: {
    blogger_id,
    fan_id,
  },
};
