<template>
  <div class="sort-box">
    <div class="sort-item" v-for="item in data" :key="item.field" :class="{'active': item.field==sortField}" @click="changeSort(item)">
      {{item.name}}
      <div class="sort-icons">
        <i class="sort-icon up el-icon-caret-top" :class="{'active': item.field==sortField && sortType=='asc'}"></i>
        <i class="sort-icon down el-icon-caret-bottom" :class="{'active': item.field==sortField && sortType=='desc'}"></i>
      </div>
    </div>
    <slot name="other"></slot>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    sortField: "",
    sortType: "",
  },
  methods: {
    changeSort(item) {
      let data = {
        sortField: item.field,
        sortType:
          item.field == this.sortField
            ? this.sortType == "desc"
              ? "asc"
              : "desc"
            : "desc",
      };
      this.$emit("update:sortField", data.sortField);
      this.$emit("update:sortType", data.sortType);
      this.$emit("change", data);
    },
  },
};
</script>

<style lang="scss" scoped>
.sort-box {
  width: 100%;
  height: 32px;
  border-radius: 16px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  @include background_color("background_color3");
}
.sort-item {
  height: 100%;
  display: flex;
  align-items: center;

  cursor: pointer;
  &.active {
    @include font_color("font_color2");
  }
  .sort-icons {
    line-height: 6px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .sort-icon {
    color: #777A8B;
    line-height: 6px;
    &.active {
      @include font_color("font_color2");
    }
  }
}
</style>