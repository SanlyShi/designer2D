import request from "@/utils/request";
import {SDKCONFIG} from '@/utils/sdkConfig'
// 获取字体选项
export function _getFontFamily() {
  let path = "/v1/FontFamily" + "?mediaType=json"
  if(!SDKCONFIG.platformIsZWKJ) path = "/designsdk/font-family";
  if(SDKCONFIG.platform == 'xcxBackend') path = "/v1/FontFamily" + "?mediaType=json"
  return request({
    url: path,
    method: "get",
  });
}
