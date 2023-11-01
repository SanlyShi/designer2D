<template>
  <div class="zw-slide-pop" :style="{height:showSlide?'266px':'120px'}">
    <div class="zw-slide-pop-main">
      <div class="title" v-if="title">{{title}}</div>
      <div
        :class="['zw-slide-btn pre-btn','cp',currentValue<max?'':(prenextDisabled?'zw-disabled':'')]"
        @click="handlePre"
      >{{preLabel}}</div>
      <div class="slide">
        <el-slider
          v-model="currentValue"
          :min="min"
          :max="max"
          vertical
          height="120px"
          :unit="unit"
          :step="step"
          :show-stops="showStops"
          v-show="showSlide"
          :format-tooltip="formatTooltip"
          @change="changeValue"
        ></el-slider>
      </div>
      <div
        :class="['zw-slide-btn next-btn','cp',currentValue>min?'':(prenextDisabled?'zw-disabled':'')]"
        @click="handleNext"
      >{{nextLabel}}</div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ""
    },
    value: {
      type: Number
    },
    min: {
      type: Number,
      default: 0
    },
    prenextDisabled: {
      type: Boolean,
      default: false
    }, //是否限制点击按钮
    max: {
      type: Number,
      default: 100
    },
    unit: {
      type: String,
      default: ""
    },
    step: {
      type: Number,
      default: 1
    },
    showStops: {
      type: Boolean,
      default: true
    },
    showSlide: {
      type: Boolean,
      default: true
    },
    preLabel: {
      type: String,
      default: "上一步"
    },
    nextLabel: {
      type: String,
      default: "下一步"
    }
  },

  data() {
    return {
      currentValue: 0
    };
  },
  mounted: function() {},
  computed: {},
  watch: {
    value: {
      handler(val) {
   
        this.currentValue = val;
      },
      immediate: true
    },
    currentValue: function(nv, ov) {
      let type = nv > ov ? "up" : "down";
      // this.$emit("update:value", {val: nv, type});
    
      this.$emit("activeChange", { val: nv, type });
    }
  },
  methods: {
    handlePre() {
      if (this.currentValue < this.max) {
        this.currentValue += this.step;
      }
      this.$emit("handlePreNext", 1);
    },
    handleNext() {
      if (this.currentValue > this.min) {
        this.currentValue -= this.step;
      }
      this.$emit("handlePreNext", -1);
    },
    formatTooltip(val) {
      return val + this.unit;
    },
    changeValue(val) {
      this.$emit("change", val);
    }
  }
};
</script>
<style lang="scss" scoped>
.zw-slide-pop {
  box-sizing: border-box;
  width: 86px;
  height: 266px;
  background: #ffffff;
  box-shadow: 0px 5px 12px 4px rgba(0, 0, 0, 0.09),
    0px 3px 6px 0px rgba(0, 0, 0, 0.12), 0px 1px 2px -2px rgba(0, 0, 0, 0.16);
  border-radius: 5px;
  // padding: 20px 10px;
  .zw-slide-pop-main {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    .title {
      width: 100%;
      text-align: center;
      height: 40px;
      background: rgba(0, 0, 0, 0.04);
      font-size: 14px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.85);
      line-height: 40px;
    }
    .zw-slide-btn {
      font-size: 14px;
      line-height: 22px;
      padding: 9px 0;
      width: 100%;
      text-align: center;
      &.cp {
        &:hover {
          background: #0453F3;
          color: #fff;
          &.next-btn {
            border-bottom-left-radius: 5px;
            border-bottom-right-radius: 5px;
          }
        }
      }
    }

    .slide {
      flex: auto;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      // padding: 20px 0;

      border-top: 1px solid #f0f5ff;
      border-bottom: 1px solid #f0f5ff;
      /deep/ .el-slider__runway {
        // width: 4px;
        // border-radius: 4px;
        .el-slider__button-wrapper {
          left: -16px !important;
        }
      }
      // /deep/ .el-slider__bar {
      //   width: 4px;
      //   border-radius: 4px;
      // }

      // /deep/ .el-slider__button {
      //   width: 12px !important;
      //   height: 12px !important;
      // }
    }
  }
}
</style>