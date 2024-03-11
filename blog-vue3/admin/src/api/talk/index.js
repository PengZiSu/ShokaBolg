import request from "@/utils/request";

//查看后台说说列表
export function getTalkList(talkQuery) {
  return request({
    url: "/talk/admin/list",
    method: "get",
    params: talkQuery,
  });
}

//上传说说图片
export function uploadTalkCover(image) {
  return request({
    url: "/talk/upload",
    method: "post",
    data: image,
  });
}

//编辑说说
export function editTalk(talkId) {
  return request({
    url: `/talk/edit/${talkId}`,
    method: "get",
  });
}

//添加说说
export function addTalk(talkForm) {
  return request({
    url: "/talk",
    method: "post",
    data: talkForm,
  });
}

//修改说说
export function updateTalk(talkForm) {
  return request({
    url: "/talk",
    method: "put",
    data: talkForm,
  });
}

//删除说说
export function deleteTalk(talkId) {
  return request({
    url: `/talk/${talkId}`,
    method: "delete",
  });
}
