import request from "@/utils/request";

//查看留言列表
export function getMessageList() {
  return request({
    url: "/message/list",
    method: "get",
  });
}

//添加留言
export function addMessage(messageForm) {
  return request({
    url: "/message",
    method: "post",
    data: messageForm,
  });
}
