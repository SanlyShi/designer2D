<template>
  <div>
    <div class="zwboard-mask"></div>
    <div class="zwboard-bomb" ref="zwboardBomb">
      <span class="pop-close" @click="close"><i class="boardiconfont close"></i></span>
      <div id="ZWBoard"></div>
    </div>
  </div>
</template>

<script>
  import {asyncLoadJS, asyncLoadCSS} from '@/utils/utils';
  export default {
    computed: {
      product() {
        return this.$store.state.product.selectedProduct;
      }
    },
    methods: {
      async initZWBoard(){
        let _this = this;
        if(window.location.href.includes('www.hicustom.com')){
          await asyncLoadCSS('//zwstatic.hicustom.com/template_static/zw_template.css');
          await asyncLoadJS('//zwstatic.hicustom.com/template_static/zw_template.umd.min.js');
        } else if(window.location.href.includes('www24.hicustom.com')){
          await asyncLoadCSS('//zwstatic207.hicustom.com/template_static/zw_template.css');
          await asyncLoadJS('//zwstatic207.hicustom.com/template_static/zw_template.umd.min.js');
        } else if(window.location.href.includes('sandbox2.zhiwendiy.com')){
          await asyncLoadCSS('//zwstatic1.zhiwendiy.com/template_static/zw_template.css');
          await asyncLoadJS('//zwstatic1.zhiwendiy.com/template_static/zw_template.umd.min.js');
        } else {
          await asyncLoadCSS('//zwstatic1.zwdc.com/template_static/zw_template.css');
          await asyncLoadJS('//zwstatic1.zwdc.com/template_static/zw_template.umd.min.js');
          // await asyncLoadCSS('http://devqh.zwdc.com:8016/static/boardtest/zw_template.css');
          // await asyncLoadJS('http://devqh.zwdc.com:8016/static/boardtest/zw_template.umd.min.js');
        }
        let docWidth = document.documentElement.clientWidth || document.body.clientWidth;
				let docHeight = document.documentElement.clientHeight || document.body.clientHeight;
				let bombWidth = docWidth > 1500 ? docWidth*0.8 : docWidth*0.95;
        let bombEl = this.$refs.zwboardBomb;
        bombEl.style.width = bombWidth + 'px';
        bombEl.style.height = docHeight - 100 + 'px';
        ZWBoard.init({
          containers: '#ZWBoard',
          productTypeId: _this.product.id,
          isEdit: false,
          bottomCode: '',
          canAdd: true,
          userInfo: _this.$OPTIONS.userInfo,
          uploadImgGuarantee: _this.$uploadImgGuarantee,
          leftUserDefinedBottomNum: _this.$OPTIONS.leftUserDefinedBottomNum,
          closeCallback: function(){
            _this.$emit('close', 'cancel');
          },
          saveCallback: function(){
            _this.$emit('save');
          }
        }, function() {})
      },
      close(){
        let welcomPop = document.querySelector('.zwboard-bomb .welcome-pop');
        if(welcomPop){
          this.$emit('close', null);
        } else {
          this.$emit('close', 'cancel');
        }
      }
    },
    mounted(){
      this.initZWBoard();
    }
  }
</script>

<style lang="scss" scoped>
.zwboard-mask{
	position:fixed;
	top: 0;
	bottom:0;
	left:0;
	right:0;
	z-index: 4000;
	background: rgba(0,0,0,0.5);
}
.zwboard-bomb{
	position:fixed;
	top:36px;
	left:50%;
	transform: translateX(-50%);
	-webkit-transform: translateX(-50%);
	z-index: 4001;
	background-color: #fff;
	border-radius: 5px;
  min-width: 1150px;
  >.pop-close{
		position: absolute;
		right: -30px;
		top:0;
		width: 30px;
		height: 30px;
		background: rgba(0,0,0,0.5);
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 14px;
		cursor:pointer;
  }
}
</style>
<style lang="scss">
  .zwboard-container{
    height: 100% !important;
  }
</style>