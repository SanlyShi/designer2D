<template>
  <div class="product-name-operate-tip">
    <img :src="maskImg" class="mask-img" />
    <div class="mask-text" ref="maskText">
      <p>点击商品名，可查看商品详情</p>
      <el-button class="mt15" :round="true" @click="close">知道了</el-button>
      <span class="mask-text-triangle"></span>
    </div>
  </div>
</template>

<script>
import { genLocalStorageKey } from "@/utils/utils";
export default {
  name: 'ProductNameOperateTip',
  data(){
    return {
      maskImg: ''
    }
  },
  methods: {
    create() {
      let doc = document.documentElement || document.body;
      let docWidth = doc.clientWidth, docHeight = doc.clientHeight;
      let canvas = document.createElement('canvas');
      let ctx = canvas.getContext('2d');
      canvas.width = docWidth;
      canvas.height = docHeight;
      ctx.fillStyle = 'rgba(0, 0, 0, .4)';
      ctx.fillRect(0, 0, docWidth, docHeight);
      let targetEle = document.querySelector('.designer-footer-center');
      let targetElePos = targetEle.getBoundingClientRect();
      ctx.clearRect(targetElePos.left-10, targetElePos.top-10, targetElePos.width+20, targetElePos.height+20);
      this.maskImg = canvas.toDataURL();
      this.$nextTick(() => {
        let textEle = this.$refs.maskText;
        textEle.style.left = targetElePos.left + targetElePos.width/2 - textEle.clientWidth/2 + 'px';
        textEle.style.bottom = '90px';
      });
    },
    close(){
      this.$store.commit('product/updateIsShowProductOptTip', false);
      let customerId = this.$isLogin ? this.$OPTIONS.userInfo.code : "unlogin";
      let localStorageKey = genLocalStorageKey("noneProductDetailPopTipList")
      let noTipList = JSON.parse(localStorage.getItem(localStorageKey));
      if (!noTipList) noTipList = [];
      if (!noTipList.some((a) => a == customerId)) noTipList.push(customerId);
      localStorage.setItem(localStorageKey, JSON.stringify(noTipList));
    }
  },
  mounted () {
    this.create();
  },
};
</script>

<style lang="scss" scoped>
  .product-name-operate-tip{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99999;
  }
  .mask-text{
    position: fixed;
    padding: 30px;
    background: #1585FF;
    color: #fff;
    box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    text-align: center;
    .mask-text-triangle{
      display: inline-block;
      content: '';
      position: absolute;
      left: 50%;
      bottom: -20px;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-width: 10px;
      border-style: solid;
      border-color: #1585FF transparent transparent transparent;
    }
  }
  /deep/ .el-button--small.is-round{
    padding: 7px 15px; 
  }
</style>
