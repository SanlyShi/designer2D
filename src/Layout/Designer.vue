<template>
  <div class="designer" id="designer">
    <!-- <img id="aaaa" style="width: 500px" src alt /> -->
    <!-- <div id="pppp" style="width: 50px;height: 50px"></div> -->
    <!-- <div class="designer-box" :style="{width:width+'px',height:width+'px'}">设计器</div>
    <div>男款标准T恤</div>-->
    <div class="designer-container">
      <div class="view-img" :class="{'zw-scroll': viewImgStyle.hasScroll ? true : false}" >
        <div 
          class="view-img-item overall-design-btn"
          @click="changeStage({viewId: overallDesignView.id})"
          :class="{ active: overallDesignView.id == viewId, 'show-type-part': partInfos.type === 'part' }"
          v-show="productData&&productData.views&&productData.views.length>1"
        >
          <el-tooltip
            :enterable="false"
            class="item"
            effect="dark"
            :content="overallDesignView.name"
            placement="top"
          >
            <p>整体设计</p>
          </el-tooltip>
        </div>
        <swiper class="swiper" :options="swiperOption" :style="{'height': viewImgStyle.height}">
          <template v-for="item in productData.views">
            <template v-if="previewViewImage[item.id]">
              <swiper-slide :key="item.name">
                <div 
                  class="view-img-item"
                  @click="changeStage({viewId: item.id})"
                  :class="{ active: item.id == viewId, 'show-type-part': partInfos.type === 'part' }">
                  <img :src="previewViewImage[item.id].src" />
                  <el-tooltip
                    :enterable="false"
                    v-if="item.qualityClass && item.qualityClass != ''"
                    class="item"
                    effect="dark"
                    placement="top"
                  >
                    <span slot="content">
                      图层存在以下设计问题：
                      <br />
                      <span v-html="item.qualityText"></span>
                      <br />点击查看该印刷面的异常图片
                    </span>
                    <i
                      class="iconfont iconinfo-circle-fill"
                      :class="item.qualityClass"
                      @click="toLayer()"
                    ></i>
                  </el-tooltip>
                  <span v-else class="design-tips" :class="item.hasDesignClass"></span>
                </div>
                <el-tooltip
                    :enterable="false"
                    class="item"
                    effect="dark"
                    :content="item.name"
                    placement="top"
                >
                  <span
                      :class="{ active: item.id == viewId, 'show-type-part': partInfos.type === 'part' }"
                      class="part-view-desc">
                    {{item.name}}
                  </span>
                </el-tooltip>
              </swiper-slide>
            </template>
          </template>
          <swiper-slide v-for="item in partsList" :key="item.part_id">
            <div
                class="view-img-item"
                :key="item.part_name"
                :class="{ active: item.part_id == partInfos.partDetail.part_id && (partInfos.type === 'part') }"
                @click="partCheck(item)">
              <img :src="item.part_img" alt="">
            </div>
            <el-tooltip
                :enterable="false"
                class="item"
                effect="dark"
                :content="item.part_name"
                placement="top"
            >
              <span
                  :class="{active: item.part_id == partInfos.partDetail.part_id && (partInfos.type === 'part')}"
                  class="part-view-desc">
                {{item.part_name}}
              </span>
            </el-tooltip>
          </swiper-slide>
          <div class="swiper-scrollbar" slot="scrollbar"></div>
        </swiper>
        <!-- <div v-show="showChangeViewBtn" class="change-view-btn preiew-btn">
          <i class="iconfont iconarrow-up-bold"></i>
        </div>
        <div v-show="showChangeViewBtn" class="change-view-btn next-btn">
          <i class="iconfont iconarrow-down-bold"></i>
        </div> -->
        <!-- <div class="view-img-con" ref="viewImgDiv">
          <ul>
            <template v-for="item in productData.views">
              <template v-if="previewViewImage[item.id]">
                <li
                  :key="item.id"
                  @click="changeStage({viewId: item.id})"
                  :class="{ active: item.id == viewId }"
                >
                  <el-tooltip
                    :enterable="false"
                    class="item"
                    effect="dark"
                    :content="item.name"
                    placement="top"
                  >
                    <img :src="previewViewImage[item.id].src" />
                  </el-tooltip>
                  <el-tooltip
                    :enterable="false"
                    v-if="item.qualityClass && item.qualityClass != ''"
                    class="item"
                    effect="dark"
                    placement="top"
                  >
                    <span slot="content">
                      图层存在以下设计问题：
                      <br />
                      {{item.qualityText}}
                      <br />点击查看该印刷面的异常图片
                    </span>
                    <i
                      class="iconfont iconinfo-circle-fill"
                      :class="item.qualityClass"
                      @click="toLayer()"
                    ></i>
                  </el-tooltip>
                  <span v-else class="design-tips" :class="item.hasDesignClass"></span>
                </li>
              </template>
            </template>
            <template v-for="item in partsList">
              <li :key="item.part_name">
                <img :src="item.src" alt="">
              </li>
            </template>
          </ul>
        </div> -->
      </div>
      <div class="stage-container" id="stageContainer" @dragover="dragoverStage" @drop="dropToStage">
        <div :id="'container' + overallDesignView.id" :key="overallDesignView.id"></div>
        <div v-for="item in productData.views" :id="'container' + item.id" :key="item.id"></div>
        <div class="zw-loader" id="text-loading">
          <span class="spinner"></span>
        </div>
      </div>
      <!-- <ul class="bg-color-set">
        <li class="bg-color-pick">
          <zw-color-picker
            class="mr20"
            :showCustom="true"
            v-model="background_color"
            @cancel="setBgColorClick()"
            @change="setBgColorConfirm"
            @activeChange="activeSetBgColorClick"
            ref="bgColorPicker"
          ></zw-color-picker>
          <span class="iconfont icondisable-redline"></span>
        </li>
        <li>
          <el-popover
            ref="bgColorToView"
            popper-class="zw-slide-prop"
            placement="bottom"
            title
            width="120"
            trigger="click"
          >
            <div class="view-list-container">
              <div
                @click="bgColorToView(item)"
                class="f14 view-item"
                v-for="(item,index) in viewIdList"
                :key="index"
              >{{item.name}}</div>
            </div>
            <el-tooltip
              :enterable="false"
              class="item"
              effect="dark"
              content="应用至其他印刷面"
              placement="top"
              slot="reference"
            >
              <span
                :class="['iconfont','iconfile-add-to','opt-item cp',viewIdList.length <= 1?'zw-disabled':'', 'set-to-view-icon']"
              ></span>
            </el-tooltip>
          </el-popover>
        </li>
      </ul> -->
    </div>
    <div class="designer-footer">
      <div>
        <div class="designer-footer-left">
          <P :class="canvasMess.qualityClass">{{ canvasMess.quality }}</p>
          <p>当前印刷质量</p>
        </div>
      </div>
      <div class="designer-footer-center" slot="reference" @click="showProductDetail"> 
        <p>{{productData.name}}<span v-if='productData.id'>(编号{{productData.id}})</span></p>
      </div>
      <div class="designer-footer-right">
        <div class="maximize" @click="resetStageWidth()">
          <i class="iconfont iconcanvas-recovery"></i>
        </div>
        <i class="iconfont iconzoom-out" @click="reduceStageWidth()"></i>
        <div class="slider">
          <el-slider v-model="stageScale" @input="stageScaleChange()"></el-slider>
        </div>
        <i class="iconfont iconzoom-in" @click="addStageWidth()"></i>
      </div>
    </div>
    <!-- 标尺 -->
    <div class="designer-ruler">
      <div id="xRuler" class="ruler-box x"></div>
      <div id="yRuler" class="ruler-box y"></div>
    </div>
    <!-- 整体设计提示 -->
    <div class="overall-design-tip" v-show="showOverallDesignTip&&viewId==9999">
      <img src="@/assets/img/overallDesignGuide.png" width="100%" height="100%" />
    </div>
    <touch-animation v-show="showTouchAnimation && partInfos.type !== 'part'"></touch-animation>
    <!-- <div @click="saveDesign()">保存产品</div>
    <div @click="addImage()">添加设计</div>-->
    <div class="designAreasize" id="designAreasize"></div>
    <div class="containerSize" id="containerSize"></div>
    <div class="ncRemind">
      <div class="vagueRemind"></div>
      <div class="defRemind"></div>
    </div>
    <div class="spaceRemind">
      <div>
        <div class="cont">
          <i class="iconfont iconcaveat-circle-fill mr3" style="color:#FF4D4F"></i>图片未铺满设计区域，产品生产可能存在留白！
          <el-popover
            trigger="hover"
            :open-delay="0"
            :close-delay="0"
            placement="bottom"
            popper-class="overspread-popper"
          >
            <div class="content overspread-tips-info">
              <div class="tit"><span class="red">图片未铺满</span>设计区域，产品生产<span class="red">可能存在留白！</span></div>
              <img src="@/assets/img/not_covered2@2x.png" width="380" />
              <div class="gray mt15">*上图为正常铺满与未铺满的产品示例</div>
            </div>
            <div slot="reference">
              <i class="iconfont iconquestion-fill pointer" style="color:#0453F3"></i>
            </div>
          </el-popover>
        </div>
        <div>
          <a class="overspread-opt mr10 pointer" @click="overspreadHandler('1')">等比放大</a>
          <a class="overspread-opt mr10 pointer" @click="overspreadHandler('2')">镜像平铺</a>
          <a class="el-icon-close pointer close" @click="overspreadHandler('3')"></a>
        </div>
      </div>
    </div>
    <div id="cutSafeLine">全幅设计时，请务必铺满最外围的红色虚线（生产裁剪线），否则生产会留空白</div>
    <div class="designDeclareTips" id="designDeclareTips">
      <div>
        设计前，请先仔细阅读右侧的“设计说明”
        <label class="ml10">
          <input type="checkbox" @click="hideDesginTips" /> 不再提醒
        </label>
      </div>
    </div>
    <div v-if="imgFullTip" class="img-full-tip">
      <div class="title">
        <i class="iconfont iconinfo-circle-fill"></i>
        <span>全幅多面产品首张图片默认设为背景且应用到所有面，取消应用可恢复为原始添加方式。</span>
      </div>
      <div class="footer">
        <p>(可以在右侧“应用所有面”设置是否开启)</p>
        <div>
          <el-button type="primary" size="mini" @click="imgFullClick(2)">取消应用</el-button>
          <el-button type="primary" size="mini" @click="imgFullClick(1)">自动应用({{imgFullTime}}S)</el-button>
        </div>
      </div>
    </div>
    <!-- <div style="display: none">{{previewList}}</div> -->
    <el-dialog
      title="提示"
      :visible.sync="saveTipDialog"
      :modal-append-to-body="false"
      :destroy-on-close="true"
      :lock-scroll="false"  
      @close="redesign = 2"
      custom-class="save-tip-dialog"
      width="520px"
    >
      <div slot="title" class="save-tip-title">
        <i class="iconfont iconinfo-circle-fill f20"></i>
        <span class="f16">该产品存在以下问题：</span>
      </div>
      <div class="save-tip-content">
        <!-- <div v-html="saveTiphtml"></div> -->
        <div>
          <div class="product-name">
            <strong>{{productData.name}}</strong> 存在以下问题，<span style="color:#0453F3">请确认是否重新设计？</span>
          </div>
          <ul>
            <li v-for="item,index in saveTipItems" :key="index">
              <div>
                <span v-html="item.content"></span>
                <el-popover
                  trigger="hover"
                  :open-delay="0"
                  :close-delay="0"
                  placement="bottom"
                  popper-class="overspread-popper"
                >
                  <div class="content overspread-tips-info">
                    <template v-if="item.type==1">
                      <div class="tit">
                        <span class="red">面未设计</span>可能造成商品<span class="red">缺失完整性</span>，详见下方示例
                      </div>
                      <img src="@/assets/img/not_covered1@2x.png" width="auto" height="120" />
                    </template>
                    <template v-else-if="item.type==2">
                      <div class="tit">
                        <span class="red">设计未铺满设计区域</span>可能造成<span class="red">生产留白</span>，详见下方示例
                      </div>
                      <img src="@/assets/img/not_covered2@2x.png" width="auto" height="120" />
                    </template>
                    <template v-else>
                      <div class="tit">
                        <span class="red">图片像素不足</span>，印刷在商品上将会<span class="red">模糊</span>，详见下方示例
                      </div>
                      <img src="@/assets/img/not_covered3@2x.png" width="auto" height="120" />
                    </template>
                  </div>
                  <div slot="reference">
                    <i class="iconfont iconquestion-fill pointer" style="color:#0453F3"></i>
                  </div>
                </el-popover>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div slot="footer" class="dialog-footer save-tip-footer">
        <label>
          <input type="checkbox" v-model="designRemind" />
          <span> 7天不再提醒</span>
        </label>
        <div>
          <el-button id="saveContinue" class="continue" :round="true">{{imgFullAllDesignTips.noText}}</el-button>
          <el-button id="saveRedesign" type="primary" :round="true">是，重新设计</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- <el-dialog title="编辑文字" :visible.sync="editTextPop" :modal-append-to-body="false" width="50%">
      <textarea
        name
        id
        rows="8"
        v-model="textString"
        style="width: 100%"
        @focus="handleFocus"
        @blur="handleBlur"
        ref="tEditTextarea"
        placeholder="请输入文字内容"
      ></textarea>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelEditText">取 消</el-button>
        <el-button type="primary" @click="confirmEditText">确 定</el-button>
      </span>
    </el-dialog> -->
    <!-- <div id="pickCTip">请移入设计区域内取色</div> -->
    <!-- 清空提示 -->
    <el-dialog
      :visible.sync="isShowEmptyTip"
      custom-class="zw-message-pop"
      :modal-append-to-body="false"
      :destroy-on-close="true"
      width="480px"
    >
      <div slot="title" class="dialog-title">
        <i class="el-icon-warning primary-icon"></i> 提示
      </div>
      <div class="dialog-content pl25">是否清空面设计？</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="emptyDesignConfirm(0)">清空当前面</el-button>
        <el-button type="primary" @click="emptyDesignConfirm(1)">清空所有面</el-button>
      </div>
    </el-dialog>
    <!-- 自定义右键菜单 -->
    <div class="design-menu" id="designMenu">
      <ul>
        <li
          class="menu-item"
          :class="{'disabled': item.disabled}"
          v-for="item in designMenuData"
          :key="item.id"
        >
          <a @click="designMenuItemClick($event, item)">
            <span class="pr15" :style="{'color': item.id=='delete' ? '#FF4D4F' : ''}">{{item.name}}</span>
            <span v-if="item.shortcut || (item.subData&&item.subData.length)">
              <span class="code" v-if="item.shortcut">{{item.shortcut}}</span>
              <i class="iconfont iconarrow-right-bold" v-if="item.subData && item.subData.length"></i>
            </span>
          </a>
          <ul v-if="item.subData && item.subData.length">
            <li
              class="menu-item"
              :class="{'disabled': item.disabled}"
              v-for="sItem in item.subData"
              :key="sItem.id"
            >
              <a @click.stop="designMenuItemClick($event, sItem)">
                <span class="pr15">{{sItem.name}}</span>
                <span>
                  <span class="code" v-if="sItem.shortcut">{{sItem.shortcut}}</span>
                  <template v-if="sItem.type=='rotation'">
                    <i
                      class="iconfont iconicon_45degree rotation-icon"
                      v-if="sItem.options.deg==45"
                    ></i>
                    <i
                      class="iconfont iconicon_90degree rotation-icon"
                      v-if="sItem.options.deg==90"
                    ></i>
                    <i
                      class="iconfont iconicon_180degree rotation-icon"
                      v-if="sItem.options.deg==180"
                    ></i>
                  </template>
                </span>
                <!-- 自定义旋转角度 -->
                <input
                  v-if="sItem.id=='rotation_custom'"
                  type="number"
                  min="-180"
                  max="180"
                  v-model="designMenuOpt.rotation"
                  @focus="handleFocus"
                  @blur="handleBlur"
                  @keydown.enter.stop="changeRotationByMenu"
                />
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <!-- 下载效果图 -->
    <el-dialog
      :visible.sync="isShowDownloadEffect"
      custom-class="zw-download-effect-pop"
      :modal-append-to-body="true"
      :destroy-on-close="true"
      width="480px"
    >
      <div slot="title" class="dialog-title">下载效果图</div>
      <div class="dialog-content">
        <div class="mb10">产品编号：{{downloadForm.productId}}</div>
        <div class="mb10 size">
          <span>图片尺寸：</span>
          <el-select
            style="width:100%;flex:1"
            v-model="downloadForm.size_type"
            size="small"
            class="mr10 __zw-select"
            :popper-append-to-body="false"
          >
            <el-option
              v-for="item in downloadSizes"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
        <div class="mb10">导出数量：{{downloadForm.number}}</div>
        <div class="tips">
          <span class="tips-span">说明!</span>
          <div class="ml5">
            1. 单次最多支持50个定制产品下载效果图；<br/>
            2.导出记录只显示近30天的导出记录，请及时下载。
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="downloadEffectConfirm">导出</el-button>
      </div>
    </el-dialog>

    <replace-product ref="replaceProduct"></replace-product>
    <model-parts-preview
        :baseWidth="productData.base_width"
        :modelOptions="m_mpp_curModelForPart"
        :modelId="m_mpp_curModelIdForPart"
        @getImg="m_mpp_putPartImgToLayer"
        ref="ModelPartsPreview">
    </model-parts-preview>
  </div>
</template>

<script>
import Konva from "@/utils/konva7.2.1";
import TouchAnimation from "@/components/TouchAnimation";
import { designImgArr, productData } from "@/utils/designerJson.js";
import modelPartsPreviewMix from "@/Layout/designerMix/modelPartsPreviewMix"
import {
  stageObj,
  cacheProductPrintAreas,
  linkageDesign,
  bgImgLinkageStart,
  convertSizeToMm,
  getRotatePoint,
  getStyle,
  ClearBr,
  windowResize,
  calcTwoTransform,
  overallDesignView,
  imgSizeCalculate,
  getRotateNodePoint,
  getAbsoluteNodeTopLeftXY,
  getNodeCenterXY,
  destroy3DModel,
  destroy3DModelIs3D
} from "@/utils/designer.js";
import { zw_PerspT } from "@/utils/perspective-transform.js";
import { zw_Mesh2D } from "@/utils/createMesh.js";
import getColorByCanvas from "@/utils/getColorByCanvas.js";
import { getProductType, productSave, productTemplateSave, downloadDetailImg, previewDownload, getProductTemplate } from "@/apis/designer.js";
import { _getRecordByCode } from "@/apis/product.js";
import { _getPhotoDetail, _galleryTemplate } from '@/apis/gallery.js'
import eventBus from "@/utils/eventBus.js";
import { 
  changeFullScreen, formateColor, GetQueryString, checkPlatform, loadFont, 
  genLocalStorageKey, getSDKUserCode, throttle, rotateConvert, loadImgs, amazonLoadFont,
  getNodesClientRect
} from "@/utils/utils";
import { transView} from '@/utils/dataTrans';
import { isRisk, changeImageFilter } from "@/utils/gallery.js";
import { composeDetail3D } from "zw-3d/new3d/lib/zw3d";
import ZwColorPicker from "@/components/common/ZwColorPicker";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import ReplaceProduct from "@/components/Header/ReplaceProduct"
import multipleSelect from "@/mixins/multipleSelect"
import CLIP from '@/mixins/clip.js'
import SC from '@/mixins/shortcut.js'
import EditText from "@/mixins/editText.js"
let threeDApp = []
let keepThreeDApp = []

const env = process.env;
const STATIC_URL = env.VUE_APP_BASE_STATIC_URL;
const STATIC_URL_BY_ENV =
  env.NODE_ENV === "development"
    ? STATIC_URL
    : `${STATIC_URL.replace("/static/", `@${env.VUE_APP_VERSION}/static/`)}`;

//16*16 三角形面片进行拟合
const FISH_DIV = 16;
const FISH_DIV_h = 16;
export default {
  mixins: [CLIP, SC, modelPartsPreviewMix, multipleSelect, EditText],
  props: {
    width: {
      type: Number,
      default: 300,
    },
  },
  components: {
    TouchAnimation,
    ZwColorPicker,
    Swiper,
    SwiperSlide,
    ReplaceProduct,
  },
  data() {
    return {
      stage: null,
      layer1: null,
      productArr: [],
      ratio: 0,
      stageObj: {},
      previewStageObj: {},
      previewViewImage: {},
      productData: {},
      defaultValues: {},
      designImgArr: designImgArr.data.data,
      viewId: 1,
      viewImgObj: [],
      // threeDApp: [],
      designContainerWidth: 0,
      designToJson: {},
      anchorGroup: null,
      anchorDelete: null,
      imgDelete: new Image(),
      imgRotate: new Image(),
      imgLock: new Image(),
      detailImages: {},
      largeDetailImages: {},
      curColorId: 0,
      curColorIdLargeImage: 0,
      curDetailColorId: "",
      curPreviewColorId: 0, //点击颜色获取当前颜色id
      curDetailIndex: 0,
      curPreviewIndex: 0,
      layerImgList: [], //图层，每一面的设计图片信息,
      // curViewIndex: 0,
      // curViewIndexList: [0,1,2,3],
      imgMaximizationType: "",
      curNode: null,
      saveProductObj: {},
      redesign: 1,
      saveTipDialog: false,
      // saveTiphtml: "",
      saveTipItems: [],
      designRemind: false,
      designTransformData: {},
      stageScale: 0,
      stageScaleStep: (1200 - 300) / 100, //设计区域最大1200px，最小300px
      stageContainerWidthEmpty: 0,
      konvaJson: {}, // 保存设计的json
      viewName: "",
      cloneStartTime: null,
      cloneTimeout: null,
      isShowGridLine: false, //是否显示网格线
      editTextPop: false,
      textString: "",
      canvasMess: {
        //页面左下角印刷品质
        quality: "",
        size: "",
        qualityClass: "",
      },
      showTouchAnimation: true,
      showOverallDesignTip: true,
      cloneViewLength: 0,
      imgFullAllDesignTips: {
        noText: "",
      },
      isChangeDesign: false,
      // 设计提示
      isShowDesignTips: true,
      canvasLoadFinish: true,
      changeProductEndTime: 0,
      // stageOffsetX: 0,
      // stageOffsetY: 0,
      // 清空提示
      isShowEmptyTip: false,
      // 右键菜单
      designMenuData: [],
      designMenuOpt: {
        rotation: 0,
      },
      saveImageDataValid: null,
      saveImageDataStartTime: null,
      background_color: "",
      sysPlatform: checkPlatform(),
      imgFullTip: false,
      imgFullTime: 10,
      clipboardData: null,
      mergeAllView: false,
      needCanvas: false,
      need2dImg: false,
      createProductInit: false,
      partsList: [],
      showChangeViewBtn: true,
      viewImgStyle: {},
      swiperOption: {
        direction: 'vertical',
        slidesPerView: 'auto',
        freeMode: true,
        scrollbar: {
          el: '.swiper-scrollbar'
        },
        mousewheel: true
      },
      // 下载效果图
      isShowDownloadEffect: false,
      downloadForm: {
        productId: '',
        number: '',
        size_type: 1
      },
      downloadSizes: [],
      overallDesignView: overallDesignView,
      overallDesignId: 0,
      // 当前使用的模板信息
      templateCache: {
        // code: '',
        // views: '',
        // cfgs: {}
      },
      cloneStageDone: false
    };
  },
  created() {
    this.imgDelete.src = require("../assets/img/design/btn-delete.png");
    this.imgRotate.src = require("../assets/img/design/btn-rotate.png");
    this.imgLock.src = require("../assets/img/design/btn-lock.png");
    composeDetail3D.staticPath = `${STATIC_URL_BY_ENV}images/`
    composeDetail3D.decoderPath = `${STATIC_URL_BY_ENV}draco/`
  },
  mounted() {
    // window.onresize = windowResize(this.resize3dModel());
    this.eventBusFun();
    const customProId = GetQueryString("customProId") || GetQueryString("product_code");
    if(customProId) { //替换产品
      eventBus.$emit("getProductByCode", customProId);
    }

    this.initCtxMenuEvents();
    this.initDownloadEffectHandler();
  },
  computed: {
    productHasDetail() {
      return this.product.colors.find(i => i.detail.length)
    },
    curViewIndexList: function () {
      return this.$store.getters.curViewIndexList;
    },
    curViewIndex: function () {
      return this.$store.state.gallery.swiperCurId;
    },
    isLargePreview: function () {
      return this.$store.state.gallery.isLargePreview;
    },
    product() {
      let productData = this.$store.state.product.selectedProduct;
      return productData;
    },
    customShortcutsMap(){
      return this.$store.state.shortcut.customShortcutsMap;
    },
    shortcuts() {
      return Object.values(this.$store.state.shortcut.customShortcutsMap) || [];
    },
    isFullScreen() {
      return this.$store.state.layout.isFullScreen;
    },
    isShowAuxiliaryLine() {
      return this.$store.state.layout.isShowAuxiliaryLine;
    },
    isShowRuler() {
      return this.$store.state.layout.isShowRuler;
    },
    historyListMap() {
      return this.$store.state.historyListMap;
    },
    historyStepMap() {
      return this.$store.state.historyStepMap;
    },
    historyList() {
      return this.$store.getters.historyList || [];
    },
    historyStep() {
      return this.$store.getters.historyStep || 0;
    },
    viewIdList: function () {
      let allViewsCfg = JSON.parse(
        JSON.stringify(this.$store.getters.allViewsCfg)
      );
      allViewsCfg.splice(
        allViewsCfg.findIndex((item) => {
          return item.id == this.viewId;
        }),
        1
      );
      allViewsCfg.unshift({ id: -1, name: "所有面" });
      return allViewsCfg;
    },
    is3dModel() {
      return this.$store.state.gallery.is3dModel;
    },
    isSelectedProduct(){
      return this.$store.state.gallery.isSelectedProduct;
    },
    filterData() {
      return this.$store.state.gallery.filterData
    },
    isSaveBoard() {
      return this.$store.state.isSaveBoard
    },
    isShowCustomBoard: function(){
      return this.$store.state.isShowCustomBoard;
    },
    urlQueryObj() {
      return this.$store.state.urlQueryObj;
    },
    partChangeTimes() {
      return this.$store.state.product.partChangeTimes
    },
    textFamilyOptions() {
      return this.$store.state.layout.textFamilyOptions || [];
    },
    partInfos() {
      return {
        type: this.$store.state.layout.showType,
        partDetail: this.$store.state.product.partDetail
      }
    },
    amazonOriginalLayer() {
      return this.$store.state.product.amazonOriginalLayer
    },
  },
  watch: {
    is3dModel: function (nv, ov) {
      if(this.isSelectedProduct) return;
      this.isChangeDesign = false
      this.cloneStageDone = false
      destroy3DModel({ //不删主图
        threeDApp,
        detailImages: this.detailImages,
        isDeleteLarge: this.isLargePreview
      })
      if (nv) {
        this.$store.commit("changeCurViewIndexList", {
          curViewIndexList: [0]
        })
      }
      const index = keepThreeDApp.findIndex(item => item.code == `${this.productData.code}-small-is3dModel`)
      
      if(!this.isLargePreview && nv && index != -1) {
        let faceListMap = {}
        for (let item of this.viewImgObj) {
          faceListMap[item.id] = item.viewDesignCanvas;
        }
        keepThreeDApp[index].drawApp.updateFaceListMap(faceListMap)
      } else {
        this.$nextTick(() => {
          if(this.isLargePreview) {
            this.setViewDesigns({
              flag: 0,
              operateType: "",
              colorId: this.curColorIdLargeImage,
              curIndex: nv ? 0 : this.curViewIndex,
              type: "detail",
            });
          } else {
            this.setViewDesigns({
              flag: 0,
              operateType: "",
              colorId: this.curColorId,
              curIndex: nv ? 0 : this.curViewIndex,
              type: "detail",
            });
          }
        });
      }
    },
    isSaveBoard(nv) {
      if(nv) {
        this.$store.dispatch("product/updateSelectedProduct", {code: this.productData.code, isUpdate: -1}).then(res => {
          destroy3DModel({
            threeDApp,
            detailImages: this.detailImages,
          })
          destroy3DModel({
            threeDApp: keepThreeDApp,
            detailImages: this.detailImages,
          })
          this.productData.colors = res.colors
          this.$store.commit("changeCurViewIndexList", {
            curViewIndexList: [0,1,2,3,4,5]
          });
          this.isChangeDesign = true;
          this.setViewDesigns({
            flag: 0,
            operateType: "",
            colorId: this.curColorId,
            curIndex: 0,
            type: "detail",
          });
        })
      }
    },
    stageScale: function (nv, ov) {
      this.initRulerAll();
    },
    isLargePreview: function (nv, ov) {
      this.cloneStageDone = false
      if (nv) {
        this.curColorIdLargeImage = this.curColorId
        this.$nextTick(() => {
          for (let i = 0; i < threeDApp.length; i++) {
            const app = threeDApp[i];
            // if(app.code == this.productData.code+'-large-is3dModel') {
            //   app.drawApp.destroy();
            //   threeDApp.splice(i, 1);
            //   i-=1
            // }
            if((app.code.indexOf(this.productData.code+'-small-renderIndex-'+this.curViewIndex) != -1 &&
            app.code.indexOf('-colorId-'+this.curColorId) != -1)) {
              //把当前细节图存起来，防止打开大图加载大图模型超过16个，小图模型丢失
              keepThreeDApp.push(app)
            } else {
              app.drawApp.destroy();
            }
          }
          threeDApp = []
          // if (this.isChangeDesign) {
            //有改变设计的时候大图才重新渲染
            this.setViewDesigns({
              flag: 0,
              operateType: "",
              colorId: this.curColorId,
              curIndex: 0,
              type: "detail",
            });
        });
      } else {
        this.isChangeDesign = false;
        for (let i = 0; i < keepThreeDApp.length; i++) {
          const app = keepThreeDApp[i];
          //在大图可能会切颜色，关闭大图的时候小图加载大图选中的颜色
          if((app.code.indexOf(this.productData.code+'-small-renderIndex-'+this.curViewIndex) != -1 &&
            app.code.indexOf('-colorId-'+this.curColorId) != -1)) {
            threeDApp.push(app)
            keepThreeDApp.splice(i, 1);
            i-=1
          }
        }
        this.$nextTick(() => {
          this.setViewDesigns({
            flag: 0,
            operateType: "",
            colorId: this.curColorId,
            curIndex: this.curViewIndex,
            type: "detail",
          });
        });
      }
    },
    "product.code": {
      handler(nv) {
        if (this.productData.views) {
          //切换产品
          if (nv == this.productData.code) return;
          this.productChange({ type: "click" });
        } else {
          //项目初始化
          this.productData = this.$store.state.product.selectedProduct;
          this.defaultValues = this.productData.defaultValues;
          this.$nextTick(() => {
            this.init();
          });
        }
      },
    },
    saveTipDialog(nv) {
       if (!nv) {
        eventBus.$emit("saveDesign", { redesign: this.redesign });
      }
    },
    "filterData.url2": {
      async handler(nv) {
        const designObj = linkageDesign(this.productData, this.viewId, this.curNode)
        for(let _viewId in designObj) {
          for(let item of designObj[_viewId]) {
            item.node.setAttrs({
              rendercode: this.filterData.rendercode,
              render_id: this.filterData.render_id
            })
            await this.replaceFilter({node: item.node, viewId: item.id, url: nv}).then(async (data) => {
              await this.drawRepeatType({
                viewId: data.viewId,
                type: data.node.getAttrs().tileType,
                node: data.node,
                spacingH: data.node.getAttrs().spacingH,
                spacingV: data.node.getAttrs().spacingV,
              }).then(() => {
                this.addHistory('图片滤镜', item.id, {nodeId: item.node.getAttrs().historyId})
              });
            })
          }
          this.cloneStage({ viewId: _viewId });
        }
      }
    },
    partChangeTimes() {
      this.isChangeDesign = true
      this.setViewDesigns({
        flag: 1,
        operateType: "",
        colorId: this.curColorId,
        curIndex: 0,
        type: "detail",
        viewId: this.viewId,
        isPartChange: true
      });
    },
    "amazonOriginalLayer.done": {
      handler(nv) {
        if(nv) {
          this.amazonOrderParsing(this.amazonOriginalLayer.data)
        }
      }
    }
  },
  methods: {
    afterLoginHandler({type=''} = {}){
      let timer = null;
      switch(type){
        case 'productSave':
          eventBus.$emit('saveProduct');
          break;
        case 'addToCart':
          if(Object.keys(this.$store.state.product.selectedProductDetail).length){
            eventBus.$emit('addToCart');
          } else {
            if(timer) clearTimeout(timer);
            timer = setTimeout(() => {
              this.afterLoginHandler({type})
            }, 400);
          }
          break;
        case 'buyNow':
          if(Object.keys(this.$store.state.product.selectedProductDetail).length){
            eventBus.$emit("addToCar", 'buyNow');
          } else {
            if(timer) clearTimeout(timer);
            timer = setTimeout(() => {
              this.afterLoginHandler({type})
            }, 400);
          }
          break;
      }
    },
    dragoverStage(e){
      e.preventDefault();
    },
    dropToStage(e){
      e.preventDefault();
      if (!e.dataTransfer.getData("dragData")) return;
      // 放置在设计区域外时不执行
      if(!this.checkIsInDesignArea(e)) return;
      let dragData = JSON.parse(e.dataTransfer.getData("dragData"));
      if(dragData.isBg){
        dragData = dragData.data;
        this.$store.commit("layout/changeSelectType", "image");
        eventBus.$emit("galleryClick", { galleryData: dragData,  isBg: true});
      } else {
        dragData = dragData.data;
        if(dragData.__isTemplate){
          getProductTemplate({code: dragData.code}).then(res=>{
            if(res.status>0){
              eventBus.$emit('applyTemplate', {code: dragData.code, data: res.data});
            }
          }).catch(err=>{
            // this.$message.error('该模板已下架，无法使用');
          })
        } else{
          if(this.curNode && this.curNode.image){
            this.replaceImage({
              imageData: dragData,
              viewId: this.viewId
            })
          } else {
            this.$store.commit("layout/changeSelectType", "image");
            eventBus.$emit("galleryClick", { galleryData: dragData });
          }
        }
      }
    },
    // 判断当前鼠标位置是否在画布之外
    checkIsInDesignArea(e){
      let pos = {x: e.clientX, y: e.clientY};
      let designerEle = document.querySelector('#designer');
      let designerElePos = designerEle.getBoundingClientRect();
      let curStage = stageObj[`stage${this.viewId}`];
      let layerBgRect = curStage.findOne(".layerBg").getClientRect();
      let minX = designerElePos.x + curStage.x(),
        maxX = minX + layerBgRect.width,
        minY = designerElePos.y + curStage.y(),
        maxY = minY + layerBgRect.height;
      if(pos.x > minX && pos.x < maxX && pos.y > minY && pos.y < maxY){
        return true
      }
      return false;
    },
    resetCfgAttrs(cfg, cfgViews, templateCode){
      let konvaJson = {}, newCfg = [], newKonvaJson = {};
      if(cfg && cfg.length){
        // 过滤风险词图片
        let filterData = [],
          riskImg = 0;
        for (let item of cfg) {
          if (item.image && isRisk(item.image)) {
            riskImg++;
          } else {
            filterData.push(item);
          }
        }
        if (riskImg > 0) {
          this.$message.error("图片信息异常，无法使用");
        }
        cfg = filterData;
      }
      if(cfg && cfg.length>0 && cfg[0].konvaAttrs){
        for(let i=0; i<cfg.length; i++){
          let item = cfg[i];
          if(this.$sdkConfig.platform == 'xcxBackend' && item.id){
            item.konvaAttrs['idE'] = item.id
          }
          if(this.$sdkConfig.platform == 'xcxBackend' && item.image && item.image.channel_id){
            item.konvaAttrs['channel_id'] = item.image.channel_id
          }
          if(!konvaJson[item.view_id]){
            konvaJson[item.view_id] = [];
          }
          if(item.type == 'design') { //旧版图片翻转designImg2保存的是base64，跳到新版保存的时候要把base64删除，这里要加回上图片地址才能添加图片
            item.konvaAttrs.imageData.designImg = item.image.designImg
            item.konvaAttrs.imageData.designImg2 = item.image.designImg2
            item.konvaAttrs.imageData.designImg3 = item.image.designImg3
            item.konvaAttrs.flipImgUrl = item.image.designImg3 || item.image.designImg2;
            // item.konvaAttrs.gallery_id = item.image.gallery_id
            // item.konvaAttrs.render_id = ''
            // item.konvaAttrs.rendercode = ''
          } else if(item.type === 'text') {
            if(item.text.isAmazonOrder == 1) { //亚马逊订单使用设计器没有的字体，后端传字体包过来前端做兼容
              item.konvaAttrs.fontUrl = item.text.url
            }
          }
          if(cfgViews&&cfgViews.length){
            // 如果是模板, 记录索引值，切换产品时需要取出初始的配置还原位置
            item.konvaAttrs.tempCfgIndex = i;
            item.konvaAttrs.templateCode = templateCode;
          } else {
            // 从保存记录来的,要删除template相关的标识, 保存的时候不记录次数
            if(item.konvaAttrs.templateCode){
              this.templateCache.code = item.konvaAttrs.templateCode
              delete item.konvaAttrs.templateCode;
              delete item.konvaAttrs.tempCfgIndex;
            }
            // 保存完定制产品，第三方图片已替换成平台的图片，删除第三方sdk图库信息
            if(item.konvaAttrs.imageData && item.image){
              item.konvaAttrs.imageData.code = item.image.gallery_id;
            }
          }
          konvaJson[item.view_id].push(item.konvaAttrs);
          newCfg.push(item);
        }

        // 模板，根据当前面重组数据结构
        if(cfgViews&&cfgViews.length){
          for(let i=0; i<this.productData.views.length; i++){
            let curView = this.productData.views[i];
            if(!newKonvaJson[curView.id]) newKonvaJson[curView.id] = [];
            // 模板映射关系，单面应用到所有，多面按顺序
            let tempId = cfgViews.length===1 ? cfgViews[0].id : (cfgViews[i] ? cfgViews[i].id : null);
            newKonvaJson[curView.id] = tempId&&konvaJson[tempId] ? JSON.parse(JSON.stringify(konvaJson[tempId])) : [];
            newKonvaJson[curView.id].forEach(designAttrs => {
              if(designAttrs.name.indexOf('template') == -1){
                designAttrs.name += ' template'
              }
              designAttrs.templateCode = templateCode;
              this.diffViewTheSameDesign({
                currentView: curView,
                associateProductView: cfgViews.length===1 ? cfgViews[0] : cfgViews[i],
                currentRecordData: designAttrs,
                associateNodeAttrs: designAttrs,
                fromCustomProducts: true, 
                type: designAttrs.name.indexOf('designText')? 'text' : 'image'
              })
            })
          }
        }

        for(let key in konvaJson) {  //整体设计
          konvaJson[key].forEach(designAttrs => {
            if(designAttrs.name.indexOf('overallDesign') != -1) {
              if (!newKonvaJson[9999]) {
                newKonvaJson[9999] = [];
              }
              if (!konvaJson[9999]) {
                konvaJson[9999] = [];
              }
              let nodeAttrs = JSON.parse(JSON.stringify(designAttrs))
              if(cfgViews&&cfgViews.length){
                nodeAttrs.name += ' template'
                this.diffViewTheSameDesign({
                  currentView: this.overallDesignView, 
                  associateProductView: cfgViews[0], 
                  currentRecordData: designAttrs, 
                  associateNodeAttrs: nodeAttrs, 
                  fromCustomProducts: true, 
                  type: designAttrs.name.indexOf('designText')? 'text' : 'image'
                })
              } else {
                this.diffViewTheSameDesign({
                  currentView: this.overallDesignView, 
                  associateProductView: this.productData.views.find(item => item.id == key), 
                  currentRecordData: designAttrs, 
                  associateNodeAttrs: nodeAttrs, 
                  fromCustomProducts: true, 
                  type: designAttrs.name.indexOf('designText')? 'text' : 'image'
                })
              }
              newKonvaJson[9999].push(nodeAttrs)
              konvaJson[9999].push(nodeAttrs)
            }
          })
          break
        }
      }
      // newKonvaJson用于模板应用,当前产品每个面所对应设计
      // konvaJson用于保存记录,记录中每个面对应的设计
      return {cfg, konvaJson, newCfg, newKonvaJson};
    },
    // 判断当前是否有设计
    checkHasDesign({type='', views} = {}){
      views = views || [this.overallDesignView, ...this.productData.views];
      let hasDesign = false;
      for(let i=0; i<views.length; i++){
        let viewId = views[i].id;
        let designLayer = stageObj[`stage${viewId}`].findOne('.designLayer');
        if(type == ''){
          if(designLayer.find('.design').length>0){
            hasDesign = true;
            break;
          }
        } else if(type == 'template'){
          if(designLayer.find('.template').length>0){
            hasDesign = true;
            break;
          }
        } else if(type == 'bgcolor'){
          if(designLayer.find('.bgRect').length>0){
            hasDesign = true;
            break;
          }
        }
      }
      return hasDesign;
    },
    // 应用模板
    async applyTemplate({code, data, init,isReplace}){
      let {cfg: templateCfg, views: templateViews} = data.cfg?data:data[0];
      let {newCfg, newKonvaJson} = this.resetCfgAttrs(templateCfg, templateViews, code);
      this.templateCache = {code, views: templateViews, cfg: newCfg};
      let applyViews = [this.overallDesignView, ...this.productData.views];
      for(let i=0; i<applyViews.length; i++){
        let curView = applyViews[i];
        let viewCfgs = newKonvaJson[curView.id];
        let currentStage = stageObj[`stage${curView.id}`];
        let designLayer = currentStage.findOne(".designLayer");
        this._emptyDesign(curView.id, { isAddHistory: false, isProductChange: true });
        if(viewCfgs&&viewCfgs.length){
          for(let i=0; i<viewCfgs.length; i++){
            let nodeAttrs = JSON.parse(JSON.stringify(viewCfgs[i]));
            if(nodeAttrs.name.indexOf('designImg') > -1){
              if(isReplace){
                delete nodeAttrs.idE
                let dataE = nodeAttrs.imageData
                delete dataE.idE
              }

              if(!isReplace){
                nodeAttrs.imageData['channel_id'] = nodeAttrs.channel_id?nodeAttrs.channel_id:''
                nodeAttrs.imageData['idE'] = nodeAttrs.idE?nodeAttrs.idE:''
              }
              await this.addImage({
                viewId: curView.id,
                imageData: nodeAttrs.imageData,
                recordData: nodeAttrs,
                isGalleryClick: false,
                isSetBg: nodeAttrs.name.indexOf("isBg") > -1,
              }).then(async (data) => {
                await this.drawRepeatType({
                  viewId: curView.id,
                  type: nodeAttrs.tileType,
                  spacingH: nodeAttrs.spacingH,
                  spacingV: nodeAttrs.spacingV,
                  node: data.data
                });
              })
            } else if(nodeAttrs.name.indexOf('designText') > -1){
              if(isReplace){
                delete nodeAttrs.idE
              }
              await this.addText({
                viewId: curView.id,
                recordData: nodeAttrs,
                isGalleryClick: false,
              })
            } else if(nodeAttrs.name.indexOf('bgRect') > -1){
              if(isReplace){
                delete nodeAttrs.idE
              }
              this.addBgColor({
                viewId: curView.id,
                color: nodeAttrs.fill,
                templateAttrs: {
                  tempCfgIndex: nodeAttrs.tempCfgIndex,
                  templateCode: nodeAttrs.templateCode
                },
                isInit: true
              })
            }
          }
        }
        designLayer.batchDraw();
        this.canvasQuality({ viewId: curView.id });

        this.addHistory("init", curView.id);
        await this.cloneStage({ viewId: curView.id, cloneViewLength: this.productData.views.length });
      }
      this.changeStage({viewId: this.productData.views[0].id, init});
      this.curNode = null;
      if (!this.$store.state.layout.showType) {
        this.$store.commit("layout/changeSelectType", null);
      }
      let curStageLayer = stageObj[`stage${this.viewId}`].findOne('.designLayer');
      if(curStageLayer.find('.design').length > 0){
        this.showTouchAnimation = false;
      } else {
        this.showTouchAnimation = true;
        this.$nextTick(() => {
          this.touchAnimationPos({ viewId: this.viewId });
        });
      }
      this.checkShowOverallDesignTip();
    },
    initDownloadEffectHandler(){
      let _this = this;
      document.addEventListener('click', function(e){
        if(e.target.className == "publish-sales"){ 
          _this.$OPTIONS.permission.productAuth ? 
          window.open('/merchant/customerProduct/index')
          : _this.$message.error({ message: "无刊登权限" });
        }
        if(e.target.className == 'zw-download-effect'){
          _this.$statisticalreport.clickNotDesignItemBtn('点击下载效果图')
          let id = e.target.getAttribute('data-id');
          let code = e.target.getAttribute('data-code');
          previewDownload({product_ids: id}).then(res => {
            _this.downloadSizes = Object.keys(res.data.map).map(id => {
              return {id, name: res.data.map[id]}
            });
            _this.$set(_this.downloadForm, 'productId', id);
            _this.$set(_this.downloadForm, 'number', res.data.num);
            _this.$set(_this.downloadForm, 'size_type', String(res.data.default_size_type) || _this.downloadSizes[0].id);
            _this.isShowDownloadEffect = true;
          })
        }
      })
    },
    downloadEffectConfirm(){
      this.isShowDownloadEffect = false;
      let newWin = window.open('');
      downloadDetailImg({product_ids: this.downloadForm.productId, size_type: this.downloadForm.size_type}).then(res=>{
        if(res.status > 0){
          newWin.location.replace(res.data.url);
        } else {
          newWin.close();
          this.$message.error({ message: res.msg });
        }
      }).catch(err=>{
        newWin.close();
      })
    },
    replaceFilter({viewId = this.viewId, node = this.curNode, url,isReplace=false}) {
      return new Promise((resolve, reject) => {
        let curS = this.getCurStageLayer({viewId})
        let designLayer = curS.layer
        let newImage = new Image();
        newImage.src = url;
        newImage.crossOrigin = 'Anonymous';
        newImage.onload = async ()=> {
          let oldImgData = {
            width: node.width(),
            height: node.height()
          }
          const nodeAttrs = node.getAttrs();
          if(nodeAttrs.isclip){
            let clipData = nodeAttrs.clipData;
            oldImgData = {
              width: clipData.imgAttrs.width,
              height: clipData.imgAttrs.height
            }
            clipData.imgAttrs.originImg = url;
            clipData.imgAttrs.scaleX = clipData.imgAttrs.scaleX * oldImgData.width / newImage.width;
            clipData.imgAttrs.scaleY = clipData.imgAttrs.scaleY * oldImgData.height / newImage.height;
            clipData.imgAttrs.width = newImage.width;
            clipData.imgAttrs.height = newImage.height;
            url = await this.m_clip_getClipImage(clipData)
            const [clipImage] = await loadImgs([url])
            node.image(clipImage);
            node.setAttrs({
              offsetX: clipImage.width / 2,
              offsetY: clipImage.height / 2,
              clipData
            });
          } else {
            node.image(newImage);
            node.setAttrs({
              offsetX: newImage.width / 2,
              offsetY: newImage.height / 2
            });
          }
          node.setAttrs({
            flipImgUrl: url,
            scaleX: node.scaleX() / (newImage.width / oldImgData.width), //为了清晰度新增了designimg3 1200px，滤镜接口没改，返回的图片是800，这里要重新计算缩放
            scaleY: node.scaleY() / (newImage.height / oldImgData.height),
            initScaleX: node.getAttrs().widthMM / designLayer.getAttrs().ratio / newImage.width,
            initScaleY: node.getAttrs().heightMM / designLayer.getAttrs().ratio / newImage.height,
          });
          designLayer.batchDraw();
          resolve({node, curS, viewId})
        }
      })
    },
    checkShowOverallDesignTip(){
      if(this.viewId != 9999) {
        this.showOverallDesignTip = false;
        return;
      }
      const curS = this.getCurStageLayer({ viewId: 9999 });
      if(curS.mainImgLayer.visible()){
       this.showOverallDesignTip = false;
      } else {
        if(curS.layer.find('.design').length <=0) {
          let designerEle = document.querySelector('#designer');
          let designerEleRect = designerEle.getBoundingClientRect();
          let layerRect = curS.layer.getClientRect();
          let tipEle = document.querySelector('.overall-design-tip');
          tipEle.style.left = designerEleRect.x + curS.stage.x() + 'px';
          tipEle.style.top = designerEleRect.y + curS.stage.y() + 'px';
          tipEle.style.width = layerRect.width + 'px';
          tipEle.style.height = layerRect.height + 'px';
          this.showOverallDesignTip = true;
        } else {
          this.showOverallDesignTip = false
        }
      }
    },
    // 判断当前面是否有设计图片
    checkHasImgDesign(){
      let curS = this.getCurStageLayer({ viewId: this.viewId });
      let layer = curS.layer;
      return layer.find('.designImg').length;
    },
    deleteBgImg(productViews){
      productViews.forEach(item => {
        let curS = this.getCurStageLayer({ viewId: item.id });
        let layer = curS.layer;
        layer.find('.isBg').forEach(node => {
          this.deleteNode({ node, viewId: item.id, isAddHistory: false });
        })
      })
    },
    clipboardCopy(){
      let _this = this;
      if (_this.curNode) {
        if (_this.curNode.hasName("bgRect")) return;
        let curS = _this.getCurStageLayer({ viewId: _this.viewId });
        let layer = curS.layer;
        let layerBgGroup = curS.layerBgGroup;
        let nodeAttr = JSON.parse(JSON.stringify(_this.curNode.getAttrs()));
        nodeAttr.x += 10;
        nodeAttr.y += 10;
        nodeAttr.stageWidth = layerBgGroup.width() * layer.scaleX();
        nodeAttr.layerScale = layer.scaleX();
        if (_this.curNode.hasName("designText")) {
          _this.curNode.setAttrs(
            _this.textAttrToLabel({ node: _this.curNode })
          );
          this.clipboardData = JSON.stringify({type: 'text', data: nodeAttr});
        } else {
          delete nodeAttr.image;
          this.clipboardData = JSON.stringify({ type: "img", data: nodeAttr });
        }
        if (!_this.noMessage) {
          _this.$message({
            message: "复制成功",
            type: "success",
          });
        }
      }
    },
    clipboardPaste(){
      let _this = this;
      let oldData = JSON.parse(_this.clipboardData);
      if(oldData){
        if (oldData.type == "text") {
          _this
            .addText({
              viewId: _this.viewId,
              recordData: oldData.data,
            })
            .then((data) => {
              let node = data.data;
              _this.cloneStage({ viewId: _this.viewId, cloneStartTime: true, cloneViewLength: _this.viewId == 9999 ? _this.productData.views.length : 0 });
              node.setAttr("historyId", node._id);
              _this.addHistory("图层复制", _this.viewId, {
                nodeId: node._id,
              });
            });
        } else {
          _this
            .addImage({
              imageData: oldData.data.imageData,
              viewId: _this.viewId,
              recordData: oldData.data,
              iscopy: true,
            })
            .then((img) => {
              _this.cloneStage({ viewId: _this.viewId, cloneStartTime: true, cloneViewLength: _this.viewId == 9999 ? _this.productData.views.length : 0 });
              img.data.setAttr("historyId", img.data._id);
              _this.addHistory("图层复制", _this.viewId, {
                nodeId: img.data._id,
              });
            });
        }
        _this.$message({
          message: "粘贴成功",
          type: "success",
        });
      }
    },
    getPhotoDetail() {
      return new Promise(async (resolve, reject) => {
        if(!this.$sdkConfig.platformIsZWKJ && this.urlQueryObj.gallery_url){
          const image = new Image();
          image.src = this.urlQueryObj.gallery_url;
          image.onload = () => {
            const curTime = Date.now();
            const galleryData = {
              code: `ExternalURL_` + curTime,
              designImg: this.urlQueryObj.gallery_url,
              designImg2: this.urlQueryObj.gallery_url,
              designImg3: this.urlQueryObj.gallery_url,
              size: {
                width: image.width,
                height: image.height
              },
              sdk_info: {
                sdk_gallery_url: this.urlQueryObj.gallery_url
              }
            };
            eventBus.$emit('galleryClick', { galleryData })
          }
        }

        let imgId = this.urlQueryObj.galleryIdTile || this.urlQueryObj.galleryId || this.urlQueryObj.gallery_code;
        if(imgId){
          _getPhotoDetail({galleryId: imgId}).then((res) =>{
            const inter = setInterval(() => {
              // const viewImg = this.viewImgObj.filter(item => {
              //   return item.viewDesign || item.viewDesignCanvas
              // })[0]
              if(!this.createProductInit) {
                clearInterval(inter)
                if(this.$sdkConfig.platformIsZWKJ){
                  eventBus.$emit('galleryClick', {galleryData: res.data})
                } else {
                  for(let i of res.data){
                    eventBus.$emit('galleryClick', {galleryData: i})
                  }
                }
                // this.addImage({imageData: res.data, viewId: this.viewId}).then((data) => {
                //   resolve()
                //   let node = data.data;
                //   // this.saveImageData({ node, viewId: this.viewId, imageData: res.data });
                //   this.addHistory("添加图片", this.viewId, {
                //     nodeId: node.getAttrs().historyId,
                //   });
                //   node.fire("click")
                //   if(this.urlQueryObj.galleryIdTile) {
                //     eventBus.$emit("imgMaximizationChange", { data: {value: "imgFull"} })
                //     for (let view of this.productData.views) {
                //       if (view.id != this.viewId) {
                //         eventBus.$emit("copyToView", { data: { id: view.id }, type: 'all' });
                //       }
                //     }
                //   }
                // })
              }
            }, 200)
          })
        }
        resolve();
      })
    },
    imgFullClick(type) {
      const localStorageKey = genLocalStorageKey('imgFullSet');
      let customerId = this.$isLogin ? this.$OPTIONS.userInfo.code : "unlogin";
      let imgFullSet = [];
      if (localStorage.getItem(localStorageKey)) {
        imgFullSet = JSON.parse(localStorage.getItem(localStorageKey));
        imgFullSet.splice(
          imgFullSet.findIndex((item) => {
            return item.customerId == customerId;
          }),
          1
        );
      }
      imgFullSet.push({
        customerId,
        isApply: type == 1 ? true : false,
      });
      localStorage.setItem(localStorageKey, JSON.stringify(imgFullSet));
      this.imgFullTip = false;
      if (type == 2) {
        //取消应用所有面
        eventBus.$emit("setBgImgClick", { type: "all", cancelImgFull: true });
      }
    },
    resize3dModel() {
      return () => {
        if (this.needCanvas) {
          destroy3DModel({
            threeDApp,
            detailImages: this.detailImages,
          })
          
          document.querySelector(".container-3d").innerHTML = "";
          let canvas = document.createElement("canvas");
          canvas.setAttribute("id", "3dCanvas");
          document.querySelector(".container-3d").appendChild(canvas);
          document.getElementById("3dCanvas").width = document.querySelector(
            ".container-3d"
          ).clientWidth;
          document.getElementById("3dCanvas").height = document.querySelector(
            ".container-3d"
          ).clientHeight;
          document.getElementById("3dCanvas").style.outline = "none";
          this.$nextTick(() => {
            this.setViewDesigns({
              flag: 0,
              operateType: "",
              colorId: this.curColorId,
              curIndex: this.curViewIndex,
              type: "detail",
            });
          });
        }
      };
    },
    async productChange({ type = null } = {}) {
      if(this.m_clip_isCliping){
        await this.m_clip_implementClip()
      }
      if (this.canvasLoadFinish) {
        let startTime = new Date().getTime();
        if (startTime - this.changeProductEndTime < 400) {
          return;
        }
        this.changeProductEndTime = startTime;
      }
      if (!this.canvasLoadFinish) {
        // setTimeout(() => {
        this.productChange();
        // }, 100);
        return;
      }
      this.canvasLoadFinish = false;

      let views = [this.overallDesignView, ...this.productData.views];
      for(let i=0; i<views.length; i++){
        let item = views[i];
        let curS = this.getCurStageLayer({ viewId: item.id });
        let layer = curS.layer;
        this.designToJson[i] = {};
        this.designToJson[i].imageArr = [];
        this.designToJson[i].viewIndex = i;
        for (let design of layer.find(".design")) {
          if (design.hasName("designText")) {
            design.setAttrs(this.textAttrToLabel({ node: design }));
          }
          this.designToJson[i].imageArr.push(design);
        }
      }
      this.productData = this.$store.state.product.selectedProduct;
      for(let i = 1; i < this.productData.views.length + 1; i++) {
        //单面产品切多面产品，单面的背景图要应用到多面的所有面
        //this.designToJson[0]是整体设计面，故取this.designToJson[1]
        if(this.designToJson[1].imageArr.length) {
          const index = this.designToJson[1].imageArr.findIndex(node => node.hasName('isBg'))
          if(index != -1 && i > 1) {
            if(!this.designToJson[i]) {
              this.designToJson[i] = {};
              this.designToJson[i].imageArr = [];
              this.designToJson[i].viewIndex = i;
            }
            if(this.designToJson[i].imageArr.length) {
              const bgIndex = this.designToJson[i].imageArr.findIndex(node => node.hasName('isBg'))
              if(bgIndex != -1) {
                this.designToJson[i].imageArr.splice(bgIndex, 1)
              }
            }
            this.designToJson[i].imageArr.push(this.designToJson[1].imageArr[index])
          }
        }
      }
      this.defaultValues = this.productData.defaultValues;
      // this.$nextTick(() => {
      this.init({ init: false });
      // });
    },
    showDesginTips() {
      if (!this.isShowDesignTips) return;
      const localStorageKey = genLocalStorageKey('noPromptLists');
      let customerId = this.$isLogin ? this.$OPTIONS.userInfo.code : "unlogin";
      let noPromptLists = JSON.parse(localStorage.getItem(localStorageKey));
      if (
        noPromptLists &&
        noPromptLists.length &&
        noPromptLists.some((a) => a == customerId)
      )
        return;
      let curStage = stageObj[`stage${this.viewId}`];
      let stageRect = curStage.getClientRect();
      let posX = curStage.x() + stageRect.width / 2;
      let posY = curStage.y() - 30;
      let tipEle = document.querySelector("#designDeclareTips");
      tipEle.style.left = posX + "px";
      tipEle.style.top = posY + "px";
      tipEle.style.display = "block";
      this.isShowDesignTips = false;
      setTimeout(() => {
        document.querySelector("#designDeclareTips").style.display = "none";
      }, 3000);
    },
    hideDesginTips() {
      let customerId = this.$isLogin ? this.$OPTIONS.userInfo.code : "unlogin";
      const localStorageKey = genLocalStorageKey('noPromptLists');
      let noPromptLists = JSON.parse(localStorage.getItem(localStorageKey));
      if (!noPromptLists) noPromptLists = [];
      if (!noPromptLists.some((a) => a == customerId))
        noPromptLists.push(customerId);
      localStorage.setItem(localStorageKey, JSON.stringify(noPromptLists));
    },
    showProductDetail(){
      this.$store.commit("layout/changeLeftType", "product");     
      this.$store.commit('layout/toggleProductDetail', true);
    },
    touchAnimationPos({ viewId }) {
      if (!document.getElementById("touchAnimation")) return;
      let curS = this.getCurStageLayer({ viewId });
      let currentStage = curS.stage;
      let layer = curS.layer;
      let layerBgGroup = curS.layerBgGroup;
      let stageContainerOffset = {
        // left: document.getElementById(`container${this.viewId}`).offsetLeft,
        // top: document.getElementById(`container${this.viewId}`).offsetTop,
        left: currentStage.x(),
        top: currentStage.y(),
      };
      let containerWidth = document.getElementById(`container${this.viewId}`)
        .clientWidth;
      let touchAnimationWidth = document.getElementById("touchAnimation")
        .clientWidth;
      document.getElementById("touchAnimation").style.left =
        stageContainerOffset.left +
        (layerBgGroup.width() * layer.scaleX()) / 2 -
        touchAnimationWidth / 2 +
        "px";
      document.getElementById("touchAnimation").style.top =
        stageContainerOffset.top +
        (layerBgGroup.height() * layer.scaleY()) / 2 -
        touchAnimationWidth / 2 +
        "px";
    },
    eventBusFun() {
      eventBus.$on('setNullCurNode', val => {
        this.destroyTransformer({viewId: this.viewId});
      }),
      eventBus.$on('changeBgColor', val => {
        if(this.viewId==9999){ 
          let views = [this.overallDesignView, ...this.productData.views]
          for(let view of views){
            this.addBgColor({color: val, viewId: view.id, overallDesign: true, cloneViewLength: this.productData.views.length})
            val ? this.addHistory('设置背景色', view.id) : this.addHistory("清空背景色", view.id);
          }
        } else {
          if(this.productData.imgFull==1 && this.productData.bg_ind == -1){
            for(let view of this.productData.views){
              this.addBgColor({color: val, viewId: view.id, overallDesign: true, cloneViewLength: this.productData.views.length});
              val ? this.addHistory('设置背景色', view.id) : this.addHistory("清空背景色", view.id);
            }
          } else {
            this.addBgColor({color: val, viewId: this.viewId, overallDesign: false});
            val ? this.addHistory('设置背景色', this.viewId) : this.addHistory("清空背景色", this.viewId);
          }
        }
      });
      // 切换商品前判断当前商品是否使用模板，如果有并且使用的模板不适用当前商品，提示是否切换
      eventBus.$on('checkProductBeforeChange', async (data) => {
        let hasTemplate = this.checkHasDesign({type:'template'});
        if(hasTemplate){
          let params = {
            keyword: '',
            cgId: '',
            customer_id: '',
            sortField: 'designNumber',
            sortType: 'desc',
            page: 1,
            pageSize: 30,
            product_type_id: data.id,
            is_public: 1,
            isCustomerCategory: '',
            is_material: 1,
            code: this.templateCache.code
          };
          let ret = await _galleryTemplate(params);
          let flag = ret.data&&ret.data.data&&ret.data.data.length ? true : false
          if(hasTemplate && !flag && this.$sdkConfig.platform != 'xcxBackend'){
            this.$confirm("当前模板不适用您所选商品，若切换商品将移除该模板", "提示", {
              confirmButtonText: "切换商品",
              cancelButtonText: "取消",
              type: "warning",
              callback: (action, instance) => {
                this.$store.commit('product/updateSelectedProduct', Object.assign(this.$store.state.product.selectedProduct, {isLoading: true}));
                if(action == 'confirm'){
                  let views = [this.overallDesignView, ...this.productData.views];
                  for(let view of views){
                    this._emptyDesign(view.id, { isAddHistory: false, isProductChange: true });
                  }
                  this.$store.commit('product/updateChangeProductCode', data.code)
                  this.$store.commit('product/updateIsChangeProduct', true);
                } else {
                  this.$store.commit('product/updateSelectedProduct', Object.assign(this.$store.state.product.selectedProduct, {isLoading: false}));
                }
              }
            })
          } else {
            this.$store.commit('product/updateSelectedProduct', Object.assign(this.$store.state.product.selectedProduct, {isLoading: true}));
            this.$store.commit('product/updateChangeProductCode', data.code)
            this.$store.commit('product/updateIsChangeProduct', true);
          }
        } else {
          this.$store.commit('product/updateSelectedProduct', Object.assign(this.$store.state.product.selectedProduct, {isLoading: true}));
          this.$store.commit('product/updateChangeProductCode', data.code)
          this.$store.commit('product/updateIsChangeProduct', true);
        }
      });
      // 节点层级交换
      eventBus.$on('swapNodeIndex', async (data) => {
        //@@@ 这里输出左侧排序后的新图层数组
        const viewId = data.nodes.id;
        const treeNodes = data.nodes.childrens;
        if(viewId != this.viewId) this.changeStage({ viewId });
        const curS = this.getCurStageLayer({viewId});
        const designs = curS.layer.find('.design').filter(a => !a.hasName('bgRect'));
        if(!designs.length) return;
        let zIndexMap = {};
        treeNodes.forEach((node, i) => {
          zIndexMap[node._id] = treeNodes.length-i-1;
        });
        //先获取设计元素最底层的zIndex, 由于画布上可能存在其它非设计元素,设计元素最小的层级不确定, 重排时以最底层的zIndex作为最小zIndex递增
        const minZIndex = designs[0].getZIndex();
        if(designs[0].getParent()?.hasName('repeatImgGroup')){
          minZIndex = designs[0].getParent().getZIndex();
        }
        designs.forEach(node => {
          const newZIndex = minZIndex + zIndexMap[node._id];
          const isRepeat = !!node.getParent()?.hasName('repeatImgGroup');
          isRepeat ? node.getParent().zIndex(newZIndex) : node.zIndex(newZIndex);
        });
        curS.layer.batchDraw();
        this.cloneStage({viewId});
        this.addHistory('图层排序', viewId, {
          nodeId: designs[0].getAttrs().historyId
        });
        let designImgList = [];
        for (let item of this.$store.state.gallery.designImgList) {
          designImgList.push(item);
        }
        for (let item of designImgList) {
          let designLayer = stageObj[`stage${item.id}`].findOne('.designLayer')
          if (designLayer.getAttrs().viewId == item.id) {
            item.childrens = [];
            for (let design of designLayer.find(".design").reverse()) {
              if (!design.hasName("bgRect")) {
                item.childrens.push(design);
              }
            }
            // break;
          }
        }
        
        this.$store.commit("gallery/getDesignImgList", {
          data: designImgList,
        });
      });
      // eventBus.$on('initDesignEffect', (data)=>{
      //   if(data.start) {
      //     let detailList = []
      //     this.detailImages[this.curColorId].forEach(() => {
      //       detailList.push({rendered: false})
      //     });
      //     this.$set(this.detailImages, this.curColorId, detailList);
      //     this.$store.commit("gallery/getDetailImageList", {
      //       data: this.detailImages[this.curColorId],
      //     });
      //     if (this.is3dModel) {
      //       for (let i = 0; i < threeDApp.length; i++) {
      //         const app = threeDApp[i];
      //         if(app.code.indexOf(this.productData.code) != -1) {
      //           app.drawApp.destroy();
      //           threeDApp.splice(i, 1);
      //           i-=1
      //         }
      //       }
      //     }
      //     return
      //   }
      //   for (let i = 0; i < threeDApp.length; i++) {
      //     const app = threeDApp[i];
      //     if(app.code.indexOf(this.productData.code) != -1) {
      //       app.drawApp.destroy();
      //       threeDApp.splice(i, 1);
      //       i-=1
      //     }
      //   }
      //   if (this.is3dModel) {
      //     if(this.isLargePreview){
      //       document.querySelector(".container-3d-large").innerHTML = "";
      //       let canvas = document.createElement("canvas");
      //       canvas.setAttribute("id", "3dCanvasLarge");
      //       document.querySelector(".container-3d-large").appendChild(canvas);
      //       document.getElementById("3dCanvasLarge").width = document.querySelector(
      //         ".container-3d-large"
      //       ).clientWidth;
      //       document.getElementById("3dCanvasLarge").height = document.querySelector(
      //         ".container-3d-large"
      //       ).clientHeight;
      //       document.getElementById("3dCanvasLarge").style.outline = "none";
      //     } else {
      //       document.querySelector(".container-3d").innerHTML = "";
      //       let canvas = document.createElement("canvas");
      //       canvas.setAttribute("id", "3dCanvas");
      //       document.querySelector(".container-3d").appendChild(canvas);
      //       document.getElementById("3dCanvas").width = document.querySelector(
      //         ".container-3d"
      //       ).clientWidth;
      //       document.getElementById("3dCanvas").height = document.querySelector(
      //         ".container-3d"
      //       ).clientHeight;
      //       document.getElementById("3dCanvas").style.outline = "none";
      //     }
      //   }
      //   this.$nextTick(() => {
      //     this.setViewDesigns({
      //       flag: 0,
      //       operateType: "",
      //       colorId: this.curColorId,
      //       curIndex: this.curViewIndex,
      //       type: "detail",
      //     });
      //   });
      // });
      // eventBus.$on("openBgColorPicker", () => {
      //   this.$refs.bgColorPicker.$children[0].handleTrigger();
      // });
      eventBus.$on("containerResize", (e) => {
        if (e.resizeFlag) {
          clearTimeout(e.resizeFlag);
        }
        e.resizeFlag = setTimeout(() => {
          if (document.getElementById(`container${this.viewId}`)) {
            this.reCalculateStage()({
              isReset: true,
              createLayerEnd: true,
              viewId: this.viewId,
            });
            this.initRulerAll();
          }
          e.resizeFlag = null;
        }, 10);
      });
      eventBus.$on("galleryClick", async (data) => {
        if(this.m_clip_isCliping) {
          await this.m_clip_implementClip()
        }
        this.showDesginTips();
        
        if(data.isBg || this.viewId == 9999) {
          let productViews = JSON.parse(JSON.stringify(this.productData.views))
          if(this.viewId == 9999) {
            productViews.unshift(this.overallDesignView)
          } else {
            if(this.productData.imgFull != 1 || (this.productData.imgFull == 1 && this.productData.bg_ind == 1)) { //全副产品是否支持独立背景设计 => bg_ind: 1：支持独立设计，-1：不支持
              productViews = [JSON.parse(JSON.stringify(productViews.find(item => item.id = this.viewId)))]
            }
          }
          const bgnodeMap = {};
          for(let item of productViews){
            const curS = this.getCurStageLayer({ viewId: item.id });
            const layer = curS.layer;
            const bgNode = layer.findOne('.isBg');
            if(bgNode){
              bgnodeMap[item.id] = bgNode?.getAttrs().historyId;
            }
          }
          if(data.isBg) {
            if(this.$store.state.gallery.isAddingBg) return //双击背景会添加两张图片，这里做限制
            this.deleteBgImg(productViews)
            this.$store.commit('gallery/updateIsAddingBg', true);
          }
          for(const item of productViews) {
            await this.addImage({
              imageData: data.galleryData,
              viewId: item.id,
              isSetBg: data.isBg ? true : false,
              isHistory: bgnodeMap[item.id],
              historyOptions: bgnodeMap[item.id] ? {
                id: bgnodeMap[item.id]
              } : null
            }).then((node) => {
              if(item.id == this.viewId) { //选中第一个面图片
                node.data.fire('click')
              }
              if(data.isBg) {
                this.bgset({
                  viewId: item.id,
                  node: node.data,
                  type: "image",
                });
              }
              if(bgnodeMap[item.id]){
                this.addHistory('替换图片', item.id, {
                  nodeId: bgnodeMap[item.id]
                })
              } else {
                this.addHistory("添加图片", item.id, {
                  nodeId: node.data.getAttrs().historyId,
                });
              }
            })
          }
          this.$store.commit('gallery/updateIsAddingBg', false);
        } else {
          this.addImage({
            imageData: data.galleryData,
            viewId: this.viewId,
          }).then((node) => {
            this.addHistory("添加图片", this.viewId, {
              nodeId: this.curNode.getAttrs().historyId,
            });
            this.saveImageData({
              node: node.data,
              viewId: this.viewId,
              imageData: data.galleryData,
            });
          });
        }
      });
      eventBus.$on('replaceImage', data => {
        if(this.curNode.image){
          this.replaceImage({
            imageData: data.galleryData,
            viewId: this.viewId
          })
        }
      });
      eventBus.$on("addText", async () => {
        this.m_editText_removeTextarea() //如果当前文字处于编辑状态，则退出编辑状态
        this.showDesginTips();
        if(this.viewId == 9999) {
          let productViews = JSON.parse(JSON.stringify(this.productData.views))
          productViews.unshift(this.overallDesignView)
          for(const item of productViews) {
            await this.addText({ viewId: item.id }).then((data) => {
              let node = data.data;
              if(item.id == this.viewId) {
                this.curNode = node
                node.findOne('Text').fire("dblclick")
              }
              this.addHistory("添加文字", item.id, {
                nodeId: node.getAttrs().historyId,
              });
            });
          }
        } else {
          this.addText({ viewId: this.viewId }).then((data) => {
            let node = data.data;
            node.findOne('Text').fire("dblclick")
            this.saveImageData({ node, viewId: this.viewId });
            this.addHistory("添加文字", this.viewId, {
              nodeId: node.getAttrs().historyId,
            });
          });
        }
      });
      eventBus.$on('applyTemplate', ({code, data, init}) => {
        if(this.checkHasDesign()){
          this.$confirm("使用模板后，当前商品的所有设计将会被清空并替换", "提示", {
            confirmButtonText: "替换",
            cancelButtonText: "取消",
            type: "warning",
          }).then(async () => {
            if(this.m_clip_isCliping) {
              await this.m_clip_implementClip()
            }
            this.applyTemplate({code, data, init,isReplace:true});
          }).catch(() => {});
        } else {
          this.applyTemplate({code, data, init});
        }
      });
      eventBus.$on("swiperChange", (data) => {
        // this.curViewIndexList = data.data
        // this.curViewIndex = data.curIndex
        let detailImages = {}, colorId = 0;
        if (this.isLargePreview) {
          //预览大图
          detailImages = this.largeDetailImages;
          colorId = this.curColorIdLargeImage
        } else {
          detailImages = this.detailImages;
          this.curColorId = this.$store.state.product.editingProduct.color;
          colorId = this.curColorId
        }
        this.loadCurrentDetail({
          startIndex: this.curViewIndexList[0],
          endIndex: this.curViewIndexList.slice(-1)[0],
          colorId: colorId,
          detailImages,
          flag: 0,
        });
      });
      eventBus.$on("colorChange", (data) => {
        this.isChangeDesign = false

        if(this.isLargePreview) {
          this.curColorIdLargeImage = data.data.id;
        } else {
          this.curColorId = data.data.id;
        }
        // 切换颜色时，如果该颜色不存在3D模型，则不显示3D按钮，自动切换到该颜色的2D效果图
        let cId = this.isLargePreview ? this.curColorIdLargeImage : this.curColorId;
        let show3DModel = this.productData.show_3d_model[cId] || this.productData.show_3d_model['default'];
        if(!this.isLargePreview && this.is3dModel && !show3DModel){
          this.$store.commit('gallery/changeDetailType', {type: false, isSelectedProduct: false} )
          this.$store.commit("gallery/setSwiperCurId", 0);
          eventBus.$emit("slideTo", { curIndex: 0 });
        }
        if(!this.isLargePreview){
          // 销毁keepThreeDApp保存的小图3d模型
          destroy3DModelIs3D(keepThreeDApp)
        }
        this.baseImgChange({ colorId: data.data.id }).then(async () => {
          await this.setViewDesigns({
            flag: 0,
            operateType: "switchColor",
            colorId: data.data.id,
            curIndex: this.curViewIndex,
            type: "detail",
          });
          const curS = this.getCurStageLayer({ viewId: this.productData.views[0].id })
          const mainImgLayer = curS.mainImgLayer
          if(mainImgLayer.visible()) {
            this.getCurMainImg({isColorChange: true})
          }
        });
      });
      eventBus.$on("repeatChange", async (data) => {
        if (this.curNode) {
          this.$statisticalreport.designCommonBi(data.data.value,this.curNode)
          const designObj = linkageDesign(this.productData, this.viewId, this.curNode)
          for(let _viewId in designObj) {
            for(let item of designObj[_viewId]) {
              await this.drawRepeatType({
                viewId: item.id,
                type: data.data.value,
                node: item.node,
                spacingH: item.node.getAttrs().spacingH,
                spacingV: item.node.getAttrs().spacingV,
              }).then(() => {
                if (data.data.value == "1") {
                  this.addHistory("移除平铺", item.id, {
                    nodeId: item.node.getAttrs().historyId,
                  });
                } else {
                  this.addHistory("图案平铺", item.id, {
                    nodeId: item.node.getAttrs().historyId,
                  });
                }
              });
            }
            this.cloneStage({ viewId: _viewId });
          }
        }
      });
      eventBus.$on("repeatSpacing", async (data) => {
        if (this.curNode) {
          const designObj = linkageDesign(this.productData, this.viewId, this.curNode)
          for(let _viewId in designObj) {
            for(let item of designObj[_viewId]) {
              await this.drawRepeatType({
                viewId: item.id,
                type: item.node.getAttrs().tileType,
                node: item.node,
                spacingH: data[0],
                spacingV: data[1],
              }).then(() => {
                this.addHistory("平铺调整", item.id, {
                  nodeId: item.node.getAttrs().historyId,
                });
              });
            }
            this.cloneStage({ viewId: _viewId });
          }
        }
      });

      eventBus.$on("imgMaximizationChange", async (data) => {
        this.imgMaximizationType = data.data.value;
        if (this.curNode) {
          this.$statisticalreport.designCommonBi(this.imgMaximizationType,this.curNode)
          const designObj = linkageDesign(this.productData, this.viewId, this.curNode)
          for(let _viewId in designObj) {
            for(let item of designObj[_viewId]) {
              await this.imgMaximization({
                viewId: item.id,
                flag: this.imgMaximizationType,
                node: item.node,
              }).then(() => {
                this.curNode.fire("click");
                this.addTransformer({
                  currentStage: stageObj[`stage${item.id}`],
                  nodes: [item.node],
                  viewId: item.id,
                });
                this.addHistory("图层适应", item.id, {
                  nodeId: item.node.getAttrs().historyId,
                });
              });
            }
            this.cloneStage({ viewId: _viewId });
          }
        }
        
       
      });
      eventBus.$on("textMaximizationChange", (data) => {
        this.imgMaximizationType = data.data.value;
        if (this.curNode) {
          this.textMaximization({
            viewId: this.viewId,
            flag: this.imgMaximizationType,
            node: this.curNode,
          }).then(() => {
            this.curNode.fire("click");
            this.addTransformer({
              currentStage: stageObj[`stage${this.viewId}`],
              nodes: [this.curNode],
              viewId: this.viewId,
            });
            this.cloneStage({ viewId: this.viewId });
            this.addHistory("图层适应", this.viewId, {
              nodeId: this.curNode.getAttrs().historyId,
            });
          });
        }
      });
      eventBus.$on("changeSelectNode", (data) => {
        //图层里选择图片
        if (!data.isThisPage) {
          this.curNode = data.data;
          this.$store.commit('multiple/updateFireClickState',1)
          this.curNode.fire("click");
        }
      });
      eventBus.$on("nodeToggleHidden", (data) => {
        //隐藏图片
        if (data.data.isHidden) {
          this.hideNode({ viewId: this.viewId, node: data.data });
        } else {
          this.showNode({ viewId: this.viewId, node: data.data });
        }
        this.$statisticalreport.clickDesignItemEditBtn('隐藏/显示','图层')
      });
      //isLayer埋点--用于判断锁定操作是否由图层发起
      eventBus.$on("nodeToggleLock", (data, isLayer=false) => {
        const isLock = Array.isArray(data.data) ? !data.data[0].isLock : !data.data.isLock
        //锁定图片
        const designObj = linkageDesign(this.productData, this.viewId, data.data, true)
        for(let _viewId in designObj) {
          for(let item of designObj[_viewId]) {
            item.node.isLock = isLock
            if (item.node.isLock) {
              this.lockNode({ node: item.node, viewId: item.id, isLock: true });
              item.node.setAttrs({
                draggable: false,
              });
            } else {
              this.lockNode({
                node: item.node,
                viewId: item.id,
                isLock: false,
              });
              item.node.setAttrs({
                draggable: true,
              });
              stageObj[`stage${item.id}`]
                .findOne(".designLayer")
                .batchDraw();
            }
            if (data.isAddHistory == undefined || data.isAddHistory) {
              this.addHistory("锁定修改", item.id, {
                nodeId: item.node.getAttrs().historyId,
              });
            }
          }
        }
        isLayer ? this.$statisticalreport.clickDesignItemEditBtn('锁定/解锁','图层'): this.$statisticalreport.biCommonFn('锁定/解锁',this.curNode)
      });
      eventBus.$on("setBgImgClick", (data) => {
        //设为背景图
        let type = data.type; //all: 应用于所有面'
        let viewArr = [],
          hasBg = false,
          promises = [];
        if (type == "all") {
          this.cloneViewLength = 0;
          this.curNode.addName("bgApplyAllView");
          for (let item of this.productData.views) {
            if (this.curNode.hasName("isBg")) {
              //普通产品设为背景
              hasBg = true;
              if (item.id != this.viewId) {
                viewArr.push(item.id);
              }
            } else {
              //全副多面产品添加第一张图片默认应用所有面
              viewArr.push(item.id);
            }
          }
        } else {
          viewArr.push(this.viewId);
        }
        let index = 0;
        for (let viewId of viewArr) {
          index += 1;
          let curS = this.getCurStageLayer({ viewId: viewId });
          let layer = curS.layer;
          let designRect = curS.designRect;
          if (data.data) {
            //设为背景
            if (layer.find(".isBg").length > 0) {
              this.setLayerImgList({
                viewId,
                node: layer.findOne(".isBg"),
                isDelete: true,
              });
              if(layer.findOne(`.repeatImgGroup${layer.findOne(".isBg")._id}`)) {
                layer.findOne(`.repeatImgGroup${layer.findOne(".isBg")._id}`).destroy();
              }else {
                layer.findOne(".isBg").destroy();
              }
            }
            // else {
            if (type == "all" && viewId != this.viewId) {
              this.addImage({
                imageData: this.curNode.getAttrs().imageData,
                recordData: this.curNode.getAttrs(),
                viewId,
                isGalleryClick: false,
                isSetBg: true,
                bgApplyAllView: true,
              }).then((data) => {
                this.bgset({
                  layer,
                  viewId,
                  node: data.data,
                  type: "image",
                  bgsetType: type,
                  hasBg,
                });
                this.addHistory("设置背景图", viewId, {
                  nodeId: data.data.getAttrs().historyId,
                });
              });
              // if (index == 1) {
              //   this.curNode.addName("bgApplyAllView");
              // }
            } else {
              this.curNode.addName("isBg");
              this.bgset({
                layer,
                viewId,
                node: this.curNode,
                type: "image",
                bgsetType: type,
                hasBg,
              });
              // if (type == "all") {
              //   this.curNode.addName("bgApplyAllView");
              // }
              this.curNode.fire("click");
              eventBus.$emit("setBgImgClickEnd");
              this.addHistory("设置背景图", viewId, {
                nodeId: this.curNode.getAttrs().historyId,
              });
            }
            // }
          } else {
            //取消设为背景
            // this.curNode.moveUp()
            if (type == "all") { 
              if (layer.findOne(".bgApplyAllView")) {
                let bgNode = layer.findOne(".bgApplyAllView") 
                // bgNode.destroy(); 
                if(layer.findOne(`.repeatImgGroup${bgNode._id}`)) {
                  layer.findOne(`.repeatImgGroup${bgNode._id}`).destroy();
                }else {
                  bgNode.destroy();
                }
                this.setLayerImgList({ 
                  viewId, 
                  node: bgNode, 
                  isDelete: true, 
                }); 
              }
              if (index == 1) {
                this.curNode.removeName("bgApplyAllView");
                if (data.cancelImgFull) {
                  //全副多面取消应用所有面同时取消设为背景
                  this.curNode.removeName("isBg");
                  this.imgRestoreInitSize();
                }
              }
              // this.initPreviewStage({ viewId });
            } else {
              for (let view of this.productData.views) {
                let gCurS = this.getCurStageLayer({ viewId: view.id });
                if (gCurS.layer.findOne(".isBg")) {
                  gCurS.layer.findOne(".isBg").removeName("bgApplyAllView");
                }
              }
              this.curNode.removeName("isBg");

              this.imgRestoreInitSize();

              // this.curNode.setAttrs({
              // widthMM: this.curNode.width() * ratio,
              // heightMM: this.curNode.height() * ratio,
              // });
              this.curNode.fire("click");
            }
            eventBus.$emit("changeSelectNode", {
              data: this.curNode,
              isThisPage: true,
            });
            // if(viewArr.length = 1) {
            //   this.addTransformer({currentStage: stageObj[`stage${viewId}`], node: this.curNode, viewId})
            // }
            // this.cloneStartTime = null;
            this.cloneStage({ viewId, cloneStartTime: true, isSetBgAll: type == "all" ? true : false, hasBg});
            this.addHistory("清空背景图", viewId, {
              nodeId: this.curNode.getAttrs().historyId,
            });
          }
        }
        this.showTouchAnimation = false
        this.checkShowOverallDesignTip()
        this.drawSizeTip({
          currentStage: this.curNode.getStage(),
          node: this.curNode,
        });
        this.anchorGroupFourceupdate({
          node: this.curNode,
          viewId: this.viewId,
        });
        // this.drawSizeTip({currentStage: currentStage, node: e.target})
        // this.ncYSRemind({currentStage: currentStage, node: e.target})
      });

      eventBus.$on("setBgColorClick", (data) => {
        //设为背景色
        let type = data.type; //all: 应用于所有面'
        let viewArr = [],
          promises = [];
        if (type == "all") {
          for (let item of this.productData.views) {
            // if (item.id != this.viewId) {
            viewArr.push(item.id);
            // }
          }
        } else {
          viewArr.push(data.viewId || this.viewId);
        }
        let index = 0;
        for (let viewId of viewArr) {
          index += 1;
          let curS = this.getCurStageLayer({ viewId: viewId });
          let layer = curS.layer;
          let designRect = curS.designRect;
          if (data.data) {
            //设为背景色
              this.addBgColor({ color: data.color, viewId, type });
            if (type == "all") {
              this.addHistory("设置背景色", viewId);
            } else {
              if (data.color == "transparent") {
                this.addHistory("清空背景色", viewId);
              }
            }
          } else {
            //取消设为背景色
              if (layer.find(".bgRect").length > 0) {
                let bgNode = layer.findOne(".bgRect")
                bgNode.destroy();
                this.setLayerImgList({
                  viewId, 
                  node: bgNode, 
                  isDelete: true,
                  type: 'bgcolor'
                });
                layer.batchDraw();
              }
          }
          this.cloneStage({
            viewId,
            cloneStartTime: true,
            isSetBgAll: type == "all" ? true : false,
            addDesign3d: this.productData.have_3d_img == 1  ? true : false
          });
        }
      });

      eventBus.$on("mirrorFlip", async (data) => {
        //镜像翻转
        const designObj = linkageDesign(this.productData, this.viewId, this.curNode)
        for(let _viewId in designObj) {
          for(let item of designObj[_viewId]) {
            await this.flipImage({ data, node: item.node, viewId: item.id, isClick: true });
          }
          this.cloneStage({ viewId: _viewId });
        }
        if(data.data == "leftRightMirror") {
          this.$statisticalreport.biCommonFn('水平翻转',this.curNode)
        } else {
          this.$statisticalreport.biCommonFn('垂直翻转',this.curNode)
        }
      });

      eventBus.$on("rotationChange", (data) => {
        if(!this.curNode) return;
        //旋转角度改变
        this.curNode.rotation(data.data);
        this.saveImageData({
          node: this.curNode,
          viewId: this.viewId,
          imageData: this.curNode.getAttrs().imageData,
        });
        this.anchorGroupFourceupdate({
          node: this.curNode,
          viewId: this.viewId,
        });
        if (this.curNode.type == "image") {
          this.ncYSRemind({
            currentStage: stageObj[`stage${this.viewId}`],
            node: this.curNode,
          });
        }

        this.drawSizeTip({
          currentStage: stageObj[`stage${this.viewId}`],
          node: this.curNode,
        });
      });
      eventBus.$on("rotationChangeEnd", async (data) => {
        if(!this.curNode) return;
        //旋转角度改变
        const designObj = linkageDesign(this.productData, this.viewId, this.curNode)
        for(let _viewId in designObj) {
          for(let item of designObj[_viewId]) {
            if (this.curNode.type == "image") {
                item.node.rotation(data.data)
                await this.drawRepeatType({
                  viewId: item.id,
                  type: item.node.getAttrs().tileType,
                  node: item.node,
                  spacingH: item.node.getAttrs().spacingH,
                  spacingV: item.node.getAttrs().spacingV,
                }).then(() => {
                  this.addHistory("旋转角度", item.id, {
                    nodeId: item.node.getAttrs().historyId,
                  });
                });
            } else {
                item.node.rotation(data.data)
                this.addHistory("旋转角度", this.viewId, {
                  nodeId: item.node.getAttrs().historyId,
                });
            }
          }
          this.cloneStage({ viewId: _viewId })
        }
      });

      eventBus.$on("widthHeightChange", async (data) => {
        //宽高改变
        const designObj = linkageDesign(this.productData, this.viewId, this.curNode)
        let overallDesignArr = designObj[9999]
        let currentViewDesignArr = designObj[this.viewId]
        for(let _viewId in designObj) {
          for(let item of designObj[_viewId]) {
            let curNode = item.node
            if(overallDesignArr) {
              curNode = overallDesignArr.find(a => a.node.getAttrs().overallDesignId === item.node.getAttrs().overallDesignId).node
            } else if(item.node.hasName('isBg')) {
              curNode = currentViewDesignArr.find(a => a.node.hasName('isBg')).node
            }
            await this.bgImgLinkageEnd({viewId: _viewId, node: curNode, associateNode: item.node, type: 'transform'});
          }
          this.cloneStage({viewId: _viewId})
        }
      });
      eventBus.$on("OffsetXYChange", async (data) => {
        if(this.curNode.hasName('isBg')) {
          bgImgLinkageStart(this.productData)
        }
        let curS = this.getCurStageLayer({ viewId: this.viewId });
        let cXY = getNodeCenterXY({
          node: this.curNode,
          layer: stageObj[`stage${this.viewId}`].findOne(".designLayer"),
          posi: { x: data.data, y: data.data },
        });
        if (data.type == "x") {
          this.curNode.x(cXY.x);
        } else {
          this.curNode.y(cXY.y);
        }
        const designObj = linkageDesign(this.productData, this.viewId, this.curNode)
        let overallDesignArr = designObj[9999]
        let currentViewDesignArr = designObj[this.viewId]
        for(let _viewId in designObj) {
          for(let item of designObj[_viewId]) {
            let curNode = item.node
            if(overallDesignArr) {
              curNode = overallDesignArr.find(a => a.node.getAttrs().overallDesignId === item.node.getAttrs().overallDesignId).node
            } else if(item.node.hasName('isBg')) {
              curNode = currentViewDesignArr.find(a => a.node.hasName('isBg')).node
            }
            await this.bgImgLinkageEnd({viewId: _viewId, node: curNode, associateNode: item.node, type: 'drag'});
          }
          this.cloneStage({viewId: _viewId})
        }
      });

      eventBus.$on("productSave", (data) => {
        //保存产品
        this.saveDesign({type: data.type});
      });

      eventBus.$on("getProductByCode", async (code) => {
        //保存记录
        this.konvaJson = {};
        let editingProduct = this.$store.state.product.editingProduct;
        const ress = await _getRecordByCode(code);
        let productParams = {code: ress.data.product_type.code, isUpdate: -1};
        if(!this.$sdkConfig.platformIsZWKJ) productParams.default = -1;
        let res = await this.$store.dispatch("product/updateSelectedProduct", productParams);
        this.defaultValues = {
          color: ress.data.product_type.color_id,
          view: ress.data.product_type.view_id,
        };
        res.defaultValues = this.defaultValues;
        this.productData = res;
        let {cfg, konvaJson} = this.resetCfgAttrs(ress.data.cfg);
        this.konvaJson = konvaJson;
        //设置默认部件
        this.setPartDefaultMsg(this.productData, ress.data.product_type.part_cfg)
        editingProduct.color = ress.data.product_type.color_id;
        this.$store.commit("product/updateEditingProduct", editingProduct);
        this.$store.commit("product/updateSelectedProduct", res);
        localStorage.setItem(genLocalStorageKey("blankProId"), res.code);

        if(!this.$sdkConfig.platformIsZWKJ){
          this.$store.commit('product/updateSelectedProductDetail', res);
          this.$store.commit('product/updateProductDetailCache', {
            code: res.code,
            data: res
          })
        }
        if (cfg.length > 0 && cfg[0].konvaAttrs) {
          this.$nextTick(() => {
            this.init();
          });
        } else {
          if(this.urlQueryObj.customProId || this.urlQueryObj.product_code) { //替换产品需提示用户
            for(let item of ress.data.cfg) {
              if(item.type == 'text') {
                this.$message({
                  message: `该产品由旧版生成，文字效果可能存在差异，请注意核实`,
                  showClose: true,
                  duration: 0,
                  type: 'warning',
                });
                break;
              }
            }
          }
          this.oldDataRestore({
            data: ress.data,
            productData: res,
          }).then((newD) => {
            for (let item of newD.cfg) {
              if (!this.konvaJson[item.view_id])
              this.konvaJson[item.view_id] = [];
              this.konvaJson[item.view_id].push(item.konvaAttrs);
            }

            this.$nextTick(() => {
              this.init();
            });
          });
        }
      });

      eventBus.$on("changeViewIndex", ({isGroup=false, viewId}={}) => {
        if(isGroup){
          this.cloneStage({viewId})
        } else{
          if (this.curNode && !this.curNode.hasName("isBg")) {
            //设为背景也有改变层级,不需要频繁执行cloneStage
            const designObj = linkageDesign(this.productData, this.viewId, this.curNode);
            for(let vid in designObj){
              this.cloneStage({ viewId: vid });
            }
          }
        }
      });

      eventBus.$on("beforeLoginHandler", () => {
        //未登录保存设计
        let productConfig = this.getProductConfiguration();
        let noLoginDesign = {
          cfg: productConfig.cfgs,
          product_type: {
            code: productConfig.product_type_id,
            color_id: productConfig.color_id,
            view_id: productConfig.view_id,
            size_id: productConfig.size_id,
          },
        };
        localStorage.setItem(genLocalStorageKey("noLoginDesign"), JSON.stringify(noLoginDesign));
      });
      // 图层操作相关
      eventBus.$on("changeStage", (data) => {
        this.changeStage({ viewId: data.viewId });
      });
      // 撤销重做
      eventBus.$on("restoreHistory", (data) => {
        this.restoreHistory(data);
      });
      // 清空
      eventBus.$on("emptyDesign", () => {
        this.emptyDesign();
      });
      // 添加历史记录
      eventBus.$on("addHistory", (name, opts) => {
        this.addHistory(name, this.viewId, opts);
      });
      // 网格线
      eventBus.$on("addGridLine", (data) => {
        this.isShowGridLine = data;
        this.drawGridLine();
      });
      // 辅助线
      eventBus.$on("toggleAuxiliaryLine", (data) => {
        this.toggleAuxiliaryLine(data);
      });
      // 标尺线
      eventBus.$on("toggleRuler", (data) => {
        this.toggleRuler(data);
      });
      eventBus.$on("copyToView", async (data) => { 
        this.m_editText_removeTextarea() //如果当前文字处于编辑状态，则退出编辑状态
        const nodes = data.data.nodes || [this.curNode]
        if (nodes.length) {
          let stage = nodes[0].getStage();
          let layer = nodes[0].getLayer();
          let layerBgGroup = stage.findOne(".layerBgGroup");
          for(let curNode of nodes) {
            let nodeAttr = JSON.parse(JSON.stringify(curNode.getAttrs()));
            if(this.$sdkConfig.platform == 'xcxBackend' && nodeAttr.idE){
              delete nodeAttr.idE
              if(nodeAttr.imageData && nodeAttr.imageData.idE){
                delete nodeAttr.imageData.idE
              }
            }
            // if(this.$sdkConfig.platform == 'xcxBackend' && nodeAttr.channel_id){
            //   delete nodeAttr.channel_id
            //   if(nodeAttr.imageData && nodeAttr.imageData.channel_id){
            //     delete nodeAttr.imageData.channel_id
            //   }
            // }
            if(data.copyToCurrentView) { //当前面的复制粘贴需要偏移，复制到其他面不需要偏移
              nodeAttr.x += 10;
              nodeAttr.y += 10;
            }
            nodeAttr.stageWidth = layerBgGroup.width() * layer.scaleX();
            nodeAttr.layerScale = layer.scaleX();
            if (curNode.hasName("designText")) {
              // curNode.setAttrs(this.textAttrToLabel({ node:curNode }));
              await this.addText({
                viewId: data.data.id,
                recordData: nodeAttr,
              }).then((res) => {
                let node = res.data;
                node.setAttr("historyId", node._id);
                this.addHistory("图层复制", data.data.id, {
                  nodeId: node._id,
                });
              });
            } else {
              delete nodeAttr.image;
              if(nodeAttr.isclip){
                nodeAttr.flipImgUrl = nodeAttr.clipData.imgAttrs.originImg;
              }
              await this.addImage({
                imageData: nodeAttr.imageData,
                viewId: data.data.id,
                recordData: nodeAttr,
                iscopy: true,
                isGalleryClick: false
              }).then(async (res) => {
                await this.drawRepeatType({
                  viewId: data.data.id,
                  type: curNode.getAttrs().tileType,
                  node: res.data,
                  spacingH: curNode.getAttrs().spacingH,
                  spacingV: curNode.getAttrs().spacingV,
                }).then((img) => {
                });
                res.data.setAttr("historyId", res.data._id);
                this.addHistory("图层复制", data.data.id, {
                  nodeId: res.data._id,
                });
              });
            }
          }
          let params = {
            viewId: data.data.id,
          }
          if(data.type == 'all') {
            params.cloneViewLength = this.productData.views.length - 1
          } else {
            params.addDesign3d = this.productData.have_3d_img == 1  ? true : false
          }
          this.cloneStage(params);
          this.$store.commit('group/updateGroupChange', !this.$store.state.group.groupChange);
          if(data.data?.id !== this.viewId ){
             this.$statisticalreport.biCommonFn('复制至其他印刷面',this.curNode)
          }else{
             this.$statisticalreport.biCommonFn('创建副本',this.curNode)
          }
        }
      });
      eventBus.$on("nodeToggleDelete", (node) => {
        const curNode = node || this.curNode;
        this.deleteNode({ node: curNode, viewId: this.viewId });
      });
      eventBus.$on("changeColorAjustment", (data) => {
        //图片色彩调整：清晰度 饱和度  亮度 对比度 色温 色差
        this.changeColorAjustment(data);
      });
      eventBus.$on("opacityChange", (data) => {
        //透明度修改
        let curS = this.getCurStageLayer({ viewId: this.viewId });
        this.curNode.opacity(data.data);
        this.curNode.fire("click");
        if (this.curNode.type == "image") {
          this.drawRepeatType({
            viewId: this.viewId,
            type: this.curNode.getAttrs().tileType,
            node: this.curNode,
            spacingH: this.curNode.getAttrs().spacingH,
            spacingV: this.curNode.getAttrs().spacingV,
          }).then(() => {
            this.cloneStage({ viewId: this.viewId });
          });
        } else {
          this.cloneStage({ viewId: this.viewId });
        }
      });

      //取色器
      eventBus.$on("handleMarkColor", (data={}) => {
        let _this = this;
        let stage = stageObj[`stage${this.viewId}`];
        let layer = stage.findOne(".designLayer");
        let layerBgGroup = stage.findOne(".layerBgGroup");
        this.$store.commit("gallery/setPickColor", {
          isPickColor: true,
          color: "",
          type: data.type || ''
        });
        // let pickCHtml = `<div id="pickCTip">请移入设计区域内取色</div>`
        if (document.getElementById("pickCTip") == undefined) {
          let pickCHtml = document.createElement("div");
          pickCHtml.setAttribute("id", "pickCTip");
          pickCHtml.style.display = "none";
          document.body.appendChild(pickCHtml);
          pickCHtml.innerHTML = "请移入设计区域内取色";
        }
        if (document.getElementById("pixeCanvasBg") == undefined) {
          let pixeCanvasBg = document.createElement("div");
          pixeCanvasBg.setAttribute("id", "pixeCanvasBg");
          pixeCanvasBg.style.width = "100%";
          pixeCanvasBg.style.height = "100%";
          pixeCanvasBg.style.position = "fixed";
          pixeCanvasBg.style.left = 0;
          pixeCanvasBg.style.top = 0;
          pixeCanvasBg.style.zIndex = 9997;
          pixeCanvasBg.style.display = "block";
          document.body.appendChild(pixeCanvasBg);
        } else {
          document.getElementById("pixeCanvasBg").style.display = "block";
        }
        document.onmousemove = (e) => {
          if (
            document.getElementById("pixeCanvasBg").style.display == "block"
          ) {
            var e = e || window.event,
              posX,
              posY;
            if (e.clientX || e.clientY) {
              posX =
                e.clientX +
                document.documentElement.scrollLeft +
                document.body.scrollLeft;
              posY =
                e.clientY +
                document.documentElement.scrollTop +
                document.body.scrollTop;
            } else if (e.screenX || e.screenY) {
              posX =
                e.screenX +
                document.documentElement.scrollLeft +
                document.body.scrollLeft;
              posY =
                e.screenY +
                document.documentElement.scrollTop +
                document.body.scrollTop;
            }

            // if($('#pixeCanvasCon').is(':visible')) {
            let bbox = document
              .getElementById(`container${this.viewId}`)
              .getBoundingClientRect();
            if (
              bbox.x + stage.x() > posX ||
              bbox.y + stage.y() > posY ||
              bbox.x + layerBgGroup.width() * layer.scaleX() + stage.x() <
                posX ||
              bbox.y + layerBgGroup.height() * layer.scaleY() + stage.y() < posY
            ) {
              document.getElementById("pickCTip").style.display = "block";
              document.getElementById("pickCTip").style.left = posX + 16 + "px";
              document.getElementById("pickCTip").style.top = posY - 10 + "px";
              // $('#pickCTip').show()
              // $('#pickCTip').css({left: posX + 16, top: posY - 10})
              document.body.style.cursor = "not-allowed";
            } else {
              document.getElementById("pickCTip").style.display = "none";
              document.body.style.cursor = "auto";
              // $('#pickCTip').hide()
            }
            // }
          }
        };

        // let stageC = stage.clone();

        // let stageC = stage;
        stage.find("Transformer").hide();
        if (stage.findOne(".anchorGroup"))
          stage.findOne(".anchorGroup").hide();
        for (let item of stage.find(".auxiliaryPath")) {
          item.hide();
        }
        let img = stage.toDataURL({
          quality: 1,
          x: stage.x(),
          y: stage.y(),
          width: layerBgGroup.width() * layer.scaleX(),
          height: layerBgGroup.height() * layer.scaleY(),
        });
        stage.find("Transformer").show();
        if (stage.findOne(".anchorGroup"))
          stage.findOne(".anchorGroup").show();
        for (let item of stage.find(".auxiliaryPath")) {
          item.show();
        }
        // let layer = this.curNode.getLayer();
        // let printArea = layer.findOne(".print_area_border_outer");
        // let canvas = stageC.toCanvas();
        // document.getElementById('pixeCanvasBg').style.display = 'block'
        // document.getElementById('pixeCanvasCon').style.display = 'block'
        let canvas = null;
        // let canvas = document.getElementById('pixeCanvas')
        // let bbox = document.getElementById(`container${this.viewId}`).getBoundingClientRect()
        let stageContainerOffset = {
          // left: document.getElementById(`container${this.viewId}`).offsetLeft,
          // top: document.getElementById(`container${this.viewId}`).offsetTop,
          left: stage.x(),
          top: stage.y(),
        };
        if (document.getElementById("pixeCanvas") == undefined) {
          canvas = document.createElement("canvas");
          canvas.style.display = "block";
          canvas.setAttribute("id", "pixeCanvas");
          canvas.style.position = "fixed";
          canvas.style.zIndex = 9998;
          document.body.appendChild(canvas);
        } else {
          canvas = document.getElementById("pixeCanvas");
          canvas.style.display = "block";
        }

        canvas.width = layerBgGroup.width() * layer.scaleX();
        canvas.height = layerBgGroup.height() * layer.scaleY();
        canvas.style.left =
          stageContainerOffset.left +
          document.querySelector(".zwdesign-main--left").offsetWidth +
          "px";
        canvas.style.top =
          stageContainerOffset.top +
          document.querySelector(".zwdesign-header").offsetHeight +
          "px";

        let glass = new getColorByCanvas({
          canvas,
          imgs: img,
          stage,
          Konva,
          viewId: this.viewId,
          $store: this.$store,
        });
        glass.glassInit();
        canvas.onclick = function (e) {
          e.stopPropagation();
          // e.cancelBubble()
          let centerPoint = glass.windowToCanvas(e.clientX, e.clientY);
          let color = glass.getPixelColor(centerPoint.x, centerPoint.y);
          // document.getElementById('pppp').style.background = color.hex
          _this.$store.commit("gallery/setPickColor", {
            isPickColor: true,
            color: color.hex,
            type: data.type || ''
          });
          setTimeout(() => {
            stage = stageObj[`stage${_this.viewId}`];
            // stageC = stage.clone();
            // stageC = stage;
            stage.find("Transformer").hide();
            if (stage.findOne(".anchorGroup"))
              stage.findOne(".anchorGroup").hide();
            for (let item of stage.find(".auxiliaryPath")) {
              item.hide();
            }
            img = stage.toDataURL({
              quality: 1,
              x: stage.x(),
              y: stage.y(),
              width: layerBgGroup.width() * layer.scaleX(),
              height: layerBgGroup.height() * layer.scaleY(),
            });
            stage.find("Transformer").show();
            if (stage.findOne(".anchorGroup"))
              stage.findOne(".anchorGroup").show();
            for (let item of stage.find(".auxiliaryPath")) {
              item.show();
            }
            glass.setImgs = img;
            glass.setIsInit = true;
            glass.draw();
          }, 500);
        };
        // 快捷键默认显示放大镜
        if (!document.getElementById("pickcolorCenterBtn")) {
          let initBtn = document.createElement("button");
          initBtn.id = "pickcolorCenterBtn";
          initBtn.innerHTML = "pickcolorCenterBtn";
          initBtn.style.display = "none";
          document.body.appendChild(initBtn);
        }
        let pickcolorTimer = null;
        document
          .getElementById("pickcolorCenterBtn")
          .addEventListener("click", () => {
            let containerPos = document
              .getElementById(`container${_this.viewId}`)
              .getBoundingClientRect();
            let centerPointX = containerPos.x + containerPos.width / 2;
            let centerPointY = containerPos.y + containerPos.height / 2;
            glass.canvas.style.cursor = "none";
            glass.centerPoint = glass.windowToCanvas(
              centerPointX,
              centerPointY
            );
            if (pickcolorTimer) clearTimeout(pickcolorTimer);
            pickcolorTimer = setTimeout(() => {
              glass.draw();
            }, 500);
          });
        document
          .getElementById("pixeCanvasBg")
          .addEventListener("click", () => {
            document.getElementById("pixeCanvasBg").style.display = "none";
            document.getElementById("pixeCanvas").style.display = "none";
            document.getElementById("pickCTip").style.display = "none";
            document.body.style.cursor = "auto";
            this.$store.commit("gallery/setPickColor", {
              isPickColor: false,
              color: "",
              type: data.type || ''
            });
          });
        document.addEventListener("keydown", (e) => {
          let keyCode = e.keyCode || e.which || e.charCode;
          if (keyCode == 27) {
            if (this.$store.state.gallery.pickColorData.isPickColor) {
              document.getElementById("pixeCanvasBg").click();
            }
            e.preventDefault();
          }
        });
      });

      eventBus.$on("cloneStage", async (data) => {
        for(let item of data.designArr) {
          if(item.node.type === 'image') {
            await this.drawRepeatType({
              viewId: data.id,
              type: item.node.getAttrs().tileType,
              node: item.node,
              spacingH: item.node.getAttrs().spacingH,
              spacingV: item.node.getAttrs().spacingV,
            })
          }
        }
        this.cloneStage({ viewId: data.id });
      });

      eventBus.$on("editText", () => {
        this.editTextPop = true;
        // this.textString = this.curNode.findOne("Text").text();
        let text = this.curNode.findOne("Text").text();
        this.textString = text=='双击编辑文字' ? '' : text;
      });

      eventBus.$on("addToCar", (data) => {
        this.saveDesign({ type: data=='buyNow' ? data : 1 });
      });
      eventBus.$on("addtoCarConfirm", () => {
        this.setProductSave({ flag: 1 });
      });
    },
    imgRestoreInitSize() {
      let curS = this.getCurStageLayer({ viewId: this.viewId });
      let satge = curS.stage
      let layer = curS.layer;
      let designRect = curS.designRect;
      let ratio = layer.getAttrs().ratio;
      let imgSize = imgSizeCalculate({
        imageData: this.curNode.getAttrs().imageData,
        viewId: this.viewId,
        productData: this.productData
      });
      this.curNode.setAttrs({
        scaleX: imgSize.width / ratio / this.curNode.width(),
        scaleY: imgSize.height / ratio / this.curNode.height(),
        offsetX: this.curNode.width() / 2,
        offsetY: this.curNode.height() / 2,
        // width: imgSize.width / ratio,
        // height: imgSize.height / ratio,
      });
      this.curNode.setAttrs({
        x: designRect.width() / 2,
        y: this.curNode.height() * this.curNode.scaleY() / 2,
      })
      this.ncYSRemind({
        currentStage: satge,
        node: this.curNode,
      }).then((data) => {
        this.setLayerImgList({
          viewId: this.viewId,
          node: this.curNode,
          isAdd: false,
          isVagueData: data.isVagueData,
          transformData: data.transformData,
          overspreadData: data.overspreadData,
          type: "image",
        });
      });
    },
    setBgColorConfirm(val) {
      let curS = this.getCurStageLayer({ viewId: this.viewId });
      let layer = curS.layer;
      if(!layer.findOne(".bgRect")) { //颜色选择器上有默认颜色点确定
        this.setBgColor({ color: val })
      }
      if (val) {
        this.addHistory("设置背景色", this.viewId);
      } else {
        this.addHistory("清空背景色", this.viewId);
      }
    },
    setBgColorClick(type) {
      // this.confirmCheck["useall"] = false;
      // if (this.form.background_color == null) {
      //   this.form.useall = false;
      // }
      // eventBus.$emit("setBgColorClick", {
      //   data: this.form.background_color != null,
      //   type: type,
      //   color: this.form.background_color,
      // });
      this.setBgColor({ color: this.background_color });
    },
    activeSetBgColorClick(value) {
      this.setBgColor({ color: value });
      // this.confirmCheck["useall"] = false;
      // if (this.form.background_color == null) {
      //   this.form.useall = false;
      // }
      // eventBus.$emit("setBgColorClick", {
      //   data: value != null,
      //   type: "",
      //   color: value,
      // });
    },
    setBgColor({ color, type = null, viewId = null }) {
      // let curS = this.getCurStageLayer({ viewId: this.viewId });
      // let layer = curS.layer;
      // this.addBgColor({ color, viewId: this.viewId });
      // layer.batchDraw();

      if (this.productData.imgFull==1 && this.productData.views.length > 1) {
        //全副产品添加第一张图片要默认设为背景并应用到所有面
        // for(let item of this.productData.views) {
        //   let curS = this.getCurStageLayer({ viewId: item.id });
        //   let layer = curS.layer;
        //   if(item.id == this.viewId) {
        //     if(layer.find('.designImg').length) hasDesign = true
        //   }
        // }
        eventBus.$emit("setBgColorClick", {
          data: !color || color == "transparent" ? false : true,
          type: "all",
          color,
          viewId,
        });
      } else {
        eventBus.$emit("setBgColorClick", {
          data: !color || color == "transparent" ? false : true,
          type,
          color,
          viewId,
        });
        // this.cloneStage({ viewId: this.viewId });
      }
      // if(!hasDesign) {
      //     eventBus.$emit("setBgColorClick", {
      //       data: true,
      //       type: "all",
      //     });
      // }

      // this.cloneStage({ viewId: this.viewId });
    },
    addBgColor({ 
      color, 
      viewId, 
      overallDesign=false, 
      templateAttrs=null,
      cloneViewLength=1, 
      isInit=false
    }) {
      let curS = this.getCurStageLayer({ viewId });
      let layer = curS.layer;
      let designContainerGroup = curS.designContainerGroup;
      let bgRect = null;
      if (layer.findOne(".bgRect")) {
        if (!color || color == "transparent") {
          layer.findOne(".bgRect").destroy();
          this.setLayerImgList({
            viewId,
            node: null,
            isDelete: true,
            type: "bgcolor",
          });
        } else {
          bgRect = layer.findOne(".bgRect");
          bgRect.fill(color);
          if(overallDesign && !bgRect.hasName('overallDesign')){
            bgRect.addName('overallDesign');
          }
          this.setLayerImgList({
            viewId,
            node: layer.findOne(".bgRect"),
            isAdd: true,
            type: "bgcolor",
          });
        }
      } else {
        if (color && color != "transparent") {
          bgRect = new Konva.Rect({
            x: 0,
            y: 0,
            width: layer.findOne(".print_area_border_outer").width(),
            height: layer.findOne(".print_area_border_outer").height(),
            fill: color,
            name: "bgRect design",
            listening: false,
          });
          bgRect.addName(`design${bgRect._id}`);
          if(overallDesign){
            bgRect.addName('overallDesign');
          }
          if(templateAttrs){
            bgRect.addName('template');
            bgRect.setAttrs(templateAttrs);
          }
          designContainerGroup.add(bgRect);
          bgRect.moveToBottom();
          this.setLayerImgList({
            viewId,
            node: bgRect,
            isAdd: true,
            type: "bgcolor",
          });
        }
      }
      layer.batchDraw()
      if(!isInit){
        this.cloneStage({viewId, cloneViewLength});
      }
      this.showTouchAnimation = false;
      this.checkShowOverallDesignTip()
      this.pointoutPrintAreaShow({ viewId });
    },
    bgColorToView(item) {
      let viewIdArr = [];
      if (item.id == "-1") {
        this.setBgColor({ color: this.background_color, type: 'all' });
      } else {
        this.setBgColor({ color: this.background_color, viewId: item.id });
      }
      this.$refs.bgColorToView.doClose();
    },
    flipImage({ data, node, viewId, isReduction = false, isClick = false } = {}) {
      return new Promise((resolve, reject) => {
        let curS = this.getCurStageLayer({viewId})
        let layerBg = curS.layerBg;
        let _this = this;
        let nodeAttrs = node.getAttrs();
        let width = nodeAttrs.isclip ? nodeAttrs.clipData.imgAttrs.width : node.width(), 
          height = nodeAttrs.isclip ? nodeAttrs.clipData.imgAttrs.height : node.height(),
          imgUrl = nodeAttrs.isclip ? nodeAttrs.clipData.imgAttrs.originImg : nodeAttrs.flipImgUrl;
        let canvas = document.createElement("canvas");
        canvas.width = width; //解决翻转后图片放大会模糊的问题
        canvas.height = height;
        let context = canvas.getContext("2d");

        let image = new Image();
        image.setAttribute("crossOrigin", "anonymous");
        image.src = imgUrl;
        image.onload = async () => {
          if (data.data == "leftRightMirror") {
            if(isClick) {
              node.setAttrs({
                xFlip: node.getAttrs().xFlip ? false : true,
              });
            }
            context.scale(-1, 1);
            context.drawImage(
              image,
              -canvas.width,
              0,
              canvas.width,
              canvas.height
            );
          } else if (data.data == "upDownMirror") {
            if(isClick) {
              node.setAttrs({
                yFlip: node.getAttrs().yFlip ? false : true,
              });
            }
            context.scale(1, -1);
            context.drawImage(
              image,
              0,
              -canvas.height,
              canvas.width,
              canvas.height
            );
          }
          let flipUrl = canvas.toDataURL();
          let imageData = JSON.parse(JSON.stringify(node.getAttrs().imageData));
          imageData.designImg = flipUrl
          imageData.designImg3 = flipUrl
          if(node.getAttrs().isclip){
            let clipData = JSON.parse(JSON.stringify(node.getAttrs().clipData))
            if(!this.m_clip_isCliping){
              clipData = this.m_clip_updateClipData(node, data.data)
              clipData.imgAttrs.originImg = flipUrl;
            }
            let clipUrl = await this.m_clip_getClipImage(clipData);
            let [clipImage] = await loadImgs([clipUrl]);
            node.image(clipImage);
            node.setAttrs({clipData, flipImgUrl: clipUrl, imageData })
          } else {
            let [flipImg] = await loadImgs([flipUrl]);
            node.image(flipImg);
            node.setAttrs({ flipImgUrl: flipUrl, imageData });
          }
          if (isReduction) { //记录还原
            resolve();
            return;
          }
          node.getLayer().batchDraw();
          _this.drawRepeatType({
            viewId,
            type: node.getAttrs().tileType,
            node,
            spacingH: node.getAttrs().spacingH,
            spacingV: node.getAttrs().spacingV,
          })
          .then(() => {
            resolve();
            _this.addHistory("图层变换", viewId, {
              nodeId: node.getAttrs().historyId,
            });
          });
        };
      });
    },
    textAttrToLabel({ node }) {
      let layer = node.getLayer();
      let stage = node.getStage();
      let layerBgGroup = stage.findOne(".layerBgGroup");
      let nodeAttr = JSON.parse(JSON.stringify(node.getAttrs()));
      let text = node.findOne("Text");
      nodeAttr.designText = text.text();
      (nodeAttr.designFill = node.findOne("Rect").fill()),
        (nodeAttr.proStrokeWidth = text.strokeWidth());
      nodeAttr.proStroke = text.stroke();
      nodeAttr.textColor = text.fill();
      nodeAttr.proFontFamily = text.fontFamily();
      nodeAttr.proFontSize = text.fontSize();
      // nodeAttr.canvasFontSize =
      //   (text.fontSize() * layer.scaleX()) / (stage.width() / 547.2);
      nodeAttr.proFontStyle = text.fontStyle();
      nodeAttr.proTextDecoration = text.textDecoration();
      nodeAttr.textAlign = text.align();
      nodeAttr.stageWidth = layerBgGroup.width() * layer.scaleX();
      nodeAttr.layerScale = layer.scaleX();
      nodeAttr.strokeValue = node.strokeValue;
      return nodeAttr;
    },
    drawGridLine() {
      let isShowGridLine = this.isShowGridLine;
      let viewId = this.viewId;
      let stage = stageObj[`stage${viewId}`];
      let designLayer = stage.findOne(".designLayer");
      let layerBgGroup = stage.findOne(".layerBgGroup");
      let width = layerBgGroup.width() * designLayer.scaleX();
      if (!stage.findOne(".layerGrid")) {
        stage.add(
          new Konva.Layer({
            name: "layerGrid",
          })
        );
      }
      let layer = stage.findOne(".layerGrid");

      // let height = stage.height()
      if (isShowGridLine) {
        if (stage.findOne(".gridGroup")) {
          stage.findOne(".gridGroup").destroy();
          layer.draw();
        }
        let lineCount = width / 60;
        let remainder = (width % 60) / 2;
        let gridGroup = new Konva.Group({
          fill: "red",
          width: layerBgGroup.width() * designLayer.scaleX(),
          height: layerBgGroup.width() * designLayer.scaleX(),
          name: `gridGroup`,
        });
        for (let i = 0; i < lineCount; i++) {
          var greenLineX = new Konva.Line({
            points: [0, 60 * i + remainder, width, 60 * i + remainder],
            stroke: "rgba(0,0,0,1)",
            strokeWidth: 1,
            lineJoin: "round",
            /*
             * line segments with a length of 33px
             * with a gap of 10px
             */
            dash: [1, 1],
          });
          var greenLineY = new Konva.Line({
            points: [60 * i + remainder, 0, 60 * i + remainder, width],
            stroke: "rgba(0,0,0,1)",
            strokeWidth: 1,
            lineJoin: "round",
            /*
             * line segments with a length of 33px
             * with a gap of 10px
             */
            dash: [1, 1],
          });
          gridGroup.add(greenLineX);
          gridGroup.add(greenLineY);
          layer.add(gridGroup);
          stage.add(layer);
        }
      } else {
        if (stage.findOne(".gridGroup")) {
          stage.findOne(".gridGroup").destroy();
          layer.draw();
        }
      }
    },
    toggleAuxiliaryLine(data) {
      Object.keys(stageObj).forEach((stageKey) => {
        let stage = stageObj[stageKey];
        for (let item of stage.find(".auxiliaryPath")) {
          item.visible(data);
        }
        stage.findOne(".designLayer").batchDraw();
      });
    },
    toggleRuler(data) {
      document.querySelector(".designer-ruler").style.display = data
        ? "block"
        : "none";
      if (data) {
        this.initRulerAll();
      }
      document.querySelectorAll(".ruler-line").forEach((l) => {
        l.style.display = data ? "block" : "none";
      });
      this.$store.commit("layout/toggleRulerLine", data);
    },
    toggleRulerLine(data) {
      // 只有在标尺显示的时候才执行
      if (this.isShowRuler) {
        this.$store.commit("layout/toggleRulerLine", data);
        document.querySelectorAll(".ruler-line").forEach((l) => {
          l.style.display = data ? "block" : "none";
        });
      }
    },
    changeColorAjustment(data) {
      let _this = this;
      _this.curNode.setAttrs("colorAjustment", data);
      _this.curNode.cache();
      _this.curNode.filters([
        Konva.Filters.Brighten,
        Konva.Filters.Contrast,
        Konva.Filters.HSV,
      ]);
      _this.curNode.brightness(data.brightness / 100);
      _this.curNode.contrast(data.contrast);
      _this.curNode.saturation(data.saturation / 100);
      if (data.hue < 0) {
        _this.curNode.hue(data.hue * -1.2 + 180);
      } else {
        _this.curNode.hue(data.hue * 1.2);
      }

      _this.curNode.getLayer().batchDraw();
    },
    async init({ init = true } = {}) {
      // let paddingLeft = Number(getStyle(document.getElementById('stageContainer'),"paddingLeft").replace(/\s+|px/gi,""))
      // this.designContainerWidth = document.getElementById('stageContainer').clientWidth - paddingLeft
      this.layerImgList = [];
      this.$store.commit("gallery/getDesignImgList", {
        data: this.layerImgList,
      });
      this.curColorId = this.defaultValues.color;
      this.viewId = this.productData.views[0].id;
      eventBus.$emit("changeTreeSelectNode", {
        viewId: this.viewId,
        data: null,
      });
      this.$store.commit("changeCurNodeId", "view-" + this.viewId);
      // document.querySelector('.view-img').innerHTML = ''
      // cacheProductPrintAreas = [];
      cacheProductPrintAreas.length = 0
      this.detailImages = {};
      this.viewImgObj = [];
      this.curNode = null;
      this.need2dImg = false; //存在2d细节图
      this.needCanvas = false //存在3d细节图或模型
      this.createProductInit = true
      this.$store.dispatch(
        "addViewCfg",
        JSON.parse(JSON.stringify(this.productData.views))
      );
      this.$store.commit("gallery/getDetailImageList", {
        data: [{rendered: false}]
      })
      destroy3DModel({
        threeDApp,
        detailImages: this.detailImages,
      })
      destroy3DModel({
        threeDApp: keepThreeDApp,
        detailImages: this.detailImages,
      })
      if (this.productData.is_show_3dimg != -1) {
        //该产品存在3d模型
        this.needCanvas = true
        
        for(let cid in this.productData.show_3d_model){
          let show_3d_model = this.productData.show_3d_model[cid];
          show_3d_model.colors = [];
          for(let colorId in show_3d_model.colorsData){
            for(let item of show_3d_model.modelData.uvList){
              item.customBase = {
                designColorCode: show_3d_model.colorsData[colorId].data.designColorCode,
                designColorType: show_3d_model.colorsData[colorId].data.designColorType,
                designColorUrl: show_3d_model.colorsData[colorId].data.designColorUrl
              }
            }
            show_3d_model.colors.push({
              id: colorId,
              detail: [{
                parts: [{
                  type: 2,
                  modelId: show_3d_model.detail3d.model_id,
                  detail3D: Object.assign({
                    textureMap: show_3d_model.colorsData[colorId].data.textureMap,
                    parts: show_3d_model.detail3d.parts
                  }, show_3d_model.modelData)}]
              }]
            })
          }
        }
      }
      let colors = JSON.parse(JSON.stringify(this.productData.colors));
      for (let colorItem of colors) {
        if (colorItem.detail) {
          for (let det of colorItem.detail) {
            if(det.parts) {
              for (let part of det.parts) {
                if (part.type == 2) {
                  //存在3d图
                  this.needCanvas = true;
                }else if(part.type == 0) {
                  //存在3d图
                  this.need2dImg = true;
                }
              }
            }
          }
        }
      }
      for (let key in stageObj) {
        stageObj[key].destroy();
      }
      let productViews = JSON.parse(JSON.stringify(this.productData.views))
      productViews.unshift(this.overallDesignView)
      if (init) {
        //项目初始化&保存记录
        let isNoLoginDesign = false;
        let afterLoginHandler = localStorage.getItem(genLocalStorageKey('afterLoginHandler'));
        localStorage.removeItem(genLocalStorageKey('afterLoginHandler'));
        if (localStorage.getItem(genLocalStorageKey("noLoginDesign"))) {
          // 如果localStorage带有颜色信息，则默认选中产品的颜色
          isNoLoginDesign = true;
          let noLoginDesign = JSON.parse(localStorage.getItem(genLocalStorageKey("noLoginDesign")));
          if(noLoginDesign.product_type && noLoginDesign.product_type.color_id){
            let hasColor = this.productData.colors.find(c=>c.id==noLoginDesign.product_type.color_id);
            if(hasColor){
              this.$store.commit('product/updateEditingProduct', Object.assign(this.$store.state.product.editingProduct, {
                color: noLoginDesign.product_type.color_id,
                size: noLoginDesign.product_type.size_id
              }))
            }
          }
          //设置从旧版或简版带过来的部件
          this.setPartDefaultMsg(this.productData, JSON.parse(localStorage.getItem(genLocalStorageKey("noLoginDesign"))).product_type.part_cfg)
        }
        this.reCalculateStage()({ init: true });
        this.$nextTick(async () => {
          let initPromise = [], index = 0;
          for (let item of productViews) {
            initPromise.push(
              new Promise((resolve, reject) => {
                this.createStage({ view: item }).then(async () => {
                  this.reCalculateStage()({
                    init: true,
                    isReset: true,
                    createLayerEnd: true,
                    viewId: item.id,
                  });
                  this.touchAnimationPos({ viewId: item.id });
                  this.checkShowOverallDesignTip();
                  this.changeViewInit({ viewId: item.id });
                  this.pointoutPrintAreaShow({ viewId: item.id });
                  let curS = this.getCurStageLayer({ viewId: item.id });
                  let currentStage = curS.stage;
                  let layer = curS.layer;
                  resolve();
                  // let konvaJson = JSON.parse(localStorage.getItem('konvaJson'))
                  if (localStorage.getItem(genLocalStorageKey("noLoginDesign"))) {
                    //未登录时设计过的产品还原 || 从简版设计器来 || 从旧版设计器来
                    let noLoginDesign = JSON.parse(
                      localStorage.getItem(genLocalStorageKey("noLoginDesign"))
                    )
                    this.setPartDefaultMsg(this.productData, noLoginDesign.product_type.part_cfg)
                    for (let design of noLoginDesign.cfg) {
                      if (!this.konvaJson[design.view_id])
                        this.konvaJson[design.view_id] = [];
                      if (design.view_id == item.id) {
                        if (!design.konvaAttrs) {
                          await this.oldDataRestore({
                            data: noLoginDesign,
                            productData: this.productData,
                          }).then((newD) => {
                            for (let newData of newD.cfg) {
                              if (design.view_id == newData.view_id) {
                                this.konvaJson[newData.view_id].push(
                                  newData.konvaAttrs
                                );
                              }
                            }
                          });
                          break;
                        } else {
                          this.konvaJson[design.view_id].push(
                            design.konvaAttrs
                          );
                        }
                      }
                    }
                    setTimeout(() => {
                      localStorage.removeItem("noLoginDesign");
                    }, 2000);
                  }
                  let promises = [];
                  if (this.konvaJson[item.id]) {
                    //保存记录 || 未登录时设计过的产品  还原
                    for (let node of this.konvaJson[item.id]) {
                      if (node.name.indexOf("designImg") != -1) {
                        if (isRisk(node.imageData)) {
                          this.$message.error("图片信息异常，无法使用");
                        } else {
                          // promises.push(
                          //   new Promise((resolve, reject) => {
                          node.flipImgUrl = node.imageData.designImg3;
                          await this.addImage({
                            imageData: node.imageData,
                            viewId: item.id,
                            isGalleryClick: false,
                            recordData: node,
                            isSetBg: node.name.indexOf("isBg") > -1,
                          }).then(async (data) => {
                            await this.drawRepeatType({
                              viewId: item.id,
                              type: data.data.getAttrs().tileType,
                              node: data.data,
                              spacingH: data.data.getAttrs().spacingH,
                              spacingV: data.data.getAttrs().spacingV,
                            }).then(() => {
                              // resolve();
                            });
                          });
                          //   })
                          // );
                        }
                      } else if (node.name.indexOf("designText") != -1) {
                        // promises.push(
                        //   new Promise((resolve, reject) => {
                        if (node.oldData) {
                          //旧设计器文字还原，只需要把文字还原到初始位置
                          await this.addText({
                            textNode: node,
                            viewId: item.id,
                            isGalleryClick: false,
                          });
                        } else {
                          await this.addText({
                            viewId: item.id,
                            isGalleryClick: false,
                            recordData: node,
                          });
                        }
                        //     resolve();
                        //   })
                        // );
                      } else if (node.name.indexOf("bgRect") != -1) {
                        // promises.push(
                        //   new Promise((resolve, reject) => {
                        let tempAttrs = null;
                        if(typeof node.tempCfgIndex != 'undefined' && node.templateCode != 'undefined'){
                          tempAttrs = {
                            tempCfgIndex: node.tempCfgIndex, 
                            templateCode: node.templateCode
                          };
                        }
                        this.addBgColor({
                          color: node.fill,
                          viewId: item.id,
                          tempAttrs,
                          isInit: true
                          // recordData: node,
                        });
                        // resolve();
                        //   })
                        // );
                      }
                    }
                  } else {
                    // promises.push(new Promise((resolve) => {resolve()}))
                  }
                  // Promise.all(promises).finally(() => {
                      this.cloneStage({ viewId: item.id, isInit: true });
                  // });
                  this.addHistory("init", item.id);
                  if (item.id == productViews[0].id) {
                    this.getPhotoDetail()
                  }
                  index += 1
                  if(index === productViews.length) { //所有面文字图片添加完成
                    // 登录后执行的操作
                    if(afterLoginHandler){
                      this.afterLoginHandler({type: afterLoginHandler});
                    }
                  }
                });
              })
            );
          }
          Promise.all(initPromise).finally(async () => {
            this.changeStage({ viewId: this.productData.views[0].id, init: true });
            this.$store.commit("setInitLoading", false);
            eventBus.$emit("updatePrice");
            // 自动选择热力值第一的产品的第一个模板
            this.getParts();
            let comModel = GetQueryString('comModel') || GetQueryString('template_code');
            if(comModel&&!isNoLoginDesign){ //如果是未登录应用了模板，点保存登录后恢复不执行应用模板操作只还原数据
              let ret = await getProductTemplate({code: comModel});
              eventBus.$emit('applyTemplate', {code:comModel, data: ret.data, init: true});
            }
            this.getParts();
          });
          
        });
        this.$store.commit("changeCurViewIndexList", {
          // curViewIndexList: [0, 1, 2, 3],
          curViewIndexList: [0],
        });
      } else {
        //切换产品
        // this.curColorId = this.productData.colors[0].id
        // this.viewId = this.productData.views[0].id
        // this.$store.commit("gallery/getDesignImgList", {data: []});
        // this.createProductInit = false;
        this.$nextTick(() => {
          let initPromise = [];
          for(let i=0; i<productViews.length; i++){
            initPromise.push(
              new Promise((resolve, reject) => {
                let viewId = productViews[i].id;
                this.createStage({view: productViews[i]}).then(async data => {
                  this.reCalculateStage()({
                    init: true,
                    isReset: true,
                    createLayerEnd: true,
                    viewId: data.view.id,
                  })
                  this.touchAnimationPos({ viewId: data.view.id });
                  this.checkShowOverallDesignTip();
                  this.changeViewInit({ viewId: data.view.id });
                  this.pointoutPrintAreaShow({ viewId: data.view.id });
                  resolve();
                  let _designJson = viewId==9999 ? this.designToJson[9999] : Object.values(this.designToJson).find(a=>a.viewIndex==i);
                  if(_designJson && _designJson.imageArr.length){
                    for(let nodeitem of _designJson.imageArr){
                      if(nodeitem.hasName('template') && nodeitem.attrs.templateCode){
                        // 模板
                        let tempCfgIndex = nodeitem.attrs.tempCfgIndex;
                        let tempCfg = JSON.parse(JSON.stringify(this.templateCache.cfg[tempCfgIndex]));
                        let nodeAttrs = JSON.parse(JSON.stringify(tempCfg.konvaAttrs));
                        if(nodeAttrs.name.indexOf('template') == -1){
                          nodeAttrs.name += ' template'
                        }
                        if(nodeitem.hasName('designImg') || nodeitem.hasName('designText')){
                          this.diffViewTheSameDesign({
                            currentView: productViews[i],
                            associateProductView: this.templateCache.views.find(a=>a.id==tempCfg.view_id),
                            currentRecordData: nodeAttrs,
                            associateNodeAttrs: nodeAttrs,
                            fromCustomProducts: true,
                            type: nodeAttrs.name.indexOf('designText')? 'text' : 'image'
                          })
                        }
                        if(nodeitem.hasName('designImg')){
                          await this.addImage({
                            viewId: viewId,
                            imageData: nodeAttrs.imageData,
                            recordData: nodeAttrs,
                            isGalleryClick: false,
                            isSetBg: nodeAttrs.name.indexOf("isBg") > -1,
                          }).then(async (data) => {
                            await this.drawRepeatType({
                              viewId: viewId,
                              type: nodeAttrs.tileType,
                              spacingH: nodeAttrs.spacingH,
                              spacingV: nodeAttrs.spacingV,
                              node: data.data
                            });
                          })
                        } else if(nodeitem.hasName("designText")) {
                          await this.addText({
                            viewId: viewId,
                            recordData: nodeAttrs,
                            isGalleryClick: false,
                          })
                        } else if(nodeitem.hasName("bgRect")) {
                          this.addBgColor({
                            viewId: viewId,
                            color: nodeitem.fill(),
                            isInit: true,
                            templateAttrs: {
                              tempCfgIndex: nodeAttrs.tempCfgIndex,
                              templateCode: nodeAttrs.templateCode
                            }
                          });
                        }
                      } else {
                        // 图片
                        if(nodeitem.hasName('designImg')){
                          if(nodeitem.attrs.isclip){       
                            nodeitem.attrs.flipImgUrl = nodeitem.attrs.clipData.imgAttrs.originImg;
                          }
                          await this.addImage({
                            imageData: nodeitem.attrs.imageData,
                            viewId: viewId,
                            isGalleryClick: false,
                            isProductChange: true,
                            recordData: nodeitem.attrs,
                            isSetBg: nodeitem.hasName("isBg"),
                          }).then(async (data)=>{
                            await this.drawRepeatType({
                              viewId: viewId,
                              type: data.data.getAttrs().tileType,
                              node: data.data,
                              spacingH: data.data.getAttrs().spacingH,
                              spacingV: data.data.getAttrs().spacingV,
                            })
                          })
                        } else if(nodeitem.hasName("designText")) {
                          await this.addText({
                            textNode: nodeitem.getAttrs(),
                            viewId: viewId,
                            isGalleryClick: false,
                          })
                        } else if(nodeitem.hasName("bgRect")) {
                          this.addBgColor({
                            color: nodeitem.fill(),
                            viewId: viewId,
                            isInit: true,
                          });
                        }
                      }
                    }
                  }
                  this.cloneStage({viewId, isInit: true});
                  this.addHistory('init', viewId);
                  this.$store.commit('changeCurViewIndexList', {
                    curViewIndexList: [0],
                  })
                  if(viewId==this.productData.views[0].id){
                    this.changeStage({ viewId: viewId, init: true});
                  }
                });
              })
            )
          }
          Promise.all(initPromise).finally(async () => {
            this.getParts();
          });
          this.canvasLoadFinish = true;
        });
      }
    },
    getParts() {
      this.partsList = JSON.parse(JSON.stringify(this.productData.spu_details))
      if(this.$sdkConfig.platform == 'xcxBackend'){
        this.partsList = []
      }
      // let stageHeight = stageObj[`stage${this.viewId}`].findOne(".layerBg").getClientRect().height - 80;
      let swiperHeight = this.designContainerWidth-42;
      let maxNumber = Math.ceil(swiperHeight/80);
      if(this.productData.views.length + this.partsList.length >= maxNumber){
        this.viewImgStyle.height = swiperHeight + 'px';
        this.viewImgStyle.hasScroll = true;
        this.showChangeViewBtn = true
      } else {
        this.viewImgStyle.height = 'auto';
        this.viewImgStyle.hasScroll = false;
        this.showChangeViewBtn = false
      }
      this.getPartDefaultMsg()
      this.$store.commit('product/updatePartsList', this.partsList)
    },
    getPartDefaultMsg() {
      let partCheckedList = []
      for(let item of this.partsList) {
        for(let det of item.detail_parts) {
          if(det.is_default === 1) {
            for(let it of det.items) {
              if(it.is_default == 1) { //默认颜色尺码
                partCheckedList.push({
                  partId: item.part_id,
                  childPartId: det.part_detail_id,
                  colorId: it.color_id,
                  sizeId: it.size_id,
                  isChecked: true,
                  price: det.part_detail_price
                })
                break
              }
            }
          }
        }
      }
      this.$store.commit('product/updatepartCheckedList', partCheckedList)
    },
    setPartDefaultMsg(product, part_cfg) {
      if(!part_cfg) return
      const partCfg = part_cfg.split(',')
      if(partCfg.length) {
        for(let item of product.spu_details) {
          for(let det of item.detail_parts) {
            det.is_default = -1
            for(let it of det.items) {
              if(partCfg.findIndex(pc => {return pc == it.id}) != -1) {
                it.is_default = 1
                det.is_default = 1
              } else {
                it.is_default = -1
              }
            }
          }
        }
      }
    },
    createStage({ view }) {
      return new Promise((resolve, reject) => {
        this.viewImgObj.push({ id: view.id, name: view.name });
        this.layerImgList.push({
          id: view.id,
          _id: "view-" + view.id,
          label: view.name,
          type: "view",
          icon: "skin",
          childrens: [],
          bgcolor: "",
        });
        stageObj[`stage${view.id}`] = new Konva.Stage({
          container: `container${view.id}`,
          width: document.getElementById("designer").clientWidth,
          height: document.getElementById("designer").clientHeight,
        });
        let currentStage = stageObj[`stage${view.id}`];

        let layerBg = new Konva.Layer({
          name: "layerBg",
          x: 0,
          y: 0,
        });

        let layerBgGroup = new Konva.Group({
          width: this.designContainerWidth,
          height: this.designContainerWidth,
          name: "layerBgGroup",
        });
        layerBg.add(layerBgGroup);
        currentStage.add(layerBg);

        let transparentbgRect = new Konva.Rect({
          x: 0,
          y: 0,
          name: "transparentbgRect",
          width: this.designContainerWidth,
          height: this.designContainerWidth,
          fill: '#F0F2F5',
          shadowColor: '#000',
          shadowOpacity: 0.15,
          shadowBlur: 24,
          shadowOffset: {x: 0, y: 0},
          listening: false,
        });
        layerBgGroup.add(transparentbgRect);
        layerBg.batchDraw();
        this.initDesignLayer({ viewId: view.id }).then((data) => {
          resolve({ view: view });

          if (view.id == this.productData.views[0].id) {
            this.changeStage({ viewId: view.id, init: true });
          }
        });

        var n = {};
        n.id = view.print_area.id; //打印区域id
        n.defaultViews = view.id; //默认哪一面
        n.printArea = view.print_area; //打印区域
        n.config = this.convertDefaultConfig({
          width: view.print_area.width,
          height: view.print_area.height,
        });
        cacheProductPrintAreas.push(n);

        currentStage.on("dragmove", (e) => {
          this.setViewLeftTop({ viewId: this.viewId });
          this.printAreaTip({ currentStage });
          this.touchAnimationPos({ viewId: view.id });
          this.checkShowOverallDesignTip();
          if (this.isSpaceKey && this.isShowRuler && !this.curNode) {
            if (this.rulerChangeTimer) return;
            this.rulerChangeTimer = setTimeout(() => {
              this.initRulerAll();
              this.rulerChangeTimer = null;
            }, 100);
          }
        });
        currentStage.on("dragend", (e) => {
          for (let item of this.productData.views) {
            if (view.id != item.id) {
              let curS = this.getCurStageLayer({ viewId: item.id });
              let stage = curS.stage;
              stage.setAttrs({
                x: currentStage.x(),
                y: currentStage.y(),
              });
              stage.batchDraw();
            }
          }
        });
        this.m_ms_watchStageMouseEvent(currentStage,()=>{
          const productViews = [this.overallDesignView, ...this.productData.views]
            productViews.forEach(view => {
              this.getCurStageLayer({viewId: view.id}).mainImgLayer.hide()
            })
            this.showTouchAnimation = false
            this.checkShowOverallDesignTip()
        })

        //绑定设计图片点击事件
        currentStage.on("mousedown", async (e) => {
          if(this.m_editText_handleOutsideClick(e)) return //文字编辑完成
          if (
            e.target === currentStage
          ) {
            let bool = this.checkEventPos(currentStage, 2);
            if(!this.curNode && !bool){
              //解决整体设计3d渲染导致卡顿，会点击到stage出现主图
              this.getCurMainImg()
            }
          }
          if(this.m_ms_shiftKeyDown) return;
          if (
            e.target === currentStage
          ) {
            this.$store.commit("layout/changeSelectType", null);
            if (this.m_clip_isCliping) {
              await this.m_clip_implementClip()
            }
            this.$store.commit('layout/toggleProductDetail', true);
            this.destroyTransformer({viewId: this.viewId});
            currentStage.find(".design").map(node=>{
              node.isSelected = false
            })
            this.autoChangeLeftType(currentStage);
            return;
          }
          // do nothing if clicked NOT on our rectangles
          if (
            !e.target.hasName("designImg") &&
            !e.target.hasName("designText")
          ) {
            return;
          }
        });
        // 右键菜单操作
        this.initStageCtxMenu(currentStage);
      });
    },
    autoChangeLeftType(currentStage){
      let layer = currentStage.findOne(".designLayer");
      if (layer.find(".design").length <= 0) {
        if(this.$sdkConfig.platformIsZWKJ){
          this.$store.commit("layout/changeLeftType", "gallery");
        } else {
          let changeType = 'product';
          if(this.$sdkConfig.gallery.isEnable) changeType = 'gallery';
          else if(this.$sdkConfig.background.isEnable) changeType = 'background';
          else if(this.$sdkConfig.text.isEnable) changeType = 'text';
          else if(this.$sdkConfig.upload) changeType = 'upload';
          this.$store.commit("layout/changeLeftType", changeType);
        }
      }
    },
    getCurMainImg({isColorChange = false} = {}) {
      if(!this.cloneStageDone) return
      if(this.productHasDetail && !this.isLargePreview) { //只有小图切颜色需要重新加载主图
        const imgDetailObj = this.productData.colors[this.productData.colors.findIndex(item => item.id == this.curColorId)].detail[0]
        if(imgDetailObj.parts[0].type == 2 || this.is3dModel) { //3d
          if(this.is3dModel) {
            for (let i = 0; i < keepThreeDApp.length; i++) {
              const app = keepThreeDApp[i];
              if(app.code == `${this.productData.code}-small-is3dModel`) {
                const src = app.drawApp.getImg(this.designContainerWidth)
                this.createMainImg({detailImagesObj: {image: '', canvasImgArr: [src], maskImg: ''}, isColorChange})
              }
            }
          } else {
            const drapAppIndex = keepThreeDApp.findIndex(item => item.code == `${this.productData.code}-mainImage-${this.curColorId}`)
            let faceListMap = {}
            for (let item of this.viewImgObj) {
              faceListMap[item.id] = item.viewDesignCanvas;
            }
            if(drapAppIndex != -1) {
              keepThreeDApp[drapAppIndex].drawApp.updateFaceListMap(faceListMap, (src) => {
                this.createMainImg({detailImagesObj: {image: imgDetailObj.image, canvasImgArr: [src], maskImg: imgDetailObj.texture}, isColorChange})
              })
            }
          }
        } else if(imgDetailObj.parts[0].type == 0) { //2d
          let detailImgs = this.detailImages[this.curColorId][0]
          this.createMainImg({detailImagesObj: {image: detailImgs.image, canvasImgArr: detailImgs.canvasImgArr, maskImg: detailImgs.maskImg}, isColorChange})
        }
      }
      if(!this.productHasDetail) {
        let detailImgs = this.detailImages[this.curColorId][0]
        this.createMainImg({detailImagesObj: {image: detailImgs.image, canvasImgArr: detailImgs.canvasImgArr, maskImg: detailImgs.maskImg}, isColorChange})
      }
    },
    initDesignLayer({ viewId }) {
      return new Promise(async (resolve, reject) => {
        let promises = [];
        let viewsData = this.productData.views;
        let currentView = viewsData.filter((item) => {
          return item.id == viewId;
        })[0] || this.overallDesignView;
        let ratio = currentView.print_area.view_width / this.designContainerWidth;
        let backRatio = currentView.print_area.view_width / 547.2;
        if (viewId == 1) {
          this.ratio = ratio;
        }
        this.viewImgObj[
          this.viewImgObj.findIndex((item) => {
            return item.id == viewId;
          })
        ].ratio = ratio;
        let currentStage = stageObj[`stage${viewId}`];
        let designLayer = new Konva.Layer({
          x: 0,
          y: 0,
          name: "designLayer",
        });
        designLayer.setAttrs({
          ratio: ratio,
          backRatio: backRatio,
          printAreaId: currentView.print_area.id,
          viewId,
          softSvg: currentView.print_area.soft_svg,
        });

        let designContainerGroup = new Konva.Group({
          x: currentView.print_area.offset_x / ratio,
          y: currentView.print_area.offset_y / ratio,
          width: currentView.print_area.width / ratio,
          height: currentView.print_area.height / ratio,
          name: "designContainerGroup",
        });
        let designContainer = new Konva.Rect({
          x: 0,
          y: 0,
          width: currentView.print_area.width / ratio,
          height: currentView.print_area.height / ratio,
          name: "print_area_border_outer",
          stroke: viewId==9999 ? 'transparent' : "rgb(66, 139, 202)",
          // strokeWidth: 1,
        });
        // designLayer.listening(false);
        designContainer.listening(false);
        // designContainerGroup.listening(false);
        currentStage.add(designLayer);
        designLayer.add(designContainerGroup);
        designContainerGroup.add(designContainer);
        // designLayer.getContext().miterLimit = 3;
        // if(viewId != 9999) { //整体设计不需要主图
          currentStage.add(new Konva.Layer({
            x: 0,
            y: 0,
            // listening: false,
            visible: false,
            name: 'mainImgLayer'
          }))
          currentStage.findOne('.mainImgLayer').add(new Konva.Rect({
            x: -2,
            y: -2,
            width: this.designContainerWidth + 4,
            height: this.designContainerWidth + 4,
            fill: 'white'
          }))
          currentStage.findOne('.mainImgLayer').on('mousedown', (e) => {
            const productViews = [this.overallDesignView, ...this.productData.views]
            productViews.forEach(view => {
              this.getCurStageLayer({viewId: view.id}).mainImgLayer.hide()
            })
            this.showTouchAnimation = false
            this.checkShowOverallDesignTip()
            this.autoChangeLeftType(currentStage);
          })
        // }
        designLayer.batchDraw();

        // if(currentView.print_area.soft_svg) {
        //   designLayer.clipFunc(function(ctx) {
        //     // ctx.path(currentView.print_area.soft_svg);
        //     ctx.arc(150, 120, 60, 0, Math.PI * 2, false);
        //   });
        // }

        let self = this;
        //设计说明辅助线
        if (currentView.point_svg) {
          promises.push(
            new Promise((resolve, reject) => {
              let img = new Image();
              img.setAttribute("crossOrigin", "anonymous");
              img.src = currentView.point_svg;
              img.onload = function () {
                var image = new Konva.Image({
                  x: 0,
                  y: 0,
                  image: img,
                  // width: currentStage.findOne(".layerBg").width(),
                  // height: currentStage.findOne(".layerBg").height(),
                  width: currentStage.findOne(".layerBgGroup")
                    ? currentStage.findOne(".layerBgGroup").width()
                    : 0,
                  height: currentStage.findOne(".layerBgGroup")
                    ? currentStage.findOne(".layerBgGroup").width()
                    : 0,
                  name: "auxiliaryPath printAreaClip",
                });
                image.listening(false);
                image.visible(self.isShowAuxiliaryLine);
                designLayer.add(image);
                designLayer.batchDraw();
                resolve();
              };
              img.onerror = function () {
                resolve();
              };

              // Konva.Image.fromURL(currentView.pointSvg, (image) => {
              //   // image is Konva.Image instance
              //   image.x(-designLayer.x())
              //   image.y(-designLayer.y())
              //   image.width(currentStage.findOne('.layerBg').width())
              //   image.height(currentStage.findOne('.layerBg').height())
              //   image.name('auxiliaryPath')
              //   image.listening(false)
              //   designLayer.add(image);
              //   designLayer.batchDraw();
              //   resolve()
              // });
            })
          );
        }
        //画布上只裁印刷区域
        if (
          currentView.pointout_print_areas &&
          currentView.pointout_print_areas.soft_svg
        ) {
          let clipPath = new Konva.Path({
            x: 0,
            y: 0,
            data: currentView.pointout_print_areas.soft_svg,
            stroke: "red",
            dash: [5, 5],
            scale: {
              x: 1 / ratio,
              y: 1 / ratio,
            },
            strokeScaleEnabled: false,
            name: "auxiliaryPath pointoutPrint-area",
          });
          clipPath.listening(false);
          clipPath.visible(self.isShowAuxiliaryLine);
          designLayer.add(clipPath);
          // designContainerGroup.clip({
          //   x: 0,
          //   y: 0,
          //   width: designContainerGroup.width(),
          //   height: designContainerGroup.height(),
          // });
        } 
        // else if (currentView.print_area && currentView.print_area.soft_svg) { //裁切线
        //   // designContainerGroup.clipFunc((ctx) => {
        //   //   ctx.save();
        //   //   ctx.translate(
        //   //     -designContainerGroup.x(),
        //   //     -designContainerGroup.y()
        //   //   );
        //   //   ctx.scale(1 / ratio, 1 / ratio);
        //   //   new Konva.Path({
        //   //     data: currentView.print_area.soft_svg,
        //   //     listening: false,
        //   //   })._sceneFunc(ctx);
        //   //   ctx.restore();
        //   // });
        // }else {
        //   designContainerGroup.clip({
        //     x: 0,
        //     y: 0,
        //     width: designContainerGroup.width(),
        //     height: designContainerGroup.height(),
        //   });
        // }
        designContainerGroup.clip({
          x: 0,
          y: 0,
          width: designContainerGroup.width(),
          height: designContainerGroup.height(),
        });
        if (!(currentView.print_area && currentView.print_area.soft_svg)) {
          //没有裁切线才展示底图和肌理图
          //纹理图
          let productTypeBaseMap = "",
            productViewImg = "";
          for (var k = 0; k < this.productData.colors.length; k++) {
            if (this.productData.colors[k].id == this.defaultValues.color) {
              for (
                var u = 0;
                u < this.productData.colors[k].views.length;
                u++
              ) {
                if (this.productData.colors[k].views[u].id == viewId) {
                  productViewImg = this.productData.colors[k].views[u].image;
                  productTypeBaseMap = this.productData.colors[k].views[u]
                    .texture;
                  break;
                }
              }
              break;
            }
          }
          promises.push(
            new Promise((resolve, reject) => {
              let img = new Image();
              img.setAttribute("crossOrigin", "anonymous");
              img.src = productViewImg;
              img.onload = function () {
                var image = new Konva.Image({
                  x: 0,
                  y: 0,
                  image: img,
                  // width: currentStage.findOne(".layerBg").width(),
                  // height: currentStage.findOne(".layerBg").height(),
                  width: currentStage.findOne(".layerBgGroup")
                    ? currentStage.findOne(".layerBgGroup").width()
                    : 0,
                  height: currentStage.findOne(".layerBgGroup")
                    ? currentStage.findOne(".layerBgGroup").width()
                    : 0,
                  name: "product_type_view",
                  listening: false,
                });
                designLayer.add(image);
                designLayer.batchDraw();
                resolve();
              };
              img.onerror = function () {
                resolve();
              };
            })
          );
          if (productTypeBaseMap != "") {
            promises.push(
              new Promise((resolve, reject) => {
                let img = new Image();
                img.setAttribute("crossOrigin", "anonymous");
                img.src = productTypeBaseMap;
                img.onload = function () {
                  var image = new Konva.Image({
                    x: 0,
                    y: 0,
                    image: img,
                    // width: currentStage.findOne(".layerBg").width(),
                    // height: currentStage.findOne(".layerBg").height(),
                    width: currentStage.findOne(".layerBgGroup")
                      ? currentStage.findOne(".layerBgGroup").width()
                      : 0,
                    height: currentStage.findOne(".layerBgGroup")
                      ? currentStage.findOne(".layerBgGroup").width()
                      : 0,
                    name: "product_type_BaseMap",
                    listening: false,
                  });
                  designLayer.add(image);
                  designLayer.batchDraw();
                  resolve();
                };
                img.onerror = function () {
                  resolve();
                };
              })
            );
          }
        }
        currentStage.hide(); //解决切换产品画布会先出现在左上角再回归到正常位置问题
        Promise.all(promises).finally(() => {
          currentStage.show();
          resolve({ viewId: viewId });
          this.baseMoveToTop({ currentStage });
          // let viewStage = currentStage.clone();

          // let viewStage = currentStage
          if (currentStage.findOne(".transparentbgRect")) {
            currentStage.findOne(".transparentbgRect").hide();
            currentStage.findOne(".print_area_border_outer").hide();
            if (currentStage.findOne(".product_type_view")) {
              currentStage.findOne(".product_type_view").hide();
            }
            if (currentStage.findOne(".product_type_BaseMap")) {
              currentStage.findOne(".product_type_BaseMap").hide();
            }
            this.$set(this.previewViewImage, viewId, {
              src: currentStage.findOne(".designLayer").toDataURL({
                quality: 1,
                x: currentStage.x(),
                y: currentStage.y(),
                width:
                  currentStage.findOne(".layerBgGroup").width() *
                  currentStage.findOne(".designLayer").scaleX(),
                height:
                  currentStage.findOne(".layerBgGroup").height() *
                  currentStage.findOne(".designLayer").scaleX(),
              }),
            });
            currentStage.findOne(".transparentbgRect").show();
            currentStage.findOne(".print_area_border_outer").show();
            if (currentStage.findOne(".product_type_view")) {
              currentStage.findOne(".product_type_view").show();
            }
            if (currentStage.findOne(".product_type_BaseMap")) {
              currentStage.findOne(".product_type_BaseMap").show();
            }
          }
        });
      });
    },
    reCalculateStage() {
      return ({
        init = false,
        stageWidth = 0,
        isReset = false,
        createLayerEnd = false,
        viewId = null,
      } = {}) => {
        let finallyWidth = 0;
        let viewImgLeft = 40;
        let viewImgWidth = document.querySelector(".view-img").clientWidth;
        let stageContainerHeight = document.getElementById("stageContainer")
          .clientHeight;
        if (isReset) {
          stageContainerHeight -= 80;
        }
        if (!stageWidth) {
          let width =
            document.getElementById("stageContainer").clientWidth -
            (viewImgLeft + viewImgWidth + 10) * 2; //10：设计面与画布的距离,width：画布宽度
          if (width <= stageContainerHeight) {
            this.stageContainerWidthEmpty = 0;
          } else {
            this.stageContainerWidthEmpty = width - stageContainerHeight;
          }
          finallyWidth = Math.min(width, stageContainerHeight);

          this.designContainerWidth = finallyWidth;
        } else {
          finallyWidth = stageWidth;
        }
        let setStageAttr = ({ viewId }) => {
          let curS = this.getCurStageLayer({ viewId });
          let currentStage = curS.stage;
          let layerBg = curS.layerBg;
          let layerBgGroup = curS.layerBgGroup;
          let designLayer = curS.layer;
          let mainImgLayer = curS.mainImgLayer
          let initLayerBgAttr = {
            x: currentStage.x(),
            y: currentStage.y(),
            width: layerBgGroup.width() * designLayer.scaleX(),
            height: layerBgGroup.height() * designLayer.scaleX(),
            scale: currentStage.scaleX(),
          };
          let canvasAttr = {
            scaleX:
              (finallyWidth / initLayerBgAttr.width) * designLayer.scaleX(),
            scaleY:
              (finallyWidth / initLayerBgAttr.height) * designLayer.scaleY(),
          };
          layerBg.setAttrs(canvasAttr);
          designLayer.setAttrs(canvasAttr);
          if(mainImgLayer) mainImgLayer.setAttrs(canvasAttr);
          if(this.m_clip_clipLayer) this.m_clip_clipLayer.setAttrs(canvasAttr);
          if (createLayerEnd) {
            currentStage.setAttrs({
              width: document.getElementById("designer").clientWidth,
              height: document.getElementById("designer").clientHeight,
            });

            currentStage.setAttrs({
              x:
                this.stageContainerWidthEmpty / 2 +
                viewImgLeft +
                viewImgWidth +
                10,
              y:
                stageContainerHeight / 2 -
                (layerBgGroup.width() * designLayer.scaleX()) / 2 +
                (isReset ? 40 : 0),
            });
            this.stageScale = parseInt(
              (layerBgGroup.width() * designLayer.scaleX() - 300) /
                this.stageScaleStep
            );
          } else {
            currentStage.setAttrs({
              x:
                initLayerBgAttr.x +
                (initLayerBgAttr.width -
                  layerBgGroup.width() * designLayer.scaleX()) /
                  2,
              y:
                initLayerBgAttr.y +
                (initLayerBgAttr.width -
                  layerBgGroup.width() * designLayer.scaleX()) /
                  2 +
                (isReset ? 40 : 0),
            });
          }
          currentStage.batchDraw();
        };
        if (createLayerEnd) {
          setStageAttr({ viewId });
        }
        if (init) {
          return;
        }
        if (this.productData.views) {
          const productViews = [this.overallDesignView, ...this.productData.views]
          for (let item of productViews) {
            setStageAttr({ viewId: item.id });
            let curS = this.getCurStageLayer({ viewId: item.id });
            let currentStage = curS.stage;
            if (item.id == this.viewId) {
              this.printAreaTip({ currentStage });
              if (this.curNode) {
                this.curNode.fire("click");
              }
              this.touchAnimationPos({ viewId: this.viewId });
              this.checkShowOverallDesignTip();
              this.drawGridLine();
            }
          }
          this.setViewLeftTop({ viewId: 9999 });
        }
      };
    },
    setViewLeftTop({ viewId }) {
      let curS = this.getCurStageLayer({ viewId });
      let stage = curS.stage;
      let layer = curS.layer;
      let layerBgGroup = curS.layerBgGroup;
      let viewImgWidth = document.querySelector(".view-img").clientWidth;
      // let bgColorSetWidth = document.querySelector(".bg-color-set").clientWidth;
      let bgColorSetWidth = 0;
      let stageContainerOffset = {
        // left: document.getElementById(`container${viewId}`).offsetLeft,
        // top: document.getElementById(`container${viewId}`).offsetTop,
        left: stage.x() - viewImgWidth - 10,
        top: stage.y(),
        right:
          document.getElementById("stageContainer").clientWidth -
          viewImgWidth -
          bgColorSetWidth -
          40 -
          10,
        bottom:
          document.getElementById("stageContainer").clientHeight -
          20 -
          viewImgWidth,
        width: document.getElementById("stageContainer").clientWidth,
        height: document.getElementById("stageContainer").clientHeight,
      };

      if (stageContainerOffset.left <= 40) {
        document.querySelector(".view-img").style.left = "40px";
      } else if (stageContainerOffset.left >= stageContainerOffset.right) {
        document.querySelector(".view-img").style.left =
          stageContainerOffset.right + "px";
      } else {
        document.querySelector(".view-img").style.left =
          stageContainerOffset.left + "px";
      }

      if (
        stage.x() <
        -(
          layerBgGroup.width() * layer.scaleX() -
          viewImgWidth -
          bgColorSetWidth -
          10
        )
      ) {
        // document.querySelector(".bg-color-set").style.left =
        //   40 + viewImgWidth + 10 + "px";
      } else if (
        stage.x() >
        stageContainerOffset.width -
          layerBgGroup.width() * layer.scaleX() -
          (40 + 10) * 2
      ) {
        // document.querySelector(".bg-color-set").style.left =
        //   stageContainerOffset.width - 40 - bgColorSetWidth + "px";
      } else {
        // document.querySelector(".bg-color-set").style.left =
        //   stage.x() + layerBgGroup.width() * layer.scaleX() + 10 + "px";
      }

      if (stageContainerOffset.top <= 40) {
        document.querySelector(".view-img").style.top = "40px";
        // document.querySelector(".bg-color-set").style.top = "40px";
      } else if (stageContainerOffset.top >= stageContainerOffset.bottom) {
        document.querySelector(".view-img").style.top =
          stageContainerOffset.bottom + "px";
        // document.querySelector(".bg-color-set").style.top =
        //   stageContainerOffset.bottom + "px";
      } else {
        document.querySelector(".view-img").style.top =
          stageContainerOffset.top + "px";
        // document.querySelector(".bg-color-set").style.top =
        //   stageContainerOffset.top + "px";
      }
    },
    stageScaleChange() {
      let stageWidth = this.stageScale * this.stageScaleStep + 300;
      this.reCalculateStage()({ stageWidth });
    },
    resetStageWidth() {
      // this.stageScale = 0
      let stageScaleBefore = this.stageScale;
      this.reCalculateStage()({
        isReset: true,
        createLayerEnd: true,
        viewId: this.viewId,
      });
      // 防止在画布拖动之后还原画布比例1:1时,画布无放大缩小情况下标尺错位
      if (this.stageScale == stageScaleBefore) {
        this.initRulerAll();
      }
      // let curS = this.getCurStageLayer({ viewId: this.viewId });
      // curS.stage.x(0);
      // curS.stage.y(0);
    },
    reduceStageWidth() {
      if (this.stageScale <= 0) return;
      this.stageScale -= 1;
      this.stageScaleChange();
    },
    addStageWidth() {
      if (this.stageScale >= 100) return;
      this.stageScale += 1;
      this.stageScaleChange();
    },
    setPrintAreaBorderOuterColor({ name, viewId }) {
      let curS = this.getCurStageLayer({ viewId });
      let printAreaBorderOuter = curS.layer.findOne(".print_area_border_outer"),
        // handleBoundary = $(".handle-boundary"), //transformer stroke
        pointoutPrintArea = curS.layer.findOne(".pointoutPrint-area");
      if (name == "白色" || name == "透明" || name == "white") {
        // printAreaBorderOuter.css({
        //   stroke: "#000",
        //   "stroke-width": this.handlesSizeAndCoordRatio.ratioX * 2,
        // });
        // handleBoundary.attr({
        //   stroke: "#000",
        //   "stroke-width": this.handlesSizeAndCoordRatio.ratioX * 2,
        // });
        // pointoutPrintArea.attr({
        //   "stroke-width": this.handlesSizeAndCoordRatio.ratioX * 2,
        // });
        printAreaBorderOuter.stroke("#000");
        if (pointoutPrintArea) pointoutPrintArea.stroke("#000");

        curS.stage.find("Transformer").borderStroke("#000");
        curS.stage.find("Transformer").borderStrokeWidth(1);
      } else {
        // printAreaBorderOuter.css({
        //   stroke: "#fff",
        //   "stroke-width": this.handlesSizeAndCoordRatio.ratioX * 2,
        // });
        // handleBoundary.attr({
        //   stroke: "#fff",
        //   "stroke-width": this.handlesSizeAndCoordRatio.ratioX * 2,
        // });
        // pointoutPrintArea.attr({
        //   "stroke-width": this.handlesSizeAndCoordRatio.ratioX * 2,
        // });
        printAreaBorderOuter.stroke("#fff");
        if (pointoutPrintArea) pointoutPrintArea.stroke("#fff");
        curS.stage.find("Transformer").borderStroke("#fff");
        curS.stage.find("Transformer").borderStrokeWidth(1);
      }

      if (this.productHasDetail) {
        // printAreaBorderOuter.css({
        //   stroke: "rgb(66, 139, 202)",
        //   "stroke-dasharray": "initial",
        // });
        printAreaBorderOuter.stroke("rgb(66, 139, 202)");
      } else {
        // printAreaBorderOuter.css({
        //   "stroke-dasharray": 2,
        // });
        printAreaBorderOuter.dash([2, 2]);
      }
      curS.layer.batchDraw();
    },
    pointoutPrintAreaShow({ viewId }) {
      let curS = this.getCurStageLayer({ viewId });
      let stage = curS.stage;
      let layer = curS.layer;
      let layerBgGroup = curS.layerBgGroup;
      if (layer.findOne(".pointoutPrint-area")) {
        let stageContainerOffset = {
          // left: document.getElementById(`container${viewId}`).offsetLeft,
          // top: document.getElementById(`container${viewId}`).offsetTop,
          left: stage.x(),
          top: stage.y(),
        };
        document.getElementById("cutSafeLine").style.display = "block";
        document.getElementById("cutSafeLine").style.left =
          stageContainerOffset.left +
          (layerBgGroup.width() * layer.scaleX()) / 2 -
          document.getElementById("cutSafeLine").clientWidth / 2 +
          "px";
        document.getElementById("cutSafeLine").style.top =
          stageContainerOffset.top -
          document.getElementById("cutSafeLine").clientHeight -
          20 +
          "px";
        setTimeout(() => {
          document.getElementById("cutSafeLine").style.display = "none";
        }, 3000);
      }
    },
    overallDesignAddImage({image, currentStage, isSetBg, viewId, imgSize}) {
      let designLayer = currentStage.findOne(".designLayer");
      let designRect = designLayer.findOne(".print_area_border_outer");
      let ratio = designLayer.getAttrs().ratio;
      const imageWidth = imgSize.width;
      const imageHeight = imgSize.height;
      if(viewId == 9999) {
        const maxWH = Math.max(image.width(), image.height()) * designLayer.scaleX()
        if(maxWH <= this.designContainerWidth) {
          image.setAttrs({
            scaleX: 1,
            scaleY: 1,
          })
          image.x(designRect.width() / 2);
          image.y(image.height() / 2);
          
        } else {
          const scale = this.designContainerWidth / maxWH
          image.setAttrs({
            scaleX: scale,
            scaleY: scale,
          })
          image.x(image.width() * image.scaleX() / 2);
          image.y(image.height() * image.scaleY() / 2);
          
        }
        this.overallDesignId = image._id
        image.fire('click')
      } else if(!isSetBg) {
        const stage = stageObj[`stage9999`]
        const layer = stage.findOne('.designLayer')
        let node = null
        const currentView = this.productData.views.find(item => {return item.id == viewId})
        layer.find('.design').forEach(item => {
          if(item.getAttrs().overallDesignId == this.overallDesignId) {
            node = item
          }
        })
        this.diffViewTheSameDesign({currentView, associateProductView: this.overallDesignView, currentRecordData: node.getAttrs(), associateNode: image})
      } else if(isSetBg) { //背景的逻辑优先，添加背景时大小是根据每个面印刷区域大小来定的
        image.setAttrs({
          scaleX: imageWidth / ratio / image.width(),
          scaleY: imageHeight / ratio / image.height(),
        })
        image.x(designRect.width() / 2);
        image.y(image.height() * image.scaleY() / 2);
        image.offsetX(image.width() / 2);
        image.offsetY(image.height() / 2);
      }
      image.draggable(true);
      image.name(`design designImg design${image._id} overallDesign`);
      image.offsetX(image.width() / 2);
      image.offsetY(image.height() / 2);
      image.setAttrs({
        overallDesignId: this.overallDesignId
      });
    },
    async amazonOrderParsing(allNodeAttrsArr) {
      // let currentStage = stageObj[`stage${this.productData.views[0].id}`];
      // let layerBgGroup = currentStage.findOne(".layerBgGroup");
      // let designLayer = currentStage.findOne(".designLayer");
      // let arr = await getElement(layerBgGroup.width(), designLayer, this.productData)
      for(let item of allNodeAttrsArr) {
        let viewId = item.viewId
        let type = item.type
        let storeParseStatus = item.storeParseStatus
        delete item.viewId
        delete item.type
        delete item.storeParseStatus
        if(type === 'image') {
          if(storeParseStatus == 1) {
            await this.addImage({
              imageData: item.imageData,
              viewId,
              isGalleryClick: false,
            }).then((data) => {
              let node = data.data;
              // this.saveImageData({ node, viewId: this.viewId, imageData: res.data });
              this.addHistory("添加图片", viewId, {
                nodeId: node.getAttrs().historyId,
              });
              node.fire("click")
              setTimeout(() => {
                eventBus.$emit("imgMaximizationChange", { data: {value: "imgFull"} })
              }, 500)
            })
          } else {
            await this.addImage({
              imageData: item.imageData,
              viewId,
              recordData: item
            })
          }
        } else if(type === 'text') {
          await this.addText({
            recordData: item,
            viewId,
            isGalleryClick: false,
          })
        }
      }
      this.productData.views.forEach(item => {
        this.cloneStage({ viewId: item.id, isInit: true });
      })
    },
    addImage({
      imageData,
      viewId,
      isGalleryClick = true,
      isProductChange = false,
      isSetBg = false,
      recordData = null,
      iscopy = false,
      isclip = false,
      isHistory = false,
      historyOptions = null,
      isUpdatePrice = true,
    }) {

      // addImage({isGalleryClick = false} = {}) {
      this.showTouchAnimation = false;
      this.checkShowOverallDesignTip()
      return new Promise((resolve, reject) => {
        // let viewId = this.viewId
        let currentStage = stageObj[`stage${viewId}`];
        let layerBgGroup = currentStage.findOne(".layerBgGroup");
        let designLayer = currentStage.findOne(".designLayer");
        let designRect = designLayer.findOne(".print_area_border_outer");
        let designContainerGroup = designLayer.findOne(".designContainerGroup");
        let ratio = designLayer.getAttrs().ratio;
        // let random = Math.ceil(Math.random()*25)
        // let imageData = this.designImgArr[random]
        let imageWidth = 0,
          imageHeight = 0;
        //图片 清晰度 饱和度  亮度 对比度 色温 色差
        let colorAjustmentData = {
          definition: 0,
          saturation: 0,
          brightness: 0,
          contrast: 0,
          colorTemp: 0,
          hue: 0,
        };
        // }
        let imgUrl = recordData&&recordData.flipImgUrl ? recordData.flipImgUrl : imageData.designImg3;
        // let imgUrl = "https://img8sandbox2.zhiwendiy.com/static/gallery/5NQLUP-1200-45562ea46d924ddde8db9f2261023.jpg"
        Konva.Image.fromURL(imgUrl, async (image) => {
          // image is Konva.Image instance
          let imgSize = imgSizeCalculate({ imageData, viewId, productData: this.productData });
          imageWidth = imgSize.width;
          imageHeight = imgSize.height;
          if(this.viewId == 9999 && !recordData) {
            this.overallDesignAddImage({image, currentStage, isSetBg, viewId, imgSize})
          } else {
            if (recordData) {
              delete recordData.image; //每次重新添加的图片是新建的，recordData里面可能包含image属性必须先去除
              //保存记录还原、切换产品保留图片状态
              image.setAttrs(recordData);
              image.setAttrs({
                widthMM: imageWidth,
                heightMM: imageHeight,
              });
              if(this.$sdkConfig.platform == 'xcxBackend' && imageData.idE){
                image.setAttrs({
                idE: imageData.idE,
              });
              }
              if(this.$sdkConfig.platform == 'xcxBackend' && imageData.channel_id){
                image.setAttrs({
                channel_id:imageData.channel_id
              });
              }
              image.name(`design designImg design${image._id}`);
              if(recordData.name.indexOf('template')>-1){
                image.addName('template')
              }
              if(recordData.name.indexOf('overallDesign')>-1){
                image.addName('overallDesign');
              }
              // recordData.initWidth = recordData.initWidth || 500
              let recordDataLayerScale = recordData.layerScale || 1;
              // let recordDataRatio = (this.productData.views[this.productData.views.findIndex(item => {return item.id == viewId})].width / (recordData.stageWidth / recordDataLayerScale))
              let scaleRatio =
                (layerBgGroup.width() * designLayer.scaleX()) /
                recordData.stageWidth;
              // image.scaleX((recordData.initWidth * image.scaleX() / image.width()) * (recordDataRatio / ratio))
              // image.scaleY((recordData.initHeight * image.scaleY() / image.height()) * (recordDataRatio / ratio))
              
              if(isProductChange) { //切换产品位置大小还原到初始
                image.scaleX(imageWidth / ratio / image.width());
                image.scaleY(imageHeight / ratio / image.height());
                image.x(designRect.width() / 2);
                image.y(image.height() * image.scaleY() / 2);
              }else { //保存记录还原 || 模板
                if(recordData.name.indexOf('template')>-1){
                  const canvasRatio = ((layerBgGroup.width()) / (recordData.stageWidth / recordDataLayerScale))
                  image.scaleX(recordData.scaleX * canvasRatio);
                  image.scaleY(recordData.scaleY * canvasRatio);
                } else {
                  let userScale = {
                    x: recordData.initScaleX ? recordData.scaleX / recordData.initScaleX : recordData.scaleX,
                    y: recordData.initScaleY ? recordData.scaleY / recordData.initScaleY : recordData.scaleY
                  }
                  image.scaleX(imageWidth / ratio / image.width() * userScale.x);
                  image.scaleY(imageHeight / ratio / image.height() * userScale.y);
                }
                image.x(layerBgGroup.width() / (recordData.stageWidth / recordDataLayerScale) * image.x())
                image.y(layerBgGroup.width() / (recordData.stageWidth / recordDataLayerScale) * image.y())
              }
              
              image.offsetX(image.width() / 2);
              image.offsetY(image.height() / 2);
              // image.setAttrs({
              //   initScaleX: imageWidth / ratio / image.width(),
              //   initScaleY: imageHeight / ratio / image.height(),
              // })
              
            } else {
  
              image.setAttrs({
                scaleX: imageWidth / ratio / image.width(),
                scaleY: imageHeight / ratio / image.height(),
              })
              image.x(designRect.width() / 2);
              image.y(image.height() * image.scaleY() / 2);
              image.offsetX(image.width() / 2);
              image.offsetY(image.height() / 2);
  
              // image.cache();
              // image.filters([Konva.Filters.Brighten]);
              // image.brightness(0.8);
  
              // image.pixelSize(10)
              image.name("design designImg");
              image.addName(`design${image._id}`);
  
              image.draggable(true);
              // this.setLayerImgList({
              //   viewId,
              //   node: image,
              //   isAdd: true,
              //   type: "image",
              // });
            }
          }
          image.setAttrs({
            stageWidth: layerBgGroup.width() * designLayer.scaleX(),
            layerScale: designLayer.scaleX(),
            initScaleX: imageWidth / ratio / image.width(),
            initScaleY: imageHeight / ratio / image.height(),
          })
          if (isSetBg) {
            image.addName("isBg");
            // if (bgApplyAllView) {
            //   image.addName("bgApplyAllView");
            // }
          }
          if(!recordData) {
            image.setAttrs({
              maxImgSize: imgSize.viewerSize, //保存最大尺寸 单位mm
              imageData: imageData,
              widthMM: imageWidth,
              heightMM: imageHeight,
              opacity: 1,
              tileType: "",
              spacingH: 0,
              spacingV: 0,
              flipImgUrl: imageData.designImg3,
              xFlip: false,
              yFlip: false,
              filterType: "",
              colorAjustmentData: colorAjustmentData,
              historyId:
                isHistory && historyOptions && historyOptions.id
                  ? historyOptions.id
                  : image._id,
            });
          }
          if(recordData && recordData.isclip){
            let clipData = recordData.clipData;
            clipData.imgAttrs.originImg = imgUrl;
            // 应用了滤镜的图片初始返回的大小跟滤镜接口返回的大小不一致，需要更新裁切信息
            clipData.imgAttrs.scaleX = clipData.imgAttrs.scaleX * clipData.imgAttrs.width / image.width()
            clipData.imgAttrs.scaleY = clipData.imgAttrs.scaleY * clipData.imgAttrs.height / image.height()
            clipData.imgAttrs.width = image.width();
            clipData.imgAttrs.height = image.height();
            let clipUrl = await this.m_clip_getClipImage(recordData.clipData);
            let [clipImage] = await loadImgs([clipUrl]);
            image.image(clipImage);
            image.setAttrs({
              offsetX: clipImage.width/2,
              offsetY: clipImage.height/2,
              clipData
            })
          }
          designContainerGroup.add(image);

          this.setLayerImgList({
            viewId,
            node: image,
            isAdd: true,
            // isUpdatePrice: false,
            type: "image",
          });
          this.ncYSRemind({ currentStage, node: image, init: true }).then(
            (data) => {
              this.setLayerImgList({
                viewId,
                node: image,
                isAdd: false,
                isVagueData: data.isVagueData,
                transformData: data.transformData,
                overspreadData: data.overspreadData,
                type: "image",
              });
            }
          );
          
          resolve({ data: image });
          this.baseMoveToTop({ currentStage });
          // this.initPreviewStage({ viewId });
          if (isGalleryClick && this.viewId != 9999 && !isSetBg) {
            this.addTransformer({
              // currentStage: currentStage,
              nodes: [image],
              viewId,
            });
          }
          if (!isSetBg && !recordData && isGalleryClick && viewId != 9999) {
            //不是设为背景&应用所有面&不是设计记录的初始化&是从图库点击
            // this.cloneStartTime = null;
            this.cloneStage({ viewId, cloneStartTime: true, cloneViewLength: this.viewId == 9999 ? this.productData.views.length : 0 });
          }
          designLayer.batchDraw();
          this.pointoutPrintAreaShow({ viewId });
          image.on("mousedown", (e) => {
            this.m_editText_handleOutsideClick('stopEdit')
            if(e.evt && e.evt.which == 3) return;
            if(this.m_clip_isCliping) return;
            if(this.m_ms_shiftKeyDown) return;
            if(this.$store.state.layout.showType=='group' && this.curNode.some(a=>a._id == image._id)) return;
            this.selectNode([image], viewId);
          });
          // 点击事件做节流处理，避免平铺图片点击事件冒泡执行两次
          image.on("click", throttle(e => {
            if(e.evt && e.evt.which == 3) return;
            if(this.m_clip_isCliping) return;
            if(this.$store.state.layout.showType=='group' && (e.evt && e.evt.which == 3)) return;
            this.selectNodeHandler({node: image, viewId});
          }, 300, true));
          image.on('dblclick', (e) => {
            if(image.getAttrs().isclip || this.m_clip_isCliping) {
              this.m_clip_implementClip({isClick: true});
            }
          })
        });
      });
    },
    async imgTransformEnd({viewId, node, type, isGroup=false}) {
      await this.drawRepeatType({
        viewId,
        type: node.getAttrs().tileType,
        node,
        spacingH: node.getAttrs().spacingH,
        spacingV: node.getAttrs().spacingV,
      }).then(() => {
        this.addHistory("图层变换", viewId, {
          nodeId: node.getAttrs().historyId,
        });
      });
      this.ncYSRemind({
        currentStage: stageObj[`stage${viewId}`],
        node,
        isGroup
      }).then((data) => {
        let {isVagueData, transformData, overspreadData} = data
        let designer_alarm_fuzzy_type = '';
        let designer_alarm_is_stretch = '否';
        let designer_alarm_is_covered = '否';

        if(isVagueData.type){
          if(isVagueData.type == 1){
            designer_alarm_fuzzy_type = '轻度'

          }else if(isVagueData.type == 2){
            designer_alarm_fuzzy_type = '中度'
          }
          else if(isVagueData.type == 3){
            designer_alarm_fuzzy_type = '严重'
          }
        }else{
          designer_alarm_fuzzy_type = ''
        }

        if(transformData.type){
          designer_alarm_is_stretch = '是'
        }

        if(overspreadData.text){
          designer_alarm_is_covered = '是'
        }

        if(!(designer_alarm_is_stretch == '否' && designer_alarm_is_covered == '否' && !designer_alarm_fuzzy_type)){
          this.$statisticalreport.designAlarm(designer_alarm_fuzzy_type,designer_alarm_is_stretch,designer_alarm_is_covered)
        }
        
        this.setLayerImgList({
          viewId,
          node,
          isAdd: false,
          isVagueData: data.isVagueData,
          transformData: data.transformData,
          overspreadData: data.overspreadData,
          type: "image",
        });
      });
      this.pointoutPrintAreaShow({ viewId });
    },
    imgDragEnd({viewId, node}) {
      this.drawRepeatType({
        viewId,
        type: node.getAttrs().tileType,
        node,
        spacingH: node.getAttrs().spacingH,
        spacingV: node.getAttrs().spacingV,
      }).then(() => {
        this.cloneStage({ viewId });
        this.addHistory("图层变换", viewId, {
          nodeId: node.getAttrs().historyId,
        });
      });
      // } else {
      //   this.cloneStage({ viewId });
      // }

      this.saveImageData({
        node,
        viewId,
        imageData: node.getAttrs().imageData,
      });
    },
    textTransformEnd({viewId, textGroup}) {
      // this.saveImageData({ node: textGroup, viewId });
      this.pointoutPrintAreaShow({ viewId });
      this.addHistory("图层变换", this.viewId, {
        nodeId: textGroup.getAttrs().historyId,
      });
    },
    async bgImgLinkageEnd({viewId, node, associateNode, type}) {
      if(viewId != this.viewId) {
        if(associateNode.hasName('isBg')) {
          let nodeAttrs = associateNode.getAttrs()
          const scaleRatioX = associateNode.scaleX() / nodeAttrs.changeStartScaleX
          const scaleRatioY = associateNode.scaleY() / nodeAttrs.changeStartScaleY
          associateNode.setAttrs({
            scaleX: node.scaleX() * scaleRatioX,
            scaleY: node.scaleY() * scaleRatioY,
            x: node.x() * scaleRatioX,
            y: node.y() * scaleRatioY,
            rotation: node.rotation()
          })
          await this.imgTransformEnd({viewId, node: associateNode, type})
        } else {
          this.diffViewTheSameDesign({currentView: this.productData.views.find(v => v.id == viewId), associateProductView: this.overallDesignView, currentRecordData: node.getAttrs(), associateNode, type: node.type})
          if(node.type == 'image') {
            await this.imgTransformEnd({viewId, node: associateNode, type})
          } else {
            this.textTransformEnd({viewId, textGroup: associateNode})
          }
        }
      } else {
        if(node.type == 'image') {
          await this.imgTransformEnd({viewId, node: associateNode, type})
        } else {
          this.textTransformEnd({viewId, textGroup: associateNode})
        }
      }
    },
    diffViewTheSameDesign({currentView, associateProductView, currentRecordData, associateNode = null, associateNodeAttrs = null, fromCustomProducts = false, type = "image"}) {
      associateProductView = transView(associateProductView);
      let recordDataLayerScale = currentRecordData.layerScale || 1;
      const currentProductView = currentView
      const associateViewWidth = associateProductView.print_area?.view_width || 0;
      const currentViewWidth = currentView.print_area?.view_width || 0;
      // this.currentProductView = this.productData.views.filter(item => {
      //   return item.id == viewId
      // })[0]
      // fromCustomProducts 从定制产品来，无需再算一遍canvasRatio，只需要算不同面印刷区域的差异，因为从定制产品来后面还需要执行addImage会计算canvasRatio
      const canvasRatio = fromCustomProducts ? 1 : (this.designContainerWidth / (currentRecordData.stageWidth))
      const associateProductViewRatio = (associateViewWidth / (currentRecordData.stageWidth / recordDataLayerScale))
      const twoViewOffsetXDistance = (associateProductView.print_area.offset_x - currentProductView.print_area.offset_x * (associateViewWidth / currentViewWidth))
      const twoViewOffsetYDistance = (associateProductView.print_area.offset_y - currentProductView.print_area.offset_y * (associateViewWidth / currentViewWidth))
      const attrs = {
        scaleX: type == 'text' ? currentRecordData.scaleX : currentRecordData.scaleX * canvasRatio,
        scaleY: type == 'text' ? currentRecordData.scaleY : currentRecordData.scaleY * canvasRatio,
        x: (currentRecordData.x + (twoViewOffsetXDistance / associateProductViewRatio)) * canvasRatio,
        y: (currentRecordData.y + (twoViewOffsetYDistance / associateProductViewRatio)) * canvasRatio,
        rotation: currentRecordData.rotation,
        spacingH: (currentViewWidth / associateViewWidth) * currentRecordData.spacingH,
        spacingV: (currentViewWidth / associateViewWidth) * currentRecordData.spacingV
      }
      if(associateNode) {
        associateNode.setAttrs({
          scaleX: attrs.scaleX,
          scaleY: attrs.scaleY,
          x: attrs.x,
          y: attrs.y,
          rotation: attrs.rotation
        })
      } else if(associateNodeAttrs) {
        associateNodeAttrs.scaleX = attrs.scaleX
        associateNodeAttrs.scaleY = attrs.scaleY
        associateNodeAttrs.x = attrs.x
        associateNodeAttrs.y = attrs.y
        associateNodeAttrs.rotation = attrs.rotation
        associateNodeAttrs.spacingH = attrs.spacingH
        associateNodeAttrs.spacingV = attrs.spacingV
      }
      // if(init) {
      //   associateNode.setAttrs({
      //     initScaleX: associateNode.scaleX(),
      //     initScaleY: associateNode.scaleY(),
      //   })
      // }
    },
    async _replaceImage({imageData, viewId, oldNode}){
      if(this.m_clip_isCliping) {
        await this.m_clip_implementClip()
      }
      return new Promise((resolve, reject) => {
        let currentStage = stageObj[`stage${viewId}`];
        let designLayer = currentStage.findOne(".designLayer");
        let ratio = designLayer.getAttrs().ratio;
        let imgSize = imgSizeCalculate({ imageData, viewId, productData: this.productData });
        let imageWidth = imgSize.width || 0;
        let imageHeight = imgSize.height || 0;
        let nodeAttrs = oldNode.getAttrs();
        let oldImgWidth  = oldNode.width() * oldNode.scaleX();
        let oldImgHeight = oldNode.height() * oldNode.scaleY();
        const isClip = nodeAttrs.isclip;
        if(isClip){
          const {imgAttrs, pathAttrs} = nodeAttrs.clipData;
          oldImgWidth = oldImgWidth * (imgAttrs.width * imgAttrs.scaleX) / (pathAttrs.width * pathAttrs.scaleX)
          oldImgHeight = oldImgHeight * (imgAttrs.height * imgAttrs.scaleY) / (pathAttrs.height * pathAttrs.scaleY)
        }
        let oldMaxLength = oldImgWidth > oldImgHeight ? oldImgWidth : oldImgHeight;
        let newMaxLength = imageWidth > imageHeight ? imageWidth : imageHeight;
        let replaceScale = oldMaxLength / (newMaxLength/ratio);
        let newImage = new Image();
        newImage.src = imageData.designImg3;
        newImage.crossOrigin = 'Anonymous';
        let _this = this;
        newImage.onload = async ()=> {
          oldNode.image(newImage);
          oldNode.setAttrs({
            scaleX: replaceScale * (imageWidth / ratio / newImage.width),
            scaleY: replaceScale * (imageHeight / ratio / newImage.height),
            offsetX: newImage.width / 2,
            offsetY: newImage.height / 2,
            initScaleX: imageWidth / ratio / newImage.width,
            initScaleY: imageHeight / ratio / newImage.height,
            widthMM: imageWidth,
            heightMM: imageHeight,
            maxImgSize: imgSize.viewerSize,
            imageData: imageData,
            flipImgUrl: imageData.designImg3,
            isclip: false, // 替换图片先去除裁剪属性，后面再应用
            // 如果旧图是张渲染图片，则去除渲染效果
            // filterType: '',
            // rendercode: '',
            // render_id: ''
          });
          // 是否背景图，如果是背景图片则铺满
          // if(nodeAttrs.name.indexOf('isBg') > -1){
          //   await _this.imgMaximization({viewId, flag: 'imgFull', node: oldNode});
          // }
          if(nodeAttrs.xFlip){
            await _this.flipImage({
              data: { data: "leftRightMirror" },
              node: oldNode,
              viewId,
              isReduction: true,
              isAddHistory: false,
            });
            oldNode.setAttr('xFlip', true);
          }
          if(nodeAttrs.yFlip){
            await _this.flipImage({
              data: { data: "upDownMirror" },
              node: oldNode,
              viewId: viewId,
              isReduction: true,
              isAddHistory: false,
            });
            oldNode.setAttr('yFlip', true);
          }
          // 保持原图的滤镜效果
          if(nodeAttrs.render_id){
            let filterRet = await changeImageFilter({
              node: oldNode,
              render_code: nodeAttrs.rendercode,
              params: {
                gallery_id: imageData.code,
                xFlip: nodeAttrs.xFlip ? 1: 0,
                yFlip: nodeAttrs.yFlip ? 1 : 0
              }
            });
            if(filterRet && filterRet.data && filterRet.data.url2){
              await _this.replaceFilter({
                url: filterRet.data.url2,
                viewId,
                node: oldNode,
                isReplace: true
              });
            }
          }
          if(isClip){
            let clipData = nodeAttrs.clipData;
            const changeScaleX = clipData.imgAttrs.width / oldNode.width();
            const changeScaleY = clipData.imgAttrs.height / oldNode.height();
            clipData.imgAttrs.originImg = oldNode.getAttrs().flipImgUrl;
            clipData.imgAttrs.width = oldNode.width();
            clipData.imgAttrs.height = oldNode.height();
            clipData.imgAttrs.scaleX = clipData.imgAttrs.scaleX * changeScaleX;
            clipData.imgAttrs.scaleY = clipData.imgAttrs.scaleY * changeScaleY;
            let url = await this.m_clip_getClipImage(clipData)
            const [clipImage] = await loadImgs([url])
            oldNode.image(clipImage);
            oldNode.setAttrs({
              offsetX: clipImage.width / 2,
              offsetY: clipImage.height / 2,
              isclip: true,
              clipData
            });
          }
          if(viewId == _this.viewId){
            _this.curNode.fire('click');
          }
          await this.drawRepeatType({
            viewId,
            type: oldNode.getAttrs().tileType,
            node: oldNode,
            spacingH: oldNode.getAttrs().spacingH,
            spacingV: oldNode.getAttrs().spacingV,
          });
          _this.addHistory("替换图片", viewId, {
            nodeId: oldNode.getAttrs().historyId,
          });
          designLayer.batchDraw()
          _this.cloneStage({ viewId});
          _this.canvasQuality({ viewId });
          _this.pointoutPrintAreaShow({ viewId });
          resolve();
        };
      });
    },
    async replaceImage({imageData, viewId}){
      // 当前替换的图片是否是应用所有面的背景图，如果是则替换所有面的图片，否则只替换当前面图片
      if(viewId == 9999){
        let productViews = JSON.parse(JSON.stringify(this.productData.views))
        productViews.unshift(this.overallDesignView)
        for(let view of productViews){
          let viewDesignLayer = stageObj[`stage${view.id}`].findOne('.designLayer');
          let bgnode = null
          viewDesignLayer.find('.design').forEach(item => {
            if(item.getAttrs().overallDesignId == this.curNode.getAttrs().overallDesignId) {
              bgnode = item
            }
          })
          // let bgnode = this.curNode.hasName('isBg') ? viewDesignLayer.findOne('.isBg') : overallDesignImage;
          if(bgnode){
            this._replaceImage({imageData, viewId: view.id, oldNode: bgnode});
          }
        }
      } else {
        this._replaceImage({imageData, viewId, oldNode: this.curNode});
      }
    },
    addText({
      textNode = null,
      viewId,
      isGalleryClick = true,
      recordData = null,
      isHistory = false,
      historyOptions = null,
    }) {
      return new Promise(async (resolve, reject) => {
        let font = {}
        if((textNode?.fontUrl) ||
        (recordData?.fontUrl)) { //亚马逊订单使用设计器没有的字体，后端传字体包过来前端做兼容
          const data = textNode || recordData
          font = {
            value: data.proFontFamily,
            src: '',
            weight: 'normal', 
            style: 'normal',
            bold: false
          }
          if(data.fontUrl.includes('woff')) {
            font.src = 'url("' +
                        data.fontUrl +
                        '") format("woff"),'
          } else if(data.fontUrl.includes('ttf')) {
            font.src += 'url("' +
                          data.fontUrl +
                          '") format("truetype")'
          }
          await amazonLoadFont(
            data.proFontFamily,
            font,
            true
          )
        } else {
          /*等待字体加载完成*/
          await loadFont(
            recordData
              ? recordData.proFontFamily
              : textNode
              ? textNode.proFontFamily
              : "Academic M54_1_1_Academic M54",
            true
          );
        }
        this.showTouchAnimation = false;
        this.checkShowOverallDesignTip()
        let curS = this.getCurStageLayer({ viewId });
        let currentStage = curS.stage;
        let layerBgGroup = curS.layerBgGroup;
        let layer = curS.layer;
        let designRect = curS.designRect;
        let designContainerGroup = curS.designContainerGroup;
        let text = null;
        let textGroup = null,
          textRect = null;
        if(recordData) {
          for(let item of this.textFamilyOptions) {
            if(item.value === recordData.proFontFamily &&
            !item.bold &&
            recordData.proFontStyle.indexOf('bold') > -1) {
              //后端合图不支持加粗
              //去除加粗和首尾空格
              recordData.proFontStyle = recordData.proFontStyle.replace(/bold/g, '').replace(/(^\s*)|(\s*$)/g,'')
            }
          }
        }
        if(this.viewId == 9999 && !recordData) {
          const initTextObj = this.initAddText({text, textRect, textGroup, textNode, designRect, isHistory, historyOptions})
          text = initTextObj.text
          textRect = initTextObj.textRect
          textGroup = initTextObj.textGroup
          if(viewId == 9999) {
            this.overallDesignId = textGroup._id
          } else {
            const stage = stageObj[`stage9999`]
            const layer = stage.findOne('.designLayer')
            const currentView = this.productData.views.find(item => {return item.id == viewId})
            layer.find('.design').forEach(item => {
              if(item.getAttrs().overallDesignId == this.overallDesignId) {
                this.diffViewTheSameDesign({currentView, associateProductView: this.overallDesignView, currentRecordData: item.getAttrs(), associateNode: textGroup, type: "text"})
              }
            })
          }
          textGroup.addName('overallDesign')
          textGroup.setAttrs({
            overallDesignId: this.overallDesignId
          });
          if(this.$sdkConfig.platform == 'xcxBackend' && recordData && recordData.idE){
              textGroup.setAttrs({
                idE: recordData.idE,
              });
          }
          if(this.$sdkConfig.platform == 'xcxBackend' && recordData && recordData.channel_id){
              textGroup.setAttrs({
                channel_id: recordData.channel_id
              });
          }
        } else {
          if (recordData) {
            if (!recordData.scaleX) {
              recordData.scaleX = 1;
              recordData.scaleY = 1;
            }
            text = new Konva.Text({
              text: recordData.designText,
              fontSize: recordData.proFontSize, //画布缩放，保持文字在屏幕上大小
              // fontSize: (24 * (currentStage.width() / 547.2)) / layer.scaleX(),
              fill: recordData.textColor,
              wrap: "char",
              fontFamily: recordData.proFontFamily,
              fontStyle: recordData.proFontStyle,
              textDecoration: recordData.proTextDecoration,
              strokeWidth: recordData.proStrokeWidth,
              // strokeWidth:
              //   recordData.proStrokeWidth *
              //   (currentStage.width() / recordData.stageWidth),
              stroke: recordData.proStroke,
              verticalAlign: "bottom",
              align: recordData.textAlign
            });
            textGroup = new Konva.Label();
            // delete recordData.offsetX
            // delete recordData.offsetY
           
            // let recordDataLayerScale = recordData.layerScale >= 1 ? recordData.layerScale : -recordData.layerScale
            // let layerScale = currentStage.width() / recordData.stageWidth >= 1 ? currentStage.width() / recordData.stageWidth : -currentStage.width() / recordData.stageWidth
  
            let recordDataLayerScale = recordData.layerScale || 1;
  
            let scaleRatio =
              (layerBgGroup.width() * layer.scaleX()) / recordData.stageWidth;
            // if (recordData.scaleX < 0) {
            //   recordData.scaleX = -(
            //     Math.abs(recordData.scaleX) *
            //     scaleRatio *
            //     recordDataLayerScale
            //   );
            // } else {
            recordData.scaleX =
              (recordData.scaleX * scaleRatio * recordDataLayerScale) /
              layer.scaleX();
            // }
            // if (recordData.scaleY < 0) {
            //   recordData.scaleY = -(
            //     Math.abs(recordData.scaleY) *
            //     scaleRatio *
            //     recordDataLayerScale
            //   );
            // } else {
            recordData.scaleY =
              (recordData.scaleY * scaleRatio * recordDataLayerScale) /
              layer.scaleX();
            // }
            textGroup.setAttrs(recordData);
            textGroup.name(`design designText design${textGroup._id}`);
            if(recordData.name.indexOf('template') > -1){
              textGroup.addName('template')
            }
            if(recordData.name.indexOf('overallDesign') > -1){
              textGroup.addName('overallDesign');
            }
            textGroup.label = ClearBr({
              str: text.text(),
              type: 3,
            });
            textGroup.strokeValue = recordData.strokeValue;
            // textGroup.canvasFontSize = recordData.canvasFontSize;
            // textGroup.width(
            //   (currentStage.width() / recordData.stageWidth) * textGroup.width() * recordData.scaleX
            // );
            // textGroup.height(
            //   (currentStage.width() / recordData.stageWidth) * textGroup.height() * recordData.scaleY
            // );
            // textGroup.scaleX(textGroup.scaleX());
            // textGroup.scaleY(textGroup.scaleY());
            textGroup.x(
              (scaleRatio * recordDataLayerScale * textGroup.x()) / layer.scaleX()
            );
            textGroup.y(
              (scaleRatio * recordDataLayerScale * textGroup.y()) / layer.scaleX()
            );
            // textGroup.offsetX((textGroup.width() * scaleRatio * recordDataLayerScale) / 2);
            // textGroup.offsetY((textGroup.height() * scaleRatio * recordDataLayerScale) / 2);
            // textGroup.offsetX((textGroup.width() * Math.abs(textGroup.scaleX())) / 2);
            // textGroup.offsetY((textGroup.height() * Math.abs(textGroup.scaleY())) / 2);
            // textGroup.offsetX(textGroup.width() * Math.abs(textGroup.scaleX()) * (currentStage.width() / recordData.stageWidth) / 2);
            // textGroup.offsetY(textGroup.height() * Math.abs(textGroup.scaleY()) * (currentStage.width() / recordData.stageWidth) / 2);
            // textGroup.addName(`design${textGroup._id}`);
            textRect = new Konva.Rect({
              width: text.width(),
              height: text.height(),
              listening: false,
              strokeScaleEnabled: false,
              fill: recordData.designFill,
            });
            textGroup.add(textRect);
            textGroup.add(text);
          } else {
            const initTextObj = this.initAddText({text, textRect, textGroup, textNode, designRect, isHistory, historyOptions})
            text = initTextObj.text
            textRect = initTextObj.textRect
            textGroup = initTextObj.textGroup
          }
        }
        textGroup.setAttrs({
          stageWidth: layerBgGroup.width() * layer.scaleX(),
          layerScale: layer.scaleX()
        })
        designContainerGroup.add(textGroup);

        // layer.add(textGroup);

        // this.curNode = textGroup
        if (!recordData && isGalleryClick) {
          //不是设为背景&应用所有面&不是设计记录的初始化&是点击添加文字
          // this.cloneStartTime = null;
          this.cloneStage({ viewId, cloneStartTime: true, cloneViewLength: this.viewId == 9999 ? this.productData.views.length : 0 });
        }
        this.baseMoveToTop({ currentStage });
        if (isGalleryClick && this.viewId != 9999) {
          this.addTransformer({ currentStage, nodes: [textGroup], viewId });
        }
        layer.batchDraw();
        // this.initPreviewStage({ viewId });

        this.setLayerImgList({
          viewId,
          node: textGroup,
          isAdd: true,
          type: "text",
        });
        resolve({ data: textGroup });
        this.pointoutPrintAreaShow({ viewId: this.viewId });
        document.querySelector(".ncRemind").style.display = "none";
        currentStage.find('.overspreadPath')?.destroy();

        textGroup.on("mousedown", (e) => {
          this.m_editText_handleOutsideClick('stopEdit')
          if(e.evt && e.evt.which == 3) return;
          if(this.m_ms_shiftKeyDown) return;
          if(this.$store.state.layout.showType=='group' && this.curNode.some(a=>a._id == textGroup._id)) return;
          this.selectNode([textGroup], viewId);
        });
        textGroup.on("click", throttle((e) => {
          if(e.evt && e.evt.which == 3) return;
          if(this.$store.state.layout.showType=='group' && (e.evt && e.evt.which == 3)) return;
          this.selectNodeHandler({node: textGroup, viewId});
        }, 300, true));

        //编辑文字
        text.on("dblclick", (e) => {
          this.m_editText_textDblClick(textGroup)
        });
      });
    },

    initAddText({text, textRect, textGroup, textNode = null, designRect, isHistory = false, historyOptions = null} = {}) {
      text = new Konva.Text({
        text: textNode ? textNode.designText : "双击编辑文字",
        // fontSize: (24 * (currentStage.width() / 547.2)) / layer.scaleX(), //画布缩放，保持文字在屏幕上大小
        fontSize: 24, //画布缩放，保持文字在屏幕上大小
        wrap: "char",
        // lineHeight: 1.2,
        fill: textNode ? textNode.textColor : "#000000",
        fontFamily: textNode
          ? textNode.proFontFamily
          : "Academic M54_1_1_Academic M54",
        fontStyle: textNode ? textNode.proFontStyle : "",
        textDecoration: textNode ? textNode.proTextDecoration : "",
        strokeWidth: textNode
          ? textNode.oldData
            ? (textNode.strokeValue * 1) / (100 / 24)
            : textNode.proStrokeWidth
          : 0,
        // strokeWidth: textNode
        //   ? textNode.proStrokeWidth *
        //     (currentStage.width() / textNode.stageWidth)
        //   : 0,
        stroke: textNode ? textNode.proStroke : "",
        verticalAlign: "bottom",
        align: textNode ? textNode.textAlign : "",
      });
      textGroup = new Konva.Label({
        width: text.width(),
        height: text.height(),
        x: designRect.width() / 2,
        y: designRect.height() / 2,
        scaleX: 1,
        scaleY: 1,
        offsetX: text.width() / 2,
        offsetY: text.height() / 2,
        draggable: true,
        name: `design designText`,
      });
      textGroup.setAttr(
        "historyId",
        isHistory && historyOptions && historyOptions.id
          ? historyOptions.id
          : textGroup._id
      );
      textGroup.addName(`design${textGroup._id}`);
      textGroup.label = text.text();
      textGroup.strokeValue = textNode ? textNode.strokeValue : 1;
      textRect = new Konva.Rect({
        width: text.width(),
        height: text.height(),
        listening: false,
        strokeScaleEnabled: false,
        fill: textNode ? textNode.designFill : "",
      });
      textGroup.add(textRect);
      textGroup.add(text);
      return {text, textRect, textGroup}
    },
    cancelEditText() {
      this.editTextPop = false;
    },
    confirmEditText() {
      this.editTextPop = false;
      let textarea = document.getElementById('editingText')
      if(!textarea) return
      let textareaBox = {x: textarea.offsetLeft, y: textarea.offsetTop}
      let {stage} = this.getCurStageLayer({ viewId: this.viewId});
      var stageBox = stage.container().getBoundingClientRect();
      let textString = textarea.childNodes[0].innerText
      textarea.parentNode.removeChild(textarea);
      window.removeEventListener('click', this.m_editText_handleOutsideClick);
      const designObj = linkageDesign(this.productData, this.viewId, this.curNode, this.curNode.isLock)
      for(let _viewId in designObj) {
        for(let item of designObj[_viewId]) {
          // designArr.forEach(item => {
            let text = item.node.findOne("Text");
            let txt = textString.trim();
            text.text(txt ? txt : '双击编辑文字');
            let {layer, designContainerGroup} = this.getCurStageLayer({ viewId: item.id });
            let designContainerGroupBox = designContainerGroup.absolutePosition()
            let cXY = getNodeCenterXY({
              node: item.node,
              posi: { x: textareaBox.x - stageBox.x - designContainerGroupBox.x, y: textareaBox.y - stageBox.y - designContainerGroupBox.y },
            });
            item.node.x(cXY.x / layer.scaleX());
            item.node.y(cXY.y / layer.scaleX());
            item.node.width(text.width());
            item.node.height(text.height());
            item.node.offsetX(text.width() / 2);
            item.node.offsetY(text.height() / 2);
            item.node.findOne("Rect").width(text.width());
            item.node.findOne("Rect").height(text.height());
            item.node.show()
            item.node.fire("click");
            // layer.batchDraw();
            item.node.getLayer().batchDraw();
            item.node.label = ClearBr({
              str: item.node.findOne("Text").text(),
              type: 3,
            });
            // this.setLayerImgList({
            //   viewId: this.viewId,
            //   node: this.curNode,
            //   isAdd: false,
            //   type: "text",
            // });
            this.cloneStage({viewId: _viewId});
            this.addHistory("文字工具", item.id, {
              nodeId: item.node.getAttrs().historyId,
            });
          // })
        }
      }
    },
    saveImageData({ viewId, node, imageData = {}, realTime = false}) {
      let flag = false;
      if (!this.saveImageDataStartTime) {
        flag = true;
        this.saveImageDataStartTime = new Date().getTime();
      }
      let endTime = new Date().getTime();
      if (endTime - this.saveImageDataStartTime > 100) {
        flag = true;
        this.saveImageDataStartTime = endTime;
      }
      if (!flag) {
        if (this.saveImageDataValid) {
          clearTimeout(this.saveImageDataValid);
        }
        this.saveImageDataValid = setTimeout(() => {
          this.saveImageData({
            viewId: viewId,
            node: node,
            imageData: imageData,
            realTime: realTime,
          });
        }, 100);
        return;
      }
      let curS = this.getCurStageLayer({ viewId });
      let layer = curS.layer;
      const type = Array.isArray(node) ? 'group' : (node.hasName('designImg') ? 'image' : 'text');
      this.$set(this.designTransformData, "type", type);
      if(type == 'group'){
        const groupId = node[0].getAttrs().groupId;
        this.$set(this.designTransformData, "node", {_id: groupId});
        this.$set(this.designTransformData, "groupId", groupId);
        this.$set(this.designTransformData, "subnodes", node);
      } else {
        this.$set(this.designTransformData, "node", node);
        let nodeXY = getAbsoluteNodeTopLeftXY({ node, layer });
        this.$set(this.designTransformData, "data", Object.assign(imageData, {}));
        this.$set(this.designTransformData.data, "opacity", parseInt(node.opacity() * 100));
        this.$set(this.designTransformData.data, "topLeftX", nodeXY.x);
        this.$set(this.designTransformData.data, "topLeftY", nodeXY.y);
        this.$set(this.designTransformData.data, "scaleWidth", Math.abs(node.width() * node.scaleX()));
        this.$set(this.designTransformData.data, "scaleHeight", Math.abs(node.height() * node.scaleY()));
        this.$set(this.designTransformData.data, "nodeRotation", Math.round(node.rotation()));
      }
      // imageData.topLeftX = nodeXY.x
      // imageData.topLeftY = nodeXY.y
      // imageData.scaleWidth = Math.abs(node.width() * node.scaleX())
      // imageData.scaleHeight = Math.abs(node.height() * node.scaleY())
      // this.$store.dispatch("gallery/addGallaryData", {
      //   node: node,
      //   data: Object.assign(imageData, data)
      // });

      // this.$store.commit("gallery/changeCurGalleryData", {
      //   node: cnode,
      //   data: Object.assign(imageData, this.designTransformData)
      // });
      this.$store.commit(
        "gallery/changeCurGalleryDataRealTime",
        this.designTransformData.data
      );
      if (realTime) {
        return;
      }
      this.$store.commit(
        "gallery/changeCurGalleryData",
        this.designTransformData
      );
    },
    baseMoveToTop({ currentStage }) {
      if (currentStage.findOne(".print_area_border_outer")) {
        currentStage.findOne(".print_area_border_outer").moveToTop();
      }
      if (currentStage.findOne(".designContainerGroup")) {
        currentStage.findOne(".designContainerGroup").moveToTop();
      }

      if (currentStage.findOne(".product_type_BaseMap")) {
        currentStage.findOne(".product_type_BaseMap").moveToTop();
      }
      if (currentStage.findOne(".clip-path")) {
        currentStage.findOne(".clip-path").moveToTop();
      }
      if (currentStage.findOne(".pointoutPrint-area")) {
        //全幅安全线
        currentStage.findOne(".pointoutPrint-area").moveToTop();
      }
      if (currentStage.findOne(".printAreaClip")) {
        //辅助线在全幅安全线之上
        currentStage.findOne(".printAreaClip").moveToTop();
      }
    },
    initTransformerEvent(tr, nodes, type){
      const viewId = this.viewId;
      const {stage, layer} = this.getCurStageLayer({viewId});
      tr.on('dragstart', e=>{
        if(type == 'image') bgImgLinkageStart(this.productData);
        document.getElementById("designMenu").style.display = "none";
      })
      tr.on('transformstart', e=>{
        if(type == 'image') bgImgLinkageStart(this.productData);
        document.getElementById("designMenu").style.display = "none";
      })
      tr.on('dragmove', e=>{
        this.anchorGroupFourceupdate();
        this.isShowRuler && this.nodeSnapping();
        this.isOuterPrintArea();
        if(type=='image'){
          this.drawSizeTip({ node: nodes[0] });
          this.ncYSRemind({ currentStage: stage, node: nodes[0] });
        }
        if(type == 'text'){
          this.drawSizeTip({ node: nodes[0] });
        }
        if(type == 'group'){
          [].forEach.call(nodes, node => {
            if(node.type == 'image'){
              this.ncYSRemind({currentStage: stage, node, isGroup: true});
            }
          })
        }
      })
      tr.on('transform', e=>{
        this.anchorGroupFourceupdate();
        this.isOuterPrintArea();
        if(type == 'image'){
          this.drawSizeTip({ node: nodes[0] });
          this.ncYSRemind({ currentStage: stage, node: nodes[0] });
        }
        if(type == 'text'){
          this.drawSizeTip({ node: nodes[0] });
        }
        if(type == 'group'){
          [].forEach.call(nodes, node => {
            if(node.type == 'image'){
              this.ncYSRemind({currentStage: stage, node, isGroup: true});
            }
          })
        }
      })
      tr.on('dragend', async (e)=>{
        this.removeSnapGuideLine();
        this.saveImageData({
          node: this.curNode,
          viewId, 
          imageData: type=='image' ? this.curNode.getAttrs().imageData : {}
        });
        // if(type == 'image'){
          // this.imgTransformEnd({node: this.curNode, viewId, type: 'drag'})
          // this.bgImgLinkageEnd({node: this.curNode, viewId, type: 'drag'})
        // } 
        // if(type == 'text'){
          // this.textTransformEnd({viewId, textGroup: this.curNode})
          // this.bgImgLinkageEnd({node: this.curNode, viewId, type: 'drag'})
        // }
        // if(type == 'group'){
          const designObj = linkageDesign(this.productData, this.viewId, this.curNode)
          let overallDesignArr = designObj[9999]
          let currentViewDesignArr = designObj[this.viewId]
          for(let _viewId in designObj) {
            for(let item of designObj[_viewId]) {
              let curNode = item.node
              if(overallDesignArr) {
                curNode = overallDesignArr.find(a => a.node.getAttrs().overallDesignId === item.node.getAttrs().overallDesignId).node
              } else if(item.node.hasName('isBg')) {
                curNode = currentViewDesignArr.find(a => a.node.hasName('isBg')).node
              }
              await this.bgImgLinkageEnd({viewId: _viewId, node: curNode, associateNode: item.node, type: 'drag'});
            }
            this.cloneStage({viewId: _viewId})
          }
          // [].forEach.call(nodes, node => {
            // if(node.type == 'image'){
            //   this.imgTransformEnd({viewId, node, type: 'drag', isGroup: true});
            // } else {
            //   this.textTransformEnd({ viewId, textGroup: node, isGroup: true });
            // }
          // })
        // }
      })
      tr.on('transformend', async (e)=>{
        this.saveImageData({
          node: this.curNode,
          viewId, 
          imageData: type=='image' ? this.curNode.getAttrs().imageData : {}
        });
        const designObj = linkageDesign(this.productData, this.viewId, this.curNode)
        let overallDesignArr = designObj[9999]
        let currentViewDesignArr = designObj[this.viewId]
        for(let _viewId in designObj) {
          for(let item of designObj[_viewId]) {
            let curNode = item.node
            if(overallDesignArr) {
              curNode = overallDesignArr.find(a => a.node.getAttrs().overallDesignId === item.node.getAttrs().overallDesignId).node
            } else if(item.node.hasName('isBg')) {
              curNode = currentViewDesignArr.find(a => a.node.hasName('isBg')).node
            }
            await this.bgImgLinkageEnd({viewId: _viewId, node: curNode, associateNode: item.node, type: 'transform'});
          }
          this.cloneStage({viewId: _viewId})
        }
        // if(type == 'image'){
        //   this.imgTransformEnd({node: this.curNode, viewId, type: 'transform'});
        //   this.bgImgLinkageEnd({node: this.curNode, viewId, type: 'transform'});
        // } 
        // if(type == 'text'){
        //   this.textTransformEnd({viewId, textGroup: this.curNode});
        //   this.bgImgLinkageEnd({node: this.curNode, viewId, type: 'transform'})
        //   // this.curNode.fire('click')
        // }
        // if(type == 'group'){
        //   [].forEach.call(nodes, node => { 
        //     if(node.type == 'image'){
        //       this.imgTransformEnd({viewId, node, type: 'drag', isGroup: true});
        //     } else {
        //       this.textTransformEnd({ viewId, textGroup: node, isGroup: true });
        //     }
        //     this.bgImgLinkageEnd({viewId, node, type: 'drag', isGroup: true});
        //   })
        // }
      })
      this.anchorDelete.off('click');
      this.anchorDelete.on('click', e => {
        this.deleteNode({node: this.curNode, viewId})
      });
      this.anchorDelete.off('mouseenter');
      this.anchorDelete.on('mouseenter', e => {
        if(type != 'image') return;
        if(this.curNode.getAttrs().isclip){
          this.designMenuData = [
            {
              name: "删除裁切蒙版",
              type: "deleteClip",
              id: "deleteClip",
              nodeType: "image",
            },
            {
              name: "删除图片",
              type: "delete",
              id: "delete",
              nodeType: "image",
              shortcut: this.getShortcutName('base26'),
            },
          ];
          const menuEl = document.getElementById("designMenu");
          this.updateCtxMenuPos(this.curNode.getStage());
          menuEl.MSMoveHandler = function(e){
            const menuElPos = {
              minX: parseFloat(menuEl.style.left) - 20,
              maxX: parseFloat(menuEl.style.left) + menuEl.clientWidth,
              minY: parseFloat(menuEl.style.top) - 20,
              maxY: parseFloat(menuEl.style.top) + menuEl.clientHeight
            }
            if(menuEl.style.display == 'block'){
              if(e.clientX > menuElPos.minX && e.clientX < menuElPos.maxX && e.clientY > menuElPos.minY && e.clientY < menuElPos.maxY) return;
              menuEl.style.display = "none";
              document.removeEventListener('mousemove', menuEl.MSMoveHandler, false)
            }
          }
          document.addEventListener('mousemove', menuEl.MSMoveHandler)
        }
      });
    },
    selectNodeHandler({node, viewId=this.viewId}){
      if(this.m_ms_shiftKeyDown){
        this.m_ms_select("shiftclick", node);
      } else {
        this.selectNode([node], viewId);
      }
    },
    selectNode(nodes, viewId=this.viewId){
      const {stage, layer} = this.getCurStageLayer({viewId});
      nodes = this.selectedNodeSort(nodes, layer);
      
      this.destroyTransformer();
      this.addTransformer({nodes, viewId});
      this.m_ms_selectImages = nodes;
      
      const type = nodes.length > 1 ? 'group' : (nodes[0].hasName("designImg") ? 'image' : 'text');
      // 放在addTransformer里面执行了, 之前为什么不放在click事件里面???
      // this.curNode = type=='group' ? nodes : nodes[0];
      // this.$store.commit("layout/changeSelectType", type);
      // this.$store.commit('changeCurNodeId', type=='group' ? nodes.map(a => a._id) : nodes[0]._id);
      // eventBus.$emit("changeTreeSelectNode", { viewId, data: this.curNode });
      // eventBus.$emit("changeSelectNode", { data: this.curNode, isThisPage: true });
      // if(type=='image' || type=='text') {
      //   this.drawSizeTip({currentStage: stage, node: this.curNode});
      // }
      this.updateLayerImgListAttr();
      this.saveImageData({
        node: this.curNode,
        viewId, 
        imageData: type=='image' ? this.curNode.getAttrs().imageData : {}
      });
      if(type == 'image'){
        this.ncYSRemind({currentStage: stage, node: this.curNode, viewId});
        this.curNode.isLock && this.lockNode({node: this.curNode, isLock: this.curNode.isLock});
        this.overallDesignId = this.curNode.getAttrs().overallDesignId;
      }
      if(type == 'text'){
        this.curNode.isLock && this.lockNode({node: this.curNode, isLock: this.curNode.isLock});
      }
      if(type == 'group'){
        [].forEach.call(nodes, node => {
          if(node.type=='image'){
            this.ncYSRemind({currentStage: stage, node, viewId, isGroup: true});
          }
        });
      }
    },
    // 选中节点按从上往下排序，避免后续操作导致组内顺序错误
    selectedNodeSort(nodes, layer){
      const _nodes = [];
      layer.find('.design').forEach(a => {
        if(nodes.some(k=>k._id == a._id)){
          _nodes.push(a);
        }
      });
      return _nodes;
    },
    addTransformer({nodes, viewId=this.viewId} = {}){
      const {stage, layer} = this.getCurStageLayer({viewId});
      layer.find('Transformer')?.destroy();
      layer.findOne('.anchorGroup')?.destroy();
      const type = nodes.length > 1 ? 'group' : (nodes[0].hasName("designImg") ? 'image' : 'text');
      const isOuter = this.isOuterPrintArea(nodes);
      const tr = new Konva.Transformer({
        name: `controler ${type}`,
        rotateEnabled: !this.m_clip_isCliping,
        borderStroke: isOuter ? "red" : "#6CD0FF",
        borderStrokeWidth: isOuter ? 2 : 1,
        rotateAnchorOffset: 10,
        ignoreStroke: true,
        anchorSize: 12,
        anchorStroke: "#ADB8BF",
        anchorCornerRadius: 12,
        keepRatio: type=='group' ? true : (
          type=='image' ? this.$store.state.layout.imgKeepRatioLock : this.$store.state.layout.textKeepRatioLock
        ),
        boundBoxFunc: (oldBox, newBox) => {
          if(this.m_clip_isCliping){
            this.m_clip_imageTemp = nodes[0].clone();
            return newBox;  
          } else {
            return newBox.width < 20 || newBox.height < 20 ? oldBox : newBox
          }
        },
      });
      tr.nodes(nodes);
      
      this.anchorGroup = new Konva.Group({name: 'anchorGroup'});
      this.anchorDelete = new Konva.Image({
        name: 'anchorDelete',
        image: this.imgDelete,
        visible: !this.m_clip_isCliping,
      });
      this.anchorRotate = new Konva.Image({
        name: 'anchorRotate',
        image: this.imgRotate,
        listening: false,
        visible: !this.m_clip_isCliping,
      });
      this.anchorGroup.add(this.anchorDelete);
      this.anchorGroup.add(this.anchorRotate);
      layer.add(tr);
      layer.add(this.anchorGroup);
      this.anchorGroupFourceupdate({viewId});
      layer.batchDraw();

      this.curNode = type=='group' ? nodes : nodes[0];
      this.$store.commit("layout/changeSelectType", type);
      this.$store.commit('changeCurNodeId', type=='group' ? nodes.map(a => a._id) : nodes[0]._id);
      eventBus.$emit("changeTreeSelectNode", { viewId, data: this.curNode });
      eventBus.$emit("changeSelectNode", { data: this.curNode, isThisPage: true });
      if(type=='image' || type=='text') {
        this.drawSizeTip({currentStage: stage, node: this.curNode});
      }
      if(type == 'group'){
        [].forEach.call(nodes, node => {
          node.setAttrs({ groupId: new Date().getTime() })
        })
      }

      this.initTransformerEvent(tr, nodes, type);
    },
    addTransformer_bak({node, currentStage, viewId, isGroup=false} = {}){
      const layer = currentStage.findOne('.designLayer');
      const designContainerGroup = layer.findOne(".designContainerGroup");
      let tr = layer.find('Transformer');
      let anchorGroup = layer.findOne('.anchorGroup');
      tr && tr.destroy();
      anchorGroup && anchorGroup.destroy();

      const rotateNodePoint = getRotateNodePoint({ node, layer })
      // 组操作默认外框没有手动设置宽高, konva会自动根据放在group的元素自动初始宽高, 大小等于最大矩形的宽高
      if(isGroup){
        node.setAttrs({
          width: rotateNodePoint.width,
          height: rotateNodePoint.height,
          // offsetX: rotateNodePoint.width/2,
          // offsetY: rotateNodePoint.height/2,
          // x: node.x() + rotateNodePoint.width/2,
          // y: node.y() + rotateNodePoint.height/2
        })
      }
      this.anchorGroup = new Konva.Group({
        x: rotateNodePoint.VCenter + designContainerGroup.x(),
        y: rotateNodePoint.HCenter + designContainerGroup.y(),
        rotation: node.rotation() || 0,
        name: "anchorGroup",
      });
      this.anchorDelete = new Konva.Image({
        x: -12 / layer.scaleX(),
        y: (node.height() * Math.abs(node.scaleY())) / 2 + 10 / layer.scaleX(),
        image: this.imgDelete,
        width: 24 / layer.scaleX(),
        height: 24 / layer.scaleY(),
        name: "anchorDelete",
        visible: !this.m_clip_isCliping
      });
      this.anchorRotate = new Konva.Image({
        x: (node.width() * Math.abs(node.scaleX())) / 2 + 10 / layer.scaleX(),
        y: -12 / layer.scaleY(),
        image: this.imgRotate,
        width: 24 / layer.scaleX(),
        height: 24 / layer.scaleY(),
        name: "anchorRotate",
        listening: false,
        visible: !this.m_clip_isCliping
      });

      const isOuter = this.isOuterPrintArea({
        currentStage: stageObj[`stage${this.viewId}`],
        node: node,
        rotateNodePoint: rotateNodePoint,
      });

      tr = new Konva.Transformer({
        name: `nodeTransformer ${isGroup ? 'group' : ''}`,
        rotateEnabled: !this.m_clip_isCliping,
        borderStroke: isOuter ? "red" : "#6CD0FF",
        borderStrokeWidth: isOuter ? 2 : 1,
        rotateAnchorOffset: 10,
        ignoreStroke: true,
        anchorSize: 12,
        anchorStroke: "#ADB8BF",
        anchorCornerRadius: 12,
        keepRatio: isGroup ? true : (
          node.hasName("designImg") ? this.$store.state.layout.imgKeepRatioLock : this.$store.state.layout.textKeepRatioLock
        ),
        boundBoxFunc: (oldBox, newBox) => {
          if(this.m_clip_isCliping){
            this.m_clip_imageTemp = node.clone();
            return newBox;  
          } else {
            return newBox.width < 20 || newBox.height < 20 ? oldBox : newBox
          }
        },
      })
      tr.nodes([node]);
      layer.add(tr);
      this.anchorGroup.add(this.anchorDelete);
      this.anchorGroup.add(this.anchorRotate);
      layer.add(this.anchorGroup);
     
      this.curNode = node;
      this.$store.commit('changeCurNodeId', node._id);
      eventBus.$emit("changeTreeSelectNode", { viewId: viewId, data: node });
      eventBus.$emit("changeSelectNode", { data: node, isThisPage: true });
      this.drawSizeTip({currentStage, node})

      this.anchorDelete.off('click');
      this.anchorDelete.on('click', e => {
        const nodesArr = node.hasName('designGroup') ? this.m_ms_getMultipleSelectImages() : [node];
        // [].forEach.call(nodesArr, a => {
          this.deleteNode({node, viewId})
        // })
      });
      this.anchorDelete.off('mouseenter');
      this.anchorDelete.on('mouseenter', e => {
        if(node.getAttrs().isclip){
          this.designMenuData = [
            {
              name: "删除裁切蒙版",
              type: "deleteClip",
              id: "deleteClip",
              nodeType: "image",
            },
            {
              name: "删除图片",
              type: "delete",
              id: "delete",
              nodeType: "image",
              shortcut: this.getShortcutName('base26'),
            },
          ];
          const menuEl = document.getElementById("designMenu");
          this.updateCtxMenuPos(stageObj[`stage${this.viewId}`]);
          menuEl.MSMoveHandler = function(e){
            const menuElPos = {
              minX: parseFloat(menuEl.style.left) - 20,
              maxX: parseFloat(menuEl.style.left) + menuEl.clientWidth,
              minY: parseFloat(menuEl.style.top) - 20,
              maxY: parseFloat(menuEl.style.top) + menuEl.clientHeight
            }
            if(menuEl.style.display == 'block'){
              if(e.clientX > menuElPos.minX && e.clientX < menuElPos.maxX && e.clientY > menuElPos.minY && e.clientY < menuElPos.maxY) return;
              menuEl.style.display = "none";
              document.removeEventListener('mousemove', menuEl.MSMoveHandler, false)
            }
          }
          document.addEventListener('mousemove', menuEl.MSMoveHandler)
        }
      });
    },
    deleteNode({ node, viewId, isAddHistory = true }) {
      let cloneViewLength = this.getCloneViewLength()
      if(isAddHistory){
         this.$statisticalreport.biCommonFn('删除',node)
      }
      // this.productData.views.forEach(item => {
        const designObj = linkageDesign(this.productData, viewId, node)
        for(let _viewId in designObj) {
          for(let item of designObj[_viewId]) {
            item.node.destroy();
            item.stage.find(`.repeatImgGroup${item.node._id}`).destroy();
            item.stage.find('.overspreadPath')?.destroy();
            document.querySelector(".spaceRemind").style.display = "none";
            this.destroyTransformer({viewId: item.id});
            // this.destroyTransform({ currentStage: item.stage, node: item.node, viewId: item.id });
            this.setLayerImgList({ viewId: item.id, node: item.node, isDelete: true });
            // this.initPreviewStage({ viewId });
            if (item.layer.find(".design").length <= 0) {
              this.showTouchAnimation = true;
              this.$nextTick(() => {
                this.touchAnimationPos({ viewId: item.id });
              });
              this.checkShowOverallDesignTip()
            }
            this.curNode = null;
            // this.m_group_unbind({update: false});
            const historyId = item.node?.getAttrs()?.historyId;
            if (isAddHistory && historyId) {
              this.addHistory("图层删除", item.id, {
                nodeId: historyId,
              });
            }
          }
          this.cloneStage({ viewId: _viewId, cloneViewLength })
        }
        document.getElementById("designMenu").style.display = "none";
      // })
 
    },
    deleteTemplateNode(){
      for(let key in stageObj){
        let designLayer = stageObj[key].findOne('.designLayer');
        designLayer.find('.design').forEach(node => {
          if(node.hasName('template')){
            node.destroy();
            designLayer.find(`.repeatImgGroup${node._id}`).destroy();
            this.setLayerImgList({
              viewId: key.replace('stage', ''),
              node: node,
              isDelete: true,
            });
          }
        })
      }
    },
    anchorGroupFourceupdate({viewId = this.viewId} = {}){
      const {stage, layer} = this.getCurStageLayer({viewId});
      if(!layer.findOne('.anchorGroup')) return;
      const transformer = layer.findOne('Transformer');
      const scaleX = layer.scaleX(), scaleY = layer.scaleY();
      const ltPoint = {
        x: (transformer.x() - stage.x()) / scaleX,
        y: (transformer.y() - stage.y()) / scaleY
      }
      const deletePoint = {
        x: (transformer.width()/2 - 12) / scaleX,
        y: (transformer.height() + 10) / scaleY
      };
      const rotatePoint ={
        x: (transformer.width() + 10) / scaleX,
        y: (transformer.height()/2 - 12) / scaleY
      };
      this.anchorGroup.x(ltPoint.x);
      this.anchorGroup.y(ltPoint.y);
      this.anchorGroup.rotation(transformer.rotation() || 0);
      this.anchorDelete.width(24/scaleX);
      this.anchorDelete.height(24/scaleY);
      this.anchorDelete.x(deletePoint.x);
      this.anchorDelete.y(deletePoint.y);
      this.anchorRotate.width(24/scaleX);
      this.anchorRotate.height(24/scaleY);
      this.anchorRotate.x(rotatePoint.x);
      this.anchorRotate.y(rotatePoint.y);
    },
    anchorGroupFourceupdate_bak({ node, viewId }) {
      let curS = this.getCurStageLayer({ viewId });
      let stage = curS.stage;
      let layer = curS.layer;
      let designContainerGroup = layer.findOne(".designContainerGroup");
      if (!layer.findOne(".anchorGroup")) return;
      let rotateNodePoint = getRotateNodePoint({ node, layer });
      this.anchorGroup.rotation(node.rotation());
      this.anchorGroup.x(rotateNodePoint.VCenter + designContainerGroup.x());
      this.anchorGroup.y(rotateNodePoint.HCenter + designContainerGroup.y());
      this.anchorDelete.x(-12 / layer.scaleX());
      this.anchorDelete.y(
        Math.abs(node.height() * node.scaleY()) / 2 + 10 / layer.scaleY()
      );
      this.anchorDelete.width(24 / layer.scaleX());
      this.anchorDelete.height(24 / layer.scaleY());
      this.anchorRotate.x(
        (node.width() * Math.abs(node.scaleX())) / 2 + 10 / layer.scaleX()
      );
      this.anchorRotate.y(-12 / layer.scaleY());
      this.anchorRotate.width(24 / layer.scaleX());
      this.anchorRotate.height(24 / layer.scaleY());
    },
    destroyTransformer({viewId=this.viewId} = {}){
      const {stage, layer} = this.getCurStageLayer({viewId});
      this.curNode = null;
      this.m_ms_selectImages = [];
      stage.find('Transformer')?.destroy();
      stage.find('.anchorGroup')?.destroy();
      stage.find('.overspreadPath')?.destroy();
      layer.find('.design').setAttrs({groupId: ''});
      this.$store.commit("layout/changeSelectType", null);
      this.$store.commit("changeCurNodeId", "view-" + viewId);
      eventBus.$emit("changeTreeSelectNode", { viewId, data: null });
      document.querySelector("#containerSize").style.visibility = "hidden";
      document.querySelector(".ncRemind").style.display = "none";
      document.querySelector("#designMenu").style.display = "none";
      layer.batchDraw();
    },
    destroyTransform_bak({ currentStage, node, viewId }) {
      currentStage.find("Transformer").destroy();
      currentStage.find(".anchorGroup").destroy();
      document.getElementById("containerSize").style.visibility = "hidden";
      document.querySelector(".ncRemind").style.display = "none";
      currentStage.find('.overspreadPath')?.destroy();
      currentStage.findOne(".designLayer").batchDraw();
      this.$store.commit("layout/changeSelectType", null);
      eventBus.$emit("changeTreeSelectNode", { viewId, data: null });
      this.$store.commit("changeCurNodeId", "view-" + viewId);
      this.m_ms_selectImages = [];
      this.$store.commit("multiple/updateMultipleSelectNodes",this.m_ms_selectImages);
    },
    lockNode({node, viewId=this.viewId, isLock}){
      const isGroup = Array.isArray(node);
      const {stage, layer} = this.getCurStageLayer({viewId});
      const transformer = layer.findOne('Transformer');
      if(isLock){
        if(!transformer) return;
        transformer.setAttrs({
          enabledAnchors: [],
          rotateEnabled: false,
        });
        this.anchorDelete?.hide();
        this.anchorRotate?.hide();
        const anchorLock = new Konva.Image({
          name: 'anchorLock',
          image: this.imgLock,
          width: 24 / layer.scaleX(),
          height: 24 / layer.scaleY(),
          x: (transformer.width()/2 - 12) / layer.scaleX(),
          y: (transformer.height() + 10) / layer.scaleY()
        });
        this.anchorGroup?.add(anchorLock);
        anchorLock.on('click', e => {
          eventBus.$emit("nodeToggleLock", { data: this.curNode });
        })
      } else {
        if(!transformer) return;
        this.anchorGroup?.findOne('.anchorLock')?.destroy();
        transformer.setAttrs({
          enabledAnchors: [
            "top-left",
            "top-center",
            "top-right",
            "middle-right",
            "middle-left",
            "bottom-left",
            "bottom-center",
            "bottom-right",
          ],
          rotateEnabled: true,
        });
        this.anchorDelete.show();
        this.anchorRotate.show();
        // this.curNode.fire('click')
        // this.selectNode(isGroup ? node : [node], viewId);
      }
      layer.batchDraw();
    },
    lockNode_bak({ node, viewId, isLock }) {
      let layer = node.getLayer();
      let transformer = layer.find("Transformer");
      if (isLock) {
        transformer.setAttrs({
          enabledAnchors: [],
          rotateEnabled: false,
        });
        this.anchorDelete && this.anchorDelete.hide();
        this.anchorRotate && this.anchorRotate.hide();
        let anchorLock = new Konva.Image({
          x: -12 / layer.scaleX(),
          y:
            (node.height() * Math.abs(node.scaleY())) / 2 + 10 / layer.scaleX(),
          image: this.imgLock,
          width: 24 / layer.scaleX(),
          height: 24 / layer.scaleY(),
          name: "anchorLock",
        });
        this.anchorGroup && this.anchorGroup.add(anchorLock);
        anchorLock.on("click", () => {
          // this.$set(node, "isLock", false);
          eventBus.$emit("nodeToggleLock", { data: node });
        });
        // const designArr = linkageDesign(this.productData, viewId, node)
        // designArr.forEach(item => {
        //   this.$set(item.node, "isLock", true);
        //   this.anchorGroup.findOne('.anchorLock').on("click", () => {
        //     this.$set(item.node, "isLock", false);
        //     eventBus.$emit("nodeToggleLock", { data: item.node });
        //   });
        // })
      } else {
        if (this.anchorGroup && this.anchorGroup.findOne(".anchorLock")) {
          this.anchorGroup.findOne(".anchorLock").destroy();
        }
        this.curNode.fire('click')
        // transformer.setAttrs({
        //   enabledAnchors: [
        //     "top-left",
        //     "top-center",
        //     "top-right",
        //     "middle-right",
        //     "middle-left",
        //     "bottom-left",
        //     "bottom-center",
        //     "bottom-right",
        //   ],
        //   rotateEnabled: true,
        // });
        // this.anchorDelete.show();
        // this.anchorRotate.show();
        
      }
      layer.batchDraw();
    },
    hideNode({ viewId, node }) {
      const designObj = linkageDesign(this.productData, viewId, node)
      for(let _viewId in designObj) {
        for(let item of designObj[_viewId]) {
          let curS = this.getCurStageLayer({ viewId: item.id });
          let layer = curS.layer;
          let currentStage = curS.stage;
          item.node.hide();
          layer.find(`.repeatImgGroup${item.node._id}`).hide();
          // if (this.curNode._id == item.node._id) {
            // this.destroyTransform({ currentStage, node: item.node, viewId: item.id });
            this.destroyTransformer({viewId: item.id});
            layer.batchDraw();
          // } else {
          //   layer.batchDraw();
          //   this.cloneStage({ viewId: item.id, cloneViewLength });
          // }
        }
        this.cloneStage({ viewId: _viewId });
      }
    },
    showNode({ viewId, node }) {
      const designObj = linkageDesign(this.productData, viewId, node)
      for(let _viewId in designObj) {
        for(let item of designObj[_viewId]) {
          let curS = this.getCurStageLayer({ viewId: item.id });
          let layer = curS.layer;
          item.node.show();
          layer.find(`.repeatImgGroup${item.node._id}`).show();
          layer.batchDraw();
        }
        this.cloneStage({ viewId: _viewId });
      }
    },
    printAreaTip({ currentStage }) {
      let designContainer = currentStage.findOne(".designLayer");
      let printAreaRect = currentStage.findOne(".print_area_border_outer");
      let designContainerGroup = currentStage.findOne(".designContainerGroup");
      let stageContainerOffset = {
        // left: document.getElementById(`container${this.viewId}`).offsetLeft,
        // top: document.getElementById(`container${this.viewId}`).offsetTop,
        left: currentStage.x(),
        top: currentStage.y(),
      };
      document.getElementById("designAreasize").innerText =
        "可设计区域 " +
        ((designContainerGroup.width() * this.ratio) / 10).toFixed(1) +
        "x" +
        ((designContainerGroup.height() * this.ratio) / 10).toFixed(1) +
        " (cm)";
      document.getElementById("designAreasize").style.left =
        stageContainerOffset.left +
        designContainerGroup.x() * designContainer.scaleX() +
        (designContainerGroup.width() * designContainer.scaleX()) / 2 -
        document.getElementById("designAreasize").clientWidth / 2 +
        "px";
      document.getElementById("designAreasize").style.top =
        stageContainerOffset.top +
        (designContainerGroup.y() + designContainerGroup.height() + 10) *
          designContainer.scaleY() +
        "px";

      // this.canvasMess.size = document
      //   .getElementById("designAreasize")
      //   .innerHTML.substring(5);
      for (let item of this.productData.views) {
        if (item.id == this.viewId) {
          this.canvasMess.size = `${Math.ceil(
            (item.print_area.width / 25.4) * this.productData.dpi
          )}*${Math.ceil(
            (item.print_area.height / 25.4) * this.productData.dpi
          )}px`;
           this.$store.commit("product/UPDATE_SELECTED_VIEW_SIZE", this.canvasMess.size);
          break;
        }
      }
    },
    drawSizeTip({ currentStage, node }) {
      if(this.editTextPop) return //文字编辑状态
      let clientRect = node.getClientRect();
      // let rotateNodePoint = getRotateNodePoint({node: node, layer: currentStage.findOne('.designLayer')})
      // let stageContainerOffset = {
      //   left: document.getElementById(`container${this.viewId}`).offsetLeft,
      //   top: document.getElementById(`container${this.viewId}`).offsetTop,
      // };
      document.getElementById("containerSize").innerText =
        "宽" +
        ((node.width() * Math.abs(node.scaleX()) * this.ratio) / 10).toFixed(
          1
        ) +
        "x高" +
        ((node.height() * Math.abs(node.scaleY()) * this.ratio) / 10).toFixed(
          1
        ) +
        " (cm)";
      document.getElementById("containerSize").style.left =
        clientRect.x +
        clientRect.width / 2 -
        document.getElementById("containerSize").clientWidth / 2 +
        "px";
      document.getElementById("containerSize").style.top =
        clientRect.y + clientRect.height + 34 + "px";

      document.getElementById("containerSize").style.visibility = "visible";

      // if(currentStage.findOne('.sizeTipGroup')) {
      //   currentStage.findOne('.sizeTipGroup').destroy()
      // }
      // let rotateNodePoint = getRotateNodePoint({node: node, layer: currentStage.findOne('.designLayer')})
      // const group = new Konva.Group({
      //   x: rotateNodePoint.VEnd - rotateNodePoint.width / 2,
      //   y: rotateNodePoint.HEnd + 10,
      //   name: 'sizeTipGroup'
      // })

      // const text = new Konva.Text({
      //   x: 10,
      //   y: 5,
      //   text: '宽' + (node.width() * node.scaleX() * this.ratio / 10).toFixed(1) + 'x高' + (node.height() * node.scaleY() * this.ratio / 10).toFixed(1) + ' (cm)',
      //   fontSize: 14,
      //   stroke: 'white',
      //   fontFamily: '微软雅黑',
      //   name: 'sizeTipText'
      // });
      // const rect = new Konva.Rect({
      //   x: 0,
      //   y: 0,
      //   width: text.width() + 20,
      //   height: text.height() + 10,
      //   fill: 'rgba(3, 169, 244, 0.7)',
      //   name: 'sizeTipRect'
      // });
      // group.x(group.x() - rect.width() / 2)

      // group.add(rect)
      // group.add(text)
      // currentStage.findOne('.designLayer').add(group)
      // currentStage.findOne('.designLayer').draw()
    },
    // 绘制未铺满红色透明区域
    createOverspreadArea(overspreadData){
      const curS = this.getCurStageLayer({viewId: this.viewId})
      const printArea = curS.designRect;
      const outerW = printArea.width(), outerH = printArea.height();
      const limitWidth1 = outerW * 0.1, limitWidth2 = outerW * 0.9, limitHeight1 = outerH * 0.1, limitHeight2 = outerH *0.9;
      let innerOffsetX=0, innerOffsetY=0, innerW, innerH;
      if(overspreadData.leftNum>0 && overspreadData.leftNum < limitWidth1){
        innerOffsetX = overspreadData.leftNum
      }
      if(overspreadData.topNum > 0 && overspreadData.topNum < limitHeight1){
        innerOffsetY = overspreadData.topNum;
      }
      if(overspreadData.rightNum > limitWidth2 && overspreadData.rightNum < outerW){
        innerW = overspreadData.rightNum - innerOffsetX;
      } else {
        innerW = outerW - innerOffsetX;
      }
      if(overspreadData.bottomNum > limitHeight2 && overspreadData.bottomNum < outerH){
        innerH = overspreadData.bottomNum - innerOffsetY;
      } else {
        innerH = outerH - innerOffsetY;
      }
      let pathData = `M0,0 h${outerW} v${outerH} h-${outerW} z M${innerOffsetX},${innerOffsetY} v${innerH} h${innerW} v-${innerH} z`;
      let path = new Konva.Path({
        name: 'overspreadPath',
        data: pathData,
        fill: '#f00',
        opacity: 0.4
      });
      curS.designContainerGroup.add(path);
      curS.layer.batchDraw();
    },
    ncYSRemind({ currentStage, node, init = false, isGroup=false }) {
      return new Promise((resolve, reject) => {
        document.querySelector(".ncRemind").style.display = "none";
        document.querySelector(".vagueRemind").style.display = "none";
        document.querySelector(".defRemind").style.display = "none";
        const designLayer = node.getLayer();
        const ratio = designLayer.getAttrs().ratio;
        let scaleX = Math.abs(node.scaleX());
        let scaleY = Math.abs(node.scaleY());
        let maxImgSize = JSON.parse(JSON.stringify(node.getAttrs().maxImgSize));
        let newImgWidth = node.width() * scaleX * ratio,
          newImgHeight = node.height() * scaleY * ratio;
        let isVagueData = {},
          transformData = {};
        if(node.getAttrs().isclip && !this.m_clip_isCliping){
          let clipData = node.getAttrs().clipData;
          const {imgAttrs, pathAttrs} = clipData;
          maxImgSize.width = maxImgSize.width * ((pathAttrs.width*pathAttrs.scaleX) / (imgAttrs.width*imgAttrs.scaleX))
          maxImgSize.height = maxImgSize.height * ((pathAttrs.height*pathAttrs.scaleY) / (imgAttrs.height*imgAttrs.scaleY))
        }
        //放大程度
        if (
          newImgWidth > maxImgSize.width ||
          newImgHeight > maxImgSize.height
        ) {
          var magnificationW = newImgWidth / maxImgSize.width;
          var magnificationH = newImgHeight / maxImgSize.height;
          var magnificationMax = Math.max(magnificationW, magnificationH);
          if (magnificationMax > 1.01 && magnificationMax <= 1.5) {
            isVagueData.text = "图片像素不足放大，轻微影响生产印刷清晰度！";
            isVagueData.title = "图片轻微模糊";
            isVagueData.bgColor = "#f5cf52";
            isVagueData.type = 1;
          } else if (magnificationMax > 1.5 && magnificationMax <= 2) {
            isVagueData.text = "图片像素不足放大，比较影响生产印刷清晰度！";
            isVagueData.title = "图片比较模糊";
            isVagueData.bgColor = "#ff9902";
            isVagueData.type = 2;
          } else if (magnificationMax > 2) {
            isVagueData.text = "图片像素不足放大，严重影响生产印刷清晰度！";
            isVagueData.title = "图片严重模糊";
            isVagueData.bgColor = "#fe2c25";
            isVagueData.type = 3;
          }
        }
        //变形程度
        var oriWHRatio = maxImgSize.width / maxImgSize.height;
        var nowWHRatio = newImgWidth / newImgHeight;
        var defRatio;
        if (oriWHRatio > nowWHRatio) {
          defRatio = oriWHRatio / nowWHRatio;
        } else {
          defRatio = nowWHRatio / oriWHRatio;
        }
        if (defRatio >= 1.09 && defRatio < 1.5) {
          transformData.text =
            "图片拉伸变形指数1-1.5倍，请注意已经导致图案变形！";
          transformData.title = "图片轻微变形";
          transformData.bgColor = "#f5cf52";
          transformData.type = 1;
        } else if (defRatio >= 1.5 && defRatio < 2) {
          transformData.text =
            "图片拉伸变形指数1.5-2倍，请注意已经导致图案变形！";
          transformData.title = "图片比较变形";
          transformData.bgColor = "#ff9902";
          transformData.type = 2;
        } else if (defRatio >= 2) {
          transformData.text = "图片拉伸变形指数2倍以上，请注意图案变形严重！";
          transformData.title = "图片严重变形";
          transformData.bgColor = "#fe2c25";
          transformData.type = 3;
        }
        // 全副产品未铺满设计区域, 组操作只需要执行一次
        let overspreadData = {};
        if(!isGroup){
          overspreadData = this.checkViewOverspread({currentStage});
        } else {
          const filterNodes = this.curNode.filter(a=>a.hasName('designImg'));
          if(filterNodes[filterNodes.length - 1]._id == node._id){
            overspreadData = this.checkViewOverspread({currentStage});
          }
        }
        resolve({ isVagueData: isVagueData, transformData: transformData, overspreadData });
        if (init) return;
        if (transformData.text) {
          document.querySelector(".defRemind").style.display = "block";
          document.querySelector(".defRemind").innerText = transformData.text;
          document.querySelector(".defRemind").style.background =
            transformData.bgColor;
        }
        if (isVagueData.text) {
          document.querySelector(".vagueRemind").style.display = "block";
          document.querySelector(".vagueRemind").innerText = isVagueData.text;
          document.querySelector(".vagueRemind").style.background =
            isVagueData.bgColor;
        }
        if (transformData.text || isVagueData.text) {
          if(!this.curNode) return
          document.querySelector(".ncRemind").style.display = "block";
          // let stageContainerOffset = {
          //   left: document.getElementById(`container${this.viewId}`).offsetLeft,
          //   top: document.getElementById(`container${this.viewId}`).offsetTop,
          // };
          this.ncYSRemindPos({currentStage, node: this.curNode, isGroup});
        }
      });
    },
    checkViewOverspread({currentStage, viewId=this.viewId} = {}){
      let overspreadData = {};
      document.querySelector(".spaceRemind").style.display = "none";
      currentStage.findOne('.overspreadPath')?.destroy();
      if(this.productData.imgFull==1){
        let productConfig = this.getProductConfiguration();
        let { overspreadObj } = this.viewOverspreadCauclate(productConfig);
        if(overspreadObj[viewId]){
          const {layer} = this.getCurStageLayer({viewId});
          const ratio = layer.getAttrs().ratio;
          // 当任意一边距离印刷区域的距离介于对应长/宽的0-10%之间，显示未铺满提示
          let printArea = currentStage.findOne('.print_area_border_outer');
          let limitWidth1 = printArea.width()* 0.1,
          limitWidth2 = printArea.width() * 0.9,
          limitHeight1 = printArea.height() * 0.1,
          limitHeight2 = printArea.height() * 0.9;
          if(
            (Math.floor(overspreadObj[viewId].leftNum)>0 && overspreadObj[viewId].leftNum<limitWidth1) ||
            (Math.floor(overspreadObj[viewId].topNum)>0 && overspreadObj[viewId].topNum<limitHeight1) ||
            (overspreadObj[this.viewId].rightNum>limitWidth2 && Math.floor((printArea.width()-overspreadObj[this.viewId].rightNum)*ratio)>0) || 
            (overspreadObj[this.viewId].bottomNum>limitHeight2 && Math.floor((printArea.height()-overspreadObj[this.viewId].bottomNum)*ratio)>0)
          ){
            overspreadData.text = `图片未铺满设计区域，产品生产可能存在留白！`;
            overspreadData.bgColor = "#fe2c25";
            this.createOverspreadArea(overspreadObj[viewId]);
          }
        }
      }
      if(overspreadData.text){
        let designEle = document.querySelector('#designer');
        let designerPos = designEle.getBoundingClientRect();
        let remindEle = document.querySelector(".spaceRemind");
        remindEle.style.display = "block";
        if(currentStage.y() < remindEle.clientHeight + 10) {
          remindEle.style.top = designerPos.top + ((currentStage.y()<0 ? 0 : currentStage.y())- remindEle.clientHeight - 10) + 'px'
        } else {
          remindEle.style.top = designerPos.top + 10 + 'px';
        }
        remindEle.style.left = designerPos.left + (designEle.clientWidth - remindEle.clientWidth)/2 + 'px';
      }
      return overspreadData;
    },
    ncYSRemindPos({currentStage, node=this.curNode, isGroup=false} = {}){
      currentStage = currentStage ? currentStage : stageObj[`stage${this.viewId}`];
      // let clientRect = Array.isArray(node) ? getNodesClientRect(node) : node.getClientRect();
      let clientRect = currentStage.findOne('Transformer').getClientRect();
      const remindEleTop = document.querySelector(".spaceRemind")?.clientHeight;
      const ncRemindLeft =
        // stageContainerOffset.left +
        clientRect.x +
        clientRect.width / 2 -
        document.querySelector(".ncRemind").clientWidth / 2;
      const ncRemindTop =
        // stageContainerOffset.top +
        clientRect.y -
        document.querySelector(".ncRemind").clientHeight -
        30 - remindEleTop;
      document.querySelector(".ncRemind").style.left =
        (ncRemindLeft <= 0
          ? 0
          : ncRemindLeft >=
            document.getElementById(`stageContainer`).clientWidth -
              document.querySelector(".ncRemind").clientWidth
          ? document.getElementById(`stageContainer`).clientWidth -
            document.querySelector(".ncRemind").clientWidth
          : ncRemindLeft) + "px";
      document.querySelector(".ncRemind").style.top =
        (currentStage.y() <= 0 ? 
          ncRemindTop <= 0 ? 0+remindEleTop : ncRemindTop : 
          ncRemindTop < currentStage.y() - document.querySelector(".ncRemind").clientHeight ? 
            currentStage.y() - document.querySelector(".ncRemind").clientHeight+remindEleTop : 
            ncRemindTop
        ) + "px";
    },
    overspreadHandler(type){
      switch(type){
        case '1': //等比放大
          if(this.curNode){
            if(this.$store.state.layout.showType == 'group'){
              this.$message.error({ message: "请选择单张图片进行操作" });
            } else {
              if(this.curNode.hasName('designImg')) {
                eventBus.$emit("imgMaximizationChange", {
                  data: { value: "imgFull" },
                });
                this.curNode.fire("click");
              }
            }
          } else {
            this.$message.error({ message: "请选择需要操作的图片" });
          }
          break;
        case '2': //镜像平铺
          if(this.curNode){
            if(this.$store.state.layout.showType == 'group'){
              this.$message.error({ message: "请选择单张图片进行操作" });
            } else {
              if(this.curNode.hasName('designImg')) {
                eventBus.$emit("repeatChange", {
                  data: { value: 'Mirror' },
                });
                this.curNode.fire("click");
              }
            }
          } else {
            this.$message.error({ message: "请选择需要操作的图片" });
          }
          break;
        case '3': //关闭
          document.querySelector(".spaceRemind").style.display = "none";
          break;
      }
    },
    //判断设计是否超出设计区域
    isOuterPrintArea(nodes=this.curNode){
      const {stage, layer} = this.getCurStageLayer({viewId: this.viewId});
      nodes = Array.isArray(nodes) ? nodes : [nodes];
      if(layer.getAttrs().softSvg) return false;
      const printArea = layer.findOne('.print_area_border_outer');
      let isOuter = false;
      [].forEach.call(nodes, node => {
        const rotateNodePointData = getRotateNodePoint({ node, layer });
        if (
          rotateNodePointData.VStart <= -1 ||
          rotateNodePointData.HStart <= -1 ||
          rotateNodePointData.VEnd >= printArea.width() + 1 ||
          rotateNodePointData.HEnd >= printArea.height() + 1
        ) {
          isOuter = true;
          return false;
        }
      })
      stage.find("Transformer").borderStroke(isOuter ? "red" : "white");
      stage.find("Transformer").borderStrokeWidth(isOuter ? 2 : 1);
      return isOuter;
    },
    isOuterPrintArea_bak({ currentStage, node, rotateNodePoint = null }) {
      let layer = currentStage.findOne(".designLayer");
      let softSvg = layer.getAttrs().softSvg;
      if (softSvg) {
        return false;
      }
      let printAreaRect = currentStage.findOne(".print_area_border_outer");
      let rotateNodePointData;
      if (rotateNodePoint) {
        rotateNodePointData = rotateNodePoint;
      } else {
        rotateNodePointData = getRotateNodePoint({
          node: node,
          layer,
        });
      }
      if (
        rotateNodePointData.VStart <= -1 ||
        rotateNodePointData.HStart <= -1 ||
        rotateNodePointData.VEnd >= printAreaRect.width() + 1 ||
        rotateNodePointData.HEnd >= printAreaRect.height() + 1
      ) {
        currentStage.find("Transformer").borderStroke("red");
        currentStage.find("Transformer").borderStrokeWidth(2);
        return true;
      } else {
        currentStage.find("Transformer").borderStroke("white");
        currentStage.find("Transformer").borderStrokeWidth(1);
      }
      return false;
    },
    // loadDetailImgPreview() {
    //   const curDetailIndex = this.curDetailIndex;
    //   this.curPreviewIndex = curDetailIndex;

    //   const GROUP = 4;
    //   let endIndex = Math.ceil((curDetailIndex + 1) / GROUP) * GROUP;
    //   if (endIndex > this.previewList.length) {
    //     endIndex = this.previewList.length;
    //   }
    //   let startIndex = endIndex - (GROUP - 1);
    //   if (startIndex <= 0) {
    //     startIndex = 1;
    //   }
    //   startIndex -= 1;
    //   this.loadCurrentDetail({startIndex, endIndex, colorId: 30});
    // },
    async setViewDesigns(params) {
      let { flag, operateType, colorId, curIndex, type, viewId = this.viewId, isPartChange = false } = params;
      let detailList = [];
      let colors = this.productData.colors;
      if(this.is3dModel){
        let show3DModel = this.productData.show_3d_model[colorId] || this.productData.show_3d_model['default'];
        colors = show3DModel?.colors;
      }
      for (let color of colors) {
        if (color.id == colorId) {
          if (!color.detail || !color.detail.length) {
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
      // 第一轮Vue数据初始，loading占位，并且swiper相关处理
      if (flag == 0) {
        // 设计时数据初始重新开始
          if(this.isChangeDesign) {
            this.largeDetailImages = {};
          }
          let list = detailList.map((detail) => {
            let detailObj = {};
            detailObj.rendered = false;
            /**
             * 3d切换颜色，v-if="type" 会导致重新渲染，内部canvas消失，
             * 这里添加type字段
             * 如果这里不添加type而上一个颜色有type字段，会导致vue重新渲染节点
             */
            detailObj.type = detail.parts ? detail.parts[0].type : '';
            return detailObj;
          });
          if (this.isLargePreview) {
            //预览大图
            //没有改变设计并且当前颜色大图有加载过
            let detailImages = {};
            if(this.largeDetailImages[colorId]) {
              this.$store.commit("gallery/getLargeDetailImageList", {
                data: this.largeDetailImages[colorId],
              });
            }
            if(!this.is3dModel && !this.largeDetailImages[colorId]) {
              this.$set(this.largeDetailImages, colorId, list);
              this.$store.commit("gallery/getLargeDetailImageList", {
                data: this.largeDetailImages[colorId],
              });
            }
            if(this.is3dModel) {
              detailImages[colorId] = list
            }
            await this.$nextTick();
            await this.loadCurrentDetail({
              startIndex: this.curViewIndexList[0],
              endIndex: this.curViewIndexList.slice(-1)[0],
              colorId,
              detailImages: this.is3dModel ? detailImages : this.largeDetailImages,
              flag,
              viewId,
              isPartChange,
              operateType
            });
          } else {
            this.$set(this.detailImages, colorId, list);
            this.$store.commit("gallery/getDetailImageList", {
              data: this.detailImages[colorId],
            });
            await this.$nextTick();
            await this.loadCurrentDetail({
              startIndex: this.curViewIndexList[0],
              endIndex: this.curViewIndexList.slice(-1)[0],
              colorId,
              detailImages: this.detailImages,
              flag,
              viewId,
              isPartChange,
              operateType
            });
          }
        // 切换到第几个slide(切换颜色时可能图数量不一致，超过则取最末尾的)
        if(!this.is3dModel){
          if (curIndex + 1 > detailList.length) {
            const index = detailList.length - 1;
            curIndex = index >= 0 ? index : 0;
            eventBus.$emit("slideTo", { curIndex: curIndex });
          }
          if (this.curViewIndexList.indexOf(curIndex) == -1) {
            eventBus.$emit("slideTo", { curIndex: curIndex });
          }
        }
      } else {
        //添加设计
        if(this.isChangeDesign) {
          this.largeDetailImages = {};
        }
        for (let key in this.detailImages) {
          for (let item of this.detailImages[key]) {
            item.rendered = false;
          }
        }
        this.$store.commit("gallery/getDetailImageList", {
          data: this.detailImages[colorId],
        });

        await this.loadCurrentDetail({
          startIndex: this.curViewIndexList[0],
          endIndex: this.curViewIndexList.slice(-1)[0],
          colorId,
          detailImages: this.detailImages,
          flag,
          viewId,
          isPartChange,
          operateType
        });
      }
    },
    // 只加载当前可见的
    loadCurrentDetail({
      startIndex,
      endIndex,
      colorId,
      detailImages,
      flag = 0,
      viewId = this.viewId,
      isPartChange = false,
      operateType = ''
    }) {
      return new Promise(async (resolve, reject) => {
        let indexArr = [];
        for (let index = startIndex; index <= endIndex; index++) {
          if (this.curViewIndex != index) {
            indexArr.push(index);
          }
        }
        await this.updateCurrentDetail({
          index: this.curViewIndex,
          colorId,
          detailImages,
          flag,
          viewId,
          isPartChange,
          operateType
        });
        for (let item of indexArr) {
          await this.updateCurrentDetail({
            index: item,
            colorId,
            detailImages,
            flag,
            viewId,
            isPartChange,
            operateType
          });
        }
        resolve();
      });
    },
    updateCurrentDetail({ index, colorId, detailImages, flag = 0, viewId, isPartChange = false, operateType = '' }) {
      return new Promise(async (resolve, reject) => {
        if (
          detailImages[colorId] &&
          detailImages[colorId][index] &&
          !detailImages[colorId][index].rendered
        ) {
          let detailList = [];
          let colors = this.productData.colors;
          if(this.is3dModel){
            let show3DModel = this.productData.show_3d_model[colorId] || this.productData.show_3d_model['default'];
            colors = show3DModel?.colors;
          }
          for (let color of colors) {
            if (color.id == colorId) {
              if (!color.detail || !color.detail.length) {
                for (let view of color.views) {
                  // if (view.id == this.viewId) {
                    detailList.push(view);
                  // }
                }
                break;
              }
              detailList = color.detail;
              break;
            }
          }
          // 防止重复合图
          // detailImages[colorId][index].rendered = true;
          let detail = {}
          if(this.is3dModel) {
            detail = detailList[0];
          } else {
            detail = detailList[index];
          }
          let detailObj = {};
          //只有切换产品或记录还原才重新渲染底图与纹理图，操作设计图片则不做此操作，解决渲染细节图的时候会闪的问题
          if (!detailImages[colorId][index].image) {
            //loadImg: 在maskImg加载出来后才去渲染其他图片，解决切换颜色会闪问题
            const loadImg = (imgurl) => {
              return new Promise((resolve, reject) => {
                let img = new Image();
                img.src = imgurl;
                img.onload = function(){
                  resolve();
                };
                img.onerror = function(){
                  resolve();
                }
              });
            }
            if(detail.texture) await loadImg(detail.texture);
            if(detail.is_user_defined == 1) { //自定义底板
              detailObj.is_user_defined = true
              detailObj.boardArr = []
              detailObj.baseWidth = detail.base_width
              detailObj.boardImg = ''
              // 计算前面独有底板个数(自定义底板也属于独有底板)
              let customIndex = 0, userDefineIndex = 0;
              for(let i=0; i< detailList.length; i++){
                const detail = detailList[i];
                if(detail.is_user_defined==1) userDefineIndex++;
                if(detail.is_user_defined==1 || detail.is_custom) customIndex++;
                if(i===index){
                  detailObj.userDefineIndex = userDefineIndex;
                  detailObj.customIndex = customIndex;
                  break;
                }
              }
              for(let de of detail.detail) {
                detailObj.boardArr.push({
                  maskImg: de.texture,
                  image: de.image,
                  bgColor: de.bgColor,
                  type: de.parts ? de.parts[0].type : null,
                  transform: de.transform,
                  left: 0,
                  top: 0,
                  width: detail.base_width,
                  height: detail.base_width,
                  radius: 0,
                  isText: de.type == 3 ? true : false,
                  detail: de,
                  layoutId: de.layoutId
                  // parts: de.parts
                })
              }
            }else {
              detailObj.maskImg = detail.texture;
              detailObj.image = detail.image;
              // detailObj.rendered = true;
              if (detail.parts) detailObj.type = detail.parts[0].type;
              // detailObj.visualizationHtml = outerHTML;
              detailObj.is_custom = detail.is_custom;
              // 计算前面独有底板个数(自定义底板也属于独有底板)
              let customIndex = 0;
              for (let i = 0; i < detailList.length; i++) {
                const detail = detailList[i];
                if (detail.is_custom || detail.is_user_defined==1) customIndex++;
                if (i == index) {
                  detailObj.customIndex = customIndex;
                  break;
                }
              }
            }
            detailImages[colorId].splice(index, 1, detailObj);
          }
          if (this.productHasDetail) {
            if(detail.is_user_defined == 1) { //自定义底板
              let promises = []
              let i = 0
              for(let de of detail.detail) {
                if(de.type == 1 || de.type == 2) { //底板类型 1: 底板图  2：底板模型 4: 背景图
                  if(de.parts) {
                    await this.createDetailCanvas({
                      detailImg: de,
                      viewDesigns: this.viewDesigns,
                      colorId: colorId,
                      renderIndex: index,
                      boardIndex: i,
                      baseWidth: detail.base_width,
                      detailImages,
                      flag,
                      viewId,
                      isPartChange,
                      operateType
                    })
                  }
                } 
                i += 1
              }
              this.drawBoardImg({
                detailImages,
                baseWidth: detail.base_width,
                colorId: colorId,
                renderIndex: index,
              })
              resolve()
            }else {
              this.createDetailCanvas({
                detailImg: detail,
                viewDesigns: this.viewDesigns,
                colorId: colorId,
                renderIndex: index,
                baseWidth: this.productData.base_width,
                detailImages,
                flag,
                viewId,
                isPartChange,
                operateType
              }).then(() => {
                resolve();
              });
            }
            // }
          } else {
            for (let item of this.viewImgObj) {
              if (item.id == viewId) {

                let curS = this.getCurStageLayer({ viewId: item.id });
                let layer = curS.layer;
                let layerBg = curS.layerBgGroup;
                let designContainerGroup = curS.designContainerGroup.clone();

                designContainerGroup.findOne(".print_area_border_outer").destroy()

                let overspreadPath = designContainerGroup.findOne('.overspreadPath');
                if(overspreadPath) overspreadPath.destroy()
                if(this.m_clip_isCliping && designContainerGroup.findOne('.clipingImg')){
                  await this.m_clip_replaceClipImage(designContainerGroup.findOne('.clipingImg'));
                }

                let ratio = layer.getAttrs().ratio;
                let printArea = null;
                for (let view of this.productData.views) {
                  if (view.id == viewId) {
                    // productView = view;
                    printArea = view.print_area;
                  }
                }
                let pixelRatio = 700 / layerBg.width(); //细节图大图width: 700
                if (
                  // productView.pointout_print_areas &&
                  // productView.pointout_print_areas.soft_svg &&
                  printArea &&
                  printArea.soft_svg
                ) {
                  await (() => {
                    return new Promise((resolve, reject) => {
                      designContainerGroup.clipFunc((ctx) => {
                        ctx.save();
                        ctx.translate(
                          -designContainerGroup.x(),
                          -designContainerGroup.y()
                        );
                        ctx.scale(1 / ratio, 1 / ratio);
                        new Konva.Path({
                          data: printArea.soft_svg,
                          stroke: "",
                          strokeWidth: 1,
                          // name: "auxiliaryPath pointoutPrint-area",
                        })._sceneFunc(ctx);
                        ctx.restore();
                        resolve();
                      });
                      let canvas = designContainerGroup.toCanvas()
                      designContainerGroup._drawChildren(
                        "drawScene",
                        canvas,
                        "top"
                      );
                    });
                  })();
                }
                let src = designContainerGroup.toDataURL({
                  x: 0,
                  y: 0,
                  pixelRatio,
                  width: layerBg.width(),
                  height: layerBg.height(),
                })
                designContainerGroup.destroy()
                if(detail.is_user_defined == 1) {
                  let i = 0
                  for(let item of detail.detail) {
                    if(item.id == viewId)
                    detailImages[colorId][index].boardArr[i].canvasImgArr = [src]
                    i += 1
                  }
                  this.drawBoardImg({
                    detailImages,
                    baseWidth: detail.base_width,
                    colorId: colorId,
                    renderIndex: index,
                  })
                } else {
                  detailImages[colorId][index].rendered = true;
                  this.$set(detailImages[colorId][index], "canvasImgArr", [src]);
                }
                this.cloneStageDone = true
                if(this.createProductInit) {
                  this.createMainImg({detailImagesObj: detailImages[colorId][index]})
                  this.createProductInit = false
                }
                resolve();
              }
            }
          }
        } else {
          resolve();
        }
      });
    },
    async drawBoardImg({
      detailImages, 
      baseWidth,
      colorId,
      renderIndex
    }) {
      let canvas = document.createElement('canvas')
      canvas.width = baseWidth
      canvas.height = baseWidth
      let ctx = canvas.getContext('2d')
      for(let item of detailImages[colorId][renderIndex].boardArr) {
        if(item.detail.type == 5) break //type=5 布局
        ctx.save()
        if(!item.bgColor && !item.isText) {
          const layoutIndex = detailImages[colorId][renderIndex].boardArr.findIndex(b => {return b.detail.type == 5}) //存在布局
          if(layoutIndex != -1) {
            for(let layout of detailImages[colorId][renderIndex].boardArr[layoutIndex].detail.layout_data) {
              if(layout.layoutId == item.layoutId) {
                this.radiusRect(parseFloat(layout.x), parseFloat(layout.y), parseFloat(layout.width), parseFloat(layout.height), parseFloat(layout.radius), ctx)
                ctx.clip()
              }
            }
          }
        }
        if(!item.transform) item.transform = "matrix(1,0,0,1,0,0)" //背景色没传矩阵
        let m = item.transform.substring(7, item.transform.length -1).split(',')
        ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5])
        if(item.bgColor) {
          ctx.fillStyle = item.bgColor
          ctx.fillRect(item.left, item.top, item.width, item.height);
        }else if(item.isText) {
          await this.drawText({data: item.detail, ctx})
        }else {
          if(item.image) {
            await this.drawImage({url: item.image, data: item, ctx})
          }
          if(item.canvasImgArr) {
            for(let canvasimg of item.canvasImgArr) {
              await this.drawImage({url: canvasimg, data: item, ctx})
            }
          }
          if(item.maskImg) {
            await this.drawImage({url: item.maskImg, data: item, ctx})
          }
        }
        ctx.restore()
      }
      detailImages[colorId][renderIndex].rendered = true;
      detailImages[colorId][renderIndex].boardImg = canvas.toDataURL()
    },
    radiusRect(left, top, width, height, r, ctx){
      const pi = Math.PI;
      ctx.beginPath();
      ctx.arc(left + r, top + r, r, - pi, -pi / 2);
      ctx.arc(left + width - r, top + r, r, -pi / 2, 0);
      ctx.arc(left + width - r, top + height - r, r, 0, pi / 2);
      ctx.arc(left + r, top + height - r, r, pi / 2, pi);
      ctx.closePath();
        
    },
    drawImage({url, data, ctx}) {
      return new Promise((resolve, reject) => {
        let img = new Image()
        img.src = url
        img.setAttribute("crossOrigin", "anonymous");
        img.onload = () => {
          // ctx.save()
          // let m = data.nodeTransform.m
          // ctx.rect(layout.left, layout.top, layout.width, layout.height)
          
          // ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5])
          ctx.drawImage(img, 0, 0, data.width, data.height)
          // ctx.restore()
          resolve()
        }
        img.onerror = () => {
          reject()
        }
      })
    },
    drawText({
      data,
      colorId,
      renderIndex,
      boardIndex = null,
      baseWidth,
      detailImages,
      ctx
    }) {
      return new Promise(async (resolve) => {
        // let canvas = document.createElement('canvas')
        // canvas.width = baseWidth
        // canvas.height = baseWidth
        // let ctx = canvas.getContext('2d')
        // let m = data.transform.substring(7, data.transform.length -1).split(',')
        // ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5])
        await loadFont(
          data.tspans[0].fontFamily
        );
        ctx.textAlign = data.tspans[0].textAnchor
        ctx.fillStyle = data.tspans[0].fill;
        ctx.strokeStyle = data.strokeValue;
        ctx.font = `${data.tspans[0].fontSize} ${data.tspans[0].fontFamily}`
        ctx.lineWidth = data.strokeWidth
        ctx.lineJoin = 'round'
        data.tspans.map((item, i) => {
          ctx.fillText(item.content, item.x, item.y)
          if(parseFloat(data.strokeWidth)) {
            ctx.strokeText(item.content, item.x, item.y);
          }
        })
        // ctx.restore()
        // this.$set(
        //   detailImages[colorId][renderIndex].boardArr[boardIndex],
        //   "canvasImgArr",
        //   [canvas.toDataURL()]
        // );
        resolve()
      })
    },
    checkDestroyLayerImg(mainImgLayer, isColorChange) {
      return (
          mainImgLayer.visible()
          && !isColorChange
          && mainImgLayer.find('Image').every(i => !i.name().includes('part'))
      ) || this.partInfos.type === 'part'
    },
    async createMainImg({ detailImagesObj, isColorChange = false }) {
      const productViews = [this.overallDesignView, ...this.productData.views]
      for(let view of productViews) {
        const viewId = view.id 
        const curS = this.getCurStageLayer({ viewId })
        const currentStage = curS.stage
        const mainImgLayer = curS.mainImgLayer
        if(this.checkDestroyLayerImg(mainImgLayer, isColorChange)) continue
        let canvas = document.createElement('canvas')
        canvas.width = currentStage.findOne(".layerBgGroup").width()
        canvas.height = currentStage.findOne(".layerBgGroup").width()
        let ctx = canvas.getContext('2d')
        if(detailImagesObj.image != '') {
          await this.drawImage({url: detailImagesObj.image, data: {width: canvas.width, height: canvas.height}, ctx})
        }
        for(let item of detailImagesObj.canvasImgArr) {
          await this.drawImage({url: item, data: {width: canvas.width, height: canvas.height}, ctx})
        }
        if(detailImagesObj.maskImg != '') {
          await this.drawImage({url: detailImagesObj.maskImg, data: {width: canvas.width, height: canvas.height}, ctx})
        }
        await this.layerAddImg({src: canvas.toDataURL(), viewId})
        mainImgLayer.show()
        // this.showTouchAnimation = true;
      }
      // 显示主图时，若存在图层，则不显示点击定制动画
      let curView = productViews.find(v=>v.id==this.viewId)
      this.showTouchAnimation = !this.checkHasDesign({views: [curView]});
      this.checkShowOverallDesignTip()
    },
    layerAddImg({ src, viewId }) {
      return new Promise((resolve, reject) => {
        const curS = this.getCurStageLayer({ viewId })
        const currentStage = curS.stage
        const mainImgLayer = curS.mainImgLayer
        let img = new Image();
        img.setAttribute("crossOrigin", "anonymous");
        img.src = src;
        img.onload = function () {
          var image = new Konva.Image({
            x: 0,
            y: 0,
            image: img,
            // width: currentStage.findOne(".layerBg").width(),
            // height: currentStage.findOne(".layerBg").height(),
            width: currentStage.findOne(".layerBgGroup")
              ? currentStage.findOne(".layerBgGroup").width()
              : 0,
            height: currentStage.findOne(".layerBgGroup")
              ? currentStage.findOne(".layerBgGroup").width()
              : 0,
          });
          mainImgLayer.findOne('Image') && mainImgLayer.findOne('Image').destroy()
          mainImgLayer.add(image);
          mainImgLayer.batchDraw();
          resolve();
        };
        img.onerror = function () {
          resolve();
        };
      })
    },
    // index标记效果图索引
    createDetailCanvas({
      detailImg,
      viewDesigns,
      colorId,
      renderIndex,
      boardIndex = null,
      baseWidth,
      detailImages,
      flag = 0,
      viewId,
      isPartChange = false,
      operateType = ''
    }) {
      return new Promise((resolve, reject) => {
        let parts = detailImg.parts;
        // let visualizationCanvas = $('<div class="visualization-canvas">');
        // 所有异步处理数组
        let canvasImgArr = [];
        let promises = [];
        // promises.push(obj.imagesComplete([detailImg.image, detailImg.texture]));
        let threeDetailFlag = false; //3D图是否渲染完
        let mainImg = ''
        for (let part of parts) {
          if (part.type == 0) {
            //画布图
            for (let item of this.viewImgObj) {
              if (item.id == part.target_view_id) {
                // let canvasImage = $('<img class="canvasImage">');
                // visualizationCanvas.append(canvasImage);
                let canvasConfig = part.canvas_config;
                let views = this.getViews(part.target_view_id);
                const promise = this.initCanvas(
                  canvasConfig,
                  item.viewDesign,
                  views.print_area,
                  part.mask?.image_url,
                  views
                  // canvasImage
                ).then((data) => {
                  canvasImgArr.push(data.src);
                  // this.detailImages[colorId][renderIndex].canvasImgArr = canvasImgArr
                  // this.$set(this.detailImages[colorId][renderIndex], 'canvasImgArr', canvasImgArr)
                  // this.$store.commit("gallery/getDetailImageList", {data: this.detailImages[colorId]});
                });

                promises.push(promise);
                break;
              }
            }
          } else if (part.type == 1) {
            //遮罩图
            // let img =
            // '<img class="visualization-mask" src="' +
            // part.cover_img.image_url +
            // '">';
            // visualizationCanvas.append(img);
            detailImages[colorId][renderIndex].maskImg =
              part.cover_img.image_url;
            detailImages[colorId][renderIndex].rendered = true;
          } else if (part.type == 2) {
            if(part.detail3D) { //兼容模型被删除的情况
              //3D图
              if (threeDetailFlag) continue; //3D所有part效果合成一张
              threeDetailFlag = true;
              // let threeDetail = $('<img class="threeDetail">');
              // visualizationCanvas.append(threeDetail);
              const promise = this.create3DDetail(
                detailImg,
                // threeDetail,
                colorId,
                renderIndex,
                boardIndex,
                baseWidth,
                flag,
                viewId,
                isPartChange,
                operateType
              ).then((data) => {
                if(this.isLargePreview || boardIndex != null) {
                  canvasImgArr.push(data.src);
                }
                if(data.mainImg) {
                  mainImg = data.mainImg
                }
              });
              promises.push(promise);
            }
          }
        }
        Promise.all(promises).finally(() => {
          this.$set(
            detailImages[colorId][renderIndex],
            "rendered",
            true
          );
          if(boardIndex != null) {
            this.$set(
              detailImages[colorId][renderIndex].boardArr[boardIndex],
              "canvasImgArr",
              canvasImgArr
            );
          } else {
            this.$set(
              detailImages[colorId][renderIndex],
              "canvasImgArr",
              canvasImgArr
            );
          }
          resolve();
          this.cloneStageDone = true
          if(this.createProductInit) {
            this.createMainImg({detailImagesObj: {image: detailImages[colorId][0].image, maskImg: detailImages[colorId][0].maskImg, canvasImgArr: [mainImg]}})
            this.createProductInit = false
          }
        });
      });

      // 等待图片全部处理完成
      // let [imgs, ...arr] = await Promise.all(promises);

      // imgs[0] && obj.DaddClass(imgs[0], "visualization-baseMap");
      // imgs[1] && obj.DaddClass(imgs[1], "visualization-maskMap");
      // visualizationCanvas.append(imgs[0]);
      // visualizationCanvas.append(imgs[1]);

      // return visualizationCanvas;
    },
    // index标记效果图索引
    async create3DDetail(
      detailImg,
      // threeDetail,
      colorId,
      renderIndex,
      boardIndex,
      baseWidth,
      flag = 0,
      viewId,
      isPartChange = false,
      operateType = ''
    ) {
      let _this = this;
      // 模型数据
      const modelOptions = detailImg.parts;
      let faceListMap = {};
      for (let item of this.viewImgObj) {
        if (this.mergeAllView || flag == 0 || boardIndex != null) { //全副产品或者应用到所有面，需要把所有面都传给3d
          faceListMap[item.id] = item.viewDesignCanvas;
        } else if (item.id == viewId) {
          faceListMap[item.id] = item.viewDesignCanvas;
        }
      }
      const modelNum = modelOptions.length;
      if (flag == 0) {
        if(operateType == 'switchColor') { //2021年12月新加需求:不同的颜色可以配不同的模型 小图是canvas 没有缓存 切换颜色需要重新加载模型
          destroy3DModel({
            threeDApp,
            detailImages: this.detailImages,
          })
          if(!this.isLargePreview && this.is3dModel) {
            destroy3DModelIs3D(keepThreeDApp)
          }
        }
      }
      
      // const faceListMap = obj.faceListMap;
      return new Promise(async (resolve, reject) => {
        let drawApp;
        // const code = this.productData.code + `${this.is3dModel ? '-3d-' : '-'}` + renderIndex;
        const boardCode = boardIndex != null ? `-bord${boardIndex}` : ''
        let code = ''
        if(this.isLargePreview) {
          if(this.is3dModel) {
            code = `${this.productData.code}-large-is3dModel`
          } else {
            code = this.productData.code + "-large-renderIndex-" + renderIndex + '-colorId-' + colorId + boardCode
          }
          for (let app of threeDApp) {
            if (app.code == code) {
              drawApp = app.drawApp;
              break;
            }
          }
        } else {
          if(this.is3dModel) {
            code = `${this.productData.code}-small-is3dModel`
            for (let app of keepThreeDApp) {
              if (app.code == code) {
                drawApp = app.drawApp;
                break;
              }
            }
          } else {
            code = this.productData.code + "-small-renderIndex-" + renderIndex + '-colorId-' + colorId + boardCode
            for (let app of threeDApp) {
            if (app.code == code) {
              drawApp = app.drawApp;
              break;
            }
          }
          }
        }
        if (drawApp) {
          if(!this.isLargePreview && boardIndex == null) {
            resolve({src: ''})
          }
          if(isPartChange) {
            const partCheckedList = this.$store.state.product.partCheckedList
            const partCheckedObj = partCheckedList[partCheckedList.findIndex(item => {return item.isChecked})]
            this.$refs.ModelPartsPreview.updatePart(partCheckedObj.partId, partCheckedObj.childPartId, partCheckedObj.colorId)
            drawApp.updatePart(partCheckedObj.partId, partCheckedObj.childPartId, partCheckedObj.colorId, (src) => {
              if(this.isLargePreview || boardIndex != null) {
                resolve({ src });
              }
            })
            // if(this.productData.is_show_3dimg != -1 && this.is3dModel) { //转模型角度
            //   let anglePosition = null
            //   this.productData.show_3d_model.detail3d,parts.forEach(item => {
            //     if(item.part_id == partCheckedObj.partId) {
            //       anglePosition = item.params
            //       if(anglePosition) {
            //         drawApp.updateAngle('', anglePosition, partCheckedObj.partId, partCheckedObj.childPartId)
            //       }
            //     }
            //   })
            // }
          } else {
            drawApp.updateFaceListMap(faceListMap, (src) => {
              // threeDetail.attr("src", src);
              // this.$set(this.detailImages[colorId][renderIndex], 'canvasImgArr', [src])
              if(this.isLargePreview || boardIndex != null) {
                resolve({ src });
              }
            });
          }
        } else {
          let modelNumTotal = modelNum;
          for (let app of threeDApp) {
            modelNumTotal += app.modelNum;
          }
          /**
           * 内存最大模型数量
           * keepThreeDApp 存放3d模型与主图模型，切产品之前都不销毁
          */
          const modelLimit = 16 - keepThreeDApp.reduce((total, cur) => total + parseInt(cur.modelNum), 0) - 1;
          let excessNum = modelNumTotal - modelLimit;
          if (excessNum >= 0) {
            destroy3DModel({
              threeDApp,
              detailImages: this.detailImages,
              deleteNum: excessNum
            })
          }
          await this.$nextTick()
          const mainImgDrawAppIndex = keepThreeDApp.findIndex(item => item.code == `${this.productData.code}-mainImage-${colorId}`)
          let container = null, imgSrc = ''
          if(this.isLargePreview) {
            container = document.getElementById('3dCanvasLarge')
          } else if(this.is3dModel) {
            //小图3d模型
            container = document.getElementById('3dCanvas')
          } else if(boardIndex == null) {
            //小图非自定义底板
            container = document.getElementById(`3dCanvas${renderIndex}`)
          }
          await new Promise((r) => {
            const drawApp = new composeDetail3D({
              baseWidth,
              modelOptions,
              faceListMap,
              // canvas: this.is3dModel ? (this.isLargePreview ? document.getElementById('3dCanvasLarge') : document.getElementById('3dCanvas')) : null,
              // container: this.isLargePreview || (!this.isLargePreview && boardIndex != null) ? null : document.getElementById(`3dCanvas${renderIndex}`),
              container,
              type: this.get3DType({boardIndex, boardType: detailImg.type}),
              partIds: this.$store.state.product.partCheckedList,
              callBack(src) {
                imgSrc = src
                r()
                if(_this.isLargePreview || mainImgDrawAppIndex != -1 || _this.is3dModel) {
                  resolve({ src });
                }
              },
            });
            if(!this.isLargePreview && this.is3dModel) {
              keepThreeDApp.push({ code, drawApp, modelNum });
            } else {
              threeDApp.push({ code, drawApp, modelNum });
            }
          })
          if(mainImgDrawAppIndex == -1 && !this.is3dModel && !this.isLargePreview) { //初始化或切产品画布上需要展示主图,切换颜色也需要，3d模型不需要主图
            const drawApp2 = new composeDetail3D({
              baseWidth,
              modelOptions: this.productData.colors[this.productData.colors.findIndex(item => item.id == colorId)].detail[0].parts,
              faceListMap,
              canvas: null,
              container: null,
              type: 5,
              partIds: this.$store.state.product.partCheckedList,
              callBack(src) {
                resolve({ mainImg: src, src: imgSrc });
              },
            });
            keepThreeDApp.push({ code: `${this.productData.code}-mainImage-${colorId}`, drawApp: drawApp2, modelNum });
          }
        }
      });
    },
    get3DType({boardIndex, boardType}) {
      let type = 0
      if(this.is3dModel) {
        type = 2
      }else if(this.isLargePreview && boardIndex != null ) {
        type = 6
      }else if(this.isLargePreview && boardIndex == null) {
        type = 5
      }else if(!this.isLargePreview && boardIndex != null) {
        type = 4
      }else if(!this.isLargePreview && boardIndex == null) {
        type = 3
      }
      if(boardIndex != null && boardType == 1) { //boardType: 1: 底板图片  2: 底板模型
        type = 5
      }
      return type
    },
    initCanvas(canvasConfig, src, printArea, clipImg, views) {
      return new Promise((resolve, reject) => {
        let _this = this;
        let canvas = document.createElement("canvas");
        //后台基于600px计算
        canvas.width = 600;
        canvas.height = 600;
        let count = 10;
        let ctx = canvas.getContext("2d");
        // if(views.print_area && views.print_area.soft_svg) { //存在裁切线，顺序需要是先在画布生成图再裁切
        //   ctx.save()
        //   let ratio = views.width / 600
        //   ctx.scale(1 / ratio, 1 / ratio);
        //   new Konva.Path({
        //     data: print_area.soft_svg,
        //     listening: false,
        //     isPlugin: true,
        //   })._sceneFunc(ctx);
        //   ctx.restore()
        //   ctx.clip()
        // }
        let dots = [];
        let dotscopy, idots;
        let img = new Image();
        img.setAttribute("crossOrigin", "anonymous");
        img.src = src;
        let img2;
        if (clipImg) {
          img2 = new Image();
          img2.setAttribute("crossOrigin", "anonymous");
          img2.src = clipImg;
        }

        let WIDTH = parseInt((printArea.width / printArea.view_width) * 600);
        let HEIGHT = parseInt((printArea.height / printArea.view_width) * 600);
        let meshObj = zw_Mesh2D.createMapMesh(
          WIDTH,
          HEIGHT,
          FISH_DIV,
          FISH_DIV_h
        );

        img.onload = function () {
          let img_w = WIDTH;
          let img_h = HEIGHT;
          let left = parseInt((printArea.offset_x / printArea.view_width) * 600);
          let top =
            parseInt((printArea.offset_y / printArea.view_width) * 600) || 0.5;
          dots = [
            {
              x: left,
              y: top,
            },
            {
              x: left + img_w,
              y: top,
            },
            {
              x: left + img_w,
              y: top + img_h,
            },
            {
              x: left,
              y: top + img_h,
            },
          ];
          //保存一份不变的拷贝
          dotscopy = [
            {
              x: left,
              y: top,
            },
            {
              x: left + img_w,
              y: top,
            },
            {
              x: left + img_w,
              y: top + img_h,
            },
            {
              x: left,
              y: top + img_h,
            },
          ];
          meshObj.move(left, top);
          if (canvasConfig) {
            dots = JSON.parse(canvasConfig);
          }
          render();
        };

        function render() {
          let srcCorners;
          let dstCorners;
          let perspT;

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          srcCorners = [
            dotscopy[0].x,
            dotscopy[0].y,
            dotscopy[1].x,
            dotscopy[1].y,
            dotscopy[2].x,
            dotscopy[2].y,
            dotscopy[3].x,
            dotscopy[3].y,
          ];

          dstCorners = [
            dots[0].x,
            dots[0].y,
            dots[1].x,
            dots[1].y,
            dots[2].x,
            dots[2].y,
            dots[3].x,
            dots[3].y,
          ];
          /* 透视变化矩阵计算 */
          perspT = zw_PerspT(srcCorners, dstCorners);
          for (let i = 0; i < meshObj.points.length; i++) {
            let newPoint = perspT.transform(
              meshObj.points[i].x,
              meshObj.points[i].y
            );
            meshObj.points[i].x = newPoint[0];
            meshObj.points[i].y = newPoint[1];
          }
          /**
           * 兼容Safari
           * 在Safari使用globalCompositeOperation，会使浏览器绘图阻塞导致卡顿
           * 解决办法：在有透明颜色的时候才使用此属性
           */
          // if(_this.hasOpacity({viewId: _this.viewId})) {
          //   ctx.globalCompositeOperation = "destination-atop";
          // }
          if (
            navigator.userAgent
              .toLowerCase()
              .match(/version\/([\d.]+).*safari/) == null
          ) {
            ctx.globalCompositeOperation = "destination-atop";
          } else {
            ctx.globalCompositeOperation = "lighter";
          }
          meshObj.drawImageToContext(img, ctx);
          // ctx.drawImage(img, 0, 0)

          if (clipImg) {
            if (img2.complete) {
              maskImg();
              createCanvasImage();
            } else {
              img2.onload = function () {
                maskImg();
                createCanvasImage();
              };
            }
          } else {
            createCanvasImage();
          }
        }

        function createCanvasImage() {
          let src = canvas.toDataURL("image/png", 1.0);
          // canvasImage.attr("src", src);
          resolve({ src: src });
        }

        function maskImg() {
          ctx.save();
          //重新画的时候找个属性要去掉，不然都是已找个属性是操作
          ctx.globalCompositeOperation = "destination-in";
          ctx.drawImage(img2, 0, 0, 600, 600);
          ctx.restore();
        }
      });
    },
    // hasOpacity({viewId}) {
    //   let curS = this.getCurStageLayer({ viewId });
    //   let currentStage = curS.stage;
    //   let layer = curS.layer;
    //   if(layer.findOne(".bgRect") && layer.findOne(".bgRect").visible()) { // 判断背景色透明返回true
    //     let node = layer.findOne(".bgRect")
    //     let colorData = formateColor({ color: node.fill() });
    //     let fillOpacity = colorData.alpha
    //     if(fillOpacity != '' && fillOpacity > 0 && fillOpacity < 1) {
    //       return true
    //     }
    //   }
    //   let hasOpacity = false
    //   if(layer.find(".designText").length > 0) {
    //     for(let node of layer.find(".designText")) {
    //       if(node.visible()) {
    //         let text = node.findOne("Text")
    //         let colorData = formateColor({ color: text.fill() });
    //         let fillOpacity = colorData.alpha
    //         if(fillOpacity != '' && fillOpacity > 0 && fillOpacity < 1) {
    //           hasOpacity = true
    //           break
    //         }
    //       }
    //     }
    //   }
    //   return hasOpacity
    // },
    baseImgChange({ colorId }) {
      let _this = this;
      return new Promise((resolve, reject) => {
        if(this.isLargePreview) { //大图切颜色是独立的，不要影响小图
          resolve()
          return
        }
        for (let item of this.productData.colors) {
          if (item.id == colorId) {
            for (let view of item.views) {
              let promises = [];
              let curS = _this.getCurStageLayer({ viewId: view.id });
              let stage = curS.stage;
              let layer = curS.layer;
              let designContainerGroup = curS.designContainerGroup;
              if (layer.findOne(".product_type_view")) {
                //有底图说明没有裁切线，产品定义没有裁切线才展示底图和肌理图
                promises.push(
                  new Promise((resolve, reject) => {
                    let img = new Image();
                    img.setAttribute("crossOrigin", "anonymous");
                    img.src = view.image;
                    img.onload = function () {
                      layer.findOne(".product_type_view").image(img);
                      // layer.findOne('.product_type_view').moveToBottom()
                      layer.batchDraw();
                      resolve();
                    };
                    img.onerror = function () {
                      resolve();
                    };
                  })
                );
                if (view.texture != "") {
                  promises.push(
                    new Promise((resolve, reject) => {
                      let imgtexture = new Image();
                      imgtexture.setAttribute("crossOrigin", "anonymous");
                      imgtexture.src = view.texture;
                      imgtexture.onload = function () {
                        if (layer.findOne(".product_type_BaseMap")) {
                          layer
                            .findOne(".product_type_BaseMap")
                            .image(imgtexture);
                        } else {
                          var image = new Konva.Image({
                            x: 0,
                            y: 0,
                            image: imgtexture,
                            width: stage.findOne(".layerBg").width(),
                            height: stage.findOne(".layerBg").height(),
                            name: "product_type_BaseMap",
                          });
                          image.listening(false);
                          layer.add(image);
                        }
                        layer.batchDraw();
                        resolve();
                      };
                      imgtexture.onerror = function () {
                        resolve();
                      };
                    })
                  );
                }
              }
              Promise.all(promises).finally(() => {
                // this.initPreviewStage({ viewId: view.id });
                resolve();
              });
            }
          }
        }
      });
    },
    getViews(viewId) {
      var views;
      for (var i = 0; i < this.productData.views.length; i++) {
        if (this.productData.views[i].id == viewId) {
          views = this.productData.views[i];
          break;
        }
      }

      return views;
    },
    setLayerImgList({
      viewId,
      node,
      isAdd = false,
      isDelete = false,
      isVagueData = null,
      transformData,
      overspreadData,
      type,
      isUpdatePrice = true,
    }) {
      for (let item of this.layerImgList) {
        if (item.id == viewId) {
          this.$set(item, "overspreadData", overspreadData);
          // let designArr;
          if (isVagueData) {
            //图片变形提示
            for (let img of item.childrens) {
              if (type == "image" && img.index == node.index) {
                this.$set(img, "isVagueData", isVagueData);
                this.$set(img, "transformData", transformData);
                this.canvasQuality({ viewId });
                // img.isVagueData = isVagueData
                // img.transformData = transformData
              }
            }
            break;
          }
          if (isAdd) {
            if (type == "bgcolor") {
              item.bgcolor = node.fill();
            } else {
              node.type = type;
              this.$set(node, "isLock", false);
              this.$set(node, "isHidden", false);
              this.$set(node, "isError", false);
              this.$set(node, "isSelected", false);
              if(node.hasName('isBg')){
                item.childrens.push(node);
              } else{
                item.childrens.unshift(node);
              }

              if (node.type == "image" && isUpdatePrice) {
                eventBus.$emit("updatePrice");
              }
            }
          }
          if (isDelete) {
            if (type == "bgcolor") {
              item.bgcolor = "";
            } else {
              item.childrens.filter((img, index) => {
                if (img._id == node._id) {
                  item.childrens.splice(index, 1);
                }
              });
              if (node.type == "image" && isUpdatePrice) {
                eventBus.$emit("updatePrice");
              }
            }
          }
          this.canvasQuality({ viewId });
        }
      }
      this.$store.commit("gallery/getDesignImgList", {
        data: this.layerImgList,
      });
    },
    // 更新左侧图层的选中状态
    updateLayerImgListAttr(){
      this.layerImgList.forEach((o) => {
        if (o.childrens.length > 0) {
          o.childrens.forEach((i) => {
            const nodes = Array.isArray(this.curNode) ? this.curNode : (this.curNode ? [this.curNode] : []);
            if(nodes.find(k=>k._id == i._id)){
              i.isSelected = true;
            } else {
              i.isSelected = false;
            }
          });
        }
      });
    },
    toLayer() {
      this.$store.commit('layout/toggleLayer', true);
      if(this.$store.state.layout.isLeftHidden){
        this.$store.commit("layout/toggleLeft", false);
      }
    },
    canvasQuality({ viewId = this.viewId } = {}) {
      let vagueDataArr = [],
        overspreadData = null,
        childrensLength = 0;
      for (let item of this.layerImgList) {
        if (item.id == viewId) {
          overspreadData = item.overspreadData;
          //图片变形提示
          childrensLength = item.childrens.length;
          for (let img of item.childrens) {
            if (img.isVagueData && img.isVagueData.type) {
              vagueDataArr.push(img.isVagueData.type);
            }
          }
        }
      }
      let curS = this.getCurStageLayer({ viewId });
      let layer = curS.layer;
      let design = layer.find(".design");
      const productViews = [this.overallDesignView, ...this.productData.views]
      let productView = productViews.find((item) => {
        return item.id == viewId
      });
      if(!productView) return
      //childrensLength：由于添加图片的时候，画布还没画就执行setLayerImgList，所以design不会有数据
      if (design.length || childrensLength) {
        this.$set(productView, "hasDesignClass", "has-design");
      } else {
        this.showTouchAnimation = true
        this.checkShowOverallDesignTip()
        this.$set(productView, "hasDesignClass", "");
      }
      let vaguetype = Math.max(...vagueDataArr);
      let qualityText = '';
      switch (vaguetype) {
        case 1:
          this.canvasMess.quality = "轻微模糊";
          this.canvasMess.qualityClass = "remind-tips";
          qualityText = '图片像素不足放大，轻微影响生产印刷清晰度！';
          this.$set(productView, "qualityClass", "remind-tips");
          this.$set(productView, "qualityText", qualityText);
          break;
        case 2:
          this.canvasMess.quality = "比较模糊";
          this.canvasMess.qualityClass = "warning-tips";
          qualityText = '图片像素不足放大，比较影响生产印刷清晰度！';
          this.$set(productView, "qualityClass", "warning-tips");
          this.$set(productView, "qualityText", qualityText);
          break;
        case 3:
          this.canvasMess.quality = "严重模糊";
          this.canvasMess.qualityClass = "error-tips";
          qualityText = '图片像素不足放大，严重影响生产印刷清晰度！';
          this.$set(productView, "qualityClass", "error-tips");
          this.$set(productView, "qualityText", qualityText);
          break;
        default:
          this.canvasMess.quality = "优秀";
          this.canvasMess.qualityClass = "";
          this.$set(productView, "qualityClass", "");
          this.$set(productView, "qualityText", "");
          break;
      }
      if(overspreadData && overspreadData.text){
        this.$set(productView, "qualityClass", this.canvasMess.qualityClass || 'error-tips');
        this.$set(productView, "qualityText", (qualityText ? qualityText+'<br/>' : '') + "图片未铺满设计区域，产品生产可能存在留白！");
      }
    },
    getCloneViewLength() {
      let length = 0
      const isGroup = Array.isArray(this.curNode);
      //全副产品是否支持独立背景设计 => bg_ind: 1：支持独立设计，-1：不支持
      if(this.productData.imgFull==1 && this.productData.bg_ind == -1 && !isGroup && this.curNode && this.curNode.hasName('isBg')) {
        length = this.productData.views.length
        //模板会出现非全副模板用于全副产品，导致背景图不是所有面都有背景图
        // for(let item of this.productData.views) {
        //   let curS = this.getCurStageLayer({viewId: item.id})
        //   if(curS.layer.findOne('.isBg')) {
        //     length += 1
        //   }
        // }
      } else if(this.viewId == 9999) { //整体设计的图片在单独面操作后，这张图就要失去整体联动性
        this.productData.views.forEach(item => {
          const curS = this.getCurStageLayer({ viewId: item.id })
          const layer = curS.layer
          layer.find('.overallDesign').forEach(design => {
            if(design.getAttrs().overallDesignId == this.overallDesignId) {
              length += 1
            }
          })
        })
      }
      return length
    },
    async cloneStage({
      viewId,
      isInit = false,
      isPickColor = false,
      cloneStartTime = false,
      // hasBg = false,
      addDesign3d = false,
      cloneViewLength = this.getCloneViewLength()
    } = {}) {
      // let has3D = false;
      // let colors = JSON.parse(JSON.stringify(this.productData.colors));
      // for (let colorItem of colors) {
      //   if (colorItem.detail) {
      //     for (let det of colorItem.detail) {
      //       for (let part of det.parts) {
      //         if (part.type == 2) {
      //           //存在3d图
      //           has3D = true;
      //           break;
      //         }
      //       }
      //       if (has3D) break;
      //     }
      //   }
      //   if (has3D) break;
      // }
      if(viewId == 9999) return //整体设计面
      if(!isInit && !cloneViewLength) {
        let flag = false;
        if (!this.cloneStartTime) {
          this.cloneStartTime = new Date().getTime();
          flag = true;
        }
        let endTime = new Date().getTime();
        if (!flag && endTime - this.cloneStartTime < 60) {
          return
        }
        this.cloneStartTime = endTime;
      }
      // if (this.needCanvas) {
      //   //是3d的产品需要节流否则操作卡顿
      //   if (isInit || cloneStartTime) {
      //     this.cloneStartTime = null;
      //   }
      //   let flag = false;
      //   if (!this.cloneStartTime) {
      //     this.cloneStartTime = new Date().getTime();
      //     flag = true;
      //   }
      //   let endTime = new Date().getTime();
      //   if (endTime - this.cloneStartTime > 30) {
      //     flag = true;
      //   }
      //   this.cloneStartTime = endTime;
      //   if (!flag) {
      //     if (this.cloneTimeout) {
      //       clearTimeout(this.cloneTimeout);
      //     }
      //     this.cloneTimeout = setTimeout(() => {
      //       this.cloneStage({ viewId, isInit });
      //     }, 30);
      //     return false;
      //   }
      // }
      this.isChangeDesign = true;
      this.cloneStageDone = false
      const productViews = [this.overallDesignView, ...this.productData.views]
      for(let view of productViews) {
        const curStage = stageObj[`stage${view.id}`]
        if(curStage.findOne(".mainImgLayer")) {
          curStage.findOne(".mainImgLayer").hide()
        }
      }
      for (let item of this.viewImgObj) {
        if (item.id == viewId) {
          let curS = this.getCurStageLayer({ viewId });
          let layerBg = curS.layerBgGroup;
          let designContainerGroup = curS.designContainerGroup.clone();
          designContainerGroup.findOne(".print_area_border_outer").destroy()
          let overspreadPath = designContainerGroup.findOne('.overspreadPath');
          if(overspreadPath) overspreadPath.destroy()
          if(this.m_clip_isCliping && designContainerGroup.findOne('.clipingImg')){
            await this.m_clip_replaceClipImage(designContainerGroup.findOne('.clipingImg'));
          }
          if(this.need2dImg) {
            item.viewDesign = designContainerGroup.toDataURL({
              mimeType: "image/png",
              quality: 1,
              pixelRatio: 2,
              x: designContainerGroup.x(),
              y: designContainerGroup.y(),
              width: designContainerGroup.width(),
              height: designContainerGroup.height(),
            });
          }
            // document.getElementById('aaaa').src = item.viewDesign
          if (this.needCanvas) {
            //存在3D图
            let minWH = 0
            let printAreaWidth = 0
            for (let view of this.productData.views) {
              if (view.id == viewId) {
                minWH = Math.min(view.print_area.width, view.print_area.height)
                printAreaWidth = view.print_area.view_width
              }
            }
            let magnificationPower = 1
            if(minWH / printAreaWidth <= 0.3) { //针对领带这种细长的印刷区域，按原画布大小给3d合图会模糊，故放大画布
              magnificationPower = 1.4
              designContainerGroup.scale({
                x: magnificationPower,
                y: magnificationPower
              })
            }
            item.viewDesignCanvas = designContainerGroup.toCanvas({
              x: -designContainerGroup.x() * (magnificationPower - 1),
              y: -designContainerGroup.y() * (magnificationPower - 1),
              pixelRatio: 2,
              width: layerBg.width() * magnificationPower,
              height: layerBg.height() * magnificationPower,
            })
          }
          designContainerGroup.destroy()
          if (isPickColor) return; //取色器需要图片
        }
      }
      if (isInit) {
        //切换产品或记录还原
        this.cloneViewLength += 1;
        if (this.productData.views.length == this.cloneViewLength) {
          //所有面都渲染完后才执行细节图
          await this.setViewDesigns({
            flag: 0,
            operateType: "",
            colorId: this.curColorId,
            curIndex: 0,
            type: "detail",
            viewId
          });
          this.cloneViewLength = 0
        }
      } else {
        let canSetViewDesigns = false;
        if (cloneViewLength) { 
          this.cloneViewLength += 1;
          if (cloneViewLength == this.cloneViewLength) {
            canSetViewDesigns = true;
          }
        } else {
          canSetViewDesigns = true;
        }
        this.mergeAllView = cloneViewLength || addDesign3d
        if (canSetViewDesigns) {
          //操作设计
          await this.setViewDesigns({
            flag: 1,
            operateType: "",
            colorId: this.curColorId,
            curIndex: 0,
            type: "detail",
            viewId
          });
          this.cloneViewLength = 0;
        }
      }
      return ''
    },
    initPreviewStage({ viewId }) {
      this.previewStageObj[`previewStage${viewId}`].scaleX(
        60 / stageObj[`stage${viewId}`].width()
      );
      this.previewStageObj[`previewStage${viewId}`].scaleY(
        60 / stageObj[`stage${viewId}`].height()
      );
      this.previewStageObj[`previewStage${viewId}`].find(".layerBg").destroy();
      this.previewStageObj[`previewStage${viewId}`]
        .find(".designLayer")
        .destroy();
      this.previewStageObj[`previewStage${viewId}`].add(
        stageObj[`stage${viewId}`]
          .findOne(".layerBg")
          .clone({ listening: false })
      );
      this.previewStageObj[`previewStage${viewId}`].add(
        stageObj[`stage${viewId}`]
          .findOne(".designLayer")
          .clone({ listening: false })
      );
      this.previewStageObj[`previewStage${viewId}`].findOne(".designLayer");
      // .getContext().miterLimit = 3;
      this.previewStageObj[`previewStage${viewId}`]
        .find(".anchorGroup")
        .destroy();
      this.previewStageObj[`previewStage${viewId}`]
        .findOne(".designLayer")
        .batchDraw();
    },
    updatePreviewStage({ viewId, node }) {
      let clone = this.previewStageObj[`previewStage${viewId}`]
        .findOne(".designLayer")
        .findOne(`.design${node._id}`);
      if (!clone) return;
      clone.setAttrs(node.getAttrs());
      if (clone.hasName("designText")) {
        if (node.findOne("Text")) {
          clone.findOne("Text").setAttrs(node.findOne("Text").getAttrs());
          clone.findOne("Rect").setAttrs(node.findOne("Rect").getAttrs());
        } else {
          clone.destroy();
        }
      }
      this.previewStageObj[`previewStage${viewId}`]
        .find(".designLayer")
        .batchDraw();
    },
    partCheck(item) {
      this.$store.commit("layout/changeSelectType", "part");
      this.$store.commit('product/updatePartDetail', {showPartDetail: true, partDetail: item})
      this.$refs.ModelPartsPreview.setPart(item)
      this.$refs.ModelPartsPreview.getImg(this.m_mpp_getFaceListMap())
      this.updateAngle({init: false, type: 'part', partItem: item})
    },
    //切换面
    async changeStage({ viewId, init = false } = {}) {
      this.m_editText_handleOutsideClick('stopEdit')
      if (this.m_clip_isCliping) {
        await this.m_clip_implementClip()
      }
      // this.m_group_unbind({clear:true});
      this.viewId = viewId;
      // let allViewsCfg = this.$store.getters.allViewsCfg
      this.$store.commit("changeView", viewId);
      eventBus.$emit("changeTreeSelectNode", { viewId, data: null });
      this.$store.commit("changeCurNodeId", "view-" + viewId);
      let curS = this.getCurStageLayer({ viewId });
      let currentStage = curS.stage;
      let layer = curS.layer;
      const mainImgLayer = curS.mainImgLayer
      this.curNode = null
      for (let item of this.viewImgObj) {
        if (item.id == viewId) {
          this.viewName = item.name;
          this.$store.commit("product/UPDATE_SELECTED_VIEW_NAME", this.viewName);
          this.ratio = item.ratio;
          this.$store.commit("layout/changeSelectType", null);
          this.canvasQuality();
          // if (layer.find(".design").length <= 0 || mainImgLayer.visible()) {
          if (layer.find(".design").length <= 0) {
            this.showTouchAnimation = true;
            this.$nextTick(() => {
              this.touchAnimationPos({ viewId });
            });
          } else {
            this.showTouchAnimation = false;
          }
          this.checkShowOverallDesignTip()
          if (layer.findOne(".bgRect")) {
            this.background_color = layer.findOne(".bgRect").fill();
          } else {
            this.background_color = "";
          }
        } else {
          document.getElementById(`container${item.id}`).style.left =
            10000 + "px";
        }
      }
      this.updateAngle({viewId, init, type: 'view'})
      this.changeViewInit({ viewId });
      document.getElementById(`container${viewId}`).style.left =
        (document.getElementById("stageContainer").clientWidth -
          document.getElementById(`container${viewId}`).clientWidth) /
          2 +
        "px";
      this.setViewLeftTop({ viewId });
      this.printAreaTip({ currentStage });
      this.initRulerAll();

      if (!this.productHasDetail && viewId != 9999) {
        this.setViewDesigns({
          flag: 0,
          operateType: "",
          colorId: this.curColorId,
          curIndex: 0,
          type: "detail",
        });
      }
      this.drawGridLine();
    },
    updateAngle({viewId, init, type, partItem}) {
      let editingProduct = this.$store.state.product.editingProduct;
      let show3DModel = this.productData.show_3d_model[editingProduct.color] || this.productData.show_3d_model['default'];
      if(this.productData.is_show_3dimg != -1 && show3DModel && !init) { //转模型角度
        if(this.is3dModel) {
          if(this.detailImages[this.curColorId][0] && this.detailImages[this.curColorId][0].rendered) { //解决模型未渲染成功就切面报错，导致画布消失问题
            const app = keepThreeDApp.find(item => item.code == `${this.productData.code}-small-is3dModel`)
            if(type === 'view') {
              let anglePosition = null
              show3DModel.modelData.uvList.forEach(item => {
                if(item.faceList.length && item.faceList[0].view_id == viewId) {
                  anglePosition = item.faceList[0]['3d_show_params']
                  if(anglePosition) {
                    app.drawApp.updateAngle(viewId, anglePosition, 0)
                  }
                }
              })
            } else {
              const partCheckedList = this.$store.state.product.partCheckedList
              const partCheckedObj = partCheckedList[partCheckedList.findIndex(item => {return item.partId === partItem.part_id})]
              show3DModel.detail3d.parts && show3DModel.detail3d.parts.forEach(item => {
                if(item.part_id === partCheckedObj.partId) {
                  app.drawApp.updateAngle(0, item.params, partCheckedObj.partId, partCheckedObj.childPartId)
                }
              })
            }
          }
        } else {
          this.$store.commit('gallery/changeDetailType', {type: true, isSelectedProduct: false} )
        }
      }
    },
    changeViewInit({ viewId } = {}) {
      let currentStage = stageObj[`stage${viewId}`];
      currentStage.find("Transformer").destroy();
      if (currentStage.findOne(".anchorGroup"))
        currentStage.findOne(".anchorGroup").destroy();
      currentStage.findOne(".designLayer").batchDraw();
      document.querySelector(".ncRemind").style.display = "none";
      document.querySelector(".spaceRemind").style.display = "none";
      currentStage.find('.overspreadPath') && currentStage.find('.overspreadPath').destroy();
      document.getElementById("containerSize").style.visibility = "hidden";
    },
    convertDefaultConfig(size) {
      var obj = this,
        designWidthRatio,
        designHeightRatio;
      if (!this.productData.design_width) {
        this.productData.design_width = "100";
      }
      designWidthRatio = Number(this.productData.design_width) / 100;

      if (!this.productData.design_height) {
        this.productData.design_height = "0";
      }

      designHeightRatio =
        1 - Math.abs(Number(this.productData.design_height)) / 100;

      var defaultWidth = parseInt(size.width),
        defaultHeight = parseInt(size.height),
        scaledWidth = defaultWidth * designWidthRatio,
        scaledHeight = defaultHeight * designHeightRatio;

      var flag;
      if (String(this.productData.design_height).indexOf("-") == -1) {
        flag = "top";
      } else {
        flag = "bottom";
      }

      return {
        defaultWidth: defaultWidth,
        defaultHeight: defaultHeight,
        width: scaledWidth,
        height: scaledHeight,
        x: (defaultWidth - scaledWidth) / 2,
        y: defaultHeight - scaledHeight,
        flag: flag,
      };
    },
    drawRepeatType({
      viewId,
      type = "",
      node,
      spacingH = 0,
      spacingV = 0,
    } = {}) {
      return new Promise((resolve, reject) => {
        let _this = this;
        node.setAttrs({
          tileType: type,
          spacingH: spacingH,
          spacingV: spacingV,
        });
        const currentStage = stageObj[`stage${viewId}`]
        let layer = node.getLayer();
        let designContainerGroup = currentStage.findOne(".designContainerGroup");
        if (!type) {
          if (currentStage.findOne(`.repeatImgGroup${node._id}`)) {
            node.moveTo(designContainerGroup);
            node.zIndex(
              currentStage.findOne(`.repeatImgGroup${node._id}`).getZIndex()
            );
            currentStage.findOne(`.repeatImgGroup${node._id}`).destroy();
            layer.batchDraw();
          }
          _this.ncYSRemind({ currentStage, node}).then(data => {
            _this.setLayerImgList({
              viewId,
              node,
              isAdd: false,
              isVagueData: data.isVagueData,
              transformData: data.transformData,
              overspreadData: data.overspreadData,
              type: "image",
            });
          });
          resolve();
          return;
        }
        
        let rotateNodePoint = getRotateNodePoint({
          node: node,
          layer,
        });
        let canvas = document.createElement("canvas");
        let context = canvas.getContext("2d");
        // let src = node.toDataURL()
        let img = new Image();
        img.setAttribute("crossOrigin", "anonymous");
        img.src = node.getAttrs().flipImgUrl;
        // img.src = node.toDataURL()
        img.onload = function () {
          const imgScaleRatio = img.width / Math.abs(node.width() * node.scaleX())
          canvas.width = currentStage.findOne(".print_area_border_outer").width() * imgScaleRatio;
          canvas.height = currentStage
            .findOne(".print_area_border_outer")
            .height() * imgScaleRatio;
          let width = Math.abs(node.width() * node.scaleX()) * imgScaleRatio, //放大三倍 解决模糊问题
            height = Math.abs(node.height() * node.scaleY()) * imgScaleRatio;
          
          let ratio = layer.getAttrs().ratio;
          let spacingHMM = spacingH / ratio * imgScaleRatio; //后端mm计算，单位换算mm
          let spacingVMM = spacingV / ratio * imgScaleRatio; //后端mm计算，单位换算mm
          let JQspacingH = spacingHMM / 2;
          let JQspacingV = spacingVMM / 2;
          let canvasTemp = document.createElement("canvas");
          let contextTemp = canvasTemp.getContext("2d");
          if (type == "basicsTile") {
            canvasTemp.width = (width + spacingHMM);
            canvasTemp.height = (height + spacingVMM);

            contextTemp.save();
            contextTemp.drawImage(this, JQspacingH, JQspacingV, width, height);
            contextTemp.restore();

            contextTemp.save();
            contextTemp.drawImage(
              this,
              width + 3 * JQspacingH,
              JQspacingV,
              width,
              height
            );
            contextTemp.restore();

            contextTemp.save();
            contextTemp.drawImage(
              this,
              JQspacingH,
              height + 3 * JQspacingV,
              width,
              height
            );
            contextTemp.restore();

            contextTemp.save();
            contextTemp.drawImage(
              this,
              width + 3 * JQspacingH,
              height + 3 * JQspacingV,
              width,
              height
            );
            contextTemp.restore();
          } else if (type == "Mirror") {
            // node.to({
            //   scaleX: -Math.abs(node.scaleX()),
            //   scaleY: -Math.abs(node.scaleY()),
            // })
            canvasTemp.width = (width + spacingHMM) * 2;
            canvasTemp.height = (height + spacingVMM) * 2;

            contextTemp.save();
            contextTemp.drawImage(
              this,
              canvasTemp.width / 2 + JQspacingH,
              canvasTemp.height / 2 + JQspacingV,
              width,
              height
            );
            contextTemp.restore();

            contextTemp.save();
            contextTemp.scale(-1, 1);
            contextTemp.drawImage(
              this,
              -canvasTemp.width / 2 + JQspacingH,
              canvasTemp.height / 2 + JQspacingV,
              width,
              height
            );
            contextTemp.restore();

            contextTemp.save();
            contextTemp.scale(1, -1);
            contextTemp.drawImage(
              this,
              canvasTemp.width / 2 + JQspacingH,
              -canvasTemp.height / 2 + JQspacingV,
              width,
              height
            );
            contextTemp.restore();

            contextTemp.save();
            contextTemp.scale(-1, -1);
            contextTemp.drawImage(
              this,
              -canvasTemp.width / 2 + JQspacingH,
              -canvasTemp.height / 2 + JQspacingV,
              width,
              height
            );
            contextTemp.restore();
          } else if (type == "XSpacedTile") {
            canvasTemp.width = (width + spacingHMM) * 2;
            canvasTemp.height = (height + spacingVMM) * 2;

            contextTemp.save();
            contextTemp.drawImage(this, -width / 2, JQspacingV, width, height);
            contextTemp.restore();

            contextTemp.save();
            contextTemp.drawImage(
              this,
              width / 2 + 2 * JQspacingH,
              JQspacingV,
              width,
              height
            );
            contextTemp.restore();

            contextTemp.save();
            contextTemp.drawImage(
              this,
              1.5 * width + 4 * JQspacingH,
              JQspacingV,
              width,
              height
            );
            contextTemp.restore();

            contextTemp.save();
            contextTemp.drawImage(
              this,
              JQspacingH,
              height + 3 * JQspacingV,
              width,
              height
            );
            contextTemp.restore();

            contextTemp.save();
            contextTemp.drawImage(
              this,
              width + 3 * JQspacingH,
              height + 3 * JQspacingV,
              width,
              height
            );
            contextTemp.restore();
          } else if (type == "YSpacedTile") {
            canvasTemp.width = (width + spacingHMM) * 2;
            canvasTemp.height = (height + spacingVMM) * 2;

            contextTemp.save();
            contextTemp.drawImage(
              this,
              JQspacingH,
              -0.5 * height,
              width,
              height
            );
            contextTemp.restore();

            contextTemp.save();
            contextTemp.drawImage(
              this,
              JQspacingH,
              0.5 * height + 2 * JQspacingV,
              width,
              height
            );
            contextTemp.restore();

            contextTemp.save();
            contextTemp.drawImage(
              this,
              JQspacingH,
              1.5 * height + 4 * JQspacingV,
              width,
              height
            );
            contextTemp.restore();

            contextTemp.save();
            contextTemp.drawImage(
              this,
              width + 3 * JQspacingH,
              JQspacingV,
              width,
              height
            );
            contextTemp.restore();

            contextTemp.save();
            contextTemp.drawImage(
              this,
              width + 3 * JQspacingH,
              height + 3 * JQspacingV,
              width,
              height
            );
            contextTemp.restore();
          }
          let pattern = context.createPattern(canvasTemp, "repeat");
          let r = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) / 2; //图片中心点绕圆旋转的半径
          let oringAngle = Math.atan(height / width); //两个图片中心点的初始角度
          let tansAngle = (node.rotation() * Math.PI) / 180 + oringAngle; //旋转后两个图片中心点的角度
          //兼容火狐
          let svgM = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
          );
          let matrix = svgM.createSVGMatrix();
          // let tramsform = new Konva.Transform()
          // let matrix = tramsform.getMatrix();
          pattern.setTransform(
            matrix
              // .transform(node.scaleX() > 0 ? 1 : -1, 0, 0, node.scaleY() > 0 ? 1 : -1, 0, 0)
              .translate(rotateNodePoint.VCenter * imgScaleRatio, rotateNodePoint.HCenter * imgScaleRatio) //平移到旋转点
              // .translate(rotateNodePoint.VStart, rotateNodePoint.HStart) //平移到旋转点
              // .scaleNonUniform(node.scaleX() > 0 ? 1 : -1, node.scaleY() > 0 ? 1 : -1) //镜像翻转
              .translate(r * Math.cos(tansAngle), r * Math.sin(tansAngle)) //让两个图片中心点的重合
              .rotate(node.rotation()) //平移后再旋转
              .translate(spacingHMM * 0.5, spacingVMM * 0.5)
          );

          // context.setTransform(image.getTransform().m.join(','))
          context.fillStyle = pattern;
          context.fillRect(0, 0, canvas.width, canvas.height);

          let base = canvas.toDataURL("image/png", 1.0);

          let repeatImg = new Image();
          repeatImg.src = base;
          repeatImg.onload = function () {
            if (currentStage.findOne(`.repeatImgGroup${node._id}`)) {
              node.moveTo(designContainerGroup);
              node.zIndex(
                currentStage.findOne(`.repeatImgGroup${node._id}`).getZIndex()  
              );
              currentStage.findOne(`.repeatImgGroup${node._id}`).destroy();
            }
            // if (type != 1) {
              //有选中平铺效果
              let images = new Konva.Image({
                x: 0,
                y: 0,
                // width: currentStage.findOne('.print_area_border_outer').width(),
                // height: currentStage.findOne('.print_area_border_outer').height(),
                image: repeatImg,
                name: `repeatImg${node._id}`,
                scaleX: 1 / imgScaleRatio,
                scaleY: 1 / imgScaleRatio
              });
              let group = new Konva.Group({
                x: 0,
                y: 0,
                name: `repeatImgGroup repeatImgGroup${node._id}`,
              });
              designContainerGroup.add(group);
              group.add(images);
              group.zIndex(node.getZIndex());
              node.moveTo(group);
              group.on("click", () => {
                node.fire("click");
              });
              _this.ncYSRemind({ currentStage, node}).then(data => {
                _this.setLayerImgList({
                  viewId,
                  node,
                  isAdd: false,
                  isVagueData: data.isVagueData,
                  transformData: data.transformData,
                  overspreadData: data.overspreadData,
                  type: "image",
                });
              });
            // }
            layer.batchDraw();
            resolve();
          };
        };
      });
    },
    imgMaximization({ viewId, flag, node }) {
      return new Promise((resolve, reject) => {
        let curS = this.getCurStageLayer({ viewId });
        let layer = curS.layer;
        let stage = curS.stage;
        let designRect = curS.designRect;
        node.rotation(0);
        let designRectWidth = designRect.width(),
          designRectHeight = designRect.height();
        var widthScale = designRectWidth / node.width();
        var heightScale = designRectHeight / node.height();
        var scale = Math.max(Math.abs(widthScale), Math.abs(heightScale));
        let scaleX = widthScale, scaleY = heightScale

        if (flag == "widthMaximization") {
          scaleX = widthScale;
          scaleY = widthScale
        } else if (flag == "heightMaximization") {
          scaleX = heightScale;
          scaleY = heightScale
        } else if (flag == "imgFull") {
          scaleX = scale;
          scaleY = scale
        } else if (flag == "restore") {
          scaleX = node.getAttrs().initScaleX;
          scaleY = node.getAttrs().initScaleY
          // scaleX = node.getAttrs().widthMM / ratio / node.width()
          // scaleY = node.getAttrs().heightMM / ratio / node.height()
        }

        if (flag == "widthMaximization") {
          scale = widthScale;
        } else if (flag == "heightMaximization") {
          scale = heightScale;
        }
        node.scaleX(scaleX);
        node.scaleY(scaleY);

        node.x(designRectWidth / 2);
        node.y(designRectHeight / 2);
        this.ncYSRemind({ currentStage: stage, node }).then((data) => {
          this.setLayerImgList({
            viewId,
            node,
            isAdd: false,
            isVagueData: data.isVagueData,
            transformData: data.transformData,
            overspreadData: data.overspreadData,
            type: "image",
          });
        });
        this.drawRepeatType({
          viewId,
          type: node.getAttrs().tileType,
          node,
          spacingH: node.getAttrs().spacingH,
          spacingV: node.getAttrs().spacingV,
        }).then(() => {
          resolve();
        });
      });
    },
    textMaximization({ viewId, flag, node }) {
      return new Promise((resolve, reject) => {
        let curS = this.getCurStageLayer({ viewId });
        let layer = curS.layer;
        let stage = curS.stage;
        let designRect = curS.designRect;
        node.rotation(0);
        let designRectWidth = designRect.width(),
          designRectHeight = designRect.height();
        var widthScale = designRectWidth / node.width();
        var heightScale = designRectHeight / node.height();
        var scale = Math.min(widthScale, heightScale);
        let scaleX = widthScale, scaleY = heightScale

        if (flag == "widthMaximization") {
          scaleX = widthScale;
          scaleY = widthScale
        } else if (flag == "heightMaximization") {
          scaleX = heightScale;
          scaleY = heightScale
        } else if (flag == "imgFull") {
          scaleX = scale;
          scaleY = scale
        } else if (flag == "restore") {
          scaleX = 1;
          scaleY = 1
        }
        //镜像翻转后的判断start
        if (node.scaleX() < 0) {
          scaleX = -scaleX
        }
        if (node.scaleY() < 0) {
          scaleY = -scaleY
        }
        //镜像翻转后的判断end
        node.scaleX(scaleX);
        node.scaleY(scaleY);

        node.x(designRectWidth / 2);
        node.y(designRectHeight / 2);
        resolve();
      });
    },
    getCurStageLayer({ viewId }) {
      let stage = stageObj[`stage${viewId}`];
      let layer = stage.findOne(".designLayer");
      let layerBg = stage.findOne(".layerBg");
      let layerBgGroup = stage.findOne(".layerBgGroup");
      let designRect = layer.findOne(".print_area_border_outer");
      let designContainerGroup = layer.findOne(".designContainerGroup");
      const mainImgLayer = stage.findOne(".mainImgLayer");
      return {
        stage: stage,
        layer: layer,
        layerBg,
        layerBgGroup,
        designRect: designRect,
        designContainerGroup,
        mainImgLayer
      };
    },
    matrixMul(a, b) {
      //旧数据两个矩阵还原成一个 a:image矩阵   b：g标签矩阵
      var c = new Array(a.length);
      for (var i = 0; i < a.length; i++) {
        c[i] = new Array(b[0].length);
        for (var j = 0; j < b[0].length; j++) {
          c[i][j] = 0;
          for (var k = 0; k < b.length; k++) {
            c[i][j] += a[i][k] * b[k][j];
          }
        }
      }
      return c;
    },
    saveDesign({ type = "" } = {}) {
      // this.saveNodeJson()
      // return
      if (this.allInPrintArea()) {
        //设计超出印刷区域
        this.$message.error({ message: "设计超出印刷区域" });
        eventBus.$emit("saveDesign", {});
        return false;
      }
      for (let item of this.productData.views) {
        if (stageObj[`stage${item.id}`].find(".design").length > 20) {
          this.$message.error({
            message: "单个打印面最多可添加20个图层（包含图片和文字）",
          });
          eventBus.$emit("saveDesign", {});
          return false;
        }
      }
      switch (type) {
        case 'buyNow': 
          this.imgFullAllDesignTips.noText = "否，立即购买";
          break;
        case 1:
          this.imgFullAllDesignTips.noText = "否，加入购物车";
          break;
        default:
          this.imgFullAllDesignTips.noText = "否，继续保存";
          break;
      }
      this.imgFullAllDesign().then(() => {
        if (type == 1) {
          eventBus.$emit("canAddToCar");
        } else {
          if(type == 'replaceItem' || type == 'relateItem') {
            this.$refs.replaceProduct.replaceProduct(type).then((data) => {
              this.setProductSave({ flag: data.type });
            });
          } else {
            this.setProductSave({ flag: type });
          }
        }
      });
    },
    setProductSave({ flag }) {
      let productConfig = this.getProductConfiguration({isSaveProduct: true});
      productConfig.is_overspread = this.saveProductObj.is_overspread;
      productConfig.is_vague = this.saveProductObj.is_vague;
      if(this.$sdkConfig.platform == 'xcxBackend' && productConfig.cfgs && productConfig.cfgs.length>0){
        productConfig.cfgs = productConfig.cfgs.map(c=>{
          if(c.konvaAttrs.idE){
            c['id'] = c.konvaAttrs.idE
          }
          if(c.konvaAttrs.channel_id){
            c['channel_id'] = c.konvaAttrs.channel_id
          }
          return c
        })
      }
      let cfgs = productConfig.cfgs || [];
      for (let i = 0; i < cfgs.length; i++) {
        let cfg = cfgs[i];
        if (cfg.type == "design") {
          cfg.image.designImg2 = "";
        }
      }
      let lsProductConfig = {};
      //已经设计过的产品，在没有改变设计的情况下不再触发设计产品的接口，而是直接加入购物车
      if (flag == 1) {
        //加入购物车
        const localStorageKey = genLocalStorageKey('productConfig');
        if (localStorage.getItem(localStorageKey)) {
          lsProductConfig = JSON.parse(localStorage.getItem(localStorageKey));
          //同一个产品并且没有改变过设计
          let customCode = this.$isLogin ? this.$OPTIONS.userInfo.code : "unlogin";
          if (
            lsProductConfig.customerCode == customCode &&
            lsProductConfig.product_type_id == productConfig.product_type_id &&
            lsProductConfig.pack_id == productConfig.pack_id &&
            lsProductConfig.custom_logo_code == productConfig.custom_logo_code &&
            JSON.stringify(lsProductConfig.cfgs) == JSON.stringify(productConfig.cfgs)
          ) {
            if (this.$sdkConfig.platformIsZWKJ) {
              this.addToCard({ code: lsProductConfig.reqCode });
            }else {
              eventBus.$emit("addToCardReq", lsProductConfig.sdkData);
            }
            return;
          } else {
            localStorage.setItem(
              localStorageKey,
              JSON.stringify(productConfig)
            );
          }
        } else {
          localStorage.setItem(localStorageKey, JSON.stringify(productConfig));
        }
      }

      let data;
      if (flag == 'replaceItem') {
        data = {
          productConfig: JSON.stringify(productConfig),
          operation: this.urlQueryObj.operation,
          sizeId: this.$store.state.product.editingProduct.size,
          colorId: this.curColorId,
          orderId: this.urlQueryObj.orderId,
          orderItemId: this.urlQueryObj.orderItemId,
        };
      } else if (flag == 'relateItem') {
        data = {
          productConfig: JSON.stringify(productConfig),
          operation: this.urlQueryObj.operation,
          sizeId: this.$store.state.product.editingProduct.size,
          colorId: this.curColorId,
          orderId: this.urlQueryObj.orderId,
          orderItemId: this.urlQueryObj.orderItemId,
          use_convert_product: 1,
        };
      } else {
        data = {
          productConfig: JSON.stringify(productConfig),
        };
      }
      /**
       * 记录设计来源需求
       * platform:  0 (自建) 3 国内sdk 
       * source_type: 1 专业版  2简版  4旧版
       */
      data.platform = 0
      data.source_type = 1

      if (!this.$sdkConfig.platformIsZWKJ && (this.$sdkConfig.platform != 'xcxBackend')) {
        data.platform = 3
        data.external_customer_id = getSDKUserCode(this.$OPTIONS)
      }

      if(flag == 'template'){
        productTemplateSave(data).then(res => {
          if(res){
          eventBus.$emit("saveDesign", {});
          if(res.status > 0 || res.result_code == 200){
            if(this.$sdkConfig.platform == 'xcxBackend'){
              window.parent.postMessage({
                    type: 'ZW_XCXBACKEND_SAVE_TEMPLATE',
                    code: res.data,
                    product_type_id:productConfig.product_type_id
              }, this.$OPTIONS.origin || '*')
            }
            this.$message.success({ message: "保存成功！模板正在合成，可能需要几分钟，请稍后查询！" });
          } else{
            this.$message.error({ message: res.msg });
          }
         }else{
          this.$message.error("请先进行设计，才可进入下一步");
         }
        }).catch(err=>{
          eventBus.$emit("saveDesign", {});
        });
      } else {
        productSave(data)
          .then((data) => {
            eventBus.$emit("saveDesign", {});
            if (!this.$sdkConfig.platformIsZWKJ) {
              if (data.status > 0) {
                const localStorageKey = genLocalStorageKey('productConfig');
                if (localStorage.getItem(localStorageKey)) {
                  lsProductConfig = JSON.parse(localStorage.getItem(localStorageKey));
                  lsProductConfig.sdkData = data.data;
                  localStorage.setItem(localStorageKey, JSON.stringify(lsProductConfig));
                }
                if(flag == 'buyNow'){
                  eventBus.$emit("buyNowConfirm", data.data);
                } else if(flag == 1){
                  eventBus.$emit("addToCardReq", data.data);
                } else {
                  window.parent.postMessage({
                    type: 'ZW_PRODUCT_SAVE',
                    data: data.data
                  }, this.$OPTIONS.origin)
                }
                return
              } else {
                this.$message.error({message: data.msg});
              }
            }
            
            if(flag != 'buyNow' && flag != "replaceItem" && flag != "relateItem" && flag != 1){
              this.$message({
                dangerouslyUseHTMLString: true,
                showClose: true,
                customClass:"save-message",
                message: `<p>设计保存成功！</p>${this.$sdkConfig.platformIsZWKJ ? `<p><span class="publish-sales">刊登销售</span><a class="zw-download-effect" data-id="${data.data.id}" data-code="${data.data.code}">下载效果图</a></p>`: ''}`,
                type: "success",
              });
            }

            if (data.status > 0) {
              eventBus.$emit("saveDesign", { type: flag=='buyNow' ? flag : 1, data: data.data });
              if(flag == 'buyNow'){
                eventBus.$emit('buyNowConfirm', data.data);
              }

              if (flag == 1) {
                this.addToCard({ code: data.data.code });
              }

              if (flag == "replaceItem") {
                this.$message.success({ message: "替换成功" });
                setTimeout(function () {
                  window.close();
                }, 2000);
              } else if (flag == "relateItem") {
                this.$message.success({ message: "产品关联成功" });
                setTimeout(function () {
                  window.close();
                }, 2000);
              }
            } else {
              this.$message.error({ message: data.msg });
            }
          })
          .catch((data) => {
            eventBus.$emit("saveDesign", {});
            if (data.status == -1010) {
              // 超出设计量
              this.$message.error({ message: "超出设计量" });
              return false;
              }else{
                this.$message.error({ message: data.msg });
              }
          });
      }

    },
    addToCard({ code }) {
      let lsProductConfig = null;
      const localStorageKey = genLocalStorageKey('productConfig');
      if (localStorage.getItem(localStorageKey)) {
        lsProductConfig = JSON.parse(localStorage.getItem(localStorageKey));
        lsProductConfig.reqCode = code;
        lsProductConfig.customerCode = this.$isLogin ? this.$OPTIONS.userInfo.code : "unlogin";
        localStorage.setItem(localStorageKey, JSON.stringify(lsProductConfig));
      }
      eventBus.$emit("addToCardReq", { code });
    },
    saveNodeJson() {
      let konvaJson = {};
      for (let item of this.productData.views) {
        let stage = stageObj[`stage${item.id}`];
        konvaJson[item.id] = [];
        for (let node of stage.find(".design")) {
          let attrs = JSON.parse(JSON.stringify(node.getAttrs()));
          if (node.hasName("designImg")) {
            delete attrs.image;
          }
          konvaJson[item.id].push(attrs);
        }
      }
      return konvaJson;
    },
    //计算是否超出印刷区域
    allInPrintArea() {
      let flag = false;
      for (let item of this.productData.views) {
        let layer = this.getCurStageLayer({ viewId: item.id }).layer;
        if (layer.getAttrs().softSvg) {
          break;
        }
        let design = [
          ...layer.find(".designImg"),
          ...layer.find(".designText"),
        ];
        for (let item of design) {
          if (
            item.visible() &&
            this.collisionDetection({ node: item, layer })
          ) {
            flag = true;
            return flag;
          }
        }
      }
      return flag;
    },
    collisionDetection({ node, layer }) {
      let printArea = layer.findOne(".print_area_border_outer");
      let point = getRotateNodePoint({ node, layer });
      if (
        point.VStart <= -1 ||
        point.HStart <= -1 ||
        point.VEnd >= printArea.width() + 1 ||
        point.HEnd >= printArea.height() + 1
      ) {
        //超出印刷区域
        return true;
      }
      return false;
    },
    imgFullAllDesign() {
      let _this = this;
      this.saveProductObj.is_overspread = 1;
      this.saveProductObj.is_vague = -1;
      return new Promise((resolve, reject) => {
        if (setDesignRemind(1)) {
          let productConfig = this.getProductConfiguration();
          let viewIdLength = this.productData.views.length;
          let vagueDesignId = [],
            vagueDesignName = [];
          let tipItems = [];
          if (this.productData.imgFull == 1 && viewIdLength > 1) {
            //全幅产品，并且大于1面需要提示用户没有设计完
            let viewIdList = [];
            for (let item of productConfig.cfgs) {
              if (item.view_id !== 9999 && viewIdList.indexOf(item.view_id) == -1) { //item.view_id !== 9999: 扣除整体设计
                viewIdList.push(item.view_id);
              }
            }
            if (viewIdList.length != viewIdLength) {
              let noDesignName = [];
              for (let item of this.productData.views) {
                if (viewIdList.indexOf(item.id) == -1) {
                  noDesignName.push(item.name);
                }
              }
              tipItems.push({
                type: 1,
                content: `共有<strong>${viewIdLength}</strong>个设计面，<span style="color:#FF0000">其中${noDesignName.join("、" )}面未设计。</span>`
              });
            }
          }

          let { overspreadObj } = this.viewOverspreadCauclate(productConfig)
          

          //图片像素不足放大，图片模糊
          for (let layer of this.layerImgList) {
            if (vagueDesignId.indexOf(layer.id) == -1) {
              if (
                layer.childrens.some((im) => {
                  return im.isVagueData && im.isVagueData.text;
                })
              ) {
                vagueDesignId.push(layer.id);
              }
            }
          }
          

          //图片铺满
          let noOverspreadName = [];
          for (let i in overspreadObj) {
            if (overspreadObj[i].leftNum < 0) overspreadObj[i].leftNum = 0;
            if (overspreadObj[i].topNum < 0) overspreadObj[i].topNum = 0;
            if (overspreadObj[i].rightNum > overspreadObj[i].printAreaWidth)
              overspreadObj[i].rightNum = overspreadObj[i].printAreaWidth;
            if (overspreadObj[i].bottomNum > overspreadObj[i].printAreaHeight)
              overspreadObj[i].bottomNum = overspreadObj[i].printAreaHeight;

            let designWidthRatio =
              (overspreadObj[i].rightNum - overspreadObj[i].leftNum) /
              overspreadObj[i].printAreaWidth;
            let designHeightRatio =
              (overspreadObj[i].bottomNum - overspreadObj[i].topNum) /
              overspreadObj[i].printAreaHeight;
            if (designWidthRatio < 0.98 || designHeightRatio < 0.98) {
              noOverspreadName.push(overspreadObj[i].viewName);
            }
          }
          if (noOverspreadName.length > 0) {
            this.saveProductObj.is_overspread = -1;
            tipItems.push({
              type: 2,
              content: `<span style="color:#FF0000">${noOverspreadName.join("、")}面设计未铺满设计区域，</span>产品会留空白。`
            });
          }

          //图片模糊
          for (let views of this.productData.views) {
            if (
              vagueDesignId.some((item) => {
                return views.id == item;
              })
            ) {
              vagueDesignName.push(views.name);
            }
          }
          if (vagueDesignName.length > 0) {
            this.saveProductObj.is_vague = 1;
            tipItems.push({
              type: 3,
              content: `<span style="color:#FF0000">${vagueDesignName.join("、")}面图片像素不足放大，</span>会导致印刷图案模糊。`
            });
          }
          if (tipItems.length > 0) {
            this.saveTipItems = tipItems;
            this.saveTipDialog = true;

            document.getElementById("saveContinue").onclick = () => {
              //继续保存
              resolve();
              setDesignRemind(2);
              this.redesign = 1
              this.saveTipDialog = false;
            };

            document.getElementById("saveRedesign").onclick = () => {
              //重新设计
              setDesignRemind(2);
              this.redesign = 2
              this.saveTipDialog = false;
            };
          } else {
            resolve();
          }
        } else {
          resolve();
        }
      });
      /**
       *
       * @param {*} type 1: 查询缓存是否过期   2：设置缓存
       */
      function setDesignRemind(type) {
        const localStorageKey = genLocalStorageKey('designRemindList');
        let designRemindList = JSON.parse(
          localStorage.getItem(localStorageKey)
        );
        if (designRemindList == null) {
          designRemindList = [];
        }
        let code = _this.$isLogin ? _this.$OPTIONS.userInfo.code : "unlogin";
        switch (type) {
          case 1:
            for (let key in designRemindList) {
              let date = new Date().getTime();
              if (date >= designRemindList[key].endTime) {
                //已过期
                designRemindList.splice(key, 1);
                key -= 1;
              }
            }
            localStorage.setItem(
              localStorageKey,
              JSON.stringify(designRemindList)
            );
            //当前账号设置7天已过期，需要弹窗提示
            if (
              !designRemindList.some((item) => {
                return item.code == code;
              })
            ) {
              return true;
            }
            return false;
            break;
          case 2:
            //选中，7天后过期
            if (_this.designRemind) {
              designRemindList.push({
                code: code,
                endTime: new Date().getTime() + 86400 * 7 * 1000,
              });
              localStorage.setItem(
                localStorageKey,
                JSON.stringify(designRemindList)
              );
            }
            break;
        }
      }
    },
    viewOverspreadCauclate(productConfig) {
      //计算各个面的设计到印刷区域的距离
      let overspreadObj = {}
      let copyCfgs = productConfig.cfgs;
      this.productData.views.forEach(item => {
        let viewId = item.id,
          viewName = item.name;
        let layer = this.getCurStageLayer({ viewId }).layer;
        let printAreaRect = layer.findOne(".print_area_border_outer");
        for (let img of layer.find(".designImg")) {
          if (img.visible()) {
            if (this.productData.imgFull == 1) {
              //全幅产品，设计未铺满设计区域
              let rotateNodePoint = getRotateNodePoint({
                node: img,
                layer,
              });
              let minX = rotateNodePoint.VStart,
                minY = rotateNodePoint.HStart,
                maxX = rotateNodePoint.VEnd,
                maxY = rotateNodePoint.HEnd;
              if (overspreadObj[viewId] == undefined) {
                overspreadObj[viewId] = {
                  viewName: viewName,
                  leftNum: minX,
                  topNum: minY,
                  rightNum: maxX,
                  bottomNum: maxY,
                  printAreaWidth: printAreaRect.width(),
                  printAreaHeight: printAreaRect.height(),
                };
              }

              let cfgsIndex = copyCfgs.findIndex((item) => {
                return item.view_id == viewId;
              });
              if (
                cfgsIndex != -1 &&
                (copyCfgs[cfgsIndex].type == "bgColor" ||
                  (copyCfgs[cfgsIndex].image &&
                    copyCfgs[cfgsIndex].image.tileType != ""))
              ) {
                overspreadObj[viewId].leftNum = 0;
                overspreadObj[viewId].topNum = 0;
                overspreadObj[viewId].rightNum = printAreaRect.width();
                overspreadObj[viewId].bottomNum = printAreaRect.height();
              }

              if (minX < overspreadObj[viewId].leftNum) {
                overspreadObj[viewId].leftNum = minX;
              }
              if (minY < overspreadObj[viewId].topNum) {
                overspreadObj[viewId].topNum = minY;
              }
              if (maxX > overspreadObj[viewId].rightNum) {
                overspreadObj[viewId].rightNum = maxX;
              }
              if (maxY > overspreadObj[viewId].bottomNum) {
                overspreadObj[viewId].bottomNum = maxY;
              }
              copyCfgs.splice(cfgsIndex, 1);
            }
          }
        }
      })
      return {overspreadObj}
    },
    getProductConfiguration({ isSaveProduct = false, viewId = "" } = {}) {
      var productViews =  isSaveProduct ? this.productData.views : [this.overallDesignView, ...this.productData.views],
        cfgs = [],
        products = {};

      products.color_id = this.curColorId;
      products.size_id = this.$store.state.product.editingProduct&&this.$store.state.product.editingProduct.size;
      products.view_id = this.viewId == 9999 ? this.productData.views[0].id : this.viewId;
      products.product_type_id = this.productData.code;
      products.pack_id = this.$store.state.product.editingProduct.pack || '';
      products.custom_logo_code = this.$store.state.product.editingProduct.tag || '';
      products.part_cfg = ''
      const partCheckedList = this.$store.state.product.partCheckedList
      let part_cfg_list = []
      partCheckedList.forEach(item => { //部件spu的id
        this.productData.spu_details.forEach(spu => {
          if(spu.part_id == item.partId) {
            spu.detail_parts.forEach(de => {
              if(de.part_detail_id == item.childPartId) {
                de.items.forEach(items => {
                  if(items.color_id == item.colorId && items.size_id == item.sizeId) {
                    part_cfg_list.push(items.id)
                  }
                })
              }
            })
          }
        })
      })
      products.part_cfg = part_cfg_list.join(',')

      if (viewId) {
        productViews = productViews.filter((v) => v.id == viewId);
      }
      var templateCode = '';
      for (let item of productViews) {
        let stage = stageObj[`stage${item.id}`];
        let layerBgGroup = stage.findOne(".layerBgGroup");
        let layer = stage.findOne(".designLayer");
        let designImg = layer.find(".designImg") || [],
          designText = layer.find(".designText") || [],
          bgRectGroup = layer.find(".bgRect") || [];
        if (designImg.length + designText.length + bgRectGroup.length > 0) {
          for (let node of bgRectGroup) {
            //背景色
            if (node.visible()) {
              let colorData = formateColor({ color: node.fill() });
              cfgs.push({
                color: {
                  value: colorData.value,
                  fillOpacity: colorData.alpha,
                },
                print_area_id: layer.getAttrs().printAreaId,
                view_id: item.id,
                type: "bgColor",
                konvaAttrs: node.getAttrs(),
              });
              if(node.getAttrs().templateCode && !templateCode){
                templateCode = node.getAttrs().templateCode;
              }
            }
          }
          for (let node of layer.find(".design")) {
            if (node.visible() && node.hasName("designImg")) {
              cfgs.push(
                this.getDesignesConfiguration({
                  node,
                  viewId: item.id,
                  layer,
                  isSaveProduct,
                })
              );
            } else if (node.visible() && node.hasName("designText")) {
              cfgs.push(
                this.getTextConfiguration({
                  node,
                  viewId: item.id,
                  layer,
                })
              );
            }
            if(node.getAttrs().templateCode && !templateCode){
              templateCode = node.getAttrs().templateCode;
            }
          }
        }
      }

      products.cfgs = cfgs;
      if(templateCode) products.template_code = templateCode
      return products;
    },
    getDesignesConfiguration({ node, viewId, layer, isSaveProduct }) {
      let curS = this.getCurStageLayer({ viewId });
      let layerBgGroup = curS.layerBgGroup;
      let nodeAttrs = JSON.parse(JSON.stringify(node.getAttrs()));
      let layerAttrs = layer.getAttrs();
      //传mm的宽高给后端，矩阵也需要用mm
      let pxToMmScaleX = layerAttrs.ratio * node.width() / nodeAttrs.widthMM,
      pxToMmScaleY = layerAttrs.ratio * node.height() / nodeAttrs.heightMM
      let clipWidth, clipHeight, clipData, designImg2 = nodeAttrs.flipImgUrl;
      if(nodeAttrs.isclip){
        clipData = nodeAttrs.clipData;
        let {imgAttrs, pathAttrs} = clipData;
        designImg2 = clipData.imgAttrs.originImg;
        clipWidth = (pathAttrs.width * pathAttrs.scaleX) / (imgAttrs.width * imgAttrs.scaleX) * nodeAttrs.widthMM;
        clipHeight = (pathAttrs.height * pathAttrs.scaleY) / (imgAttrs.height * imgAttrs.scaleY) * nodeAttrs.heightMM;
        clipData.imgAttrs.originImg = isSaveProduct ? '' : clipData.imgAttrs.originImg;
        pxToMmScaleX = layerAttrs.ratio * node.width() / clipWidth;
        pxToMmScaleY = layerAttrs.ratio * node.height() / clipHeight;
      }
      let designeTransform = node.getTransform();
      // 判断节点是否在组内,如果在组内,需要转化为解绑后的属性
      // const isInGroup = node.getParent().hasName('designGroup');
      let nodeRotation = node.rotation();
      let unbindNodeAttrs = {};
      let offsetX = (node.x() - (node.width() * Math.abs(node.scaleX())) / 2) * layerAttrs.ratio;
      let offsetY = (node.y() - (node.height() * Math.abs(node.scaleY())) / 2) * layerAttrs.ratio;
      // if(isInGroup){
      //   const group = node.getParent();
      //   designeTransform = group.getTransform().copy().multiply(node.getTransform().copy());
      //   unbindNodeAttrs = getUnbindNodeAttrs(group, node);
      //   nodeRotation = unbindNodeAttrs.rotation;
      //   offsetX = (unbindNodeAttrs.x - (node.width() * Math.abs(unbindNodeAttrs.scaleX)) / 2) * layerAttrs.ratio;
      //   offsetY = (unbindNodeAttrs.y - (node.height() * Math.abs(unbindNodeAttrs.scaleY)) / 2) * layerAttrs.ratio;
      // }
      let designeTransformCopy = designeTransform.copy()
      designeTransformCopy.scale(pxToMmScaleX, pxToMmScaleY)
      // let rotateNodePoint = getRotateNodePoint({ node, layer });
      designeTransformCopy.m[4] = designeTransformCopy.m[4] * layerAttrs.ratio
      designeTransformCopy.m[5] = designeTransformCopy.m[5] * layerAttrs.ratio
      // let matrix = JSON.parse(JSON.stringify(designeTransformCopy.m));
      // matrix[4] = matrix[4] * layerAttrs.ratio; //px转mm
      // matrix[5] = matrix[5] * layerAttrs.ratio;

      let twoTransform = calcTwoTransform(designeTransformCopy, nodeRotation * Math.PI / 180, Konva)

      //konva数据还原
      delete nodeAttrs.image;
      if(isSaveProduct) {
        nodeAttrs.imageData.designImg = ''
        nodeAttrs.imageData.designImg2 = ''
        nodeAttrs.imageData.designImg3 = '' //旧版翻转图片跳到新版传过来的是base64
        nodeAttrs.flipImgUrl = "";  //base64太大，传不了
        designImg2 = ''
      }
      // nodeAttrs.stageWidth = layerBgGroup.width() * layer.scaleX();
      // nodeAttrs.layerScale = layer.scaleX();
      let designeData = {
        image: {
          gallery_id: nodeAttrs.imageData.code?nodeAttrs.imageData.code:nodeAttrs.imageData.id,
          designImg2,
          // transform:
          //   nodeAttrs.tileType != ""
          //     ? `matrix(${Math.abs(node.scaleX()) * pxToMmScaleX},0,0,${Math.abs(
          //         node.scaleY() * pxToMmScaleY
          //       )},0,0)`
          //     : "matrix(1,0,0,1,0,0)",
          // gTransform: `matrix(${matrix.join(",")})`,
          // height: nodeAttrs.heightMM / (nodeAttrs.heightMM / layerAttrs.ratio / node.height()), // 后台使用这个值计算，前台添加图片时对原图进行了缩放，为了使transform正确，这里要把传给后端的宽高缩放
          // width: nodeAttrs.widthMM / (nodeAttrs.widthMM / layerAttrs.ratio / node.width()),
          transform: twoTransform.transform,
          gTransform: twoTransform.gTransform,
          height: nodeAttrs.heightMM,
          width: nodeAttrs.widthMM,
          opacity: 1,
          tileType: nodeAttrs.tileType,
          hspacing: nodeAttrs.spacingH,
          vspacing: nodeAttrs.spacingV,
          isBg: node.hasName("isBg") && isSaveProduct ? 1 : 0,
          // offset_x: rotateNodePoint.VStart * layerAttrs.ratio,
          // offset_y: rotateNodePoint.HStart * layerAttrs.ratio,
          offset_x: offsetX,
          offset_y: offsetY,
          rotate: nodeRotation,
          name: nodeAttrs.imageData.name,
          size: nodeAttrs.imageData.size,
          rendercode: nodeAttrs.rendercode || "",
          render_id: nodeAttrs.render_id || "",
          xFlip: nodeAttrs.xFlip,
          yFlip: nodeAttrs.yFlip,
          risk_gallery: nodeAttrs.imageData.risk_gallery,
          risk_word: [],
          // xFlip: designeImg.hasClass("xFlip"),
          // yFlip: designeImg.hasClass("yFlip"),
        },
        dpi: 100,
        view_id: viewId,
        print_area_id: layerAttrs.printAreaId,
        type: "design",
        konvaAttrs: nodeAttrs,
        // konvaAttrs: isInGroup ? Object.assign(nodeAttrs, unbindNodeAttrs, {draggable: true}) : nodeAttrs,
      }; 
      if(this.$sdkConfig.platform == 'xcxbackend' && node.getAttrs().idE){
        designeData['id'] = node.getAttrs().idE? node.getAttrs().idE:''
      }
      if(this.$sdkConfig.platform == 'xcxbackend' && node.getAttrs().channel_id){
        designeData['channel_id'] = node.getAttrs().channel_id? node.getAttrs().channel_id:''
      }
      if(nodeAttrs.imageData.channel_id){
        designeData.image['channel_id'] = nodeAttrs.imageData.channel_id
      }
      if(nodeAttrs.isclip){
        designeData.image.isclip = true;
        designeData.image.clipData = clipData;
        designeData.image.clipWidth = clipWidth;
        designeData.image.clipHeight = clipHeight;
      }
      if(!isSaveProduct) {
        designeData.image.designImg = nodeAttrs.imageData.designImg3
        // matrix[3] = matrix[3] / (nodeAttrs.heightMM / layerAttrs.ratio / node.height())
        // matrix[0] = matrix[0] / (nodeAttrs.widthMM / layerAttrs.ratio / node.width());
        // designeData.image.gTransform = `matrix(${matrix.join(",")})`
        designeData.image.height = nodeAttrs.heightMM
        designeData.image.width = nodeAttrs.widthMM
      } else {
        const sdkInfo = nodeAttrs.imageData.sdk_info;
        if(!this.$sdkConfig.platformIsZWKJ && sdkInfo){
          designeData.image.gallery_id = '';
          designeData.image.sdk_info = {
            sdk_gallery_url: sdkInfo.sdk_gallery_url,
            sdk_gallery_code: sdkInfo.sdk_gallery_code || '',
            name: nodeAttrs.imageData.name || '',
            gallery_type: node.hasName("isBg") ? 2 : 1,
          };
          delete nodeAttrs.imageData.sdk_info;
        }
      }
      return designeData;
    },
    getTextConfiguration({ node, viewId, layer }) {
      let curS = this.getCurStageLayer({ viewId });
      let layerBgGroup = curS.layerBgGroup;
      let text = node.findOne("Text");
      node.setAttrs(this.textAttrToLabel({ node }));
      let nodeAttrs = JSON.parse(JSON.stringify(node.getAttrs()));
      let layerAttrs = layer.getAttrs();
      let designeTransform = node.getTransform();
      let rotateNodePoint = getRotateNodePoint({ node, layer });
      let matrix = JSON.parse(JSON.stringify(designeTransform.m));
      let width = Math.abs(node.width() * node.scaleX()),
        height = Math.abs(node.height() * node.scaleY());
      let angle = (node.rotation() * Math.PI) / 180;
      // matrix[5] = (matrix[5] + (node.height() * node.scaleY() - node.height()) - 6.35 * layerAttrs.ratio) * layerAttrs.ratio + text.fontSize() * layerAttrs.ratio;
      // matrix[5] = (matrix[5] + (node.height() * node.scaleY() - node.height())) * layerAttrs.ratio / layerAttrs.backRatio + text.fontSize() * layerAttrs.ratio / layerAttrs.backRatio;
      // matrix[5] =
      //   (matrix[5] +
      //     ((text.lineHeight() * text.fontSize()) / 2) * node.scaleY()) *
      //   layerAttrs.ratio;
      // matrix[5] = (matrix[5]) * layerAttrs.ratio;

      // nodeAttrs.stageWidth = layerBgGroup.width() * layer.scaleX();
      // nodeAttrs.layerScale = layer.scaleX();

      let tspanListData = [],
        textAnchorX = 0,
        textAnchor = "start";
      for (let i = 0; i < text.text().split("\n").length; i++) {
        let item = text.text().split("\n")[i];
        let createText = new Konva.Text({
          text: item,
          scaleX: nodeAttrs.scaleX,
          scaleY: nodeAttrs.scaleY,
          fontSize: text.fontSize(),
        });
        if (i == 0) {
          matrix[4] =
            (matrix[4] -
              createText.height() * node.scaleY() * Math.sin(angle)) * 
            layerAttrs.ratio; //px转mm 
          matrix[5] =
            (matrix[5] +
              createText.height() * node.scaleY() * Math.cos(angle)) * 
            layerAttrs.ratio;
        }

        let createTextWidth = nodeAttrs.width;
        switch (text.align()) {
          case "left":
            textAnchorX = 0;
            textAnchor = "start";
            break;
          case "center":
            textAnchorX = (createTextWidth / 2) * layerAttrs.ratio;
            textAnchor = "middle";
            break;
          case "right":
            textAnchorX = createTextWidth * layerAttrs.ratio;
            textAnchor = "end";
            break;
        }
        let colorData = formateColor({ color: text.fill() });
        
        tspanListData.push({
          content: item,
          fill: colorData.value,
          fillOpacity: colorData.alpha,
          fontFamily: text.fontFamily(),
          fontSize: text.fontSize() * layerAttrs.ratio + "px",
          fontStyle: text.fontStyle().indexOf("italic") != -1 ? "italic" : "",
          fontWeight: text.fontStyle().indexOf("bold") != -1 ? "bold" : "",
          textDecoration: text.textDecoration(),
          textAnchor: textAnchor,
          x: textAnchorX,
          y:
            i == 0
              ? 0
              : (createText.height() *
                  Math.abs(node.scaleY()) *
                  i *
                  layerAttrs.ratio) /
                Math.abs(node.scaleY()),
        });
      }
      let colorData = formateColor({ color: text.stroke() });
      let textObj = {
        tspans: tspanListData,
        x: 0,
        y: 0,
        transform: `matrix(${matrix.join(",")})`,
        gTransform: `matrix(1,0,0,1,0,0)`,
        handleGroupTransform: `matrix(1,0,0,1,0,0)`,
        width: rotateNodePoint.width * layerAttrs.ratio,
        height: rotateNodePoint.height * layerAttrs.ratio,
        textBg: formateColor({ color: node.findOne("Rect").fill() }).value,
        textBgX: 0,
        textBgY: 0,
        textBgWidth: 0,
        textBgheight: 0,
        stroke: colorData.value,
        strokeOpacity: colorData.alpha,
        strokeWidth: text.strokeWidth() * layerAttrs.ratio + "px",
        strokeValue: node.strokeValue,
        // dominantBaseline: "hanging",
        strokeMiterLimit: 10,
        // fontStyle: text.fontStyle().indexOf("italic") != -1 ? "italic" : "",
        // fontWeight: text.fontStyle().indexOf("bold") != -1 ? "bold" : "",
        // textDecoration: text.textDecoration()
      }
      // if(window.location.search.indexOf("isAmazonOrder") != -1) {
        if(!this.textFamilyOptions.find(item => {return item.value.includes(text.fontFamily())})) { //亚马逊订单使用的文字设计器没有，需要告诉后端，后端去解析
          textObj.isAmazonOrder = 1
        }
      // }
      let textData = {
        text: textObj,
        dpi: 100,
        print_area_id: layerAttrs.printAreaId,
        view_id: viewId,
        type: "text",
        konvaAttrs: nodeAttrs,
      };

      return textData;
    },
    oldDataRestore({ data, productData }) {
      for (let view of productData.views) {
        var n = {};
        n.id = view.print_area.id; //打印区域id
        n.defaultViews = view.id; //默认哪一面
        n.printArea = view.print_area; //打印区域
        n.config = this.convertDefaultConfig({
          width: view.print_area.width,
          height: view.print_area.height,
        });
        cacheProductPrintAreas.push(n);
      }
      return new Promise((resolve, reject) => {
        let promises = [];
        let templateCode = '';
        for (let item of data.cfg) {
          if (item.type == "design") {
            //图片
            if (isRisk(item.image)) {
              this.$message.error("图片信息异常，无法使用");
            } else {
              promises.push(
                new Promise(async (resolve, reject) => {
                  let designUrl = item.image.designImg || item.image.designImg2;
                  if(item.image.isclip){
                    designUrl = await this.m_clip_getClipImage(item.image.clipData);
                  }
                  Konva.Image.fromURL(designUrl, (image) => {
                      let ratio = 0;
                      for (let view of productData.views) {
                        if (view.id == item.view_id) {
                          ratio = view.print_area.view_width / 547;
                        }
                      }

                      let imgSize = imgSizeCalculate({
                        imageData: { size: item.image.size },
                        viewId: item.view_id,
                        productData
                      });
                      let imgWidth = item.image.width, imgHeight = item.image.height;
                      if(item.image.isclip){
                        let {imgAttrs, pathAttrs} = item.image.clipData;
                        imgWidth = imgWidth * (pathAttrs.width * pathAttrs.scaleX) / (imgAttrs.width * imgAttrs.scaleX)
                        imgHeight = imgHeight * (pathAttrs.height * pathAttrs.scaleY) / (imgAttrs.height * imgAttrs.scaleY)
                      }
                      // image.width(item.image.width / ratio);
                      // image.height(item.image.height / ratio);
                      let aTransform = [];
                      for (let t of item.image.transform
                        .slice(7, item.image.transform.length - 1)
                        .split(",")) {
                        aTransform.push(parseFloat(t));
                      }
                      // let bTransform = []
                      // for(let t of item.image.transform.slice(7, item.image.gTransform.length - 1).split(',')) {
                      //   bTransform.push(parseFloat(t))
                      // }
                      // let transform = this.matrixMul([[aTransform[0], aTransform[1], 0],[aTransform[2], aTransform[3], 0],[aTransform[4], aTransform[5], 1]], [[bTransform[0], bTransform[1], 0],[bTransform[2], bTransform[3], 0],[bTransform[4], bTransform[5], 1]])
                      // image.scaleX(transform[0][0])
                      // image.scaleY(transform[1][1])
                      image.scaleX(aTransform[0]);
                      image.scaleY(aTransform[3]);
                      // let scaleWidth = image.width() * image.scaleX(), scaleHeight = image.height() * image.scaleY()
                      // let r = Math.sqrt(Math.pow(scaleWidth, 2) + Math.pow(scaleHeight, 2)) / 2; //图片中心点绕圆旋转的半径
                      // let oringAngle = Math.atan(scaleWidth / scaleHeight);
                      // let tansAngle = (item.image.rotate * Math.PI) / 180 + oringAngle;

                      // let clientRect = image.getClientRect();
                      image.x(
                        item.image.offset_x / ratio + (imgWidth / ratio * image.scaleX()) / 2
                      );
                      image.y(
                        item.image.offset_y / ratio + (imgHeight / ratio * image.scaleY()) / 2
                      );
                      if(imgSize.width != item.image.width || imgSize.height != item.image.height) {
                        image.scaleX((parseFloat(item.image.width) / imgSize.width) * aTransform[0]);
                        image.scaleY((parseFloat(item.image.height) / imgSize.height) * aTransform[3]);
                      }
                      // image.x(item.image.offset_x / ratio + r * Math.cos(tansAngle) / 2)
                      // image.y(item.image.offset_y / ratio + r * Math.cos(tansAngle) / 2)
                      // image.x(item.image.offset_x / ratio + transform[2][0])
                      // image.y(item.image.offset_y / ratio + transform[2][1])
                      image.name("design designImg");
                      image.addName(`design${image._id}`);
                      image.addName(`${item.image.isBg == 1 ? "isBg" : ""}`);
                      image.setAttrs({
                        stageWidth: 547,
                        draggable: true,
                        tileType: item.image.tileType,
                        spacingH: item.image.hspacing,
                        spacingV: item.image.vspacing,
                        xFlip: item.image.xFlip,
                        yFlip: item.image.yFlip,
                        rotation: rotateConvert(item.image.rotate), //旧版保存过来的rotate需要转化为[-180, 180]范围的值，否则在范围之外的角度在选中图片的时候会把图片的角度给改掉
                        flipImgUrl:
                          item.image.designImg2 || item.image.designImg,
                        maxImgSize: imgSize.viewerSize,
                        // imageData: {
                        //   designImg: item.image.designImg,
                        //   imageUrl: item.image.designImg,
                        //   size: item.image.size,
                        // },
                        imageData: Object.assign(item.image, {
                          designImg:
                            item.image.designImg2 || item.image.designImg,
                          designImg3:
                            item.image.designImg2 || item.image.designImg,
                            code: item.image.gallery_id
                        }),
                        // gallery_id: item.image.gallery_id,
                        render_id: item.image.render_id || '',
                        rendercode: item.image.rendercode || '',
                        historyId: image._id,
                      });
                      if(item.image.isclip){
                        image.setAttrs({
                          isclip: item.image.isclip,
                          clipData: item.image.clipData
                        })
                      }
                      if(item.konvaAttrs&&item.konvaAttrs.name){
                        if(item.konvaAttrs.name.indexOf('template') > -1){
                          image.addName('template');
                        }
                        if(typeof item.konvaAttrs.tempCfgIndex != 'undefined'){
                          image.setAttrs({
                            tempCfgIndex: item.konvaAttrs.tempCfgIndex
                          })
                        }
                        if(typeof item.konvaAttrs.templateCode != 'undefined'){ 
                          image.setAttrs({
                            templateCode: item.konvaAttrs.templateCode
                          })
                          if(!templateCode){
                            templateCode = item.konvaAttrs.templateCode
                          }
                        }
                      }
                      let nodeAttrs = JSON.parse(
                        JSON.stringify(image.getAttrs())
                      );
                      delete nodeAttrs.image;
                      item.konvaAttrs = nodeAttrs;
                      resolve();
                    }
                  );
                })
              );
            }
          } else if (item.type == "text") {
            let textStr = [],
              textData = item.text.tspans[0];
            for (let span of item.text.tspans) {
              textStr.push(span.content);
            }
            let label = new Konva.Label({
              name: "design designText",
            });
            let tempAtts = {};
            if(item.konvaAttrs&&item.konvaAttrs.name){
              if(item.konvaAttrs.name.indexOf('template') > -1){
                label.addName('template');
              }
              if(typeof item.konvaAttrs.tempCfgIndex != 'undefined'){
                tempAtts.tempCfgIndex = item.konvaAttrs.tempCfgIndex
              }
              if(typeof item.konvaAttrs.templateCode != 'undefined'){
                tempAtts.templateCode = item.konvaAttrs.templateCode
                if(!templateCode){
                  templateCode = item.konvaAttrs.templateCode
                }
              }
            }
            item.konvaAttrs = Object.assign(label.getAttrs(), {
              designText: textStr.join("\n"),
              designFill: item.text.textBg,
              proStrokeWidth: parseFloat(item.text.strokeWidth),
              proStroke: item.text.stroke,
              textColor: textData.fill,
              proFontFamily: textData.pFontFamily
                ? textData.pFontFamily.slice(1, -1)
                : textData.fontFamily.slice(1, -1),
              proFontSize: textData.fontSize,
              proFontStyle: "",
              proTextDecoration: "",
              textAlign: textData.textAnchor,
              stageWidth: 547,
              strokeValue: item.text.strokeValue,
              oldData: true,
              historyId: label._id
            }, tempAtts);
          } else if (item.type == "bgColor") {
            let tempAtts = {};
            if(item.konvaAttrs&&item.konvaAttrs.name){
              if(typeof item.konvaAttrs.tempCfgIndex != 'undefined'){
                tempAtts.tempCfgIndex = item.konvaAttrs.tempCfgIndex
              }
              if(typeof item.konvaAttrs.templateCode != 'undefined'){
                tempAtts.templateCode = item.konvaAttrs.templateCode
                if(!templateCode){
                  templateCode = item.konvaAttrs.templateCode
                }
              }
            }
            item.konvaAttrs = { name: `bgRect design ${item.konvaAttrs&&item.konvaAttrs.name&&item.konvaAttrs.name.indexOf('template')>-1 ? 'template' : ''}`, fill: item.color.value, ...tempAtts};
          }
        }
        Promise.all(promises).finally(() => {
          resolve(data);
        });
      });
    },
    unbindRepeatGroup({ node }) {
      let layer = node.getLayer();
      let designContainerGroup = layer.findOne(".designContainerGroup");
      node.moveTo(designContainerGroup);
      node.zIndex(
        designContainerGroup.findOne(`.repeatImgGroup${node._id}`).zIndex()
      );
      designContainerGroup.findOne(`.repeatImgGroup${node._id}`).destroy();
    },
    bgset({ viewId, node, type }) {
      return new Promise((resolve, reject) => {
        const layer = node.getLayer()
        // if (type == "image") {
          if (layer.findOne(`.repeatImgGroup${node._id}`)) {
            this.unbindRepeatGroup({ node });
            node.setAttrs({ tileType: "" });
          }

          if (layer.findOne(".bgRect")) {
            node.zIndex(layer.findOne(".bgRect").zIndex() + 1);
          } else {
            node.moveToBottom();
          }
          //设为背景调整图层层级
          eventBus.$emit("bgImgSetLevel");
          // this.imgMaximization({ viewId, flag: "imgFull", node }).then(() => {
            resolve();
            this.cloneStage({
              viewId
            });
          // });
        // } else {
        //   node.moveToBottom();
        //   resolve();
        //   this.cloneStage({
        //     viewId,
        //     cloneViewLength: this.productData.views.length
        //   });
        // }
      });
    },
    changeViewPage(type) {
      const marginTop = Number(getStyle(this.$refs.viewImgDiv.firstChild,"marginTop").replace(/\s+|px/gi,""))
      const viewImgDivHeight = this.$refs.viewImgDiv.clientHeight
      const viewImgUlHeight = this.$refs.viewImgDiv.firstChild.clientHeight
      if((viewImgUlHeight - Math.abs(marginTop)) / viewImgDivHeight >= 2) {
        
      }
      switch(type) {
        case 'pre':
          this.$refs.viewImgDiv.firstChild.style.marginTop = `${marginTop - 40}px`
          break;
        case 'next':
          this.$refs.viewImgDiv.firstChild.style.marginTop = `${marginTop + 40}px`
      }
    },
    handleFocus(e) {
      this.$store.commit("shortcut/updateFocusStatus", true);
    },
    handleBlur() {
      this.$store.commit("shortcut/updateFocusStatus", false);
    },
    // 添加操作记录
    addHistory(name, viewId, options) {
      let productConfig = this.getProductConfiguration({
        viewId,
        isSaveProduct: false
      });
      if (name == "init") {
        this.$store.commit("emptyHistory", { view_id: viewId });
      }
      // 存储图层顺序，图层排序的时候复原
      let designLayer = stageObj[`stage${viewId}`].findOne(".designLayer");
      let nodesIndex = {};
      designLayer.find(".design").forEach((n) => {
        let historyId = n.getAttrs().historyId;
        let $repeatObj = designLayer.findOne(`.repeatImgGroup${n._id}`);
        nodesIndex[historyId] = $repeatObj ? $repeatObj.zIndex() : n.zIndex();
      });
      this.$store.commit("addHistory", {
        view_id: viewId,
        name,
        node_id: options ? options.nodeId : "",
        data: productConfig.cfgs,
        nodesIndex,
      });
      let step = name == "init" ? 0 : this.historyListMap[viewId].length - 1;
      this.$store.commit("updateHistoryStep", {
        view_id: viewId,
        val: step,
      });
    },
    // 还原操作记录
    async restoreHistory(opt) {
      this.$store.commit('updateHistoryFreeze', true);
      let { flag, skipStep } = opt;   // flag: -1撤销, 1重做
      let restoreData = this.historyList[this.historyStep];
      let curData = this.historyList[
        flag == -1 ? this.historyStep + (skipStep + 1) : this.historyStep - 1
      ];
      let [restoreDataConf, curDataConf] = [restoreData.data, curData.data];
      let viewId = this.viewId;
      let currentStage = stageObj[`stage${viewId}`];
      let designLayer = currentStage.findOne(".designLayer");
      // 还原背景色
      const _restoreBgColor = () => {
        let bgnodeConf = restoreDataConf.find((n) => {
          return n.type == "bgColor";
        });
        if (bgnodeConf) {
          this.addBgColor({
            // color: bgnodeConf.konvaAttrs.fill,
            color: bgnodeConf.color.value,
            viewId: viewId,
          });
          // this.background_color = bgnodeConf.konvaAttrs.fill;
          // designLayer.find(".bgRect").moveToBottom();
        } else {
          designLayer.find(".bgRect").destroy();
          // this.background_color = "";
        }
      };
      // 删除节点
      const _deleteNode = async (node) => {
        node.destroy();
        designLayer.find(`.repeatImgGroup${node._id}`).destroy();
        this.setLayerImgList({
          viewId,
          node: node,
          isDelete: true,
        });
      };
      // 还原图片节点
      const _restoreImage = async ({ node, nodeAttrs } = {}) => {
        // 如果有传node，表示图片替换，需要保持原来的层级关系
        let nodeIndex;
        if (node) {
          nodeIndex = node.zIndex();
          _deleteNode(node);
        }
        if(nodeAttrs.isclip){
          nodeAttrs.flipImgUrl = nodeAttrs.clipData.imgAttrs.originImg;
        }
        await this.addImage({
          imageData: nodeAttrs.imageData,
          viewId: viewId,
          isGalleryClick: false,
          recordData: nodeAttrs,
          isSetBg: nodeAttrs.name.indexOf("isBg") > -1,
          isHistory: true,
          historyOptions: {
            id: nodeAttrs.historyId,
          },
        }).then(async (data) => {
          if (node) data.data.zIndex(nodeIndex);
          // 图片添加完后需要先还原层级关系
          designLayer.find('.design').forEach((n) => {
            let hid = n.getAttrs().historyId;
            n.zIndex(restoreData.nodesIndex[hid]);
          });
          // 右侧锁定状态灰显
          if (!nodeAttrs.draggable) {
            this.lockNode({ node: data.data, viewId, isLock: true });
          }
          await this.drawRepeatType({
            viewId: viewId,
            type: data.data.getAttrs().tileType,
            node: data.data,
            spacingH: data.data.getAttrs().spacingH,
            spacingV: data.data.getAttrs().spacingV,
          });
        });
      };
      // 还原文本
      const _restoreText = async ({ node, nodeAttrs } = {}) => {
        let nodeIndex;
        if (node) {
          nodeIndex = node.zIndex();
          _deleteNode(node);
        }
        if (!nodeAttrs.scaleX || isNaN(nodeAttrs.scaleX)) {
          nodeAttrs.scaleX = 1;
        }
        if (!nodeAttrs.scaleY || isNaN(nodeAttrs.scaleY)) {
          nodeAttrs.scaleY = 1;
        }
        await this.addText({
          viewId: viewId,
          isGalleryClick: false,
          recordData: nodeAttrs,
          isHistory: true,
          historyOptions: {
            id: nodeAttrs.historyId,
          },
        }).then((data) => {
          if (node) {
            data.data.zIndex(nodeIndex);
            designLayer.find('.design').forEach((n) => {
              let hid = n.getAttrs().historyId;
              n.zIndex(restoreData.nodesIndex[hid]);
            });
          }
        });
      };
      // 更新图层数据
      const _updateLayer = ()=> {
        let designImgList = [];
        for (let item of this.$store.state.gallery.designImgList) {
          designImgList.push(item);
        }
        for (let item of designImgList) {
          if(item.id == viewId){
            item.childrens = [];
            for(let design of designLayer.find('.design').reverse()){
              design.isSelected = false;
              if(!design.hasName('bgRect')) item.childrens.push(design);
            }
            break;
          }
        }
        this.$store.commit('gallery/getDesignImgList', {data: designImgList});
      };
      this.changeViewInit({ viewId });
      let optData = flag==-1 ? curData : restoreData;
      if(optData.node_id){
        let designNodes = designLayer.find(".design");
        let changingNode = Array.from(designNodes).find(
          (n) => n.getAttrs().historyId == optData.node_id
        );
        let nodeConf = restoreDataConf.find(
          (n) => n.konvaAttrs.historyId == optData.node_id
        );
        // 如果还原回去的记录中有该节点，则改变节点属性(销毁重建), 如果没有则添加节点
        if(nodeConf){
          if(nodeConf.konvaAttrs.name.indexOf("designImg") > -1){
            await _restoreImage({
              node: changingNode,
              nodeAttrs: nodeConf.konvaAttrs
            });
          } else if (nodeConf.konvaAttrs.name.indexOf("designText") > -1) {
            await _restoreText({
              node: changingNode,
              nodeAttrs: nodeConf.konvaAttrs
            });
          }
          if(optData.name = '图层排序'){
            designLayer.find('.design').forEach((n) => {
              let hid = n.getAttrs().historyId;
              n.zIndex(restoreData.nodesIndex[hid]);
            });
          }
          // 更新左侧图层排序
          _updateLayer();
        } else {
          if(changingNode) {
            _deleteNode(changingNode);
          }
        }
      } else {
        // 非图片或文字的操作：清空、背景色
        if(optData.name == '清空'){
          flag==-1 ? await this.restoreAllDesign() : this.emptyDesign({ isConfirm: false, isAddHistory: false });
        } else if(optData.name.indexOf('背景色') > -1){
          _restoreBgColor();
        }
      }
      designLayer.batchDraw();
      this.cloneStage({ viewId });
      this.canvasQuality({ viewId });
      this.pointoutPrintAreaShow({ viewId });
      this.curNode = null;
      this.$store.commit("layout/changeSelectType", null);
      this.$store.commit('updateHistoryFreeze', false);
    },
    // 撤销清空，还原所有记录
    async restoreAllDesign() {
      let stepData = this.historyList[this.historyStep];
      let nodeConfs = stepData.data.map((n) => n.konvaAttrs);
      let viewId = this.viewId;
      let currentStage = stageObj[`stage${viewId}`];
      let designLayer = currentStage.findOne(".designLayer");
      designLayer.find(".designImg").destroy();
      designLayer.find(".repeatImgGroup").destroy();
      designLayer.find(".designText").destroy();
      designLayer.find(".bgRect").destroy();
      if (nodeConfs) {
        for (let node of nodeConfs) {
          if (node.name.indexOf("designImg") != -1) {
            node.flipImgUrl = node.imageData.designImg3;
            await this.addImage({
              imageData: node.imageData,
              viewId: viewId,
              isGalleryClick: false,
              recordData: node,
              isHistory: true,
              historyOptions: {
                id: node.historyId,
                visible: node.historyId != stepData.node_id,
              },
            }).then(async (data) => {
              // if (data.data.attrs.xFlip) {
              //   await this.flipImage({
              //     data: { data: "leftRightMirror" },
              //     node: data.data,
              //     viewId: viewId,
              //     isReduction: true,
              //   });
              // }
              // if (data.data.attrs.yFlip) {
              //   await this.flipImage({
              //     data: { data: "upDownMirror" },
              //     node: data.data,
              //     viewId: viewId,
              //     isReduction: true,
              //   });
              // }
              await this.drawRepeatType({
                viewId: viewId,
                type: data.data.getAttrs().tileType,
                node: data.data,
                spacingH: data.data.getAttrs().spacingH,
                spacingV: data.data.getAttrs().spacingV,
              });
            });
          } else if (node.name.indexOf("designText") != -1) {
            await this.addText({
              viewId: viewId,
              isGalleryClick: false,
              recordData: node,
            });
          } else if (node.name.indexOf("bgRect") != -1) {
            this.addBgColor({
              color: node.fill,
              viewId: viewId,
            });
          }
        }
      }
      return true;
    },
    // 清空
    emptyDesign({ isConfirm = true, isAddHistory = true } = {}) {
      if (isConfirm) {
        this.isShowEmptyTip = true;
      } else {
        this._emptyDesign(this.viewId, { isAddHistory });
      }
    },
    _emptyDesign(viewId, { isAddHistory = true, cloneViewLength=null, isProductChange=false }) {
      let currentStage = stageObj[`stage${viewId}`];
      let designLayer = currentStage.findOne(".designLayer");
      for (let item of this.layerImgList) {
        if (item.id == viewId) {
          item.bgcolor = ""
          item.overspreadData = {};
          item.childrens = [];
        }
      }
      this.$store.commit("gallery/getDesignImgList", {
        data: this.layerImgList,
      });
      designLayer.find(".designImg").destroy();
      designLayer.find(".designText").destroy();
      designLayer.find(".bgRect").destroy();
      designLayer.find(".repeatImgGroup").destroy();
      this.m_clip_imgClipCancel({isEmpty: true})
      if (isAddHistory) {
        this.addHistory("清空", viewId);
      }
      this.background_color = '';
      this.curNode = null;
      this.changeViewInit({ viewId });
      this.canvasQuality({ viewId });
      if(!isProductChange){
        // 切换不执行cloneStage,避免切换产品细节图渲染导致慢
        this.cloneStage({ viewId, cloneViewLength });
      }
      this.$store.commit("layout/changeSelectType", null);
      eventBus.$emit('updatePrice')
      if(!isProductChange){
        this.showTouchAnimation = true;
        this.$nextTick(() => {
          this.touchAnimationPos({ viewId });
        });
        this.checkShowOverallDesignTip()
      }
    },
    emptyDesignConfirm(flag) {
      if (flag == 0) {
        // 当前面
        // this.cloneViewLength = this.productData.views.length - 1
        this._emptyDesign(this.viewId, { isAddHistory: true });
      } else {
        // 所有面
        // this.cloneViewLength = 0
        let views = [this.overallDesignView, ...this.productData.views];
        for (let view of views) {
          this._emptyDesign(view.id, { isAddHistory: true, cloneViewLength: this.productData.views.length });
        }
      }
      this.isShowEmptyTip = false;
    },
    // 右键菜单
    initStageCtxMenu(stage) {
      stage.off("contextmenu");
      stage.on("contextmenu", (e) => {
        e.evt.preventDefault();
        if(this.m_clip_isCliping) return;
        let isShowCtxMenu = false;
        let nodeType = this.$store.state.layout.showType;
        if (nodeType) {
          isShowCtxMenu = true;
          let isLock = nodeType=='group' ? this.curNode[0].isLock : this.curNode.isLock;
          let isBg = nodeType=='group' ? false : this.curNode.hasName("isBg");
          this.designMenuData = [];
          this.designMenuData.push({
            name: "创建副本",
            type: "copy",
            id: "copy",
            nodeType,
            shortcut: this.getShortcutName('base16'),
            disabled: isLock,
          });
          let views = this.productData.views,
            copyViewsData = [];
          if (views.length > 1) {
            copyViewsData = views.map((v, i) => {
              return {
                name: v.name,
                type: "copyToView",
                id: "copyToView_" + v.id,
                nodeType,
                shortcut: this.getShortcutName('canvas'+(i+19)),
                disabled: isLock,
                options: { view_id: v.id },
              };
            }).filter(v=>v.options.view_id!=this.viewId);
            copyViewsData.unshift({
              name: "所有面",
              type: "copyToView",
              id: "copyToView_all",
              nodeType,
              shortcut: this.getShortcutName('canvas18'),
              disabled: isLock,
              options: { view_id: "" },
            });
            this.designMenuData.push({
              name: "复制到",
              type: "copyToView",
              id: "copyToView",
              nodeType,
              disabled: isLock,
              subData: copyViewsData,
            });
          }
          // if (isImg) {
          //   let subData = [
          //     {
          //       name: "设为背景",
          //       type: "setBg",
          //       id: "setBg_self",
          //       shortcut: this.getShortcutName('gallery7'),
          //       nodeType,
          //       disabled: isLock,
          //     },
          //   ];
          //   if (views.length > 1) {
          //     subData.push({
          //       name: "应用所有面",
          //       type: "setBg",
          //       id: "setBg_all",
          //       shortcut: this.getShortcutName('gallery6'),
          //       nodeType,
          //       disabled: isLock,
          //     });
          //   }
          //   this.designMenuData.push({
          //     name: "图片设置",
          //     type: "setBg",
          //     id: "setBg",
          //     nodeType,
          //     disabled: isLock,
          //     subData: subData,
          //   });
          // }
          this.designMenuData.push({
            name: "排序",
            type: "sort",
            id: "sort",
            nodeType,
            disabled: isLock || isBg,
            subData: [
              {
                name: "置于顶层",
                type: "sort",
                id: "sort_top",
                shortcut: this.getShortcutName('element1'),
                nodeType,
                disabled: isLock || isBg,
              },
              {
                name: "上移一层",
                type: "sort",
                id: "sort_up",
                shortcut: this.sysPlatform == "windows" ? `Ctrl+]` : `⌘+]`,
                shortcut: this.getShortcutName('element3'),
                nodeType,
                disabled: isLock || isBg,
              },
              {
                name: "下移一层",
                type: "sort",
                id: "sort_down",
                shortcut: this.getShortcutName('element4'),
                nodeType,
                disabled: isLock || isBg,
              },
              {
                name: "置于底层",
                type: "sort",
                id: "sort_bottom",
                shortcut: this.getShortcutName('element2'),
                nodeType,
                disabled: isLock || isBg,
              },
            ],
          });
          if(nodeType != 'group'){
            this.designMenuData.push({
              name: "翻转",
              type: "flip",
              id: "flip",
              nodeType,
              disabled: isLock,
              subData: [
                {
                  name: "水平翻转",
                  type: "flip",
                  id: "flip_horizontal",
                  shortcut: this.getShortcutName('element5'),
                  nodeType,
                  disabled: isLock,
                },
                {
                  name: "垂直翻转",
                  type: "flip",
                  id: "flip_vertical",
                  shortcut: this.getShortcutName('element6'),
                  nodeType,
                  disabled: isLock,
                },
              ],
            });
            this.designMenuData.push({
              name: "旋转角度",
              type: "rotation",
              id: "rotation",
              nodeType,
              disabled: isLock,
              subData: [
                {
                  name: "45°",
                  type: "rotation",
                  id: "rotation_45",
                  nodeType,
                  disabled: isLock,
                  options: {
                    deg: "45",
                  },
                },
                {
                  name: "90°",
                  type: "rotation",
                  id: "rotation_90",
                  nodeType,
                  disabled: isLock,
                  options: {
                    deg: "90",
                  },
                },
                {
                  name: "180°",
                  type: "rotation",
                  id: "rotation_180",
                  nodeType,
                  disabled: isLock,
                  options: {
                    deg: "180",
                  },
                },
                {
                  name: "自定义",
                  type: "rotation",
                  id: "rotation_custom",
                  nodeType,
                  disabled: isLock,
                  options: {
                    deg: "",
                  },
                },
              ],
            });
          }
          this.designMenuData.push({
            name: isLock ? "解锁" : "锁定",
            type: "lock",
            id: "lock",
            shortcut: this.getShortcutName('element17'),
            nodeType,
          });
          this.designMenuData.push({
            name: "删除",
            type: "delete",
            id: "delete",
            shortcut: this.getShortcutName('base26'),
            nodeType,
            disabled: isLock,
          });
        } else {
          // 判断当前位置是否在背景图层范围内
          if(this.checkEventPos(stage, 1)){
            isShowCtxMenu = true;
            this.designMenuData = [
              {
                name: "设置背景色",
                type: "setBgColor",
                id: "setBgColor",
                shortcut: this.getShortcutName('canvas32'),
              },
            ];
          }
        }
        if (isShowCtxMenu) {
          this.updateCtxMenuPos(stage);
        } else {
          const menuEl = document.getElementById("designMenu");
          menuEl.style.display = "none";
        }
      });
    },
    // 判断点击位置是否在背景图层范围内
    checkEventPos(stage, type=1){
      // type: 1画布, 2印刷区域
      const eventPos = stage.getPointerPosition();
      let targetRect, minX, minY, maxX, maxY;
      switch(type){
        case 1:
          targetRect = stage.findOne(".layerBg").getClientRect();
          minX = stage.x();
          minY = stage.y();
          maxX = minX + targetRect.width;
          maxY = minY + targetRect.height;
          break;
        case 2:
          const designLayer =  stage.findOne('.designLayer');
          const scaleX = designLayer.scaleX(), scaleY = designLayer.scaleY();
          targetRect = stage.findOne('.print_area_border_outer').getClientRect({relativeTo: designLayer});
          minX = stage.x() + targetRect.x * scaleX;
          minY = stage.y() + targetRect.y * scaleY;
          maxX = minX + targetRect.width * scaleX ;
          maxY = minY + targetRect.height* scaleY;
          break;
      }
      return (eventPos.x > minX && eventPos.x < maxX && eventPos.y > minY && eventPos.y < maxY);
    },
    updateCtxMenuPos(stage){
      const menuEl = document.getElementById("designMenu");
      menuEl.style.opacity = 0;
      menuEl.style.display = "block";
      const winHeight = document.documentElement.clientHeight || document.body.clientHeight;
      const menuHeight = menuEl.clientHeight;
      const containerRect = stage.container().getBoundingClientRect();
      const menuTop = containerRect.top + stage.getPointerPosition().y;
      if (menuTop + menuHeight > winHeight) {
        menuEl.style.top = menuTop - menuHeight + 4 + "px";
      } else {
        menuEl.style.top = menuTop + 4 + "px";
      }
      menuEl.style.left = containerRect.left + stage.getPointerPosition().x + 4 + "px";
      menuEl.style.opacity = 1;
    },
    initCtxMenuEvents(){
      const designerEle = document.getElementById('designer');
      const menuEl = document.getElementById('designMenu');
      document.addEventListener('click', function(e){
        if(!designerEle.contains(e.target) && menuEl.style.display != 'none'){
          menuEl.style.display = "none";
        }
      });
    },
    async designMenuItemClick(e, item) {
      let self = this;
      if (item.disabled) return;
      if (item.subData && item.subData.length) return;
      const isGroup = this.$store.state.layout.showType == 'group';
      const nodes = isGroup ? this.curNode : [this.curNode];
      switch (item.type) {
        case "copy": //创建副本
          eventBus.$emit("copyToView", {
            data: { 
              id: self.viewId,
              nodes
            }, 
            copyToCurrentView: true,
          });
          if(self.viewId == 9999){
            for(let view of self.productData.views){
              if(view.id != self.viewId){
                eventBus.$emit("copyToView", {
                  data: {
                    id: view.id,
                    nodes
                  },
                  type: 'all',
                });
              }
            }
          }
          self.$message({
            message: "复制成功",
            type: "success",
          });
          break;
        case "copyToView": //复制到
          let viewId = item.options.view_id;
          if (viewId) {
            //某个面
            // [].forEach.call(nodes, node => {
              eventBus.$emit("copyToView", {
                data: {
                  id: viewId,
                  nodes
                },
                // cloneViewLength: nodes.length
              });
            // })
          } else {
            //所有面
            for (let view of self.productData.views) {
              if (view.id != self.viewId) {
                // [].forEach.call(nodes, node => {
                  eventBus.$emit("copyToView", {
                    data: { 
                      id: view.id,
                      nodes
                    }, 
                    type: 'all',
                    // cloneViewLength: nodes.length * (self.productData.views.length - 1)
                  });
                // })
                // eventBus.$emit("copyToView", { data: { id: view.id }, type: 'all' });
              }
            }
          }
          self.$message({
            message: "复制成功",
            type: "success",
          });
          // if(isGroup) {
          //   self.m_group_unbind({update: false});
          // }
          break;
        case "setBg": //把图片设为背景
          // if (item.id == "setBg_self") {
          //   // 应用于当前面
          //   if (!self.curNode.hasName("isBg")) {
          //     eventBus.$emit("setBgImgClick", {
          //       data: true,
          //     });
          //   }
          // } else {
          //   // 应用于所有面
          //   eventBus.$emit("applyBgAllView", true);
          // }
          if (item.id == "setBg_self") {
            // 设为背景
            eventBus.$emit("applyBg", true);
          } else {
            // 应用所有面
            eventBus.$emit("applyBgAllView", true);
          }
          break;
        case "sort": //排序
          if(item.id == "sort_top") {
            if(isGroup){
              eventBus.$emit("changeGroupZIndex", "top")
            } else {
              item.nodeType == "image"
                ? eventBus.$emit("changeImgZIndex", "top")
                : eventBus.$emit("changeTextZIndex", "top");
            }
          }
          if(item.id == "sort_bottom") {
            if(isGroup){
              eventBus.$emit("changeGroupZIndex", "bottom")
            } else {
              item.nodeType == "image"
                ? eventBus.$emit("changeImgZIndex", "bottom")
                : eventBus.$emit("changeTextZIndex", "bottom");
            }
          }
          if(item.id == "sort_up") {
            if(isGroup){ 
              eventBus.$emit("changeGroupZIndex", "prev")
            } else {
              item.nodeType == "image"
                ? eventBus.$emit("changeImgZIndex", "prev")
                : eventBus.$emit("changeTextZIndex", "prev");
            }
          }
          if (item.id == "sort_down") {
            if(isGroup){
              eventBus.$emit("changeGroupZIndex", "next")
            } else {
              item.nodeType == "image"
                ? eventBus.$emit("changeImgZIndex", "next")
                : eventBus.$emit("changeTextZIndex", "next");
            }
          }
          break;
        case "flip": //翻转
          if (item.id == "flip_horizontal") {
            item.nodeType == "image"
              ? eventBus.$emit("mirrorFlip", { data: "leftRightMirror" })
              : eventBus.$emit("textMirrorFlip", "leftRightMirror");
          } else {
            item.nodeType == "image"
              ? eventBus.$emit("mirrorFlip", { data: "upDownMirror" })
              : eventBus.$emit("textMirrorFlip", "upDownMirror");
          }
          break;
        case "rotation": //旋转角度
          let rotationDeg = item.options.deg;
          if (rotationDeg) {
            // let curDeg = self.curNode.rotation();
            // let newDeg = parseFloat(curDeg) + parseFloat(rotationDeg);
            // // 角度必须在[-180,180]之间
            // if (newDeg > 180) {
            //   newDeg = newDeg - 360;
            // } else if (newDeg < -180) {
            //   newDeg = newDeg + 180;
            // }
            // self.curNode.rotation(newDeg);
            // self.curNode.fire("click");

            self.curNode.rotation(parseFloat(rotationDeg));
            self.curNode.fire("click");
            self.addHistory("图层变换", self.viewId, {
              nodeId: self.curNode.getAttrs().historyId,
            });
          }
          break;
        case "lock": //锁定解锁
          eventBus.$emit("nodeToggleLock", {
            data: self.curNode,
          });
          break;
        case "delete": //删除
          // [].forEach.call(nodes, node => {
            self.deleteNode({
              node: self.curNode,
              viewId: self.viewId,
            });
          // })
          // self.m_group_unbind();
          break;
        case "deleteClip": //删除裁切蒙版
          const designObj = linkageDesign(self.productData, self.viewId, self.curNode);
          for(let _viewId in designObj) {
            for(let item of designObj[_viewId]) {
              let nodeAttrs = JSON.parse(JSON.stringify(item.node.getAttrs()));
              await this.m_clip_restoreOriginImg(nodeAttrs, item.node);
              item.node.setAttrs({isclip: false, clipData: null});
              item.layer.batchDraw()
              self.addHistory('取消图片裁切', item.id, {
                nodeId: item.node.getAttrs().historyId
              })
              if(self.viewId == item.id){
                item.node.fire('click')
              }
            }
            self.cloneStage({viewId: _viewId});
          }
          break;
        case "setBgColor": //设置背景色
          // eventBus.$emit("openBgColorPicker");
          self.$store.commit('layout/changeLeftType', 'background');
          self.$store.commit('layout/updateSelectedBgTab', 2);
          break;
      }
      if (item.id != "rotation_custom") {
        document.getElementById("designMenu").style.display = "none";
      }
    },
    changeRotationByMenu() {
      // 将角度转化为介于[-180,180]之间的数值
      if (this.designMenuOpt.rotation != "") {
        let newDeg = parseFloat(this.designMenuOpt.rotation) % 360;
        if (newDeg > 180) {
          newDeg = newDeg - 360;
        } else if (newDeg < -180) {
          newDeg = newDeg + 180;
        }
        this.curNode.rotation(newDeg);
        this.curNode.fire("click");
        document.getElementById("designMenu").style.display = "none";
        this.addHistory("图层变换", this.viewId, {
          nodeId: this.curNode.getAttrs().historyId,
        });
      }
    },
    getShortcutName(id, onlyComplex=false){
      let data = this.customShortcutsMap[id], ret = '';
      if (data.complexKey && data.complexKey.length) {
        ret += data.complexKey.join("+");
        ret += "+";
      }
      if(this.sysPlatform != 'windows'){
        ret = ret.replace(/Ctrl/g, '⌘');
        ret = ret.replace(/Shift/g, '⇧');
        ret = ret.replace(/Alt/g, '⌥');
        ret = ret.replace(/Win/,'^');
      }
      ret += data.keys.name;
      return ret;
    },
    // 标尺
    initRulerAll() {
      if (this.isShowRuler) {
        this.initRuler({ direction: "horizontal" });
        this.initRuler({ direction: "vertical" });
      }
    },
    initRuler({ direction = "horizontal" } = {}) {
      let curStage = stageObj[`stage${this.viewId}`];
      let layerBgRect = curStage.findOne(".layerBg").getClientRect();
      let designLayer = curStage.findOne(".designLayer");
      let designLayerGroup = designLayer.findOne(".designContainerGroup");
      let designLayerGroupRect = designLayerGroup.getClientRect();
      let [stageLeft, stageTop, stageScale] = [
        curStage.x(),
        curStage.y(),
        designLayer.scale(),
      ];
      let domId = direction == "horizontal" ? "xRuler" : "yRuler";
      let domEle = document.getElementById(domId);
      let stageKey = `rulerStage${direction == "horizontal" ? "X" : "Y"}`;
      if (this[stageKey]) {
        this[stageKey].destroy();
      }
      let stage = new Konva.Stage({
        container: domId,
        width: domEle.clientWidth,
        height: domEle.clientHeight,
      });
      this[stageKey] = stage;
      let layer = new Konva.Layer();
      stage.add(layer);
      // 以可设计区域顶点为标尺的原点，分别向左和向右以每10个像素(1:1情况下)为单位画一个刻度线
      let [originX, originY] = [
        stageLeft - 16 + (layerBgRect.width - designLayerGroupRect.width) / 2,
        stageTop - 16 + (layerBgRect.height - designLayerGroupRect.height) / 2,
      ];
      let perLinePx =
        10 * (direction == "horizontal" ? stageScale.x : stageScale.y);
      // 绘制正向刻度
      let pxTotalR =
        direction == "horizontal"
          ? domEle.clientWidth - originX
          : domEle.clientHeight - originY;
      if (pxTotalR > 0) {
        for (let i = 0, j = 0; i < pxTotalR; i += perLinePx, j++) {
          let points =
            direction == "horizontal"
              ? [originX + i, 10, originX + i, 17]
              : [10, originY + i, 17, originY + i];
          if (j % 5 == 0) {
            points =
              direction == "horizontal"
                ? [originX + i, 6, originX + i, 17]
                : [6, originY + i, 17, originY + i];
          }
          if (j % 10 == 0) {
            points =
              direction == "horizontal"
                ? [originX + i, 0, originX + i, 17]
                : [0, originY + i, 17, originY + i];
          }
          let line = new Konva.Line({
            points,
            stroke: "#000",
            strokeWidth: 1,
            opacity: 0.15,
          });
          layer.add(line);
          if (j % 10 == 0) {
            let lineText = new Konva.Text({
              x: direction == "horizontal" ? originX + i + 3 : 10,
              y: direction == "horizontal" ? 10 : originY + i,
              text: String(j * 10),
              fontSize: 12,
              scale: { x: 0.75, y: 0.75 },
              rotation: direction == "horizontal" ? 0 : -90,
            });
            if (direction != "horizontal") {
              lineText.setAttr(
                "y",
                lineText.y() + lineText.getClientRect().height + 3
              );
            }
            layer.add(lineText);
          }
        }
      }
      // 绘制负向刻度
      let pxTotalL =
        direction == "horizontal"
          ? stageLeft -
            16 +
            (layerBgRect.width - designLayerGroupRect.width) / 2
          : stageTop -
            16 +
            (layerBgRect.height - designLayerGroupRect.height) / 2;
      if (pxTotalL > 0) {
        for (let i = 0, j = 0; i < pxTotalL; i += perLinePx, j++) {
          let points =
            direction == "horizontal"
              ? [originX - i, 10, originX - i, 17]
              : [10, originY - i, 17, originY - i];
          if (j % 5 == 0) {
            points =
              direction == "horizontal"
                ? [originX - i, 6, originX - i, 17]
                : [6, originY - i, 17, originY - i];
          }
          if (j % 10 == 0) {
            points =
              direction == "horizontal"
                ? [originX - i, 0, originX - i, 17]
                : [0, originY - i, 17, originY - i];
          }
          let line = new Konva.Line({
            points,
            stroke: "#000",
            strokeWidth: 1,
            opacity: 0.15,
          });
          layer.add(line);
          if (j % 10 == 0) {
            let lineText = new Konva.Text({
              x: direction == "horizontal" ? originX - i + 3 : 10,
              y: direction == "horizontal" ? 10 : originY - i,
              text: String(-j * 10),
              fontSize: 12,
              scale: { x: 0.75, y: 0.75 },
              rotation: direction == "horizontal" ? 0 : -90,
            });
            if (direction != "horizontal") {
              lineText.setAttr(
                "y",
                lineText.y() + lineText.getClientRect().height + 3
              );
            }
            layer.add(lineText);
          }
        }
      }
      layer.batchDraw();
      // 还原标尺线位置
      this.resetRulerLinePos(direction);
      // 标尺事件
      let self = this;
      if (!self.rulerMSMoveHandler) {
        self.rulerMSMoveHandler = function (e) {
          if (!self.curRulerLine) {
            let lineEl = document.createElement("div");
            lineEl.className = `ruler-line ${self.curRulerLineDir}`;
            document
              .getElementById("designer")
              .insertBefore(lineEl, document.querySelector(".designer-ruler"));
            self.curRulerLine = lineEl;
            self.rulerLineClicked = lineEl;
            self.initRulerLineEvent(lineEl, self.curRulerLineDir);
          }
          let containerRect = document
            .querySelector("#designer")
            .getBoundingClientRect();
          let linePosX = e.clientX,
            linePosY = e.clientY;
          if (self.curRulerLineDir == "horizontal") {
            self.curRulerLine.style.top = linePosY - containerRect.y + "px";
          } else {
            self.curRulerLine.style.left = linePosX - containerRect.x + "px";
          }
          e.stopPropagation();
        };
      }
      if (!self.rulerMSUpHandler) {
        self.rulerMSUpHandler = function (e) {
          if (self.curRulerLine) {
            self.rulerLineLimit(self.curRulerLine, self.curRulerLineDir);
          }
          document.removeEventListener(
            "mousemove",
            self.rulerMSMoveHandler,
            false
          );
          self.curRulerLine = null;
          self.rulerLineStart = false;
        };
      }
      stage.on("mousedown", (e) => {
        self.rulerLineStart = true;
        self.curRulerLine = null;
        self.curRulerLineDir = direction;
        if (self.rulerMSMoveHandler) {
          document.removeEventListener(
            "mousemove",
            self.rulerMSMoveHandler,
            false
          );
        }
        document.addEventListener("mousemove", self.rulerMSMoveHandler, false);
      });
      if (self.rulerMSUpHandler) {
        document.removeEventListener("mouseup", self.rulerMSUpHandler, false);
      }
      document.addEventListener("mouseup", self.rulerMSUpHandler, false);
      // 快捷键Delete删除标尺线
      if (!self.lineDeleteHandler) {
        self.lineDeleteHandler = function (e) {
          let keyCode = e.keyCode || e.which || e.charCode;
          if (keyCode == 46 && self.rulerLineClicked) {
            self.rulerLineClicked.parentNode.removeChild(self.rulerLineClicked);
          }
        };
      }
      if (self.lineDeleteHandler) {
        document.removeEventListener("keydown", self.lineDeleteHandler, false);
      }
      document.addEventListener("keydown", self.lineDeleteHandler, false);
    },
    // 标尺线事件
    initRulerLineEvent(obj, direction) {
      let self = this;
      if (!obj.lineMSMoveHandler) {
        obj.lineMSMoveHandler = function (e) {
          let changeX = e.clientX - obj.lineStartData.startX,
            changeY = e.clientY - obj.lineStartData.startY;
          if (direction == "horizontal") {
            obj.style.top = obj.lineStartData.startTop + changeY + "px";
          } else {
            obj.style.left = obj.lineStartData.startLeft + changeX + "px";
          }
          e.stopPropagation();
        };
      }
      if (!obj.lineMSUpHandler) {
        obj.lineMSUpHandler = function (e) {
          if (self.curRulerLine) {
            self.rulerLineLimit(self.curRulerLine, self.curRulerLineDir);
          }
          document.removeEventListener(
            "mousemove",
            obj.lineMSMoveHandler,
            false
          );
          self.curRulerLine = null;
        };
      }
      obj.addEventListener("mousedown", function (e) {
        self.curRulerLine = obj;
        self.curRulerLineDir = direction;
        self.rulerLineClicked = obj;
        obj.lineStartData = {
          startLeft: parseFloat(obj.style.left),
          startTop: parseFloat(obj.style.top),
          startX: e.clientX,
          startY: e.clientY,
        };
        if (obj.lineMSMoveHandler) {
          document.removeEventListener(
            "mousemove",
            obj.lineMSMoveHandler,
            false
          );
        }
        document.addEventListener("mousemove", obj.lineMSMoveHandler, false);
        let rulerLines = document.querySelectorAll(".ruler-line");
        rulerLines.forEach((l) => {
          if (l.lineMSUpHandler) {
            document.removeEventListener("mouseup", l.lineMSUpHandler, false);
          }
        });
        document.addEventListener("mouseup", obj.lineMSUpHandler, false);
      });
    },
    // 获取标尺线位置在设计区域的位置比例，设计区域变化时需要还原标尺线位置
    calcRulerLinePercent(obj, direction) {
      let curStageContainer = document.getElementById(
        "container" + this.viewId
      );
      let curStage = stageObj[`stage${this.viewId}`];
      let layerBgRect = curStage.findOne(".layerBg").getClientRect();
      if (direction == "horizontal") {
        let linePosY = parseFloat(obj.style.top);
        return (linePosY - curStage.y()) / layerBgRect.height;
      } else {
        let linePosX = parseFloat(obj.style.left);
        return (linePosX - curStage.x()) / layerBgRect.width;
      }
    },
    // 标尺线范围限制，超出设计区域删除
    rulerLineLimit(obj, direction) {
      let curStage = stageObj[`stage${this.viewId}`];
      let layerBgRect = curStage.findOne(".layerBg").getClientRect();
      if (direction == "horizontal") {
        let linePosY = parseFloat(obj.style.top);
        let minY = curStage.y();
        let maxY = minY + layerBgRect.height;
        if (linePosY < minY || linePosY > maxY) {
          obj.parentNode.removeChild(obj);
        } else {
          let percent = this.calcRulerLinePercent(obj, direction);
          obj.setAttribute("percent", percent);
        }
      } else {
        let linePosX = parseFloat(obj.style.left);
        let minX = curStage.x();
        let maxX = minX + layerBgRect.width;
        if (linePosX < minX || linePosX > maxX) {
          obj.parentNode.removeChild(obj);
        } else {
          let percent = this.calcRulerLinePercent(obj, direction);
          obj.setAttribute("percent", percent);
        }
      }
    },
    // 重置标尺线位置
    resetRulerLinePos(direction) {
      let curStage = stageObj[`stage${this.viewId}`];
      let layerBgRect = curStage.findOne(".layerBg").getClientRect();
      if (direction == "horizontal") {
        let top = curStage.y();
        let xLines = document.querySelectorAll(".ruler-line.horizontal");
        Array.from(xLines).forEach((l) => {
          let percent = l.getAttribute("percent");
          let lineTop = top + layerBgRect.height * percent;
          l.style.top = lineTop + "px";
        });
      } else {
        let left = curStage.x();
        let yLines = document.querySelectorAll(".ruler-line.vertical");
        Array.from(yLines).forEach((l) => {
          let percent = l.getAttribute("percent");
          let lineLeft = left + layerBgRect.width * percent;
          l.style.left = lineLeft + "px";
        });
      }
    },
    // 获取非操作节点图片在水平和垂直位置上的碰撞集合点
    getLineGuideStops() {
      let self = this;
      let curStageContainer = document.getElementById(
        "container" + this.viewId
      );
      let curStage = stageObj[`stage${this.viewId}`];
      let designLayer = curStage.findOne(".designLayer");
      let printAreaRect = designLayer
        .findOne(".print_area_border_outer")
        .getClientRect();
      let vertical = [
        printAreaRect.x,
        printAreaRect.x + printAreaRect.width,
        printAreaRect.x + printAreaRect.width / 2,
      ];
      let horizontal = [
        printAreaRect.y,
        printAreaRect.y + printAreaRect.height,
        printAreaRect.y + printAreaRect.height / 2,
      ];
      designLayer.find(".design").forEach((node) => {
        // 忽略背景图片和当前操作节点
        if (node.hasName("isBg")) return;
        if (node == self.curNode) return;
        let box = node.getClientRect();
        vertical.push([box.x, box.x + box.width, box.x + box.width / 2]);
        horizontal.push([box.y, box.y + box.height, box.y + box.height / 2]);
      });
      // 加入标尺线的碰撞集合点
      document.querySelectorAll(".ruler-line.vertical").forEach((l) => {
        let left = parseFloat(l.style.left);
        vertical.push(left);
      });
      document.querySelectorAll(".ruler-line.horizontal").forEach((l) => {
        let top = parseFloat(l.style.top);
        horizontal.push(top);
      });
      return {
        vertical: vertical.flat(),
        horizontal: horizontal.flat(),
      };
    }, // 获取操作节点的碰撞集合点
    getNodeSnappingEdges() {
      let box = this.curNode.getClientRect();
      let [nodeX, nodeY] = [this.curNode.x(), this.curNode.y()];
      return {
        vertical: [
          {
            guide: Math.round(box.x),
            offset: Math.round(nodeX - box.x),
            snap: "start",
          },
          {
            guide: Math.round(box.x + box.width / 2),
            offset: Math.round(nodeX - box.x - box.width / 2),
            snap: "center",
          },
          {
            guide: Math.round(box.x + box.width),
            offset: Math.round(nodeX - box.x - box.width),
            snap: "end",
          },
        ],
        horizontal: [
          {
            guide: Math.round(box.y),
            offset: Math.round(nodeY - box.y),
            snap: "start",
          },
          {
            guide: Math.round(box.y + box.height / 2),
            offset: Math.round(nodeY - box.y - box.height / 2),
            snap: "center",
          },
          {
            guide: Math.round(box.y + box.height),
            offset: Math.round(nodeY - box.y - box.height),
            snap: "end",
          },
        ],
      };
    },
    // 寻找吸附的水平和垂直线位置
    getSnappingGuides(lineGuideStops, nodeBounds) {
      const GUIDELINE_OFFSET = 5;
      let resultV = [];
      let resultH = [];
      lineGuideStops.vertical.forEach((lineGuide) => {
        nodeBounds.vertical.forEach((nodeBound) => {
          var diff = lineGuide - nodeBound.guide;
          if (Math.abs(diff) < GUIDELINE_OFFSET) {
            resultV.push({
              lineGuide: lineGuide,
              diff: diff,
              snap: nodeBound.snap,
              offset: nodeBound.offset,
            });
          }
        });
      });
      lineGuideStops.horizontal.forEach((lineGuide) => {
        nodeBounds.horizontal.forEach((nodeBound) => {
          var diff = lineGuide - nodeBound.guide;
          if (Math.abs(diff) < GUIDELINE_OFFSET) {
            resultH.push({
              lineGuide: lineGuide,
              diff: diff,
              snap: nodeBound.snap,
              offset: nodeBound.offset,
            });
          }
        });
      });
      var guides = [];
      var minV = resultV.sort((a, b) => Math.abs(a.diff) - Math.abs(b.diff))[0];
      var minH = resultH.sort((a, b) => Math.abs(a.diff) - Math.abs(b.diff))[0];
      if (minV) {
        guides.push({
          lineGuide: minV.lineGuide,
          offset: minV.offset,
          orientation: "V",
          snap: minV.snap,
          diff: minV.diff,
        });
      }
      if (minH) {
        guides.push({
          lineGuide: minH.lineGuide,
          offset: minH.offset,
          orientation: "H",
          snap: minH.snap,
          diff: minH.diff,
        });
      }
      return guides;
    },
    // 绘制吸附水平和垂直线
    drawSnappingGuides(guides) {
      let curStage = stageObj[`stage${this.viewId}`];
      let layerBg = curStage.findOne(".layerBg");
      let layerBgRect = layerBg.getClientRect();
      this.removeSnapGuideLine();
      let snapLineLayer = new Konva.Layer({
        listening: false,
        name: "snapLineLayer",
        x: -curStage.x(),
        y: -curStage.y(),
      });
      curStage.add(snapLineLayer);
      guides.forEach((lg) => {
        // let points =
        //   lg.orientation === "H"
        //     ? [-6000, lg.lineGuide, 6000, lg.lineGuide]
        //     : [lg.lineGuide, -6000, lg.lineGuide, 6000];
        let points =
          lg.orientation === "H"
            ? [
                curStage.x(),
                lg.lineGuide,
                curStage.x() + layerBgRect.width,
                lg.lineGuide,
              ]
            : [
                lg.lineGuide,
                curStage.y(),
                lg.lineGuide,
                curStage.y() + layerBgRect.height,
              ];
        var line = new Konva.Line({
          points: points,
          stroke: "#f00",
          strokeWidth: 1,
          name: "snapping-line",
          dash: [4, 6],
        });
        snapLineLayer.add(line);
        snapLineLayer.batchDraw();
      });
    },
    // 删除吸附指引线
    removeSnapGuideLine() {
      let curStage = stageObj[`stage${this.viewId}`];
      let snapLineLayer = curStage.findOne(".snapLineLayer");
      if (snapLineLayer) {
        snapLineLayer.destroy();
      }
    },
    // 元素吸附
    nodeSnapping() {
      let self = this;
      self.removeSnapGuideLine();
      let curStage = stageObj[`stage${this.viewId}`];
      let designLayer = curStage.findOne(".designLayer");
      let lineGuideStops = this.getLineGuideStops(this.curNode);
      let nodeBounds = this.getNodeSnappingEdges(this.curNode);
      let guides = this.getSnappingGuides(lineGuideStops, nodeBounds);
      if (!guides.length) return;
      this.drawSnappingGuides(guides);
      guides.forEach((lg) => {
        switch (lg.snap) {
          case "start": {
            switch (lg.orientation) {
              case "V": {
                // self.curNode.x(lg.lineGuide + lg.offset);
                self.curNode.x(self.curNode.x() + lg.diff);
                break;
              }
              case "H": {
                // self.curNode.y(lg.lineGuide + lg.offset);
                self.curNode.y(self.curNode.y() + lg.diff);
                break;
              }
            }
            break;
          }
          case "center": {
            switch (lg.orientation) {
              case "V": {
                // self.curNode.x(lg.lineGuide + lg.offset);
                self.curNode.x(self.curNode.x() + lg.diff);
                break;
              }
              case "H": {
                // self.curNode.y(lg.lineGuide + lg.offset);
                self.curNode.y(self.curNode.y() + lg.diff);
                break;
              }
            }
            break;
          }
          case "end": {
            switch (lg.orientation) {
              case "V": {
                // self.curNode.x(lg.lineGuide + lg.offset);
                self.curNode.x(self.curNode.x() + lg.diff);
                break;
              }
              case "H": {
                // self.curNode.y(lg.lineGuide + lg.offset);
                self.curNode.y(self.curNode.y() + lg.diff);
                break;
              }
            }
            break;
          }
        }
      });
    },
  },
};
</script>

<style lang="scss">
.designer {
  min-width: 452px;
  height: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  flex-direction: column;
  position: relative;
  background: #F0F2F5;
  .designer-container {
    height: calc(100vh - 148px);
    // overflow: scroll;
    position: relative;
    // margin-right: 26px;
    // background-color: #F1F1F1 !important;
    .view-img {
      position: absolute;
      left: 40px;
      top: 40px;
      z-index: 1;
      border-radius: 6px;
      .swiper-container {
        background: #fff;
        height: auto;
        padding-left: 5px;
        padding-right: 5px;
        border-radius: 20px;
        .swiper-slide {
          height: auto !important;
          margin-bottom: 0 !important;
        }
      }
      &.zw-scroll{
        .swiper-container{
          // height: 592px;
          height:100%;
          padding-right: 8px !important;
        }
      }
      .swiper-scrollbar{
        right: 0 !important;
      }
      .swiper-scrollbar-drag{
        background: rgba(0, 0, 0, 0.1)
      }
      .view-img-item {
        width: 60px;
        height: 60px;
        position: relative;
        box-sizing: initial;
        background: white;
        border-radius: 20px;
        padding: 10px;
        box-sizing: border-box;
        margin: 7px 0;
        cursor: pointer;
        // &:not(:last-child) {
        //   margin-bottom: 15px;
        // }
        &.overall-design-btn {
          margin-top: 0;
          margin-left: 5px;
          padding: 0;
          text-align: center;
          height: 32px;
          color: #0453F3;
          line-height: 32px;
        }
        &.active {
          border: 2px solid #0553F3;
        }
        &.show-type-part.active {
          border: 2px solid #B9D1FF;
        }
        img {
          width: 100%;
        }
        i.iconfont {
          position: absolute;
          right: 2px;
          bottom: 2px;
          display: block;
        }
        .design-tips {
          position: absolute;
          right: 6px;
          bottom: 6px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.15);
          &.has-design {
            background: #52c41a;
          }
        }
      }
      .item {
        &.active {
          color: #0553F3;
        }
        &.show-type-part.active {
          color: #B9D1FF;
        }
      }
      .change-view-btn {
        position: absolute;
        left: 10px;
        width: 50px;
        height: 18px;
        text-align: center;
        background: rgba(0, 0, 0, 0.15);
        font-size: 18px;
        cursor: pointer;
        i {
          &:after {
            content: ''
          }
        }
      }
      .preiew-btn {
        top: -18px;
      }
      .next-btn {
        bottom: -18px;
      }
      // .view-img-con {
      //   overflow: hidden;
      // }
      // ul {
      //   transition:margin-top 1s;
      //   -moz-transition:margin-top 1s; /* Firefox 4 */
      //   -webkit-transition:margin-top 1s; /* Safari and Chrome */
      //   -o-transition:margin-top 1s; /* Opera */
      //   li {
      //     width: 60px;
      //     height: 60px;
      //     position: relative;
      //     box-sizing: initial;
      //     background: white;
      //     border-radius: 3px;
      //     padding: 10px;
      //     box-sizing: border-box;
      //     margin: 7px 0 7px 0;
      //     // &:not(:last-child) {
      //     //   margin-bottom: 15px;
      //     // }
      //     &.active {
      //       border: 1px solid #0453F3;
      //     }
      //     img {
      //       width: 100%;
      //     }
      //     i.iconfont {
      //       position: absolute;
      //       right: 0;
      //       bottom: 0;
      //       display: block;
      //     }
      //     .design-tips {
      //       position: absolute;
      //       right: 2px;
      //       bottom: 2px;
      //       width: 8px;
      //       height: 8px;
      //       border-radius: 50%;
      //       background: rgba(0, 0, 0, 0.15);
      //       &.has-design {
      //         background: #52c41a;
      //       }
      //     }
      //   }
      // }
    }
    .stage-container {
      position: relative;
      height: 100%;
      & > div {
        position: absolute;
        left: 10000px;
        top: 0;
      }
      // padding-left: 126px;
      // margin-left: 100px;
      // margin-top: 40px;
      // margin-bottom: 40px;
    }
    .bg-color-set {
      position: absolute;
      left: 40px;
      top: 40px;
      width: 32px;
      height: 64px;
      background: #e0e4ee;
      border-radius: 5px;
      // padding: 8px 0;
      li {
        text-align: center;
        .set-to-view-icon {
          font-size: 22px;
        }
        // span {
        //   font-size: 20px !important;
        // }
        &.bg-color-pick {
          margin-bottom: 4px;
          // span {
          //   width: 20px;
          //   height: 20px;
          //   color: red;
          //   cursor: pointer;
          //   background: white;
          //   border-radius: 3px;
          //   font-size: 22px !important;
          // }
        }
      }
    }
  }
  .designer-footer {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    // margin-bottom: 20px;
    padding: 20px 20px 20px;
    z-index: 10;
    position: relative;
    &:before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      // background: #f0f5ff;
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
      -moz-backdrop-filter: blur(5px);
      -ms-backdrop-filter: blur(5px);
      -o-backdrop-filter: blur(5px);
      z-index: -1;
    }
    .designer-footer-left {
      padding: 6px 15px;
      border-radius: 20px;
      box-shadow: 1px 1px 12px #ccc;
      background: white;
      text-align:center;
      p {
        font-size: 14px;
        line-height: 22px;
        &:nth-child(1){
          color: #52c41a;
        }
      }
    }
    .designer-footer-center {
      text-align: center;
      cursor: pointer;
      p {
        font-size: 16px;
        line-height: 24px;
        font-weight: 600;
        color: #333333;
      }
      span {
        margin-left:4px;
        font-weight: 400;
        font-size: 12px;
        color: #666666;
      }
    }
    .designer-footer-right {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 10px 17px;
      border-radius: 20px;
      box-shadow: 1px 1px 12px #ccc;
      background: white;
      .maximize {
        margin-right: 28px;
        position: relative;
        &::before {
          content: "";
          position: absolute;
          top: 0;
          left: 35px;
          height: 20px;
          width: 1px;
          background: rgba(0, 0, 0, 0.15);
        }
      }
      .iconfont {
        font-size: 20px;
        position: relative;
        cursor: pointer;
      }
      .slider {
        width: 60px;
        margin: 0 12px;
      }
    }
  }
  .containerSize,
  .designAreasize {
    position: absolute;
    background-color: rgb(193, 193, 193);
    pointer-events: none;
    visibility: hidden;
    font-size: 12px;
    color: rgb(255, 255, 255);
    background-color: rgba(3, 169, 244, 0.7);
    padding: 3px 8px;
    white-space: nowrap;
    z-index: 9;
  }
  .ncRemind {
    position: absolute;
    left: 500px;
    top: 300px;
    z-index: 9;
    text-align: center;
    // width: 316px;
    display: none;
    font-size: 12px;
    .vagueRemind {
      border-radius: 4px;
      background-color: rgba(232, 78, 51, 0.78);
      color: #fff;
      padding: 4px 12px;
    }
    .defRemind {
      border-radius: 4px;
      background-color: rgba(232, 78, 51, 0.78);
      color: #fff;
      padding: 4px 12px;
      margin-top: 2px;
    }
  }
  .spaceRemind{
    position: fixed;
    background: #FFF1F0;
    border-radius: 20px;
    border: 1px solid #FFA39E;
    font-size: 14px;
    color: #333333;
    display: none;
    &>div{
      width: 604px;
      height: 40px;
      line-height: 40px;
      padding: 0 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .pointer{
        cursor: pointer;
      }
    }
    .cont{
      display: flex;
      align-items: center;
    }
    .overspread-opt{
      color: #0453F3;
    }
  }
  #cutSafeLine {
    border-radius: 4px;
    background-color: rgba(232, 78, 51, 0.78);
    position: absolute;
    z-index: 9;
    color: #fff;
    padding: 6px 20px;
    display: none;
  }
  .img-full-tip {
    position: absolute;
    left: 40px;
    top: 40px;
    width: calc(100% - 80px);
    padding: 10px 18px 10px 18px;
    background: #e6f7ff;
    border-radius: 2px;
    border: 1px solid #91d5ff;
    z-index: 10;
    .title {
      i {
        color: #0453F3;
        margin-right: 9px;
      }
      span {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.65);
      }
    }
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-left: 23px;
      margin-top: 10px;
      p {
        font-size: 12px;
        color: rgba(0, 0, 0, 0.45);
      }
    }
  }
}
.save-tip-title {
  i {
    margin-right: 10px;
    color: #faad14;
  }
}
.save-tip-content {
  .product-name {
    margin-bottom: 14px;
  }
  & > div {
    margin-left: 30px;
    margin-right: 30px;
  }
  ul {
    margin-left: 14px;
    li {
      margin-bottom: 10px;
      list-style: decimal;
      &>div{
        display: flex;
      }
    }
  }
  .sample{
    margin: 5px 0 10px -30px;
  }
}
.save-tip-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  label{
    display: flex;
    align-items: center;
  }
}
.error-tips {
  color: #ff4d4f !important;
}
.warning-tips {
  color: #faad14 !important;
}
.remind-tips {
  color: #fadb14 !important;
}
#pickCTip {
  /*取色器提示*/
  position: absolute;
  z-index: 9999;
  // display: none;
  padding: 4px 10px;
  background: #000;
  color: white;
  border-radius: 3px;
}
#pickCTip:before {
  content: "";
  border-width: 6px 6px 6px 6px;
  border-style: solid;
  border-color: transparent #000 transparent transparent;
  position: absolute;
  top: 6px;
  left: -12px;
  z-index: 1;
}
.designDeclareTips {
  position: absolute;
  top: 0;
  left: 0;
  transform: translateX(-50%);
  background-color: rgba(232, 78, 51, 0.78);
  color: #fff;
  border-radius: 4px;
  z-index: 1000;
  padding: 6px 20px;
  display: none;
  & > div {
    display: flex;
    justify-content: center;
    align-items: center;
    white-space: nowrap;
  }
  label {
    color: #0453F3;
    cursor: pointer;
  }
  input {
    vertical-align: -2px;
  }
}
.save-tip-dialog{
  border-radius: 20px !important;
}
.design-menu {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 99999;
  display: none;
  ul {
    background: #ffffff;
    box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.05),
      0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 3px 6px -4px rgba(0, 0, 0, 0.12);
    border-radius: 5px;
    min-width: 200px;
    padding: 10px 0;
  }
  .menu-item {
    white-space: nowrap;
    cursor: pointer;
    position: relative;
    font-family: sans-serif;
    &:hover {
      background: #f0f5ff;
      & > ul {
        display: block;
      }
    }
    & > a {
      display: block;
      padding: 0 15px;
      width: 100%;
      height: 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: rgba(0, 0, 0, 0.85);
      font-size: 14px;
    }
    .code {
      color: rgba(0, 0, 0, 0.25);
      font-size: 12px;
    }
    .iconfont {
      color: rgba(0, 0, 0, 0.85);
      vertical-align: -2px;
      &.rotation-icon {
        font-size: 15px;
        color: rgba(0, 0, 0, 0.25);
        // border: 1px dashed rgba(0, 0, 0, 0.65);
      }
    }
    & > ul {
      display: none;
      position: absolute;
      top: 0;
      right: -200px;
    }
    &.disabled {
      * {
        color: rgba(0, 0, 0, 0.25) !important;
      }
    }
    input {
      width: 48px;
      height: 24px;
      line-height: 24px;
      background: #ffffff;
      border-radius: 3px;
      border: 1px solid rgba(0, 0, 0, 0.15);
      padding: 0 5px;
      text-align: right;
    }
  }
}
.designer-ruler {
  z-index: 11;
  display: none;
  &::before {
    display: inline-block;
    width: 16px;
    height: 16px;
    background: #fff;
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
  }
}
.ruler-box {
  // background: rgba(255, 255, 255, 0.45);
  background: #f5f8fe;
  position: absolute;
  top: 0;
  z-index: 1;
  &.x {
    left: 16px;
    right: 0;
    height: 17px;
    border-left: 1px solid rgba(0, 0, 0, 0.15);
    border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  }
  &.y {
    top: 16px;
    bottom: 0;
    width: 17px;
    border-top: 1px solid rgba(0, 0, 0, 0.15);
    border-right: 1px solid rgba(0, 0, 0, 0.15);
  }
}
.ruler-line {
  background-color: #0453F3;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9;
  &.horizontal {
    width: 100%;
    height: 1px;
    &:hover {
      cursor: row-resize;
    }
  }
  &.vertical {
    width: 1px;
    height: 100%;
    &:hover {
      cursor: col-resize;
    }
  }
}
.view-list-container {
  box-shadow: 0px 5px 12px 4px rgba(0, 0, 0, 0.09),
    0px 3px 6px 0px rgba(0, 0, 0, 0.12), 0px 1px 2px -2px rgba(0, 0, 0, 0.16);
  border-radius: 5px;
  padding: 10px 0;
  .view-item {
    text-align: center;
    height: 40px;
    line-height: 40px;
    cursor: pointer;
    &.active {
      // color: #1f96f8;
    }
    &:hover {
      background: #f0f5ff;
    }
  }
}
.save-message{
  .el-message__content{
    display: flex;
    justify-content: space-between;
    align-content: space-between;
    width: 100%;
}
  .publish-sales{
    margin-right:10px;
    color: #0453F3;
    cursor: pointer;
  }
}
.zw-download-effect{
  color: #0453F3;
  cursor: pointer;
  margin-right:10px;
}
.zw-download-effect-pop{
  .dialog-title{
    font-size: 14px;
    line-height: 14px;
  }
  .dialog-content{
    font-size: 13px;
  }
  .tips{
    display:flex;
    line-height: 1.4;
  }
  .tips-span{
    display: inline-block;
    background: #129BA7;
    border-radius: 2px;
    color: #fff;
    height: 18px;
    line-height: 18px;
    padding: 0 8px;
  }
  .size{
    display: flex;
    align-items: center;
    
  }
}
.overspread-popper{
  border-radius: 20px;
  z-index: 8000 !important;
}
.overspread-tips-info{
  .red{
    color: #FF4D4F
  }
  .gray{
    color: #999;
    text-align: center;
    font-size: 12px;
  }
}
.overall-design-tip{
  position: fixed;
  pointer-events: none;
}
</style>
<style lang="scss" scoped>
#text-loading {
  position: absolute;
  top: 0;
  left: 0;
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  .spinner {
    &::before {
      // width: 6rem;
      // height: 6rem;
      width: 20px;
      height: 20px;
    }
  }
}
.part-view-desc {
  width: 59px;
  display: inline-block;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: keep-all;
  text-align: center;
}
</style>