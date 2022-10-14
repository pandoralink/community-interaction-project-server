/**
 * 返回类
 * @param {{code: number, info: string, data: Object}} option
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
