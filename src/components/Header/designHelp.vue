<template>
  <div class="box">
    <div class="header">
      <i class="iconfont iconinfo-circle-fill mr5"></i>设计说明
    </div>
    <div class="body scroll-bar">
      <div class="printarea">
        <div class="outline">
          <div class="inline">
            <div class="h-line"></div>
            <div class="v-line"></div>
          </div>
        </div>
      </div>
      <div class="desc-box">
        <div class="tit">
          <div class="line line1 mr5"></div>印花线
        </div>
        <div class="desc pt10">将背景图层延伸设计到此线条，以避免因设计未铺满生产区域导致实际生产效果出现边缘设计断层（留白或者留黑），影响实物美观。</div>
      </div>
      <div class="desc-box">
        <div class="tit">
          <div class="line line2 mr5"></div>裁缝线
        </div>
        <div class="desc pt10">实际生产需要裁切、缝合、包边的大概位置，设计时LOGO、图案和文字建议适当避开，否则可能造成图案不完整或实物效果偏差。</div>
      </div>
      <div class="desc-box">
        <div class="tit">
          <div class="line line3 mr5"></div>辅助线
        </div>
        <div class="desc pt10">主要用于协助判断设计图在产品中的相对位置，仅供参考。</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.box {
  width: 260px;
}
.header {
  width: 100%;
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  color: rgba(0, 0, 0, 0.85);
  padding: 0 15px;
  i {
    color: #0453F3;
  }
}
.body {
  padding: 20px 20px 0 20px;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
  .desc-box {
    border-top: 1px solid rgba(0, 0, 0, 0.06);
    padding: 15px 0;
  }
  .tit {
    display: flex;
    align-items: center;
    line-height: 22px;
    color: #37474f;
  }
  .line {
    display: inline-block;
    width: 24px;
    height: 0px;
  }
  .line1 {
    border: 2px solid #e61612;
  }
  .line2 {
    border: 2px dashed #353494;
  }
  .line3 {
    border: 2px dashed #9efd9d;
  }
  .desc {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.45);
    line-height: 20px;
  }
}
.printarea {
  width: 220px;
  height: 107px;
  background: url("~@/assets/img/design/Transparent_bg1.png") repeat top left;
  display: flex;
  justify-content: center;
  align-items: center;
  .outline {
    width: 160px;
    height: 80px;
    border: 2px solid #e61612;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .inline {
    width: 120px;
    height: 50px;
    border: 2px dashed #353494;
    position: relative;
  }
  .h-line {
    width: 80px;
    height: 1px;
    border: 1px dashed #9efd9d;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .v-line {
    width: 1px;
    height: 30px;
    border: 1px dashed #9efd9d;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>