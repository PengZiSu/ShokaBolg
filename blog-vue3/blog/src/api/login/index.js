import request from "@/utils/request";

//登录
export function login(loginForm) {
  return request({
    url: "/login",
    method: "post",
    data: loginForm,
  });
}

//注册
export function register(registerForm) {
  return request({
    url: "/register",
    method: "post",
    data: registerForm,
  });
}

//退出登录
export function logout() {
  return request({
    url: "/logout",
    method: "get",
  });
}

//获取用户信息
export function getUserInfo() {
  return request({
    url: "/getUserInfo",
    method: "get",
  });
}

//发送邮箱验证码
export function sendCode(username) {
  return request({
    url: "/sendCode",
    method: "get",
    params: {
      username: username,
    },
  });
}
