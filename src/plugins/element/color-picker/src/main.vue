<template>
  <div
    :class="[
      'el-color-picker',
      colorDisabled ? 'is-disabled' : '',
      colorSize ? `el-color-picker--${ colorSize }` : ''
    ]"
    v-clickoutside="hide"
  >
    <div class="el-color-picker__mask" v-if="colorDisabled"></div>
    <div class="el-color-picker__trigger" @click="handleTrigger">
      <span class="el-color-picker__color" :class="{ 'is-alpha': showAlpha, 'hascolor': displayedColor!='transparent'}">
        <span
          class="el-color-picker__color-inner"
          :style="{
            backgroundColor: displayedColor
          }"
        ></span>
        <span class="el-color-picker__empty el-icon-close" v-if="!value && !showPanelColor"></span>
      </span>
      <span class="el-color-picker__icon el-icon-arrow-down" v-show="value || showPanelColor"></span>
    </div>
    <picker-dropdown
      ref="dropdown"
      :class="['el-color-picker__panel', popperClass || '']"
      v-model="showPicker"
      @pick="confirmValue"
      @clear="clearValue"
      @cancel="cancel"
      @mark="handleMarkColor"
      @dragEnd="dragEnd"
      :color="color"
      :show-alpha="showAlpha"
      :predefine="predefine"
    >
      <template slot="content">
        <slot name="content"></slot>
      </template>
    </picker-dropdown>
  </div>
</template>

<script>
import Color from "./color";
import PickerDropdown from "./components/picker-dropdown.vue";
import Clickoutside from "element-ui/src/utils/clickoutside";
import Emitter from "element-ui/src/mixins/emitter";
import eventBus from "@/utils/eventBus.js";
export default {
  name: "ElColorPicker",

  mixins: [Emitter],

  props: {
    value: String,
    showAlpha: Boolean,
    colorFormat: String,
    disabled: Boolean,
    size: String,
    popperClass: String,
    predefine: Array,
    PredefineColor: String
  },

  inject: {
    elForm: {
      default: ""
    },
    elFormItem: {
      default: ""
    }
  },

  directives: { Clickoutside },

  computed: {
    displayedColor() {
      if (!this.value && !this.showPanelColor) {
        return "transparent";
      }

      return this.displayedRgb(this.color, this.showAlpha);
    },

    _elFormItemSize() {
      return (this.elFormItem || {}).elFormItemSize;
    },

    colorSize() {
      return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
    },

    colorDisabled() {
      return this.disabled || (this.elForm || {}).disabled;
    },
    isPickColor() {
      let {pickColorData} = this.$store.state.gallery;
      if (pickColorData.color != "" && !pickColorData.type) {
        this.color.fromString(this.$store.state.gallery.pickColorData.color);
      }
      return this.$store.state.gallery.pickColorData.isPickColor;
    }
  },

  watch: {
    isPickColor() {},
    value(val) {
      if (!val) {
        this.showPanelColor = false;
      } else if (val && val !== this.color.value) {
        this.color.fromString(val);
      }
    },
    PredefineColor(val) {
      if (val && val !== this.color.value) {
        this.color.fromString(val);
      }
    },
    color: {
      deep: true,
      handler(val) {
        this.showPanelColor = true;
        const hexcolor = new Color({
          enableAlpha: false,
          format: "hex"
        });
        hexcolor.fromString(val.value);

        this.$emit("preValueChange", val);
      }
    },
    displayedColor(val) {
      if (!this.showPicker) return;
      const currentValueColor = new Color({
        enableAlpha: this.showAlpha,
        format: this.colorFormat
      });
      currentValueColor.fromString(this.value);

      const currentValueColorRgb = this.displayedRgb(
        currentValueColor,
        this.showAlpha
      );
      if (val !== currentValueColorRgb) {
        this.$emit("active-change", val);
      }
    },
    showPicker(val) {
      if (!this.isConfirm && !val) {
        this.$emit("cancel");
      }
      this.isConfirm = false;
    }
    // showPicker(val) {
    //   this.$store.commit("shortcut/updateFocusStatus", val ? true : false);
    // }
  },

  methods: {
    handleTrigger() {
      if (this.colorDisabled) return;
      this.showPicker = !this.showPicker;
    },
    confirmValue() {
      this.isConfirm = true;
      const value = this.color.value;
      if (this.color.value != this.value) {
        this.$emit("input", value);
        this.$emit("change", value);
        this.dispatch("ElFormItem", "el.form.change", value);
      }
      this.showPicker = false;
    },
    clearValue() {
      // console.log("clear color => ", this.PredefineColor);
      if (this.PredefineColor) {
        this.$emit("input", null);
        this.$emit("change", null);
        if (this.value !== null) {
          this.dispatch("ElFormItem", "el.form.change", null);
        }
        // this.showPanelColor = false;
        // this.showPicker = false;
        this.resetColor();
        this.color.value = null;
      }
    },
    cancel() {
      this.showPanelColor = false;
      this.showPicker = false;
      this.resetColor();
      if (!this.value) {
        this.$emit("preValueChange", { value: null });
      }
      // this.$emit('cancel')
    },
    hide() {
      // console.log(this.PredefineColor, this.color, this.value, "66666666666");
      if (!this.isPickColor) {
        if (this.showPicker) {
          this.showPicker = false;
          if (this.PredefineColor) {
            this.confirmValue();
          } else {
            this.resetColor();
          }
        }
      }
    },
    resetColor() {
      this.$nextTick(_ => {
        if (this.value) {
          this.color.fromString(this.value);
        } else {
          this.showPanelColor = false;
        }
      });
    },
    displayedRgb(color, showAlpha) {
      if (!(color instanceof Color)) {
        throw Error("color should be instance of Color Class");
      }

      const { r, g, b } = color.toRgb();
      return showAlpha
        ? `rgba(${r}, ${g}, ${b}, ${color.get("alpha") / 100})`
        : `rgb(${r}, ${g}, ${b})`;
    },
    handleMarkColor() {
      this.$emit("mark");
    },
    dragEnd(color) {
      // 去除透明度
      color.set('alpha',100);
      this.$emit("dragEnd", color);
    }
  },

  mounted() {
    const value = this.value;
    if (value) {
      this.color.fromString(value);
    }
    this.popperElm = this.$refs.dropdown.$el;
    // eventBus.$on('pickColor', data => {
    //   this.color.fromString(data.color)
    // })
  },

  data() {
    const color = new Color({
      enableAlpha: this.showAlpha,
      format: this.colorFormat
    });

    return {
      color,
      showPicker: false,
      showPanelColor: false,
      isConfirm: false
    };
  },

  components: {
    PickerDropdown
  }
};
</script>
<style lang="scss">
  .el-color-picker__color{
    &.hascolor{
      background-image: none !important;
    }
  }
</style>