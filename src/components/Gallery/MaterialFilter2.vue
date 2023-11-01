<template>
  <div class="search-filter-form __zw-search-filter-form">
    <div class="search-title">
      <i class="el-icon-close" @click="close"></i>
    </div>
    <div class="search-field scroll-bar" style="max-width:800px;max-height:500px;overflow-y:auto">
      <div class="form-item">
        <div class="label">
          适用场景
        </div>
        <div class="cont flex">
          <CheckBox :data="filterData.sceneData" v-model="form.scence" :isMultiple="true" :is-fold="true" :fold-number="4"></CheckBox>
        </div>
      </div>
      <!-- <div class="form-item">
        <div class="label">
          适用品类
        </div>
        <div class="cont flex">
          <CheckBox :data="filterData.cgData" v-model="form.product_type_category" :isMultiple="true" :is-fold="true" :fold-number="4"></CheckBox>
        </div>
      </div> -->
      <div class="form-item">
        <div class="label">
          设计风格
        </div>
        <div class="cont flex">
          <CheckBox :data="filterData.styleData" v-model="form.design_style" :isMultiple="true" :is-fold="true" :fold-number="4"></CheckBox>
        </div>
      </div>
    </div>
    <div class="operates pr20">
      <a class="button mr10" @click="formHandler('reset')">清除</a>
      <a class="button primary" @click="formHandler('save')">应用筛选条件</a>
    </div>
  </div>
</template>

<script>
import CheckBox from "@/components/common/CheckBox";

export default {
  props: {
    value: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    CheckBox,
  },
  computed: {
    config() {
      return this.$store.state.layout.designerConfig;
    },
  },
  watch: {
    config: {
      handler(val) {
        let {productTypeCategoryMap, sceneMap, designStyleMap} = val;
        // this.filterData.cgData = productTypeCategoryMap;
        this.filterData.sceneData = sceneMap;
        this.filterData.styleData = designStyleMap;
      },
      immediate: true,
    },
    value: {
      handler(val) {
        this.form = Object.assign({}, this.form, val);
      },
      immediate: true,
    },
  },
  data() {
    return {
      form: {
        // product_type_category: '',
        scence: '',
        design_style: ''
      },
      filterData: {},
    };
  },
  created() {},

  methods: {
    formHandler(type) {
      switch (type) {
        case "reset":
          Object.keys(this.form).forEach((key) => {
            this.$set(this.form, key, "");
          });
          this.$emit("reset", this.form);
          break;
        case "cancel":
          this.$parent.hideFilter();
          this.$emit("cancel", this.form);
          break;
        case "save":
          this.$parent.hideFilter();
          this.$emit("save", this.form);
          break;
      }
    },
    handleFocus(e) {
      this.$store.commit("shortcut/updateFocusStatus", true);
    },
    handleBlur() {
      this.$store.commit("shortcut/updateFocusStatus", false);
    },
    close() {
      this.$parent.hideFilter();
    },
  },
};
</script>

<style lang="scss" scoped>
$primary: #0453F3;
.label-tips {
  .title {
    padding: 9px 16px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    .title-icon {
      color: $primary;
      margin-right: 4px;
    }
    .title-text {
      font-weight: bold;
      color: rgba(0, 0, 0, 0.85);
    }
  }
  .content {
    padding: 8px 8px 10px 8px;
    .shapeList-cont {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      padding: 11px 0 13px 0;
      .shapeList-item-cont {
        display: flex;
        flex-direction: column;
        align-items: center;

        .shapeList-item-imgoutCont {
          width: 40px;
          height: 40px;
          background: #ffffff;
          padding: 4px;
          border: 1px dashed rgba(0, 0, 0, 0.15);
          box-sizing: border-box;
          .shapeList-item {
            background: #e6f7ff;
            border: 1px solid #91d5ff;
            &.item1 {
              width: 100%;
              height: 100%;
            }
            &.item2 {
              width: 100%;
              height: 24px;
            }
            &.item3 {
              width: 24px;
              height: 100%;
            }
            &.item4 {
              width: 100%;
              height: 16px;
            }
            &.item5 {
              width: 16px;
              height: 100%;
            }
          }
        }
        .item-name {
          color: rgba(0, 0, 0, 0.85);
        }
        .item-detail {
          color: rgba(0, 0, 0, 0.65);
        }
      }
    }
  }
}
</style>