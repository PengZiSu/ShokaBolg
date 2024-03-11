import request from "@/utils/request";

// 获取后台标签列表
export function getTagList(tagQuery) {
  return request({
    url: "/tag/admin/list",
    method: "get",
    params: tagQuery,
  });
}

//添加标签
export function addTag(tagForm) {
  return request({
    url: "/tag",
    method: "post",
    data: tagForm,
  });
}

//修改标签
export function updateTag(tagForm) {
  return request({
    url: "/tag",
    method: "put",
    data: tagForm,
  });
}

//删除标签
export function deleteTags(tagIds) {
  return request({
    url: "/tag/" + tagIds,
    method: "delete",
  });
}
