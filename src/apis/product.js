import request from "@/utils/request";
import {SDKCONFIG} from '@/utils/sdkConfig'
const qs = require("qs");

// 获取默认分类
// export function _getProductTypeCategory(data) {
//   let path = '/v1/productTypeCategory';
//   if(!SDKCONFIG.platformIsZWKJ) path = '/designsdk/product-type/categories'
//   return request({
//     url: path,
//     method: "get",
//     params: data,
//   });
// }

// 获取自定义分类
// export function _getCustomerProductTypeCategory(data) {
//   return request({
//     url: "/v1/CustomerProductTypeCategory",
//     method: "get",
//     params: data,
//   });
// }

// 获取搜索结果(默认分类)
// export function _getDefaultProductList(data, cg) {
//   let path = "/v1/productTypeCategory/" + (cg || 0);
//   if(!SDKCONFIG.platformIsZWKJ) path = '/designsdk/product-type'
//   return request({
//     url: path,
//     method: "get",
//     params: data,
//   });
// }

// 获取搜索结果(自定义分类)
// export function _getCustomProductList(data, cg) {
//   return request({
//     url: "/v1/CustomerProductTypeCategory/" + (cg || 0),
//     method: "get",
//     params: data,
//   });
// }

// 从java获取默认分类
export function _getProductTypeCategoryFromJava(data) {
  let path = '/pty-itg/v1/categorys';
  if(!SDKCONFIG.platformIsZWKJ) path = '/designsdk/pty-itg/categorys';
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
  }, SDKCONFIG.platformIsZWKJ ? true : false);
}
}

// 从java获取自定义分类
export function _getCustomerProductTypeCategoryFromJava(data) {
  return request({
    url: "/pty-itg/v1/customer_categorys",
    method: "get",
    params: data,
  }, true);
}

// 获取搜索结果(按分页)
export function _getProductListFromJava(data){
  let path = "/pty-itg/v1/action/page";
  if(SDKCONFIG.platformIsZWKJ || SDKCONFIG.platform == 'xcxBackend'){
    if(SDKCONFIG.platform == 'xcxBackend'){
      data.channel_ids = [2]
    }
    return request({
      url: path,
      method: "post",
      data: data,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    }, 'java');
  } else {
    path = "/designsdk/pty-itg/list";
    return request({
      url: path,
      method: "get",
      params: data,
    });
  }
}

// 获取搜索结果(按分类)
export function _getCategoryProductListFromJava(data){
  return request({
    url: "/pty-itg/v1/action/category/page",
    method: "post",
    data: data,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  }, true);
}

// 获取产品详情(基础详情)
// export function _getProductInfoByCode(data) {
//   let path = "/v1/DesignProductType/" + (data.code ? data.code : (data.comProduct==1 ? 0 : 'xxxxxx')) + "?is_custom=1";
//   if(!SDKCONFIG.platformIsZWKJ) path = `/designsdk/product-type/${data.code ? data.code : 'xxxxxx'}`;
//   return request({
//     url: path,
//     method: "get",
//     params: data,
//   });
// }

//获取空白产品基础信息
export function _getProductBaseInfo(data) {
  let path = "/pty-itg/v1/" + (data.code ? data.code : (data.comProduct==1 ? 0 : 'xxxxxx')) + "?is_custom=1";
  if(!SDKCONFIG.platformIsZWKJ) path = `/designsdk/pty-itg/base`;
  if(SDKCONFIG.platform == 'xcxBackend')path = "/pty-itg/v1/" + (data.code ? data.code : (data.comProduct==1 ? 0 : 'xxxxxx')) + "?is_custom=1";
  return request({
    url: path,
    method: "get",
    params: data,
  }, (SDKCONFIG.platformIsZWKJ ||  SDKCONFIG.platform == 'xcxBackend' ) ? true : false)
}

//@@@ 获取3d模型信息接口
export function _get3dModelInfo(data) {
  let path = "/pty-itg/v1/3d/models/" + (data.code ? data.code : (data.comProduct==1 ? 0 : 'xxxxxx')) + "?is_custom=1";
  if(!SDKCONFIG.platformIsZWKJ) path = `/designsdk/pty-itg/3d_models`;
  if(SDKCONFIG.platform == 'xcxBackend') path = "/pty-itg/v1/3d/models/" + (data.code ? data.code : (data.comProduct==1 ? 0 : 'xxxxxx')) + "?is_custom=1";
  return request({
    url: path,
    method: "get",
    params: data,
  }, (SDKCONFIG.platformIsZWKJ ||  SDKCONFIG.platform == 'xcxBackend' ) ? true : false);
}

//@@@ 获取部件spu，包装，标签信息接口
export function _getPartPackInfo(data) {
  let path = "/pty-itg/v1/parts/" + (data.code ? data.code : (data.comProduct==1 ? 0 : 'xxxxxx')) + "?is_custom=1";
  if(SDKCONFIG.platformIsZWKJ || SDKCONFIG.platform == 'xcxBackend' ){
    return request({
      url: path,
      method: "get",
      params: data,
    }, true);
  } else {
    path = `/designsdk/pty-itg/parts`;
    data.product_type_code = data.code;
    delete data.code;
    return request({
      url: path,
      method: "get",
      params: data,
    }, false);
  }
}

//@@@ 获取 推荐产品列表
// export function _getCommonFactoryProduct(data) {
//   return request({
//     url: "/v1/designInfo/getCommonFactoryProduct",
//     method: "get",
//     params: data,
//   });
// }

//@@@ 获取 生产商商品列表
// export function _getCommonCatIdProduct(data) {
//   return request({
//     url: "/v1/designInfo/getCommonCatIdProduct",
//     method: "get",
//     params: data,
//   });
// }

//@@@ 获取工厂信息
// export function _getFactoryInfo(data) {
//   return request({
//     url: "/v1/designInfo/getFactoryInfo",
//     method: "get",
//     params: data,
//   });
// }

//@@@ 获取fba相关信息
export function _getFbaInfo(data) {
  return request({
    url: "/v1/designInfo/getFbaInfo",
    method: "get",
    params: data,
  });
}

// 获取产品详情(弹窗内容)
// export function _getProductDetailByCode(data) {
//   return request({
//     url: "/v1/productType/getProductTypeInfo",
//     method: "get",
//     params: data,
//   });
// }

// 根据产品code获取产品信息
// export function _getProductByCode(data) {
//   return request({
//     url: "/v1/productType/" + data.code + "?is_custom=1",
//     method: "get",
//     params: data,
//   });
// }

// 根据产品code获取产品信息,返回错误时页面不提示
// export function _getProductByCodeWithoutTips(data) {
//   return request({
//     url: "/v1/productType/" + (data.code || 'xxxxxx') + "?is_custom=1&default=1",
//     method: "get",
//     params: data,
//     zwnotip: true,
//   });
// }

// 获取保存记录
export function _getSaveRecord(data) {
  return request({
    url: "/v1/Product",
    method: "get",
    params: data,
  });
}

// 获取保存记录
export function _getRecordByCode(code) {
  const url = SDKCONFIG.platformIsZWKJ ? `/v1/Product/${code}?ft=designer` : `/designsdk/product/${code}?ft=designer`;
  return request({
    url,
    method: "get",
  });
}

// 判断产品是否有购买和自定义按钮权限
export function _isSupportBaseplate(data) {
  return request({
    url: "/productType/item/isSupportBaseplate",
    method: "post",
    params: data
  });
}

// 判断空白产品拿样权限
export function _getSampleAuth(data) {
  return request({
    url: "/v1/productType/getProductTypeSampleAuth",
    method: "get",
    params: data
  });
}


//关联并替换产品
export function getConvertProductInfo(data) {
  return request({
    url: "/merchant/order/getConvertProductInfo",
    method: "get",
    params: data
  });
}

// 收藏商品
export function _productCollect(data) {
  return request({
    url: "/merchant/productType/batchCategory",
    method: "post",
    data: qs.stringify(data)
  });
}

// 取消收藏商品
export function _productCollectCancel(data) {
  return request({
    url: "/merchant/productType/batchCancelCategory",
    method: "post",
    data: qs.stringify(data)
  });
}

// 空白产品各个面的相关图接口
export function _getProductViews(data){
  let path = "/pty-itg/v1/views/" + data.code;
  if(SDKCONFIG.platformIsZWKJ || SDKCONFIG.platform == 'xcxBackend' ){
    return request({
      url: path,
      method: "get",
    }, true);
  } else {
    path = `/designsdk/pty-itg/views`;
    return request({
      url: path,
      method: "get",
      params: data
    }, false);
  }
}

// 空白产品各个颜色的相关图接口
export function _getProductDetailEffect(data){
  let path = "/pty-itg/v1/color_detail_effect_image_setting/" + data.code;
  if(SDKCONFIG.platformIsZWKJ || SDKCONFIG.platform == 'xcxBackend'){
    return request({
      url: path,
      method: "get",
    }, true);
  } else {
    path = `/designsdk/pty-itg/color_detail_effect_image_setting`;
    return request({
      url: path,
      method: "get",
      params: data
    }, false);
  }
}

// 空白产品详情接口
export function _getProductDetail(data){
  const path = "/pty-itg/v1/detail/" + data.code;
  return request({
    url: path,
    method: "get",
    params: data,
  }, true);
}

// 空白产品详情细节图接口
export function _getProductDetailImages(data){
  const path = "/pty-itg/v1/detail/images/" + data.code;
  return request({
    url: path,
    method: "get",
    params: data,
  }, true);
}

// 空白产品包装规格
export function _getProductPackages(data){
  const path = "/pty-itg/v1/packages/" + data.code;
  return request({
    url: path,
    method: "get",
    params: data,
  }, true);
}

// 空白产品尺码说明
export function _getSizeSaid(data){
  const path = "/pty-itg/v1/sizes/" + data.code;
  return request({
    url: path,
    method: "get",
    params: data,
  }, true);
}

// 空白产品价格阶梯
export function _getProductPrices(data){
  let path = "/pty-itg/v1/prices/info/" + data.code;
  if(!SDKCONFIG.platformIsZWKJ && SDKCONFIG.platform != 'xcxBackend' ) {
    path = "/designsdk/pty-itg/prices";
    data = {product_type_codes: [data.code]}
  }
  if(SDKCONFIG.platform == 'xcxBackend'){
    if(data.id){
    path = "/pty-itg/v1/c/prices";
    let product_type_id_list = [data.id]
    return request({
      url: path,
      method: "post",
      data: {product_type_id_list},
      headers: { "Content-Type": "application/json; charset=utf-8" },
    }, 'java');
    }
  }else{
    return request({
      url: path,
      method: "get",
      params: data,
    }, (SDKCONFIG.platformIsZWKJ ||  SDKCONFIG.platform == 'xcxBackend' ) ? true : false);
  }
}

// 空白产品搜索项静态信息接口
export function _getProductSearchCondition(){
  const path = "/pty-itg/v1/design/search_conditions";
  return request({
    url: path,
    method: "get",
  }, true);
}
