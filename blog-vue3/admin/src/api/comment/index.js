import request from "@/utils/request";

//查看后台评论
export function getCommentList(commentQuery) {
  return request({
    url: "/comment/admin/list",
    method: "get",
    params: commentQuery,
  });
}

//删除评论
export function deleteComment() {
  return request({
    url: "/comment",
    method: "delete",
    data: commentIds,
  });
}

//审核评论
export function updateCommentCheck(checkDTO) {
  return request({
    url: "/comment/admin/check",
    method: "put",
    data: checkDTO,
  });
}
