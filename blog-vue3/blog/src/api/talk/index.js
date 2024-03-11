import request from "@/utils/request";

//查看说说
export function getTalk(talkId) {
  return request({
    url: `/talk/${talkId}`,
    method: "get",
  });
}

//查看首页说说
export function getTalkHomeList() {
  return request({
    url: "/talk/listHome",
    method: "get",
  });
}

//查看说说列表
export function getTalkList(pageQuery) {
  return request({
    url: "/talk/list",
    method: "get",
    params: pageQuery,
  });
}

//点赞说说
export function likeTalk(talkId) {
  return request({
    url: `/talk/${talkId}/like`,
    method: "post",
  });
}
