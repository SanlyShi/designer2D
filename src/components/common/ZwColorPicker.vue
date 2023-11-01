<template>
  <div class="zw-color-picker">
    <el-color-picker
      v-model="color"
      show-alpha
      :predefine="activeColors"
      :PredefineColor="PredefineColor"
      @active-change="changeActiveColor"
      @change="handlleChange"
      @mark="handleMarkColor"
      @dragEnd="handleDragEnd"
      @preValueChange="preValueChange"
      @cancel="handleCancel"
      popper-class="zw-color-picker-pop"
    >
      <template slot="content">
        <div class="zw-color-predefine" v-if="showPredefine">
          <div class="zw-color-predefine_panelName">预设</div>
          <div class="zw-color-predefine__colors">
            <div :class="['zw-color-predefine__color-selector',PredefineColor==item?'selected':'']" v-for="(item,index) in predefineColorRgba" :key="index">
              <div :style="{background:item}" @click="handleSelectPredefineColor(item)"></div>
            </div>
          </div>
        </div>

        <div class="zw-color-custom" v-if="showCustom&&isLogin&&$sdkConfig.platformIsZWKJ">
          <div
            class="remove-tips"
            v-show="showRemoveTips"
            @click.stop="removeColor"
            :style="{position:'absolute',left:tipsXY.left,top:tipsXY.top,'z-index':'9999'}"
          >删除</div>
          <div class="zw-color-custom_panelName">
            自定义
            <el-popover placement="top" title="标题" width="200" trigger="hover" popper-class="zw-rest-prop">
              <div style="padding:5px 8px;font-size: 14px;line-height:22px;color:color: rgba(0, 0, 0, 0.85);">自定义颜色最多添加24个，右击可删除</div>
              <span slot="reference" class="iconfont iconinfo-circle"></span>
            </el-popover>
          </div>
          <div class="zw-color-custom__colors">
            <div
              @contextmenu.prevent="getDemo($event,item,index)"
              :class="['zw-color-custom__color-selector',PredefineColor==item.custom_color?'selected':'']"
              v-for="(item,index) in customColorRgba"
              :key="index"
            >
              <div :style="{background:item.custom_color}" @click="handleSelectCustomColor(item)"></div>
            </div>
            <div class="zw-color-custom__color-add" v-show="customColorRgba.length<24" @click="addCustomColor">
              <span class="add-icon">+</span>
            </div>
          </div>
        </div>
      </template>
    </el-color-picker>
  </div>
</template>
<script>
import Color from "@/utils/color";
import { _delSelfColor, _addSelfColor } from "@/apis/common.js";
import eventBus from "@/utils/eventBus.js";
export default {
  model: {
    prop: "defaultValue",
    event: "change",
  },
  props: {
    showCustom: {
      type: Boolean,
      default: false,
    },
    showPredefine: {
      type: Boolean,
      default: true,
    },
    defaultValue: {
      type: String,
    },
    pickDefineColor: {
      type: String,
    },
  },
  data() {
    return {
      isLogin: false,
      arrow: true,
      PredefineColor: this.pickDefineColor, //实时预览的颜色
      color: "rgba(255, 69, 0, 0.68)",
      // 实时更新的颜色
      activeColors: ["#000000", "#ffffff"],
      //预设颜色
      predefineColorList: [
        "#E02020",
        "#FA6401",
        "#F7B500",
        "#6DD400",
        "#44D7B6",
        "#32C5FF",
        "#0091FF",
        "#6236FF",
        "#B729E0",
        "#6D7278",
        // "rgba(0, 0, 0, 0.1)",
        // "rgba(0, 0, 0, 0.25)",
        // "rgba(0, 0, 0, 0.5)",
        // "rgba(0, 0, 0, 0.85)",
        "#E5E5E5",
        "#BFBFBF",
        "#7F7F7F",
        "#262626",
        "#000000",
        "#ffffff",
      ],
      showRemoveTips: false,
      tipsXY: {
        left: 0,
        top: 0,
      },
      customColor: [],
      customColorRgba: [],
      currentColor: "",
      removeItemIndex: "",
      removeItem: null,
      selfColors: ["#ff8c00", "#ffd700", "rgba(67, 57, 6, 1)"],
      selfcolorSelected: [],
    };
  },
  computed: {
    config() {
      return this.$store.state.layout.designerConfig;
    },
    predefineColorRgba() {
      return this.predefineColorList.map((value) => {
        const c = new Color();
        c.enableAlpha = true;
        c.format = "rgba";
        c.fromString(value);

        return c.value;
      });
    },
  },
  watch: {
    color: function () {
      this.currentColor = this.color;
    },
    defaultValue: {
      immediate: true,
      handler(val) {
        this.color = this.defaultValue;
        // console.log(val, this.color, "555555555555555555555");
      },
    },
    config: {
      handler(val) {
        // this.designerConfig = val;
        if (val.customerColorList && val.customerColorList.length > 0) {
          this.customColorRgba = val.customerColorList.map((item) => {
            const c = new Color();
            c.enableAlpha = true;
            c.format = "rgba";
            c.fromString(item.custom_color);
            return {
              id: item.id,
              custom_color: c.value,
            };
          });
        } else {
          this.customColorRgba = [];
        }
      },
      immediate: true,
    },
  },
  created() {
    this.isLogin = this.$isLogin;
    // this.isLogin = true;
  },
  mounted() {
    window.addEventListener("mousedown", this.removeTip, true);
  },
  destroyed() {
    window.removeEventListener("mousedown", this.removeTip, true);
  },
  methods: {
    formateColor(color) {
      if (!color) {
        return null;
      } else {
        const formateColor = new Color({
          enableAlpha: false,
          format: "hex",
        });
        formateColor.fromString(color);
        return {
          value: formateColor.value,
          alpha: formateColor._alpha / 100,
          color: color,
        };
      }
    },
    //获取自定义颜色
    getSelfColor() {},
    changeActiveColor(val) {
      // console.log(val, "active");
      this.$emit("activeChange", val, this.formateColor(val));
    },
    handlleChange(val) {
      // console.log(val, "handlleChange");
      this.resetActiveColors(val);
      this.$emit("change", val, this.formateColor(val));
    },
    handleCancel() {
      this.$emit("cancel");
    },
    handleSelectPredefineColor(item) {
      // this.color = item;
      // console.log("handleSelectPredefineColor");
      this.PredefineColor = item;
    },
    handleSelectCustomColor(item) {
      // console.log("handleSelectCustomColor");
      this.PredefineColor = item.custom_color;
    },

    preValueChange(color) {
      this.PredefineColor = color.value;
      // console.log("preValueChange", this.PredefineColor, color);
    },
    resetActiveColors(val) {
      if (val == null) {
        this.$emit("activeChange", val, this.formateColor(val));
      } else if (val && this.activeColors.indexOf(val) != -1) {
        return;
      } else {
        this.activeColors.splice(0, 0, val);
        this.activeColors.length > 6 ? this.activeColors.pop() : "";
      }
    },
    handleDragEnd(color) {
      this.currentColor = color.value;
      // this.resetActiveColors(color.value);
    },
    //取色
    handleMarkColor() {
      eventBus.$emit("handleMarkColor");
      // console.log("获取颜色");
    },
    //自定义颜色增删
    addCustomColor() {
      if (this.PredefineColor) {
        let addColor = "";
        const color = new Color({
          enableAlpha: false,
          format: "hex",
        });
        color.fromString(this.PredefineColor);
        color.value == "#FF0000"
          ? (addColor = this.PredefineColor)
          : (addColor = color.value);
        _addSelfColor({ color: addColor })
          .then((res) => {
            this.customColorRgba.unshift({
              custom_color: this.PredefineColor,
              id: res.data,
            });
          })
          .catch((err) => {
            this.$message.error(err.msg);
          });
      }
    },
    removeColor() {
      _delSelfColor({ id: this.removeItem.id })
        .then((res) => {
          this.customColorRgba.splice(this.removeItemIndex, 1);
          this.showRemoveTips = false;
        })
        .catch((err) => {
          this.$message.error(err.msg);
        });
      this.showRemoveTips = false;
    },
    getDemo(e, item, index) {
      this.removeItemIndex = index;
      this.removeItem = item;
      this.showRemoveTips = !this.showRemoveTips;
      this.tipsXY.left = e.target.parentNode.offsetLeft - 20 + "px";
      this.tipsXY.top = e.target.parentNode.offsetTop + 24 + "px";
    },
    removeTip(e) {
      if (e && e.target.className != "remove-tips") {
        this.showRemoveTips = false;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.zw-color-picker {
  /deep/ .el-color-svpanel {
    width: 210px !important;
  }
}
.zw-color-predefine {
  padding: 15px 0;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  .zw-color-predefine_panelName {
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.85);
    line-height: 22px;
    margin-bottom: 9px;
    margin-left: 5px;
  }
  .zw-color-predefine__colors {
    display: flex;
    flex-wrap: wrap;
    .zw-color-predefine__color-selector {
      margin: 0 0 4px 4px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      cursor: pointer;
      &:nth-child(8n + 1) {
        margin-left: 5;
      }
      &.selected {
        box-shadow: 0 0 3px 2px #1f96f8;
      }
      &:not(.selected) div {
        border: 1px solid #e0e5ea !important;
      }
      div {
        display: flex;
        height: 100%;
        border-radius: 50%;
      }
    }
  }
}
.zw-color-custom {
  padding: 15px 0;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  .zw-color-custom_panelName {
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.85);
    line-height: 22px;
    margin-bottom: 9px;
    margin-left: 5px;
  }
  .zw-color-custom__colors {
    display: flex;
    flex-wrap: wrap;
    .zw-color-custom__color-selector {
      margin: 0 0 4px 4px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      cursor: pointer;
      &:nth-child(8n + 1) {
        margin-left: 5;
      }
      &.selected {
        box-shadow: 0 0 3px 2px #1f96f8;
      }
      &:not(.selected) div {
        border: 1px solid #e0e5ea !important;
      }
      div {
        display: flex;
        height: 100%;
        border-radius: 50%;
      }
    }
    .zw-color-custom__color-add {
      margin: 0 0 4px 4px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      cursor: pointer;
      background: rgba(0, 0, 0, 0.06);
      display: flex;
      align-items: center;
      justify-content: center;
      .add-icon {
        color: rgba(0, 0, 0, 0.45);
        font-weight: bold;
        font-size: 22px;
      }
    }
  }
}
.remove-tips {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 32px;
  background: #ffffff;
  box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.05),
    0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 3px 6px -4px rgba(0, 0, 0, 0.12);
  border-radius: 16px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.85);
  line-height: 22px;
  cursor: pointer;
}
</style>