<template>
  <div class="zw-slide-cont">
    <span class="label">{{label}}</span>
    <el-slider
      v-model="value"
      :vertical="vertical"
      height="120px"
      :min="min"
      :max="max"
      :step="step"
      :class="['zw-silder',offset]"
      @change="handleSlideChange"
      :format-tooltip="formatTooltip"
    ></el-slider>
    <span class="slide-value" v-if="showValueType==='num'">{{value}}{{unit}}</span>
    <span class="slide-value" v-if="showValueType==='input'">
      <el-input v-model="value" @change="handleChange" @input="handleInput" @focus="handleFocus" @blur="handleBlur"></el-input>
    </span>
  </div>
</template>
<script>
export default {
  props: {
    label: {
      type: String,
      default: "提示语",
    },
    vertical: {
      type: Boolean,
      default: false,
    },
    popWidth: {
      type: String,
      default: "233px",
    },
    step: {
      type: Number | String,
      default: 1,
    },
    max: {
      type: Number | String,
      default: 100,
    },
    min: {
      type: Number | String,
      default: 0,
    },
    unit: {
      type: String,
      default: "",
    },
    defaultValue: {
      type: Number | String,
      default: 0,
    },
    offset: {
      type: String,
      default: "",
    },
    //num 数值展示 input 输入框展示
    showValueType: {
      type: String,
      default: "",
    },
    offsetPx: {
      type: String,
      default: "",
    },
  },
  watch: {
    defaultValue: function (val) {
      this.value = Number(this.defaultValue);
    },
    value: function (val) {
      this.value = Number(val);
      this.$emit("activeChange", this.value);
    },
  },
  data() {
    return {
      value: this.defaultValue,
    };
  },
  methods: {
    handleSlideChange(value) {
      this.$emit("update:defaultValue", value);
    },
    handleChange(value) {
      this.$emit("update:defaultValue", this.value);
      this.$emit("changeValue", this.value);
    },
    handleInput(value) {
      if (!value) {
        this.value = 0;
      } else if (value > this.max) {
        this.value = this.max;
      } else if (value < this.min) {
        this.value = this.min;
      }
      this.$emit("update:defaultValue", this.value);
    },
    formatTooltip(val) {
      return val + this.unit;
    },
    handleFocus(e) {
      this.$store.commit("shortcut/updateFocusStatus", true);
    },
    handleBlur() {
      this.$store.commit("shortcut/updateFocusStatus", false);
    },
  },
};
</script>
<style lang="scss" scoped>
.zw-slide-cont {
  width: 100%;
  z-index: 1002;
  // background: #ffffff;
  // box-shadow: 0px 5px 12px 4px rgba(0, 0, 0, 0.09),
  //   0px 3px 6px 0px rgba(0, 0, 0, 0.12), 0px 1px 2px -2px rgba(0, 0, 0, 0.16);
  // border-radius: 5px;

  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 13px;
  .slide-value {
    width: 48px;
    text-align: right;
  }

  .zw-silder {
    flex: 1;
    &.el-slider {
      background: #ffffff;

      &:not(.is-vertical) {
        padding: 14px 10px;
        // line-height: 32px;
      }
    }
  }
}
</style>