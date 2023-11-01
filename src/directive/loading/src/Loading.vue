<template>
  <div v-show="visible" class="loading-wrap">
    <div class="loading-box">
      <div class="zw-loader">
        <span class="spinner"></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: true
    };
  }
};
</script>
<style lang="scss" scoped>
.loading-wrap {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: #fff;
  z-index: 999;
}
.loading-box {
  position: absolute;
  left: 50%;
  top: 50%;
  // width: 100px;
  transform: translate(-50%, -50%);
}
</style>