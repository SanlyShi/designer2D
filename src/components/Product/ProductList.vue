<template>
  <div>
    <template v-if="data.length">
      <!-- 非最后一级分类 -->
      <div
        class="product-panel"
        v-if="layout==1"
        :style="{'padding-top': historyCg.length ? '52px' : '0'}"
      >
        <div class="panel-item" v-for="item in data" :key="item.id">
          <div class="title">
            <div class="name">{{item.name}}</div>
            <div class="show-all" @click="showMore(item)">
              更多
              <i class="iconfont iconarrow-right-bold va-2"></i>
            </div>
          </div>
          <div class="product-list" v-if="item.items && item.items.list && item.items.list.length">
            <div
              class="product-item zw-image-box"
              v-if="product.cur_view && product.cur_view.length"
              v-for="product in item.items.list"
              :key="product.id"
              @mouseenter="showProductDetail($event, product)"
              @mouseleave="hideProductDetail($event, product)"
              @click="selectProduct(product)"
            >
              <template v-if="leftType=='product'&&!isShowProductDetail">
                <!-- <el-image :src="product.specify_show.img" lazy v-if="product.specify_show&&product.specify_show.flag==1"></el-image> -->
                <el-image :src="product.cur_view[0]" lazy v-if="!leftHiddenFlag"></el-image>
              </template>
              <template v-if="$sdkConfig.platformIsZWKJ">
                <div class="icons">
                  <!-- 新品>促销>优选>尊享 -->
                  <img
                    class="proIcon"
                    src="@/assets/img/product/item_tag_xin.svg"
                    v-if="product.is_new_time==1"
                  />
                  <img
                    class="enjoy"
                    src="@/assets/img/product/item_tag_cu.svg"
                    v-else-if="product.is_promotion==2"
                  />
                  <img
                    class="proIcon"
                    src="@/assets/img/product/item_tag_you.svg"
                    v-else-if="product.is_preferred==2"
                  />
                  <img
                    class="enjoy"
                    src="@/assets/img/product/item_tag_zun.svg"
                    v-else-if="product.respect_product==1"
                  />
                </div>
                <a class="collect p10" v-if="isLogin" @click.stop="toggleCollect(product)">
                  <i class="iconfont iconheart" v-if="!product.is_collect"></i>
                  <i class="iconfont iconheart-fill fz16" style="color:#FF4D4F" v-else></i>
                </a>
              </template>
            </div>
          </div>
        </div>
      </div>
      <!-- 最后一级分类产品 -->
      <div
        class="product-list-wrap"
        v-if="layout==2"
        style="padding-bottom: 44px"
        :style="{'padding-top': historyCg.length ? '52px' : '10px'}"
      >
        <div class="product-list">
          <div
            class="product-item zw-image-box"
            v-if="product.cur_view && product.cur_view.length"
            v-for="product in data"
            :key="product.id"
            @mouseenter="showProductDetail($event, product)"
            @mouseleave="hideProductDetail($event, product)"
            @click="selectProduct(product)"
          >
            <template v-if="leftType=='product'&&!isShowProductDetail">
              <!-- <el-image :src="product.specify_show.img" lazy v-if="product.specify_show&&product.specify_show.flag==1"></el-image> -->
              <el-image :src="product.cur_view[0]" lazy v-if="!leftHiddenFlag"></el-image>
            </template>
            <template v-if="$sdkConfig.platformIsZWKJ">
              <div class="icons">
                <!-- 新品>促销>优选>尊享 -->
                <img
                  class="proIcon"
                  src="@/assets/img/product/item_tag_xin.svg"
                  v-if="product.is_new_time==1"
                />
                <img
                  class="enjoy"
                  src="@/assets/img/product/item_tag_cu.svg"
                  v-else-if="product.is_promotion==2"
                />
                <img
                  class="proIcon"
                  src="@/assets/img/product/item_tag_you.svg"
                  v-else-if="product.is_preferred==2"
                />
                <img
                  class="enjoy"
                  src="@/assets/img/product/item_tag_zun.svg"
                  v-else-if="product.respect_product==1"
                />
              </div>
              <a class="collect p10" v-if="isLogin" @click.stop="toggleCollect(product)">
                <i class="iconfont iconheart" v-if="!product.is_collect"></i>
                <i class="iconfont iconheart-fill" style="color:#FF4D4F" v-else></i>
              </a>
            </template>
          </div>
        </div>
      </div>
    </template>
    <div class="empty-box" v-else>
      <img src="@/assets/img/img_hi.png" width="100" />
      <div class="mt10">没有符合条件的商品</div>
    </div>

    <!-- 产品详情悬浮框 -->
    <transition name="fade">
      <div
        ref="productDetail"
        class="product-detail-box scroll-bar"
        :style="{'top': detailPos.top, 'bottom': detailPos.bottom}"
        v-show="isShowDetail"
      >
        <template v-if="product.code">
          <div class="content">
            <div class="imgbox" v-if="product.specify_show && product.specify_show.flag == 1">
              <img :src="product.specify_show.img" />
            </div>
            <template v-else>
              <div class="imgbox">
                <template v-if="isShowDetail">
                  <swiper
                    ref="productSwiper"
                    :options="swiperOptions"
                    :auto-update="true"
                    :auto-destroy="true"
                    :delete-instance-on-destroy="true"
                    :cleanup-styles-on-destroy="true"
                  >
                    <swiper-slide v-for="(view,index) in product.cur_view" :key="`view-${index}`">
                      <img :src="view" />
                    </swiper-slide>
                    <div
                      class="swiper-pagination"
                      slot="pagination"
                      v-show="product.cur_view.length>1"
                    ></div>
                  </swiper>
                </template>
              </div>
            </template>
            <div class="icons level mr5" v-if="$sdkConfig.platformIsZWKJ">
              <!-- 创业 -->
              <i
                class="iconfont iconmember-level1"
                v-if="product.group_level_product.indexOf(3) != -1"
              ></i>
              <!-- 专业 -->
              <i
                class="iconfont iconmember-level2"
                v-if="product.group_level_product.indexOf(2) != -1"
              ></i>
              <!-- 企业 -->
              <i
                class="iconfont iconmember-level3"
                v-if="product.group_level_product.indexOf(4) != -1"
              ></i>
            </div>
            <div class="pl15 pr15">
              <div class="title pt20">
                <div class="name">
                  <span>{{product.name}}</span>
                  <span class="price" v-if="!$sdkConfig.platformIsZWKJ&&product.price_info&&product.price_info.price">{{product.price_info.currency_code}}{{product.price_info.price.toFixed(2)}}</span>
                </div>
                <div class="code gray mt5" v-if="$sdkConfig.platformIsZWKJ">(编号:{{product.id}})</div>
                <div class="code gray mt5" v-else>(编码:{{product.code}})</div>
              </div>
              <div
                class="icons other pt10"
                v-if="$sdkConfig.platformIsZWKJ && (product.is_new_time==1 || product.is_preferred==2 || product.is_promotion==2 || product.respect_product==1||product.is_auto_pay==1)"
              >
                <!-- 新品 -->
                <i class="iconfont iconnewproduct mr5" v-if="product.is_new_time==1"></i>
                <!-- 促销 -->
                <i class="iconfont iconlabel_promotion mr5" v-if="product.is_promotion==2"></i>
                <!-- 优选 -->
                <i class="iconfont iconlabel_select mr5" v-if="product.is_preferred==2"></i>
                <!-- 尊享 -->
                <i class="iconfont iconlabel_prerogative mr5" v-if="product.respect_product==1"></i>
                 <!-- 是否超时赔付 -->
                <i class="iconfont iconicon-label_overtime-payment mr5" style="color:#FF4701" v-if="product.is_auto_pay==1"></i>
              </div>
              <div class="color-list">
                <div class="color-item" v-for="color in product.colors" :key="color.id">
                  <a :style="{'background': '#'+color.tone1}"></a>
                  <a :style="{'background': color.tone2 ? '#'+color.tone2 : '#'+color.tone1}"></a>
                </div>
              </div>
            </div>
          </div>
          <div class="detail" v-if="$sdkConfig.platformIsZWKJ">
            <div>
              <p v-if="product.seven_days_avg_time!=0">{{product.seven_days_avg_time}}</p>
              <p v-else>暂无数据</p>
              <p class="label">平均发货时效</p>
            </div>
            <div>
              <p v-if="product.ninety_percent_avg_time!=0">{{product.ninety_percent_avg_time}}</p>
              <p v-else>暂无数据</p>
              <p class="label">80%平均时效</p>
            </div>
            <div>
              <p v-if="product.ninety_percent_avg_time!=0">{{product.promise_shipment_to_hour}}</p>
              <p v-else>暂无数据</p>
              <p class="label">工厂预计发货</p>
            </div>
          </div>
        </template>
      </div>
    </transition>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/css/swiper.css";
import eventBus from "@/utils/eventBus.js";
import { throttle, debounce, genLocalStorageKey } from "@/utils/utils";
import { _productCollect, _productCollectCancel, _getProductPrices } from '@/apis/product.js'
export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  props: {
    layout: {
      type: String | Number,
      default: 1,
    },
    data: {
      type: Array,
      default: () => [],
    },
    historyCg: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      isLogin: this.$isLogin,
      isShowDetail: false,
      detailPos: { top: "auto", bottom: "auto" },
      product: {},
      priceMaps: {},
      initClick: true,
      leftHiddenFlag: false,
    };
  },
  computed: {
    leftType() {
      // el-image增加leftType判断，避免用户在数据返回之前切到其它标签页后返回导致图片不加载
      return this.$store.state.layout.leftType;
    },
    isLeftHidden() {
      return this.$store.state.layout.isLeftHidden;
    },
    isShowProductDetail(){
      return this.$store.state.layout.isShowProductDetail;
    },
    swiperOptions() {
      let loop = false;
      if (this.product?.cur_view?.length > 1) {
        loop = true;
      }
      return {
        pagination: {
          el: ".swiper-pagination",
        },
        loop,
        autoplay: {
          delay: 2000,
        },
      };
    },
    selectedProduct(){
      return this.$store.state.product.selectedProduct
    },
    isChangeProduct(){
      return this.$store.state.product.isChangeProduct
    },
    changeProductCode(){
      return this.$store.state.product.changeProductCode
    }
  },
  watch: {
    isLeftHidden(nv, ov) {
      if (!nv) {
        setTimeout(() => {
          this.leftHiddenFlag = false;
        }, 350);
      } else {
      this.leftHiddenFlag = true;
      }
    },
    // 使用watch,不使用eventBus避免多次请求
    isChangeProduct: {
      handler: async function(nv, ov){
        if(nv){
          let code = this.changeProductCode;
          let dataCache = this.$store.state.product.productCache[code];
          let productData;
          if(dataCache){
            productData = dataCache;
            this.$store.commit("product/updateSelectedProduct", productData);
          } else {
            this.$store.commit('product/updateSelectedProduct', Object.assign(this.$store.state.product.selectedProduct, {isLoading: true}));
            let params = {code};
            if(!this.$sdkConfig.platformIsZWKJ) params.default = -1;
            productData = await this.$store.dispatch("product/updateSelectedProduct", params);
          }
          if(!this.$sdkConfig.platformIsZWKJ){
            // 更新详情
            this.$store.commit('product/updateSelectedProductDetail', productData);
            this.$store.commit('product/updateProductDetailCache', {
              code,
              data: productData
            });
          }
          // 刷新页面选中产品不变
          localStorage.setItem(genLocalStorageKey("blankProId"), code);
          this.$store.commit('layout/toggleProductDetail', true);
          this.$store.commit('product/updateIsChangeProduct', false);
        }
      }
    }
  },
  methods: {
    showMore(data) {
      this.$emit("showMore", data);
    },
    async showProductDetail(e, data) {
      if(this.$sdkConfig.platformIsZWKJ){
        this.product = Object.assign({}, data);
      } else {
        if(!this.priceMaps[data.code]){
          const ret = await _getProductPrices({code: data.code,id: data.id});
          this.priceMaps[data.code] = ret.data?.length ? ret.data[0] : {};
        }
        this.product = Object.assign({}, data, {
          price_info: this.priceMaps[data.code]
        });
      }
      this.$nextTick(() => {
        let winHeight =
          document.documentElement.clientHeight || document.body.clientHeight;
        let objPos = e.target.getBoundingClientRect();
        let popHeight = this.$refs.productDetail.clientHeight;
        if (winHeight - objPos.top > popHeight) {
          this.detailPos = Object.assign({
            top: objPos.top - 50 + "px",
            bottom: "auto",
          });
        } else {
          this.detailPos = Object.assign({ top: "auto", bottom: 0 });
        }
      });
      this.isShowDetail = true;
    },
    hideProductDetail(e, data) {
      this.isShowDetail = false;
    },
    selectProduct(data) {
      if (this.initClick || !this.clickTimer) {
        this._selectProduct(data);
        this.initClick = false;
        this.clickTimer = setTimeout(() => {
          this.clickTimer = null;
        }, 400);
      } else {
        if (this.clickTimer) clearTimeout(this.clickTimer);
        this.clickTimer = setTimeout(() => {
          this._selectProduct(data);
          this.initClick = true;
          this.clickTimer = null;
        }, 400);
      }
    },
    _selectProduct(data) {
      this.$store.commit('layout/toggleProductDetail', true);
      if(data.code == this.selectedProduct.code) return;
      eventBus.$emit('checkProductBeforeChange', data);
    },
    async toggleCollect(product){
      if(product.is_collect){
        await _productCollectCancel({ids: product.id});
        this.$message.success('取消收藏成功');
      } else {
        await _productCollect({operate: 2, cat_ids: -1, ids: product.id})
        this.$message.success('收藏成功');
      }
      this.$emit('refresh', product);
    }
  },
};
</script>
<style lang="scss" scoped>
.product-panel {
  .panel-item {
    .title {
      padding: 10px 20px;
      line-height: 22px;
      display: flex;
      justify-content: space-between;
      .name {
        font-size: 14px;
        color: #000;
      }
      .show-all {
        color: rgba(0, 0, 0, 0.65);
        cursor: pointer;
      }
    }
  }
}
.product-list {
  display: flex;
  flex-wrap: wrap;
  margin-left: 18px;
  user-select: none;
}
.product-item {
  width: 136px;
  height: 136px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 8px;
  margin-bottom: 8px;
  position: relative;
  cursor: pointer;
  &:nth-child(2n) {
    margin-right: 0;
  }
  .icons {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    img {
      width: 20px;
      height: 20px;
    }
    .icon {
      color: #f5222d;
    }
  }
  .collect{
    position: absolute;
    top: 0;
    right: 0;
    display: none;
    .iconfont{
      font-size: 18px;
    }
  }
  &:hover{
   .collect{
     display: inline-block;
   } 
  }
}
.product-detail-box {
  width: 260px;
  padding: 0;
  background: #fff;
  box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.05),
    0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 3px 6px -4px rgba(0, 0, 0, 0.12);
  border-radius: 20px;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 385px;
  z-index: 999;
  max-height: calc(100vh);
  overflow-y: auto;
  > .content {
    position: relative;
  }
  .imgbox {
    width: 260px;
    height: 260px;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      max-width: 100%;
      max-height: 100%;
      width: auto;
      height: auto;
      min-height: 100px;
    }
  }
  .swiper-container {
    width: 260px;
    height: 260px;
    background: rgba(0, 0, 0, 0.04);
    .swiper-slide {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .icons.level {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 10;
    .iconfont {
      font-size: 20px;
    }
  }
  .icons.other {
    .iconfont {
      font-size: 18px;
    }
  }
  .name {
    font-size: 16px;
    color: #000;
    line-height: 24px;
    display: flex;
    justify-content: space-between;
    .price{
      font-size: 14px;
      color: red;
    }
  }
  .code {
    color: rgba(0, 0, 0, 0.45);
    font-size: 12px;
  }
  .color-list {
    display: flex;
    flex-wrap: wrap;
    padding-top: 12px;
    padding-bottom: 15px;
  }
  .color-item {
    margin-right: 3px;
    margin-top: 3px;
    display: flex;
    a {
      width: 6px;
      height: 12px;
      &:nth-child(1) {
        border-top-left-radius: 2px;
        border-bottom-left-radius: 2px;
      }
      &:nth-child(2) {
        border-top-right-radius: 2px;
        border-bottom-right-radius: 2px;
      }
    }
  }
  .detail {
    background: rgba(0, 0, 0, 0.02);
    color: rgba(0, 0, 0, 0.65);
    padding: 15px;
    line-height: 20px;
    text-align: center;
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    .label {
      transform: scale(0.83);
      color: rgba(0, 0, 0, 0.45);
    }
  }
  .color-primary {
    @include font_color("font_color2");
  }
}
.va-2 {
  vertical-align: -2px;
}
.empty-box {
  text-align: center;
  font-size: 14px;
  padding-top: 40px;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave {
  opacity: 1;
}
.fade-enter-active {
  // transition: all 0.1s;
}
.fade-leave-active {
  // transition: all 0.1s;
}
</style>