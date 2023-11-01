<template>
  <div class="zw-fullscreenPreview" @click="handleClick">
    <header class="header">
      <span class="iconfont iconclose-bold close-btn" @click="colosePreview"></span>
    </header>
    <section class="content">
      <div class="fullscreenPreview-mainView">
        <div class="type-btn-group" v-if="product.is_show_3dimg!=-1">
          <div :class="['btn-item btn-3d', is3d ? 'active' : '']" @click="changeShowImgtype(true, false)">3D</div>
          <div :class="['btn-item btn-2d', is3d ? '' : 'active']" @click="changeShowImgtype(false, false)">2D</div>
        </div>
        <div class="title">
          <span class="f16 mr4 name">{{product.name}}</span>
          <span class="code f14">(编号:{{product.id}})</span>
        </div>
        <div v-show="is3d" class="container-3d-large">
          <canvas id="3dCanvasLarge"></canvas>
        </div>
        <div v-show="!is3d">
          <el-carousel
            ref="carousel"
            trigger="click"
            :height="carouselHeight"
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
                  <div class="hover-actions" @click.stop="handlePreview(item)">
                    <span class="img-preview">
                      <i class="el-icon-zoom-in"></i>
                    </span>
                  </div>
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
            <span class="color-item" :style="{'background-color':'#'+color.color_tone1}"></span>
          </div>
        </div>
      </div>
      <div class="fullscreenPreview-smallview" v-show="!is3d">
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
          v-show="this.detailImageList.length>=7"
        >
          <i class="el-icon-arrow-left"></i>
        </el-button>
        <el-button
          class="swiper-btn swiper-next-btn"
          @click="changeSwiperPage(1)"
          v-show="this.detailImageList.length>=7"
        >
          <i class="el-icon-arrow-right"></i>
        </el-button>
      </div>
    </section>
    <CustomBoard v-if="isShowCustomBoard" @close="closeCustomBoard" @save="saveCustomBoard"></CustomBoard>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import CustomBoard from './CustomBoard';
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
    // largePreviewType(){
    //   return this.$store.state.gallery.largePreviewType;
    // },
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
  },
  data() {
    return {
      carouselHeight: "704px",
      option: {
        autoplay: false,
        loop: false,
        direction: "vertical",
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        },
        slidesPerGroup: 6,
        spaceBetween: 12,
        initialSlide: 0,
        slidesPerView: 6,
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
      curViewIndexList: [],
      imgelList: [],
      colorIndex: 0,
      is3d: false,
    };
  },

  components: {
    Swiper,
    SwiperSlide,
    CustomBoard
  },
  created() {
    this.colorIndex = this.colorList.findIndex(item => {
      return item.id == this.$store.state.product.editingProduct.color;
    });
    this.is3d = this.initType=='3d';
    // this.is3d = this.largePreviewType=='3d';
  },
  beforeMount: function() {
    this.carouselHeight =
      parseFloat(document.documentElement.style.fontSize) * 7.04 + "px";
  },
  mounted() {
    this.$nextTick(() => {
      if(!this.is3d){
        this.curIndex = this.curViewIndex;
        this.$refs.carousel.setActiveItem(this.curIndex);
        this.$refs.mySwipersss.$swiper.slideTo(this.curIndex, 1000, false);
      }
      this.updatePreviewInfo(true)
    });
  },
  methods: {
    updatePreviewInfo(isInit=false){
      if(!this.is3d){
        this.curIndex = this.curViewIndex;
        this.$refs.carousel.setActiveItem(this.curIndex);
        this.$refs.mySwipersss.$swiper.slideTo(this.curIndex, 1000, false);
      } else {
        // if(!isInit){
        //   this.$nextTick(()=>{
        //     eventBus.$emit('updateLarge3DPreview');
        //   })
        // }
      }
    },
    changeShowImgtype(type, isSelectedProduct){
      this.is3d = type;
      // if(type){
      //   this.$store.commit("changeCurViewIndexList", {
      //     curViewIndexList:[0]
      //   });
      // } 
      this.$nextTick(() => {
        this.$store.commit('gallery/changeDetailType', {type, isSelectedProduct} )
      })
      // this.$nextTick(()=>{
      //   this.$store.commit('gallery/changeLargePreviewType', type? '3d' : '2d');
      // })
      // this.updatePreviewInfo();
    },
    handleClick(e) {
      if (
        e.target.className == "content" ||
        e.target.className == "zw-fullscreenPreview"
      ) {
        this.colosePreview();
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
    colosePreview() {
      this.$emit("close");
    },
    ChangeProductColor(item, index) {
      this.$nextTick(() => {
        //12月新需求：不同颜色模型与细节图数量不一致，导致前一个颜色3张细节图切到下一个颜色4张细节图时，第四张细节图无法渲染  start
        let detailList = [];
        let colors = this.is3dModel
          ? this.product.show_3d_model.colors
          : this.product.colors;
        for (let color of colors) {
          if (color.id == item.id) {
            if (!color.detail) {
              for (let view of color.views) {
                // if (view.id == viewId) {
                  detailList.push(view);
                // }
              }
              break;
            }
            detailList = color.detail;
            break;
          }
        }
        let list = detailList.map((detail) => {
          let detailObj = {};
          detailObj.rendered = true;
          /**
           * 3d切换颜色，v-if="type" 会导致重新渲染，内部canvas消失，
           * 这里添加type字段
           * 如果这里不添加type而上一个颜色有type字段，会导致vue重新渲染节点
           */
          detailObj.type = detail.parts ? detail.parts[0].type : '';
          return detailObj;
        });
        this.$store.commit("gallery/getLargeDetailImageList", {
          data: list,
        });
        //end
        this.$nextTick(() => {
          this.colorIndex = index;
          this.curViewImgCheck();
          eventBus.$emit("colorChange", { data: item });
          // console.log('changeProductColor ===> ', item);
          // 右侧产品选中的颜色跟着改变
          let editingProduct = this.$store.state.product.editingProduct;
          editingProduct.color = item.id;
          this.$store.commit("product/updateEditingProduct", editingProduct);
        })
      })
    },
    getDetailImgRect() {
      this.imgelList = this.$refs["detailImg"];
    },
    //切换效果图(大图)
    handleCarouselchange(cur, pre) {
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

      return boundTop - swiperTop < clientHeight;
    },
    //检查图片是否在可视区内，如果不在，则加载
    curViewImgCheck() {
      if(this.is3d) return;
      let self = this;
      let curViewIndexList = [];
      this.getDetailImgRect();
      Array.from(self.imgelList).forEach((el, i) => {
        if (self.isIn(el)) {
          curViewIndexList.push(i);
          // self.loadImg(el, i);
        }
      });
      this.curViewIndexList = curViewIndexList.slice(-7);
      this.$store.commit("changeCurViewIndexList", {
        curViewIndexList: this.curViewIndexList
      });
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
    },
    closeCustomBoard(type){
      this.$store.commit('updateIsShowCustomBoard', false);
      this.$store.commit('updateSaveBoard', false);
    },
    saveCustomBoard(){
      this.$store.commit('updateIsShowCustomBoard', false);
      this.$store.commit('updateSaveBoard', true);
      // setTimeout(()=>{
      //   location.reload();
      // }, 1000);
    },
  }
};
</script>
<style lang="scss" scoped>
.zw-fullscreenPreview {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  -webkit-overflow-scrolling: touch;
  width: 100vw;
  height: 100vh;
  padding: 30px 0 0 16px;
  // padding: px2rem(30) 0 0 px2rem(16);
  background-color: #fff;
  .header {
    display: flex;
    justify-content: flex-end;
    padding-right: 16px;
    // padding-right: px2rem(16);
    .close-btn {
      cursor: pointer;
      text-align: center;
      color: rgba(0, 0, 0, 0.45);
      // font-size: 26px;
      // line-height: 26px;
      // width: 28px;
      // height: 28px;
      font-size: px2rem(26);
      line-height: px2rem(26);
      width: px2rem(28);
      height: px2rem(28);
    }
  }
  .content {
    white-space: nowrap;
    overflow: auto;
    max-height: 100%;
    padding-bottom: 16px;
    display: flex;
    justify-content: center;
    margin-top: -24px;
    padding-top: 40px;
    // margin-top: px2rem(-24);
    // padding-top: px2rem(40);
    min-width: 814px;
    .fullscreenPreview-mainView {
      // width: 704px;
      // height: 704px;
      width: px2rem(700);
      height: px2rem(700);
      position: relative;
      box-sizing: content-box;

      // margin-bottom: 48px;
      margin-bottom: px2rem(48);
      .title {
        position: absolute;
        top: -44px;
        // top: px2rem(-44);
        width: 100%;
        text-align: center;
        .name {
          font-weight: bold;

          color: rgba(0, 0, 0, 0.85);
        }
        .code {
          font-weight: 400;

          color: rgba(0, 0, 0, 0.45);
        }
      }
      .el-carousel {
        // width: 700px;
        // height: 700px;
        width: px2rem(700);
        height: px2rem(700);
        position: absolute;
        left: 2px;
        top: 2px;
        overflow: hidden;
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
        position: absolute;
        left: 0;

        // bottom: -48px;
        bottom: px2rem(-48);
        width: 100%;
        display: flex;
        justify-content: center;
        overflow: hidden;
        .color-box {
          // width: 28px;
          // height: 28px;

          width: px2rem(28);
          height: px2rem(28);
          display: flex;
          justify-content: center;
          align-items: center;
          &.active {
            background: #e6f7ff;
            border-radius: px2rem(5);
            border: 1px solid #91d5ff;
          }
          &:hover {
            background: #ffffff;
            border-radius: px2rem(5);
            border: 1px solid rgba(0, 0, 0, 0.15);
          }
          .color-item {
            cursor: pointer;
            // width: 20px;
            // height: 20px;
            width: px2rem(20);
            height: px2rem(20);
            // background: #00b8d4;
            border-radius: px2rem(3);
            border: 1px solid rgba(0, 0, 0, 0.15);
          }
        }
      }
    }
    .fullscreenPreview-smallview {
      // height: 704px;
      // padding-left: 20px;
      height: px2rem(704);
      margin-left: px2rem(20);
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
        height: 100%;
        // width: 90px;
        width: px2rem(104);
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
            border: 1px solid rgba(0, 0, 0, 0.15);
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
              border: 2px solid #0453F3;
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
    border-radius: 5px;
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
.container-3d-large {
  width: 100%;
  height: 100%;
  position: relative;
  canvas {
    width: 100%;
    height: 100%;
    outline: none;
  }
}
</style>

