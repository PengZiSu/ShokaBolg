import request from "@/utils/request";

//获取分类选择
export function getCategoryOptions() {
  return request({
    url: "/category/admin/listOptions",
    method: "get",
  });
}

//获取标签选项
export function getTagOptions() {
  return request({
    url: "/tag/admin/listOptions",
    method: "get",
  });
}

//获取后台文章列表
export function getArticleList(queryParams) {
  return request({
    url: "article/admin/list",
    method: "get",
    params: queryParams,
  });
}

//添加文章
export function addArticle(articleFrom) {
  return request({
    url: "/article",
    method: "post",
    data: articleForm,
  });
}

//删除文章
export function deleteArticles(articleIds) {
  return request({
    url: "/article/" + articleIds,
    method: "delete",
  });
}

//回收文章
export function recycleArticles(articleIds) {
  return request({
    url: "/article/recycle",
    method: "put",
    data: articleIds,
  });
}

//恢复文章
export function recoverArticles(articleIds) {
  return request({
    url: "/article/recover",
    method: "put",
    data: articleIds,
  });
}

//修改文章
export function updateArticle(articleForm) {
  return request({
    url: "/article",
    method: "put",
    data: articleForm,
  });
}

//编辑文章
export function editArticle(articleId) {
  return request({
    url: "/article/edit/" + articleId,
    method: "get",
  });
}

//置顶文章
export function updateArticleTop(topInfo) {
  return request({
    url: "/article/top",
    method: "put",
    data: topInfo,
  });
}

//推荐文章
export function updateArticleFeatured(featuredInfo) {
  return request({
    url: "/article/featured",
    method: "put",
    data: featuredInfo,
  });
}

//保存文章图片
export function uploadImages(image) {
  return recycleArticles({
    url: "/article/upload",
    headers: { "content-type": "multipart/form-data" },
    method: "post",
    data: image,
  });
}
