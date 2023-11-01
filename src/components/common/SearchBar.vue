<template>
  <div class="searchbox relative">
    <div class="searchbar">
      <div class="left" ref="left">
        <div class="search-icon" @click="search">
          <i class="iconfont iconzoom"></i>
        </div>
        <input type="text" :placeholder="placeholder" v-model="searchInput" class="search-input" @keydown.enter="search" @focus="inputFocus" @blur="inputBlur" />
        <i class="el-icon-circle-close clear" @click="clearInput" v-show="searchInput!=''"></i>
      </div>
      <div v-if="showFilters" class="right filter" ref="filter" :class="{'active': isShowFilter || hasFilters}" @click="toggleFilter($event)">
        <span>
          <i class="iconfont iconcontrol-fill" v-if="isShowFilter || hasFilters"></i>
          <i class="iconfont iconcontrol" v-else></i>
        </span>
        <slot name="dot"></slot>
      </div>
    </div>
    <div class="dropdown-cont" :style="{'left': pos.left+'px', 'top': pos.top+'px'}">
      <div v-show="isShowFilter">
        <slot name="filter"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "搜索",
    },
    hasFilters: {
      type: Boolean,
      default: false
    },
    showFilters: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      searchInput: this.value,
      isShowFilter: false,
      pos: { left: 0, top: 0 },
    };
  },
  methods: {
    inputFocus() {
      this.$store.commit("shortcut/updateFocusStatus", true);
    },
    inputBlur() {
      this.$store.commit("shortcut/updateFocusStatus", false);
    },
    clearInput() {
      this.searchInput = "";
      this.$emit("clear");
    },
    toggleFilter(e) {
      if(this.placeholder.includes('产品名称')){
        this.$statisticalreport.clickNotDesignItemBtn('商品筛选')
      }else if(this.placeholder.includes('图片名称')){
        this.$statisticalreport.clickNotDesignItemBtn('图片筛选')
      }
      if (this.isShowFilter) {
        this.isShowFilter = false;
        this.$emit('close')
      } else {
        let objPos = this.$el.getBoundingClientRect();
        let left = this.$refs.filter.getBoundingClientRect().left;
        this.pos = Object.assign({
          left: left,
          top: objPos.bottom,
        });
        this.isShowFilter = true;
      }
    },
    hideFilter() {
      this.isShowFilter = false;
      this.$emit('close');
    },
    search() {
      this.$emit("save", this.searchInput);
    },
  },
  watch: {
    searchInput: function (nv) {
      this.$emit("input", nv);
    },
    value: function (nv) {
      this.searchInput = nv;
    },
  },
  mounted() {
    document.documentElement.addEventListener("click", (e) => {
      if (!this.$el.contains(e.target) || this.$refs.left.contains(e.target)) {
        if(this.isShowFilter){
          this.isShowFilter = false;
          this.$emit('close');
        }
      }
    });
  },
};
</script>

<style lang="scss" scoped>
.searchbox{
  width: 100%;
}
.searchbar {
  display: flex;
  align-items: center;
  width: 100%;
  font-size: 14px;
  .left {
    height: 32px;
    flex: 1;
    display: flex;
    align-items: center;
    @include border(1px, solid, "border_color1");
    border-radius: 16px;
  }
  .search-icon {
    width: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    flex-shrink: 0;
    flex-grow: 0;
  }
  .search-input {
    width: 100%;
    height: 100%;
    border: 0;
    flex: 1;
    background: transparent;
    border: 0;
    &:focus {
      outline: 0;
    }
  }
  .clear {
    padding: 0 10px;
    cursor: pointer;
  }
  .filter {
    width: 32px;
    height: 32px;
    border-radius: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 7px;
    cursor: pointer;
    position: relative;
    @include border(1px, solid, "border_color1");
    &.active {
      @include font_color("font_color2");
      @include background_color("background_color3");
      border-color: transparent !important;
    }
    &:hover {
      @include border(1px, solid, "border_color2");
    }
  }
}
/deep/ .searchbar .el-input {
  font-size: 14px;
}
/deep/ .searchbar .el-input__inner {
  padding: 0;
  height: 30px;
  border: 0;
  &:focus {
    outline: 0;
  }
}
.dropdown-cont {
  position: fixed;
  top: 2px;
  left: 0;
  z-index: 1000;
  background: #ffffff;
  box-shadow: 0px 0px 10px 0px rgba(210, 231, 247, 0.2);
  border-radius: 20px;
  @include border(1px, solid, "border_color1");
}
</style>