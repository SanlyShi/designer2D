<template>
  <div class="zw-silder-container">
    <el-slider
      v-model="value"
      :vertical="vertical"
      height="120px"
      :min="min"
      :max="max"
      :step="step"
      class="zw-silder"
      @change="handleSlideChange"
      :format-tooltip="formatTooltip"
    ></el-slider>
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
  data() {
    return {
      showSlide: false,
      timeOutEvent: [0, 0],
      value: 0,
      count: 1
    };
  },
  methods: {
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
      this.$store.commit("shortcut/updateFocusStatus", true);
    },
    handleBlur() {
      this.$store.commit("shortcut/updateFocusStatus", false);
    },
    handleClick(e) {
      this.$emit("click");
    }
  }
};
</script>

<style scoped lang="scss">
.zw-silder-container{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.zw-silder {
  flex: 1;
  margin-right: 10px;
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
    }
  }
}
.zw-slide-input {

  display: inline-block;
  position: relative;
  width: 64px;
  /deep/ .el-input__inner {
    padding-right: 0 !important;
  }
  /deep/ .el-input__inner {
    border-radius: 20px;
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
