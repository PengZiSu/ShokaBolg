import request from "@/utils/request";

//查看后台留言列表
export function getMessageList(messageQuery) {
  return request({
    url: "/message/admin/list",
    method: "get",
    params: messageQuery,
  });
}

//删除留言
export function deleteMessage(messageIds) {
  return request({
    url: "/message",
    method: "delete",
    data: messageIds,
  });
}

//审核留言
export function updateMessageCheck(checkDTO) {
  return request({
    url: "/message/admin/check",
    method: "put",
    data: checkDTO,
  });
}
