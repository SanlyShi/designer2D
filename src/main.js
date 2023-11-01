import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import { generateConfig, SDKCONFIG, isSDK } from "@/utils/sdkConfig";
import { _syncRandomCustomId } from "@/apis/sdk.js";
import { genLocalStorageKey } from "@/utils/utils";
import statisticalreport from "@/utils/statisticalreport";

import * as Sentry from "@sentry/vue";
import { BrowserTracing } from "@sentry/tracing";

Vue.config.productionTip = false;
import "./assets/style/reset.scss";
import "./assets/fonts/iconfont.js";

import "./plugins/element/element.js";
import "./directive/index.js";

const {customer_code, store_id, external_customer_id, origin, previewOrigin, gallery_api, xcxBackend} = getURLParameters(location.href)
function getURLParameters (url) {
  return (url.match(/([^?#=&]+)=([^&]*)/g) || []).reduce(
    (a, v) => (
      (a[v.slice(0, v.indexOf("="))] = v.slice(v.indexOf("=") + 1)), a
    ),
    {}
  );
}

let option;
if (isSDK || xcxBackend) {
  option = {
    origin,
    platform: xcxBackend?"xcxBackend":"SDK",
    storeInfo: {
      customerCode: xcxBackend?'':customer_code,
      storeCode: xcxBackend?'':store_id,
    },
    userInfo: {
      groupLevel: 1,
      code: external_customer_id,
      realname: "",
      username: "",
      isDesigner: false,
    },
    customGallery: {
      galleryApi: gallery_api || ''
    },
    isNewUser: true,
    uploadImgGuarantee: true,
    permission: {
      canBuyBottom: true,
      canAddBottom: true,
    },
    newUserDiscount: {
      hasNewUserRegisterDiscount: true,
    },
  };
  if (process.env.NODE_ENV === "development") {
    option = {
      platform: xcxBackend?"xcxBackend":"SDK",
      storeInfo: {
        customerCode: xcxBackend?'':'18022617167',
        storeCode: xcxBackend?'':'220116677',
      },
      userInfo: {
        groupLevel: 1,
        code: localStorage.getItem("afterLoginHandler") ? "1" : "",
        realname: "吴雪莲-svip2",
        username: "wuxuelian",
        isDesigner: false,
      },
      customGallery: {
        galleryApi: gallery_api || ''
        // galleryApi: "https://sandbox2.zhiwendiy.com/frontend/test/st",
      },
      isNewUser: true,
      uploadImgGuarantee: true,
      permission: {
        canBuyBottom: true,
        canAddBottom: true,
      },
      newUserDiscount: {
        hasNewUserRegisterDiscount: true,
      },
    };
  }
} else {
  option = {
    isLogin: window.isLogin,
    userInfo: {
      groupLevel: window.groupLevel,
      code: window.info_code,
      realname: window.info_realname,
      username: window.info_username,
      isDesigner: window.isDesigner,
      cartNum: window.cart_num,
    },
    isNewUser: window.isNewTaskUser,
    permission: {
      canBuyBottom: window.isBuyBottomTemplate,
      canAddBottom: window.addUserDefinedBottom,
      hasAuthUserDefined: window.hasAuthUserDefined,
      productAuth: window.product_auth, //是否有刊登权限
    },
    uploadImgGuarantee: window.CustomerAgreementVersionGallery,
    newUserDiscount: window.newUserDiscount,
    leftUserDefinedBottomNum: window.left_user_defined_bottom_num,
  };
  if (process.env.NODE_ENV === "development") {
    option = {
      platform: "ZWKJ",
      storeInfo: {
        customerCode: "",
        storeCode: "",
      },
      userInfo: {
        groupLevel: 1,
        code: localStorage.getItem("afterLoginHandler") ? "1" : "",
        realname: "吴雪莲-svip2",
        username: "wuxuelian",
        isDesigner: false,
        cartNum: 99,
      },
      isNewUser: true,
      uploadImgGuarantee: true,
      permission: {
        canBuyBottom: true,
        canAddBottom: true,
        productAuth: true,
      },
      newUserDiscount: {
        hasNewUserRegisterDiscount: true,
      },
    };
  }
}
(function () {
  if (!isSDK && !xcxBackend) {
    let script = window.document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://js-api.hicustom.com/libSDK@1.2.8/js-api.umd.js";
    window.document.getElementsByTagName("head")[0].appendChild(script);
    script.onload = function () {
      window && window.libSdk && window.libSdk.tracker.init({
        type: "sc",
        options: {
          code: option.userInfo.code, //当前账号code
        },
        init: {
          // log:true, // 调试阶段开启，控制台打印参数
        },
      });
      statisticalreport.pageShow()
    };
  }
})();
(async () => {
  const sdkConfig = await generateConfig({
    platform: option.platform || "ZWKJ",
    code: option.storeInfo ? option.storeInfo.customerCode : '',
    storeCode: option.storeInfo ? option.storeInfo.storeCode : '',
    previewOrigin,
    customGallery: option.customGallery,
  })
  statisticalreport.pageShow()

  Vue.prototype.$sdkConfig = sdkConfig
  Vue.prototype.$isLogin = !!option.userInfo.code


  Vue.prototype.$uploadImgGuarantee = !!option.uploadImgGuarantee;
  Vue.prototype.$OPTIONS = option;
  Vue.prototype.$statisticalreport = statisticalreport;

  statisticalreport.pageShow()

  // dsn: https://767b1d8be2284c8fbd79c9ae32f5d8c3@sentry.zhiwendiy.com/7   测试
  //      https://b15c9906d44145e48bc1c9ae43442bc7@sentry.hicustom.com/6  线上

  const envMap = {
    'test': {
      env: 'test',
      dsn: 'https://767b1d8be2284c8fbd79c9ae32f5d8c3@sentry.zhiwendiy.com/7'
    },
    'sandbox': {
      env: 'sandbox',
      dsn: 'https://767b1d8be2284c8fbd79c9ae32f5d8c3@sentry.zhiwendiy.com/7'
    },
    'production': {
      env: 'production',
      dsn: 'https://b15c9906d44145e48bc1c9ae43442bc7@sentry.hicustom.com/6'
    }
  }

  if (envMap[process.env.VUE_APP_BUILD_ENV]) {
    Sentry.init({
      Vue,
      dsn: envMap[process.env.VUE_APP_BUILD_ENV]?.dsn,
      integrations: [
        new BrowserTracing(),
      ],
      environment: envMap[process.env.VUE_APP_BUILD_ENV]?.env,
      tracesSampleRate: 1.0,
    });
  }

  new Vue({
    store,
    render: (h) => h(App),
  }).$mount("#ZWDesign");

  // if(isSDK){
  window.parent.postMessage(
    {
      type: "ZW_INIT",
      status: "SUCCESS",
    },
    option.origin
  );

  window.addEventListener("message", (event) => {
    if (event.data.type === "LOGIN") {
      Vue.prototype.$OPTIONS.userInfo.code = event.data.external_customer_id;
      Vue.prototype.$isLogin = !!event.code;
      window.parent.postMessage(
        {
          type: "ZW_LOGIN",
          status: "SUCCESS",
        },
        option.origin
      );
      // SDK登录成功后需要同步随机的第三方会员Id，关联真实的用户Id, 用于图片上传归档
      const localStorageKey = genLocalStorageKey("customerRandomCode");
      let randomCode = localStorage.getItem(localStorageKey);
      if (randomCode) {
        _syncRandomCustomId({
          old_external_customer_id: randomCode,
          external_customer_id: event.data.external_customer_id,
        }).then((res) => {
          localStorage.removeItem(localStorageKey);
        });
      }
    }
  });
})();
