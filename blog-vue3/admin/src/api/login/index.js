import request from "@/utils/request";

//登录
export function login(loginForm) {
  return request({
    url: "/login",
    method: "post",
    data: loginForm,
  });
}

/** 注销登录 */
export function logout() {
  return request({
    url: "/logout",
    method: "get",
  });
}

/** 获取后台用户信息 */
export function getAdminUserInfo() {
  return request({
    url: "/admin/getAdminUserInfo",
    method: "get",
  });
}

//获取后台路由
export function getRouters() {
  return request({
    url: "/admin/getRouters",
    method: "get",
  });
}
