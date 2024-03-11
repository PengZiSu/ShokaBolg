import { constantRoutes } from "@/router";
import { getRouters } from "@/api/login";
import { defineStore } from "pinia";
import ParentView from "@/components/ParentView.vue";
import Layout from "@/layout/index.vue";
import InnerLink from "@/layout/components/InnerLink.vue";
import { isExternal } from "@/utils/validate";

// 匹配views里面所有的.vue文件
const modules = import.meta.glob("../../views/**/**.vue");

const usePermissionStore = defineStore("usePermissionStore", {
  state: () => ({
    routes: [],
    addRoutes: [],
    sidebarRouters: [],
  }),

  actions: {
    /**
     * 设置路由
     * @param routes 路由
     */
    setRoutes(routes) {
      this.addRoutes = routes;
      this.routes = constantRoutes.concat(routes);
    },

    /**
     * 设置侧边栏路由
     * @param routes 路由
     */
    setSidebarRouters(routes) {
      this.sidebarRouters = routes;
    },

    /**
     * 生成路由
     */
    generateRoutes() {
      return new Promise((resolve, reject) => {
        //后端请求路由数据
        getRouters()
          .then(({ data }) => {
            const sData = JSON.parse(JSON.stringify(data.data));
            const rData = JSON.parse(JSON.stringify(data.data));
            const sidebarRoutes = filterAsyncRoutes(sData);
            const rewriteRouters = filterAsyncRoutes(rData, true);
            this.setRoutes(rewriteRouters);
            this.setSidebarRouters(constantRoutes.concat(sidebarRoutes));
            resolve(rewriteRouters);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
  getters: {},
});

/** 遍历后台传来的路由字符串，转换为组件对象 */
const filterAsyncRoutes = (asyncRouterMap, type) => {
  const res = [];
  asyncRouterMap.forEach((route) => {
    const tmpRoute = { ...route };

    // 判断类型
    if (tmpRoute.component === "Layout") {
      tmpRoute.component = Layout;
    } else if (tmpRoute.component === "ParentView") {
      tmpRoute.component = ParentView;
    } else if (tmpRoute.component === "InnerLink") {
      tmpRoute.component = InnerLink;
    } else {
      tmpRoute.component = loadView(tmpRoute.component);
    }
    // 给链接前加上'/'防止报错
    if (isExternal(tmpRoute.path)) {
      tmpRoute.path = `/${tmpRoute.path}`;
    }
    // 若包含子路由，则再依次转换添加
    if (
      tmpRoute.children !== null &&
      tmpRoute.children &&
      tmpRoute.children.length
    ) {
      tmpRoute.children = filterAsyncRoutes(tmpRoute.children);
    } else {
      delete tmpRoute.children;
      delete tmpRoute.redirect;
    }
    res.push(tmpRoute);
  });
  return res;
};

/**
 * 筛选子路由（包括子路由的子路由）
 * @param childrenMap 子路由
 * @param lastRouter 上一级路由
 */

const filterChildren = (childrenMap, lastRouter) => {
  let children = [];
  childrenMap.forEach((el) => {
    if (el.children && el.children.length) {
      if (el.component === "ParentView" && !lastRouter) {
        el.children.forEach((c) => {
          c.path = el.path + "/" + c.path;
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c));
            return;
          }
          children.push(c);
        });
        return;
      }
    }
    if (lastRouter) {
      el.path = lastRouter.path + "/" + el.path;
    }
    children = children.concat(el);
  });
  return children;
};

/** 获取路由对应的组件实例 */
const loadView = (routeStr) => {
  let res;
  for (const path in modules) {
    const dir = path.split("views/")[1].split("/index.vue")[0];
    if (dir === routeStr) {
      res = () => modules[path]();
    }
  }
  return res;
};

export default usePermissionStore;
