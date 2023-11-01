<template>
  <div class="zw-input">
    <el-slider
      v-if="showSlide"
      v-model="value"
      vertical
      height="200px"
      :min="min"
      :max="max"
      :step="step"
      class="zw-silder"
      @change="handleSlideChange"
    ></el-slider>
    <el-input
      type="number"
      v-model.number="value"
      placeholder="请选择"
      @change="handleChange"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
    >
      <!-- <template slot="append">
        <span
          :class="['iconfont','iconsorting',showSlide?'active':'']"
          @click="showSlide=!showSlide"
        ></span>
      </template>-->
    </el-input>
  </div>
</template>

<script>
export default {
  name: "ZwSelect",
  props: {
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
      type: String
    },
    defaultValue: {
      type: Number | String,
      default: 0
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
      showSlide: false,
      timeOutEvent: [0, 0],
      value: 0,
      count: 1
    };
  },
  methods: {
    handleUpDown(opt) {
      if (opt == "up") {
        this.value += this.step;
      } else if (opt == "down") {
        this.value -= this.step;
      }
      this.handleChange();
    },
    handleChange(value) {
      this.$emit("update:defaultValue", this.value);
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
    handleFocus() {
      this.showSlide = true;
      this.$store.commit("shortcut/updateFocusStatus", true);
    },
    handleBlur() {
      this.showSlide = false;
      this.$store.commit("shortcut/updateFocusStatus", false);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.zw-silder {
  z-index: 99;
  &.el-slider.is-vertical {
    position: absolute;
    right: -5px;
    bottom: -204px;
  }
}

.zw-input {
  display: inline-block;
  position: relative;
  /deep/ .el-input__inner {
    padding-right: 0 !important;
  }
  /deep/ .el-input-group__append {
    cursor: pointer;
    padding: 0 6px;
  }
  .iconsorting {
    &.active {
      color: #1f96f8;
    }
  }
}
</style>
