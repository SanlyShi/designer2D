<template>
  <div class="carousel" :class="{'carousel-3d': is3d, 'show-3d-img': isShow3DBtn}">
    <div class="type-btn-group" v-if="isShow3DBtn">
      <div :class="['btn-item','btn-3d',is3d? 'active':'']" @click="changeShowImgtype(true, false)">3D</div>
      <div :class="['btn-item','btn-2d',is3d?'':'active']" @click="changeShowImgtype(false, false)">2D</div>
    </div>
    <div class="preview-btn" @click="handlePreview">
      <i class="iconfont iconzoom-in"></i> 预览
    </div>
    <div class="carousel--left">
      <div v-show="is3d" class="container-3d" id="3dCanvas" v-loading="detailImageList[0] && !detailImageList[0].rendered"></div>
      <el-carousel
        v-show="!is3d"
        ref="carousel"
        trigger="click"
        :autoplay="false"
        arrow="always"
        :loop="true"
        :initial-index="curIndex"
        @change="handleCarouselchange"
      >
        <el-carousel-item v-for="(item,index) in detailImageList" :key="index">
          <div
            class="map-preview-img"
            v-loading="!item.rendered && index == curIndex && imageMaskLoaded"
            @click="handlePreview(item)"
            :ref="'ref' + index"
            v-if="!item.customBoardEntrance">
            <!-- <template v-if="item.rendered"> -->
            <template v-if="item.is_user_defined">
              <img v-if="item.boardImg" :src="item.boardImg" alt="" style="width: 100%;height: 100%">
              <!-- <template v-for="(board, i) in item.boardArr">
                <div class="EEEEEEE" :style="{'transform': board.transform, 'transformOrigin': '0 0',width: '100%', height: '100%', position: 'absolute'}" :key="'board' + i">
                  <img v-show="board.image != '' && item.rendered" class="base-img" :src="board.image" alt />
                  <img v-show="board.maskImg != '' && item.rendered" class="mask-img" :src="board.maskImg" alt />
                  <template v-if="board.type == 2">
                    <div :id="'3dCanvas-board' + index + i" style="width: 100%;height: 100%;position: relative"></div>
                  </template>
                  <template v-else v-for="(img,indexs) in board.canvasImgArr">
                    <img class="canvas-img" :src="img" :key="indexs" />
                  </template>
                </div>
              </template> -->
            </template>
            <template v-else>
              <img v-show="item.image && item.rendered" class="base-img" :src="item.image" alt />
              <img
                @load="imageMaskLoaded = true"
                @change="imageMaskLoaded = false"
                v-show="item.maskImg && item.rendered"
                class="mask-img"
                :src="item.maskImg" alt />
              <template v-if="item.type == 2">
                <div :id="'3dCanvas' + index" style="width: 100%;height: 100%;position: relative"></div>
              </template>
              <template v-else v-for="(img,indexs) in item.canvasImgArr">
                <img class="canvas-img" :src="img" :key="indexs" />
              </template>
              <!-- <template v-for="(img,indexs) in item.canvasImgArr">
                <img class="canvas-img" :src="img" :key="indexs" />
              </template> -->
            </template>
          </div>
          <div class="add-custom-board" v-else>
            <a class="primary-color" @click.stop="addCustomBoard">自定义底板</a>
          </div>
        </el-carousel-item>
      </el-carousel>
      
    </div>
    <div class="carousel--right" ref="carouselRight" v-if="showSmallImg">
      <swiper class="swiper" id="swiper" :options="option" ref="mySwiper">
        <swiper-slide v-for="(item,index) in detailImageList" :key="index">
          <div
            class="swiper-img-item"
            @click="selectItem(index)"
            :class="[curIndex==index?'active':'']"
            v-loading="!item.rendered"
          >
            <!-- <template v-if="item.rendered"> -->
            <template>
              <div ref="detailImg" class="detailImg">
                <img v-show="item.image != ''" class="img-small base-img" :src="item.image" alt />
                <img v-show="item.maskImg != ''" class="img-small mask-img" :src="item.maskImg" alt />
                <template v-for="(img,indexs) in item.canvasImgArr">
                  <img class="img-small canvas-img" :src="img" :key="indexs" />
                </template>
              </div>
            </template>
            <!-- <template v-else>
              <div class="img-loading" ref="detailImg">
                <img src="@/assets/img/design/alert-loading.gif" alt />
              </div>
            </template>-->
            <div class="tips-mask" v-if="item.is_custom">独有底板{{item.customIndex}}</div>
            <div class="tips-mask" v-else>效果图{{index+1}}</div>
          </div>
        </swiper-slide>
        <!-- <div class="swiper-pagination" slot="pagination"></div> -->
        <div class="swiper-button swiper-button-prev" slot="button-prev"></div>
        <div class="swiper-button swiper-button-next" slot="button-next"></div>
      </swiper>
    </div>
    <!-- <button v-show="!is3d" class="el-arrow el-arrow--left" @click="changeArrow('pre')">
      <i class="iconfont iconarrow-left-bold"></i>
    </button>
    <button v-show="!is3d" class="el-arrow el-arrow--right" @click="changeArrow('next')">
      <i class="iconfont iconarrow-right-bold"></i>
    </button> -->
  
    <!-- <FullscreenPreview :imgList="imgList" :initType="is3d ? '3d' : '2d'" v-if="dialogVisible" @close="handleClose"></FullscreenPreview> -->
    <ImgLargePreview :imgList="imgList" :initType="is3d ? '3d' : '2d'" v-if="dialogVisible" @close="handleClose"></ImgLargePreview>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import FullscreenPreview from "./FullscreenPreview";
import ImgLargePreview from './ImgLargePreview.vue';
import "swiper/css/swiper.css";
import eventBus from "@/utils/eventBus.js";
export default {
  data() {
    return {
      imageMaskLoaded: false,

      showSmallImg: false,
      dialogVisible: false,
      is3d: false,

      option: {
        autoplay: false,
        loop: false,
        direction: "vertical",
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        },
        spaceBetween: 12,
        initialSlide: 0,
        slidesPerView: 4,
        lazyLoading: true,
        // touchMoveStopPropagation: true,
        on: {
          // 使用es6的箭头函数，使this指向vue对象
          click: e => {
            e.stopPropagation();

            //通过$refs获取对应的swiper对象;
            // let swiper = this.$refs.mySwiper.$swiper;
            // let i = swiper.activeIndex;
            // console.log(swiper, i);
          },

          transitionEnd: () => {
            let swiper = this.$refs.mySwiper.$swiper;
            var w =
              document.documentElement.clientWidth || document.body.clientWidth; //兼容IE8

            if (w > 1450 && swiper) {
              // console.log('1111swiperswiperswiper',swiper)
              this.curViewImgCheck();
            }
          }
        }
      },
      curIndex: 0,
      curViewIndexList: [0],
      imageList: [],
      imgList: [],
    };
  },
  components: {
    Swiper,
    SwiperSlide,
    FullscreenPreview,
    ImgLargePreview,
  },
  created() {},
  mounted() {
    eventBus.$on("slideTo", data => {
      if (!this.isLargePreview) {
        //当前非大图预览
        this.curIndex = data.curIndex;
        if (this.swiper) {
          this.$refs.mySwiper.$swiper.slideTo(data.curIndex, 1000, false);
        } else {
          this.$refs.carousel.setActiveItem(this.curIndex);
        }
      }
    });
    eventBus.$on("largePreview", data => {
      if (data) {
        this.handlePreview();
      } else {
        this.handleClose();
      }
    });
  },
  computed: {
    // 定义swiper，在下面就可以引用这个swiper了；
    swiper: function() {
      return this.showSmallImg ? this.$refs.mySwiper.$swiper : null;
    },
    detailImageList() {
      if(this.$store.state.product.customBoardSupport){
        return [...this.$store.state.gallery.detailImageList, {
          customBoardEntrance: true, 
          buyPermission: this.$OPTIONS.permission.canBuyBottom, 
          addPermission: this.$OPTIONS.permission.canAddBottom
        }]
      } else {
        return this.$store.state.gallery.detailImageList || [];
      }
    },
    isLargePreview: function() {
      return this.$store.state.gallery.isLargePreview;
    },
    product() {
      this.changeShowImgtype(false, true);
      return this.$store.state.product.selectedProduct;
    },
    isShowCustomBoard: function(){
      return this.$store.state.isShowCustomBoard;
    },
    is3dModel() {
      return this.$store.state.gallery.is3dModel;
    },
    isShow3DBtn(){
      let editingProduct = this.$store.state.product.editingProduct;
      return editingProduct&&editingProduct.color ? (this.product.is_show_3dimg != -1 && (this.product.show_3d_model[editingProduct.color] || this.product.show_3d_model['default'])) : false
    }
  },
  methods: {
    addCustomBoard(){
      if(!this.$isLogin){
        eventBus.$emit("showLoginPop");
      } else {
        if(this.$OPTIONS.permission.canAddBottom){
          this.$store.commit('updateIsShowCustomBoard', true);
          this.$store.commit('updateSaveBoard', false);
          // window.open(`/merchant/productType/edit?id=${this.product.id}&showCustomBoard=1`);
        } else {
          this.$message.error("无自定义底板权限！");
          // this.$confirm(
          //   "您当前账号等级为个人版，暂不支持使用自定义底板，是否进行账户升级？",
          //   "提示",
          //   {
          //     confirmButtonText: "去升级",
          //     cancelButtonText: "取消",
          //     type: "warning",
          //   }
          // ).then(() => {
          //   window.open("/merchant/vipLevel/index");
          // });
          // return false;
        }
      }
    },
    //切换图片2D 3D展示
    changeShowImgtype(type, isSelectedProduct) {
      this.is3d = type;
      this.$nextTick(() => {
        this.$store.commit("changeCurViewIndexList", {
          curViewIndexList:type ? [0] : [this.curIndex]
        });
        this.$store.commit('gallery/changeDetailType', {type, isSelectedProduct} )
      })
    },
    getDetailImgRect() {
      this.imageList = this.$refs["detailImg"];
    },
    //切换效果图(大图)
    handleCarouselchange(cur, pre) {
      if(this.is3d) return;
      // console.log('handleCarouselchange>>>', cur)
      this.$nextTick(function() {
        this.curIndex = cur;
        if (this.swiper) {
          this.$refs.mySwiper.$swiper.slideTo(cur, 1000, false);
        } else {
          let curIndex = this.curIndex;
          if (this.showSmallImg) {
            this.curViewIndexList = [
              curIndex,
              curIndex + 1,
              curIndex + 2,
              curIndex + 3
            ];
          } else {
            this.curViewIndexList = [curIndex];
          }
          this.$store.commit("changeCurViewIndexList", {
            curViewIndexList: this.curViewIndexList
          });
          eventBus.$emit("swiperChange", {
            data: this.curViewIndexList,
            curIndex: curIndex
          });
        }
      });
    },
    changeArrow(type) {
      let l = this.detailImageList.length;
      if (type == "next") {
        this.curIndex++;
        if (this.curIndex == l) {
          this.curIndex = 0;
        }
        this.$refs.carousel.setActiveItem(this.curIndex);
      } else {
        this.curIndex--;
        if (this.curIndex == -1) {
          this.curIndex = l - 1;
        }
        this.$refs.carousel.setActiveItem(this.curIndex);
      }
    },
    //选择小图
    selectItem(index) {
      this.$refs.carousel.setActiveItem(index);
      this.curIndex = index;
    },
    //预览大图
    handlePreview() {
       this.$statisticalreport.clickNotDesignItemBtn('预览')
      this.dialogVisible = true;
      
      this.$store.commit("changeCurViewIndexList", {
        curViewIndexList: [0, 1, 2, 3, 4, 5]
      });

      this.$store.commit("gallery/setLargePreviewState", true);
    },
    handleClose() {
      this.dialogVisible = false;
      this.$store.commit('gallery/changeDetailType', {type: this.is3d, isSelectedProduct: true});
      this.$store.commit("gallery/setLargePreviewState", false);
      // this.restoreColorDesign();
      this.$store.commit("changeCurViewIndexList", {
        //关闭大图重新设置小图的index
        curViewIndexList: this.is3d ? [0] : [this.curIndex]
      });
      this.curViewImgCheck();
    },
    //计算是否在可视区域
    isIn(el) {
      let swiper = this.$refs.mySwiper.$el;
      let swiperTop = swiper.getBoundingClientRect().top;
      let clientHeight = swiper.clientHeight;
      let bound = el.getBoundingClientRect();
      let boundTop = bound.top;
      return boundTop - swiperTop >= 0 && boundTop - swiperTop < clientHeight;
    },
    //检查图片是否在可视区内，如果不在，则加载
    curViewImgCheck() {
      if(this.is3d) return;
      let self = this;
      let curViewIndexList = [];
      if (this.swiper) {
        this.getDetailImgRect();
        Array.from(self.imageList).forEach((el, i) => {
          if (self.isIn(el)) {
            curViewIndexList.push(i);
            // self.loadImg(el, i);
          }
        });

        this.curViewIndexList = curViewIndexList.slice(-4);

        this.$store.commit("changeCurViewIndexList", {
          curViewIndexList: this.curViewIndexList
        });
        eventBus.$emit("swiperChange", {
          data: this.curViewIndexList,
          curIndex: this.curIndex
        });
      }
    },
    // restoreColorDesign() {
    //   let colorid = this.$store.state.product.editingProduct.color;
    //   let colorItem = this.product.colors.find(a => a.id == colorid);
    //   eventBus.$emit("colorChange", { data: colorItem });
    // },
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
    }
  },
  watch: {
    detailImageList: {
      deep: true,
      handler(val) {
        this.$nextTick(() => {
          // val.forEach((item, index) => {
          //   console.log(this.$refs[`ref${index}`])
          // this.$refs[`ref${index}`].$forceUpdate()

          // })
          this.$forceUpdate()
        })
      }
    },
    curIndex(nv) {
      this.$store.commit("gallery/setSwiperCurId", nv);
    },
    "product.code": {
      handler(nv) {
        // this.is3d = false
        // document.querySelector('.container-3d').innerHTML = ''
        // let canvas = document.createElement('canvas')
        // canvas.setAttribute('id', '3dCanvas')
        // document.querySelector('.container-3d').appendChild(canvas)

        // this.$store.commit('gallery/changeDetailType', this.is3d)
        this.$store.commit("changeCurViewIndexList", {
          curViewIndexList: [0, 1, 2, 3]
        });

        this.curIndex = 0;
        this.$refs.carousel.setActiveItem(0);
        if (this.swiper) {
          this.$refs.mySwiper.$swiper.slideTo(0, 1000, false);
        }
      }
    },
    is3dModel(nv) {
      if(!this.isLargePreview) {
        this.is3d = nv
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.carousel {
  width: 280px;
  height: 280px;
  display: flex;
  background: rgba(0, 0, 0, 0.04);
  border-radius: 5px;
  position: relative;
  justify-content: center;
  /deep/ .el-dialog__body {
    padding: 20px 20px;
  }
  .el-carousel {
    position: initial;
    height: 100%;;
    border-radius: 5px;
  }
  .el-arrow {
    border: none;
    outline: 0;
    padding: 0;
    margin: 0;
    height: 36px;
    width: 36px;
    cursor: pointer;
    transition: 0.3s;
    border-radius: 50%;
    background-color: rgba(31, 45, 61, 0.11);
    color: #fff;
    position: absolute;
    top: 50%;
    z-index: 10;
    transform: translateY(-50%);
    text-align: center;
    font-size: 12px;
    &:hover {
      background-color: rgba(31, 45, 61, 0.23);
    }
  }
  .el-arrow--left {
    left: 0;
  }
  .el-arrow--right {
    right: 0;
  }
  .type-btn-group {
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 10;
    .btn-item {
      display: inline-block;
      width: 40px;
      height: 24px;
      line-height: 24px;
      border-radius: 100px;
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
  .preview-btn{
    width: 66px;
    height: 32px;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 10px 0px 20px 0px;
    opacity: 0.4;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    right: 0;
    bottom: 0;
    z-index: 100;
    cursor: pointer;
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
    left: 0;
    border-radius: 0 10px 10px 0;
  }
  /deep/ .el-carousel__arrow--right{
    right: 0;
    border-radius: 10px 0 0 10px;
  }
  /deep/ .el-carousel__indicators--horizontal{
    bottom: -26px;
  }
  .carousel--left {
    width:100%;
    height: 100%;
    position: relative;
    
    /deep/ .container-3d {
      width: 100%;
      height: 100%;
      position: relative;
      canvas {
        width: 100%;
        height: 100%;
        outline: none;
      }
    }
    .map-preview-img {
      width: 100%;
      height: 100%;
      position: relative;
      cursor: zoom-in;
      // border: 1px solid rgba(0, 0, 0, 0.15);
      img {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        border-radius: 20px;
      }
      .mask-img {
        z-index: 3;
      }
      .canvas-img {
        z-index: 2;
      }
    }
  }
  &.show-3d-img {
    border-radius: 20px;
    .carousel--left {
      // margin-top: 30px;
    }
  }
  &.carousel-3d {
    padding: 0;
    .carousel--left {
      margin-top: 0;
      .type-btn-group {
        top: 16px
      }
    }
  }
  
  .carousel--right {
    flex: 1;
    position: relative;
    display: inline-flex;
    justify-content: center;
    align-items: center;

    .swiper-container {
      height: 100%;
      // width: 90px;
      position: relative;
      overflow: hidden;
      z-index: 1;
      .swiper-slide {
        .swiper-img-item {
          cursor: pointer;
          position: relative;
          width: 90px;
          height: 90px;
          border: 1px solid rgba(0, 0, 0, 0.15);
          .tips-mask {
            display: none;
            position: absolute;
            bottom: 0;
            left: 0;
            text-align: center;
            width: 100%;
            background: rgba(0, 0, 0, 0.4);
            color: #fff;
            padding: 5px 0;
            font-size: 14px;
            z-index: 10;
          }
          &:hover {
            .tips-mask {
              display: block;
            }
            border: 1px solid rgba(0, 0, 0, 0.45);
          }
          &.active {
            .tips-mask {
              display: block;
            }
            border: 2px solid #0453F3;
          }
          .detailImg {
            width: 100%;
            height: 100%;
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
          .img-loading {
            text-align: center;
            vertical-align: middle;
            img {
              width: 30px;
              height: 100%;
            }
          }
        }
      }
    }
    .swiper-container-vertical {
      .swiper-button {
        width: 18px;
        height: 50px;
        background: rgba(0, 0, 0, 0.06);
        background-size: 10px 15px;
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
        top: 7px;
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
        bottom: -14px;
        top: auto;
        &:hover {
          background: rgba(0, 0, 0, 0.25);
          border-radius: 3px 0px 0px 3px;
        }
      }
    }
  }
  .swiper-button-disabled {
    pointer-events: auto !important;
  }
}

// @media screen and (max-width: 1450px) {
  .el-arrow {
    display: none;
  }
  .carousel--right {
    display: none !important;
  }
  .carousel--left {
    // width: 240px !important;
    // height: 240px !important;
    width: 100%;
    height: 100%;
    /deep/ .el-carousel__container {
      // height: 240px !important;
      height: 100% !important;
    }
  }
  .carousel-3d {
    .carousel--left {
      width: 100% !important;
      height: 100% !important;
      /deep/ .el-carousel__container {
        height:100% !important;
      }
    }
  }
// }

// @media screen and (min-width: 1450px) and (max-width: 9999px) {
//   .carousel--right {
//     display: inline-flex !important;
//   }
//   .carousel--left {
//     width: 396px !important;
//     height: 396px !important;
//     /deep/ .el-carousel__container {
//       height: 396px !important;
//     }
//     /deep/ .el-carousel__arrow {
//       display: none;
//     }
//   }
//   .carousel-3d {
//     .carousel--left {
//       width: 100% !important;
//       height: 100% !important;
//       /deep/ .el-carousel__container {
//         height: 100% !important;
//       }
//       /deep/ .el-carousel__arrow {
//         display: none;
//       }
//     }
//   }
// }
.add-custom-board{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: url("~@/assets/img/customer_board_bg.png");
  background-size: 100%;
  .primary-color{
    color: #0453F3;
    text-decoration: none;
  }
}
</style>