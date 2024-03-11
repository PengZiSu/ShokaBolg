import request from "@/utils/request";

//获取菜单列表
export function getMenuList(menuQuery) {
  return request({
    url: "/menu/list",
    method: "get",
    params: menuQuery,
  });
}

//获取菜单树
export function getMenuTree() {
  return request({
    url: "/menu/getMenuTree",
    method: "get",
  });
}

//获取菜单选项树
export function getMenuOptionTree() {
  return request({
    url: "/menu/getMenuOptionTree",
    method: "get",
  });
}

//添加菜单
export function addMenu(menuForm) {
  return request({
    url: "/menu",
    method: "post",
    data: menuForm,
  });
}

//修改菜单
export function updateMenu(menuForm) {
  return request({
    url: "/menu",
    method: "post",
    data: menuForm,
  });
}

//删除菜单
export function deleteMenu(menuId) {
  return request({
    url: `/menu/${menuId}`,
    method: "delete",
  });
}
