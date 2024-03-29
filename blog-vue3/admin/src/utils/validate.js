/**
 * 判断是否为外部链接
 * @param path 路径
 */
export const isExternal = (path) => {
  return /^(\/?https?:|mailto:|tel:)/.test(path);
};
