/**
 * 数字增加前缀0，例如：01；001；0001；
 * 如果原数字长度大于保留位数，则返回原数字的字符串类型
 * @param n 原数字
 * @param m 保留位数，默认两位
 * @returns 字符串
 */
export const numberPrefixZero = (n: number, m: number = 2) => {
  const _n = n.toString();
  if (_n.length > m) return _n;
  const num = (Array(m).join('0') + n).slice(-m);
  return num;
};

/**
 * 时间戳差值
 * @param start_at 开始时间戳
 * @param end_at 结束时间戳
 * @returns 字符串：00：00：00
 */
export const timestampDiffer = (start_at: number, end_at: number) => {
  let _differ = end_at >= start_at ? end_at - start_at : start_at - end_at; // 时间差
  let hh = 0; // 时
  let mm = 0; // 分
  let ss = 0; // 秒
  // 小于一分钟
  if (_differ > 0 && _differ <= 60000) {
    ss = Math.floor(_differ / 1000);
  }
  // 大于一分钟，小于一小时
  else if (_differ > 60000 && _differ <= 3600000) {
    mm = Math.floor(_differ / 60000);
    ss = Math.floor((_differ - 60000 * mm) / 1000);
  }
  // 大于一小时
  else if (_differ > 3600000) {
    hh = Math.floor(_differ / 3600000);
    mm = Math.floor((_differ - 3600000 * hh) / 60000);
    ss = Math.floor((_differ - 3600000 * hh - 60000 * mm) / 1000);
  }
  return numberPrefixZero(hh) + ':' + numberPrefixZero(mm) + ':' + numberPrefixZero(ss);
};
