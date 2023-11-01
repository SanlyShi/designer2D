import request from "@/utils/request";
const qs = require("qs");

// SDK同步随机会员id与登录会员id, 用于我的图片列表登录后归档
export function _syncRandomCustomId(data) {
  return request({
    url: '/designsdk/customer/initialization',
    method: "post",
    params: data,
  });
}