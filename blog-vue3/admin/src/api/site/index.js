import request from "@/utils/request";

//获取网站配置
export function getSiteConfig() {
  return request({
    url: "/site",
    method: "get",
  });
}

//修改网站配置
export function updateSiteConfig(siteConfig) {
  return request({
    url: "/site",
    method: "put",
    data: siteConfig,
  });
}

//上传图片
export function uploadSiteImg(image) {
  return request({
    url: "/site/upload",
    method: "post",
    headers: { "content-type": "multipart/form-data" },
    data: image,
  });
}
