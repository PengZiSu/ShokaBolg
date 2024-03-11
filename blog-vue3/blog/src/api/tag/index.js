import request from "@/utils/request";
import useStore from "@/store";

export function getTagList() {
  const { appStore } = useStore();
  if (appStore.local) {
    return getTagListByLocal();
  } else {
    return getTagListByNet();
  }
}

export function getTagArticleList(articleQuery) {
  const { appStore } = useStore();
  if (appStore.local) {
    return getTagArticleListByLocal(articleQuery);
  } else {
    return getTagArticleListByNet(articleQuery);
  }
}

export function countTagArticles(articleQuery) {
  const { appStore } = useStore();
  if (appStore.local) {
    return countTagArticlesByLocal(articleQuery);
  } else {
    return countTagArticlesByNet(articleQuery);
  }
}

/**
 * 获取网络文章标签
 * @returns 文章标签
 */

export function getTagListByNet() {
  request({
    url: "/tag/list",
    method: "get",
  });
}

/**
 * 获取本地文章标签
 * @returns 文章标签
 */
const getTagListByLocal = () => {
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
        data: localStore.tagList,
      },
    });
  });
  return p;
};

/**
 * 获取网络标签文章
 * @param articleQuery 查询条件
 */

export function getTagArticleListByNet(articleQuery) {
  request({
    url: "/tag/article",
    method: "get",
    params: articleQuery,
  });
}

/**
 * 获取本地标签文章
 * @param articleQuery 查询条件
 */
const getTagArticleListByLocal = (articleQuery) => {
  let p = new Promise((resolve, reject) => {
    const { localStore } = useStore();
    const articleConditionList = localStore.getArticlesByTagId(
      articleQuery.tagId
    );
    if (!articleConditionList) {
      reject();
    }

    articleConditionList.articleConditionList =
      articleConditionList.articleConditionList.slice(
        (articleQuery.current - 1) * articleQuery.size,
        articleQuery.current * articleQuery.size
      );

    resolve({
      status: 200,
      statusText: "OK",
      headers: {},
      config: {},
      data: {
        code: 200,
        msg: "success",
        flag: true,
        data: articleConditionList,
      },
    });
  });
  return p;
};

/**
 * 获取网络标签文章数量
 * @param articleQuery 查询条件
 */
export function countTagArticlesByNet(articleQuery) {
  request({
    url: "/tag/article/count",
    method: "get",
    params: articleQuery,
  });
}

/**
 * 获取本地标签文章数量
 * @param articleQuery 查询条件
 */
const countTagArticlesByLocal = (articleQuery) => {
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
        data: localStore.getArticlesByTagId(articleQuery.tagId)
          .articleConditionList.length,
      },
    });
  });
  return p;
};
