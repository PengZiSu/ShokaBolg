import request from "@/utils/request";

//获取后台分类列表
export function getCategoryList(categoryQuery) {
  return request({
    url: "/category/admin/list",
    method: "get",
    params: categoryQuery,
  });
}

//添加分类
export function addCategory(categoryForm) {
  return request({
    url: "/category",
    method: "post",
    data: categoryForm,
  });
}

//修改分类
export function updateCategory(categoryForm) {
  return request({
    url: "/category",
    method: "put",
    data: categoryForm,
  });
}

//删除分类
export function deleteCategories(categoryIds) {
  return request({
    url: "/category/" + categoryIds,
    method: "delete",
  });
}
