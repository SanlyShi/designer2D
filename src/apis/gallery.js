import request from "@/utils/request";
import { SDKCONFIG } from '@/utils/sdkConfig'
const qs = require("qs");

export function _getGalleryCategory(data) {
  let path = '/v1/DesignGalleryCategory';
  if(!SDKCONFIG.platformIsZWKJ) path = '/designsdk/gallery/categories'
  if(SDKCONFIG.platform == 'xcxBackend') {
    return new Promise((resolve)=>{
      resolve({
        data:[]
      })
    })
  }else{
    return request({
      url: path,
      method: "get",
      params: data,
    });
  }
}

export function _getCustomerGalleryCategory(data) {
  return request({
    url: `/v1/CustomerGalleryCategory`,
    method: "get",
    params: data,
  });
}

// 我的图片列表, isExternal是否使用摄图网接口
export function _getGallery(data, isExternal=false) {
  let path = `/v1/Gallery/${data.cgId}`;
  if(isExternal){
    path = SDKCONFIG.customGallery.galleryApi
  }
  if(!SDKCONFIG.platformIsZWKJ) path = `/designsdk/gallery`;
  //xcx 小程序后台获取图片列表
  if(data.is_material){
    //素材
    if(SDKCONFIG.platform == 'xcxBackend') path = `/pgc-itg/v1/gallery/action/page`;
  }else{
    //图片
    if(SDKCONFIG.platform == 'xcxBackend') path = `/pgc-itg/v1/c/gallery/action/page`;
  }
  if(SDKCONFIG.platform == 'xcxBackend'){
    let types,is_portal,sort;
    sort = [{
      sort_by:'position',
      sort_type:2
    },
    {
        sort_by: "id",
        sort_type: 2
    }]
    if(!data.type){
      data.type = 1
    }
    types = [data.type]
    if(data.type == 1 && data.is_public){
      types = [1,9]
    }
    if(data.type == 1 && !data.is_public){
      types = [1,9]
    }
    if(data.type == 2 && !data.is_public){
      types = [2,9]
    }
    if(data.type == 2 && data.is_public){
      types = [2,9]
    }
    if(data.keyword && data.type == 2 && data.is_public){
      is_portal = true
      sort.unshift({
        sort_by: "score",
        sort_type: 2
      })
    }else{
      is_portal = true
    }
    let obj = {
      page:data.page,
      page_size:data.pageSize,
      types,
      include_zh_name:true,
      keyword:data.keyword,
      is_private:data.is_public?false:true,
      sort,
      is_portal,
      status:1
    }
    if(data.is_public){
      obj['lang_type'] = 'zh'
    }
    if(!data.is_public){
      delete obj.is_portal
    }
    if(data.is_material && data.type == 1 && data.is_public){
      obj.types = [1,9]
      obj.sort = [{
        sort_by: "combine",
        sort_type: 2
      }]
    }
    if(data.is_material && data.type == 2 && data.is_public){
      obj.types = [2,9]
      obj.sort = [{
        sort_by: "combine",
        sort_type: 2
      }]
    }
    return request({
      url: path,
      method: "post",
      data: obj,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    },'java');
  }
  else{
    return request({
      url: path,
      method: "get",
      params: data,
    },isExternal ? 'external' : false);
  }
}

// 模板素材、收藏图片列表
export function _galleryTemplate(data, isCollect) {
  let path = `/v1/galleryTemplate${isCollect ? '?isCollect=1' : ''}`;
  if(!SDKCONFIG.platformIsZWKJ) path = `/designsdk/template`;
  //xcx 小程序后台获取模版列表
  if(SDKCONFIG.platform == 'xcxBackend') path = `/pgc-itg/v1/template_relation/action/page`;
  if(SDKCONFIG.platform == 'xcxBackend'){
    let obj = {}
    obj['product_type_id'] = data.product_type_id
    obj['page'] = 1
    obj['page_size'] = 30
    obj['type'] = data.type
    obj['keyword'] = data.keyword
    return request({
      url: path,
      method: "post",
      data: obj,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    },'java');
  }
  else{
    return request({
      url: path,
      method: "get",
      params: data,
    });
  }
}

export function _getGalleryInfoDesc(data) {
  return request({
    url: `/v1/Gallery/${data.id}`,
    method: "get",
    params: data.data,
  });
}

export function _getRender() {
  let path = `/v1/Render`;
  if(!SDKCONFIG.platformIsZWKJ) path = `/designsdk/render`;
  if(SDKCONFIG.platform == 'xcxBackend') path = `/v1/Render`;
  return request({
    url: path,
    method: "get",
  });
}

export function _changeImgStyle(data) {
  let path = `/v1/Render/${data.code}`;
  if(!SDKCONFIG.platformIsZWKJ) path = `/designsdk/render/${data.code}`;
  if(SDKCONFIG.platform == 'xcxBackend') path = `/v1/Render/${data.code}`;
  return request({
    url: path,
    method: "get",
    params: data.params,
  });
}

export function _getPhotoDetail(data) {
  let path = `/v1/Gallery/PhotoDetail?photo_id=${data.galleryId}`;
  if(!SDKCONFIG.platformIsZWKJ) path = `/designsdk/gallery/photo-detail?code=${data.galleryId}`;
  if(SDKCONFIG.platform == 'xcxBackend') path = `/v1/Gallery/PhotoDetail?photo_id=${data.galleryId}`;
  return request({
    url: path,
    method: "get",
  });
}

// 收藏图库
export function _galleryCollect(data) {
  return request({
    url: "/merchant/customerGallery/batchCategory",
    method: "post",
    data: qs.stringify(data)
  });
}

// 取消收藏图库
export function _galleryCollectCancel(data) {
  return request({
    url: "/merchant/customerGallery/batchCancelCategory",
    method: "post",
    data: qs.stringify(data)
  });
}

// 收藏模板
export function _templateCollect(data) {
  return request({
    url: "/merchant/galleryTemplate/batchCategory",
    method: "post",
    data: qs.stringify(data)
  });
}

// 取消收藏模板
export function _templateCollectCancel(data) {
  return request({
    url: "/merchant/galleryTemplate/batchCancelCategory",
    method: "post",
    data: qs.stringify(data)
  });
}

// 获取裁切图形
export function _getCuttingList(data) {
  return request({
    url: "/v1/cuttingMasks",
    method: "get",
  });
}
