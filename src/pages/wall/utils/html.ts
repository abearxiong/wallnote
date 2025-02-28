/**
 * 存在html标签
 * @param str
 * @returns
 */
export function isHTML(str) {
  // 使用正则表达式检查是否存在 HTML 标签
  return /<[^>]+>/i.test(str);
}
