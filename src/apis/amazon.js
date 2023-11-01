import request from "@/utils/request";
const qs = require("qs");

// 亚马逊定制产品
export function _amazonOrder(data) {
  return request({
    url: "/v1/order",
    method: "get",
    params: data
  });
}

// 下载亚马逊定制产品数据
export function downloadAmazonCustomData(data) {
  return request({
    url: "/merchant/order/downloadAmazonCustomData",
    method: "post",
    data: qs.stringify(data)
  });
}