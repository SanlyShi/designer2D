import request from "@/utils/request";
import { SDKCONFIG } from '@/utils/sdkConfig'
const qs = require("qs");

export function _getPrivatePhotos(data) {
  let path = "/v1/Gallery/PrivatePhotos"
  if(!SDKCONFIG.platformIsZWKJ) path = "/designsdk/gallery/private-photos"
  if(SDKCONFIG.platform == 'xcxBackend') path = `/pgc-itg/v1/c/gallery/action/page`;
  if(SDKCONFIG.platform == 'xcxBackend'){
    let obj = {
      page:1,
      page_size:30,
      type:[1,2,9],
      status:1,
      is_private:true,
      sort:[{
        sort_by:'position',
        sort_type:2
      },
      {
          sort_by: "id",
          sort_type: 2
      }]
    }
    return request({
      url: path,
      method: "post",
      data: obj,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    },'java');

  }else{
    return request({
      url: path,
      method: "get",
      params: data,
    });
  }
}

export function _uploadImg(data) {
  let path = "/v1/Gallery"
  if(!SDKCONFIG.platformIsZWKJ) path = `/designsdk/gallery`;
  if(SDKCONFIG.platform == 'xcxBackend') path = "/pgc-itg/v1/c/upload"
  if(SDKCONFIG.platform == 'xcxBackend'){
    if(data.get('gallery_type') == 1){
      data.set('gallery_type',9)
    }
    return request({
      url: path,
      method: "post",
      data: data,
      headers: { "Content-Type": "multipart/form-data" },
    },'java');
  }else{
    return request({
      url: path,
      method: "post",
      data: data,
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
}

export function _saveCustomerAgreement() {
  return request({
    url: "/merchant/index/saveCustomerAgreement?type=3",
    method: "get",
    headers: { "Content-Type": "application/json" },
  });
}

export function _imgSizeIsOverService() {
  return request({
    url: `/merchant/account/isOverService?${new Date().getTime()}`,
    method: "get"
  });
}