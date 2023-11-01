<template>
  <div class="zw-slide-input" @click.stop="handleClick" ref="reference">
    <div class="zw-input__suffix">
      <span
        class="up iconfont iconcaret-down"
        v-loopClick="{set:handleUpDown,type:'up',timeOutEvent:timeOutEvent,index:0}"
      ></span>
      <span
        class="down iconfont iconcaret-down"
        v-loopClick="{set:handleUpDown,type:'down',timeOutEvent:timeOutEvent,index:1}"
      ></span>
    </div>
    <div
      ref="slidePop"
      class="zw-slide_pop"
      v-if="showSlide"
      :class="[offset]"
      :style="offsetPx?{'width':popWidth,'left':offsetPx}:{'width':popWidth}"
    >
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
        <el-input v-model="value" @change="handleChange" @focus="handleFocus" @blur="handleBlur"></el-input>
      </span>
    </div>

    <el-input
      type="number"
      v-model.number="value"
      placeholder="请选择"
      @change="handleChange"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
    ></el-input>
  </div>
</template>

<script>
export default {
  name: "ZwSelect",
  props: {
    label: {
      type: String,
      default: "提示语"
    },
    vertical: {
      type: Boolean,
      default: false
    },
    popWidth: {
      type: String,
      default: "233px"
    },
    step: {
      type: Number | String,
      default: 1
    },
    max: {
      type: Number | String,
      default: 100
    },
    min: {
      type: Number | String,
      default: 0
    },
    unit: {
      type: String,
      default: ""
    },
    defaultValue: {
      type: Number | String,
      default: 0
    },
    offset: {
      type: String,
      default: ""
    },
    //num 数值展示 input 输入框展示
    showValueType: {
      type: String,
      default: ""
    },
    offsetPx: {
      type: String,
      default: ""
    }
  },
  directives: {
    loopClick: {
      // 指令的定义
      bind: function(el, bind) {
        let timeOutEvent = bind.value.timeOutEvent,
          index = bind.value.index;
        el.addEventListener("mousedown", function(e) {
          timeOutEvent.forEach(item => {
            clearInterval(item);
            item = 0;
          });
          timeOutEvent[index] = setInterval(function() {
            let options = bind.value;
            options.set(options.type);
            //TOTO 长按要做的事情
          }, 60);
        });
        el.addEventListener("mouseup", function(e) {
          //清除定时器
          timeOutEvent.forEach(item => {
            clearInterval(item);
            item = 0;
          });
        });
        el.addEventListener("mouseout", function(e) {
          //清除定时器
          timeOutEvent.forEach(item => {
            clearInterval(item);
            item = 0;
          });
        });
      }
    }
  },
  watch: {
    defaultValue: function(val) {
      this.value = this.defaultValue;
    },
    value: function(val) {
      this.$emit("activeChange", val);
    }
  },
  created() {
    this.value = this.defaultValue;
  },
  mounted() {
    document.addEventListener("click", this.handleDocumentClick);
  },
  destroyed() {
    document.removeEventListener("click", this.handleDocumentClick);
  },
  data() {
    return {
      showSlide: false,
      timeOutEvent: [0, 0],
      value: 0,
      count: 1
    };
  },
  methods: {
    handleDocumentClick(e) {
      let reference = this.$refs.reference;
      const popper = this.$refs.slidePop;
      if (
        !this.$el ||
        !reference ||
        this.$el.contains(e.target) ||
        reference.contains(e.target) ||
        !popper ||
        popper.contains(e.target)
      )
        return;
      this.showSlide = false;
    },
    formatTooltip(val) {
      return val + this.unit;
    },
    handleUpDown(opt) {
      if (opt == "up" && this.value < this.max) {
        this.value += this.step;
      } else if (opt == "down" && this.value > this.min) {
        this.value -= this.step;
      }
      this.handleChange();
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
    handleSlideChange(value) {
      this.$emit("update:defaultValue", value);
    },
    handleFocus(e) {
      this.showSlide = true;
      this.$store.commit("shortcut/updateFocusStatus", true);
    },
    doClose() {
      this.showSlide = false;
    },
    handleBlur() {
      this.$store.commit("shortcut/updateFocusStatus", false);
      // if (this.showValueType == "num") {
      //   this.showSlide = false;
      // }
    },

    handleClick(e) {
      this.$emit("click");
      this.showSlide = true;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.zw-slide_pop {
  z-index: 1002;
  position: absolute;
  background: #ffffff;
  box-shadow: 0px 5px 12px 4px rgba(0, 0, 0, 0.09),
    0px 3px 6px 0px rgba(0, 0, 0, 0.12), 0px 1px 2px -2px rgba(0, 0, 0, 0.16);
  border-radius: 5px;
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 13px;
  .slide-value {
    width: 48px;
    text-align: right;
  }

  &.bottom-right {
    bottom: -51px;
    right: 0;
  }
  &.bottom {
    bottom: -51px;
  }
  &.bottom-left {
    bottom: -51px;
    left: 0;
  }
  &.top-right {
    top: -51px;
    right: 0;
  }
  &.top {
    top: -51px;
  }
  &.top-left {
    top: -51px;
    left: 0;
  }

  .zw-silder {
    flex: 1;
    &.el-slider {
      background: #ffffff;
      &.is-vertical {
        display: flex;
        justify-content: center;
        right: -0px;
        bottom: -150px;
        width: 32px;
        padding: 15px 0;
        box-shadow: 0px 5px 12px 4px rgba(0, 0, 0, 0.09),
          0px 3px 6px 0px rgba(0, 0, 0, 0.12),
          0px 1px 2px -2px rgba(0, 0, 0, 0.16);
        /deep/ .el-slider__runway {
          margin: 0;
          .el-slider__button-wrapper {
            left: -16px;
          }
        }
      }
      &:not(.is-vertical) {
        padding: 14px 10px;
        // line-height: 32px;
      }
    }
  }
}

.zw-slide-input {
  display: inline-block;
  position: relative;
  /deep/ .el-input__inner {
    padding-right: 0 !important;
  }
  /deep/ .el-input-group__append {
    cursor: pointer;
    padding: 0 6px;
  }
  &:hover {
    .zw-input__suffix {
      display: flex;
    }
  }

  .zw-input__suffix {
    position: absolute;
    right: 1px;
    top: 0;
    display: none;
    justify-content: center;
    flex-direction: column;
    z-index: 99;
    height: 100%;
    .iconfont {
      height: calc(50% - 1px);
      line-height: 12px;
      cursor: pointer;
      font-size: 12px;
      background-color: #f1f1f1;
      &:hover {
        color: #1f96f8;
      }
    }
    .up {
      border-bottom-left-radius: 4px;
      transform: rotate(180deg);
    }
    .down {
      border-bottom-right-radius: 4px;
    }
  }
}
</style>
