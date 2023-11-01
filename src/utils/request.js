import axios from "axios";
import sha1 from "crypto-js/sha1";
import { Message, MessageBox } from "element-ui";
import { showLoading, hideLoading } from "@/plugins/element/loading/loading.js";
import { getToken } from "@/utils/auth.js";
import { SDKCONFIG, isSDK } from "@/utils/sdkConfig";
import {GetQueryString} from '@/utils/utils';
let hasConfirm = false;
window.axios = axios;
// 创建axios实例

function getHeaders() {
  let stamp = new Date().getTime();
  // try {
  //   // 获取服务器时间，避免用户电脑时间跟服务器差异导致签名错误无法访问设计器
  //   const systime = await axios.get(`${process.env.NODE_ENV === 'development' ? '/api' : ''}/merchant-gw/api/sys/time`);
  //   stamp = systime?.data?.data || stamp;
  // } catch (error) {}
  const secret = "oj878:;;?@#-=UFfHFUwTs!SNJHUFp!{[d}";
  const nonce = Math.floor(Math.random() * 999999);
  const secretKey = secret + stamp + nonce;
  const sign = sha1(secretKey).toString();
  let token
  if (process.env.NODE_ENV === 'development') {
    token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJncm91cFR5cGUiOjIsImFwcFR5cGUiOjIsImlzU3VwZXJNYW5hZ2VyIjpmYWxzZSwiZ3JvdXBJZCI6MTMwODUzLCJjdXN0b21lcklkIjoxMzA4NTMsInNlc3Npb25JZCI6IjMzNjQ3YzY2N2M0YzQ1YTk5NjE4ODE1ODkxNDk0ZWU1IiwiaXNTVmlwIjp0cnVlLCJ1c2VySWQiOjEzMDg1MywicGxhdGZvcm0iOjMwLCJ1c2VybmFtZSI6IuWVhuWutuWQjuWPsF8xNzYyNTYxMjUyNyJ9.U0Aozkpkelropjj64EIGtf67tLtzowFZIiE2QYmKSUCLWrX80pl9YsQTURl0pwxuyxFQuYgPmMf-XkORnDfFVQ"
  }else {
    token = getToken()
  }
  return { stamp, nonce, sign, token };
}

function request(opts, javaApi) {
  let baseURL;

  if(process.env.NODE_ENV === 'development'){
    baseURL = process.env.VUE_APP_BASE_API
  } else {
    if (!window.ZWKJ) {
      baseURL = process.env.VUE_APP_ZWDC_PATH
    }
  }

  if (javaApi) {
    baseURL = process.env.VUE_APP_JAVA_API;
    if(javaApi == 'mock'){
      baseURL = process.env.VUE_APP_JAVA_API_MOCK;
    }
  }

  if (process.env.VUE_APP_JAVA_API.indexOf('test')>-1 && window.ZWKJ) {
    // const devOrigin = GetQueryString('devOrigin') || window.devOrigin
    const devOrigin = location.origin;
    baseURL = devOrigin;
    if(javaApi){
      baseURL = devOrigin + '/merchant-gw'
    }
  }
  
  let service = axios.create({
    baseURL,
    // timeout: 30000,
  });

  service.interceptors.request.use(
    (config) => {
      const { stamp, nonce, sign, token } = getHeaders(SDKCONFIG && SDKCONFIG.platform == 'xcxBackend');

      if(!isSDK || (SDKCONFIG && SDKCONFIG.platform == 'xcxBackend')){
        config.headers["sign"] = sign;
        config.headers["stamp"] = stamp;
        config.headers["nonce"] = nonce;
        config.headers["Authorization"] = 'Bearer ' + token;
      }

      if (opts.headers && opts.headers["Content-Type"]) {
        config.headers["Content-Type"] = opts.headers["Content-Type"];
      } else {
        config.headers["Content-Type"] =
          "application/x-www-form-urlencoded; charset=UTF-8";
      }

      if (SDKCONFIG && !SDKCONFIG.platformIsZWKJ && SDKCONFIG.platform != 'xcxBackend') {
        if (!config.params) config.params = {};
        if(javaApi != 'external'){
          config.params.customerCode = SDKCONFIG.customerCode;
          config.params.storeCode = SDKCONFIG.storeCode;
          config.params.lang = 1;
        }
      }
      // if (process.env.NODE_ENV !== "development") {
      //   config.headers["Cookie"] = getToken();
      // } else {
      //   config.headers["Cookie"] = "PHPSESSID=sktgcmg1qf66s1821pqt2ttrh1;_bl_uid=4wktFj0hly13zz0O2ghyx2F3emyC";
      // }
      return config;
    },
    (error) => {
      return error;
    }
  );

  service.interceptors.response.use(
    (response) => {
      // hideLoading();
      const res = response.data;
      if (res.type && res.size) {
        //下载文件
        return response;
      } else {
        if (res.code === "success" || res.status === 1000 || res.result_code == 200) {
          return res;
        } else {
          Message({
            message: res.msg,
            type: "error",
            duration: 3000,
          });
          return Promise.reject(res);
        }
      }
    },
    (error) => {
      const { response } = error;
      if (response) {
        errorHandle(response.data);
        return Promise.resolve(response.data);
      } else {
        Message({
          message: "网络连接异常,请稍后再试!",
          type: "error",
          duration: 3000,
        });
        return Promise.reject(error);
      }
    }
  );
  return service(opts);
}
function errorHandle(res) {
  const errorCode = res.code || res.status || res.result_code;
  // 状态码判断
  switch (errorCode) {
    case -10001:
    case -2:
    case '401':
      if(!hasConfirm){
        hasConfirm = true;
        if(window.common_loginDia){
          if(!SDKCONFIG || SDKCONFIG.platform != 'xcxBackend'){
            window.common_loginDia?.loginOut();
          }
        } else {
          MessageBox.confirm("用户失效，请重新登录？", "提示", {
            confirmButtonText: "去登录",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            window.location.href = "/frontend/login/index";
            hasConfirm = false;
          }).catch(() => {
            hasConfirm = false;
          });
        }
      } else {
        Message({
          message: res.msg,
          type: "error",
          duration: 3000,
        });
      }
      break;
    default:
      Message({
        message: res.msg ? res.msg : "网络连接错误",
        type: "error",
        duration: 3000,
      });
  }
}

export default request;
