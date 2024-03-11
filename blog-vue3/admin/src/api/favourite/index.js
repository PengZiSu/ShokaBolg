import request from "@/utils/request";

//获取后台收藏夹列表
export function getFavouriteList(favouriteQuery) {
  return request({
    url: "/favourite/admin/list",
    method: "get",
    params: favouriteQuery,
  });
}

//获取收藏夹分类
export function getFavouriteClassifyList() {
  return request({
    url: "/favourite/admin/classify",
    method: "get",
  });
}

//添加收藏项
export function addFavourite(favouriteForm) {
  return request({
    url: "/favourite",
    method: "post",
    data: favouriteForm,
  });
}

//修改收藏项
export function updateFavourite(favouriteForm) {
  return request({
    url: "/favourite",
    method: "put",
    data: favouriteForm,
  });
}

//删除收藏项
export function deleteFavourites(favouriteIds) {
  return request({
    url: "/favourite/" + favouriteIds,
    method: "delete",
  });
}
