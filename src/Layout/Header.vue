<template>
  <div class="zwdesign-header">
    <div
      v-if="$sdkConfig.platformIsZWKJ"
      class="zwdesign-header--left"
      :class="{'logined': isLogin}">
      <svg
        v-show="$sdkConfig.platformIsZWKJ"
        class="icon svg-icon logo"
        aria-hidden="true"
        width="200px"
        @click="goIndex">
        <use xlink:href="#iconlogo1"></use>
      </svg>
      <el-popover
        placement="bottom"
        trigger="hover"
        :visible-arrow="false"
        popper-class="zw-rest-prop"
        :open-delay="0"
        :close-delay="0"
        v-show="$sdkConfig.platformIsZWKJ"
      >
        <div class="version-list">
          <a class="version-item" :href="`/frontend/create/createNewModelEditor?product_code=${product.id}&fromNewDesign=1&productCodeNum=${product.code}`" v-if="isSupportEasy" @click="$statisticalreport.clickNotDesignItemBtn('切换版本')">使用简版</a>
          <a class="version-item" @click="goOldDesign">回到旧版</a>
        </div>
        <div slot="reference" class="switch-version ml20">
          <i class="iconfont icontoggle"></i><span>切换版本</span>
        </div>
      </el-popover>
      <template v-if="isLogin&&isShowRecord">
        <el-popover
          placement="bottom"
          title="标题"
          width="392"
          trigger="hover"
          :open-delay="0"
          :close-delay="0"
          ref="record-popover"
          v-model="visible"
          :offset="-150"
          popper-class="zw-rest-prop add-cart-tooltip"
        >
        <!-- 我最近设计的产品 -->
          <save-record v-if="isLogin&&isShowRecord"></save-record>
          <div
            v-if="isLogin && $sdkConfig.platformIsZWKJ"
            slot="reference"
            class="save-record border-r"
            :class="{'active1': visible}"
          >
            <div 
            class="ml20 save-record-text"
            :class="visible ? 'active-color':''">保存记录 
            <i 
            class="iconfont arrow"
            :class="visible?' iconarrow-up-bold active-color':'iconarrow-down-bold'"></i></div>
          </div>
        </el-popover>
      </template>
       <div class="dividing-line"></div>
    </div>
    <div class="zwdesign-header--center">
      <div class="left-toolbar">
        <el-tooltip
          :enterable="false"
          class="item"
          effect="dark"
          :content="'撤销'+shortcutsTip('base20')"
          placement="top"
          v-show="isShowOptGroup"
        >
          <div
            class="toolbar-item"
            :class="{'zw-disabled': !historyList.length || historyStep<=0}"
            ref="undoBtn"
          >
            <span class="iconfont iconretract icon"></span>
            <!-- <div class="toolbar-item-text mt5 red-color f12">撤销</div> -->
          </div>
        </el-tooltip>
        <el-tooltip
          :enterable="false"
          class="item"
          effect="dark"
          :content="'重做'+shortcutsTip('base21')"
          placement="top"
          v-show="isShowOptGroup"
        >
          <div
            class="toolbar-item"
            :class="{'zw-disabled': !historyList.length || historyStep>=historyList.length-1}"
            ref="redoBtn"
          >
            <span class="iconfont iconredo icon"></span>
            <!-- <div class="toolbar-item-text mt5 f12">重做</div> -->
          </div>
        </el-tooltip>
        <el-tooltip
          :enterable="false"
          class="item"
          effect="dark"
          :content="'清空'+shortcutsTip('canvas4')"
          placement="top"
          v-show="isShowOptGroup"
        >
          <div class="toolbar-item" @click="emptyDesign">
            <span class="iconfont iconempty icon"></span>
            <!-- <div class="toolbar-item-text mt5 f12">清空</div> -->
          </div>
        </el-tooltip>
        <div class="line" v-if="isShowOptGroup && isShowAuxiliaryGroup && (isShowGridOpt||isShowRulerOpt||isShowAuxiliaryOpt)"></div>
        <el-tooltip
          :enterable="false"
          class="item"
          effect="dark"
          :content="'网格线'+shortcutsTip('canvas28')"
          placement="top"
          v-if="isShowAuxiliaryGroup && isShowGridOpt"
        >
          <div class="toolbar-item" @click="addGridLine" :class="{'active': isShowGridLine}">
            <span class="iconfont icongridlines icon"></span>
            <!-- <div class="toolbar-item-text mt5 f12">网格线</div> -->
          </div>
        </el-tooltip>
        <el-tooltip
          :enterable="false"
          class="item"
          effect="dark"
          :content="'标尺'+shortcutsTip('canvas29')"
          placement="top"
          v-if="isShowAuxiliaryGroup && isShowRulerOpt"
        >
          <div class="toolbar-item" @click="showRuler" :class="{'active': isShowRuler}">
            <span class="iconfont iconruler icon"></span>
            <!-- <div class="toolbar-item-text mt5 f12">标尺</div> -->
          </div>
        </el-tooltip>
        <el-tooltip
          :enterable="false"
          class="item"
          effect="dark"
          :content="'辅助线'+shortcutsTip('canvas31')"
          placement="top"
          v-if="isShowAuxiliaryGroup && isShowAuxiliaryOpt"
        >
          <div
            class="toolbar-item"
            @click="showAuxiliaryLine"
            :class="{'active': isShowAuxiliaryLine}"
          >
            <span class="iconfont iconauxiliary_line icon"></span>
            <!-- <div class="toolbar-item-text mt5 f12">辅助线</div> -->
          </div>
        </el-tooltip>
        <el-tooltip
          :enterable="false"
          class="item hide-llp"
          effect="dark"
          :content="'编组'+shortcutsTip('base22')"
          placement="top"
        >
          <div class="toolbar-item zw-disabled">
            <span class="iconfont iconcrop icon"></span>
            <div class="toolbar-item-text mt5 f12" v-if="showType=='group'">解除编组</div>
            <div class="toolbar-item-text mt5 f12" v-else>编组</div>
          </div>
        </el-tooltip>
      </div>
          <el-popover
            placement="bottom"
            trigger="hover"
            :visible-arrow="false"
            popper-class="zw-rest-prop design-help"
            :open-delay="0"
            :close-delay="0"
            @show="toggleDesignHelp"
            @hide="toggleDesignHelp"
          >
            <design-help></design-help>
            <div slot="reference">
              <div class="toolbar-item" :class="{'active1': isShowDesignHelp}" v-if="isShowHelpOpt">
                <span class="iconbox">
                  <i class="iconfont iconinstruction icon"></i>
                </span>
                <!-- <div class="toolbar-item-text mt5 f12">设计说明</div> -->
              </div>
            </div>
          </el-popover>
            <div class="line" ></div>
        <el-tooltip
          :enterable="false"
          class="item"
          effect="dark"
          :content="'快捷键'+shortcutsTip('system13')"
          placement="top"
          v-if="isShowShortcutOpt"
        >
          <div class="toolbar-item" :class="{'active': isShowShortcut}" @click="showShortCut">
            <span class="iconbox">
              <i class="iconfont iconhot_key icon"></i>
            </span>
            <!-- <div class="toolbar-item-text mt5 f12">快捷键</div> -->
          </div>
        </el-tooltip>
        <el-tooltip
          :enterable="false"
          class="item"
          effect="dark"
          :content="'全屏'+shortcutsTip('system1')"
          placement="top"
          v-if="isShowFullscreenOpt"
        >
          <div
            class="toolbar-item"
            @click="toggleFullScreen"
            v-show="$sdkConfig.platformIsZWKJ"
          >
            <span class="iconfont iconfull_screen icon"></span>
            <!-- <div class="toolbar-item-text mt5 f12">{{isFullScreen ? '取消全屏' : '全屏'}}</div> -->
          </div>
        </el-tooltip>
        <el-tooltip
          :enterable="false"
          class="item"
          effect="dark"
          content="位置与变换"
          placement="top"
          v-if="isShowPosOpt"
        >
          <div class="toolbar-item" ref="toolbarItemPosition" @click="showPositionOpt">
            <span class="iconfont iconalign1 icon"></span>
            <!-- <div class="toolbar-item-text mt5 f12">位置</div> -->
          </div>
        </el-tooltip>
    </div>
    <div class="zwdesign-header--right" :class="{'logined': isLogin}">
      <el-button
      v-if="userInfo&&userInfo.isDesigner"
      icon="iconfont iconsave-fill"
      class="btn save-btn template f14" style="width: 125px;" :loading="saveTemplateLoading"
      @click="productSave({type: 'template'})">
        保存设计模板
      </el-button>
      <!-- <a class="btn save-btn template f14" style="width: 125px;" :loading="saveTemplateLoading"
        @click="productSave({type: 'template'})"
        v-if="userInfo&&userInfo.isDesigner"
      >
        <i class="iconfont iconsave-fill mr2"></i>保存设计模板
      </a> -->
         <el-tooltip
          :enterable="false"
          class="item"
          effect="dark"
          content="查看购物车"
          placement="top"
          v-if="$sdkConfig.platformIsZWKJ && !isAmazonOrder && !urlQueryObj.operation"
        >
      <a @click="viewCart"  class="cart-icon">
      <div class="cart-badge-box">
        <div class="cart-badge"  v-if="cartNum !== null" 
        :class="[badgeAnimationShow?'badge-animation':'',cartNum > 99?'cart-badge-text':'']">{{cartNum> 99? '99+' : cartNum}}</div>
        <i class="iconfont iconshopping_cart cart-badge-icon"></i>
     </div>
     </a>
     </el-tooltip>
      <el-popover
        ref="addToCar"
        placement="bottom"
        trigger="manual"
        v-model="showPop"
        :disabled="!isLogin&&$sdkConfig.platformIsZWKJ"
        popper-class="zw-rest-prop add-cart-tooltip"
        v-if="!isAmazonOrder && !urlQueryObj.operation"
      >
        <div class="addtocar-box" v-if="addToCarForm">
          <div class="addtocar-color-box">
            <div class="addtocar-color">
              <span class="mr6 color-box" :style="{background:'#'+addToCarForm.color.color_tone1}"></span>
              <span>已选{{colorAlias}}：{{addToCarForm.color.name}}</span>
            </div>
            <a class="to-size-table" @click="showProductPop('size')">尺码表<i class="iconfont iconarrow-right-bold va-2 ml5"></i></a>
          </div>
          <div class="addtocar-size-price">
            <div
              class="addtocar-size-price-item"
              v-for="(item,index) in addToCarForm.sizeList"
              :key="index"
            >
              <div class="f12 size">{{item.name}}</div>
              <div class="f12 price" v-if="item.price">
                <template v-if="$sdkConfig.platformIsZWKJ">
                  ¥{{item.price}}
                  <template v-if="item.qty>0">
                    <svg class="icon svg-icon discount-icon" aria-hidden="true" v-if="item.discountDetail.discount_price_info.discount_type==5">
                      <use xlink:href="#icona-Exclusiveprice"></use>
                    </svg>
                    <svg class="icon svg-icon discount-icon" aria-hidden="true" v-if="item.discountDetail.discount_price_info.discount_type==4">
                      <use xlink:href="#icona-Saleprice"></use>
                    </svg>
                    <template v-if="item.discountDetail.discount_price_info.discount_type==6">
                      <svg class="icon svg-icon discount-icon" aria-hidden="true" v-if="item.discountDetail.discount_price_info.cumulative_level.indexOf('普')>-1">
                        <use xlink:href="#icona-Ordinarymemberprice"></use>
                      </svg>
                      <svg class="icon svg-icon discount-icon" aria-hidden="true" v-else-if="item.discountDetail.discount_price_info.cumulative_level.indexOf('黄')>-1">
                        <use xlink:href="#icona-GoldMember"></use>
                      </svg>
                      <svg class="icon svg-icon discount-icon" aria-hidden="true" v-else-if="item.discountDetail.discount_price_info.cumulative_level.indexOf('铂')>-1">
                        <use xlink:href="#icona-PlatinumMember"></use>
                      </svg>
                      <svg class="icon svg-icon discount-icon" aria-hidden="true" v-else-if="item.discountDetail.discount_price_info.cumulative_level.indexOf('钻')>-1">
                        <use xlink:href="#icona-Diamondmembership"></use>
                      </svg>
                    </template>
                    <svg class="icon svg-icon discount-icon" aria-hidden="true" v-if="item.discountDetail.discount_price_info.discount_type==8">
                      <use xlink:href="#icona-memberprice"></use>
                    </svg>
                    <!-- <el-popover
                      placement="right"
                      trigger="hover"
                      :visible-arrow="true"
                      popper-class="zw-rest-prop"
                      :open-delay="0"
                      :close-delay="0"
                      v-if="$sdkConfig.platformIsZWKJ && item.discountDetail"
                    >
                      <div class="discount-detail p15" v-if="item.discountDetail.list && item.discountDetail.list.length">
                        <p>当前商品享受多个优惠，已自动选取最优价</p>
                        <ol>
                          <li v-for="ddItem in item.discountDetail.list">
                            {{ddItem | transDiscountText}}优惠，单价{{ddItem.discount_price}}元
                          </li>
                        </ol>
                      </div>
                      <span slot="reference">
                        <i v-if="item.discountDetail.discount_price_info.discount_type==5">专</i>
                        <i v-else-if="item.discountDetail.discount_price_info.discount_type==4">促</i>
                        <i v-else-if="item.discountDetail.discount_price_info.discount_type==6">{{item.discountDetail.discount_price_info.cumulative_level}}</i>
                        <i v-else-if="item.discountDetail.discount_price_info.discount_type==8">会</i>
                      </span>
                    </el-popover> -->
                  </template>
                </template>
                <template v-else>{{item.currency}}{{item.price}}</template>
              </div>
              <div class="f12 price" v-else style="color:red">
                未设定销售价格
              </div>
              <el-input-number
                size="mini"
                v-model="item.qty"
                :min="0"
                :step="1"
                @change="changeCarCount"
                @focus="handleFocus"
                @blur="handleBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="addtocar-price-bar">
            <span class="f12 averageprice">均价：{{$sdkConfig.platformIsZWKJ ? '￥' : addToCarForm.currency}}{{addToCarForm.averageprice}}/{{addToCarForm.unit}}</span>
            <span class="f12 totalCount">总件数：{{addToCarForm.totalCount}}{{addToCarForm.unit}}</span>
            <span class="f16 totalPrice">{{$sdkConfig.platformIsZWKJ ? '￥' : addToCarForm.currency}}{{addToCarForm.totalPrice}}</span>
          </div>
          <div class="addtocar-btn-group">
            <el-button size="small" @click="addtoCarClose" round>取消</el-button>
            <el-button
              round
              size="small"
              type="primary"
              @click="addtoCarConfirm"
              :class="addToCarForm&&addToCarForm.totalCount>0?'':'zw-disabled'"
            >确定</el-button>
          </div>
        </div>
        <el-tooltip
          slot="reference"
          :enterable="false"
          class="item"
          effect="dark"
          :content="'加入购物车'+shortcutsTip('other2')"
          placement="top"
          v-if="isShowCart && $sdkConfig.platformIsZWKJ"
        >
          <!--sdk购物车样式与保存与样式一致-->
          <div class="shopping-cart" @click="addToCart">
          <el-button round class="shopping-cart-button">加入购物车</el-button>
          </div>
        </el-tooltip>
        <el-button v-if="isShowCart && !$sdkConfig.platformIsZWKJ" icon="iconfont iconshopping_cart" slot="reference" class="btn save-btn buynow-btn f14" @click="addToCart">
          加入购物车
        </el-button>
        <!-- <a v-if="isShowCart && !$sdkConfig.platformIsZWKJ" slot="reference" class="btn save-btn buynow-btn f14" @click="addToCart" :loading="saveProductLoading">
          <i class="iconfont iconshopping_cart mr2"></i>加入购物车
        </a> -->
        
      </el-popover>
      <div class="design-reference-drawing-btn"
        v-if="showDesignReferenceDrawingBtn">
        <div
          class="border-r"
          @click="showDesignReferenceDrawingPop = true"
        >
          <i class="iconfont iconpicture-fill"></i>
          <!-- <div class="mt5">设计参照图</div> --> 
        </div>
        <design-reference-drawing-pop v-if="showDesignReferenceDrawingPop" @closeDesignReferenceDrawingPop="showDesignReferenceDrawingPop = false"></design-reference-drawing-pop>
      </div>
      <div class="save-btn-content">
        <!-- <template>
          <el-button v-if="isShowNextStep && $sdkConfig.platform == 'xcxBackend'" class="btn save-btn f14" @click="productSave({type: 'template'})">
          下一步,暂时开放调试用
        </el-button>
        </template> -->
        <template v-if="isAmazonOrder || (urlQueryObj.operation && urlQueryObj.operation == 'replaceItem')">
          <el-tooltip
            :enterable="false"
            class="item"
            effect="dark"
            :content="'替换产品'+shortcutsTip('base24')"
            placement="top"
            v-if="isShowSave"
          >
            <el-button icon="iconfont iconsave-fill" class="btn save-btn buynow-btn f14" @click="productSave({type: 'replaceItem'})" :loading="saveProductLoading">
              替换产品
            </el-button>
            <!-- <a class="btn save-btn buynow-btn f14" @click="productSave({type: 'replaceItem'})" :loading="saveProductLoading">
              <i class="iconfont iconsave-fill mr2"></i>替换产品
            </a> -->
          </el-tooltip>
        </template>
        <template v-else-if="(urlQueryObj.operation && urlQueryObj.operation == 'relateItem')">
          <el-tooltip
            :enterable="false"
            class="item"
            effect="dark"
            :content="'关联产品'+shortcutsTip('base24')"
            placement="top"
            v-if="isShowSave"
          >
            <el-button icon="iconfont iconsave-fill" class="btn save-btn buynow-btn f14" @click="productSave({type: 'relateItem'})" :loading="saveProductLoading">
              关联产品
            </el-button>
            <!-- <a class="btn save-btn buynow-btn f14" @click="productSave({type: 'relateItem'})" :loading="saveProductLoading">
              <i class="iconfont iconsave-fill mr2"></i>关联产品
            </a> -->
          </el-tooltip>
        </template>
        <template v-else>
          <el-tooltip
            :enterable="false"
            class="item"
            effect="dark"
            :content="'保存'+shortcutsTip('base24')"
            placement="top"
            v-if="isShowSave"
          >
            <el-button class="btn save-btn f14" @click="productSave" :loading="saveProductLoading">
              保存
            </el-button>
            <!-- <a class="btn save-btn f14" @click="productSave" :loading="saveProductLoading">
              保存
            </a> -->
          </el-tooltip>
          <el-tooltip
            :enterable="false"
            class="item"
            effect="dark"
            content="立即购买"
            placement="top"
            v-if="isShowBuy"
          >
            <el-button icon="iconfont iconshopping-cart" class="btn save-btn buynow-btn f14" @click="buyNow">
              立即购买
            </el-button>
            <!-- <a class="btn save-btn buynow-btn f14" @click="buyNow">
              <i class="iconfont iconshopping-cart mr2"></i>立即购买
            </a> -->
          </el-tooltip>
        </template>
      </div>
      <template v-if="!isLogin && $sdkConfig.platformIsZWKJ">
        <a class="iconfont iconavatar login-btn" @click="login"></a>
      </template>
      <template v-if="isLogin && $sdkConfig.platformIsZWKJ">
        <el-popover
          trigger="hover"
          width="100"
          :open-delay="0"
          :close-delay="0"
          popper-class="link-menu"
        >
          <ul class="link-menu">
            <li>
              <a href="/merchant/index/index">控制台</a>
            </li>
            <li>
              <a href="/merchant/customerGallery/index">我的图库</a>
            </li>
            <li>
              <a href="/merchant/productType/index">选品管理</a>
            </li>
            <li>
              <a href="/merchant/customerProduct/index">定制产品</a>
            </li>
            <li>
              <a href="/merchant/order/index">订单管理</a>
            </li>
            <li>
              <a href="/merchant/Cart/index">购物车</a>
            </li>
            <li>
              <a href="/merchant/account/index">账号设置</a>
            </li>
            <li class="red">
              <a @click="logout">
                <i class="iconfont icondrop-out"></i>退出
              </a>
            </li>
          </ul>
          <div class="merchant-name" slot="reference">
            <!-- <i class="iconfont iconmember-o-level4 mr2 level" v-if="userInfo.groupLevel==1"></i> -->
            <i class="iconfont iconmember-o-mian mr2 level" v-if="userInfo.groupLevel==1"></i>
            <i class="iconfont iconmember-o-level2 mr2 level" v-if="userInfo.groupLevel==2"></i>
            <i class="iconfont iconmember-o-level1 mr2 level" v-if="userInfo.groupLevel==3"></i>
            <i class="iconfont iconmember-o-level3 mr2 level" v-if="userInfo.groupLevel==4"></i>
            <img src="@/assets/img/groupLevelBase.svg" class="mr2" style="vertical-align:-2px;" v-if="userInfo.groupLevel==7" />
            <span>{{userInfo.realname || userInfo.username }}</span>
            <i class="iconfont iconarrow-down-bold arrow"></i>
          </div>
        </el-popover>
      </template>
    </div>

    <div class="addtocar-mask" v-show="showPop" @click="showPop=false"></div>

    <!-- 位置弹窗 -->
    <div class="position-operate-pop" ref="positionPop" v-zwdrag v-if="isShowPositionOpt">
      <div class="tit">
        <div class="flex flex-col-center">
          <el-tooltip
            :enterable="false"
            class="item"
            effect="dark"
            content="拖拽可调节窗口位置"
            placement="top"
            slot="reference"
          >
            <span class="tips"><i class="iconfont icondrag-left"></i></span>
          </el-tooltip>
          <div class="txt">位置与变换</div>
        </div>
        <a class="btn mr5" @click="hidePositionPop"><i class="iconfont iconclose-bold"></i></a>
      </div>
      <PositionOperate></PositionOperate>
    </div>

    <!-- 快捷键弹窗 -->
    <shortCut v-if="isShowShortcut" @close="hideShortCut"></shortCut>

    <!-- 登录框 -->
    <Login v-if="isShowLoginPop" @close="closeLogin"></Login>

    <!-- 产品详情弹窗 -->
    <ProductDetailPop ref="productDetailPop" v-if="isShowProductPop&&($sdkConfig.platformIsZWKJ || $sdkConfig.platform == 'xcxBackend')" @close="hideProductPop"></ProductDetailPop>
    <ProductDetailSDKPop ref="productDetailPop" v-if="isShowProductPop&&(!$sdkConfig.platformIsZWKJ && $sdkConfig.platform != 'xcxBackend')" @close="hideProductPop"></ProductDetailSDKPop>

    <!-- 上传承诺保证 -->
    <UploadGuarantee v-if="isShowUploadGuaranteePop" @close="isShowUploadGuaranteePop=false" @agree="agreeGuarantee"></UploadGuarantee>

    <!-- 自定义底板弹窗 -->
    <CustomBoard v-if="isShowCustomBoard" @close="closeCustomBoard" @save="saveCustomBoard"></CustomBoard>
  </div>
</template>

<script>
import eventBus from "@/utils/eventBus.js";
import SaveRecord from "@/components/Header/SaveRecord";
import designHelp from "@/components/Header/designHelp";
import shortCut from "@/components/Header/shortCut";
import Login from "@/components/Header/Login";
import ProductDetailPop from "@/components/Product/ProductDetailPop";
import ProductDetailSDKPop from "@/components/Product/ProductDetailSDKPop";
import UploadGuarantee from '@/components/Gallery/UploadGuarantee';
import CustomBoard from '@/components/DesignPreview/CustomBoard';
import PositionOperate from '@/components/Operate/Position';
import DesignReferenceDrawingPop from "@/components/Header/DesignReferenceDrawingPop"
import { changeFullScreen, throttle, debounce, checkPlatform, GetQueryString, genLocalStorageKey } from "@/utils/utils";
import { _addToCar } from "@/apis/common.js";
import { _getSampleAuth } from "@/apis/product.js";
export default {
  data() {
    return {
      isShowDesignHelp: false,
      visible: false, //设计历史 pop
      showPop: false, //购物车 pop
      isLogin: this.$isLogin,
      userInfo: this.$isLogin ? this.$OPTIONS.userInfo : {},
      addToCarForm: null,
      isShowLoginPop: false,
      isShowUploadGuaranteePop: false,
      showDesignReferenceDrawingBtn: false, //是否显示参照设计图按钮
      showDesignReferenceDrawingPop: false, //是否显示参照设计图
      isShowRecord: GetQueryString('isShowRecord')==='0' || !this.$sdkConfig.platformIsZWKJ ? false : true,
      isShowCart: GetQueryString('isShowCart')==='0' || !this.$sdkConfig.basic.addToCart ? false : true,
      isShowSave: GetQueryString('isShowSave')==='0' || !this.$sdkConfig.basic.productSave ? false : true,
      isShowBuy: (GetQueryString('isShowBuy')==='1'&&this.$sdkConfig.platformIsZWKJ) || (!this.$sdkConfig.platformIsZWKJ&&this.$sdkConfig.basic.buyNow) ? true : false, //默认隐藏
      isShowNextStep:(GetQueryString('isShowNextStep')==='1'&&this.$sdkConfig.platformIsZWKJ) || (!this.$sdkConfig.platformIsZWKJ&&this.$sdkConfig.basic.nextStep) ? true : false, //默认隐藏
      isShowGridOpt: GetQueryString('isShowGridOpt')==='0' ? false : true,
      isShowRulerOpt: GetQueryString('isShowRulerOpt')==='0' ? false : true,
      isShowAuxiliaryOpt: GetQueryString('isShowAuxiliaryOpt')==='0' ? false : true,
      isShowHelpOpt: GetQueryString('isShowHelpOpt')==='0' ? false : true,
      isShowShortcutOpt: GetQueryString('isShowShortcutOpt')==='0' ? false : true,
      isShowFullscreenOpt: GetQueryString('isShowFullscreenOpt')==='0' ? false : true,
      isShowPosOpt: GetQueryString('isShowPosOpt')==='0' ? false : true,
      isShowOptGroup: GetQueryString('isShowOptGroup')==='0' ? false : true, //是否显示操作组
      isShowAuxiliaryGroup: GetQueryString('isShowAuxiliaryGroup')==='0' ? false : true, //是否显示辅助组
      isAmazonOrder: GetQueryString('isAmazonOrder') ? true : false, //替换产品，没有加入购物车、保存
      colorAlias: '',
      cartNum:null ,
      badgeAnimationShow:false
    };
  },
  components: {
    SaveRecord,
    designHelp,
    shortCut,
    Login,
    ProductDetailPop,
    ProductDetailSDKPop,
    PositionOperate,
    DesignReferenceDrawingPop,
    UploadGuarantee,
    CustomBoard
  },
  created() {
    if(this.urlQueryObj.isAmazonOrder) { //亚马逊定制产品替换
      this.showDesignReferenceDrawingBtn = true
      this.showDesignReferenceDrawingPop = true
    } else if(this.urlQueryObj.operation == 'relateItem' && this.urlQueryObj.imgInfo) { //关联产品
      this.showDesignReferenceDrawingBtn = true
      this.showDesignReferenceDrawingPop = true
      let imgInfo = JSON.parse(unescape(this.urlQueryObj.imgInfo))
      imgInfo.viewArr = []
      imgInfo.img.map(item => {
        imgInfo.viewArr.push({viewImage: item})
      })
      this.$store.commit('product/updateAmazonViewImgObj', imgInfo)
    }
  },
  mounted() {
    this.cartNum = this.$OPTIONS.userInfo.cartNum || null
    eventBus.$on("saveDesign", (data) => {
     if (data.redesign == 1) { //1: 继续保存  2: 重新设计
       //设计未铺满等提示时选择继续加入购物车
        return;
      }
      this.$store.commit('layout/updateSaveProductLoading', false)
      this.$store.commit('layout/updateSaveTemplateLoading', false)
      this.showPop = false;
    });
    eventBus.$on("saveProduct", () => {
      this.productSave();
    });
    eventBus.$on("addToCart", () => {
      this.addToCart();
    });
    eventBus.$on("undoHistory", () => {
      this.undoHistory();
    });
    eventBus.$on("redoHistory", () => {
      this.redoHistory();
    });
    eventBus.$on("buyNowConfirm", (data) => {
      if(this.$sdkConfig.platformIsZWKJ){
        _getSampleAuth({product_type_id: this.product.id}).then(ret=>{
          if(ret.data && ret.data.is_sample_auth){
            window.location.href = `/merchant/cart/orderCheckout?product_id=${data.id}&color_id=${this.activeColor}&size_id=${this.activeSize}&qty=1`;
          } else {
            // 没拿样权限，加购物车，从购物车走正常购买流程
            // this.$message.error({ message: "你的账号暂无该产品的拿样权限" });
            let params = {
              product_id: data.id,
              color_id: this.activeColor,
              size_id: this.activeSize,
              qty: 1,
            };
            _addToCar(params).then((res) => {
             this.cartBadgeAni(res)
              window.location.href = `/merchant/Cart/index`;
            }).catch(err => {
              if(err.status == -1000 && err.data.limit_exceeded){
                this.$confirm("您的购物车产品已达上限，请先清理后再购买", "温馨提示", {
                  confirmButtonText: "前往购物车",
                  cancelButtonText: "取消",
                  type: "warning",
                })
                  .then(() => {
                    window.location.href = "/merchant/Cart/index";
                  })
                  .catch(() => {});
                return false;
              } else {
                this.$message({
                  message: err.msg,
                  type: "error",
                  duration: 3000,
                });
              }
            })
          }
        });
      } else {
        if(this.productPrice.price === undefined){
          return alert('未设定销售价格')
        }
        const priceInfo = this.productPrice.open_color_size_price_list?.find(i => i.color_id == this.activeColor && i.size_id == this.activeSize) || {price: this.productPrice?.price || 0}
        const addPrice = this.getAddPrice();
        const price = Number(priceInfo.price) + addPrice + this.partPrice;
        const buynowData = {
          ...data,
          sdkData: {
            colorId: this.activeColor,
            sizeId: this.activeSize,
            qty: 1,
            price
          }
        };
        window.parent.postMessage({
          type: 'ZW_BUY_NOW',
          data: buynowData,
        }, this.$OPTIONS.origin)
        console.log('立即购买>>', buynowData)
      }
    });
    eventBus.$on("canAddToCar", () => {
      let priceGradientInfo

      if (this.$sdkConfig.platformIsZWKJ) {
        priceGradientInfo = this.productPrice.price_detail_info_list
      }else {
        if(this.productPrice.price === undefined){
          return alert('未设定销售价格')
        }
      }

      this.showPop = true;
      let color_id = this.activeColor;
      let size_id = this.activeSize || "";
      const addPrice = this.getAddPrice();
      this.formateAddToCarForm(priceGradientInfo, color_id, size_id, addPrice);
    });
    eventBus.$on("addToCardReq", (data) => {
      if (this.addToCarForm.totalCount <= 0) {
        this.$message({
          message: "加入购物车数量必须大于0",
          type: "error",
        });
        return;
      } else {
        let addToCarForm = this.addToCarForm;
        let params = {};
        let product_ids = [],
          color_ids = [],
          size_ids = [],
          qtys = [],
          sdkData = []
        addToCarForm.sizeList.forEach((item) => {
          if (item.qty) {
            this.$sdkConfig.platformIsZWKJ && product_ids.push(data.code);
            color_ids.push(item.color_id);
            qtys.push(item.qty);
            size_ids.push(item.id);

            if (!this.$sdkConfig.platformIsZWKJ) {
              sdkData.push({
                colorId: item.color_id,
                sizeId: item.id,
                qty: item.qty,
                price: item.price
              })
            }
          }
        });

        if (this.$sdkConfig.platformIsZWKJ) {
          params = {
            product_id: product_ids.join(","),
            color_id: color_ids.join(","),
            size_id: size_ids.join(","),
            qty: qtys.join(","),
          };

          _addToCar(params).then((res) => {
            this.$refs.addToCar.doClose();
            this.cartBadgeAni(res)
          }).catch(err => {
            if(err.status == -1000 && err.data.limit_exceeded){
              this.showPop = false;
              this.$confirm("您的购物车产品已达上限，请先清理后继续加入购物车", "温馨提示", {
                  confirmButtonText: "前往购物车",
                  cancelButtonText: "取消",
                  type: "warning",
                })
                .then(() => {
                  window.location.href = "/merchant/Cart/index";
                })
                .catch(() => {});
              return false;
            } else {
              this.$message({
                message: err.msg,
                type: "error",
                duration: 3000,
              });
            }
          })
        }else {
          this.showPop = false;
          const cartData = {
            ...data,
            sdkData
          };
          window.parent.postMessage({
            type: 'ZW_ADD_SHOP_CAR',
            data: cartData
          }, this.$OPTIONS.origin)
          console.log('加入购物车>>', cartData)
        }
      }
    });
    eventBus.$on("showLoginPop", () => {
      window.common_loginDia ? common_loginDia.show({
        successCbk: () => { location.reload() }
      }) : this.isShowLoginPop = true;
    });

    eventBus.$on('showUploadGuaranteePop', ()=>{
      this.isShowUploadGuaranteePop = true;
    });

    eventBus.$on('toggleProductDetailPop', (data)=>{
      data ? this.showProductPop() : this.hideProductPop();
    })

    //禁用F11全屏默认事件
    // document.addEventListener("keydown", function (e) {
    //   if (e.keyCode == 122) {
    //     e.preventDefault();
    //   }
    // });
    // 监听全屏改变事件
    let self = this;
    document.addEventListener(
      "fullscreenchange",
      function () {
        self.$store.commit("layout/changeFullScreen", document.fullscreen);
        self.$store.commit(
          "layout/changePrevFStatus",
          document.fullscreen == 1 ? "normal" : "full"
        );
      },
      false
    );
    document.addEventListener(
      "mozfullscreenchange",
      function () {
        self.$store.commit("layout/changeFullScreen", document.mozFullScreen);
        self.$store.commit(
          "layout/changePrevFStatus",
          document.fullscreen == 1 ? "normal" : "full"
        );
      },
      false
    );
    document.addEventListener(
      "webkitfullscreenchange",
      function () {
        self.$store.commit(
          "layout/changeFullScreen",
          document.webkitIsFullScreen
        );
        self.$store.commit(
          "layout/changePrevFStatus",
          document.fullscreen == 1 ? "normal" : "full"
        );
      },
      false
    );
    document.addEventListener(
      "msfullscreenchange",
      function () {
        self.$store.commit(
          "layout/changeFullScreen",
          document.msFullscreenElement
        );
        self.$store.commit(
          "layout/changePrevFStatus",
          document.fullscreen == 1 ? "normal" : "full"
        );
      },
      false
    );
    // document.addEventListener("click", (e) => {
    //   if (e.target.className != "record-popover") {
    //     this.$refs["record-popover"]
    //       ? this.$refs["record-popover"].doClose()
    //       : "";
    //   }
    // });

    // 撤销重做
    this.$nextTick(() => {
      this.$refs.undoBtn.onclick = throttle(self.undoHistory);
      this.$refs.redoBtn.onclick = throttle(self.redoHistory);
    });
    if(this.$sdkConfig.platform == 'xcxBackend'){
      window && window.addEventListener("message", (event) => {
         if (event.data.type === "ZWXCXBACKENDSAVETEMPLATE") {
            this.productSave({type: 'template'})
         }
      });
    }
  },
  computed: {
    showType() {
      return this.$store.state.layout.showType;
    },
    isFullScreen() {
      return this.$store.state.layout.isFullScreen;
    },
    isShowShortcut() {
      return this.$store.state.shortcut.isShowShortcut;
    },
    isShowGridLine() {
      return this.$store.state.layout.isShowGridLine;
    },
    isShowAuxiliaryLine() {
      return this.$store.state.layout.isShowAuxiliaryLine;
    },
    isShowRuler() {
      return this.$store.state.layout.isShowRuler;
    },
    view_id() {
      return this.$store.state.view_id;
    },
    historyList() {
      return this.$store.getters.historyList || [];
    },
    historyStep() {
      return this.$store.getters.historyStep || 0;
    },
    partPrice() {
        return this.$store.state.product.partCheckedList.reduce((total, cur) => {
            return total + (parseFloat(cur.price) || 0)
        }, 0).toFixed(2) || 0
    },
    product() {
      const product = this.$store.state.product.selectedProduct
      this.colorAlias = product.color_alias || '颜色'
      return product;
    },
    productInfo() {
      return this.$store.state.product.selectedProductDetail;
    },
    productPrice() {
      return this.$store.state.product.productPrice;
    },
    isSupportEasy(){
      return this.product?.is_support_easy ? true : false;
    },
    editingProduct() {
      return this.$store.state.product.editingProduct;
    },
    isShowProductPop(){
      return this.$store.state.product.isShowProductPop;
    },
    defaultProductTab(){
      return this.$store.state.product.defaultProductTab;
    },
    // 设计图层信息
    designLayers() {
      return this.$store.state.gallery.designImgList || [];
    },
    partPrice() {
      return this.$store.state.product.partCheckedList.reduce((total, cur) => {
        return total + (parseFloat(cur.price) || 0)
      }, 0) || 0
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
    sizeList() {
      if (this.product && this.product.code) {
        let { sizes } = this.product;
        let { active_color_size } = this.product;
        let activeSizes = active_color_size[this.activeColor];
        return sizes.filter((size) => activeSizes.some((a) => a == size.id));
      } else {
        return [];
      }
    },
    activeSize() {
      if (this.product && this.product.code) {
        return this.$store.state.product.editingProduct.size || "";
      } else {
        return "";
      }
    },
    isPickColor() {
      return this.$store.state.gallery.pickColorData.isPickColor;
    },
    customShortcutsMap() {
      return this.$store.state.shortcut.customShortcutsMap;
    },
    isShowPositionOpt(){
      return this.$store.state.layout.isShowPositionOpt;
    },
    urlQueryObj() {
      return this.$store.state.urlQueryObj;
    },
    amazonViewImgObj() {
      return this.$store.state.product.amazonViewImgObj
    },
    uploadImgGuarantee(){
      return this.$store.state.isUploadImgGuarantee;
    },
    isShowCustomBoard: function(){
      return this.$store.state.isShowCustomBoard;
    },
    externalPrice(){
      if(this.product && this.product.code){
        let tagList = this.product.custom_logo_list || [];
        let activeTag = this.$store.state.product.editingProduct.tag || "";
        let tagItem = tagList.find(a=>activeTag==`${a.code}_${a.id}`);
        let activeTagPrice = tagItem&&tagItem.price || '';
        let packList = this.product.pack_list || [];
        let activePack = this.$store.state.product.editingProduct.pack || "";
        let packItem = packList.find(a=>a.id==activePack);
        let activePackPrice = packItem&&packItem.price || '';
        if(activeTagPrice || activePackPrice){
          return (Number(activeTagPrice) + Number(activePackPrice)).toFixed(2);
        } else {
          return 0;
        }
      } else {
        return 0;
      }
    },
    saveProductLoading() {
      return this.$store.state.layout.saveProductLoading
    },
    saveTemplateLoading() {
      return this.$store.state.layout.saveTemplateLoading
    }
  },
  watch: {
    isPickColor(val) {
      this.$store.commit("layout/toggleAuxiliaryLine", !val);
      eventBus.$emit("toggleAuxiliaryLine", this.isShowAuxiliaryLine);
    },
    isShowPositionOpt(nv, ov){
      if(!ov && nv){
        this.$nextTick(()=>{
          this.resetPositionPop();
        })
      }
    }
  },
  filters: {
    formatePrice(value) {
      return parseFloat(value).toFixed(2);
    },
    transDiscountText(discount){
      let text = '';
      switch(discount.discount_type){
        case 1:
          text = '批量';
          break;
        case 4:
          text = '促销';
          break;
        case 5:
          text = '专享';
          break;
        case 6:
          text = discount.cumulative_level + '等级';
          break;
        case 7:
          text = '限时';
          break;
        case 8:
          text = '会员权益价';
          break;
      }
      return text;
    }
  },
  methods: {
    logout(){
      window.common_loginDia?.loginOut();
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
    //购物车badge动画控制
    cartBadgeAni(res){
      const timer = setTimeout(()=>{
          this.badgeAnimationShow = true
          this.cartNum = res.data.qty
          clearTimeout(timer)
        },100)
      this.badgeAnimationShow = false
    },
    //查看购物车
    viewCart(){
       if (!this.isLogin && this.$sdkConfig.platformIsZWKJ) {
        window.common_loginDia ? common_loginDia.show({
          successCbk: () => { window.open('/merchant/Cart/index')}
        }) : this.isShowLoginPop = true;
        return false;
      }else{
        window.open('/merchant/Cart/index')
      }
    },
    closeCustomBoard(type){
      this.$store.commit('updateIsShowCustomBoard', false);
      this.$store.commit('updateSaveBoard', false);
    },
    saveCustomBoard(){
      this.$store.commit('updateIsShowCustomBoard', false);
      this.$store.commit('updateSaveBoard', true);
    },
    agreeGuarantee(){
      this.isShowUploadGuaranteePop = false;
      this.$store.commit('updateImgGuaranteeStatus', true);
    },
    //快捷键操作提示
    shortcutsTip(id) {
      let ret = "";
      if (id && this.customShortcutsMap[id]) {
        let complexKey = this.customShortcutsMap[id].complexKey;
        if (complexKey && complexKey.length) {
          if (checkPlatform() != "windows") {
            complexKey = complexKey.map((a) => {
              let _a = a.toLowerCase();
              if (_a == "ctrl") return "⌘";
              else if (_a == "shift") return "⇧";
              else if (_a == "alt") return "⌥";
              else if(_a == 'win') return '^';
            });
          }
          ret += complexKey.join(" + ");
          ret += " + ";
        }
        ret += this.customShortcutsMap[id].keys.name;
      }
      return ret ? `(${ret})` : ret;
    },
    //点击加入购物车
    addToCart(type) {
      this.$statisticalreport.clickDesignAddCartBtn();
      if (!this.isLogin && this.$sdkConfig.platformIsZWKJ) {
        // this.$confirm("加入购物车前需要先登录，是否继续？", "提示", {
        //   confirmButtonText: "去登录",
        //   cancelButtonText: "取消",
        //   type: "warning",
        // }).then(() => {
        //   window.location.href = "/frontend/login/index";
        // });
        eventBus.$emit("beforeLoginHandler");
        window.common_loginDia ? common_loginDia.show({
          successCbk: () => { location.reload() }
        }) : this.isShowLoginPop = true;
        localStorage.setItem(genLocalStorageKey('afterLoginHandler'), type=='buyNow' ? 'buyNow' : 'addToCart');
        return false;
      } else if (!this.$sdkConfig.platformIsZWKJ) {
        eventBus.$emit("addToCar", type);
      } else if (
        this.product.is_auth != 1 &&
        this.product.group_level_product.length != 0
      ) {
        this.$confirm(
          `你的账号暂无该产品权限，无法${type=='buyNow' ? '购买' : '加入购物车'}。是否进行账户升级？`,
          "提示",
          {
            confirmButtonText: "去升级",
            cancelButtonText: "取消",
            type: "warning",
          }
        ).then(() => {
          window.open("/merchant/vipLevel/index");
        });
        return false;
      } else {
        if(type == 'buyNow'){
          // _getSampleAuth({product_type_id: this.product.id}).then(ret=>{
          //   if(ret.data && ret.data.is_sample_auth){
          //     eventBus.$emit("addToCar", type);
          //   } else {
          //     this.$message.error({ message: "你的账号暂无该产品的拿样权限" });
          //   }
          // });
          eventBus.$emit("addToCar", type);
        } else {
          eventBus.$emit("addToCar", type);
        }
      }
    },
    buyNow(){
      this.$statisticalreport.clickDesignBuyBtn();
      let color_id = this.activeColor;
      let size_id = this.activeSize || '';
      if(!size_id){
        this.$message.error({ message: "请先选择尺码" }); 
        this.$store.commit("layout/changeLeftType", "product");     
        this.$store.commit('layout/toggleProductDetail', true);
        return false;
      }
      this.addToCart('buyNow');
    },
    // 获取设计面个数(当前有设计过的面)
    getDesignView() {
      return this.designLayers.filter(
        (item) => item.childrens && item.childrens.length && item.id != 9999
      ).length;
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
    //初始化购物车数据
    formateAddToCarForm(priceGradientInfo, color_id, size_id, addPrice) {
      // console.log(priceGradientInfo, color_id, size_id);
      let unit = this.product?.unit;
      let addToCarForm = {
        totalCount: 0,
        averageprice: 0,
        totalPrice: 0,
        unit: unit ? unit : "件",
        currency: !this.$sdkConfig.platformIsZWKJ && this.productPrice.currency_code || ''
      };
      let { colors } = this.product;
      colors.forEach((color) => {
        if (color.id == color_id) {
          addToCarForm.color = color;
        }
      });
      let { code } = this.editingProduct;
      let sizeList = this.sizeList.map((item) => {
        return {
          currency: !this.$sdkConfig.platformIsZWKJ && this.productPrice.currency_code || '',
          addPrice,
          ...item,
          product_id: code,
          color_id: color_id,
          qty: item.id == size_id ? 1 : 0,
          price: 0,
          priceInfo: this.$sdkConfig.platformIsZWKJ
            ? priceGradientInfo.find(i=>i.color_id == color_id && i.size_id == item.id)
            : this.productPrice.open_color_size_price_list?.find(i => i.color_id == color_id && i.size_id == item.id) || {price: this.productPrice?.price || 0},
          discountDetail: null,
        };
      });
      addToCarForm.sizeList = sizeList;
      this.addToCarForm = addToCarForm;
      this.countCartTotalPrice();
    },
    //计算购物车产品价格和总价
    countCartTotalPrice() {
      let totalQty = 0;
      let price = 0;
      let discountDetail = null;
      let totalPrice = 0;
      this.addToCarForm.sizeList.forEach((item) => {
        totalQty += (item.qty || 0);
      });
      this.addToCarForm.totalCount = totalQty;
      this.addToCarForm.sizeList.forEach((item) => {
        if (!this.$sdkConfig.platformIsZWKJ) {
          item.price = Number(item.priceInfo.price) + item.addPrice + this.partPrice
          totalPrice += item.price * (item.qty || 0);
        } else {
          let priceItem = item.priceInfo;
          price = priceItem?.lower_discount_price_info?.discount_price;

          if(priceItem?.status){
            if(priceItem.gradient_price_list?.length){
              let now_price = 0, now_discount_detail = null;
              priceItem.gradient_price_list.forEach((gradient_price, i) => {
                if (totalQty ==0 && i == 0) {
                  now_price = parseFloat(gradient_price.lower_gradient_discount_price_info.discount_price);
                  now_discount_detail = {
                    discount_price_info: gradient_price.lower_gradient_discount_price_info,
                    list: gradient_price.discount_price_info_list || []
                  }
                  return false;
                }
                if (
                  totalQty >= gradient_price.qty_from &&
                  totalQty <= gradient_price.qty_to
                ) {
                  now_price = parseFloat(gradient_price.lower_gradient_discount_price_info.discount_price);
                  now_discount_detail = {
                    discount_price_info: gradient_price.lower_gradient_discount_price_info,
                    list: gradient_price.discount_price_info_list || []
                  }
                  return false;
                }
              });
              price = now_price;
              discountDetail = now_discount_detail;
            }
          } else { // 未设定销售价
            price = '';
          }
          price = price=='' ? 0 : price + item.addPrice + this.partPrice + parseFloat(this.externalPrice);
          item.price = price ? price.toFixed(2) : 0;
          item.discountDetail = discountDetail;
          totalPrice += price * (item.qty || 0);
        }
      });

      this.addToCarForm.totalPrice = parseFloat(totalPrice).toFixed(2);

      this.addToCarForm.averageprice = totalQty
        ? (totalPrice / totalQty).toFixed(2)
        : 0;
    },
    //修改购物车产品数量
    changeCarCount() {
      this.countCartTotalPrice();
    },
    handleFocus() {
      this.$store.commit("shortcut/updateFocusStatus", true);
    },
    handleBlur() {
      this.$store.commit("shortcut/updateFocusStatus", false);
    },
    //取消加入购物车
    addtoCarClose() {
      this.$refs.addToCar.doClose();
    },
    //确认加入购物车
    addtoCarConfirm() {
      // if (this.addToCarForm.totalCount) {
      eventBus.$emit("addtoCarConfirm");
      // let addToCarForm = this.addToCarForm;
      // let params = {};
      // let product_ids = [],
      //   color_ids = [],
      //   size_ids = [],
      //   qtys = [];
      // addToCarForm.sizeList.forEach(item => {
      //   if (item.qty) {
      //     product_ids.push(item.product_id);
      //     color_ids.push(item.color_id);
      //     qtys.push(item.qty);
      //     size_ids.push(item.id);
      //   }
      // });
      // params = {
      //   product_id: product_ids.join(","),
      //   color_id: color_ids.join(","),
      //   size_id: size_ids.join(","),
      //   qty: qtys.join(",")
      // };
      // _addToCar(params).then(res => {
      //   this.$refs.addToCar.doClose();
      //   this.productSave();
      // });
      // }
    },
    productSave({type = ''} = {}) {
      this.$statisticalreport.clickDesignSaveBtn();
      // eventBus.$emit("beforeLoginHandler");
      if (!this.isLogin && this.$sdkConfig.platformIsZWKJ) {
        eventBus.$emit("beforeLoginHandler"); //未登录保存设计
        // this.$confirm("保存产品前需要先登录，是否继续？", "提示", {
        //   confirmButtonText: "去登录",
        //   cancelButtonText: "取消",
        //   type: "warning",
        // }).then(() => {
        //   window.location.href = "/frontend/login/index";
        // });
        window.common_loginDia ? common_loginDia.show({
          successCbk: () => { location.reload() }
        }) : this.isShowLoginPop = true;
        localStorage.setItem(genLocalStorageKey('afterLoginHandler'), 'productSave');
        return false;
      } else if (
        this.product.is_auth != 1 &&
        this.product.group_level_product.length != 0 &&
        this.$sdkConfig.platformIsZWKJ
      ) {
        this.$confirm(
          "你的账号暂无该产品权限，无法保存。是否进行账户升级？",
          "提示",
          {
            confirmButtonText: "去升级",
            cancelButtonText: "取消",
            type: "warning",
          }
        ).then(() => {
          window.open("/merchant/vipLevel/index");
        });
        return false;
      } else {
        if(type == 'template'){
          this.$store.commit('layout/updateSaveTemplateLoading', true)
          eventBus.$emit("productSave", {type});
        }else if(this.urlQueryObj.operation) {
          this.$store.commit('layout/updateSaveProductLoading', true)
          if(!this.$store.state.product.editingProduct.size) {
            this.$message.error('请先选择尺码')
            this.$store.commit("layout/changeLeftType", "product");     
            this.$store.commit('layout/toggleProductDetail', true);
            this.$store.commit('layout/updateSaveProductLoading', false)
            this.$store.commit('layout/updateSaveTemplateLoading', false)
            return
          }
          eventBus.$emit("productSave", {type});
        } else{
          this.$store.commit('layout/updateSaveProductLoading', true)
          eventBus.$emit("productSave", {});
        }
      }
    },
    // 设计说明
    toggleDesignHelp() {
      this.isShowDesignHelp = !this.isShowDesignHelp;
    },
    // 快捷键
    showShortCut() {
      this.$store.commit("shortcut/toggleShortCut", true);
    },
    hideShortCut() {
      this.$store.commit("shortcut/toggleShortCut", false);
    },
    // 全屏
    toggleFullScreen() {
      if (this.isFullScreen) {
        // 取消全屏
        changeFullScreen(-1);
      } else {
        //打开全屏
        changeFullScreen(1);
      }
    },
    goIndex() {
      // if (this.$isLogin) {
      //   window.location.href = "/merchant/index/index";
      // } else {
      //   window.location.href = "/";
      // }
      if (window.location.pathname.indexOf("frontend") !== -1) {
        window.location.href = "/";
      } else {
        window.location.href = "/merchant/index/index";
      }
      // window.location.href = "/merchant/index/index";
    },
    goOldDesign() {
      this.$statisticalreport.clickNotDesignItemBtn('切换版本')
      let blob = new Blob([`is_set=1`], {
        type: "application/x-www-form-urlencoded; charset=UTF-8",
      });
      navigator.sendBeacon("/v1/DesignProductType", blob);
      eventBus.$emit("beforeLoginHandler");
      const search = window.location.search ? window.location.search + "&" : '?'
      if (window.location.pathname.indexOf("frontend") !== -1) {
        window.location.href = `/frontend/create/index${search}fromNewDesign=1`;
      } else {
        window.location.href = `/merchant/create/index${search}fromNewDesign=1`;
      }
      // if (this.$isLogin) {
      //   window.location.href = "/frontend/create/index";
      // } else {
      //   window.location.href = "/frontend/create/index";
      // }
    },
    //网格线
    addGridLine() {
      this.$statisticalreport.clickNotDesignItemBtn('网格线')
      this.$store.commit("layout/toggleGridLine", !this.isShowGridLine);
      eventBus.$emit("addGridLine", this.isShowGridLine);
    },
    // 辅助线
    showAuxiliaryLine() {
      this.$statisticalreport.clickNotDesignItemBtn('辅助线')
      this.$store.commit(
        "layout/toggleAuxiliaryLine",
        !this.isShowAuxiliaryLine
      );
      eventBus.$emit("toggleAuxiliaryLine", this.isShowAuxiliaryLine);
    },
    // 标尺
    showRuler() {
      this.$statisticalreport.clickNotDesignItemBtn('标尺')
      this.$store.commit("layout/toggleRuler", !this.isShowRuler);
      eventBus.$emit("toggleRuler", this.isShowRuler);
    },
    // 撤销
    undoHistory() {
      this.$statisticalreport.clickNotDesignItemBtn('撤销')
      if (this.historyStep <= 0) return;
      // 上一次的撤销重做操作未执行完成时，点击不生效，解决点击过快导致图层无法操作问题
      if(this.$store.state.isHistoryFreeze) return;
      // 寻找要撤回到的记录距离当前记录的跳数
      let skipStep = 0;
      for (let i = this.historyStep - 1; i >= 0; i--) {
        if (!this.historyList[i].is_undo) break;
        skipStep++;
      }
      // 标记当前撤销的记录
      this.$store.commit("updateHistory", {
        view_id: this.view_id,
        index: this.historyStep,
        is_undo: true,
      });
      this.$store.commit("updateHistoryStep", {
        view_id: this.view_id,
        val: this.historyStep - (skipStep + 1),
      });
      eventBus.$emit("restoreHistory", { flag: -1, skipStep });
    },
    // 重做
    redoHistory() {
      this.$statisticalreport.clickNotDesignItemBtn('重做')
      if (this.historyStep >= this.historyList.length - 1) return;
      // 上一次的撤销重做操作未执行完成时，点击不生效，解决点击过快导致图层无法操作问题
      if(this.$store.state.isHistoryFreeze) return;
      // 还原记录的撤销标记
      this.$store.commit("updateHistory", {
        view_id: this.view_id,
        index: this.historyStep + 1,
        is_undo: false,
      });
      this.$store.commit("updateHistoryStep", {
        view_id: this.view_id,
        val: this.historyStep + 1,
      });
      eventBus.$emit("restoreHistory", { flag: 1 });
    },
    // 清空
    emptyDesign() {
      this.$statisticalreport.clickNotDesignItemBtn('清空')
      eventBus.$emit("emptyDesign");
    },
    // 登录
    login() {
      window.common_loginDia ? common_loginDia.show({
        successCbk: () => { location.reload() }
      }) : this.isShowLoginPop = true;
    },
    // clickLogin() {
    //   eventBus.$emit("beforeLoginHandler"); //未登录保存设计
    // },
    closeLogin() {
      window.common_loginDia ? common_loginDia.hide() : this.isShowLoginPop = false;
    },
    async showProductPop(type){
       if(!this.productInfo.code || this.productInfo.code != this.product.code){
        const productDetailCache = this.$store.state.product.productDetailCache[this.product.code];
        if(productDetailCache){
          this.$store.commit('product/updateSelectedProductDetail', productDetailCache);
        } else {
          await this.$store.dispatch("product/updateSelectedProductDetail", {code: this.product.code});
        }
      }
      this.$store.commit('product/updateDefaultProductTab', type || '');
      this.$store.commit('product/toggleProductPop', true);
      this.showPop = false;
    },
    hideProductPop(){
      this.$store.commit("product/toggleProductPop", false);
    },
    showPositionOpt(){
      // 裁切过程中不显示该窗口
      if(this.$store.state.clip.isCliping) return;
      this.$store.commit('layout/changePositionOptStatus', true);
    },
    hidePositionOpt(){
      this.$store.commit('layout/changePositionOptStatus', false);
    },
    // 复位位置弹窗
    resetPositionPop(){
      let $center = document.querySelector('.zwdesign-main--center');
      let $positionPop = this.$refs.positionPop;
      // let $toolbarItem = this.$refs.toolbarItemPosition;
      // let itemRect = $toolbarItem.getBoundingClientRect();
      let centerRect = $center.getBoundingClientRect();
      $positionPop.style.top = centerRect.y + 'px';
      $positionPop.style.left = centerRect.right - 260 + 'px';
    },
    // 关闭位置弹窗
    hidePositionPop(){
      this.$store.commit('layout/changePositionOptStatus', false);
    },
    logout(){
      window.common_loginDia?.loginOut();
    }
  },
  directives: {
    zwdrag: {
      inserted: function(el, binding){
        // 拖拽
        let $titEl = el.firstChild;
        el.moveHandler = function(e){
          let winWidth = document.documentElement.clientWidth || document.body.clientWidth;
          let winHeight = document.documentElement.clientHeight || document.body.clientHeight;
          let {left,top,width,height} = el.startPos.elRect;
          let changeX = e.clientX - el.startPos.x;
          let changeY = e.clientY - el.startPos.y;
          let _left = left + changeX;
          let _top = top + changeY;
          if(_left < 0) _left = 0;
          if(_top < 0) _top = 0;
          if(_left + width > winWidth) _left = winWidth - width;
          if(_top + height > winHeight) _top = winHeight - height;
          el.style.left = _left + 'px';
          el.style.top = _top + 'px';
        }
        $titEl.addEventListener('mousedown', function(e){
          el.startPos = {
            x: e.clientX,
            y: e.clientY,
            elRect: el.getBoundingClientRect(),
          }
          document.addEventListener('mousemove', el.moveHandler, false);
        });
        document.addEventListener('mouseup', function(){
          document.removeEventListener('mousemove', el.moveHandler, false);
        }, false);
      }
    }
  },
};
</script>
<style>
.add-cart-tooltip{
  top:48px!important;
  border-radius: 5px!important;
}
</style>

<style lang="scss" scoped>
.cart-badge{
background: #F53F3F;
border-radius: 8px;
padding: 1px 4px;
position: absolute;
left: 10px;
top: -10px;
font-size: 12px;
color: #fff;
line-height: 16px;
}
.cart-badge-text{
 transform: scale(0.9)
}
.cart-badge-icon{
  font-size:20px
}
.cart-badge-box{
  position:relative;
}
.active-color{
    @include font_color("font_color2");
}
	@keyframes likes {
    
  0% { transform:  scale(1); }
  20% { transform:  scale(0.1); }
  40% { transform:  scale(1.2); }
  60% { transform:  scale(0.7); }
  80% { transform:  scale(1.1); }
  100% { transform:  scale(1); };}
  .badge-animation{
      animation-name: likes; // 动画名称
      animation-direction: normal; // 动画在奇数次（1、3、5...）正向播放，在偶数次（2、4、6...）反向播放。
      animation-timing-function: ease-out; // 动画执行方式，linear：匀速；ease：先慢再快后慢；ease-in：由慢速开始；ease-out：由慢速结束；ease-in-out：由慢速开始和结束；
      animation-delay: 0s; // 动画延迟时间
      animation-iteration-count:1; //  动画播放次数，infinite：一直播放
      animation-duration: 0.5s; // 动画完成时间
}

.switch-version{
  font-size: 14px;
  color: #777A8B;
  cursor: pointer;
  display: flex;
  align-items: center;
  line-height: 22px;
}
.version-list{
  padding: 5px 0;
}
.version-item{
  display: block;
  text-decoration: none;
  text-align: center;
  width: 120px;
  line-height: 30px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  text-shadow: 0px 10px 25px rgba(179, 185, 191, 0.15);
  cursor: pointer;
  &:hover{
    color: #0453F3;
  }
}
.addtocar-mask {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2011;
  background-color: rgba(0, 0, 0, 0.2);
}
.without-outline:focus {
  outline: none;
}
.addtocar-color-box{
  padding: 0 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color:#000
}
.addtocar-box {
  color:#37474F;
  /deep/ .el-input-number--mini {
    width: 100px;
    .el-input-number__decrease {
    height: 26px;
    background: #fff;
    &:hover{
      background: #0453F3;
      color:#fff;
    }
      .el-icon-minus {
        line-height: 26px;
      }
    }
    .el-input-number__increase {
      height: 26px;
      background: #fff;
      &:hover{
        background: #0453F3;
        color:#fff;
     }
      .el-icon-plus {
        line-height: 26px;
      }
    }
  }
  .addtocar-color {
    display: flex;
    height: 40px;
    align-items: center;
    font-weight: 500;
    .color-box {
      width: 16px;
      height: 16px;
    }
    border-bottom: 1px solid #f0f5ff;
  }
  .to-size-table{
    color: #0453F3;
    font-weight: 500;
    cursor: pointer;
  }
  .addtocar-size-price {
    .addtocar-size-price-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      padding: 0 15px;
      .size {
        width: 75px;
      }
      .price {
        width: 95px;
        display: flex;
        align-items: center;
      }
      .discount-icon{
        font-size: 14px;
        margin-left: 3px;
      }
    }
  }
  .addtocar-price-bar {
    height: 32px;
    background: #fffbe6;
    display: flex;
    align-items: center;
    padding: 0 15px;
    *{
      white-space: nowrap;
    }
    .totalCount {
      margin-left: 15px;
    }
    .totalPrice { 
      flex: 1;
      text-align: right;

      color: #fa8c16;
      font-weight: 500;
    }  
  }
  .addtocar-btn-group {
    padding: 10px 15px;
 text-align: right;
    /deep/.el-button--small.is-round{
      padding: 5px 15px;
    }
  }
}
.zwdesign-header {
  flex: none;
  height: 55px;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: 1px solid rgba(31, 93, 145, 0.1);
  box-shadow: 0px 0px 10px 0px rgba(31, 93, 145, 0.1);
  .zwdesign-header--left {
    flex: none;
    display: flex;
    align-items: center;
    padding: 0 0 0 15px;
    .logo {
      width: 200px;
      height: auto;
      color: #0453F3;
      cursor: pointer;
    }
    .save-record-text{
      font-weight: 500;
      color: #4E5969;
      margin-top: -1px;
      font-size: 14px;
      cursor: pointer;
      line-height: 22px;
    }
    .dividing-line {
      width: 1px;  
      height: 28px;
      background: rgba(0, 0, 0, 0.15);
      margin:0 7.5px 0 15px;
      }
  }
  .zwdesign-header--center {
    display: flex;
    height: 100%;
    flex: 1;
    padding: 6px 0;
    .line {
      width: 1px;
      height: 28px;
      @include background_color("background_color7");
      margin: auto 7.5px;
    }
    .left-toolbar {
      display: flex;
    }
    .right-toolbar {
      flex: none;
      display: flex;
    }
    .toolbar-item {
      margin: 0 7.5px;
      margin-top: 5px;
      cursor: pointer;
      text-align: center;
      padding: 8px;
      font-size: 12px;
      font-weight: 400;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      @include font_color("font_color4");
      .icon {
        font-size: 18px;
      }
      .toolbar-item-text {
        font-weight: 400;
        color: #37474f;
      }
      // &:not(.zw-disabled):hover,
      &:hover {
        background: #E5E5E5;
      }
      &.active {
        background: #E5E5E5;
        .iconbox {
          background: #f0f5ff;
        }
      }
    }
  }
  .zwdesign-header--right {
    flex: none;
    min-width: 320px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 15px;
    .cart-icon{
    font-size: 18px;
    cursor: pointer;
    margin-left: 27px;
    }
    .shopping-cart-button{
     background: #E6F2FF ;
     color: #0453F3;
     border-color: #E6F2FF;
     font-weight: 500;
    }
    .save-record,
    .shopping-cart {
      display: inline-block;
      text-align: center;
      cursor: pointer;
      font-size: 14px;
      white-space: nowrap;
      position: relative;
      margin-left: 27px;
      .dot {
        display: inline-block;
        width: 8px;
        height: 8px;
        background: #ff4d4f;
        border-radius: 50%;
        position: absolute;
        right: -5px;
        top: 10px;
      }
      .border-r {
        border-right: 1px solid rgba(0, 0, 0, 0.15);
      }
      &.active {
        color: #0453F3;
      }
    }


    .save-btn-content {
      min-width: 68px;
      height: 32px;
      line-height: 32px;
    }
    .save-btn {
      min-width: 68px;
      height: 32px;
      line-height: 32px;
      border-radius: 16px;
      white-space: nowrap;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      margin-left: 14px;
      padding: 0 10px;
      @include font_color("font_color1");
      @include background_color("background_color6");
      &.template{
        @include font_color("font_color2");
        @include background_color("font_color1");
        @include border(2px, solid, "border_color3");
      }
      /deep/ i {
        margin-right: 2px;
      }
    }
    .buynow-btn{
      min-width: 90px;
      margin-left: 10px;
    }
    .login-btn {
      color: rgba(0, 0, 0, 0.15);
      font-size: 32px;
      cursor: pointer;
      margin-left: 20px;
    }
    .merchant-name {
      white-space: nowrap;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 550;
      font-size: 14px;
      cursor: pointer;
      padding: 15px 0;
      margin-left: 20px;
      span {
        display: inline-block;
        max-width: 90px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      i.arrow {
        color: rgba(0, 0, 0, 0.85);
        font-weight: 550;
      }
    }
    .design-reference-drawing-btn {
      text-align: center;
      position: relative;
      margin-left: 10px;
    }
  }
  @media screen and (max-width: 1450px) {
    .zwdesign-header--right.logined{
      .merchant-name,
      .login-btn {
        margin-left: 10px;
      }
      .save-btn,
      .save-record,
      .shopping-cart,
      .design-reference-drawing-btn {
        margin-left: 10px;
      }
      .save-record {
        margin-right: 10px;
      }
    }
  }
  @media screen and (max-width: 1200px) {
    .zwdesign-header--left.logined{
      width: 340px !important;
    }
  }
}
.link-menu {
  text-align: center;
  font-size: 14px;
  li {
    line-height: 32px;
    cursor: pointer;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    &:hover {
      background: #0453F3;
      color: #fff;
    }
    &.red {
      * {
        color: #ff4d4f;
      }
    }
    .iconfont {
      vertical-align: -1px;
    }
  }
  a {
    display: block;
    color: inherit;
    text-decoration: none;
  }
}
.position-operate-pop{
  *{
    user-select: none;
  }
  position: fixed;
  top: 53px;
  left: 8000px;
  z-index: 99;
  box-shadow: 1px 1px 12px #ccc;
  >.tit{
    height: 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #F6F6F6;
    box-shadow: 0px -4px 8px 0px rgba(0, 0, 0, 0.06);
    cursor: move;
    .btn{
      padding: 5px;
      cursor: pointer;
    }
    .txt{
      color: rgba(0, 0, 0, 0.85);
      font-weight: bold;
    }
  }
}
</style>
<style lang="scss">
.el-popover {
  &.design-help {
    margin-top: 2px !important;
  }
  &.record-popover {
    margin-top: 2px !important;
  }
}
// .login-pop {
//   .el-dialog__header {
//     padding: 0;
//   }
//   .el-dialog__body {
//     padding: 40px 45px;
//   }
// }
.el-popover.link-menu {
  min-width: 100px;
  margin-top: 4px !important;
  padding: 0;
}
</style>