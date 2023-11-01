<template>
  <div class="zw-checkbox">
    <label class="item-all item mr10" v-if="isShowAll" :class="{'active': checkAll}" @click="checkAllHandler">全部</label>
    <template v-if="!isMultiple">
      <label v-for="item,index in data" :key="item.id" class="item mr10" :class="{'active': checked==item.id, 'hidden': isFold&&!displayAll&&index>=foldNumber}">
        {{item.name}}
        <input type="radio" :value="item.id" v-model="checked" />
      </label>
      <a class="item show-more" v-if="isFold&&!displayAll&&data.length>foldNumber" @click.stop="displayAllHandler">更多</a>
    </template>
    <template v-else>
      <template v-if="checkItemType=='text'">
        <label v-for="item,index in data" :key="item.id" class="item mr10" :class="{'active': checkedItems.some(a=>a==item.id), 'hidden': isFold&&!displayAll&&index>=foldNumber}">
          {{item.name}}
          <input type="checkbox" :value="item.id" v-model="checkedItems" />
        </label>
        <a class="item show-more" v-if="isFold&&!displayAll&&data.length>foldNumber" @click.stop="displayAllHandler">更多</a>
      </template>
      <template v-else-if="checkItemType=='color'">
        <label v-for="item in data" :key="item.id" class="color-label mr10" :class="{'active': checkedItems.some(a=>a==item.id)}">
          <div class="color-item" :style="{'background-color':item.color}">
            <!-- <i class="icon-tick">✔</i> -->
            <input type="checkbox" :value="item.id" v-model="checkedItems" />
          </div>
        </label>
      </template>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    // 数据
    data: {
      type: Array,
      default: () => [],
    },
    // 是否显示全部
    isShowAll: {
      type: Boolean,
      default: true,
    },
    // 是否多选
    isMultiple: {
      type: Boolean,
      default: false,
    },
    // 是否支持折叠
    isFold: {
      type: Boolean,
      default: false
    },
    // 超过几个时折叠
    foldNumber:{
      type: Number,
      default: 4,
    },
    // 是否范围
    isRange: {
      type: Boolean,
      default: false,
    },
    //选项类型
    checkItemType: {
      type: String,
      default: "text",
    },
    // 选中值
    value: "",
    from: "",
    to: "",
  },
  data() {
    return {
      checkAll: true,
      checked: "",
      checkedItems: [],
      displayAll: false,
    };
  },
  methods: {
    checkAllHandler() {
      this.checkAll = true;
      this.checked = "";
      this.checkedItems = [];
    },
    initData() {
      if (this.isRange) {
        let selectedItem = this.data.find(
          (a) => a.from == this.from && a.to == this.to
        );
        this.checked = selectedItem ? selectedItem.id : "";
      } else {
        if (this.isMultiple) {
          this.checkedItems = this.value ? this.value.split(",") : [];
        } else {
          this.checked = this.value;
        }
      }
    },
    displayAllHandler(){
      this.displayAll = true;
    }
  },
  watch: {
    checked: {
      handler: function (nv, ov) {
        this.checkAll = nv !== "" ? false : true;
        if (this.isRange) {
          // 范围默认单选
          let selectedItem = this.data.find((a) => nv == a.id);
          this.$emit("update:from", selectedItem ? selectedItem.from : "");
          this.$emit("update:to", selectedItem ? selectedItem.to : "");
        } else {
          this.$emit("input", nv);
        }
      },
      immediate: true,
    },
    checkedItems: {
      handler: function (nv, ov) {
        this.checkAll = nv.length ? false : true;
        this.$emit("input", nv.join(","));
      },
      immediate: true,
    },
    value: {
      handler: function (nv, ov) {
        this.initData();
      },
      immediate: true,
    },
    from: {
      handler: function (nv, ov) {
        this.initData();
      },
      immediate: true,
    },
    to: {
      handler: function (nv, ov) {
        this.initData();
      },
      immediate: true,
    },
  },
  created(){
    this.displayAll = this.isFold ? false : true;
  },
};
</script>

<style lang="scss" scoped>
.zw-checkbox {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  .item {
    display: inline-block;
    padding: 4px 10px;
    line-height: 22px;
    border: 1px solid transparent;
    border-radius: 16px;
    cursor: pointer;
    margin-bottom: 10px;
    word-break: break-all;
    &.hidden{
      display: none;
    }
    &.active {
      @include background_color("background_color9");
      @include font_color("font_color2");
    }
    &:hover {
      @include border(1px, solid, "border_color1");
    }
    &.show-more{
      color: #0453F3;
      cursor: pointer;
      border: none !important;
      &:hover{
        border: none !important;
      }
    }
  }
  .color-label {
    width: 28px;
    height: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: -10px;
    &.active {
      background: #e6f7ff;
      border-radius: 5px;
      border: 1px solid #91d5ff;
    }
    &:hover {
      background: #ffffff;
      border-radius: 5px;
      border: 1px solid rgba(0, 0, 0, 0.15);
    }
    .color-item {
      display: inline-block;
      width: 20px;
      height: 20px;
      border-radius: 3px;
      cursor: pointer;
      color: #fff;
      // display: flex;
      // justify-content: center;
      // align-items: center;
      // &.active {
      //   .icon-tick {
      //     display: inline-block;
      //   }
      // }
      // &:not(.active) {
      //   .icon-tick {
      //     display: none;
      //   }
      // }
    }
  }

  input[type="checkbox"],
  input[type="radio"] {
    display: none;
  }
}
</style>