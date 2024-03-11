import request from "@/utils/request";

//查看操作日志
export function getOperationLogList(logQuery) {
  return request({
    url: "/log/operation",
    method: "get",
    params: logQuery,
  });
}

//删除操作日志
export function deleteOperation(ids) {
  return request({
    url: "/log/operation",
    method: "delete",
    data: ids,
  });
}

//查看异常日志
export function getExceptionLogList(logQuery) {
  return request({
    url: "/log/exception",
    method: "get",
    params: logQuery,
  });
}

//删除异常日志
export function deleteException(ids) {
  return request({
    url: "/log/exception",
    method: "delete",
    data: ids,
  });
}

//查看访问日志
export function getVisitLogList(visitQuery) {
  return request({
    url: "/log/visit",
    method: "get",
    params: visitQuery,
  });
}

//删除访问日志
export function deleteVisit(ids) {
  return request({
    url: "/log/visit",
    method: "delete",
    data: ids,
  });
}
