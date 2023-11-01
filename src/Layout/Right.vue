<template>
  <div class="sidebar">
    <a class="switch" @click="toggleRight">
      <span :class="['iconfont',isRightHidden?'iconarrow-left-bold':'iconarrow-right-bold']"></span>
    </a>
    <div class="sidebar-main">
      <div class="sidebar-cont" :class="{'hidden': $store.state.layout.isRightHidden}">
        <div class="design-effect">
          <ImgSwiper></ImgSwiper>
        </div>
        <!-- <div class="design-effect-box" :class="{'mini': isEffectMini}">
          <div class="design-effect" ref="designEffect" v-zwdrag>
            <div class="tit">
              <span class="tips">
                <el-tooltip
                  :enterable="false"
                  class="item"
                  effect="dark"
                  :content="`${isEffectFixed || !isEffectMini ? '拖拽可调节窗口大小、位置' : '点击“+”展开窗口'}`"
                  placement="top"
                  slot="reference"
                >
                  <span class="tips"><i class="iconfont icondrag-left"></i></span>
                </el-tooltip>
                
              </span>
              <div class="pr5">
                <span class="btn" @click="minimizeEffect"><i :class="['iconfont', isEffectFixed || !isEffectMini  ? 'iconbtn-Less' : 'iconbtn-add']"></i></span>
                <span class="btn" @click="suspendEffect"><i :class="['iconfont', isEffectFixed ? 'iconfloating-window' : 'iconreduction']"></i></span>
              </div>
            </div>
            <span class="top-left corner-pointer"></span>
            <span class="top-right corner-pointer"></span>
            <span class="bottom-left corner-pointer">
              <svg class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#iconleft-down-deformed"></use>
              </svg>
            </span>
            <span class="bottom-right corner-pointer"></span>
            <ImgSwiper></ImgSwiper>
          </div>
        </div> -->
        <div class="bottom-cont scroll-bar" id="rightTopContent">
          <GalleryDetail v-show="showType=='image'"></GalleryDetail>
          <TextDetail v-show="showType=='text'"></TextDetail>
          <GroupDetail v-show="showType=='group'"></GroupDetail>
          <part-detail v-if="showType == 'part'" :partDetailObj="partDetailObj"></part-detail>
          <div class="empty" v-show="!showType">
          <p> 当前定制面：{{selectFaceName}}</p>
          <p>推荐设计尺寸：{{selectFaceSize}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProductDetail from "@/components/Product/ProductDetail";
import GalleryDetail from "@/components/Gallery/GalleryDetail";
import TextDetail from "@/components/Text/TextDetail";
import GroupDetail from "@/components/Group/GroupDetail";
import PartDetail from "@/components/Product/PartDetail.vue";
import ImgSwiper from "@/components/DesignPreview/ImgSwiper";
import store from "@/store";
import eventBus from "@/utils/eventBus.js";
import { mapState } from 'vuex'
export default {
  components: {
    ProductDetail,
    GalleryDetail,
    TextDetail,
    GroupDetail,
    ImgSwiper,
    PartDetail,
},
  data() {
    return {
      isRightHidden: this.$store.state.layout.isRightHidden,
    };
  },
  computed: {
       ...mapState('product', {
      selectFaceName:state => state.selectedProductView.name,
      selectFaceSize:state => state.selectedProductView.size,
    }),
    partDetailObj() {
      return this.$store.state.product.partDetail;
    },
    showType() {
      return this.$store.state.layout.showType;
    },
    isEffectFixed(){
      return this.$store.state.layout.isEffectFixed;
    },
    isEffectMini(){
      return this.$store.state.layout.isEffectMini;
    },
  },
  methods: {
    toggleRight() {
      this.isRightHidden = !this.isRightHidden;
      this.$store.commit(
        "layout/toggleRight",
        !this.$store.state.layout.isRightHidden
      );
    },
    minimizeEffect(){
      let self = this;
      let dom = this.$refs.designEffect;
      let winWidth = document.documentElement.clientWidth || document.body.clientWidth;
      let winHeight = document.documentElement.clientHeight || document.body.clientHeight;
      if(this.isEffectFixed || !this.isEffectMini){
        dom.transitionHandler = function(e){
          dom.style.position = 'relative';
          dom.style.left = '0';
          dom.style.top = '0';
          dom.style.height = '352px';
          dom.style.transition = 'none';
          self.$store.commit('layout/changeEffectMiniStatus', true);
          self.$store.commit('layout/changeEffectFixedStatus',false);
          dom.removeEventListener('transitionend', dom.transitionHandler, false);
        }
        if(this.isEffectFixed){
          dom.removeEventListener('transitionend', dom.transitionHandler, false);
          dom.addEventListener('transitionend', dom.transitionHandler, false);
          dom.style.transition = 'all 0.4s';
          dom.style.left = (winWidth - 320) + 'px';
          dom.style.top = (winHeight - 32) + 'px';
          dom.style.width = '320px';
          dom.style.height = '32px';
        } else {
          dom.style.position = 'relative';
          dom.style.left = '0';
          dom.style.top = '0';
          dom.style.width = '320px';
          dom.style.height = '352px';
          dom.style.transition = 'none';
          self.$store.commit('layout/changeEffectMiniStatus', true);
          self.$store.commit('layout/changeEffectFixedStatus',false);
        }
      } else {
        dom.style.position = 'relative';
        dom.style.left = '0';
        dom.style.top = '0';
        dom.style.width = '320px';
        dom.style.height = '352px';
        self.$store.commit('layout/changeEffectMiniStatus',false);
        self.$store.commit('layout/changeEffectFixedStatus',false);
        eventBus.$emit("initDesignEffect", {start: false});
      }
    },
    suspendEffect(){
      let self = this;
      let dom = this.$refs.designEffect;
      let winWidth = document.documentElement.clientWidth || document.body.clientWidth;
      let winHeight = document.documentElement.clientHeight || document.body.clientHeight;
      if(this.isEffectFixed){
        dom.transitionHandler = function(e){
          dom.style.position = 'relative';
          dom.style.left = '0';
          dom.style.top = '0';
          dom.style.transition = 'none';
          self.$store.commit('layout/changeEffectFixedStatus', false);
          self.$store.commit('layout/changeEffectMiniStatus', false);
          eventBus.$emit("initDesignEffect", {start: false});
          dom.removeEventListener('transitionend', dom.transitionHandler, false);
        }
        dom.removeEventListener('transitionend', dom.transitionHandler, false);
        dom.addEventListener('transitionend', dom.transitionHandler, false);
        dom.style.transition = 'all 0.4s';
        dom.style.left = (winWidth - 320) + 'px';
        dom.style.top = (winHeight - 352) + 'px';
        dom.style.width = '320px';
        dom.style.height = '352px';
      } else {
        dom.style.position = 'fixed';
        dom.style.left = (winWidth - 450) + 'px';
        dom.style.top = (winHeight - 482) + 'px';
        dom.style.width = '450px';
        dom.style.height = '482px';
        self.$store.commit('layout/changeEffectFixedStatus', true);
        self.$store.commit('layout/changeEffectMiniStatus', false);
        eventBus.$emit("initDesignEffect", {start: false});
      }
    }
  },
  directives: {
    zwdrag: {
      bind: function(el, binding) {
        var downX, downY, thisX, thisY, stretch = false, stretchDirection = '', divPos = {}, stretchNum = 0
        let _handleDrag = function(e) {
          document.removeEventListener('mousemove', _handleStretch);
          let _left, _top, _width, _height;
          let winWidth = document.documentElement.clientWidth || document.body.clientWidth;
          let winHeight = document.documentElement.clientHeight || document.body.clientHeight;
          if(stretch && el.style.position=='fixed') { //拉伸
            stretchNum += 1
            if(stretchNum <= 3) {
              eventBus.$emit("initDesignEffect", {start: true});
            }
            switch(stretchDirection) {
              case 'left-top':
                _left = e.pageX;
                _top = divPos.top + e.pageX - divPos.left;
                _width = Math.abs(e.pageX - (divPos.left + divPos.width));
                _height = _width + 32;
                if(_left < 0 || _top < 0 || _width < 320) return;
                el.style.left = _left + 'px'
                el.style.top = _top + 'px'
                el.style.width = _width + 'px'
                el.style.height = _height + 'px'
                break
              case 'left-bottom':
                _left = e.pageX;
                _top = parseFloat(el.style.top);
                _width = Math.abs(e.pageX - (divPos.left + divPos.width));
                _height = _width + 32;
                if(_left < 0 || (_top+_height > winHeight) || _width < 320) return;
                el.style.left = _left + 'px'
                el.style.width = _width + 'px'
                el.style.height = _height + 'px'
                break
              case 'right-top':
                _left = parseFloat(el.style.left);
                _top = divPos.top + e.pageY - divPos.top;
                _width = Math.abs(e.pageY - (divPos.top + divPos.height ));
                _height = _width + 32;
                if(_top < 0 || (_left + _width > winWidth) || _width < 320) return;
                el.style.top = _top + 'px'
                el.style.width = _width + 'px'
                el.style.height = _height + 'px'
                break
              case 'right-bottom':
                _left = parseFloat(el.style.left);
                _top = parseFloat(el.style.top);
                _width = Math.abs(e.pageX - (divPos.left));
                _height = _width + 32;
                if((_left + _width > winWidth) || _top+_height > winHeight || _width < 320) return;
                el.style.width = _width+ 'px'
                el.style.height = _height + 'px'
                break
            }
          }else { //拖拽
            _left = e.pageX - (downX - thisX);
            _top = e.pageY - (downY - thisY);
            _width = el.clientWidth;
            _height = el.isStartFromMini ? 32 : el.clientHeight;
            if(_left < 0) _left = 0;
            if(_top < 0) _top = 0;
            if(_left + _width > winWidth) _left = winWidth - _width;
            if(_top + _height > winHeight) _top = winHeight - _height;
            el.style.position = 'fixed';
            el.style.left = _left + 'px';
            el.style.top = _top + 'px';
            store.commit('layout/changeEffectFixedStatus', true);
            // 当拖拽到右下角一定距离后直接嵌入到右侧
            if(
              winWidth - (_left + _width) <= 20 &&
              winHeight - (_top + _height) <=20 &&
              _width <= 320
            ){
              el.style.position = 'relative';
              el.style.left = '0';
              el.style.top = '0';
              store.commit('layout/changeEffectFixedStatus', false);
            }
          }
        }
        let _handleStretch = function(e) {
          divPos = el.getBoundingClientRect()
          if(e.pageX >= divPos.left - 10 && e.pageX <= divPos.left + 10 && e.pageY >= divPos.top - 10 && e.pageY <= divPos.top + 10) {
            el.style.cursor = 'nw-resize'
            stretchDirection = 'left-top'
            stretch = true
          }else if(e.pageX >= divPos.left - 10 && e.pageX <= divPos.left + 10 && e.pageY >= divPos.top + divPos.height - 10 && e.pageY <= divPos.top + divPos.height + 10) {
            el.style.cursor = 'sw-resize'
            stretchDirection = 'left-bottom'
            stretch = true
          }else if(e.pageX >= divPos.left + divPos.width - 10 && e.pageX <= divPos.left + divPos.width + 10 && e.pageY >= divPos.top - 10 && e.pageY <= divPos.top + 10) {
            el.style.cursor = 'ne-resize'
            stretchDirection = 'right-top'
            stretch = true
          }else if(e.pageX >= divPos.left + divPos.width - 10 && e.pageX <= divPos.left + divPos.width + 10 && e.pageY >= divPos.top + divPos.height - 10 && e.pageY <= divPos.top + divPos.height + 10) {
            el.style.cursor = 'se-resize'
            stretchDirection = 'right-bottom'
            stretch = true
          }else {
            el.style.cursor = 'auto'
            stretch = false
          }
        }
        el.addEventListener('mousedown', function(e) {
          if(
            el.firstChild.contains(e.target) ||
            (e.target.className.indexOf('btn-item') > -1) ||
            e.target.className.indexOf('corner-pointer') > -1
          ){
            // 点击位置
            downX = e.pageX;
            downY = e.pageY;
            // 元素原来左上角位置
            divPos = el.getBoundingClientRect()
            el.isStartFromMini = store.state.layout.isEffectMini;
            if(el.style.position == 'fixed') {
              thisX = el.offsetLeft;
              thisY = el.offsetTop;
            }else {
              thisX = el.getBoundingClientRect().left
              thisY = el.getBoundingClientRect().top
            }
            document.addEventListener('mousemove', _handleDrag);
          }
        })
        document.addEventListener('mouseup', function() {
          if(el.style.position == 'fixed') {
            document.addEventListener('mousemove', _handleStretch);
          }
          if(stretch) {
            stretchNum = 0
            eventBus.$emit("initDesignEffect", {start: false});
          }
          document.removeEventListener('mousemove', _handleDrag)
        })
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.sidebar {
  position: relative;
  .switch {
    position: absolute;
    display: flex;
    align-items: center;
    // width: 20px;
    // height: 20px;
    top: calc(50% - 50px);
    left: -18px;
    cursor: pointer;
    width: 18px;
    height: 50px;
    background: #ffffff;
    // box-shadow: 0px 12px 48px 16px rgba(0, 0, 0, 0.03),
    //   0px 9px 28px 0px rgba(0, 0, 0, 0.05),
    //   0px 6px 16px -8px rgba(0, 0, 0, 0.08);
    border-radius: 10px 0px 0px 10px;
  }
  .sidebar-main {
    display: flex;
  }
  .sidebar-cont {
    display: flex;
    flex-direction: column;
    width: 320px;
    height: calc(100vh - 55px);
    background: #fff;
    opacity: 1;
    // transition: all 0.3s;
    &.hidden {
      width: 0;
      opacity: 0;
      transition: all 0.3s;
    }
  }
  .design-effect-box{
    height: 320px;
    &.mini{
      height: 32px;
      overflow: hidden;
    }
  }
  .design-effect{
    display: flex;
    justify-content: center;
    align-items: center;
    *{
      user-select: none;
    }
     height: 320px;
    //  border: 1px solid #F6F6F6;
      box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.06);
    //  box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.05), 0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 3px 6px -4px rgba(0, 0, 0, 0.12);
     position: relative;
     z-index: 90;
     >.tit{
        height: 32px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #F6F6F6;
        box-shadow: 0px -4px 8px 0px rgba(0, 0, 0, 0.06);
        cursor: move;
        .tips{
          // cursor: default;
        }
        .btn{
          padding: 5px;
          cursor: pointer;
        }
     }
     >.corner-pointer{
       display: inline-block;
       width: 10px;
       height: 10px;
       background: transparent;
       position: absolute;
       z-index:99;
     }
     >.top-left{
       top:0;
       left: 0;
      //  cursor: nw-resize;
     }
     >.top-right{
       top: 0;
       right: 0;
      //  cursor: ne-resize;
     }
     >.bottom-right{
      bottom: 0;
      right: 0;
      // cursor: se-resize;
     }
     >.bottom-left{
       width: 18px;
       height: 18px;
       bottom: 0;
       left: 0;
      //  cursor: sw-resize;
       .svg-icon{
         width: 18px;
         height: 18px;
       }
       &::before{
         display: inline-block;
         content: '';
         position: absolute;
         top: 0;
         left:0;
         bottom:0;
         right:0;
       }
     }
  }
  .bottom-cont{
    flex: 1;
    overflow-y: auto;
    position: relative;
    >.empty{
      background: #FFFFFF;
      font-size: 14px;
      color: #666666;
      line-height: 18px;
      position: absolute;
      top: 0px;
      bottom: 20px;
      left: 20px;
      right: 20px;
      font-weight: 400;
      color: #8F919F;
      p{
        padding: 15px 0 ;
      &:first-child{
        border-bottom: 1px solid #F0F2F5;
        color: #37474F;
      }}
    }
  }
}
</style>