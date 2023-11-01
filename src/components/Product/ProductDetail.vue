<template>
  <div class="product-detail-box scroll-bar" v-if="product&&product.code">
    <div class="goback" @click="showMoreProducts" v-if="$sdkConfig.product.isSupportList">
      <i class="iconfont iconarrow-left-bold"></i>返回查看全部商品
    </div>
    <div class="pl20 pr20" v-if="!product.isLoading">
      <div class="row-info pt20 pb20">
        <div class="product-img">
          <img :src="productImg" />
        </div>
        <div class="ml12">
          <div class="flex name-box">
            <el-tooltip class="item" effect="dark" :content="product.name" placement="top">
              <div class="name mr2">{{product.name}}</div>
            </el-tooltip>
            <el-tooltip class="item copyicon" effect="dark" content="点击复制" placement="top">
              <span class="iconfont iconfile-copy" v-zwcopy="{value: product.name, toast: '复制成功'}" @click.stop></span>
            </el-tooltip>
          </div>
          <div class="flex code">
            <template v-if="$sdkConfig.platformIsZWKJ">(编号:{{product.id}})</template>
            <template v-else>(编码:{{product.code}})</template>
            <el-tooltip class="item copyicon" effect="dark" content="点击复制" placement="top">
              <span class="iconfont iconfile-copy ml5" v-zwcopy="{value: $sdkConfig.platformIsZWKJ ? product.id : product.code, toast: '复制成功'}" @click.stop></span>
            </el-tooltip>
          </div>
          <div class="price-box mt5" v-if="$sdkConfig.platformIsZWKJ">
            <template v-if="productPrice && productPrice.code && product.code==productPrice.code">
              <template v-if="product && product.show_price==1">
                <template v-if="priceItem && priceItem.status">
                  <span class="flex">
                    <span class="price flex">
                      <span class="unit">￥</span>
                      <span>{{lowPrice}}</span>
                      <svg class="icon svg-icon discount-icon" aria-hidden="true" v-if="priceItem.lower_discount_price_info.discount_type==5">
                        <use xlink:href="#icona-Exclusiveprice"></use>
                      </svg>
                      <svg class="icon svg-icon discount-icon" aria-hidden="true" v-if="priceItem.lower_discount_price_info.discount_type==4">
                        <use xlink:href="#icona-Saleprice"></use>
                      </svg>
                      <template v-if="priceItem.lower_discount_price_info.discount_type==6">
                        <svg class="icon svg-icon discount-icon" aria-hidden="true" v-if="priceItem.lower_discount_price_info.cumulative_level.indexOf('普')>-1">
                          <use xlink:href="#icona-Ordinarymemberprice"></use>
                        </svg>
                        <svg class="icon svg-icon discount-icon" aria-hidden="true" v-else-if="priceItem.lower_discount_price_info.cumulative_level.indexOf('黄')>-1">
                          <use xlink:href="#icona-GoldMember"></use>
                        </svg>
                        <svg class="icon svg-icon discount-icon" aria-hidden="true" v-else-if="priceItem.lower_discount_price_info.cumulative_level.indexOf('铂')>-1">
                          <use xlink:href="#icona-PlatinumMember"></use>
                        </svg>
                        <svg class="icon svg-icon discount-icon" aria-hidden="true" v-else-if="priceItem.lower_discount_price_info.cumulative_level.indexOf('钻')>-1">
                          <use xlink:href="#icona-Diamondmembership"></use>
                        </svg>
                      </template>
                      <svg class="icon svg-icon discount-icon" aria-hidden="true" v-if="priceItem.lower_discount_price_info.discount_type==8">
                        <use xlink:href="#icona-memberprice"></use>
                      </svg>
                      <i class="iconfont iconinfo-circle price-tips ml5" @mouseenter="showGradient" @mouseleave="hideGradient"></i>
                    </span>
                    <span class="external-price ml5" v-if="externalPrice&&externalPrice!=0">+{{externalPrice}}</span>
                  </span>
                  <transition name="fade">
                    <div
                      class="gradient-info"
                      :class="{'discount-promotion': isDiscount&&discountType==3, 'discount-exclusive': isDiscount&&(discountType==1 || discountType==2)}"
                      ref="gradientPop"
                      v-show="isShowGradient"
                      :style="{'left': gradientPos.left, 'top': gradientPos.top}"
                      @mouseenter="isShowGradient=true"
                      @mouseleave="hideGradient"
                    > 
                      <div class="gradient-title" v-if="isDiscount">
                        <div class="left">
                          <template v-if="discountType==1 || discountType==2">专享批量采购价格</template>
                          <template v-else-if="discountType==3">此商品正在促销</template>
                        </div>
                        <div class="discount-time-info" v-if="discountDetail">
                          <template v-if="!discountDetail.isCounter">
                            <label>截止至</label>
                            <div class="time tc">
                              <span class="time-span">{{discountDetail.year}}</span>
                              <label>年</label>
                              <span class="time-span">{{discountDetail.month}}</span>
                              <label>月</label>
                              <span class="time-span">{{discountDetail.date}}</span>
                              <label>日</label>
                            </div>
                          </template>
                          <template v-else>
                            <label>距结束还有</label>
                            <div class="time tc">
                              <template v-if="discountDetail.day>=1">
                                <span class="time-span">{{discountDetail.day}}</span>
                                <label>天</label>
                              </template>
                              <span class="time-span">{{discountDetail.hour}}</span>
                              <label>:</label>
                              <span class="time-span">{{discountDetail.minute}}</span>
                              <label>:</label>
                              <span class="time-span">{{discountDetail.second}}</span>
                            </div>
                          </template>
                        </div>
                      </div>
                      <div class="gradient-box">
                        <div class="gradient-item merge-item" v-if="isPriceMerge">
                          <span>￥{{gradientPrice[0].lower_gradient_discount_price_info.discount_price.toFixed(2)}}</span>
                          <svg class="icon svg-icon discount-icon" aria-hidden="true" v-if="gradientPrice[0].lower_gradient_discount_price_info.discount_type==5">
                            <use xlink:href="#icona-Exclusiveprice_big"></use>
                          </svg>
                          <svg class="icon svg-icon discount-icon" aria-hidden="true" v-if="gradientPrice[0].lower_gradient_discount_price_info.discount_type==4">
                            <use xlink:href="#icona-Saleprice_big"></use>
                          </svg>
                          <template v-if="gradientPrice[0].lower_gradient_discount_price_info.discount_type==6">
                            <svg class="icon svg-icon discount-icon" aria-hidden="true" v-if="gradientPrice[0].lower_gradient_discount_price_info.cumulative_level.indexOf('普')>-1">
                              <use xlink:href="#icona-Ordinarymemberprice_big"></use>
                            </svg>
                            <svg class="icon svg-icon discount-icon" aria-hidden="true" v-else-if="gradientPrice[0].lower_gradient_discount_price_info.cumulative_level.indexOf('黄')>-1">
                              <use xlink:href="#icona-GoldMember_big"></use>
                            </svg>
                            <svg class="icon svg-icon discount-icon" aria-hidden="true" v-else-if="gradientPrice[0].lower_gradient_discount_price_info.cumulative_level.indexOf('铂')>-1">
                              <use xlink:href="#icona-PlatinumMember_big"></use>
                            </svg>
                            <svg class="icon svg-icon discount-icon" aria-hidden="true" v-else-if="gradientPrice[0].lower_gradient_discount_price_info.cumulative_level.indexOf('钻')>-1">
                              <use xlink:href="#icona-Diamondmembership_big"></use>
                            </svg>
                          </template>
                          <svg class="icon svg-icon discount-icon" aria-hidden="true" v-if="gradientPrice[0].lower_gradient_discount_price_info.discount_type==8">
                            <use xlink:href="#icona-memberprice_big"></use>
                          </svg>
                        </div>
                        <div class="gradient-item" v-for="(price,index) in gradientPrice" :key="`${product.code}-${index}`">
                          <div class="qty mb4">
                            {{price.name}}
                            <template v-if="!price.is_merge">
                              <svg class="icon svg-icon discount-icon" aria-hidden="true" v-if="price.lower_gradient_discount_price_info.discount_type==5">
                                <use xlink:href="#icona-Exclusiveprice"></use>
                              </svg>
                              <svg class="icon svg-icon discount-icon" aria-hidden="true" v-if="price.lower_gradient_discount_price_info.discount_type==4">
                                <use xlink:href="#icona-Saleprice"></use>
                              </svg>
                              <template v-if="price.lower_gradient_discount_price_info.discount_type==6">
                                <svg class="icon svg-icon discount-icon" aria-hidden="true" v-if="price.lower_gradient_discount_price_info.cumulative_level.indexOf('普')>-1">
                                  <use xlink:href="#icona-Ordinarymemberprice"></use>
                                </svg>
                                <svg class="icon svg-icon discount-icon" aria-hidden="true" v-else-if="price.lower_gradient_discount_price_info.cumulative_level.indexOf('黄')>-1">
                                  <use xlink:href="#icona-GoldMember"></use>
                                </svg>
                                <svg class="icon svg-icon discount-icon" aria-hidden="true" v-else-if="price.lower_gradient_discount_price_info.cumulative_level.indexOf('铂')>-1">
                                  <use xlink:href="#icona-PlatinumMember"></use>
                                </svg>
                                <svg class="icon svg-icon discount-icon" aria-hidden="true" v-else-if="price.lower_gradient_discount_price_info.cumulative_level.indexOf('钻')>-1">
                                  <use xlink:href="#icona-Diamondmembership"></use>
                                </svg>
                              </template>
                              <svg class="icon svg-icon discount-icon" aria-hidden="true" v-if="price.lower_gradient_discount_price_info.discount_type==8">
                                <use xlink:href="#icona-memberprice"></use>
                              </svg>
                            </template>
                          </div>
                          <div class="price" v-if="!price.is_merge">￥{{price.lower_gradient_discount_price_info.discount_price.toFixed(2)}}</div>
                          <div class="price text-del" v-if="price.is_merge || (!price.is_merge && !(price.lower_gradient_discount_price_info.discount_type==0 || price.lower_gradient_discount_price_info.discount_type==1))">￥{{price.price.toFixed(2)}}</div>
                        </div>
                      </div>
                      <div class="gradient-bottom">
                        <!-- <div class="level mr10" v-if="nextLevelPrice">
                          升级账号，可享受：
                          <span class="price">￥{{nextLevelPrice}}</span>
                        </div> -->
                        <div>
                          <!-- <a class="btn red mr10" v-if="nextLevelPrice" target="_blank" href="/frontend/vipLevel/index">立即升级</a> -->
                          <a class="btn" :href="'/merchant/productType/counter?id='+product.code" target="_blank">成本计算</a>
                        </div>
                      </div>
                    </div>
                  </transition>
                </template>
                <template v-else>
                  <span class="price promotion">未设定销售价格</span>
                </template>
              </template>
              <template v-else>
                <div class="no-auth" v-if="isLogin">
                  <label>该品类无权限</label>
                  <a class="color-primary ml5" href="/merchant/vipLevel/index">升级账号</a>
                </div>
                <div class="no-auth" v-else>
                  <label>该品类无权限</label>
                  <a class="color-primary ml5" href="/frontend/login/index">登录查看</a>
                </div>
              </template>
            </template>
          </div>
          <div class="price-box mt5" v-else-if="$sdkConfig.platform == 'xcxBackend'">
            <template v-if="productPrice && productPrice[0] && productPrice[0].product_type_code">
              <template>
                  <span class="price" v-if="lowXCXPrice && lowXCXPrice.status">
                    <span class="unit">￥</span>
                    <span>{{parseFloat(lowXCXPrice.supply_price || 0).toFixed(2)}}</span>
                  </span>
                  <template v-else>
                    <span class="price promotion">未设定销售价格</span>
                  </template>
              </template>
            </template>
          </div>
          <div class="price-box mt5" v-else>
            <template v-if="productPrice && productPrice.code && product.code==productPrice.code">
              <template v-if="product && product.show_price==1">
                  <span class="price" v-if="lowPrice">
                    <span class="unit">{{productPrice.currency_code}}</span>
                    <span>{{parseFloat(lowPrice || 0).toFixed(2)}}</span>
                  </span>
                  <template v-else>
                    <span class="price promotion">未设定销售价格</span>
                  </template>
              </template>
            </template>
          </div>
          <div v-if="product.status == 2">
            <el-popover
              placement="top"
              trigger="hover"
              :visible-arrow="true"
              popper-class="zw-rest-prop"
              :open-delay="0"
              :close-delay="0"
            >
              <div style="padding:10px 15px;font-size: 12px;">
                <template v-if="!product.removed_date">商品优化中，未来可能停售，建议调整销售策略。</template>
                <template v-else-if="product.removed_date&&!product.relate_product_type_info">商品库存紧张，预计{{product.removed_date}}停产，请尽快调整销售策略。</template>
                <template v-else-if="product.removed_date&&product.relate_product_type_info">
                  该商品底板将于{{product.removed_date}}下架升级，届时将<br/>无法下单，请使用升级后的商品底板进行下单<br/>（
                  <el-popover
                    placement="top"
                    trigger="hover"
                    :visible-arrow="true"
                    popper-class="zw-rest-prop"
                    :open-delay="0"
                    :close-delay="0"
                  >
                    <div>
                      <div class="tit" style="line-height:36px;text-align:center;font-size:12px;">{{product.relate_product_type_info.name}} {{product.relate_product_type_info.relate_product_type_id}}</div>
                      <img :src="product.relate_product_type_info.img_url" width="400" />
                    </div>
                    <a slot="reference" class="pointer color-primary" :href="'/merchant/productType/edit?id='+product.relate_product_type_info.relate_product_type_id" target="_new" style="text-decoration:none;">{{product.relate_product_type_info.name}} {{product.relate_product_type_info.relate_product_type_id}}</a>
                  </el-popover>
                  ），查看<a href="https://www.hicustom.com/frontend/HelperDocument/documentInfo?id=279" target="_new" class="color-primary" style="text-decoration:none;">操作说明</a>。
                </template>
              </div>
              <div slot="reference" class="icon-product-tip mt3 mb3 optimize" v-if="!product.removed_date">
                <a><i class="iconfont iconcaveat-circle mr2 va-2"></i>商品优化提醒</a>
              </div>
              <div slot="reference" class="icon-product-tip mt3 mb3 soldout" v-else-if="product.removed_date&&!product.relate_product_type_info">
                <a><i class="iconfont iconcaveat-circle mr2 va-2"></i>商品停售提醒</a>
              </div>
              <div slot="reference" class="icon-product-tip mt3 mb3 replace"  v-else-if="product.removed_date&&product.relate_product_type_info">
                <a><i class="iconfont iconcaveat-circle mr2 va-2"></i>底板替换提醒</a>
              </div>
            </el-popover>
          </div>
          <div class="icons mt5" v-if="$sdkConfig.platformIsZWKJ">
            <!-- 新品(接口缺少字段) -->
            <i class="iconfont iconnewproduct mr5" v-if="product.is_new_time==1"></i>
            <!-- 优选 -->
            <i class="iconfont iconlabel_select mr5" v-if="product.is_preferred==2"></i>
            <!-- 促销 -->
            <i class="iconfont iconlabel_promotion mr5" v-if="product.is_promotion==2"></i>
            <!-- 尊享 -->
            <i class="iconfont iconlabel_prerogative mr5" v-if="product.respect_product==1"></i>
            <!-- 是否超时赔付 -->
            <i class="iconfont iconicon-label_overtime-payment mr5" style="color:#FF4701" v-if="product.is_auto_pay==1"></i>
            <!-- 创业 -->
            <!-- <i class="iconfont iconmember-level1 mr5" v-if="product.group_level_product.indexOf(3) != -1"></i> -->
            <!-- 专业 -->
            <!-- <i class="iconfont iconmember-level2 mr5" v-if="product.group_level_product.indexOf(2) != -1"></i> -->
            <!-- 企业 -->
            <!-- <i class="iconfont iconmember-level3 mr5" v-if="product.group_level_product.indexOf(4) != -1"></i> -->
          </div>
          <div class="show-all-info mt10" @click="showProductPop" v-if="$sdkConfig.product.designProductDetail&&($sdkConfig.product.designProductDetail.productDetail||$sdkConfig.product.designProductDetail.productSize)">产品详情<i class="iconfont iconarrow-right-bold"></i></div>
        </div>
      </div>
      <!-- <div class="row-process">
        <label class="pr36">工艺</label>
        <div class="process-list" v-if="productTechnology.length">
          <div class="process-item active" v-for="proTech in productTechnology" :key="proTech">{{proTech}}</div>
        </div>
        <div class="tips align-center" style="display:none">
          工艺说明
          <i class="iconfont iconarrow-right-bold va-2 ml5"></i>
        </div>
      </div> -->
      <div class="row-size">
        <div class="title">
          <a @click="toggleSizeRow">
            {{sizeAlias}}
            <span class="size-arrow" :class="{'hidden': !isShowSize}">
              <i class="iconfont iconarrow-down-bold va-2"></i>
            </span>
          </a>
          <a class="link align-center" @click="showProductPop('size')" v-if="$sdkConfig.product.designProductDetail&&$sdkConfig.product.designProductDetail.productSize">
            尺码表
            <i class="iconfont iconarrow-right-bold va-2 ml5"></i>
          </a>
        </div>
        <div class="size-list" v-if="sizeList&&sizeList.length" :class="{'hidden': !isShowSize}">
          <div
            class="size-item"
            v-for="size in sizeList"
            :key="size.id"
            :data-id="size.id"
            :class="{'active': size.id==activeSize}"
            @click="changeSize(size)"
          >{{size.name}}</div>
        </div>
      </div>
      <div class="row-color">
        <div class="title">
          <a @click="toggleColorRow">
            {{colorAlias}}
            <span class="color-arrow" :class="{'hidden': !isShowColor}">
              <i class="iconfont iconarrow-down-bold va-2"></i>
            </span>
          </a>
        </div>
        <div class="color-list" v-if="colorList&&colorList.length" :class="{'hidden': !isShowColor}">
          <el-tooltip
            :enterable="false"
            class="item"
            effect="dark"
            :content="`${color.en_name} ${color.name}`"
            placement="top"
            v-for="color in colorList"
            :key="color.id"
          >
            <div class="color-item" :data-id="color.id" :class="{'active': color.id==activeColor}" @click="changeColor(color)">
              <a :style="{'background': '#'+color.color_tone1}"></a>
              <a :style="{'background': color.color_tone2 ? '#'+color.color_tone2 : '#'+color.color_tone1}"></a>
              <!-- <span class="checked-icon">
                <svg class="icon svg-icon" aria-hidden="true">
                  <use xlink:href="#iconselected" />
                </svg>
              </span> -->
            </div>
          </el-tooltip>
        </div>
      </div>
      <div class="row-tag" v-show="product.show_custom_logo_icon">
        <div class="title">
          标签
          <span class="priceinfo" v-if="activeTagPrice&&activeTagPrice!=0">定制价格<span class="price">￥{{activeTagPrice}}</span>
            <el-tooltip
              class="item"
              effect="light"
              content="所选标签在货款中需增加所示价格"
              placement="top"
              :visible-arrow="false"
            >
              <i class="iconfont iconinfo-circle tip"></i>
            </el-tooltip>
          </span>
        </div>
        <ul class="tagpackage-list tag">
          <el-tooltip
            :enterable="false"
            class="item"
            effect="dark"
            :content="item.name"
            placement="top"
            v-for="item in tagList" 
            :key="item.code"
          >
            <li :class="{'active': activeTag==item.code+'_'+item.id}" @click="changeTag(item)">
              <a class="itembox">
                <img :src="item.image_url" />
              </a>
              <p class="name">{{item.name}}</p>
            </li>
          </el-tooltip>
          <li v-if="!tagList.length">
            <a class="itembox add" href="/merchant/brandLogo/index" target="_new">
              <span>创建<br/>专属标签</span>
            </a>
          </li>
        </ul>
      </div>
      <div class="row-package" v-show="packList.length">
        <div class="title">
          包装
          <span class="priceinfo" v-if="activePackPrice&&activePackPrice!=0">定制价格<span class="price">￥{{activePackPrice}}</span>
            <el-tooltip
              :enterable="false"
              class="item"
              effect="light"
              content="所选包装在货款中需增加所示价格"
              placement="top"
            >
              <i class="iconfont iconinfo-circle tip"></i>
            </el-tooltip>
          </span>
        </div>
        <ul class="tagpackage-list package">
          <el-tooltip
            :enterable="false"
            class="item"
            effect="light"
            placement="top"
            v-for="item in packList" 
            :key="item.id"
          >
            <div slot="content">
              {{item.name}}
              <img :src="item.img" alt="" style="width: 314px; display: block">
            </div>
            <li :class="{'active': item.id==activePack}" @click="changePack(item)">
              <a class="itembox">
                <img :src="item.img" />
              </a>
              <p class="name">{{item.name}}</p>
            </li>
          </el-tooltip>
        </ul>
      </div>
      <!-- <div class="row-color row-part" v-if="partsList.length">
        <div class="title">
          <a @click="togglePartRow">
            定制配件
            <span class="color-arrow" :class="{'hidden': !isShowPart}">
              <i class="iconfont iconarrow-down-bold va-2"></i>
            </span>
          </a>
        </div>
        <div class="part-list" :class="{'hidden': !isShowPart}">
          <template
            v-for="part in partsList"
          >
            <div class="part-item" :key="part.part_name + part.part_id" @click="partCheck(part)">
              <img :src="part.part_img" alt="">
              <span>{{part.part_name}}</span>
            </div>
          </template>
        </div>
      </div> -->
    </div>
    <div class="zw-loader" style="width:100%" v-else>
      <span class="spinner"></span>
    </div>
  </div>
</template>

<script>
import ProductPop from "@/components/Product/ProductDetailPop";
import { getCurTime, genLocalStorageKey } from "@/utils/utils";
import eventBus from "@/utils/eventBus.js";
import {_isSupportBaseplate} from "@/apis/product.js";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/css/swiper.css";
export default {
  components: {
    ProductPop,
    Swiper,
    SwiperSlide
  },
  data() {
    return {
      priceItem: null,
      lowPrice: "",
      // 梯度价
      isShowGradient: false,
      gradientPrice: [],
      swiperOptions: {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: false,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
          renderBullet(index, className) {
            return `<span class="${className} swiper-pagination-bullet-custom"></span>`;
          },
        },
        navigation: {
          nextEl: ".button-next",
          prevEl: ".button-prev",
        },
      },
      gradientPos: {
        right: 0,
        top: 0,
      },
      // 折扣价
      isDiscount: false,
      discountType: '',
      discountDetail: {},
      discountTimer: null,
      // 价格合并
      isPriceMerge: false,
      hasDiscountTypeDiff: false,
      //升级账号
      // nextLevelPrice: "",
      isShowColor: true,
      isShowSize: true,
      isShowPart: true,
      colorAlias: '',
      sizeAlias: ''
    };
  },
  computed: {
    lowXCXPrice(){
      if(this.$sdkConfig.platform == 'xcxBackend'){
        let item
        this.productPrice[0] && this.productPrice[0].active_mini_colors.map(x=>{
          if(x.color_id == this.activeColor){
            x.active_mini_sizes.map(y=>{
              if(y.size_id == (this.activeSize?this.activeSize:x.active_mini_sizes[0].size_id)){
                item = y
              }
            })
          }
        })
        return item
      }else{
        return {
          status:false,
          supply_price:0
        }
      }
    },
    product() {
      const product = this.$store.state.product.selectedProduct
      this.colorAlias = product.color_alias || '颜色'
      this.sizeAlias = product.size_alias || '尺码'
      if(this.$sdkConfig.platform == 'xcxBackend'){
        product.show_custom_logo_icon = false
      }
      return product;
    },
    productDetail() {
      return this.$store.state.product.selectedProductDetail;
    },
    productPrice(){
      return this.$store.state.product.productPrice;
    },
    productImg(){
      let {color, view} = this.product.defaultValues;
      let colorItem = this.product.colors.find(c=>c.id==color);
      if(colorItem){
        let viewItem = colorItem.views.find(v=>v.id==view);
        return viewItem.cover_img || viewItem.complete_img || '';
      } else {
        return ''
      }
    },
    isLogin() {
      return this.$isLogin;
    },
    editingProduct() {
      return this.$store.state.product.editingProduct;
    },
    // 设计图层信息
    designLayers() {
      return this.$store.state.gallery.designImgList || [];
    },
    gradientSwiper() {
      return this.$refs.gradientSwiper && this.$refs.gradientSwiper.$swiper;
    },
    // 梯度价分组
    // _gradientPrice() {
    //   let perGroup = 5;
    //   let ret = [];
    //   for (let i = 0; i < this.gradientPrice.length; i++) {
    //     if (i % perGroup == 0) {
    //       ret.push([]);
    //     }
    //     ret[ret.length - 1].push(this.gradientPrice[i]);
    //   }
    //   return ret;
    // },
    // 颜色尺码双向联动
    colorList() {
      if (this.product && this.product.code) {
        let { colors, active_color_size } = this.product;
        if (this.activeSize) {
          let activeColors = [];
          for (let i in active_color_size) {
            if (active_color_size[i].some((a) => a == this.activeSize)) {
              activeColors.push(i);
            }
          }
          return colors.filter((color) =>
            activeColors.some((a) => a == color.id)
          );
        } else {
          return colors;
        }
      } else {
        return [];
      }
    },
    sizeList() {
      if (this.product && this.product.code) {
        let { sizes, active_color_size } = this.product;
        if (this.activeColor) {
          let activeSizes = active_color_size[this.activeColor] || [];
          return sizes.filter((size) => activeSizes.some((a) => a == size.id));
        } else {
          return sizes;
        }
      } else {
        return [];
      }
    },
    activeColor() {
      if (this.product && this.product.code) {
        let { defaultValues, colors } = this.product;
        return (
          this.$store.state.product.editingProduct.color ||
          defaultValues.color ||
          colors[0].id
        );
      } else {
        return "";
      }
    },
    activeSize() {
      let size = ''
      if (this.product && this.product.code) {
        size = this.$store.state.product.editingProduct.size || "";
      } else {
        size = "";
      }
      if(!size){
          return ''
      }else{
        return size
      }
    },
    tagList(){
      return this.product && this.product.code ? this.product.custom_logo_list || [] : []
    },
    activeTag(){
      if (this.product && this.product.code) {
        return this.$store.state.product.editingProduct.tag || "";
      } else {
        return "";
      }
    },
    activeTagPrice(){
      if(this.product && this.product.code){
        let tagItem = this.tagList.find(a=>this.activeTag==`${a.code}_${a.id}`);
        return tagItem&&tagItem.price || ''
      } else {
        return '';
      }
    },
    packList(){
      if(this.$sdkConfig.platform == 'xcxBackend'){
        return []
      }else{
        return this.product && this.product.code ? this.product.pack_list || [] : []
      }
    },
    activePack(){
      if (this.product && this.product.code) {
        return this.$store.state.product.editingProduct.pack || "";
      } else {
        return "";
      }
    },
    activePackPrice(){
      if(this.product && this.product.code){
        let packItem = this.packList.find(a=>a.id==this.activePack);
        return packItem&&packItem.price || ''
      } else {
        return '';
      }
    },
    externalPrice(){
      if(this.activeTagPrice || this.activePackPrice){
        return (Number(this.activeTagPrice) + Number(this.activePackPrice)).toFixed(2);
      } else {
        return '';
      }
    },
    // 生产工艺
    // productTechnology() {
    //   if (
    //     this.productDetail &&
    //     this.productDetail.detailInfoText &&
    //     this.productDetail.detailInfoText.product_technology
    //   ) {
    //     return this.productDetail.detailInfoText.product_technology.value.split(
    //       "，"
    //     );
    //   }
    //   return [];
    // },
    amazonViewImgObj() {
      return this.$store.state.product.amazonViewImgObj
    },
    // partsList() {
    //   let partsList = this.$store.state.product.partsList
    //   // let partCheckedList = this.$store.state.product.partCheckedList
    //   // partsList.map(part => {
    //   //   part.checked = false
    //   //   partCheckedList.forEach(item => {
    //   //     if(part.part_id == item.partId) {
    //   //       part.checked = true
    //   //     }
    //   //   })
    //   // })
    //   return partsList
    // }
  },
  methods: {
    showMoreProducts(){
      this.$store.commit('layout/toggleProductDetail', false);
      // 首次点击返回时显示提示信息
      let customerId = this.$isLogin ? this.$OPTIONS.userInfo.code : "unlogin";
      let localStorageKey = genLocalStorageKey('noneProductDetailPopTipList');
      let noTipList = JSON.parse(localStorage.getItem(localStorageKey));
      if (
        noTipList &&
        noTipList.length &&
        noTipList.some((a) => a == customerId)
      ) return;
      this.$store.commit('product/updateIsShowProductOptTip', true);
    },
    // partCheck(item) {
    //   this.$store.commit('product/updatePartDetail', {showPartDetail: true, partDetail: item})
    // },
    toggleColorRow() {
      this.isShowColor = !this.isShowColor;
    },
    toggleSizeRow() {
      this.isShowSize = !this.isShowSize;
    },
    togglePartRow() {
      this.isShowPart = !this.isShowPart;
    },
    changeColor(color) {
      eventBus.$emit("colorChange", { data: color });
      let newData = Object.assign({}, this.editingProduct, {
        color: color.id,
        size: this.activeSize || "",
      });
      this.$store.commit("product/updateEditingProduct", newData);
      this.updatePrice();
    },
    changeSize(size) {
      let newData = Object.assign({}, this.editingProduct, {
        size: this.activeSize == size.id ? "" : size.id,
        color: this.activeColor || "",
      });
      this.$store.commit("product/updateEditingProduct", newData);
      this.updatePrice();
    },
    changeTag(item){
      let {tag} = this.editingProduct;
      const newTag = `${item.code}_${item.id}`;
      tag = tag == newTag ? '' : newTag;
      let newData = Object.assign({}, this.editingProduct, { tag });
      this.$store.commit("product/updateEditingProduct", newData);
      this.updatePrice();
    },
    changePack(item){
      let {pack} = this.editingProduct;
      pack = pack==item.id ? '' : item.id;
      let newData = Object.assign({}, this.editingProduct, { pack });
      this.$store.commit("product/updateEditingProduct", newData);
      this.updatePrice();
    },
    // 获取图片和面价格总和
    getAddPrice(){
      // 图片价格
      let gallery_price = 0;
      const gallery_priceArr = this.getDesignGallery(this.designLayers);
      for (let i = 0; i < gallery_priceArr.length; i++) {
        let galleryPrice = parseFloat(gallery_priceArr[i].price);
        if (galleryPrice > 0) {
          gallery_price += galleryPrice;
        }
      }
      // 面价格
      let view_price = parseFloat(this.$sdkConfig.platformIsZWKJ ? this.product.view_price || 0 : this.productPrice.view_price || 0);
      let viewDesignerNum = this.getDesignView();
      if (viewDesignerNum === 0) viewDesignerNum = 1;
      const addPrice = gallery_price + view_price * (viewDesignerNum - 1);
      return addPrice;
    },
    updatePrice(){
      if(this.$sdkConfig.platformIsZWKJ){
        if(this.product?.code && this.productPrice?.code && this.product.code == this.productPrice.code){
          let color_id = this.activeColor;
          let size_id = this.activeSize || "";
          this.priceItem = this.getPriceItem(color_id, size_id);
          if(this.priceItem?.status){
            let {lower_discount_price_info} = this.priceItem;
            let low_price = lower_discount_price_info.discount_price || this.priceItem.price;
            const addPrice = this.getAddPrice();
            low_price = parseFloat(low_price + addPrice).toFixed(2);
            this.lowPrice = low_price;
            // 梯度价
            this.gradientPrice = this.getGradientPrice(this.priceItem.gradient_price_list || []);
            // 促销倒计时
            this.discountType = this.getDiscountType();
            this.isDiscount = false;
            if (this.discountTimer) clearTimeout(this.discountTimer);
            if(this.discountType){
              this.isDiscount = true;
              const discountItem = this.priceItem.gradient_price_list.find(a => {
                if(this.discountType==3){
                  return a.lower_gradient_discount_price_info.discount_type==4
                } else {
                  return a.lower_gradient_discount_price_info.discount_type==5
                }
              });
              if(discountItem){
                this.refreshDiscount(
                  new Date(discountItem.lower_gradient_discount_price_info.discount_start_time),
                  new Date(discountItem.lower_gradient_discount_price_info.discount_end_time)
                );
              }
            }
          } else {
            this.lowPrice = '';
          }
        } else {
          this.priceItem = null;
        }
      } else {
        let color_id = this.activeColor;
        let size_id = this.activeSize || "";
        if(this.productPrice && this.productPrice.price != undefined){
          const priceList = this.productPrice.open_color_size_price_list || [];
          if(!size_id){
            this.lowPrice = this.productPrice.price;
          } else {
            let priceItem = priceList.find(a=>a.color_id==color_id&&a.size_id==size_id);
            this.lowPrice = priceItem ? priceItem.price : this.productPrice.price;
          }
          const addPrice = this.getAddPrice();
          this.lowPrice = (parseFloat(this.lowPrice || 0) + addPrice).toFixed(2);
        } else {
          this.lowPrice = '';
        }
      }
    },
    getPriceItem(color_id, size_id){
      if(size_id){
        return this.productPrice.price_detail_info_list.find(a=>a.color_id==color_id && a.size_id==size_id);
      } else {
        // 未选中尺码时，取该颜色中尺码价格最低的
        const list = this.productPrice.price_detail_info_list.filter(a=>a.color_id==color_id);
        const listWithPrice = list.filter(a=>a.status);
        if(listWithPrice.length){
          let priceItem = listWithPrice[0];
          listWithPrice.map(a => {
            if(a.lower_discount_price_info.discount_price < priceItem.lower_discount_price_info.discount_price){
              priceItem = a;
            }
          });
          return priceItem;
        } else {
          return list[0];
        }
      }
    },
    // 获取折扣价显示类型
    getDiscountType(){
      const typeArr = this.gradientPrice.map(item => item.lower_gradient_discount_price_info.discount_type);
      // 折扣类型: 0没有折扣 1阶梯 4促销 5专享 6季度累积折扣 7限时特惠价 8会员价
      const hasExclusive = typeArr.some(a => a==5);
      const hasPromotion = typeArr.some(a => a==4);
      let type = '';
      if(hasExclusive && hasPromotion){
        type = 1;
      } else if(hasExclusive){
        type = 2;
      } else if(hasPromotion){
        type = 3;
      }
      return type;
    },
    getGradientPrice(data){
      const firstType = data[0].lower_gradient_discount_price_info.discount_type;
      if(data.length < 3 || firstType == 0 || firstType == 1){
        this.isPriceMerge = false;
        data = data.map(a => {
          a.is_merge = false;
          return a;
        });
      } else {
        let isDiff = false, lastItem = null;
        data.slice(0, 3).forEach((a,i) => {
          if(i>0){
             if(
              a.lower_gradient_discount_price_info.discount_type!=lastItem.lower_gradient_discount_price_info.discount_type ||
              a.lower_gradient_discount_price_info.discount_price!=lastItem.lower_gradient_discount_price_info.discount_price
            ){
              isDiff = true;
              return false;
            }
          }
          lastItem = a;
        });
        this.isPriceMerge = !isDiff;
        let isStop = false;
        data = data.map(a => {
          if(!this.isPriceMerge){
            a.is_merge = false;
          } else {
            if(
              a.lower_gradient_discount_price_info.discount_type==data[0].lower_gradient_discount_price_info.discount_type &&
              a.lower_gradient_discount_price_info.discount_price==data[0].lower_gradient_discount_price_info.discount_price &&
              !isStop
            ){
              a.is_merge = true;
            } else {
              a.is_merge = false;
              isStop = true;
            }
          }
          return a;
        });
      }
      return data;
    },
    // 促销倒计时
    refreshDiscount(starTime, endTime) {
      const curTime = Number(new Date());
      let duration = 0;
      let text = "";
      let day = 0;
      let hour = 0;
      let minute = 0;
      let second = 0;
      let endTimeStr = "";
      starTime = starTime || curTime;
      endTime = endTime || curTime;
      // 判断倒计时是否在区间内
      if (starTime < curTime && endTime > curTime) {
        duration = endTime - curTime;
        if (duration > 1000 * 60 * 60 * 24 * 3) {
          endTimeStr = getCurTime(endTime).split(/-| /g);
          text = `促销活动截止至：${Number(endTimeStr[1])}月${Number(endTimeStr[2])}日`;
          this.discountDetail = {
            text,
            isCounter: false,
            year: Number(endTimeStr[0]),
            month: Number(endTimeStr[1]),
            date: Number(endTimeStr[2]),
          };
        } else {
          text = '距离促销结束';
          day = Math.floor(duration / (1000 * 60 * 60 * 24));
          duration = duration % (1000 * 60 * 60 * 24);
          hour = Math.floor(duration / (1000 * 60 * 60));
          duration = duration % (1000 * 60 * 60);
          minute = Math.floor(duration / (1000 * 60));
          duration = duration % (1000 * 60);
          second = Math.ceil(duration / 1000);

          if (day > 0) {
            text += ` ${day} 天`;
          }
          if (hour > 0) {
            text += ` ${hour} 小时`;
          }
          if (minute > 0) {
            text += ` ${minute} 分钟`;
          }
          if (second > 0) {
            text += ` ${second} 秒`;
          }
          const _hour = hour<=9 ? '0' + hour : hour;
          const _minute = minute<=9 ? '0' + minute : minute;
          const _second = second<=9 ? '0' + second : second;
          this.discountDetail = {
            text,
            isCounter: true,
            day,
            hour: _hour,
            minute: _minute,
            second: _second,
          };
        }
        this.discountTimer = setTimeout(() => {
          this.refreshDiscount(starTime, endTime);
        }, 1000);
      } else{
        this.discountDetail = {
          text: '结束',
          isEnd: true
        };
        if (this.discountTimer) {
          // 过期刷新页面
          window.location.reload();
        }
      } 
    },
    // 获取设计图片(不重复)
    getDesignGallery(treeData, ret = []) {
      for (let i = 0; i < treeData.length; i++) {
        if (treeData[i].type == "image") {
          if (
            !ret.some((item) => item.code == treeData[i].attrs.imageData.code)
          ) {
            ret.push({
              code: treeData[i].attrs.imageData.code,
              price: treeData[i].attrs.imageData.price,
            });
          }
        }
        if (treeData[i].childrens && treeData[i].childrens.length) {
          this.getDesignGallery(treeData[i].childrens, ret);
        }
      }
      return ret;
    },
    // 获取设计面个数(当前有设计过的面)
    getDesignView() {
      return this.designLayers.filter(
        (item) => item.childrens && item.childrens.length && item.id != 9999
      ).length;
    },
    async showProductPop(type){
      if(!this.productDetail.code || this.productDetail.code != this.product.code){
        const productDetailCache = this.$store.state.product.productDetailCache[this.product.code];
        if(productDetailCache){
          this.$store.commit('product/updateSelectedProductDetail', productDetailCache);
        } else {
          await this.$store.dispatch("product/updateSelectedProductDetail", {code: this.product.code});
        }
      }
      if(this.$sdkConfig.platform == 'xcxBackend'){
        await this.$store.dispatch("product/updateSelectedProductDetail", {code: this.product.code});
      }
      this.$store.commit('product/updateDefaultProductTab', type || '');
      this.$store.commit('product/toggleProductPop', true);
    },
    showGradient(e) {
      let pos = e.target.getBoundingClientRect();
      // let winWidth = document.documentElement.clientWidth || document.body.clientWidth;
      // this.$set(this.gradientPos, "right", winWidth - pos.right - 9 + "px");
      this.$set(this.gradientPos, "top", pos.bottom + 6 + "px");
      this.$set(this.gradientPos, 'left', pos.left - 22 + 'px');
      this.isShowGradient = true;
    },
    hideGradient() {
      this.isShowGradient = false;
    },
  },
  watch: {
    "product.code": async function (nv) {
      let { defaultValues } = this.product;
      let defaultPack = this.packList.find(a=>a.is_default==1);
      let product = {
        code: nv,
        color: defaultValues.color || colors[0].id,
        size: "",
        tag: "",
        pack: defaultPack&&defaultPack.id || ''
      };
      this.$store.commit("product/updateEditingProduct", product);
      await this.$store.dispatch("product/updateProductPrice", {code: nv,id:this.product.id});
      this.updatePrice();
      // 更新自定义底板入口显示权限
      if(this.$sdkConfig.platformIsZWKJ){
        if(!this.isLogin){
          this.$store.commit('product/updateCustomBoardSupport', true);
        } else {
          let ret = await _isSupportBaseplate({'product_type_id': this.product.id});
          if(ret.data.is_support_baseplate==1){
            this.$store.commit('product/updateCustomBoardSupport', false);
          } else {
            this.$store.commit('product/updateCustomBoardSupport', true);
          }
        }
      }
    },
    // 'productPrice.code': function(nv, ov){
    //   this.updatePrice();
    // },
    // activeColor: function (nv) {
    //   this.updatePrice();
    // },
    // activeSize: function (nv) {
    //   this.updatePrice();
    // },
    // productDetail: function (nv, ov) {
    //   if (nv && Object.keys(nv).length > 0 && Object.keys(ov).length == 0) {
    //     this.updatePrice();
    //   }
    // },
    "amazonViewImgObj.from": {
      handler() {
        const index = this.colorList.findIndex((item) => {return item.id == this.amazonViewImgObj.colorId})
        if(index != -1) {
          this.changeColor(this.colorList[index])
          setTimeout(() => {
            const sizeIndex = this.sizeList.findIndex((item) => {return item.id == this.amazonViewImgObj.sizeId})
            if(sizeIndex != -1) {
              this.changeSize(this.sizeList[sizeIndex])
            }
          }, 500);
        }
      }
    }
  },
  mounted() {
    eventBus.$on("updatePrice", () => {
      this.updatePrice();
    });
  },
};
</script>
<style lang="scss">
// 写在scoped无法生效
.el-popover.gradient {
  padding: 0 !important;
}
.gradient-swiper {
  .swiper-pagination-bullet {
    width: 30px;
    height: 2px;
    background: rgba(0, 0, 0, 0.25);
    border-radius: 0;
  }
}
</style>
<style lang="scss" scoped>
$primary: #0453F3;
.fade-enter-to, 
.fade-leave{
    opacity: 1;
}
.fade-enter, 
.fade-leave-to{
    opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
    transition: all .3s;
}
.goback{
  height: 50px;
  border-bottom: 1px solid #F0F2F5;
  cursor: pointer;
  color: $primary;
  padding: 0 20px;
  display: flex;
  align-items: center;
}
.zw-loader {
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100% - 60px);
}
.product-detail-box{
  width: 100%;
  height: 100%;
  overflow-y: auto;
  font-size: 14px;
}
.row-info{
  display: flex;
  align-items: center;
  .product-img{
    width: 120px;
    height: 120px;
    background: rgba(0, 0, 0, 0.04);
    border: 1px solid #DDDDDD;
    flex-shrink: 0;
    img{
      max-width: 100%;
      max-height: 100%;
      width: auto;
      height: auto;
    }
  }
  .name-box{
    .name {
      max-width: 145px;
      font-size: 16px;
      line-height: 22px;
      font-weight: 600;
      color: #333;
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .copyicon{
      display: none;
    }
    &:hover{
      .copyicon{
        display: inline-block;
      }
    }
  }
  .code{
    color: #666;
    font-size: 12px;
    line-height: 18px;
    white-space: nowrap;
    display: flex;
    .copyicon{
      display: none;
    }
    &:hover{
      .copyicon{
        display: inline-block;
      }
    }
  }
  .icons {
    .iconfont {
      font-size: 20px;
    }
  }
  .price {
    font-size: 14px;
    line-height: 22px;
    color: #fa8c16;
    .unit {
      font-size: 12px;
    }
    &.promotion {
      color: #ff4d4f;
    }
  }
  .iconPromotion {
    color: #f5222d;
  }
  .price-tips {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.45);
    cursor: pointer;
  }
  .no-auth {
    display: flex;
    flex-direction: column;
    label {
      color: #ff4d4f;
    }
  }
  .show-all-info{
    display: inline-block;
    line-height: 20px;
    color: $primary;
    cursor: pointer;
  }
}
.row-process {
  display: flex;
  justify-content: space-between;
  line-height: 32px;
  border-top: 1px solid #f0f5ff;
  padding: 10px 0;
  label {
    color: #000;
  }
  .process-list {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
  }
  .process-item {
    display: inline-block;
    padding: 0 10px;
    height: 32px;
    line-height: 29px;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    margin-right: 10px;
    margin-bottom: 10px;
    cursor: pointer;
    &:hover {
      border: 1px solid rgba(0, 0, 0, 0.45);
    }
    &.active {
      @include border(2px, solid, "font_color2");
      @include font_color("font_color2");
    }
  }
}
.row-size {
  padding: 10px 0;
  border-top: 1px solid #f0f5ff;
  .title {
    display: flex;
    justify-content: space-between;
    color: #000;
    line-height: 22px;
    > a {
      cursor: pointer;
    }
  }
  .size-list {
    display: flex;
    flex-wrap: wrap;
    overflow: hidden;
    max-height: none;
    transition: max-height 0.1s;
    &.hidden {
      max-height: 0;
      transition: max-height 0.1s;
    }
  }
  .size-item {
    display: inline-block;
    height: 32px;
    line-height: 30px;
    padding: 0 10px;
    border-radius: 16px;
    background: #F0F2F5;
    // border: 1px solid rgba(0, 0, 0, 0.15);
    border: 1px solid #F0F2F5;
    margin-right: 10px;
    margin-top: 10px;
    box-sizing: border-box;
    cursor: pointer;
    &:hover {
      // border: 1px solid rgba(0, 0, 0, 0.45);
      background: #EBECF8;
      color: $primary;
    }
    &.active {
      background: $primary;
      border-color: $primary;
      color: #fff;
    }
  }
}
.row-color {
  padding: 10px 0;
  border-top: 1px solid #f0f5ff;
  .title {
    color: #000;
    line-height: 22px;
    > a {
      cursor: pointer;
    }
  }
  .color-list {
    display: flex;
    flex-wrap: wrap;
    overflow: hidden;
    max-height: none;
    transition: max-height 0.1s;
    &.hidden {
      max-height: 0;
      transition: max-height 0.1s;
    }
  }
  .color-item {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 8px;
    margin-top: 8px;
    width: 32px;
    height: 32px;
    background: #F0F2F5;
    border-radius: 16px;
    border: 2px solid #F0F2F5;
    position: relative;
    cursor: pointer;
    &:hover,
    &.active {
      @include border(2px, solid, "font_color2");
    }
    a {
      border: 1px solid rgba(0, 0, 0, 0.15);
      width: 10px;
      height: 20px;
      &:nth-child(1) {
        border-top-left-radius: 16px;
        border-bottom-left-radius: 16px;
        border-right: none;
      }
      &:nth-child(2) {
        border-top-right-radius: 16px;
        border-bottom-right-radius: 16px;
        border-left: none;
      }
    }
    &.active{
      background: $primary;
    }
    // .checked-icon {
    //   position: absolute;
    //   width: 100%;
    //   height: 100%;
    //   top: 0;
    //   left: 0;
    //   font-size: 20px;
    //   display: none;
    //   justify-content: center;
    //   align-items: center;
    // }
    // &.active {
    //   .checked-icon {
    //     display: flex;
    //   }
    // }
  }
  
}
.row-tag, .row-package{
  padding: 10px 0;
  border-top: 1px solid #f0f5ff;
  .title {
    color: #000;
    line-height: 22px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .priceinfo{
      color: #495B6E;
      font-size: 12px;
      display: flex;
      align-items: center;
    }
    .price{
      color: #FAAD14
    }
    .tip{
      color: $primary;
      margin-left: 2px;
    }   
  }
  .tagpackage-list{
    display: flex;
    flex-wrap: wrap;
    li{      
      text-align: center;
      font-size: 12px;
      line-height: 14px;
      margin-right: 6px;
      margin-top: 8px;
      cursor: pointer;
      .itembox{
        text-decoration: none;
        width: 62px;
        height: 62px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 5px;
        border: 2px solid #E5E5E5;
        overflow: hidden;
        img{
          max-width: 100%;
          max-height: 100%;
          width: auto;
          height: auto;
        }
        &.add{
          background: #F0F2F5;
          border-color: transparent;
          color: $primary
        }
      }
      .name{
        margin-top: 5px;
        width: 62px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      &.active, &:hover{
        .itembox{
          border-color: $primary;
        }
      }
      &:hover{
        color: $primary;
      }

    }
  }
}
.row-part {
  padding: 10px 0;

  .title {
    color: #000;
    line-height: 22px;
    > a {
      cursor: pointer;
    }
  }
  .part-list {
    display: flex;
    flex-wrap: wrap;
    overflow: hidden;
    max-height: none;
    transition: max-height 0.1s;
    &.hidden {
      max-height: 0;
      transition: max-height 0.1s;
    }
  }
  .part-item {
    display: block;
    width: 33.3%;
    height: auto;
    margin-right: 0;
    margin-top: 4px;
    padding-right: 4px;
    text-align: center;
    &:hover,
    &.active {
      img {
        border-radius: 8px;
        @include border(2px, solid, "font_color2");
      }
      span {
        @include font_color("font_color2");
      }
    }
    img {
      width: 100%;
    }
  }
}
.color-arrow,
.size-arrow {
  display: inline-block;
  transform: rotate(0);
  transition: all 0.3s;
  &.hidden {
    transform: rotate(180deg);
    transition: all 0.3s;
  }
}
.color-primary {
  @include font_color("font_color2");
}
.tips {
  color: rgba(0, 0, 0, 0.45);
  cursor: pointer;
}
.link{
  color: $primary;
  cursor: pointer;
}
.flex {
  display: flex;
  align-items: center;
}
.external-price{
  color:#fa8c16
}
.discount-icon{
  font-size: 14px;
  margin-left: 3px;
}
.gradient-info {
  top: 100px;
  position: fixed;
  z-index: 9999;
  background: #fff;
  font-size: 14px;
  color: #666666;
  box-shadow: 0px 4px 10px 0px rgba(29, 33, 41, 0.14);
  border-radius: 5px 5px;
  &::before {
    position: absolute;
    content: "";
    display: block;
    left: 26px;
    top: -12px;
    width: 0;
    height: 0;
    border-width: 6px 4px;
    border-style: solid;
    border-color: transparent transparent #fff transparent;
    z-index: 20;
  }
  &::after {
    position: absolute;
    content: "";
    display: block;
    left: 24px;
    top: -14px;
    width: 0;
    height: 0;
    border-width: 7px 6px;
    border-style: solid;
    border-color: transparent transparent #efefef transparent;
    z-index: 10;
  }
  &.discount-exclusive{
    &::before,
    &::after{
      border-color: transparent transparent #464763 transparent;
    }
    .gradient-title{
      background: linear-gradient(120deg, #464763 0%, #1F1D34 100%);
    }
  }
  &.discount-promotion{
    &::before,
    &::after{
      border-color: transparent transparent #F5B032 transparent;
    }
    .gradient-title{
      background: linear-gradient(135deg, #F5B032 0%, #F9832A 100%);
    }
  }
  .gradient-title{
    display: flex;
    justify-content: space-between;
    align-content: center;
    padding: 0 24px;
    width: 100%;
    height: 40px;
    line-height: 40px;
    color:#fff;
    font-weight: 500;
    border-radius: 5px 5px 0 0;
    .discount-time-info, .time{
      display: flex;
      align-items: center;
    }
    .time-span{
      display: inline-block;
      height: 24px;
      line-height: 24px;
      padding: 0 5px;
      text-align: center;
      background: rgba(255, 255, 255, 0.3);
      font-size: 16px;
      margin: 0 4px;
    }
  }
  .gradient-bottom {
    height: 48px;
    padding: 0 24px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    border-top: 1px solid rgba(0, 0, 0, 0.06);
    .btn {
      display: inline-block;
      height: 32px;
      line-height: 32px;
      border-radius: 4px;
      border: 1px solid rgba(0, 0, 0, 0.15);
      padding: 0 16px;
      text-decoration: none;
      color: rgba(0, 0, 0, 0.65);
      cursor: pointer;
      &.red {
        background: #ff4d4f;
        border-color: #ff4d4f;
        color: #fff !important;
      }
    }
    > .level {
      flex: 1;
    }
    .price {
      color: #f5222d;
      font-weight: 500;
    }
  }
  .gradient-box{
    display: flex;
    padding: 24px;
    .gradient-item{
      margin-right: 24px;
      line-height: 22px;
      position: relative;
      &:last-child{
        margin-right: 0;
      }
    }
    .merge-item{
      margin-right: 56px;
      font-size: 24px;
      font-weight: 600;
      align-self: center;
      color: #FA8C16;
      .discount-icon{
        position: absolute;
        top: -37px;
        right: -37px;
        font-size:48px;
      }
    }
    .qty{
      display: flex;
      align-items: center;
      &+.price{
        font-size: 16px;
        font-weight: 600;
        margin-top: 0;
      }
    }
    .price{
      color: #FA8C16;
      font-size: 14px;
      font-weight: 400;
      margin-top: 4px;
      &.text-del{
        color: #999;
        text-decoration: line-through;
      }
    }
  }
  .promation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: url("~@/assets/img/product/title-Promotion.png") repeat;
    background-size: 100% 100%;
    border-radius: 5px 5px 0 0;
    min-width: 400px;
    white-space: nowrap;
    .left {
      width: 70%;
      height: 40px;
      padding: 0 15px;
      display: flex;
      align-items: center;
      .iconfont_bg {
        display: inline-block;
        width: 18px;
        height: 18px;
        line-height: 18px;
        background: #fff;
        border-radius: 5px;
        text-align: center;
        margin-right: 5px;
        i {
          font-size: 20px;
        }
      }
      .price-box {
        line-height: 20px;
        vertical-align: baseline;
      }
      .unit {
        font-size: 12px;
        color: #fff;
      }
      .price {
        font-size: 20px;
        color: #fff;
      }
      .price-line-through {
        color: rgba(255, 255, 255, 0.85);
        text-decoration: line-through;
        margin-left: 5px;
      }
    }
    .right {
      width: 30%;
      height: 40px;
      line-height: 1.2;
      color: #f5222d;
      padding: 0 15px;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      label {
        font-size: 12px;
        transform: scale(0.83);
      }
    }
  }
}
.pointer {
  cursor: pointer;
}
.va-2 {
  vertical-align: -2px;
}
a {
  color: inherit;
}
.icon-product-tip{
  display: inline-block;
  padding: 0 8px;
  line-height: 24px;
  border-radius: 10px;
  transform: scale(0.9);
  margin-left: -2px;
  &.soldout{
    background: #FFE6E6;
    color: #FF4D4D;
  }
  &.replace{
    background: #FFEDE0;
    color: #FF7F40
  }
  &.optimize{
    background: #FFF4E0;
    color: #FFB733;
  }
  &>a{
    // display: inline-block;
    vertical-align: center;
    font-size: 12px;
  }
}
</style>