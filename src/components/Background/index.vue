<template>
  <div class="background-container">
    <section class="top-section">
      <div class="switch-tab">
        <div 
          class="tab-item"
          :class="{'active': tab.id==activeTab}"
          v-for="tab in tabList"
          :key="tab.id"
          @click="changeTab(tab)"
        >{{tab.name}}</div>
      </div>
      <el-tooltip
        v-if="product.imgFull == 1 && product.bg_ind == 1 && product.views.length > 1"
        :enterable="false"
        effect="dark"
        content="该商品的背景支持单面设计"
        placement="top"
      >
        <span class="iconfont iconinstruction"></span>
      </el-tooltip>
    </section>
    <section class="bottom-section" v-show="activeTab==1">
      <Gallery @gallery-click="changeBgImage"></Gallery>
    </section>
    <section class="bottom-section" v-show="activeTab==2">
      <div class="color-picker-container scroll-bar pt12">
        <flat-color-picker
          class="bg-color-picker __zw-color-picker"
          :width="230"
          v-model="bgColor"
          :show-alpha="false"
          :show-color-straw="true"
          :predefine="predefineColors"
          :cachedefine.sync="cachedefineColors"
          :cachedefineTotal="3"
          @change="changeBgColor"
          @straw="pickColor"
        >
          <template slot="custom">
            <div class="zw-color-custom mt10" v-if="isLogin&&$sdkConfig.platformIsZWKJ">
              <div class="zw-color-custom_panelName">
                自定义
                <el-popover placement="top" title="标题" width="200" trigger="hover" popper-class="zw-rest-prop ">
                  <div style="padding:5px 8px;font-size: 14px;line-height:22px;color:color: rgba(0, 0, 0, 0.85);">自定义颜色最多添加24个，右击可删除</div>
                  <span slot="reference" class="iconfont iconinfo-circle"></span>
                </el-popover>
              </div>
              <div
                class="remove-tips"
                v-show="showRemoveTips"
                @click.stop="removeColor"
                :style="{position:'absolute',left:tipsXY.left,top:tipsXY.top,'z-index':'9999'}"
              >删除</div>
              <div class="zw-color-custom__colors">
                <div
                  @contextmenu.prevent="getDemo($event,item,index)"
                  :class="['zw-color-custom__color-selector',bgColor==item.custom_color?'selected':'']"
                  v-for="(item,index) in customColorRgba"
                  :key="index"
                >
                  <div :style="{background:item.custom_color}" @click="handleSelectCustomColor(item)"></div>
                </div>
                <div class="zw-color-custom__color-add" v-show="customColorRgba.length<24" @click="addCustomColor">
                  <span class="add-icon">+</span>
                </div>
            </div>
            </div>
          </template>
        </flat-color-picker>
      </div>
    </section>
  </div>
</template>

<script>
import Gallery from "./Gallery";
import Color from "@/utils/color";
import { _delSelfColor, _addSelfColor } from "@/apis/common.js";
import eventBus from "@/utils/eventBus.js";
export default {
  components: {
    Gallery,
  },
  data() {
    return {
      tabList: [
        { id: 1, name: "背景图" },
        { id: 2, name: "背景色" },
      ],
      activeTab: 1,
      // 背景色
      bgColor: '',
      predefineColors: [
        "#E02020",
        "#FA6401",
        "#F7B500",
        "#6DD400",
        "#44D7B6",
        "#32C5FF",
        "#0091FF",
        "#6236FF",
        "#B729E0",
        "#6D7278",
        "#E5E5E5",
        "#BFBFBF",
        "#7F7F7F",
        "#262626",
        "#000000",
        "#ffffff",
      ],
      cachedefineColors: ['#ffffff', '#000000'],
      isInitColor: true,
      showRemoveTips: false,
      tipsXY: {
        left: 0,
        top: 0,
      },
      customColor: [],
      customColorRgba: [],
      currentColor: "",
      removeItemIndex: "",
      removeItem: null,
      // 背景图
    };
  },
  computed: {
    isLogin() {
      return this.$isLogin
    },
    config() {
      return this.$store.state.layout.designerConfig;
    },
    viewId(){
      return this.$store.state.view_id;
    },
    viewBgColor(){
      let viewId = this.$store.state.view_id;
      let designImgList = this.$store.state.gallery.designImgList || [];
      let viewData = designImgList.find(v=>v.id == viewId);
      return viewData ? viewData.bgcolor : ''
    },
    selectedBgTab(){
      return this.$store.state.layout.selectedBgTab;
    },
    pickColorData(){
      return this.$store.state.gallery.pickColorData;
    },
    product() {
      return this.$store.state.product.selectedProduct;
    }
  },
  watch: {
    config: {
      handler(val) {
        if (val.customerColorList && val.customerColorList.length > 0) {
          this.customColorRgba = val.customerColorList.map((item) => {
            const c = new Color();
            c.enableAlpha = false;
            c.format = "hex";
            c.fromString(item.custom_color);
            return {
              id: item.id,
              custom_color: c.value,
            };
          });
        } else {
          this.customColorRgba = [];
        }
      },
      immediate: true,
    },
    viewBgColor: {
      handler(nv){
        this.isInitColor = true;
        this.bgColor = nv;
        setTimeout(()=>{
          this.isInitColor = false;
        })
      },
      immediate:true
    },
    selectedBgTab(nv){
      if(nv==2){
        this.activeTab = nv;
      }
    },
    pickColorData: {
      handler(nv){
        if(nv.isPickColor && nv.color && nv.type=='bgcolor'){
          this.bgColor = nv.color;
        }
      },
      deep: true
    }
  },
  methods: {
    changeTab(item) {
      this.activeTab = item.id;
      this.$store.commit('layout/updateSelectedBgTab', this.activeTab);
    },
    changeBgColor(val) {
      this.$statisticalreport.addDesignItem('背景色')
      if(this.isInitColor) return;
      // if(val){
      //   console.log('设置背景色...')
      // } else {
      //   console.log('清空背景色')
      // }
      eventBus.$emit('changeBgColor', val);
    },
    changeBgImage(item){},
    pickColor(){
      eventBus.$emit("handleMarkColor", {type: 'bgcolor'});
    },
    //自定义颜色增删
    addCustomColor() {
      if(this.bgColor){
        _addSelfColor({ color: this.bgColor }).then( res => {
          this.customColorRgba.unshift({
            custom_color: this.bgColor,
            id: res.data,
          });
        }).catch(err => {
          this.$message.error(err.msg);
        })
      }
    },
    removeColor() {
      _delSelfColor({ id: this.removeItem.id })
        .then((res) => {
          this.customColorRgba.splice(this.removeItemIndex, 1);
          this.showRemoveTips = false;
        })
        .catch((err) => {
          this.$message.error(err.msg);
        });
      this.showRemoveTips = false;
    },
    getDemo(e, item, index) {
      this.removeItemIndex = index;
      this.removeItem = item;
      this.showRemoveTips = !this.showRemoveTips;
      this.tipsXY.left = e.target.parentNode.offsetLeft - 20 + "px";
      this.tipsXY.top = e.target.parentNode.offsetTop + 24 + "px";
    },
    handleSelectCustomColor(item) {
      this.bgColor = item.custom_color;
    },
  },
  mounted(){
    window.addEventListener("mousedown", this.removeTip, true);
  },
  destroyed() {
    window.removeEventListener("mousedown", this.removeTip, true);
  },
};
</script>

<style lang="scss" scoped>
$primary: #0453F3;
.background-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.top-section{
  border-bottom: 1px solid #F0F2F5;
  position: relative;
  .iconfont {
    position: absolute;
    right: 20px;
    top: 16px;
    color: #0453F3;
  }
}
.switch-tab{
  display: flex;
  justify-content: center;
  font-size: 16px;
  width: 200px;
  height: 48px;
  line-height: 48px;
  margin: 0 auto;
  font-weight: 600;
  .tab-item{
    width: 100%;
    text-align: center;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    &.active{
      @include font_color("font_color2");
      border-color:$primary;
    }
  }
}
.bottom-section {
  flex: 1;
  overflow: hidden;
  position: relative;
  .color-picker-container{
    height: 100%;
    overflow: auto;
  }
}
.bg-color-picker{
  margin: 0 auto;
}

.zw-color-custom {
  padding: 15px 0;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  .zw-color-custom_panelName {
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.85);
    line-height: 22px;
    margin-bottom: 9px;
    margin-left: 5px;
  }
  .zw-color-custom__colors {
    display: flex;
    flex-wrap: wrap;
    .zw-color-custom__color-selector {
      margin: 0 0 4px 4px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      cursor: pointer;
      &:nth-child(8n + 1) {
        margin-left: 5;
      }
      &.selected {
        box-shadow: 0 0 3px 2px #1f96f8;
      }
      &:not(.selected) div {
        border: 1px solid #e0e5ea !important;
      }
      div {
        display: flex;
        height: 100%;
        border-radius: 50%;
      }
    }
    .zw-color-custom__color-add {
      margin: 0 0 4px 4px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      cursor: pointer;
      background: rgba(0, 0, 0, 0.06);
      display: flex;
      align-items: center;
      justify-content: center;
      .add-icon {
        color: rgba(0, 0, 0, 0.45);
        font-weight: bold;
        font-size: 22px;
      }
    }
  }
}
.remove-tips {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 32px;
  background: #ffffff;
  box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.05),
    0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 3px 6px -4px rgba(0, 0, 0, 0.12);
  border-radius: 16px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.85);
  line-height: 22px;
  cursor: pointer;
}
</style>