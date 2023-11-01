<template>
  <div class="zw-unit-input">
    <div class="zw-input__suffix">
      <span class="unit">{{unit}}</span>
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
      v-model="value"
      type="number"
      @focus="handleFocus"
      @blur="handleBlur"
      @change="handleChange"
      @input="handleInput"
    ></el-input>
  </div>
</template>

<script>
export default {
  name: "ZwSelect",
  props: {
    step: {
      type: Number,
      default: 1
    },
    max: {
      type: Number
    },
    min: {
      type: Number,
      default: 0
    },
    unit: {
      type: String
    },
    defaultValue: {
      type: Number | String,
      default: 0
    }
  },

  watch: {
    defaultValue: function(val) {
      this.value = parseInt(this.defaultValue);
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
  created() {
    this.value = parseInt(this.defaultValue);
  },
  data() {
    return {
      value: 0,
      count: 1,
      timeOutEvent: [0, 0]
    };
  },
  methods: {
    handleFocus() {
      this.$store.commit("shortcut/updateFocusStatus", true);
    },
    handleBlur() {
      this.$store.commit("shortcut/updateFocusStatus", false);
    },
    handleUpDown(opt) {
      if (!this.value) {
        this.value = 0;
      }
      if (opt == "up") {
        this.value = Number(this.value) + this.step;
      } else if (opt == "down") {
        if (this.value > this.min) {
          this.value = Number(this.value) - this.step;
        }
      }
      this.handleChange();
    },

    handleInput(value) {
      if (!value) {
        this.value = this.min ? this.min : 0;
      }
      this.$emit("update:defaultValue", this.value);
    },
    handleChange() {
      if (!this.value) {
        this.value = this.min ? this.min : 0;
      } else if (this.max && this.value > this.max) {
        this.value = this.max;
      } else if (this.min && this.value < this.min) {
        this.value = this.min;
      }
      this.$emit("update:defaultValue", this.value);
      this.$emit("changeValue", this.value);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
/deep/ .el-input__icon {
  display: none !important;
}
/deep/ .el-input__inner {
  padding: 0 21px 0 10px !important;
}
.zw-unit-input {
  display: inline-block;
  position: relative;
  &:hover {
    .zw-input__suffix {
      .unit {
        display: none;
      }
      .iconfont {
        display: inline-block;
      }
    }
  }
}
.zw-input__suffix {
  position: absolute;
  right: 1px;
  top: 0;
  display: flex;
  justify-content: center;
  flex-direction: column;
  z-index: 1;
  height: 100%;
  width: 20px;
  text-align: center;
  .unit {
    // width: 18px;
    // text-align: left;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.25);
    display: inline-block;
    // margin-right: 8px;
  }
  .iconfont {
    display: none;
    height: calc(50% - 1px);
    background-color: #f1f1f1;
    font-size: 12px;
    cursor: pointer;
    &:hover {
      @include font_color("font_color2");
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
</style>
