import request from "@/utils/request";

//修改密码

export function updateAdminPassword(password) {
  return request({
    url: "/admin/password",
    method: "put",
    data: password,
  });
}

//查看后台用户列表
export function getUserList(userQuery) {
  return request({
    url: "/user/list",
    method: "get",
    params: userQuery,
  });
}

//查看用户角色选择
export function getUserRoleList() {
  return request({
    url: "/user/role",
    method: "get",
  });
}

//修改用户
export function updateUser(userForm) {
  return request({
    url: "/user/admin/update",
    method: "put",
    data: userForm,
  });
}

//修改用户状态
export function updateUserStatus(userStatus) {
  return request({
    url: "/user/status",
    method: "put",
    data: userStatus,
  });
}
