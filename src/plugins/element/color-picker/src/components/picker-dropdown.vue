<template>
  <transition name="el-zoom-in-top" @after-leave="doDestroy">
    <div class="el-color-dropdown" v-show="showPopper">
      <div class="el-color-dropdown__main-wrapper">
        <hue-slider ref="hue" :color="color" vertical style="float: right;"></hue-slider>
        <sv-panel ref="sl" :color="color" @dragEnd="$emit('dragEnd',color)"></sv-panel>
      </div>
      <alpha-slider v-if="showAlpha" ref="alpha" :color="color" style="display:none"></alpha-slider>
      <!-- <predefine v-if="predefine" :color="color" :colors="predefine"></predefine> -->
      <div style="display:flex;" class="zw-color-predefine">
        <span
          @click="$emit('mark')"
          class="color-mark iconfont iconstraw"
          style="width: 24px;height: 24px;text-align:center;font-size:24px;margin-left:5px;margin-top:8px;border-radius: 3px;
         cursor: pointer"
        ></span>
        <span
          @click="$emit('clear')"
          style="width: 24px;height: 24px;text-align:center;margin-left:5px;margin-top:8px;border-radius:50%;color:red;cursor: pointer;
          border: 1px solid #E0E5EA;box-sizing:content-box;"
        >
          <i class="iconfont icondisable-redline" style="font-size:24px"></i>
        </span>
        <predefine v-if="predefine" :color="color" :colors="predefine"></predefine>
      </div>
      <slot name="content"></slot>
      <div class="el-color-dropdown__btns">
        <span class="el-color-dropdown__value">
          <el-input
            style="display:none"
            v-model="customInput"
            @keyup.native.enter="handleConfirm"
            @blur="handleConfirm"
            @focus="handleFocus"
            :validate-event="false"
            size="mini"
          ></el-input>
          <el-input v-model="hexColor" @keyup.native.enter="handleConfirm" @blur="handleConfirm" @focus="handleFocus" :validate-event="false" size="mini"></el-input>
        </span>
        <!-- <el-button
          size="mini"
          class="el-color-dropdown__link-btn"
          @click="$emit('clear')"
        >{{ t('el.colorpicker.clear') }}</el-button>-->
        <el-button size="mini" class="el-color-dropdown__link-btn" @click="$emit('cancel')">取消</el-button>
        <el-button plain size="mini" class="el-color-dropdown__btn" @click="confirmValue">{{ t('el.colorpicker.confirm') }}</el-button>
      </div>
    </div>
  </transition>
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
import Color from "../color";
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
  },

  data() {
    return {
      customInput: "",
      hexColor: "",
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
      this.color.fromString(this.hexColor);
      this.setHexColor(this.hexColor);
      this.$store.commit("shortcut/updateFocusStatus", false);
    },
    handleFocus() {
      this.$store.commit("shortcut/updateFocusStatus", true);
    },
    setHexColor(val) {
      const color = new Color({
        enableAlpha: false,
        format: "hex",
      });
      color.fromString(val);
      color.value == "#FF0000"
        ? (this.hexColor = val)
        : (this.hexColor = color.value);
    },
  },

  mounted() {
    this.$parent.popperElm = this.popperElm = this.$el;
    this.referenceElm = this.$parent.$el;
  },

  watch: {
    showPopper(val) {
      if (val === true) {
        this.$nextTick(() => {
          const { sl, hue, alpha } = this.$refs;
          sl && sl.update();
          hue && hue.update();
          alpha && alpha.update();
        });
      }
    },

    currentColor: {
      immediate: true,
      handler(val) {
        // console.log(val);
        this.customInput = val;
        val ? this.setHexColor(val) : (this.hexColor = val);
      },
    },
    customInput: {
      handler(val) {
        this.setHexColor(val);
      },
    },
  },
};
</script>
