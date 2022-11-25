const joi = require("joi");

const rid = joi.number().required();
const content = joi.string().required();
const title = joi.string().required();
const headUrl = joi.string().required().allow("");
const contentUrl = joi.string().required().allow("");
const aid = joi.number().required();
const uid = joi.number().required();
const type = joi.number().valid(1, 2).required();

exports.sendSchema = {
  body: {
    rid,
    content,
    title,
    headUrl,
    contentUrl,
    aid,
    uid,
    type,
  },
};
