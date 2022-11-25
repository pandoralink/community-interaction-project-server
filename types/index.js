/**
 * 返回类
 * @param {{code: number, info: string, data: Object}} option 配置项
 * @param {number} option.code 响应代码
 * @param {string} option.info 响应信息
 * @param {Object} option.data 响应数据
 */
function Result(option) {
  const { code = 0, info = "", data = {} } = option;
  this.code = code;
  this.message = info instanceof Error ? info.message : info;
  this.data = data;
}

module.exports = {
  Result,
};
