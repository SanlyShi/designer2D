import {getSDKConfig} from '@/apis/common'

//目前支持的平台:
//指纹科技  通用sdk
//ZWKJ  //SDK
// let isSDK = process.env.NODE_ENV == "development" ? false : !window.ZWKJ;
let isSDK = process.env.NODE_ENV == "development" ? false : !window.ZWKJ;
let SDKCONFIG;
export async function generateConfig({
  platform,
  code,
  storeCode,
  customGallery,
}) {

  const PLATFORM_ZWKJ = platform === 'ZWKJ'

  const sdkConfig = {
    platformIsZWKJ: PLATFORM_ZWKJ,
    platform: platform,
    upload: true,
    basic: {
      productSave: true, //是否支持保存产品
      addToCart: true, //是否支持加入购物车
      buyNow: true, //是否支持立即购买
    },
    product: {
      isSupportList: true, //是否支持列表
      designProductDetail: {
        productDetail: true, //是否显示详情
        productSize: true, //是否显示尺码
      }
    },
    gallery: {
      isEnable: true, //是否支持图库功能
      hasTemplate: true, //是否支持模板
    },
    background: {
      isEnable: true, //是否支持背景功能
    },
    text: {
      isEnable: true, //是否支持文字功能
    },
  }
  if(platform == 'xcxBackend'){
    sdkConfig.basic = {
      productSave: false, //是否支持保存产品
      addToCart: false, //是否支持加入购物车
      buyNow: false, //是否支持立即购买
      nextStep:true //是否开启下一步
    }
  }

  // 使用第三方图库接口(摄图网)
  if(customGallery){
    sdkConfig.customGallery = customGallery
  }

  if (PLATFORM_ZWKJ || platform == 'xcxBackend') {
    SDKCONFIG = sdkConfig
    return sdkConfig
  }

  const config = await getSDKConfig({customerCode: code, storeCode})
  const configData = config.data;
  sdkConfig.platform = configData.platform;
  sdkConfig.customerCode = code;
  sdkConfig.storeCode = storeCode;
  const pcDesign = JSON.parse(configData.pc_design);
  sdkConfig.basic.productSave = pcDesign.productSave
  sdkConfig.basic.addToCart = pcDesign.productAddCart;
  sdkConfig.basic.buyNow = pcDesign.productBuy; 
  sdkConfig.product.isSupportList = pcDesign.chooseProductFromDetail;
  sdkConfig.product.designProductDetail = JSON.parse(configData.design_product_detail);
  sdkConfig.gallery.isEnable = pcDesign.chooseDesign;
  sdkConfig.gallery.hasTemplate = configData.tmplate_ount>0;
  sdkConfig.background.isEnable = pcDesign.chooseBackground;
  sdkConfig.text.isEnable = pcDesign.addText;
  sdkConfig.upload = pcDesign.uploadImage;
  SDKCONFIG = sdkConfig
  return sdkConfig
}

function createApiByPlatform(platform) {
  const apiObj = {}
  if (platform === 'xcxBackend') {
    apiObj.uploadImgApi = '/pgc-itg/v1/c/upload'
    apiObj.getImgMaterialApi = '/pgc-itg/v1/gallery/action/page'
    apiObj.getImgLibraryApi = '/pgc-itg/v1/c/gallery/action/page'
    apiObj.getImgLibraryTemplateApi = '/pgc-itg/v1/c/template/action/page'
    apiObj.getTemplateDetial = '/pgc-itg/v1/c/template/'
  } 
  return apiObj;
}

export { SDKCONFIG, isSDK, createApiByPlatform }

 
