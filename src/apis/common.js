import request from "@/utils/request";
const qs = require("qs");

export function getSDKConfig(data) {
  return request({
    url: `/designsdk/config?lang=1`,
    method: "get",
    params: data
  });
}

export function _getDesignerConfigure(data) {
  return request({
    url: "/v1/Gallery/getDesignerConfigure",
    method: "get",
    params: data,
  });
}

// 快捷键
export function _getDesignActionConfigs(){
  const path = "/pty-itg/v1/design/action_configs";
  return request({
    url: path,
    method: "get",
  }, true);
}

export function _updateShortcut(data) {
  return request({
    url: "/v1/QuickKey",
    method: "post",
    params: data,
  });
}

export function _saveQuickKey(data) {
  return request({
    url: "/v1/DesignQuickKey",
    method: "post",
    data: qs.stringify(data),
  });
}

export function _delSelfColor(data) {
  return request({
    url: `/v1/CustomerColor/${data.id}`,
    method: "delete",
    params: data,
  });
}
export function _addSelfColor(data) {
  return request({
    url: "/v1/CustomerColor",
    method: "post",
    data: qs.stringify(data),
  });
}

export function _addToCar(data) {
  return request({
    url: "/merchant/Cart/addCart",
    method: "post",
    data: qs.stringify(data),
    zwnotip: true
  });
}

export function _login(data) {
  return request({
    url: "/frontend/login/login",
    method: "post",
    data: qs.stringify(data),
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    },
    zwnotip: true
  })
}

export function _sendSmsCode(data) {
  return request({
    url: "/frontend/login/sendSmsCode",
    method: "post",
    data: qs.stringify(data),
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    },
    zwnotip: true
  })
}

export function _getQrcode(data) {
  return request({
    url: "/frontend/create/getQrcode",
    method: "get",
    params: data,
  });
}

export function _getLoginImg(data) {
  return request({
    url: "/frontend/create/getLoginImg",
    method: "get",
    params: data,
  });
}

// 设计器用户相关配置
export function _getCustomerConfigs(data) {
  return request({
    url: "/pty-itg/v1/design/customer_configs",
    method: "post",
    data: data,
    headers: { "Content-Type": "application/json" },
  }, true);
}