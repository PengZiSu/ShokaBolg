import request from "@/utils/request";
import useStore from "@/store";

export function getArticleList(pageQuery) {
  const { appStore } = useStore();
  if (appStore.local) {
    return getArticleListByLocal(pageQuery);
  } else {
    return getArticleListByNet(pageQuery);
  }
}

export function getArticle(articleId) {
  const { appStore } = useStore();
  if (appStore.local) {
    return getArticleByLocal(articleId);
  } else {
    return getArticleByNet(articleId);
  }
}

//推荐文章
export function getArticleFeatured() {
  return request({
    url: "/article/featured",
    method: "get",
  });
}

//点赞文章
export function likeArticle(articleId) {
  return request({
    url: `/article/${articleId}/like`,
    method: "post",
  });
}

/**
 * 获取网络文章列表
 * @param pageQuery 查询条件
 * @returns 文章列表
 */
export function getArticleListByNet(pageQuery) {
  request({
    url: "/article/list",
    method: "get",
    params: pageQuery,
  });
}

/**
 * 获取本地文章列表
 * @param pageQuery 查询条件
 * @returns 文章列表
 */
const getArticleListByLocal = (pageQuery) => {
  let p = new Promise((resolve) => {
    const { localStore } = useStore();
    resolve({
      status: 200,
      statusText: "OK",
      headers: {},
      config: {},
      data: {
        code: 200,
        msg: "success",
        flag: true,
        data: {
          recordList: localStore.articleList.slice(
            (pageQuery.current - 1) * pageQuery.size,
            pageQuery.current * pageQuery.size
          ),
          count: localStore.articleList.length,
        },
      },
    });
  });
  return p;
};

/**
 * 获取网络文章信息
 * @param articleId 文章id
 */
export function getArticleByNet() {
  return request({
    url: `/article/${articleId}`,
    method: "get",
  });
}

/**
 * 获取本地文章信息
 * @param articleId  文章id
 */
const getArticleByLocal = (articleId) => {
  let p = new Promise((resolve, reject) => {
    const { localStore } = useStore();
    const articleInfo = localStore.articleInfoList.find(
      (article) => article.id === articleId
    );
    if (!articleInfo) {
      reject("文章不存在");
    }
    resolve({
      status: 200,
      statusText: "OK",
      headers: {},
      config: {},
      data: {
        code: 200,
        msg: "success",
        flag: true,
        data: articleInfo,
      },
    });
  });
  return p;
};
