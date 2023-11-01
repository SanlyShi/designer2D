<template>
  <div id="main" v-cloak>
    <!-- <div id="pixeCanvasBg"></div> -->
    <div v-if="$sdkConfig.platformIsZWKJ">
      <Header></Header>
      <div class="zwdesign-main">
        <div class="zwdesign-main--left">
          <Left />
        </div>
        <div class="zwdesign-main--center" ref="zwdesign-main">
          <Designer />
        </div>
        <div class="zwdesign-main--right">
          <Right />
        </div>
      </div>
      <operate-tips></operate-tips>
      <product-name-operate-tip v-if="isShowProductOptTip"></product-name-operate-tip>
    </div>
    <div v-else>
      <div style="display: flex">
        <div class="zwdesign-main--left">
          <Left />
        </div>
        <div style="flex: 1">
          <Header></Header>
          <div class="zwdesign-main">
            <div class="zwdesign-main--center" ref="zwdesign-main">
              <Designer />
            </div>
            <div class="zwdesign-main--right">
              <Right />
            </div>
          </div>
          <operate-tips></operate-tips>
          <product-name-operate-tip v-if="isShowProductOptTip"></product-name-operate-tip>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/Layout/Header";
import Left from "@/Layout/Left";
import Right from "@/Layout/Right";
import Designer from "@/Layout/Designer";
import OperateTips from "@/components/OperateTips/index"
import ProductNameOperateTip from '@/components/OperateTips/ProductName'
import eventBus from "@/utils/eventBus.js";
import { throttle } from "@/utils/utils";
export default {
  data() {
    return {
      designerWidth: 0
    };
  },
  components: {
    Header,
    Left,
    Right,
    Designer,
    OperateTips,
    ProductNameOperateTip
  },
  created() {},
  mounted() {
    // this.getStyleWidth();
    window.addEventListener("resize", throttle(this.resize, 200));
  },
  
  directives: {
    // 使用局部注册指令的方式
    resize: {
      // 指令的名称
      bind(el, binding) {
        // el为绑定的元素，binding为绑定给指令的对象
        let width = "",
          height = "";
        function isReize() {
          const style = document.defaultView.getComputedStyle(el);
          // console.log('计时器', style.width)
          if (width !== style.width || height !== style.height) {
            binding.value(el); // 关键
          }
          width = style.width;
          height = style.height;
        }
        el.__vueSetInterval__ = setInterval(isReize, 300);
      },
      unbind(el) {
        clearInterval(el.__vueSetInterval__);
      }
    }
  },
  computed: {
    isLeftHidden() {
      return this.$store.state.layout.isLeftHidden
    },
    isRightHidden() {
      return this.$store.state.layout.isRightHidden
    },
    isShowProductOptTip(){
      return this.$store.state.product.isShowProductOptTip;
    }
  },
  watch: {
    isLeftHidden() {
      setTimeout(() => {
        this.resize({})
      }, 300)
    },
    isRightHidden() {
      setTimeout(() => {
        this.resize({})
      }, 300)
    }
  },
  methods: {
    resize(e) {
      eventBus.$emit("containerResize", {});
    },
    getStyleWidth() {
      if (this.$refs["zwdesign-main"]) {
        let offsetWidth = this.$refs["zwdesign-main"].offsetWidth;
        let offsetHeight = this.$refs["zwdesign-main"].offsetHeight;
        this.designerWidth =
          offsetWidth > offsetHeight ? offsetHeight * 0.85 : offsetWidth * 0.85;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#main {
  // position: fixed;
  // z-index: 11000;
  // top: 0;
  // left: 0;
  display: -webkit-flex;
  display: flex;
  -webkit-flex-direction: column;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: #fff;
  transition: opacity 0.4s ease;
  .zwdesign-main {
    background: #f0f5ff;
    flex: 1;
    display: flex;
    flex-direction: row;
    .zwdesign-main--center {
      flex: auto;
      position: relative;
    }
  }
}
// #pixeCanvasBg {
//   width: 100%;
//   height: 100%;
//   position: fixed;
//   left: 0;
//   z-index: 2005;
//   display: none;
// }
</style>
