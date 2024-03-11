import { createRouter, createWebHistory } from "vue-router";
import Layout from "@/layout/index.vue";

export const constantRoutes = [
  {
    path: "/redirect",
    component: Layout,
    meta: {
      hidden: true,
    },
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "登录",
    component: () => import("@/views/Login/index.vue"),
    meta: {
      hidden: true,
    },
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import("@/views/404/index.vue"),
    meta: {
      hidden: true,
    },
  },

  {
    path: "",
    component: Layout,
    redirect: "/index",
    children: [
      {
        path: "/index",
        name: "首页",
        meta: {
          title: "首页",
          icon: "dashboard",
          affix: true,
        },
        component: () => import("@/views/Index/index.vue"),
      },
    ],
  },
];

const router = createRouter({
  routes: constantRoutes,
  history: createWebHistory(),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

export default router;
