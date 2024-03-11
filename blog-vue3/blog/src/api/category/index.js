import request from "@/utils/request";
import useStore from "@/store";

export function getCategoryList() {
  const { appStore } = useStore();
  if (appStore.local) {
    return getCategoryListByLocal();
  } else {
    return getCategoryListByNet();
  }
}

export function getCategoryArticleList(articleQuery) {
  const { appStore } = useStore();
  if (appStore.local) {
    return getCategoryArticleListByLocal(articleQuery);
  } else {
    return getCategoryArticleListByNet(articleQuery);
  }
}

export function countCategoryArticles(articleQuery) {
  const { appStore } = useStore();
  if (appStore.local) {
    return countCategoryArticlesByLocal(articleQuery);
  } else {
    return countCategoryArticlesByNet(articleQuery);
  }
}

/**
 * 获取网络文章分类
 * @returns 文章分类
 */
export function getCategoryListByNet() {
  request({
    url: "/category/list",
    method: "get",
  });
}

/**
 * 获取本地文章分类
 * @returns 文章分类
 */
const getCategoryListByLocal = () => {
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
        data: localStore.categoryList,
      },
    });
  });
  return p;
};

/**
 * 获取网络分类文章
 * @param articleQuery 查询条件
 */
export function getCategoryArticleListByNet(articleQuery) {
  request({
    url: "/category/article",
    method: "get",
    params: articleQuery,
  });
}

/**
 * 获取本地分类文章
 * @param articleQuery 查询条件
 */
const getCategoryArticleListByLocal = (articleQuery) => {
  let p = new Promise((resolve, reject) => {
    const { localStore } = useStore();
    const articleConditionList = localStore.getArticlesByCategoryId(
      articleQuery.categoryId
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
 * 获取网络分类文章数量
 * @param articleQuery 查询条件
 */
export function countCategoryArticlesByNet(articleQuery) {
  request({
    url: "/category/article/count",
    method: "get",
    params: articleQuery,
  });
}

/**
 * 获取本地分类文章数量
 * @param articleQuery 查询条件
 */
const countCategoryArticlesByLocal = (articleQuery) => {
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
        data: localStore.getArticlesByCategoryId(articleQuery.categoryId)
          .articleConditionList.length,
      },
    });
  });
  return p;
};
