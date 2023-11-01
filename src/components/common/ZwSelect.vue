<template>
  <div class="zw-select">
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
    <el-select v-model="value" clearable filterable placeholder="请选择" @change="handleChange">
      <el-option v-for="item of max" :key="item" :label="unit?item+unit:item" :value="item"></el-option>
    </el-select>
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
      type: Number,
      default: 100
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
    }
  },
  created() {
    this.value = this.defaultValue;
  },
  data() {
    return {
      timeOutEvent: [0, 0],
      value: 0,
      count: 1
    };
  },
  methods: {
    handleUpDown(opt) {
      if (opt == "up" && this.value < this.max) {
        // console.log("up");
        this.value += this.step;
      } else if (opt == "down" && this.value > this.min) {
        // console.log("down");
        this.value -= this.step;
      }
      this.handleChange();
    },
    handleChange() {
      this.$emit("update:defaultValue", this.value);
    },
    set() {
      this.count++;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
/deep/ .el-input__icon {
  display: none !important;
}
.zw-select {
  display: inline-block;
  position: relative;
  &:hover {
    .zw-input__suffix {
      display: flex;
    }
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
    background-color: #f1f1f1;
    font-size: 12px;
    // line-height: 12px;
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
