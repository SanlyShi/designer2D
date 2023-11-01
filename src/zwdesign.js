import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import { generateConfig, SDKCONFIG} from '@/utils/sdkConfig'
import { _syncRandomCustomId } from '@/apis/sdk.js'
import { genLocalStorageKey } from "@/utils/utils";

Vue.config.productionTip = false;
import "./assets/style/reset.scss";
import "./assets/fonts/iconfont.js";

import "./plugins/element/element.js";
import './directive/index.js'


class ZWDesign {
  constructor(option, cb) {
    if (!ZWDesign.instance) {
      ZWDesign.renderDom(option, cb);
      ZWDesign.instance = this;
    }
    return ZWDesign.instance;
  }
  // 渲染vue
  static async renderDom(option, cb) {
    const sdkConfig = await generateConfig({
      platform: option.platform || "ZWKJ",
      code: option.storeInfo ? option.storeInfo.customerCode : '',
      storeCode: option.storeInfo ? option.storeInfo.storeCode : ''
    })

    Vue.prototype.$sdkConfig = sdkConfig
    Vue.prototype.$isLogin = !!option.userInfo.code


    Vue.prototype.$uploadImgGuarantee = !!option.uploadImgGuarantee
    Vue.prototype.$OPTIONS = option;

    new Vue({
      store,
      render: (h) => h(App),
    }).$mount(option.containers);

    window.parent.postMessage({
      type: 'ZW_INIT',
      status: 'SUCCESS'
    }, option.origin)
    window.addEventListener('message', event => {
      if (event.data.type === 'LOGIN') {
        Vue.prototype.$OPTIONS.userInfo.code = event.data.external_customer_id
        Vue.prototype.$isLogin = !!event.code
        window.parent.postMessage({
          type: 'ZW_LOGIN',
          status: 'SUCCESS'
        }, option.origin)
        // SDK登录成功后需要同步随机的第三方会员Id，关联真实的用户Id, 用于图片上传归档
        const localStorageKey = genLocalStorageKey('customerRandomCode');
        let randomCode = localStorage.getItem(localStorageKey);
        if(randomCode){
          _syncRandomCustomId({
            old_external_customer_id: randomCode,
            external_customer_id: event.data.external_customer_id
          }).then(res => {
            localStorage.removeItem(localStorageKey);
          })
        }
      }
    })
  }
  // 初始化
  static init(option, cb) {
    if (!this.instance) {
      this.instance = new ZWDesign(option, cb);
    }
    return this.instance;
  }
}

window.ZWDesign = ZWDesign;
export default ZWDesign;
