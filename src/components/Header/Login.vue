<template>
  <div>
    <el-dialog
      :width="loginImg ? '750px' : '430px'"
      custom-class="login-pop"
      title
      :visible="true"
      :show-close="false"
      :modal-append-to-body="true"
      :destroy-on-close="true"
      @close="close"
    >
      <div class="login-container">
        <img :src="loginImg" class="login-banner" v-if="loginImg" />
        <div class="login-form">
          <!-- <div class="login-brand">永久免费</div> -->
          <div class="login-title">
            立即登录 免费体验
            <p class="desc" v-if="loginType=='smsCode'">未注册手机号将自动创建账号</p>
          </div>
          <i class="iconfont iconclose-bold close-btn" @click="close"></i>
          <div v-show="loginType=='account'">
            <div class="form-item mt37">
              <input
                type="text"
                placeholder="用户名/邮箱/手机"
                class="form-input"
                v-model="form.username"
                maxlength="30"
                @focus="handleFocus"
                @blur="handleBlur"
                @input="notSpaceInput($event, 'username')"
              />
            </div>
            <div class="error-msg mt5" v-if="formError.username">{{formError.username}}</div>
            <div class="form-item mt15">
              <input
                type="password"
                placeholder="请输入登录密码"
                class="form-input"
                v-model="form.password"
                maxlength="20"
                @focus="handleFocus"
                @blur="handleBlur"
                @input="notSpaceInput($event, 'password')"
              />
            </div>
            <div class="error-msg mt5" v-if="formError.password">{{formError.password}}</div>
            <div class="logintype-switch mt15"><a @click="changeLoginType('smsCode')">注册即送新人免费拿样券</a></div>
            <div class="no-captcha mt15">
              <dynamic-source src="//g.alicdn.com/sd/ncpc/nc.js?t=2015052012" @loaded="initCaptcha('login')"></dynamic-source>
              <div id="Captcha"></div>
              <input type="text" v-model="form.token" hidden />
              <input type="text" v-model="form.sig" hidden />
              <input type="text" v-model="form.csessionid" hidden />
            </div>
            <div class="error-msg mt5" v-if="formError.captcha">{{formError.captcha}}</div>
          </div>
          <div v-show="loginType=='smsCode'">
            <div class="form-item mt5">
              <input
                type="text"
                placeholder="请输入手机号码"
                class="form-input"
                :class="{error: smsFormError.mobile && !smsFormError.fromServer}"
                v-model="smsForm.mobile"
                maxlength="11"
                @focus="handleFocus"
                @blur="handleBlur('mobile')"
                @input="checkMobileInput"
              />
            </div>
            <div style="position:relative" v-if="smsFormError.mobile">
              <div class="error-msg mt2" style="position: absolute;">{{smsFormError.mobile}}</div>
            </div>
            <div class="no-captcha mt20">
              <dynamic-source src="//g.alicdn.com/sd/ncpc/nc.js?t=2015052012" @loaded="initCaptcha('smsCode')"></dynamic-source>
              <div id="smsCaptcha"></div>
              <input type="text" v-model="smsForm.token" hidden />
              <input type="text" v-model="smsForm.sig" hidden />
              <input type="text" v-model="smsForm.csessionid" hidden />
            </div>
            <div style="position:relative" v-if="smsFormError.captcha">
              <div class="error-msg mt2" style="position: absolute;">{{smsFormError.captcha}}</div>
            </div>
            <div class="smscode-row mt20">
              <div class="form-item">
                <input
                  type="text"
                  placeholder="验证码"
                  class="form-input"
                  :class="{error: smsFormError.smsCode && !smsFormError.fromServer}"
                  v-model="smsForm.smsCode"
                  maxlength="6"
                  @focus="handleFocus"
                  @blur="handleBlur('smsCode')"
                />
              </div>
              <a class="smscode-btn" :class="{disabled: isSmsCodeDisabled}" @click="getSmsCode">
                <template v-if="smsCodeSendTime>0">{{smsCodeSendTime}}S</template>
                <template v-else>获取验证码</template>
              </a>
            </div>
            <div style="position:relative" v-if="smsFormError.smsCode">
              <div class="error-msg mt2" style="position: absolute;">{{smsFormError.smsCode}}</div>
            </div>
            <div class="logintype-switch mt12"><a @click="changeLoginType('account')">账号密码登录</a></div>
          </div>
          <a class="login-btn mt15" @click="login">登 录</a>
        <div class="other-link" v-if="loginType=='account'">
          <a class="forgot" href="/frontend/findPassword" target="_blank">忘记密码？</a>
          <a v-if="newUserDiscount && newUserDiscount.hasNewUserRegisterDiscount" style="color: #e32d19;"  href="/frontend/login/reg?loginType=reg')">新人注册领888大礼包</a>
          <a v-else class="register" href="/frontend/login/reg?loginType=reg')">免费注册</a>
        </div>
        <div class="login-tips mt10" v-if="loginType=='smsCode'">
          登录即同意
          <a href="https://www.hicustom.com/frontend/about/serviceClause" target="_blank" class="blue o8">《指纹平台商户服务协议》</a>、
          <a href="https://www.hicustom.com/frontend/about/legalDeclaration" target="_blank" class="blue o8">《指纹平台法律声明》</a>、
          <a href="https://www.hicustom.com/frontend/about/privacyPolicy" target="_blank" class="blue o8">《指纹平台隐私条款》</a>
        </div>
          <div class="other-method mt30">
            使用其它方式登录：
            <div>
              <a href="/frontend/login/beforeBind?op=qq" class="login-qq mr20">
                <i class="iconfont iconqq1 mr3"></i>QQ
              </a>
              <a href="/frontend/login/beforeBind?op=wx" class="login-wx">
                <i class="iconfont iconweixing mr3"></i>微信
              </a>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 滑动验证弹窗 -->
    <el-dialog
      :visible.sync="isShowVerifyPop"
      title="滑动验证"
      width="390px"
      top="36px"
      custom-class="smsverify-pop"
      :show-close="true"
      :modal-append-to-body="false"
      :destroy-on-close="true"
    >
      <div class="content">  
        <div class="title">请向右滑动验证，确定后获取手机验证码。</div>
        <dynamic-source src="//g.alicdn.com/sd/ncpc/nc.js?t=2015052012" @loaded="initCaptcha('smsCode')"></dynamic-source>
        <div class="mt10 captcha-slider" id="smsCaptcha"></div>
        <input type="text" v-model="smsVerify.token" hidden />
        <input type="text" v-model="smsVerify.sig" hidden />
        <input type="text" v-model="smsVerify.csessionid" hidden />
        <div class="error-msg mt5">{{smsVerifyErrorMsg}}</div>
      </div>
      <div class="footer mt20">
        <a class="mr15" @click="isShowVerifyPop=false">取消</a>
        <a class="save" @click="smsVerfiyConfirm">确定</a>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Vue from "vue";
import dynamicSource from "@/utils/dynamicSource";
Vue.use(dynamicSource);
import eventBus from "@/utils/eventBus.js";
import { _login, _sendSmsCode, _getLoginImg } from "@/apis/common.js";
import { genLocalStorageKey } from "@/utils/utils";
export default {
  data() {
    return {
      loginType: 'smsCode', //account或smsCode
      isLoading: false,
      // 账号登录
      form: {
        username: "",
        password: "",
        token: "",
        sig: "",
        sessionid: "",
      },
      formError: {
        username: '',
        password: '',
        captcha: '',
      },
      // 验证码登录
      smsForm: {
        mobile: '',
        smsCode: '',
        token: '',
        sig: '',
        sessionid: '',
      },
      smsFormError: {
        mobile: '',
        smsCode: '',
        fromServer: false,
        captcha: ''
      },
      isSmsCodeDisabled: true,
      smsCodeSendTime: 0,
      // 短信验证码滑块验证
      isShowVerifyPop: false,
      smsVerify: {
        token: "",
        sig: "",
        sessionid: "",
      },
      smsVerifyErrorMsg: '',
      newUserDiscount: this.$OPTIONS.newUserDiscount
    };
  },
  computed: {
    loginImg(){
      return this.$store.state.loginImg;
    }
  },
  methods: {
    initCaptcha_new() {
      let self = this;
      AWSC.use("nc", function (state, module) {
        window.nc = module.init({
          appkey: "FFFF0N000000000074F9",
          scene: "nc_login",
          renderTo: "Captcha",
          upLang: {
            cn: {
              SLIDE: "请按住滑块，拖动到最右边",
              SUCCESS: "验证通过",
              ERROR:
                '网络不给力，请<a href="javascript:__nc.reset()">点击刷新</a>',
              FAIL:
                '哎呀，出错了，点击<a href="javascript:__nc.reset()">刷新</a>再来一次',
            },
          },
          success: function (data) {
            let ncToken = [
              "FFFF0N000000000074F9",
              new Date().getTime(),
              Math.random(),
            ].join(":");
            self.$set(self.form, "token", ncToken);
            self.$set(self.form, "sig", data.sig);
            self.$set(self.form, "sessionid", data.sessionId);
          },
          fail: function (failCode) {
            window.console && console.log(failCode);
          },
          error: function (errorCode) {
            window.console && console.log(errorCode);
          },
        });
      });
    },
    initCaptcha(type) {
      let self = this;
      var nc_token = [
        "FFFF0N000000000074F9",
        new Date().getTime(),
        Math.random(),
      ].join(":");
      var NC_Opt = {
        renderTo: type=='login' ? "#Captcha" : '#smsCaptcha',
        appkey: "FFFF0N000000000074F9",
        scene: "nc_login",
        token: nc_token,
        customWidth: 300,
        trans: { key1: "code0" },
        elementID: ["usernameID"],
        is_Opt: 0,
        language: "cn",
        isEnabled: true,
        timeout: 3000,
        times: 5,
        apimap: {},
        callback: function (data) {
          if(type=='login'){
            self.$set(self.form, "token", nc_token);
            self.$set(self.form, "sig", data.sig);
            self.$set(self.form, "sessionid", data.csessionid);
            self.$set(self.formError, 'captcha', '');
          } else if(type=='smsCode'){
            // self.$set(self.smsVerify, "token", nc_token);
            // self.$set(self.smsVerify, "sig", data.sig);
            // self.$set(self.smsVerify, "sessionid", data.csessionid);
            self.$set(self.smsForm, "token", nc_token);
            self.$set(self.smsForm, "sig", data.sig);
            self.$set(self.smsForm, "sessionid", data.csessionid);
            self.$set(self.smsFormError, 'captcha', '');
          }
          // console.log('ccccc => ', self.form, self.smsForm);
        },
      };
      var nc = new noCaptcha(NC_Opt);
      nc.upLang("cn", {
        _startTEXT: "请按住滑块，拖动到最右边",
        _yesTEXT: "验证通过",
        _error300:
          '哎呀，出错了，点击<a href="javascript:__nc.reset()">刷新</a>再来一次',
        _errorNetwork:
          '网络不给力，请<a href="javascript:__nc.reset()">点击刷新</a>',
      });
      if(type == 'login'){
        this.CaptchaSlider = nc;
      } else if(type == 'smsCode'){
        this.SmsCaptchaSlider = nc;
      }
      return nc;
    },
    // 屏蔽不可见字符输入
    notSpaceInput(e, key) {
      this.form[key] = this.form[key].replace(/[ ]/g, "");
    },
    changeLoginType(type){
      this.loginType = type;
    },
    getSmsCode(){
      // this.isShowVerifyPop = true;
      // this.smsVerifyErrorMsg = '';
      // this.$set(this.smsVerify, "token", "");
      // this.$set(this.smsVerify, "sig", "");
      // this.$set(this.smsVerify, "sessionid", "");
      if(!this.smsForm.token || !this.smsForm.sig || !this.smsForm.sessionid){
        this.$set(this.smsFormError, 'captcha', '请滑动验证');
      } else {
        this._getSmsCode();
      }
    },
    async _getSmsCode(){
      // let params = Object.assign({
      //   mobile: this.smsForm.mobile,
      //   module: 'SmsLogin',
      // }, this.smsVerify);
      let params = {
        mobile: this.smsForm.mobile,
        module: 'SmsLogin',
        token: this.smsForm.token,
        sig: this.smsForm.sig,
        sessionid: this.smsForm.sessionid
      }
      _sendSmsCode(params).then(ret=>{
        this.$message({ message: "验证码已发送至您的手机" });
        this.isSmsCodeDisabled = true;
        this.smsCodeSendTime = 60;
        this.smsCodeTimeCount();
      }).catch(err=>{
        this.$set(this.smsForm, "token", "");
        this.$set(this.smsForm, "sig", "");
        this.$set(this.smsForm, "sessionid", "");
        this.SmsCaptchaSlider.reload();
        if(err.status == -2000){
          this.$set(this.smsFormError, 'smsCode', err.msg)
        } else {
          this.$set(this.smsFormError, 'mobile', err.msg)
        }
      })
    },
    // 验证码发送倒计时
    smsCodeTimeCount(){
      if(this.smsCodeSendTime <=0){
        clearTimeout(this.smsCodeTimer);
        this.isSmsCodeDisabled = false;
        this.$set(this.smsForm, "token", "");
        this.$set(this.smsForm, "sig", "");
        this.$set(this.smsForm, "sessionid", "");
        this.SmsCaptchaSlider.reload();
        return;
      }
      this.smsCodeTimer = setTimeout(()=>{
        this.smsCodeSendTime--;
        this.smsCodeTimeCount();
      }, 1000);
    },
    async login() {
      // this.$emit("clickLogin");
      eventBus.$emit("beforeLoginHandler"); //未登录保存设计
      if (this.isLoading) return;
      if(this.loginType == 'account'){
        this.accountLogin();
      } else {
        this.smsCodeLogin();
      }
    },
    // 账号登录
    async accountLogin(){
      this.$set(this.formError, 'username', '');
      this.$set(this.formError, 'password', '');
      this.$set(this.formError, 'captcha', '');
      this.$set(this.formError, 'fromServer', false);
      if (this.form.username == "") {
        this.$set(this.formError, 'username', '请输入帐号');
        return false;
      }
      if (this.form.password == "") {
        this.$set(this.formError, 'password', '请输入密码');
        return false;
      }
      if (this.form.password.length < 4) {
        this.$set(this.formError, 'password', '密码格式不正确！长度为6-20个字符');
        return false;
      } else if (!this.form.token || !this.form.sig || !this.form.sessionid) {
        this.$set(this.formError, 'captcha', '请滑动验证');
        return false;
      }
      this.isLoading = true;
      _login(
        Object.assign(this.form, {
          referer: location.href,
        })
      )
        .then((ret) => {
          // this.$emit("close");
          const localStorageKey = genLocalStorageKey('simply');
          localStorage.setItem(localStorageKey, 'false');
          this.close();
          this.isLoading = false;
          // location.href = ret.data && ret.data.url ? ret.data.url : '/merchant/index/index';
          location.reload();
        })
        .catch((err) => {
          this.isLoading = false;
          this.$set(this.formError, 'password', err.msg);
          this.CaptchaSlider.reload();
          this.$set(this.form, "token", "");
          this.$set(this.form, "sig", "");
          this.$set(this.form, "sessionid", "");
        });
    },
    // 短信验证码登录
    async smsCodeLogin(){
      this.$set(this.smsFormError, 'mobile', '');
      this.$set(this.smsFormError, 'smsCode', '');
      this.$set(this.smsFormError, 'fromServer', false);
      if(this.smsForm.mobile == ''){
        this.$set(this.smsFormError, 'mobile', '请输入手机号');
        return false;
      }
      if(!(/^1\d{10}$/.test(this.smsForm.mobile))){
        this.$set(this.smsFormError, 'mobile', '手机号码格式不正确');
        return false;
      }
      if (this.smsForm.smsCode == "") {
        this.$set(this.smsFormError, 'smsCode', '短信验证码不能为空，请重新输入');
        return false;
      }
      if (!/\d{6}$/.test(this.smsForm.smsCode)) {
        this.$set(this.smsFormError, 'smsCode', '请输入6位短信验证码');
        return false;
      }
      this.isLoading = true;
      // _login(
      //   Object.assign(this.smsForm, {
      //     referer: location.href,
      //     isSimply: 1,
      //     invite_customer_code: ''
      //   })
      // )
      _login({
        mobile: this.smsForm.mobile,
        smsCode: this.smsForm.smsCode,
        referer: location.href,
        isSimply: 1,
        invite_customer_code: ''
      })
      .then(ret => {
        // this.$emit("close", false);
        const localStorageKey = genLocalStorageKey('simply');
        localStorage.setItem(localStorageKey, 'true');
        this.close();
        this.isLoading = false;
        // location.href = ret.data && ret.data.url ? ret.data.url : '/merchant/index/index';
        location.reload();
      }).catch(err=>{
        this.isLoading = false;
        this.$set(this.smsFormError, 'smsCode', err.msg);
        this.$set(this.smsFormError, 'fromServer', true);
      })
    },
    checkMobileInput(){
      if(this.smsCodeTimer) return;
      if(/^1\d{10}$/.test(this.smsForm.mobile)){
        this.isSmsCodeDisabled = false;
      } else {
        this.isSmsCodeDisabled = true;
      }
    },
    smsVerfiyConfirm(){
      if(!this.smsVerify.token || !this.smsVerify.sig || !this.smsVerify.sessionid){
        this.smsVerifyErrorMsg = '请滑动验证';
      } else {
        this.smsVerifyErrorMsg = '';
        this.isShowVerifyPop = false;
        this._getSmsCode();
      }
    },
    close() {
      this.$emit("close", false);
    },
    handleFocus(e) {
      this.$store.commit("shortcut/updateFocusStatus", true);
    },
    handleBlur(data) {
      this.$store.commit("shortcut/updateFocusStatus", false);
      if(data == 'mobile'){
        if(this.smsForm.mobile == ''){
          this.$set(this.smsFormError, 'mobile', '请输入手机号');
        } else if(!(/^1\d{10}$/.test(this.smsForm.mobile))){
          this.$set(this.smsFormError, 'mobile', '手机号码格式不正确');
        } else {
          this.$set(this.smsFormError, 'mobile', '');
        }
      }
      if(data == 'smsCode'){
        if (this.smsForm.smsCode == "") {
          this.$set(this.smsFormError, 'smsCode', '短信验证码不能为空，请重新输入');
        } else if (!/\d{6}$/.test(this.smsForm.smsCode)) {
          this.$set(this.smsFormError, 'smsCode', '请输入6位短信验证码');
        } else {
          this.$set(this.smsFormError, 'smsCode', '');
        }
      }
    },
    async getLoginImg(){
      if(!this.loginImg){
        let ret = await _getLoginImg();
        if(ret.data && ret.data.img_url){
          this.$store.commit('updateLoginImg', ret.data.img_url);
        }
      }
    }
  },
  created(){
    if(localStorage.getItem('simply')=='false') this.loginType = 'account'
    this.getLoginImg();
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.login-container{
  display: flex;
}
.login-banner{
  width: 320px;
  height: 500px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}
.login-form {
  width: 430px;
  height: 500px;
  padding: 0 62px;
  position: relative;
}
.login-brand {
  border-radius: 4px;
  background-color: rgb(92, 207, 168);
  width: 34px;
  position: absolute;
  font-size: 14px;
  color: rgb(255, 255, 255);
  text-align: center;
  line-height: 1.5;
  padding: 5px;
  right: -79px;
  top: -40px;
}
.login-title {
  font-size: 24px;
  color: #2F74FF;
  font-weight: bold;
  text-align: center;
  line-height: 33px;
  margin-top: 55px;
  .desc{
    color: #999;
    font-size: 14px;
    font-weight: normal;
  }
}
.form-input {
  width: 100%;
  height: 42px;
  border-radius: 4px;
  border: 1px solid rgb(221, 221, 221);
  outline: 0;
  padding: 6px;
  font-size: 14px;
  &:focus {
    border-color: #2F74FF;
  }
  &.error{
    border-color: red;
  }
}
.other-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 30px;
  margin-top: 5px;
  a{
    color: rgb(102, 102, 102);
    text-decoration: none;
  }
}
.error-msg {
  color: #ec4339;
  font-size: 12px;
}
.login-btn {
  border-radius: 4px;
  background-color: #2F74FF;
  width: 100%;
  line-height: 42px;
  text-align: center;
  display: inline-block;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}
.close-btn {
  position: absolute;
  top: 0;
  right: 0;
  padding: 20px;
  font-size: 14px;
  font-weight: bold;
  color: #999;
  cursor: pointer;
}
.logintype-switch{
  display: flex;
  justify-content: flex-end;
  cursor: pointer;
  a{
    color: #2F74FF;
    text-decoration: underline;
  }
}
.login-tips{
  font-size: 12px;
  line-height: 1.55;
  a{
    color:#2F74FF;
    text-decoration: none;
  }
}
.other-method {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}
.login-qq,
.login-wx {
  border-radius: 4px;
  background-color: rgb(83, 181, 239);
  width: 74px;
  line-height: 36px;
  display: inline-block;
  text-align: center;
  color: #fff;
  text-decoration: none;
}
.login-wx {
  background-color: rgb(85, 183, 55);
}
.smscode-row{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.smscode-btn{
  flex-shrink: 0;
  flex-grow: 0;
  display: inline-block;
  width: 126px;
  height: 42px;
  line-height: 42px;
  text-align: center;
  background-color: #2F74FF;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  &.disabled{
    background-color: #ccc;
    pointer-events: none;
  }
}
.smsverify-pop{
  .content{
    width: 300px;
    margin:0 auto;
  }
  .title{
    text-align: center;
    font-size: 12px;
  }
  .captcha-slider{
    display: flex;
    justify-content: center;
  }
  .footer{
    display: flex;
    justify-content: flex-end;
    a{
      display: inline-block;
      font-size: 12px;
      padding: 2px 24px;
      line-height: 2.3;
      border-radius: 4px;
      background-color: rgb(250, 250, 250);
      color: #444;
      border: 1px solid rgb(204, 204, 204);
      cursor: pointer;
      &:hover{
        background-color: rgb(240, 240, 240);
      }
      &.save{
        background-color:#2F74FF;
        color: #fff;
        &:hover{
          opacity: 0.8;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.nc-container .nc_scale span {
  height: 34px !important;
}
.no-captcha .sm-pop-inner {
  position: relative;
}
.login-pop {
  border-radius: 5px !important;
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog__body {
    padding: 0;
  }
}
.smsverify-pop{
  .el-dialog__header{
    padding: 6px 20px 10px;
    background: rgb(245, 247, 250); 
    color: rgb(89, 90, 90);
  }
  .el-dialog__title{
    font-size: 12px;
    font-weight: bold;
    color: rgb(89, 90, 90);
  }
  .el-dialog__headerbtn{
    top: 10px;
    .el-dialog__close{
      color: rgb(89, 90, 90);
      font-weight: bold;
    }
  }
}
</style>