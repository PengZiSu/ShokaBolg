import request from "@/utils/request";

//获取博客信息
export function getBlogInfo() {
  return request({
    url: "/info",
    method: "get",
  });
}

//上传访客信息
export function report() {
  return request({
    url: "/report",
    method: "get",
  });
}
