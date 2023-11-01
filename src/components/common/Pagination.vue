<template>
  <div class="pagination">
    <a class="prev mr10" :class="{'disabled': curPage<=1}" @click="gotoPrev">
      <i class="iconfont iconarrow-left-bold"></i>
    </a>
    <input
      type="text"
      class="page-input"
      v-model="pageInput"
      @input="onlyNumber"
      @keydown.enter="changePage"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    <span class="ml5 mr5">/</span>
    <span class="total">{{totalPage}}</span>
    <a class="next ml10" :class="{'disabled': curPage>=totalPage}" @click="gotoNext">
      <i class="iconfont iconarrow-right-bold"></i>
    </a>
  </div>
</template>

<script>
export default {
  props: {
    total: {
      type: Number,
      default: 0
    },
    pageSize: {
      type: Number,
      default: 15
    },
    curPage: {
      type: Number|String,
      default: 1
    }
  },
  data() {
    return {
      pageInput: this.curPage
    };
  },
  computed: {
    totalPage() {
      if (this.total <= 0) {
        return 1;
      }
      return Math.ceil(this.total / this.pageSize);
    }
  },
  watch: {
    curPage() {
      this.pageInput = this.curPage;
    }
  },
  methods: {
    onlyNumber() {
      this.pageInput = this.pageInput.replace(/\D/g, "");
      if (Number(this.pageInput) == 0) {
        this.pageInput = "";
      }
    },
    gotoPrev() {
      if (this.curPage <= 1) {
        return;
      }
      this.pageInput = this.curPage - 1;
      this.changePage();
    },
    gotoNext() {
      if (this.curPage >= this.totalPage) {
        return;
      }
      this.pageInput = this.curPage + 1;
      this.changePage();
    },
    changePage() {
      if (!this.pageInput) {
        this.$message({ message: "请输入页码" });
        return;
      }
      if (parseInt(this.pageInput) > this.totalPage) {
        this.$message({ message: "输入的页码大于总页数" });
        return;
      }
      this.$emit("update:curPage", parseInt(this.pageInput));
      this.$emit("change", this.pageInput);
    },
    handleFocus(e) {
      this.$store.commit("shortcut/updateFocusStatus", true);
    },
    handleBlur() {
      this.$store.commit("shortcut/updateFocusStatus", false);
    }
  },
  watch: {
    curPage: function(nv) {
      this.pageInput = nv;
    }
  }
};
</script>

<style lang="scss" scoped>
.pagination {
  width: 100%;
  height: 44px;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}
.page-input {
  width: 50px;
  height: 24px;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  text-align: center;
  &:focus {
    outline: 0;
  }
}
.prev,
.next {
  cursor: pointer;
  color: #0453F3;
  &.disabled {
    color: #ccc;
  }
}
</style>