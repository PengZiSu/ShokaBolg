import request from "@/utils/request";

//获取博客信息
export function getBlogInfo() {
  return request({
    url: "/admin/info",
    method: "get",
  });
}

//上传博客信息
export function report() {
  return request({
    url: "/report",
    method: "post",
  });
}
