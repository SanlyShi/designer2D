<template>
  <div class="toolbar" :class="{'zwkj': $sdkConfig.platformIsZWKJ}">
    <ul>
      <li
        class="tool-item"
        :class="[item.type, {'active': leftType==item.type}, {'zw-disabled':item.disabled}]"
        v-for="(item,index) in tools1"
        :key="index"
        v-show="item.isShow"
        @click="toolChange(item, 1)"
      >
        <i :class="['iconfont f24', item.selectedIcon,'icon']" v-if="item.type==leftType"></i>
        <i :class="['iconfont f24', item.icon,'icon']" v-else></i>
        <p>{{item.name}}</p>
      </li>
    </ul>
    <ul v-show="$sdkConfig.platformIsZWKJ">
      <li
        class="tool-item"
        :class="[item.type, {'active': isShowLayer&&item.type=='layer'},{'zw-disabled':item.disabled}]"
        v-for="(item,index) in tools2"
        :key="index"
        v-show="item.isShow"
        @click="toolChange(item, 2)"
      >
        <template v-if="item.type=='help'">
          <el-popover
            trigger="hover"
            width="130"
            :open-delay="0"
            :close-delay="0"
            :value="isShowHelpPop"
            placement="right"
            popper-class="qrcode-pop"
            :disabled="!qrcode.img_url"
          >
            <div class="content">
              <div class="tc mb10" v-html="qrcode.title"></div>
              <img :src="qrcode.img_url" width="104" />
              <a class="mt15" @click="hideQRCodePop">知道了</a>
            </div>
            <div slot="reference">
              <a class="help-link" href="https://www.hicustom.com/frontend/HelperDocument/documentList?cat_id=20" target="_blank">
                <i :class="['iconfont f24', item.selectedIcon,'icon']" v-if="item.type==leftType"></i>
                <i :class="['iconfont f24',item.icon,'icon']" v-else></i>
                <p>{{item.name}}</p>
              </a>
            </div>
          </el-popover>
        </template>
        <template v-else-if="item.type=='easy'">
          <a class="help-link" :href="`/frontend/create/createNewModelEditor?product_code=${product.id}&fromNewDesign=1&productCodeNum=${product.code}`">
            <i :class="['iconfont f24', item.selectedIcon,'icon']" v-if="item.type==leftType"></i>
            <i :class="['iconfont f24',item.icon,'icon']" v-else></i>
            <p>{{item.name}}</p>
          </a>
        </template>
        <template v-else>
          <i :class="['iconfont f24', item.selectedIcon,'icon']" v-if="item.type==leftType"></i>
          <i :class="['iconfont f24',item.icon,'icon']" v-else></i>
          <p>{{item.name}}</p>
        </template>
      </li>
    </ul>
  </div>
</template>

<script>
import eventBus from "@/utils/eventBus.js";
import {GetQueryString, getBrowserInfo, genLocalStorageKey} from '@/utils/utils';
import {_getQrcode} from '@/apis/common.js'
export default {
  data() {
    return {
      tools1: [
        {
          type: "product",
          name: "商品",
          icon: "iconskin",
          selectedIcon: "iconskin-fill",
          disabled: false,
          isShow: GetQueryString('isShowProductSec')!=='0'
        },
        {
          type: "gallery",
          name: "图库",
          icon: "iconpicture",
          selectedIcon: "iconpicture-fill",
          disabled: false,
          isShow: this.$sdkConfig.gallery.isEnable ? GetQueryString('isShowGallerySec')!=='0' : false
        },
        {
          type: "background",
          name: "背景",
          icon: "iconbg",
          selectedIcon: "iconbg",
          disabled: false,
          isShow: this.$sdkConfig.background.isEnable ? GetQueryString('isShowBackgroundSec')!=='0' : false
        },
        {
          type: "text",
          name: "文字",
          icon: "icontext",
          selectedIcon: "icontext-fill",
          disabled: false,
          isShow: this.$sdkConfig.text.isEnable ? GetQueryString('isShowTextSec')!=='0' : false
        },
        {
          type: "upload",
          name: "上传",
          icon: "iconupload",
          selectedIcon: "iconupload-fill",
          disabled: false,
          isShow: this.$sdkConfig.upload ? GetQueryString('isShowUploadSec')!=='0' : false
        },
        {
          type: "layer",
          name: "图层",
          icon: "iconview-layers",
          selectedIcon: "iconview-layers-fill",
          isShow: GetQueryString('isShowLayerSec')!=='0'
        },
      ],
      qrcode: {},
      isShowHelpPop: false,
    };
  },
  computed: {
    leftType() {
      return this.$store.state.layout.leftType;
    },
    isShowLayer(){
      return this.$store.state.layout.isShowLayer;
    },
    isLeftHidden(){
      return this.$store.state.layout.isLeftHidden;
    },
    product() {
      return this.$store.state.product.selectedProduct;
    },
    tools2(){
      return [
        {
          type: "service",
          name: "客服",
          icon: "iconcustomer",
          selectedIcon: "iconcustomer",
          disabled: false,
          isShow: true
        },
        {
          type: "help",
          name: "帮助",
          icon: "iconquestion",
          selectedIcon: "iconquestion-fill",
          disabled: false,
          isShow: true
        },
        // {
        //   type: "easy",
        //   name: "使用简版",
        //   icon: "iconforward",
        //   selectedIcon: "iconforward",
        //   disabled: false,
        //   isShow: isSupportEasy
        // },
      ]
    },
  },
  methods: {
    toolChange(item, flag) {
      if (item.disabled) return;
      switch(flag){
        case 1:
          if(item.type == 'layer'){
            this.$store.commit('layout/toggleLayer', !this.isShowLayer);
            if(this.isLeftHidden){
              this.$store.commit("layout/toggleLeft", false);
            }
          } else {
            if (process.env.NODE_ENV === "development") {
              this.$store.commit("layout/changeLeftType", item.type);
              if(this.isLeftHidden){
                this.$store.commit("layout/toggleLeft", false);
              }
              return;
            }
            if (!this.$isLogin && this.$sdkConfig.platformIsZWKJ && item.type == "upload") {
              eventBus.$emit("showLoginPop");
            } else {
              if(item.type == "upload"){
                 this.$statisticalreport.clickNotDesignItemBtn('上传')
              }
              this.$store.commit("layout/changeLeftType", item.type);
              if(this.isLeftHidden){
                this.$store.commit("layout/toggleLeft", false);
              }
            }
          }
          break;
        case 2:
          if(item.type == 'service'){
            let browser = getBrowserInfo() ;
            let version = (browser+"").replace(/[^0-9.]/ig,""); 
            if(navigator.userAgent.toLowerCase().indexOf("firefox")>-1&&parseFloat(version)>=96){
              this.$message.error("当前火狐浏览器版本（需在95以内）不支持在线客服，请使用其他浏览器登录");
            } else {
              let serviceEl = document.getElementById('kf5-support-btn');
              if(serviceEl){
                serviceEl.click();
              }
            }
          }
          break;
      }
    },
    async getQRCode(){
      let ret = await _getQrcode();
      this.qrcode = ret.data.qrcode && ret.data.qrcode['4'] ? ret.data.qrcode['4'] : {};
      let codeImg = new Image();
      codeImg.src = this.qrcode.img_url;
      codeImg.onload = () => {
        this.showQRCodePop();
      }
      codeImg.onerror = () => {
        this.showQRCodePop();
      }
    },
    showQRCodePop(){
      const localStorageKey = genLocalStorageKey('noneQRList');
      let customerId = this.$isLogin ? this.$OPTIONS.userInfo.code : "unlogin";
      let noneQRLists = JSON.parse(localStorage.getItem(localStorageKey));
      if (
        noneQRLists &&
        noneQRLists.length &&
        noneQRLists.some((a) => a == customerId)
      ) return;
      this.isShowHelpPop = true;
    },
    hideQRCodePop(){
      this.isShowHelpPop = false;
      if(document.querySelector('.el-popover.qrcode-pop')){
        document.querySelector('.el-popover.qrcode-pop').style.display = 'none';
      }
      const localStorageKey = genLocalStorageKey("noneQRList");
      let customerId = this.$isLogin ? this.$OPTIONS.userInfo.code : "unlogin";
      let noneQRLists = JSON.parse(localStorage.getItem(localStorageKey));
      if (!noneQRLists) noneQRLists = [];
      if (!noneQRLists.some((a) => a == customerId)) noneQRLists.push(customerId);
      localStorage.setItem(localStorageKey, JSON.stringify(noneQRLists));
    }
  },
  created(){
    let tools = this.tools1.filter(a=>a.isShow);
    if(tools.length==0){
      this.$store.commit('layout/updateIsShowLeftSec', false);
    } else {
      let type = tools[0].type;
      if(type != 'product'){
        this.$store.commit('layout/changeLeftType', type);
        if(type=='layer'){
          this.$store.commit('layout/toggleLayer', true);
        }
      }
    }
  },
  mounted(){
    this.$sdkConfig.platformIsZWKJ && this.getQRCode();
  }
};
</script>

<style lang="scss" scoped>
.toolbar {
  width: 65px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
  padding-top: 9px;
  background-color: #F0F2F5;
  z-index: 1;
  &.zwkj{
    height: calc(100vh - 55px);
  }
}
.tool-item {
  height: 62px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  line-height: 18px;
  &:not(.zw-disabled) {
    cursor: pointer;
    &.active {
      @include font_color("font_color2");
      @include background_color("background_color1");
    }
    &:hover {
      @include font_color("font_color2");
      * {
        @include font_color("font_color2");
      }
    }
  }

  @include font_color("font_color4");

  .help-link{
    display: inline-block;
    text-decoration: none;
    @include font_color("font_color4");
  }
}
.qrcode-pop{
  .content{
    display: flex;
    flex-direction: column;
    align-items: center;
    a{
      align-self: flex-end;
      font-size: 12px;
      cursor: pointer;
      &:hover{
        @include font_color("font_color2");
      }
    }
  }
}
</style>
<style lang="scss">
.el-popover.qrcode-pop{
  border-color: #949BE6;
  &.el-popper[x-placement^=right] .popper__arrow{
    border-right-color: #949BE6;
  }
}
</style>