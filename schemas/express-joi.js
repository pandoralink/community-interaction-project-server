const Joi = require("joi");

const expressJoi = function (schemas, options = { strict: false }) {
  if (!options.strict) {
    // allowUnknown 允许提交未定义的参数项、stripUnknown 过滤掉那些未定义的参数项
    options = { allowUnknown: true, stripUnknown: true, ...options };
  }

  // 从 options 配置对象中，删除自定义的 strict 属性
  delete options.strict;

  return function (req, res, next) {
    ["body", "query", "params"].forEach((key) => {
      // 如果当前循环的参数项 schema 没有提供，则不执行对应的校验
      if (!schemas[key]) return;

      const schema = Joi.object(schemas[key]); // 挂载校验规则
      const { error, value } = schema.validate(req[key], options); // 内容校验

      if (error) {
        // 校验失败
        res.codeMsg(error.toString());
        throw error;
      } else {
        // 校验成功，把校验的结果重新赋值到 req 对应的 key 上
        req[key] = value;
      }
    });

    // 校验通过
    next();
  };
};

module.exports = expressJoi;
