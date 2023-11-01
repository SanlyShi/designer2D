<template>
  <div class="el-color-predefine">
    <div class="el-color-predefine__colors">
      <div class="el-color-predefine__color-selector"
           :class="{selected: item.selected, 'is-alpha': item._alpha < 100}"
           v-for="(item, index) in rgbaColors"
           :key="index"
           @click="handleSelect(index)">
        <div :style="{'background-color': item.value}">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Color from '../color';

  export default {
    props: {
      colors: { type: Array, required: true },
      color: { required: true },
      from: String
    },
    data() {
      return {
        rgbaColors: this.parseColors(this.colors, this.color)
      };
    },
    methods: {
      handleSelect(index) {
        this.colorSelect = true;
        this.color.fromString(this.colors[index]);
      },
      parseColors(colors, color) {
        return colors.map(value => {
          const c = new Color();
          c.enableAlpha = true;
          c.format = 'rgba';
          c.fromString(value);
          c.selected = c.value === color.value;
          return c;
        });
      },
    },
    watch: {
      '$parent.currentColor'(val) {
        const color = new Color();
        color.fromString(val);

        this.rgbaColors.forEach(item => {
          item.selected = color.compare(item);
        });
        if(this.colorSelect){
          this.$parent.$emit('predefine-change', this.from);
          this.colorSelect = false;
        }
      },
      colors(newVal) {
        this.rgbaColors = this.parseColors(newVal, this.color);
      },
      color(newVal) {
        this.rgbaColors = this.parseColors(this.colors, newVal);
      }
    }
  };
</script>

<style lang="scss" scoped>
.el-color-predefine{
  width: 100%;
}
.el-color-predefine__color-selector{
  margin: 0 4px 4px 0;
  width: 24px;
  height: 24px;
  border: 1px solid #e0e5ea;
}
</style>