import request from "@/utils/request";

//获取文章归档
export function getArchiveList(pageQuery) {
  return request({
    url: "/article/archives/list",
    method: "get",
    params: pageQuery,
  });
}
