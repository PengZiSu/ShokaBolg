import request from "@/utils/request";

//获取收藏夹列表
export function getFavouriteList() {
  return request({
    url: "/favourite/list",
    method: "get",
  });
}
