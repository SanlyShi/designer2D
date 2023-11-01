import request from "@/utils/request";
import {SDKCONFIG} from '@/utils/sdkConfig'
import qs from 'qs'


function getURLParameters (url) {
  return (url.match(/([^?#=&]+)=([^&]*)/g) || []).reduce(
    (a, v) => (
      (a[v.slice(0, v.indexOf("="))] = v.slice(v.indexOf("=") + 1)), a
    ),
    {}
  );
}

export function getProductType(data) {
  return request({
    url: "/v1/productType/EXVGL2",
    method: "get",
    params: data,
  });
}

export function productSave(data) {
  let url = SDKCONFIG.platformIsZWKJ ? '/v1/product' : '/designsdk/product'
  if(SDKCONFIG.platform == 'xcxBackend') url = '/v1/product'
  return request({
    url,
    method: "post",
    data: qs.stringify(data)
  });
}

// 下载效果图
export function downloadDetailImg(data) {
  return request({
    url: "/merchant/customerProduct/downloadDetailImg",
    method: "post",
    data: qs.stringify(data)
  });
}

// 预览效果图下载弹窗
export function previewDownload(data) {
  return request({
    url: "/merchant/customerProduct/previewDownload",
    method: "post",
    data: qs.stringify(data)
  });
}

// 保存模板
export function productTemplateSave(data){
  const {comModel} = getURLParameters(location.href)
  let path = '/v1/galleryTemplate'
  if(SDKCONFIG.platform == 'xcxBackend'){
    path = '/pgc-itg/v1/template'
  }
  if(SDKCONFIG.platform == 'xcxBackend'){
    if(comModel){
      data['code'] = comModel
    }
    data['channel_id'] = 2
    data['cfg'] = data.productConfig
    let bool = JSON.parse(data.productConfig).cfgs.length > 0
    delete data.platform
    delete data.source_type
    delete data.productConfig
    if(bool){
      return  request({
        url: path,
        method: "put",
        data: data,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      },'java');
    }else{
      return new Promise((resolve)=>{
        resolve(false)
      })
    }
  }else{
    return request({
      url: path,
      method: "post",
      data: qs.stringify(data)
    });
  }
}

// 获取模板数据
export function getProductTemplate(data){
  let path = `/v1/galleryTemplate/${data.code}`;
  if(!SDKCONFIG.platformIsZWKJ) path = `/designsdk/template/${data.code}`
  if(SDKCONFIG.platform == 'xcxBackend') path = `/pgc-itg/v1/c/template/detail`;
  if(SDKCONFIG.platform == 'xcxBackend'){
    let param = {
      codes: [data.code]
    }
    return  request({
      url: path,
      method: "post",
      data: param,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    },'java');
  }else{
    return request({
      url: path,
      method: "get",
      data: qs.stringify(data)
    });
  }
}