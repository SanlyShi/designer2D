<template>
  <div class="el-color-dropdown">
    <div class="el-color-dropdown__main-wrapper">
      <hue-slider ref="hue" :color="color" vertical style="float: right;"></hue-slider>
      <sv-panel ref="sl" :color="color"></sv-panel>
    </div>
    <alpha-slider v-if="showAlpha" ref="alpha" :color="color"></alpha-slider>
    <div class="flat-color__history-box">
      <el-input
        class="custom-input"
        v-model="customInput"
        @keyup.native.enter="handleConfirm"
        @blur="handleConfirm"
        @focus="handleFocus"
        :validate-event="false"
        size="mini"
        placeholder="#FFFFFF"
      ></el-input>
      <div class="history-box">
        <a class="flat-color__straw ml4" v-if="showColorStraw" @click="pickColor">
          <i class="iconfont iconstraw"></i>
        </a>
        <a class="flat-color__clear" @click="clearColor">
          <i class="iconfont icondisable-redline"></i>
        </a>
        <predefine :color="color" :colors="cachedefine" from="cache"></predefine>
      </div>
      <!-- <el-button
        size="mini"
        type="text"
        class="el-color-dropdown__link-btn"
        @click="$emit('clear')">
        {{ t('el.colorpicker.clear') }}
      </el-button>
      <el-button
        plain
        size="mini"
        class="el-color-dropdown__btn"
        @click="confirmValue">
        {{ t('el.colorpicker.confirm') }}
      </el-button> -->
    </div>
    <div class="flat-color__predefine-box" v-if="predefine">
      <div class="label mt15 mb15">预设</div>
      <predefine :color="color" :colors="predefine"></predefine>
    </div>
    <slot name="custom"></slot>
  </div>
</template>

<script>
import SvPanel from "./sv-panel";
import HueSlider from "./hue-slider";
import AlphaSlider from "./alpha-slider";
import Predefine from "./predefine";
import Popper from "element-ui/src/utils/vue-popper";
import Locale from "element-ui/src/mixins/locale";
import ElInput from "element-ui/packages/input";
import ElButton from "element-ui/packages/button";
import Color from '../color';

export default {
  name: "el-color-picker-dropdown",

  mixins: [Popper, Locale],

  components: {
    SvPanel,
    HueSlider,
    AlphaSlider,
    ElInput,
    ElButton,
    Predefine,
  },

  props: {
    color: {
      required: true,
    },
    showAlpha: Boolean,
    predefine: Array,
    cachedefine: Array,
    showColorStraw: Boolean,
  },

  data() {
    return {
      customInput: "",
      isInit: true,
    };
  },

  computed: {
    currentColor() {
      const parent = this.$parent;
      return !parent.value && !parent.showPanelColor ? "" : parent.color.value;
    },
  },

  methods: {
    confirmValue() {
      this.$emit("pick");
    },

    handleConfirm() {
      this.color.fromString(this.customInput);
      this.$store.commit("shortcut/updateFocusStatus", false);
    },
    inputFocus(){
      this.$store.commit("shortcut/updateFocusStatus", true);
    },
    pickColor() {
      this.$parent.$emit('straw');
    },
    clearColor(){
      this.$emit('clear');
    },
    handleFocus() {
      this.$store.commit("shortcut/updateFocusStatus", true);
    },
    handleBlur() {
      this.$store.commit("shortcut/updateFocusStatus", false);
    }
  },

  mounted() {
    this.$parent.popperElm = this.popperElm = this.$el;
    this.referenceElm = this.$parent.$el;
  },

  watch: {
    // showPopper(val) {
    //   if (val === true) {
    //     this.$nextTick(() => {
    //       const { sl, hue, alpha } = this.$refs;
    //       sl && sl.update();
    //       hue && hue.update();
    //       alpha && alpha.update();
    //     });
    //   }
    // },

    currentColor: {
      immediate: false,
      handler(val) {
        if(!val){
          this.customInput = ''
        } else {
          const color = new Color({
            enableAlpha: false,
            format: 'hex',
          });
          color.fromString(val);
          this.customInput = color.value;
        }
        this.isInit = false;
        this.confirmValue();
        // if(this.isInit){
        //   this.isInit = false;
        // } else {
        //   this.confirmValue();
        // }
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.el-color-picker__panel {
  padding: 0;
  position: static;
  border: 0;
  border-radius: 0;
  box-shadow: none;
}
.el-color-dropdown {
  width: 100%;
}
.el-color-dropdown__main-wrapper {
  // margin-bottom: 10px;
}
.flat-color__history-box {
  display: flex;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  .flat-color__straw {
    display: inline-block;
    cursor: pointer;
    i{
      font-size: 24px;
    }
  }
  .flat-color__clear{
    width: 24px;
    height: 24px;
    text-align:center;
    margin-left:5px;
    border-radius: 3px;
    border: 1px solid #ccc;
    color: #FF4D3A;
    cursor: pointer;
    i{
      font-size: 24px;
    }
  }
  .custom-input {
    width: 80px;
    /deep/ .el-input__inner {
      height: 24px !important;
      line-height: 24px !important;
    }
  }
  .history-box {
    display: flex;
    align-items: center;
    /deep/ .el-color-predefine {
      margin-top: 0;
      margin-left: 4px;
    }
    /deep/ .el-color-predefine__color-selector {
      margin-bottom: 0;
    }
  }
}
.flat-color__predefine-box{
  .label{
    font-size: 14px;
  }
}
</style>
