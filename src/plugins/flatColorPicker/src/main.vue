<template> 
  <div class="flat-color-picker" :style="{'width': width+'px'}">
    <picker-dropdown
      ref="dropdown"
      :class="['el-color-picker__panel', popperClass || '']"
      @pick="confirmValue"
      @clear="clearValue"
      :color="color"
      :show-alpha="showAlpha"
      :predefine="predefine"
      :show-color-straw="showColorStraw"
      :cachedefine="cachedefine"
      @predefine-change="predefineChange">
      <template slot="custom">
        <slot name="custom"></slot>
      </template>
    </picker-dropdown>
  </div>
</template>

<script>
  import Color from './color';
  import PickerDropdown from './components/picker-dropdown.vue';
  import Clickoutside from 'element-ui/src/utils/clickoutside';
  import Emitter from 'element-ui/src/mixins/emitter';

  export default {
    name: 'FlatColorPicker',
    components: {
      PickerDropdown
    },
    mixins: [Emitter],
    props: {
      value: String,
      showAlpha: Boolean,
      colorFormat: String,
      popperClass: String,
      predefine: Array,
      width: {
        default: 230
      },
      showColorStraw: Boolean,
      cachedefineTotal: {
        type: Boolean | String,
        default: 4
      },
      cachedefine: {
        type: Array,
        default: () => (['#fff', '#000']),
      }
    },
    data() {
      const color = new Color({
        enableAlpha: this.showAlpha,
        format: this.colorFormat
      });
      if(!this.value) color.value = null;
      return {
        color,
        showPanelColor: false
      };
    },
    computed: {
      displayedColor() {
        if (!this.value && !this.showPanelColor) {
          return 'transparent';
        }

        return this.displayedRgb(this.color, this.showAlpha);
      },
    },
    inject: {
      elForm: {
        default: ''
      },
      elFormItem: {
        default: ''
      }
    },
    directives: { Clickoutside },
    watch: {
      value(val) {
        if (!val) {
          this.showPanelColor = false;
          this.color.value = null;
        } else if (val && val !== this.color.value) {
          this.color.fromString(val);
        }
      },
      color: {
        deep: true,
        handler(val) {
          this.showPanelColor = true;
        }
      },
      displayedColor(val) {
        const currentValueColor = new Color({
          enableAlpha: this.showAlpha,
          format: this.colorFormat
        });
        currentValueColor.fromString(this.value);

        const currentValueColorRgb = this.displayedRgb(currentValueColor, this.showAlpha);
        if (val !== currentValueColorRgb) {
          this.$emit('active-change', val);
        }
      }
    },
    methods: {
      confirmValue() {
        const value = this.color.value;
        if(this.color.value){
          this.$emit('input', value);
          this.$emit('change', value);
          this.dispatch('ElFormItem', 'el.form.change', value);
          this.addColorToCache();
        }
      },
      clearValue() {
        if(!this.color.value) return;
        this.$emit('input', null);
        this.$emit('change', null);
        this.dispatch('ElFormItem', 'el.form.change', null);
        this.showPanelColor = false;
        this.resetColor();
        this.color.value = null;
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
          throw Error('color should be instance of Color Class');
        }

        const { r, g, b } = color.toRgb();
        return showAlpha
          ? `rgba(${ r }, ${ g }, ${ b }, ${ color.get('alpha') / 100 })`
          : `rgb(${ r }, ${ g }, ${ b })`;
      },
      predefineChange(data){
        this.$emit('predefine-change', data);
      },
      // 将选中的颜色加入缓存, 只显示最近几条记录
      addColorToCache(){
        let _cachedefineColors = this.cachedefine.map(item=>{
          const color = new Color({
            enableAlpha: false,
          });
          color.fromString(item);
          return color.value;
        });
        if(_cachedefineColors && _cachedefineColors.some(c=>c==this.color.value)) return;
        _cachedefineColors.unshift(this.color.value);
        _cachedefineColors = _cachedefineColors.slice(0, parseInt(this.cachedefineTotal));
        this.$emit('update:cachedefine', _cachedefineColors);
      }
    },
    mounted() {
      const value = this.value;
      if (value) {
        this.color.fromString(value);
      }
      this.popperElm = this.$refs.dropdown.$el;
    },
  };
</script>
<style lang="scss" scoped>

</style>