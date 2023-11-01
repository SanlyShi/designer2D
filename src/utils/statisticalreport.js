import { SDKCONFIG } from "@/utils/sdkConfig";

//事件上报
function libSdkReport(reportName, reportParam) {
  // console.log("libSdkReport",reportName, reportParam);
  // console.log("SDKCONFIG",SDKCONFIG);
  // console.log("window.libSdk",window.libSdk);
  if (SDKCONFIG.platformIsZWKJ) {
    window &&
      window.libSdk &&
      window.libSdk.tracker.report(reportName, reportParam);
  } else {
    return false;
  }
}

// // 登陆等出;
// export function libSdkSetCode(param) {
//   // if (SDKCONFIG.platformIsZWKJ) {
//   //   window && window.libSdk && window.libSdk.tracker.setCode(param);
//   // } else {
//   //   return;
//   // }
// }

// // 设置公共属性;
// export function libSdkSetConfig(param) {
//   // if (SDKCONFIG.platformIsZWKJ) {
//   //   window && window.libSdk && window.libSdk.tracker.setConfig(param);
//   // } else {
//   //   return;
//   // }
// }

//页面曝光
function pageShow() {
  libSdkReport("designer_page_show", {
    designer_version_type: "专业",
  });
}

//点击保存按钮
function clickDesignSaveBtn() {
  libSdkReport("designer_save_btn_click");
}

//点击添加购物车按钮
function clickDesignAddCartBtn() {
  libSdkReport("designer_add_cart_btn_click");
}

//点击立即购买按钮
function clickDesignBuyBtn() {
  libSdkReport("designer_buy_btn_click");
}

//添加元素
function addDesignItem(designer_element_type) {
  libSdkReport("designer_element_add_click", {
    designer_element_type,
  });
}
//点击元素编辑按钮
function clickDesignItemEditBtn(designer_btn_title, designer_edit_type) {
  libSdkReport("designer_element_edit_btn_click", {
    designer_btn_title,
    designer_edit_type,
  });
}
//点击非元素按钮
function clickNotDesignItemBtn(designer_btn_name) {
  libSdkReport("designer_non_element_btn_click", {
    designer_btn_name,
  });
}

//异常出发
function designAlarm(designer_alarm_fuzzy_type,designer_alarm_is_stretch,designer_alarm_is_covered) {
  libSdkReport("designer_alarm_trigger", {
    designer_alarm_fuzzy_type,
    designer_alarm_is_stretch,
    designer_alarm_is_covered
  });
}

//埋点--类型判断
function biCommonFn(name,node){
    let position = ''
    const ele =  node
    if(node.length){
      position ='组合' 
    }else{
     position =ele && ele.type == "image"? ele.getAttrs().name.includes('isBg') ? '背景':'图片' :'文字' 
    }
    clickDesignItemEditBtn(name,position)
  }

//design 通用埋点
function designCommonBi(name,node){
  const biList={
    'basicsTile':"基础平铺",
    "Mirror":"镜像平铺",
    "XSpacedTile":"横向平铺",
    "YSpacedTile":"纵向平铺",
    'imgFull':'最大化设计',
    "imgAdaptFull":'铺满设计区域',
    'heightMaximization':'高度最大化',
    'widthMaximization':"宽度最大化",
  }
  biList[name] ? biCommonFn(biList[name],node) : ""

}

//文字 通用埋点
function textCommonBi(name){
  const biList = {
    'up':'图层上移',
    'down':'图层下移', 
     '1':'图层放大',
    '-1':'图层缩小',
    text1:'加粗',
    text2:"斜体",
    text5:"左对齐",
    text6:'居中对齐',
    text7:"右对齐",
    text8:"两端对齐"
  }
  biList[name] ? clickDesignItemEditBtn(biList[name],'文字'):''
}


export default {
  pageShow,
  clickDesignSaveBtn,
  clickDesignAddCartBtn,
  clickDesignBuyBtn,
  clickDesignItemEditBtn,
  clickNotDesignItemBtn,
  addDesignItem,
  designAlarm,
  biCommonFn,
  designCommonBi,
  textCommonBi
};
