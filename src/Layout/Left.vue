<template>
  <div class="sidebar">
    <a class="switch" @click="toggleLeft" v-show="isShowLeftSec">
      <span :class="['iconfont',isLeftHidden?'iconarrow-right-bold':'iconarrow-left-bold']"></span>
    </a>
    <div class="sidebar-main">
      <ToolBar></ToolBar>
      <div class="sidebar-cont scroll-bar" :class="{'hidden': $store.state.layout.isLeftHidden, 'zwkj': $sdkConfig.platformIsZWKJ}" v-show="isShowLeftSec">
        <div class="cont-top">
          <Product v-show="leftType=='product'&&!isShowProductDetail"></Product>
          <ProductDetail v-show="leftType=='product'&&isShowProductDetail"></ProductDetail>
          <template v-if="$sdkConfig.gallery.isEnable">
            <Gallery v-show="leftType=='gallery'"></Gallery>
          </template>
          <template v-if="$sdkConfig.background.isEnable">
            <Background v-show="leftType=='background'"></Background>
          </template>
          <template v-if="hasloding.indexOf('text')!=-1&&$sdkConfig.text.isEnable">
            <TextWrap v-show="leftType=='text'"></TextWrap>
          </template>
          <template v-if="hasloding.indexOf('upload')!=-1">
            <UploadImg v-show="leftType=='upload'"></UploadImg>
          </template>
          <div v-show="leftType=='history'">操作记录</div>
          <div v-show="leftType=='more'">更多</div>
        </div>
        <div class="cont-bottom" ref="layerEl" v-show="isShowLayer">
          <div class="tit">
            <span class="txt">
              图层
              <el-tooltip :enterable="false" placement="top">
                <div slot="content">
                同打印面的图层可拖动排序<br/>备注：背景图层固定最底层
                </div>
                <span class="iconfont iconcaveat-circle"></span>
              </el-tooltip>
            </span>
            <span class="close" @click="closeLayer"><i class="iconfont iconclose-bold"></i></span>
          </div>
          <div class="resize-area" v-areaResize><i class="iconfont icondrag-up"></i></div>
          <Layer></Layer>
          <!-- <template v-if="hasloding.indexOf('layer')!=-1">
            <Layer v-show="leftType=='layer'"></Layer>
          </template> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ToolBar from "@/Layout/ToolBar";
import Product from "@/components/Product/Product";
import ProductDetail from "@/components/Product/ProductDetail";
import Gallery from "@/components/Gallery/Gallery.vue";
import Background from "@/components/Background/index.vue";
import TextWrap from "@/components/Text/Text.vue";
import UploadImg from "@/components/UploadImg/UploadImgList.vue";
// import Layer from "@/components/Layer/Layer.vue";
import Layer from "@/components/Layer/leftLayer.vue";
import eventBus from "@/utils/eventBus.js";

export default {
  components: {
    ToolBar,
    Product,
    ProductDetail,
    Gallery,
    Background,
    TextWrap,
    UploadImg,
    Layer
  },
  data() {
    return {
      hasloding: [],
      isLeftHidden: this.$store.state.layout.isLeftHidden,
      firstShowLayer: true, //首次显示图层
    };
  },
  computed: {
    leftType() {
      return this.$store.state.layout.leftType;
    },
    isShowLayer(){
      return this.$store.state.layout.isShowLayer;
    },
    isShowProductDetail(){
      return this.$store.state.layout.isShowProductDetail;
    },
    isShowLeftSec(){
      return this.$store.state.layout.isShowLeftSec
    }
  },
  created() {},
  mounted() {},
  watch: {
    leftType: function(value) {
      if (this.hasloding.indexOf(value) == -1) {
        this.hasloding.push(value);
      }
    },
    isShowLayer(nv, ov){
      if(nv){
        if(this.firstShowLayer){
          // 默认高度对齐图层文字
          let iconEl = document.querySelector('.tool-item.layer');
          if(iconEl){
            let winHeight = document.documentElement.clientHeight || document.body.clientHeight;
            let pos = iconEl.getBoundingClientRect();
            this.$refs.layerEl.style.height = (winHeight - pos.top - 15) + 'px'
            this.firstShowLayer = false;
          }
        }
      }
    }
  },
  methods: {
    toggleLeft() {
      this.isLeftHidden = !this.isLeftHidden;
      this.$store.commit(
        "layout/toggleLeft",
        !this.$store.state.layout.isLeftHidden
      );
    },
    closeLayer(){
      this.$store.commit('layout/toggleLayer', !this.isShowLayer);
    }
  },
  directives: {
    areaResize: {
      inserted: function(el, binding, vnode, oldVnode){
        el.msMoveHandler = function(e){
          let changeY = el.startPos.y - e.clientY;
          let height = el.startPos.height + changeY;
          el.parentNode.style.height = height + 'px';
          e.stopPropagation();
        };
        el.msUpHandler = function(e){
          document.removeEventListener('mousemove', el.msMoveHandler, false);
        };
        el.addEventListener('mousedown', function(e){
          el.startPos = {
            height: el.parentNode.clientHeight,
            y: e.clientY
          };
          document.addEventListener('mousemove', el.msMoveHandler, false);
        });
        document.addEventListener('mouseup', el.msUpHandler, false);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.sidebar {
  position: relative;
  .switch {
    position: absolute;
    display: flex;
    align-items: center;
    // width: 20px;
    // height: 20px;
    top: calc(50% - 50px);
    right: -18px;
    z-index: 99;
    cursor: pointer;
    width: 18px;
    height: 50px;
    background: #ffffff;
    // box-shadow: 0px 12px 48px 16px rgba(0, 0, 0, 0.03),
    //   0px 9px 28px 0px rgba(0, 0, 0, 0.05),
    //   0px 6px 16px -8px rgba(0, 0, 0, 0.08);
    border-radius: 0px 10px 10px 0px;
    text-align: center;
    // background: rgba(0, 0, 0, 0.06);
  }
  .sidebar-main {
    display: flex;
  }
  .sidebar-cont {
    width: 320px;
    height: 100vh;
    overflow: hidden;
    background: #fff;
    transition: all 0.3s;
    opacity: 1;
    display: flex;
    flex-direction: column;
    &.zwkj{
      height: calc(100vh - 55px);
    }
    &.hidden {
      width: 0;
      opacity: 0;
      transition: all 0.3s;
    }
    .cont-top{
      flex: 1;
      overflow-y: hidden;
      display: flex;
    }
    .cont-bottom{
      height: 240px;
      min-height: 240px;
      max-height: calc(100% - 300px);
      position: relative;
      border: 1px solid #f0f5ff;
      box-shadow: 0px -4px 8px 0px rgba(0, 0, 0, 0.06);
      // box-shadow: 0px 5px 12px 4px rgba(0, 0, 0, 0.09), 0px 3px 6px 0px rgba(0, 0, 0, 0.12), 0px 1px 2px -2px rgba(0, 0, 0, 0.16);
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      // padding-top:20px;
      &>.tit{
        line-height: 32px;
        background: rgba(0, 0, 0, 0.04);
        display: flex;
        justify-content: space-between;
        padding-left: 10px;
        .txt{
          display: inline-block;
          padding: 0 30px;
          background: #fff;
          color: #0453F3;
          font-size:14px;
          font-weight: 600;
        }
        .close{
          padding: 0 10px;
          cursor: pointer;
        }
      }
      .resize-area{
        display:inline-block;
        content: '';
        position: absolute;
        left: 50%;
        top: 4px;
        z-index:99;
        height: 28px;
        padding: 0 10px;
        background: transparent;
        cursor: n-resize;
        user-select: none;
      }
    }
  }
}
</style>