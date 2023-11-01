<template>
  <div class="text-box">
    <div class="add-text-btn" @click="handleAdd">
      <span class="el-icon-plus mr3"></span>
      <span>添加文字</span>
    </div>
  </div>
</template>
<script>
import eventBus from "@/utils/eventBus.js";
export default {
  data() {
    return {};
  },
  methods: {
    handleAdd() {
      this.$statisticalreport.addDesignItem('文字')
      this.$store.commit("layout/changeSelectType", "text");
      eventBus.$emit("addText");
    }
  }
};
</script>
<style lang="scss" scoped>
.text-box {
  width: 100%;
  height: 100%;
  padding: 20px 20px 0 20px;
}
.add-text-btn {
  width: 280px;
  height: 40px;
  background: #f0f5ff;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
</style>