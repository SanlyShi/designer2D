<template>
  <!-- <el-dialog
      :width="is3d ? '540px' : '640px'"
      top="50px"
      custom-class="zw-effect-preview-pop"
      title
      :visible="true"
      :show-close="false"
      :modal-append-to-body="true"
      :append-to-body="true"
      :destroy-on-close="true"
      @close="closePreview"
    >       
    </el-dialog> -->
  <div
    ref="popupEl"
    class="large-effectImg-popup"
    v-zwtransport
  >
    <div class="popup-mask" @click="closePreview"></div>
    <div class="popup-inner" ref="popupInnerEl" :style="{'width': is3d ? '640px' : '760px', 'left': 0, 'top': '50px'}" v-zwdrag>
      <div class="large-effectImg-popup__title">
        <div class="title">效果图</div>
        <div class="type-btn-group" v-if="isShow3DBtn">
          <div :class="['btn-item btn-3d', is3d ? 'active' : '']" @click="changeShowImgtype(true, false)">3D</div>
          <div :class="['btn-item btn-2d', is3d ? '' : 'active']" @click="changeShowImgtype(false, false)">2D</div>
        </div>
        <i class="iconfont iconclose-bold close-pop-btn" @click="closePreview"></i>
      </div>
      <div class="large-effectImg-popup__content">
        <div class="fullscreenPreview-mainView">
          <div v-show="is3d" class="container-3d-large" id="3dCanvasLarge"></div>
          <div v-show="!is3d">
            <el-carousel
              ref="carousel"
              trigger="click"
              height="600px"
              :autoplay="false"
              indicator-position="none"
              :loop="false"
              :initial-index="curIndex"
              @change="handleCarouselchange"
            >
              <el-carousel-item v-for="(item,index) in detailImageList" :key="index">
                <div class="map-preview-img" v-loading="!item.rendered" v-if="!item.customBoardEntrance">
                  <template v-if="item.is_user_defined">
                    <img v-if="item.boardImg" :src="item.boardImg" alt="" style="width: 100%;height: 100%">
                  </template>
                  <template v-else>
                    <img v-show="item.image != '' && item.rendered" class="base-img" :src="item.image" alt />
                    <img v-show="item.maskImg != '' && item.rendered" class="mask-img" :src="item.maskImg" alt />
                    <template v-for="(img, indexs) in item.canvasImgArr">
                      <img class="canvas-img" :src="img" alt :key="indexs" />
                    </template>
                    <!-- <div class="hover-actions" @click.stop="handlePreview(item)">
                      <span class="img-preview">
                        <i class="el-icon-zoom-in"></i>
                      </span>
                    </div> -->
                  </template>
                </div>
                <div class="add-custom-board large" v-else>
                  <div class="tit">自定义底板</div>
                  <div class="desc mt15">专属的自定义产品展示效果图，让商品刊登效果与众不同</div>
                  <div class="mt15">
                    <a class="button mr10" @click.stop="addCustomBoard('buy')">购买底板</a>
                    <a class="button" @click.stop="addCustomBoard('add')" v-if="item.hasAuthUserDefined">自定义底板</a>
                  </div>
                  <a class="learn-more primary-color mt15" href="https://www.hicustom.com/frontend/HelperDocument/documentInfo?id=230" target="_blank">了解更多</a>      
                </div>
              </el-carousel-item>
            </el-carousel>
          </div>
          <div class="color-menu" v-if="colorList">
            <div
              :class="['color-box',colorIndex==index?'active':'']"
              v-for="(color,index) in colorList"
              :key="index"
              @click="ChangeProductColor(color,index)"
            >
              <span class="color-item">
                <a :style="{'background': '#'+color.color_tone1}"></a>
                <a :style="{'background': '#'+(color.color_tone2 ? color.color_tone2 : color.color_tone1)}"></a>
              </span>
              <span class="iconfont iconselect-bold checked-icon"></span>
            </div>
          </div>
        </div>
        <div class="fullscreenPreview-smallview" v-if="!is3d">
          <swiper class="swiper" id="swiper" :options="option" ref="mySwipersss">
            <swiper-slide v-for="(item,index) in detailImageList" :key="index">
              <div
                class="swiper-img-item"
                @click="selectItem(index)"
                :class="[curIndex==index?'active':'']"
                v-loading="!item.rendered"
                v-if="!item.customBoardEntrance"
              >
                <!-- <template v-if="item.rendered"> -->
                <div ref="detailImg">
                  <template v-if="item.rendered">
                    <template v-if="item.is_user_defined">
                      <img v-if="item.boardImg" :src="item.boardImg" alt="" style="width: 100%;height: 100%">
                      <svg class="img-icon icon svg-icon" aria-hidden="true">
                        <use xlink:href="#iconcustom-label"></use>
                      </svg>
                    </template>
                    <template v-else>
                      <img v-show="item.image != '' && item.rendered" class="img-small base-img" :src="item.image" alt />
                      <img
                        v-show="item.maskImg != '' && item.rendered"
                        class="img-small mask-img"
                        :src="item.maskImg"
                        alt
                      />
                      <template v-for="(img, indexs) in item.canvasImgArr">
                        <img class="img-small canvas-img" :src="img" alt :key="indexs" />
                      </template>
                      <svg class="img-icon icon svg-icon" aria-hidden="true" v-if="item.is_custom">
                        <use xlink:href="#iconcustom-label"></use>
                      </svg>
                    </template>
                  </template>
                </div>

                <!-- <template v-else>
                <div class="img-loading" ref="detailImg">
                  <img src="@/assets/img/design/alert-loading.gif" alt />
                </div>
                </template>-->
                <template v-if="item.rendered">
                  <div class="tips-mask" v-if="item.is_custom || item.is_user_defined">自定义底板{{item.customIndex}}</div>
                  <div class="tips-mask" v-else>效果图{{index+1}}</div>
                </template>
              </div>
              <div class="swiper-img-item add-custom-board" @click="selectItem(index)" :class="[curIndex==index?'active':'']" v-else>
                <a class="primary-color">自定义底板</a>
              </div>
            </swiper-slide>
            <!-- <swiper-slide>
              <div></div>
            </swiper-slide> -->
            <!-- <div class="swiper-pagination" slot="pagination"></div> -->
            <!-- <div class="swiper-button swiper-button-prev" slot="button-prev"></div>
            <div class="swiper-button swiper-button-next" slot="button-next"></div>-->
          </swiper>
          <el-button
            class="swiper-btn swiper-last-btn"
            @click="changeSwiperPage(-1)"
            v-show="this.detailImageList.length>=6"
          >
            <i class="el-icon-arrow-left"></i>
          </el-button>
          <el-button
            class="swiper-btn swiper-next-btn"
            @click="changeSwiperPage(1)"
            v-show="this.detailImageList.length>=6"
          >
            <i class="el-icon-arrow-right"></i>
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/css/swiper.css";
import eventBus from "@/utils/eventBus.js";
export default {
  props: {
    imgList: {
      type: Array,
      default: []
    },
    initType: {
      type: String,
      default: '2d'
    }
  },
  computed: {
    // 定义swiper，在下面就可以引用这个swiper了；
    swiper: function() {
      return this.$refs.mySwipersss.$swiper;
    },
    detailImageList() {
      // return this.$store.state.gallery.largeDetailImageList;
      if(this.$store.state.product.customBoardSupport){
        return [...this.$store.state.gallery.largeDetailImageList, {customBoardEntrance: true, buyPermission: this.$OPTIONS.permission.canBuyBottom, addPermission: this.$OPTIONS.permission.canAddBottom, hasAuthUserDefined: this.$OPTIONS.permission.hasAuthUserDefined}]
      } else {
        return this.$store.state.gallery.largeDetailImageList;
      }
    },
    product() {
      return this.$store.state.product.selectedProduct;
    },
    // 颜色尺码双向联动
    colorList() {
      if (this.product && this.product.colors) {
        return this.product.colors;
      } else {
        return [];
      }
    },
    isLargePreview: function() {
      return this.$store.state.gallery.isLargePreview;
    },
    curViewIndex: function() {
      return this.$store.state.gallery.swiperCurId;
    },
    isShowCustomBoard: function(){
      return this.$store.state.isShowCustomBoard;
    },
    isShow3DBtn(){
      let colorId = this.colorList[this.colorIndex].id;
      return this.product.is_show_3dimg != -1 && (this.product.show_3d_model[colorId] || this.product.show_3d_model['default'])
    },
    isSaveBoard() {
      return this.$store.state.isSaveBoard
    },
  },
  watch: {
    'isSaveBoard': {
      handler(nv, ov) {
        if(nv){
          setTimeout(()=>{
            const index = this.detailImageList.length>=2 ? this.detailImageList.length-2 : this.detailImageList.length-1;
            this.selectItem(0);
            this.swiper.slideTo(0, 1000, false);
          }, 300);
        }
      }
    },
  },
  data() {
    return {
      // carouselHeight: "704px",
      option: {
        autoplay: false,
        loop: false,
        direction: "vertical",
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        },
        slidesPerGroup: 5,
        spaceBetween: 20,
        initialSlide: 0,
        slidesPerView: 5,
        lazyLoading: true,

        on: {
          // 使用es6的箭头函数，使this指向vue对象
          click: () => {
            //通过$refs获取对应的swiper对象;
            // let swiper = this.$refs.mySwipersss.$swiper;
            // let i = swiper.activeIndex;
            // console.log(swiper, i);
          },

          transitionEnd: () => {
            this.$nextTick(() => {
              this.curViewImgCheck();
            });
          }
        }
      },
      curIndex: 0,
      curViewIndexList: [0, 1, 2, 3, 4, 5],
      imgelList: [],
      colorIndex: 0,
      is3d: false,
    };
  },

  components: {
    Swiper,
    SwiperSlide,
  },
  created() {
    this.is3d = this.initType=='3d';
    this.curIndex = this.curViewIndex;
    this.colorIndex = this.colorList.findIndex(item => {
      return item.id == this.$store.state.product.editingProduct.color;
    });
  },
  // beforeMount: function() {
  //   this.carouselHeight =
  //     parseFloat(document.documentElement.style.fontSize) * 7.04 + "px";
  // },
  mounted() {
    this.$forceUpdate()
    this.$nextTick(() => {
      if(!this.is3d){
        this.$refs.mySwipersss.$swiper.slideTo(this.curIndex, 1000, false);
        // this.curIndex = this.curViewIndex;
        // this.$refs.carousel.setActiveItem(this.curIndex); //不生效
      }
      let winWidth = document.documentElement.clientWidth || document.body.clientWidth;
      let winHeight = document.documentElement.clientHeight || document.body.clientHeight;
      let $innerEl = this.$refs.popupInnerEl;
      let popWidth = $innerEl.clientWidth;
      let popHeight = $innerEl.clientHeight;
      $innerEl.style.left = (winWidth - popWidth)/2 + 'px';
      $innerEl.style.top = (winHeight - popHeight)/2 + 'px';
      // let doc = document.documentElement || document.body;
      // doc.appendChild(this.$refs.popupEl);
    });
  },
  directives: {
    zwtransport: {
      inserted: function(el, binding) {
        let doc = document.documentElement || document.body;
        doc.appendChild(el);
      }
    },
    zwdrag: {
      inserted: function(el, binding){
        let winWidth, winHeight, popWidth, popHeight;
        let $titEl = el.firstChild;
        let dragHandler = function(e){
          let changeX = e.clientX - el.startPos.startX;
          let changeY = e.clientY - el.startPos.startY;
          let _left = el.startPos.left + changeX;
          let _top = el.startPos.top + changeY;
          if(_left < 0 ) _left = 0;
          if(_top < 0) _top = 0;
          if(_left + popWidth > winWidth) _left = winWidth - popWidth;
          if(_top + popHeight > winHeight) _top = winHeight - popHeight;
          el.style.left = _left + 'px'
          el.style.top = _top + 'px'
        }
        $titEl.addEventListener('mousedown', function(e){
          winWidth = document.documentElement.clientWidth || document.body.clientWidth;
          winHeight = document.documentElement.clientHeight || document.body.clientHeight;
          popWidth = el.clientWidth;
          popHeight = el.clientHeight;
          el.startPos = {
            left: parseFloat(el.style.left),
            top: parseFloat(el.style.top),
            startX: e.clientX,
            startY: e.clientY
          };
          document.addEventListener('mousemove', dragHandler);
        });
        document.addEventListener('mouseup', function() {
          document.removeEventListener('mousemove', dragHandler)
        });
      }
    }
  },
  methods: {
    changeShowImgtype(type, isSelectedProduct){
      this.is3d = type;
      this.$nextTick(() => {
        this.$store.commit("changeCurViewIndexList", {
          curViewIndexList:type ? [0] : this.curViewIndexList
        });
        this.$store.commit('gallery/changeDetailType', {type, isSelectedProduct} )
        if(!type) {
          this.$refs.mySwipersss.$swiper.slideTo(this.curIndex, 1000, false);
        }
      })
    },
    handleClick(e) {
      if (
        e.target.className == "content" ||
        e.target.className == "zw-fullscreenPreview"
      ) {
        this.closePreview();
      }
    },
    changeSwiperPage(i) {
      let curIndex = this.curIndex + i;
      if (curIndex < 0) {
        curIndex = this.detailImageList.length - 1;
      } else if (curIndex >= this.detailImageList.length) {
        curIndex = 0;
      }
      this.curIndex = curIndex;
      this.$refs.carousel.setActiveItem(curIndex);
      this.$refs.mySwipersss.$swiper.slideTo(this.curIndex, 1000, false);
    },
    closePreview() {
      this.$emit("close");
    },
    ChangeProductColor(item, index) {
      this.colorIndex = index;
      // 要切换的颜色不支持3D模型时，自动切换为2d
      if(this.is3d && !(this.product.show_3d_model[item.id] || this.product.show_3d_model['default'])){
        this.is3d = false;
        this.$store.commit('gallery/changeDetailType', {type: this.is3d, isSelectedProduct:false})
        this.$nextTick(() => {
          this.curViewImgCheck(true);
          eventBus.$emit("colorChange", { data: item});
        })    
      } else {
        this.curViewImgCheck();
        eventBus.$emit("colorChange", { data: item});
      }
      // 右侧产品选中的颜色跟着改变
      // let editingProduct = this.$store.state.product.editingProduct;
      // editingProduct.color = item.id;
      // this.$store.commit("product/updateEditingProduct", editingProduct);
    },
    getDetailImgRect() {
      this.imgelList = this.$refs["detailImg"];
    },
    //切换效果图(大图)
    handleCarouselchange(cur, pre) {
      if(this.is3d) return;
      this.$nextTick(function() {
        this.curIndex = cur;
        this.$refs.mySwipersss.$swiper.slideTo(cur, 1000, false);
      });
    },
    //选择小图
    selectItem(index) {
      this.$refs.carousel.setActiveItem(index);
      this.curIndex = index;
    },
    //计算是否在可视区域
    isIn(el) {
      let swiper = this.$refs.mySwipersss.$el;
      let swiperTop = swiper.getBoundingClientRect().top;
      let clientHeight = swiper.clientHeight;
      let bound = el.getBoundingClientRect();
      let boundTop = bound.top;
      return boundTop - swiperTop >= 0 && boundTop - swiperTop < clientHeight;
    },
    //检查图片是否在可视区内，如果不在，则加载
    curViewImgCheck(isChangeColor=false) {
      if(this.is3d) return;
      let self = this;
      let curViewIndexList = [];
      this.getDetailImgRect();
      let imageList = self.imgelList
      for(let i = 0; i < imageList.length - 1; i++) { //imageList顺序有问题，按从小到大重新排序
        for(let j = 0; j < imageList.length - i - 1; j++) {
          let boundi = imageList[j].getBoundingClientRect();
          let boundj = imageList[j + 1].getBoundingClientRect();
          if(boundi.top > boundj.top) {
            let aa = imageList[j]
            imageList[j] = imageList[j + 1]
            imageList[j + 1] = aa
          }
        }
      }
      Array.from(self.imgelList).forEach((el, i) => {
        if (self.isIn(el)) {
          curViewIndexList.push(i);
          // self.loadImg(el, i);
        }
      });
      this.curViewIndexList = curViewIndexList;
      this.$store.commit("changeCurViewIndexList", {
        curViewIndexList: this.curViewIndexList
      });
      if(isChangeColor) return;
      eventBus.$emit("swiperChange", {
        data: curViewIndexList,
        curIndex: this.curIndex
      });
    },
    loadImg(el, i) {
      if (!el.src) {
        el.src = this.imgList[i].small;
      }
    },
    getTop(e) {
      let T = e.offsetTop;

      while ((e = e.offsetParent)) {
        T += e.offsetTop;
      }
      return T;
    },
    addCustomBoard(type){
      if(!this.$isLogin){
        eventBus.$emit("showLoginPop");
      } else {
        if(type == 'buy'){
          if(this.$OPTIONS.permission.canBuyBottom){
            window.open(`/merchant/bottomTemplate/create?product_type_id=${this.product.id}`);
          } else {
            this.$message.error("无购买权限！");
          }
        }
        if(type == 'add'){
          if(this.$OPTIONS.permission.canAddBottom){
            // window.open(`/merchant/productType/edit?id=${this.product.id}&showCustomBoard=1`);
            this.$store.commit('updateIsShowCustomBoard', true);
            this.$store.commit('updateSaveBoard', false);
          } else {
            this.$message.error("无自定义底板权限！");
          }
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/ .zw-effect-preview-pop{
  .el-dialog__header{
    padding: 0 !important;
  }
  .el-dialog__body{
    padding: 0 !important;
  }
}
.large-effectImg-popup{
  font-size: 12px;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1001;
  &>.popup-mask{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,0.4);
  }
  &>.popup-inner{
    position: absolute;
    top: 0;
    left: 0;
    background: #fff;
    border-radius: 20px;
  }
}
.large-effectImg-popup__title{
  height: 56px;
  padding: 0 25px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: move;
  .title{
    font-size: 16px;
    font-weight: 700;
    color: rgba(0, 0, 0, 0.85);
  }
  .close-pop-btn{
    cursor: pointer;
  }
}
.large-effectImg-popup__content {
  padding: 20px;
  display: flex;
  justify-content: center;
  .fullscreenPreview-mainView {
    width:600px;
    position: relative;
    box-sizing: border-box;
    // .title {
    //   position: absolute;
    //   top: -44px;
    //   width: 100%;
    //   text-align: center;
    //   .name {
    //     font-weight: bold;

    //     color: rgba(0, 0, 0, 0.85);
    //   }
    //   .code {
    //     font-weight: 400;
    //     color: rgba(0, 0, 0, 0.45);
    //   }
    // }
    .el-carousel {
      width: 600px;
      height: 600px;
      position: relative;
      overflow: hidden;
      background: rgba(0, 0, 0, 0.04);
    }
    /deep/ .el-carousel__arrow{
      width: 18px;
      height: 50px;
      background: #FFFFFF;
      color: #37474F;
      font-size: 12px;
      &:hover{
        background: rgba(31,45,61,.23);
      }
    }
    /deep/ .el-carousel__arrow--left{
      left: 0 !important;
      border-radius: 0 3px 3px 0;
    }
    /deep/ .el-carousel__arrow--right{
      right: 0 !important;
      border-radius: 3px 0 0 3px;
    }
    .map-preview-img {
      width: 100%;
      height: 100%;
      position: relative;

      img {
        width: 100%;
        height: auto;
        position: absolute;
        left: 0;
        top: 0;
      }
      .mask-img {
        z-index: 3;
      }
      .canvas-img {
        z-index: 2;
      }
    }
    .color-menu {
      width: 100%;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      padding-top: 15px;
      padding-bottom: 5px;
      .color-box {
        width: 28px;
        height: 28px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 1px 1px 1px;
        position: relative;
        &:hover {
          border-radius: 50%;
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.15);
        }
        &.active {
          background: #e6f7ff;
          border-radius: 20px;
          border: 2px solid #0453F3;
          .checked-icon {
            display: flex;
          }
        }
        .color-item {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          border: 1px solid rgba(0, 0, 0, 0.15);
          cursor: pointer;
          a{
            display:inline-block;
            width: 8px;
            height: 16px;
            &:nth-child(1) {
              border-top-left-radius: 8px;
              border-bottom-left-radius: 8px;
              border-right: none;
            }
            &:nth-child(2) {
              border-top-right-radius: 8px;
              border-bottom-right-radius: 8px;
              border-left: none;
            }
          }
        }
        .checked-icon {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          font-size: 14px;
          display: none;
          justify-content: center;
          align-items: center;
          color: #0453F3;
        }
      }
    }
  }
  .fullscreenPreview-smallview {
    // height: px2rem(704);
    // margin-left: px2rem(20);
    height: 600px;
    margin-left: 20px;
    position: relative;
    .swiper-btn {
      position: absolute;
      border: none;
      outline: 0;
      padding: 0;
      margin: 0;
      height: px2rem(36);
      width: px2rem(36);
      cursor: pointer;
      transition: 0.3s;
      border-radius: 50%;
      background-color: rgba(31, 45, 61, 0.11);
      color: #fff;
      z-index: 10;
      text-align: center;
      font-size: 12px;
      &:hover {
        background-color: rgba(31, 45, 61, 0.5);
      }
      i {
        transform: rotate(90deg);
        -ms-transform: rotate(90deg); /* Internet Explorer */
        -moz-transform: rotate(90deg); /* Firefox */
        -webkit-transform: rotate(90deg); /* Safari 和 Chrome */
        -o-transform: rotate(90deg); /* Opera */
      }
      &.swiper-last-btn {
        top: 0px;

        left: 50%;
        transform: translate(-50%, -50%);
      }
      &.swiper-next-btn {
        bottom: 0px;
        left: 50%;
        transform: translate(-50%, 50%);
        // transform: translateY(50%);
      }
    }

    .swiper-container {
      width: 100px;
      height: 100%;
      // width: 90px;
      // width: px2rem(104);
      position: relative;
      overflow: hidden;
      z-index: 1;
      .swiper-slide {
        .swiper-img-item {
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-content: center;
          position: relative;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.04);
          border: 1px solid transparent;
          border-radius: 20px;
          overflow: hidden;
          &:hover {
            .tips-mask {
              display: block;

            }
            border: 1px solid rgba(0, 0, 0, 0.45);
          }
          .img-icon{
            position: absolute;
            right: 0;
            top: 0;
            color: #FF7700;
            font-size: 26px;
            z-index:1000;
          }
          .tips-mask {
            display: none;
            position: absolute;
            bottom: 0;
            left: 0;
            text-align: center;
            width: 100%;
            background: rgba(0, 0, 0, 0.4);
            color: #fff;
            // padding: 5px 0;
            // font-size: 14px;

            padding: px2rem(5) 0;
            font-size: px2rem(14);
            z-index: 10;
          }
          &.active {
            .tips-mask {
              display: block;
              background: #0453F3;
            }
            border: 3px solid #0453F3;
          }
          .img-small {
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
          }
          .mask-img {
            z-index: 3;
          }
          .canvas-img {
            z-index: 2;
          }
        }
      }
    }
    .swiper-container-vertical {
      .swiper-button {
        // width: 18px;
        // height: 50px;
        width: px2rem(18);
        height: px2rem(50);
        background: rgba(0, 0, 0, 0.06);
        // background-size: 10px 15px;
        background-size: px2rem(10) px2rem(15);
        border-radius: 3px 0px 0px 3px;
        &.swiper-button-disabled {
          display: none;
        }

        &:after {
          font-size: 12px;
          font-weight: 400;
          color: #fff;
        }
      }
      .swiper-button-prev {
        // background-image: url("/static/arrow_left.png");
        // top: 7px;
        top: px2rem(7);
        left: 50%;
        transform: translate(-50%, 0) rotate(90deg);
        &:hover {
          background: rgba(0, 0, 0, 0.25);
          border-radius: 0px 3px 3px 0px;
        }
      }
      .swiper-button-next {
        // background-image: url("/static/arrow_right.png");
        left: 50%;
        transform: translate(-50%, 0) rotate(90deg);
        // bottom: -14px;
        bottom: px2rem(-14);
        top: auto;
        &:hover {
          background: rgba(0, 0, 0, 0.25);
          border-radius: 3px 0px 0px 3px;
        }
      }
    }
  }
}
.type-btn-group {
  .btn-item {
    display: inline-block;
    width: 100px;
    height: 24px;
    line-height: 24px;
    border-radius: 20px;
    border: 1px solid #0453F3;
    text-align: center;
    font-size: 13px;
    color: #0453F3; 
    background: #fff;
    cursor: pointer;
    &.active{
      background: #0453F3; 
      color: #fff;
    }
    &.btn-3d{
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
    &.btn-2d{
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
}
/deep/ .container-3d-large {
  width: 600px;
  height: 600px;
  position: relative;
  background: rgba(0, 0, 0, 0.04);
  canvas {
    width: 100%;
    height: 100%;
    outline: none;
  }
}
.add-custom-board{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url("~@/assets/img/customer_board_bg.png");
  background-size: 100%;
  &.large{
    flex-direction: column;
    // background: url("~@/assets/img/customer_board_bg.png");
    // background-size: 100%;
  }
  .primary-color{
    color: #0453F3
  }
  .tit{
    font-size: 20px;
    font-weight: bold;
    color: #333;
  }
  .button {
    display: inline-block;
    padding: 0 20px;
    line-height: 30px;
    border-radius: 4px;
    box-sizing: border-box;
    @include border(1px, solid, "border_color3");
    @include background_color("background_color6");
    border-radius: 5px;
    color: #fff;
    cursor: pointer;
    text-decoration: none;
  }
}

</style>