import request from "@/utils/request";

//修改用户密码
export function updatePassword(userForm) {
  return request({
    url: "/user/password",
    method: "put",
    data: userForm,
  });
}

//修改用户邮箱
export function updateEmail(emailForm) {
  return request({
    url: "/user/email",
    method: "put",
    data: emailForm,
  });
}

//修改用户头像
export function updateAvatar(avatar) {
  return request({
    url: "/user/avatar",
    method: "post",
    headers: { "content-type": "multipart/form-data" },
    data: avatar,
  });
}

//修改用户信息
export function updateUserInfo(userInfo) {
  return request({
    url: "/user/info",
    method: "put",
    data: userInfo,
  });
}
