<template>
  <div class="zw-slide-pop">
    <div class="zw-slide-pop-main">
      <div class="slide">
        <span>{{labelfirst}}</span>
        <el-slider
          :key="1"
          class="zw-silder"
          v-model="X_value"
          :min="min"
          :max="max"
          height="120px"
          :unit="unit"
          :step="step"
          :show-stops="showStops"
          :format-tooltip="formatTooltip"
          @change="changeValue('X_value')"
        ></el-slider>
        <span class="slide-value" v-if="showValueType==='num'">{{X_value}}{{unit}}</span>
        <span class="slide-value" v-if="showValueType==='input'">
          <el-input
            type="number"
            v-model.number="X_value"
            @change="handleChange('X_value')"
            @input="handleInput('X_value')"
            @focus="handleFocus"
            @blur="handleBlur"
          ></el-input>
        </span>
      </div>
      <div :class="['iconfont', lock?'iconlock':'iconunlock', 'slide-lock']" @click="changeLock"></div>
      <div class="slide">
        <span>{{labelSecond}}</span>
        <el-slider
          :key="2"
          class="zw-silder"
          v-model="Y_value"
          :min="min"
          :max="max"
          height="120px"
          :unit="unit"
          :step="step"
          :show-stops="showStops"
          :format-tooltip="formatTooltip"
          @change="changeValue('Y_value')"
        ></el-slider>
        <span class="slide-value" v-if="showValueType==='num'">{{ Y_value}}{{unit}}</span>
        <span class="slide-value" v-if="showValueType==='input'">
          <el-input
            type="number"
            v-model.number="Y_value"
            @change="handleChange('Y_value')"
            @input="handleInput('Y_value')"
            @focus="handleFocus"
            @blur="handleBlur"
          ></el-input>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Object | Array,
      default: function() {
        return [0, 0];
      }
    },
    labelfirst: {
      type: String,
      default: "提示1"
    },
    labelSecond: {
      type: String,
      default: "提示2"
    },
    showValueType: {
      type: String,
      default: ""
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 180
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
      default: false
    },
    slideLock: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      currentValue: [0, 0],
      X_value: 0,
      Y_value: 0,
      lock: true,
      changeType: ""
    };
  },
  mounted: function() {},
  computed: {},
  watch: {
    slideLock: {
      handler(val) {
        this.lock = val;
      },
      immediate: true
    },
    value: {
      handler(val) {
        this.currentValue = val;
        this.X_value = Number(val[0]);
        this.Y_value = Number(val[1]);
      },
      immediate: true
    },
    X_value: function(nv, ov) {
      // let type = nv > ov ? "up" : "down";
      if (this.lock) {
        this.Y_value = this.X_value;
      }
    },
    Y_value: function() {
      if (this.lock) {
        this.X_value = this.Y_value;
      }
    }
  },
  methods: {
    handleChange(key) {
      this.changeType = key;

      if (this.lock) {
        this.Y_value = this.X_value;
      }
      this.$emit("change", [this.X_value, this.Y_value]);
    },
    handleInput(key) {
      this.changeType = key;
      if (!this[key]) {
        this[key] = 0;
      } else if (this[key] > this.max) {
        this[key] = this.max;
      } else if (this[key] < this.min) {
        this[key] = this.min;
      }
      if (this.lock) {
        this.Y_value = this.X_value;
      }

      this.$emit("change", [this.X_value, this.Y_value]);
    },
    handleFocus() {
      this.$store.commit("shortcut/updateFocusStatus", true);
    },
    handleBlur() {
      this.$store.commit("shortcut/updateFocusStatus", false);
    },
    changeValue(key) {
      this.changeType = key;
      this.$emit("change", [this.X_value, this.Y_value]);
    },
    formatTooltip(val) {
      return val + this.unit;
    },
    changeLock() {
      this.lock = !this.lock;
      this.$emit("update:slideLock", this.lock);
    }
  }
};
</script>
<style lang="scss" scoped>
.zw-slide-pop {
  padding: 14px 10px;
  .zw-slide-pop-main {
    .slide {
      width: 100%;
      display: flex;
      align-items: center;
      .zw-silder {
        padding: 0 10px;
        flex: 1;
      }
    }
    .slide-value {
      width: 48px;
      text-align: right;
      /deep/ .el-input {
        .el-input__inner {
          height: 24px;
          line-height: 24px;
        }
      }
    }
  }
  .slide-lock {
    &.iconlock {
      color: #0453F3;
    }
  }
}
</style>