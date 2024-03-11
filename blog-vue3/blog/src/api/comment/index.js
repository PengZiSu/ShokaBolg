import request from "@/utils/request";

//查看最新评论
export function getRecentComments() {
  return request({
    url: "comment/recent",
    method: "get",
  });
}

//查看评论
export function getCommentList(commentQuery) {
  return request({
    url: "comment/list",
    method: "get",
    params: commentQuery,
  });
}

//查看回复评论
export function getReplyList(commentId, pageQuery) {
  return request({
    url: `comment/${commentId}/reply`,
    method: "get",
    params: pageQuery,
  });
}

//添加评论
export function addComment(commentForm) {
  return request({
    url: "/comment",
    method: "post",
    data: commentForm,
  });
}

//点赞评论
export function likeComment(commentId) {
  return request({
    url: `/comment/${commentId}/like`,
    method: "post",
  });
}
