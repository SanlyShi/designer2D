<template>
  <div class="gallery-detail-box" v-if="curGalleryData.type=='image'">
    <div v-if="!showFilters && !isShowClip" style="padding:0 20px;">
      <div class="operate-bar">
        <div class="operate-item primary-color" @click="replaceImgHandler">替换图片</div>
      </div>
      <div class="operate-bar">
        <el-tooltip
          v-for="item,index in imgWayOptions"
          :key="index"
          :enterable="false"
          class="operate-item mini"
          effect="dark"
          :content="item.tip+shortcutsTip(item.shortType)"
          placement="top"
          slot="reference"
        >
          <span
            :class="['iconfont',item.icon,optLock?'zw-disabled':'']"
            @click="imgMaximization(item)"
          ></span>
        </el-tooltip>
      </div>
      <div class="operate-bar">
        <el-tooltip
          :enterable="false"
          class="operate-item mini"
          effect="dark"
          :content="'水平翻转'+ shortcutsTip('element5')"
          placement="top"
        >
          <span
            :class="['iconfont iconzuoyoufanzhuan_huaban1',optLock?'zw-disabled':'']"
            @click="mirrorFlip('leftRightMirror')"
          ></span>
        </el-tooltip>
        <el-tooltip
          :enterable="false"
          class="operate-item mini"
          effect="dark"
          :content="'垂直翻转'+ shortcutsTip('element6')"
          placement="top"
        >
          <span
            :class="['iconfont iconchuizhifanzhuan_huaban1',optLock?'zw-disabled':'']"
            @click="mirrorFlip('upDownMirror')"
          ></span>
        </el-tooltip>
        <el-tooltip
          :enterable="false"
          class="operate-item mini"
          effect="dark"
          :content="'逆时针旋转45度' + shortcutsTip('element23')"
          placement="top"
        >
          <span
            :class="['iconfont iconrotate-left45',optLock?'zw-disabled':'']"
            @click="rotate45('left')"
          ></span>
        </el-tooltip>
        <el-tooltip
          :enterable="false"
          class="operate-item mini"
          effect="dark"
          :content="'顺时针旋转45度' + shortcutsTip('element22')"
          placement="top"
        >
          <span
            :class="['iconfont iconrotate-right45',optLock?'zw-disabled':'']"
            @click="rotate45('right')"
          ></span>
        </el-tooltip>
      </div>
      <div class="operate-bar mt12">
        <label class="mr12">旋转</label>
        <ZwSlideInput2
          showValueType="num"
          label="旋转"
          style="width:83px"
          :class="['rotate-slider', optLock?'zw-disabled':'']"
          :step="1"
          unit="°"
          :max="180"
          :min="-180"
          :defaultValue.sync="curGalleryDataRealTime.nodeRotation"
          @update:defaultValue="rotationChangeEnd"
          @activeChange="rotationChange"
        />
      </div>
      <div class="tileway-container">
        <div class="operate-bar">
          <el-tooltip
            v-for="item,index in tilewayOptions"
            :key="index"
            :enterable="false"
            class="operate-item medium"
            effect="dark"
            :content="item.label + '：'+shortcutsTip('gallery5')"
            placement="top"
          >
            <div 
              class="operate-item medium"
              :class="[item.value==repeatType ? 'active' : '', optLock?'zw-disabled':'']"
              @click="repeatChange(item)"
            >{{item.label}}</div>
          </el-tooltip>
        </div>
        <div class="tileway-pop" v-if="showTitleWayPop" ref="tilewayPop" @click.stop>
          <ZwSlidepop2
            showValueType="input"
            :value="tilewayAlign"
            labelfirst="横向间距"
            labelSecond="纵向间距"
            :slideLock.sync="slideLock"
            @change="tileTypeActiveChange"
            :max="180"
            :min="0"
            :step="1"
          ></ZwSlidepop2>
        </div>
      </div>
      <div class="tileway-container">
        <div class="operate-bar">
          <div class="operate-item medium" :class="[optLock?'zw-disabled':'', filterType ? 'active' : '',]" 
            @click="showOperationDetail()"
            v-if="isSupportFilter"
          >滤镜</div>
          <div class="operate-item" :class="[optLock?'zw-disabled':'', isSetClip ? 'active' : '', isSupportFilter ? 'medium' : '']" 
            @click="showClipList"
        >裁切<i class="iconfont iconnew new-tips" v-if="$store.state.newTips['clip']"></i></div>
        </div>
      </div>
      <div class="flex opt-box mt12">
        <el-popover placement="bottom" width="86" trigger="click" popper-class="zw-slide-prop">
          <ZwSlidepop
            :value.sync="curViewSize"
            @change="changeViewSize"
            title="图层缩放"
            preLabel="放大"
            nextLabel="缩小"
            @handlePreNext="scalePreNext"
            :max="100"
            :min="0"
            unit="%"
            :step="1"
            :showSlide="false"
            :showStops="false"
          ></ZwSlidepop>
          <el-tooltip
            :enterable="false"
            class="item"
            effect="dark"
            :content="'放大'+shortcutsTip('base13')+','+'缩小'+shortcutsTip('base14')"
            placement="top"
            slot="reference"
          >
            <span :class="['iconfont','iconzoom','opt-item cp',optLock?'zw-disabled':'']"></span>
          </el-tooltip>
        </el-popover>
        <el-popover
          placement="bottom"
          title="移动图层"
          width="86"
          trigger="click"
          popper-class="zw-slide-prop"
          :disabled="groupIndexDisable"
          @show="addRemoveNode = false"
        >
          <ZwSlidepop
            :value.sync="curViewIndex"
            @change="changeViewIndex"
            title="图层顺序"
            preLabel="上移"
            nextLabel="下移"
            @activeChange="viewIndexActiveChange"
            @handlePreNext="handlePreNext"
            :max="viewIndexMax"
            :min="viewIndexMin"
            :step="1"
            :prenextDisabled="true"
            :showStops="true"
            :showSlide="true"
          ></ZwSlidepop>
          <el-tooltip
            :enterable="false"
            class="item"
            effect="dark"
            content="图层顺序"
            placement="top"
            slot="reference"
          >
            <span
              :class="['iconfont','iconlayers','opt-item cp',(optLock||groupIndexDisable||!viewIndexMax)?'zw-disabled':'']"
            ></span>
          </el-tooltip>
        </el-popover>
        <el-tooltip
          :enterable="false"
          class="item"
          effect="dark"
          :content="'创建副本'+shortcutsTip('base16')"
          placement="top"
        >
          <span
            :class="['iconfont','iconfile-add','opt-item cp',(optLock||form.setBg)?'zw-disabled':'']"
            @click="copyNode($event)"
          ></span>
        </el-tooltip>

        <el-popover
          ref="copyToView"
          popper-class="zw-slide-prop"
          placement="bottom"
          title="标题"
          width="120"
          trigger="click"
        >
          <div class="view-list-container">
            <div
              @click="copyToView(item)"
              class="f14 view-item"
              v-for="(item,index) in viewIdList"
              :key="index"
            >{{item.name}}</div>
          </div>
          <el-tooltip
            :enterable="false"
            class="item"
            effect="dark"
            content="复制至其他印刷面"
            placement="top"
            slot="reference"
          >
            <span
              :class="['iconfont','iconfile-add-to','opt-item cp',form.setBg||optLock || viewIdList.length <= 1?'zw-disabled':'']"
            ></span>
          </el-tooltip>
        </el-popover>
        <el-tooltip
          :enterable="false"
          :class="['item', optLock ? 'active' : '']"
          effect="dark"
          :content="'锁定解锁/'+shortcutsTip('element17')"
          placement="top"
        >
          <span
            :class="['iconfont',optLock?'iconlock':'iconunlock','opt-item cp',]"
            @click="handleoptLock"
          ></span>
        </el-tooltip>
        <el-tooltip
          :enterable="false"
          class="item"
          effect="dark"
          :content="'删除'+shortcutsTip('base26')"
          placement="top"
        >
          <span
            :class="['iconfont','icondelete','opt-item cp', optLock ? 'zw-disabled' : '']"
            @click="handleoptDelete"
          ></span>
        </el-tooltip>
      </div>
    </div>
    <keep-alive>
      <zw-filter v-if="showFilters" @closeFilter="closeFilter()"></zw-filter>
      <zw-clip v-if="isShowClip" @close="closeClip"></zw-clip>
    </keep-alive>
    <!-- 替换图片弹窗 -->
    <GalleryPop :isBg="isBgNode" v-if="showReplacePop" @close="showReplacePop=false"></GalleryPop>
    <el-dialog
      :visible.sync="isShowImgFullSet"
      custom-class="zw-message-pop"
      :modal-append-to-body="false"
      :destroy-on-close="true"
      width="480px"
    >
      <div slot="title" class="dialog-title">
        <i class="el-icon-warning primary-icon"></i> 图片设置选择
      </div>
      <div class="dialog-content">
        <div class="switch-con">
          <span>自动应用于所有面：</span>
          <el-switch
            v-model="isApply">
          </el-switch>
        </div>
        <div class="tip">
          针对全副多面产品：
          <br />开启状态，添加首张图片将默认设为背景并应用于所有面；
          <br />关闭状态，添加图片时仅用于当前面，且不设为背景。
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowImgFullSet=false">取消</el-button>
        <el-button type="primary" @click="confirmImgFullSet()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import eventBus from "@/utils/eventBus.js";
import ZwSelect from "@/components/common/ZwSelect";
import ZwInput from "@/components/common/ZwInput";
import ZwUnitInput from "@/components/common/ZwUnitInput";
import ZwSlideInput2 from "@/components/common/ZwSlideInput2";
import ZwSlidepop from "@/components/common/ZwSlidepop";
import ZwSlidepop2 from "@/components/common/ZwSlidepop2";
import ZwColorPicker from "@/components/common/ZwColorPicker";
import ZwFilter from './ZwFilter.vue';
import ZwClip from './ZwClip.vue';
import { _getRender, _changeImgStyle } from "@/apis/gallery.js";
import { stageObj, linkageDesign, alignmentCanvas } from "@/utils/designer.js";
import Color from "@/utils/color";
import {checkPlatform, genLocalStorageKey} from '@/utils/utils';
import GalleryPop from '@/components/Gallery/GalleryPop'
import TIPS from "@/mixins/tips";
export default {
  name: "GalleryDetail",
  props: {},
  mixins: [TIPS],
  components: {
    ZwSelect,
    ZwInput,
    ZwUnitInput,
    ZwSlideInput2,
    ZwSlidepop,
    ZwSlidepop2,
    ZwColorPicker,
    ZwFilter,
    ZwClip,
    GalleryPop
  },
  data() {
    return {
      showReplacePop: false,
      isBgNode: false,
      showFilters: false,
      filterType: '',
      isSetClip: false,
      //图案平铺横纵间距
      tilewayAlign: [0, 0],
      showTitleWayPop: false,
      curViewIndex: 0,
      curViewSize: 0,
      viewIndexMax: 0,
      viewIndexMin: 0,
      addRemoveNode: false,
      slideLock: true,
      optBoxStyle: {},
      scrollBox: null,
      // optLock: false,
      iconlock: true,
      form: {
        // alignType: "",
        // alignType2: "1",
        // width: "",
        // height: "",
        // offsetX: "",
        // offsetY: "",
        angle: 0,
        opacity: 0,
        indexType: "1",
        imgWay: "",
        background_color: null,
        setBg: false,
        useallview: false,
        // useall: false,
        distribution: "",
      },
      imageAjustmentItem: null,
      // curiImageFilter: {
      //   code: "",
      //   imgUrl: "",
      // },
      // lastImgeFilter: null,
      colorAjustmentObj: {
        definition: 0,
        saturation: 0,
        brightness: 0,
        contrast: 0,
        colorTemp: 0,
        hue: 0,
      },
      colorAjustmentObjCopy: {},
      colorAjustmentInputObj: {
        definition: 0,
        saturation: 0,
        brightness: 0,
        contrast: 0,
        colorTemp: 0,
        hue: 0,
      },
      lastcolorAjustmentObj: null,
      colorAjustmentOption: [
        {
          label: "清晰度",
          key: "definition",
          min: -100,
          max: 100,
        },
        {
          label: "饱和度",
          key: "saturation",
          min: -100,
          max: 100,
        },
        {
          label: "亮度",
          key: "brightness",
          min: -100,
          max: 100,
        },
        {
          label: "对比度",
          key: "contrast",
          min: -100,
          max: 100,
        },
        {
          label: "色温",
          key: "colorTemp",
          min: -100,
          max: 100,
        },
        {
          label: "色调",
          key: "hue",
          min: 0,
          max: 360,
          unit: "°",
        },
      ],
      indexTypeOption: [
        {
          label: "正常",
          value: "1",
        },
        // {
        //   label: "正片叠底",
        //   value: "2"
        // },
        // {
        //   label: "线性减淡",
        //   value: "3"
        // },
        // {
        //   label: "线性加深",
        //   value: "4"
        // }
      ],
      imgWayOptions: [
        {
          label: "最大化",
          value: "imgFull",
          icon: "iconfullscreen1",
          tip: "最大化设计",
          shortType: "element20",
        },
        {
          label: "铺满",
          value: "imgAdaptFull",
          icon: "iconarrawsalt",
          tip: "铺满设计区域",
          shortType: "element21",
        },
        {
          label: "适高",
          value: "heightMaximization",
          icon: "iconcolum-height",
          tip: "高度最大化",
          shortType: "element19",
        },
        {
          label: "适宽",
          value: "widthMaximization",
          icon: "iconcolumn-width1",
          tip: "宽度最大化",
          shortType: "element18",
        },
        // {
        //   label: "还原",
        //   value: "restore",
        //   icon: "iconcolumn-reduction",
        //   tip: "还原",
        //   shortType: "",
        // },
      ],
      decorateOptions: [
        {
          label: "裁切",
          value: "1",
          icon: "iconcrop",
          showMore: false,
          disabled: false,
        },
        {
          label: "抠图",
          value: "2",
          icon: "iconcutout",
          showMore: false,
          disabled: true,
        },
        {
          label: "清晰",
          value: "3",
          icon: "iconbright",
          showMore: true,
          disabled: true,
        },
        {
          label: "滤镜",
          value: "4",
          icon: "iconfilter",
          showMore: true,
          disabled: true,
        },
      ],
      tilewayOptions: [
        // {
        //   label: "无",
        //   value: "",
        //   icon: "iconnum-c1",
        //   showPop: false,
        //   offset: 0,
        //   disabled: false,
        // },
        {
          label: "基础平铺",
          value: "basicsTile",
          icon: "iconnum-c2",
          showPop: true,
          offset: 160,
          disabled: false,
        },
        {
          label: "镜像平铺",
          value: "Mirror",
          icon: "iconnum-c3",
          showPop: true,
          offset: 120,
          disabled: false,
        },
        {
          label: "横向平铺",
          value: "XSpacedTile",
          icon: "iconnum-c4",
          showPop: true,
          offset: 80,
          disabled: false,
        },
        {
          label: "纵向平铺",
          value: "YSpacedTile",
          icon: "iconnum-c5",
          showPop: true,
          offset: 40,
          disabled: false,
        },
        // {
        //   label: "随机平铺",
        //   value: "6",
        //   icon: "iconnum-c6",
        //   showPop: true,
        //   offset: 0,
        //   disabled: true,
        // },
      ],
      alignboxOptions: [
        {
          label: "左上角对齐",
          value: "topleft",
          icon: "icondistributed-left-top",
          shortType: "",
          placement: "top",
        },
        {
          label: "上对齐",
          value: "topcenter",
          icon: "icondistributed-top",
          shortType: "base9",
          placement: "top",
        },
        {
          label: "右上角对齐",
          value: "topright",
          icon: "icondistributed-right-top",
          shortType: "",
          placement: "top",
        },
        {
          label: "左对齐",
          value: "centerleft",
          icon: "icondistributed-left",
          shortType: "base11",
          placement: "left",
        },
        {
          label: "居中对齐",
          value: "centercenter",
          icon: "icondistributed-center",
          shortType: "",
          placement: "top",
        },
        {
          label: "右对齐",
          value: "centerright",
          icon: "icondistributed-right",
          shortType: "base12",
          placement: "right",
        },
        {
          label: "左下角对齐",
          value: "bottomleft",
          icon: "icondistributed-left-bottom",
          shortType: "",
          placement: "bottom",
        },
        {
          label: "下对齐",
          value: "bottomcenter",
          icon: "icondistributed-bottom",
          shortType: "base10",
          placement: "bottom",
        },
        {
          label: "右下角对齐",
          value: "bottomright",
          icon: "icondistributed-right-bottom",
          shortType: "",
          placement: "bottom",
        },
      ],
      alignboxOptions2: [
        {
          label: "水平",
          value: "horizontalcenter",
          icon: "icondistribute-plumb",
        },
        {
          label: "垂直",
          value: "verticalcenter",
          icon: "icondistribute-level",
        },
      ],
      optboxOptions: [
        {
          label: "缩放",
          value: "1",
          icon: "iconzoom",
        },
        {
          label: "图层顺序",
          value: "2",
          icon: "iconview-layers",
          showPop: true,
        },
        {
          label: "复制",
          value: "3",
          icon: "iconfile-add",
          showPop: false,
        },
        {
          label: "复制至其他印刷面",
          value: "4",
          icon: "iconfile-add-to",
          showPop: false,
        },
        {
          label: "锁定",
          value: "5",
          icon: "iconlock",
          showPop: false,
        },
        {
          label: "删除",
          value: "6",
          icon: "icondelete",
          showPop: false,
        },
      ],
      repeatType: "",
      confirmCheck: {
        useallview: false,
        useall: false,
      },
      layer: null,
      viewId: 0,
      node: null,
      groupNode: null,
      groupIndexDisable: false, //背景图层级不可用
      isApply: true,
      isShowImgFullSet: false,
      isShowReplaceTips: false,
      isShowReplaceTipsMask: false,
      layerAction:"" //用于判断图层是上移还是下移
    };
  },
  filters: {
    getExt(value) {
      if (value) {
        let index = value.lastIndexOf(".");
        let ext = value.substr(index);
        return ext;
      } else {
        return ".jpg";
      }
    },
  },
  computed: {
    view_id: function () {
      return this.$store.getters.view_id;
    },
    viewIdList: function () {
      let allViewsCfg = JSON.parse(
        JSON.stringify(this.$store.getters.allViewsCfg)
      );
      let index = allViewsCfg.findIndex((item) => {
        return item.id == this.view_id;
      })
      if(index != -1) {
        allViewsCfg.splice(
          allViewsCfg.findIndex((item) => {
            return item.id == this.view_id;
          }),
          1
        );
      }
      allViewsCfg.unshift({ id: -1, name: "所有面" });
      return allViewsCfg;
    },
    optLock: function () {
      return this.node ? this.node.isLock : false;
    },
    isSupportFilter(){
      if(!this.$sdkConfig.platformIsZWKJ && this.$sdkConfig.customGallery?.galleryApi) return false;
      if(this.$sdkConfig.platform != 'xcxBackend'){
        return true
      }else{
        return false
      }
    },
    galleryData: function () {
      return this.$store.getters.galleryData;
    },
    showType() {
      return this.$store.state.layout.showType;
    },
    curGalleryDataRealTime() {
      return this.$store.state.gallery.curGalleryDataRealTime;
    },
    curGalleryData() {
      // this.addRemoveNode = false;
      let curGalleryData = this.$store.state.gallery.curGalleryData;
      if(curGalleryData.type != 'image') return curGalleryData;

      if (curGalleryData.node) {
        this.node = curGalleryData.node;
        this.filterType = curGalleryData.node.getAttrs().filterType;
        this.isSetClip = curGalleryData.node.getAttrs().isclip;
        // let code = curGalleryData.node.getAttrs().filterType;
        // let flipImgUrl = curGalleryData.node.getAttrs().flipImgUrl;
        // if (!this.lastImgeFilter) {
        //   this.lastImgeFilter = {
        //     id: curGalleryData.node._id,
        //     code: code,
        //     imgUrl: flipImgUrl,
        //   };
        // } else if (this.lastImgeFilter.id !== curGalleryData.node._id) {
        //   this.lastImgeFilter = {
        //     id: curGalleryData.node._id,
        //     code: code,
        //     imgUrl: flipImgUrl,
        //   };
        // }
        // this.curiImageFilter.code = code;
        // this.curiImageFilter.imgUrl = flipImgUrl;
      }
      if (
        curGalleryData.node &&
        !curGalleryData.node.hasName("isBg") &&
        !curGalleryData.node.hasName("bgRect")
      ) {
        this.groupIndexDisable = false;
        this.layer = this.node.getLayer();
        if (this.layer) {
          this.viewId = this.layer.getAttrs().viewId
          this.groupNode = this.layer.findOne(
            `.repeatImgGroup${curGalleryData.node._id}`
          )
            ? this.layer.findOne(`.repeatImgGroup${this.node._id}`)
            : curGalleryData.node;
          let designList = this.layer.find(".design").filter((item) => {
            return !item.hasName("bgRect") && !item.hasName("isBg");
          });
          this.viewIndexMax = designList.length - 1;
          this.repeatType = this.node.getAttrs().tileType;
          this.tilewayAlign = [
            this.node.getAttrs().spacingH,
            this.node.getAttrs().spacingV,
          ];
          // console.log('888888', this.groupNode.getZIndex(), this.viewIndexMax)
        }
      } else {
        // console.log('2222')
        // this.addRemoveNode = false
        this.groupIndexDisable = true;
      }

      return curGalleryData;
    },
    pickDefineColor() {
      // console.log("++++++++", this.$store.state.gallery.pickDefineColor);
      return this.$store.state.gallery.pickDefineColor;
    },
    customShortcutsMap() {
      return this.$store.state.shortcut.customShortcutsMap;
    },
    // isImgReplace: {
    //   get(){
    //     return this.$store.state.gallery.isImgReplace;
    //   },
    //   set(val){
    //     this.$store.commit("gallery/changeImgReplaceStatus", val);
    //   }
    // }
    product() {
      return this.$store.state.product.selectedProduct;
    },
    isShowClip(){
      return this.$store.state.clip.isShowClip
    }
  },
  watch: {
    isShowReplaceTips(nv){
      if(!nv){
        this.isShowReplaceTipsMask = false;
      }
    },
    isShowReplaceTipsMask(nv){
      if(!nv){
        this.addReplaceTipToStorage();
      }
    },
    view_id: function (val) {
      // console.log(val);
      // if (this.galleryData[val]) {
      //   this.form = this.galleryData[val];
      // } else {
      //   this.form = this.defaultForm;
      // }
    },
    "curGalleryData.node._id": {
      handler(nv) {
        if(this.curGalleryData?.type != 'image') return;
        this.addRemoveNode = true;
        this.showFilters = false
        if (nv && !this.groupIndexDisable && this.groupNode) {
          // let curViewIndex = this.groupNode.getZIndex();
          // if (this.layer.findOne(".isBg")) curViewIndex -= 1;
          // if (this.layer.findOne(".bgRect")) {
          //   curViewIndex -= 1;
          //   this.form.background_color = this.layer.findOne(
          //     ".bgRect"
          //   ).attrs.fill;
          // } else {
          //   this.form.background_color = "";
          // }
          // this.curViewIndex = curViewIndex;

          // 解决QA-3327图层移动问题
          let designList = this.layer.find(".design").filter((item) => {
            return !item.hasName("bgRect") && !item.hasName("isBg");
          });
          this.curViewIndex = designList.findIndex(a => a._id == nv);
          if(this.layer.findOne('.bgRect')){
            this.form.background_color = this.layer.findOne(".bgRect").attrs.fill;
          } else {
            this.form.background_color = "";
          }
        }
      },
      immediate: true,
    },
    viewIndexMax(nv, ov) {
      this.addRemoveNode = true;
      let curViewIndex = this.groupNode.getZIndex();
      if (this.layer.findOne(".isBg")) curViewIndex -= 1;
      if (this.layer.findOne(".bgRect")) curViewIndex -= 1;
      this.curViewIndex = curViewIndex;
    },
    colorAjustmentObj: {
      handler(nv) {
        this.colorAjustmentInputObj = Object.assign({}, nv);

        eventBus.$emit("changeColorAjustment", nv);
        // console.log(nv, "watch colorAjustmentObj");
      },
      deep: true,
    },

    // 'form.setBg': {
    //   handler(nv, ov) {
    //     if(nv != ov) {
    //       console.log('uuuuu22222',nv, ov, this.form.setBg)
    //       eventBus.$emit('setBgImgClick', {data: nv})
    //     }
    //   }
    // }
    iconlock(nv) {
      this.$store.commit("layout/changeImgKeepRatioLock", nv);
    },
  },
  directives: {
    resize: {
      // 指令的定义
      bind: function (el, bind) {
      },
      update: function (el) {
      },
    },
  },
  created() {
    // this.getRender();
  },

  mounted() {
    eventBus.$on("closeFilter", (data) => {
      this.closeFilter();
    });
    // this.scrollBoxListener();
    // window.addEventListener("resize", this.handlescroll);
    eventBus.$on("changeSelectNode", (data) => {
      // console.log('ssss', !data.data)
      // if(!data.data) {
      //   this.form.setBg = false;
      //   this.form.useallview = false
      // }else {
      if(Array.isArray(data.data)) return;
      if (data.data.hasName("isBg")) {
        this.form.setBg = true;
      } else {
        this.form.setBg = false;
      }
      if (data.data.hasName("bgApplyAllView")) {
        this.form.useallview = true;
        this.confirmCheck.useallview = true;
      } else {
        this.form.useallview = false;
        this.confirmCheck.useallview = false;
      }
      // }
    });
    // eventBus.$on("changeSelectView", data => {
    //   if (data.data.findOne(".bgRect")) {
    //     this.form.background_color = data.data
    //       .findOne(".bgRect")
    //       .getAttrs().fill;
    //   } else {
    //     this.form.background_color = null;
    //   }
    //   if (data.data.findOne(".bgColorApplyAllView")) {
    //     this.form.useall = true;
    //   } else {
    //     this.form.useall = false;
    //   }
    // });
    eventBus.$on("changeImgZIndex", (position) => {
      // this.nodeSortFlag = true;
      this.addRemoveNode = true;
      let flag = false;
      switch (position) {
        case "top": //顶层
          if (this.curViewIndex < this.viewIndexMax) {
            this.groupNode.moveToTop();
            this.groupNode.moveDown(); //有一个print_area_border_outer矩形在最上层
            this.curViewIndex = this.viewIndexMax;
            flag = true;
          }
          break;
        case "bottom": //底层
          if (this.curViewIndex > this.viewIndexMin) {
            if (this.layer.findOne(".bgRect")) {
              this.groupNode.zIndex(this.layer.findOne(".bgRect").zIndex() + 1);
            }
            if (this.layer.findOne(".isBg")) {
              this.groupNode.zIndex(this.layer.findOne(".isBg").zIndex());
            }
            if (
              !this.layer.findOne(".bgRect") &&
              !this.layer.findOne(".isBg")
            ) {
              this.groupNode.moveToBottom();
            }
            this.curViewIndex = this.viewIndexMin;
            flag = true;
          }
          break;
        case "prev": //上移一层
          if (this.curViewIndex < this.viewIndexMax) {
            this.groupNode.moveUp();
            this.curViewIndex = this.curViewIndex + 1;
            flag = true;
          }
          break;
        case "next": //下移一层
          if (this.curViewIndex > this.viewIndexMin) {
            this.groupNode.moveDown();
            this.curViewIndex = this.curViewIndex - 1;
            flag = true;
          }
          break;
      }
      if (flag) {
        this.curGalleryData.node.getLayer().batchDraw();
        eventBus.$emit("cloneStage", {id: this.viewId, designArr: [{
          id: this.viewId,
          node: this.curGalleryData.node
        }]});
        eventBus.$emit("addHistory", "图层排序", {
          nodeId: this.curGalleryData.node.getAttrs().historyId,
        });
        this.changeViewIndex();
        setTimeout(() => {
          this.addRemoveNode = false;
        }, 500);
      }
    });
    eventBus.$on("setBgImgClickEnd", () => {
      this.curViewIndex = this.viewIndexMin;
    });
    // 图片设为背景图(右键功能)
    eventBus.$on("applyBg", () => {
      if (!this.form.setBg) {
        this.form.setBg = true;
        this.confirmCheck["useallview"] = true;
        eventBus.$emit("setBgImgClick", { data: true });
      }
    });
    // 图片设为背景图应用所有面(右键功能)
    eventBus.$on("applyBgAllView", () => {
      if (!this.form.useallview) {
        this.$confirm("此操作将应用所有面, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.form.useallview = true;
            eventBus.$emit("setBgImgClick", {
              data: this.form.useallview,
              type: "all",
            });
            this.form.setBg = true;
          })
          .catch(() => {});
        // this.$confirm("此操作将应用所有面, 是否继续?", "提示", {
        //   confirmButtonText: "确定",
        //   cancelButtonText: "取消",
        //   type: "warning"
        // })
        //   .then(() => {
        //     // 需要先设为背景才能应用所有面
        //     if (!this.groupNode.hasName("isBg")) {
        //       eventBus.$emit("setBgImgClick", {
        //         data: true
        //       });
        //     }
        //     this.form["useallview"] = true;
        //     this.confirmCheck["useallview"] = !this.confirmCheck["useallview"];
        //     eventBus.$emit("setBgImgClick", {
        //       data: true,
        //       type: "all"
        //     });
        //   })
        //   .catch(() => {});
      }
    });
    eventBus.$on("changeImgScale", (type) => {
      this.scalePreNext(type);
    });
    eventBus.$on("imgAlign", (position) => {
      this.changeAlignType({ value: position }, 1);
    });
    //设为背景调整图层层级
    eventBus.$on("bgImgSetLevel", () => {
      this.changeViewIndex(true);
    });
    eventBus.$on("toggleImgFilter", () => {
      this.showFilters = !this.showFilters;
      this.$statisticalreport.biCommonFn('滤镜', this.node)
    });
    let _this = this;
    document.addEventListener("mouseup", (e) => {
      let pop = this.$refs.tilewayPop;
      if (pop) {
        if (!pop.contains(e.target)) {
          this.showTitleWayPop = false;
        }
      }
    });
  },
  beforeDestroy() {
    // window.removeEventListener("resize", this.handlescroll);
  },
  methods: {
    replaceImgHandler(){
      if(this.curGalleryData.node && this.curGalleryData.node.hasName("isBg")){
        this.$statisticalreport.clickDesignItemEditBtn('替换图片','背景')
        if(this.$sdkConfig.platformIsZWKJ){
          this.$message({
            message: '替换背景请在左侧背景图中直接选择',
            type: 'warning'
          });
          this.$store.commit("layout/changeLeftType", "background");
          return;
        } else {
          this.isBgNode = true;
          this.showReplacePop = true; 
        }
      } else {
        this.isBgNode = false;
        this.showReplacePop = true;
        this.$statisticalreport.clickDesignItemEditBtn('替换图片','图片')
      }
    },
    showOperationDetail() {
      this.showFilters = true
      this.$statisticalreport.biCommonFn('滤镜', this.node)
    },
    closeFilter() {
      this.showFilters = false
    },
    showClipList(){
      if(this.repeatType){
        this.$message({
          message: '平铺后不支持裁切，请移除平铺后重试',
          type: 'warning'
        });
        return;
      }
      let clipData = this.curGalleryData.node.getAttrs().clipData;
      this.$store.commit('clip/setClipData', clipData?.clipPath || {});
      this.$store.commit('clip/updateIsShowClip', true);
      this.$statisticalreport.biCommonFn('裁切', this.node)
    },
    closeClip(){
      this.$store.commit('clip/updateIsShowClip', false);
    },
    addReplaceTipToStorage(){
      const localStorageKey = genLocalStorageKey('noImgReplaceTipLists');
      let customerId = this.$isLogin ? this.$OPTIONS.userInfo.code : "unlogin";
      let noTipsLists = JSON.parse(localStorage.getItem(localStorageKey));
      if(!noTipsLists) noTipsLists = [];
      if (!noTipsLists.some((a) => a == customerId)){
        noTipsLists.push(customerId);
      }
      localStorage.setItem(localStorageKey, JSON.stringify(noTipsLists));
    },
    setImgFull() {
      const localStorageKey = genLocalStorageKey('imgFullSet');
      this.isShowImgFullSet = true;
      let customerId = this.$isLogin ? this.$OPTIONS.userInfo.code : "unlogin";
      let imgFullSet = [];
      this.isApply = true;
      if (localStorage.getItem(localStorageKey)) {
        imgFullSet = JSON.parse(localStorage.getItem(localStorageKey));
        this.isApply =
          imgFullSet[
            imgFullSet.findIndex((item) => {
              return item.customerId == customerId;
            })
          ].isApply;
      }
    },
    confirmImgFullSet() {
      const localStorageKey = genLocalStorageKey('imgFullSet');
      this.isShowImgFullSet = false;
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
        isApply: this.isApply,
      });
      localStorage.setItem(localStorageKey, JSON.stringify(imgFullSet));
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
    handleMouseLeave() {
      const tooltip = this.$refs.tooltip;
      tooltip.handleClosePopper();
    },
    scrollBoxListener() {
      let _this = this;
      this.scrollBox = this.$refs["gallerydetail"];
      this.scrollBox.onscroll = () => {
        _this.handlescroll();
      };
    },
    handlescroll() {
      let w = document.documentElement.clientWidth || document.body.clientWidth; //兼容IE8
      if (w > 1450 || w < 1110) {
        this.optBoxStyle = {};
      } else {
        let scrollBox = this.scrollBox;
        let scrollBoxH = scrollBox.offsetHeight;
        let scrollTop = scrollBox.scrollTop;
        if (scrollBoxH + scrollTop < 522) {
          // console.log(scrollBoxH + scrollTop, "11111111");
          this.optBoxStyle = {
            position: "fixed",
            width: "275px",
            top: scrollBoxH + "px",
            right: 0,
            background: "#fff",
            "border-top": "1px solid #f0f5ff",
            "border-bottom": "1px solid #f0f5ff",
            padding: "15px 20px 10px 20px",
            "z-index": 1,
          };
        } else {
          this.optBoxStyle = {};
        }
      }
    },
    formateColor(color) {
      if (!color) {
        return null;
      } else {
        const formateColor = new Color({
          enableAlpha: false,
          format: "hex",
        });
        formateColor.fromString(color);
        return {
          value: formateColor.value,
          alpha: formateColor._alpha / 100,
          color: color,
        };
      }
    },
    handleFocus(e) {
      this.$store.commit("shortcut/updateFocusStatus", true);
    },
    handleBlur() {
      this.$store.commit("shortcut/updateFocusStatus", false);
    },
    handleInput(val, key) {
      if (val < -100) {
        this.colorAjustmentInputObj[key] = -100;
      } else if (val > 100) {
        this.colorAjustmentInputObj[key] = 100;
      }
    },
    handleChange(val, key) {
      let valNum = Number(val);
      if (typeof valNum === "number" && !isNaN(valNum)) {
        this.colorAjustmentObj[key] = valNum;
      } else {
        this.colorAjustmentInputObj[key] = this.colorAjustmentObj[key];
      }
    },
    //图案选项：裁切 抠图 清晰 滤镜
    // getRender() {
    //   _getRender().then((res) => {
    //     console.log(res);
    //     this.renderList = res.data;
    //   });
    // },
    imageAjustment(item) {
      this.imageAjustmentItem = item;
      switch (item.value) {
        case "1":
          break;
        case "2":
          break;
        case "3":
          this.colorAjustmentObjCopy = Object.assign(
            {},
            this.colorAjustmentObj
          );
          break;
        case "4":
          break;
      }
    },
    //图片渲染风格确定
    ajustmentConfirm() {
      switch (this.imageAjustmentItem.value) {
        case "1":
          eventBus.$emit("imgClipSave");
          this.imageAjustmentItem = null;
          break;
        case "2":
          break;
        case "3":
          this.imageAjustmentItem = null;
          break;
        case "4":
          // this.lastImgeFilter = {
          //   ...this.lastImgeFilter,
          //   ...this.curiImageFilter,
          // };
          this.imageAjustmentItem = null;
          break;
        default:
          break;
      }
    },
    //图片渲染风格取消
    ajustmentCancel() {
      switch (this.imageAjustmentItem.value) {
        case "1":
          eventBus.$emit("imgClipCancel");
          this.imageAjustmentItem = null;
          break;
        case "2":
          break;
        case "3":
          this.imageAjustmentItem = null;
          this.colorAjustmentObj = this.colorAjustmentObjCopy;
          break;
        case "4":
          this.imageAjustmentItem = null;
          break;
        default:
          break;
      }
    },
    tileTypeActiveChange(value) {
      this.tilewayAlign = value;
      eventBus.$emit("repeatSpacing", value);
    },
    //切换图层
    //replaceBg埋点--辨别替换背景是否触发该方法
    changeViewIndex(replaceBg = false) {
      if (!this.groupNode || !this.groupNode.getLayer()) return;
      let layer = this.groupNode.getLayer();
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
            if(design._id == this.groupNode._id){
              design.isSelected = true;
            } else {
              design.isSelected = false;
            }
          }
          // break;
        }
      }
      
      this.$store.commit("gallery/getDesignImgList", {
        data: designImgList,
      });
      eventBus.$emit("changeViewIndex");
     if(!replaceBg){
      this.$nextTick(()=>{
        const biList = {
          'up':'图层上移',
          'down':'图层下移',
        }
        const type =  this.curGalleryData.node.hasName("isBg")?'背景':"图片"
        biList[this.layerAction] ? this.$statisticalreport.clickDesignItemEditBtn(biList[this.layerAction], type) :''
      })
      }
    },
    handlePreNext(val) {
      this.$nextTick(() => {
        this.changeViewIndex();
      });
    },
    viewIndexActiveChange(data) {
      this.layerAction = data.type
      if (this.addRemoveNode) return;
      // if (this.nodeSortFlag) return;
      // if (!this.addRemoveNode) {
      const designObj = linkageDesign(this.product, this.viewId, this.groupNode)
      for(let _viewId in designObj) {
        for(let item of designObj[_viewId]) {
          if (data.type == "up") {
            item.node.moveUp();
          } else {
            item.node.moveDown();
          }
          eventBus.$emit("addHistory", "图层排序", {
            nodeId: item.node.getAttrs().historyId,
          });
        }
        designObj[_viewId][0].layer.batchDraw();
      }
      if (data.type == "up") {
        this.curViewIndex = data.val;
      } else {
        this.curViewIndex = data.val;
      }
      // }
      // this.addRemoveNode = false;
      // this.nodeSortFlag = false;
    },
    //缩放图层
    changeViewSize(val) {},
    scalePreNext(val) {
      const designObj = linkageDesign(this.product, this.viewId, this.node)
      for(let _viewId in designObj) {
        for(let item of designObj[_viewId]) {
          switch (val) {
            case 1:
              item.node.scaleX(
                item.node.scaleX() > 0
                  ? item.node.scaleX() + 0.1
                  : item.node.scaleX() - 0.1
              );
              item.node.scaleY(
                item.node.scaleY() > 0
                  ? item.node.scaleY() + 0.1
                  : item.node.scaleY() - 0.1
              );
              break;
            case -1:
              item.node.scaleX(
                item.node.scaleX() > 0
                  ? item.node.scaleX() - 0.1
                  : item.node.scaleX() + 0.1
              );
              item.node.scaleY(
                item.node.scaleY() > 0
                  ? item.node.scaleY() - 0.1
                  : item.node.scaleY() + 0.1
              );
              break;
          }
        }
        designObj[_viewId][0].layer.batchDraw();
        eventBus.$emit("cloneStage", {id: _viewId, designArr: designObj[_viewId]});
      }
      this.node.fire("click");
      
      const biList = {
        '1':'图层放大',
        '-1':'图层缩小',
      }
      const name =  this.curGalleryData.node.hasName("isBg")?'背景':"图片"
      biList[val] ? this.$statisticalreport.clickDesignItemEditBtn(biList[val],name) : ''
    },
    //锁定
    handleoptLock() {
      // this.optLock = !this.optLock;
      // this.node.isLock = this.optLock
      eventBus.$emit("nodeToggleLock", { data: this.node });
    },
    //删除
    handleoptDelete() {
      eventBus.$emit("nodeToggleDelete");
    },
    copyToView(item) {
      if (item.id == -1) {
        for (let view of this.viewIdList) {
          if (view.id != -1) {
            eventBus.$emit("copyToView", { data: view, type: 'all' });
          }
        }
      } else {
        eventBus.$emit("copyToView", { data: item });
      }
      this.$refs.copyToView.doClose();
      this.$message({
        message: "复制成功",
        type: "success",
      });
    },

    rotationChange(val) {
      eventBus.$emit("rotationChange", { data: val });
    },
    rotationChangeEnd(val) {
      eventBus.$emit("rotationChangeEnd", { data: val });
    },
    opacityChange(val) {
      eventBus.$emit("opacityChange", { data: val / 100 });
    },
    changeAlignType(data, type) {
      const designObj = linkageDesign(this.product, this.viewId, this.node)
      for(let _viewId in designObj) {
        for(let item of designObj[_viewId]) {
          var historyName = "";
          switch (type) {
            case 1:
              this.form.alignType = data.value;
              historyName = "对齐图层";
              break;
            case 2:
              this.form.distribution = data.value;
              historyName =
                data.value == "horizontalcenter" ? "水平分布" : "垂直分布";
              break;
          }
          alignmentCanvas({ node: item.node, data });
          this.node.fire("click");
          eventBus.$emit("addHistory", historyName, {
            nodeId: item.node.getAttrs().historyId,
          });
        }
        eventBus.$emit("cloneStage", {id: _viewId, designArr: designObj[_viewId]});
      }
    },
    widthHeightKeepRatio() {
      this.iconlock = !this.iconlock;
      this.layer.find("Transformer").setAttrs({
        keepRatio: this.iconlock,
      });
    },
    changeWidth(data) {
      this.changeWidthHeight({
        data: data,
        iconlock: this.iconlock,
        type: "width",
      });
    },
    changeHeight(data) {
      this.changeWidthHeight({
        data: data,
        iconlock: this.iconlock,
        type: "height",
      });
    },
    changeWidthHeight({ data, iconlock, type }) {
      let node = this.curGalleryData.node;
      let scale = node.scale();
      // let imageData = node.getAttrs().imageData;
      // let imgRatio = imageData.size.width / imageData.size.height;
      let imgRatio =
        (node.width() * Math.abs(node.scaleX())) /
        (node.height() * Math.abs(node.scaleY()));
      if (type == "width") {
        node.scaleX(data / node.width());
        // node.width(data / Math.abs(scale.x));
        // node.offsetX(node.width() * Math.abs(node.scaleX()) / 2)
        if (iconlock) {
          node.scaleY(
            (node.width() * Math.abs(node.scaleX())) / imgRatio / node.height()
          );
          // node.height(node.width() / imgRatio);
          // node.offsetY(node.height() * Math.abs(node.scaleY()) / 2)
        }
      } else {
        node.scaleY(data / node.height());
        // node.height(data / Math.abs(scale.y));
        // node.offsetY(node.height() * Math.abs(node.scaleY()) / 2)
        if (iconlock) {
          node.scaleX(
            (node.height() * Math.abs(node.scaleY()) * imgRatio) / node.width()
          );
          // node.width(node.height() * imgRatio);
          // node.offsetX(node.width() * Math.abs(node.scaleX()) / 2)
        }
      }
      node.fire("click");
      if (iconlock) {
        // let curGalleryData = this.curGalleryData;
        this.curGalleryData.data.scaleWidth =
          node.width() * Math.abs(node.scaleX());
        this.curGalleryData.data.scaleHeight =
          node.height() * Math.abs(node.scaleY());
        this.$store.commit("gallery/changeCurGalleryData", this.curGalleryData);
      }
      eventBus.$emit("widthHeightChange", { data, iconlock, type });
    },
    changeOffsetX(data) {
      eventBus.$emit("OffsetXYChange", { data: data, type: "x" });
    },
    changeOffsetY(data) {
      eventBus.$emit("OffsetXYChange", { data: data, type: "y" });
    },
    handleUseAllChange(key) {
      this.form[key] = this.confirmCheck[key];
      // this.$confirm("此操作将应用所有面, 是否继续?", "提示", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "warning",
      // })
      //   .then(() => {
      this.form[key] = !this.form[key];
      this.confirmCheck[key] = !this.confirmCheck[key];
      if (key == "useallview") {
        //图片
        eventBus.$emit("setBgImgClick", {
          data: this.form.useallview,
          type: "all",
        });
        this.form.setBg = true;
      } else {
        //颜色
        eventBus.$emit("setBgColorClick", {
          data: this.form.useall,
          type: "all",
          color: this.form.background_color,
        });
      }
      // })
      // .catch(() => {});
    },
    repeatChange(item) {
      if(this.repeatType==item.value){
        // 取消平铺
        this.showTitleWayPop = false;
        eventBus.$emit("repeatChange", { data: {value: ''} });
        this.repeatType = '';
      } else {
        // 执行平铺,图片应用了裁切时禁用平铺效果
        if(this.isSetClip){
          this.$message({
            message: '裁切后不支持平铺，请移除裁切后重试',
            type: 'warning'
          });
          return;
        }
        this.showTitleWayPop = true;
        eventBus.$emit("repeatChange", { data: item });
        this.repeatType = item.value;
      }
      // //平铺
      // if (this.repeatType != item.value) {
      //   this.showTitleWayPop = true;
      //   eventBus.$emit("repeatChange", { data: item });
      // } else {
      //   this.showTitleWayPop = !this.showTitleWayPop;
      // }
      // if (item.value == "") {
      //   this.showTitleWayPop = false;
      // }
      // this.repeatType = item.value;
    },
    imgMaximization(item) {
      eventBus.$emit("imgMaximizationChange", { data: item });
    },
    mirrorFlip(type) {
      eventBus.$emit("mirrorFlip", { data: type });
    },
    rotate45(type) {
      let rotation = this.node.rotation()
      switch(type) {
        case 'left':
          rotation -= 45
          if(rotation < -180) {
            rotation = 180 + (rotation + 180)
          }
          break;
        case 'right':
          rotation += 45
          if(rotation > 180) {
            rotation = -180 + (rotation - 180)
          }
          break;
      }
      if(type == "right") {
        this.$statisticalreport.biCommonFn('顺时针旋转45度',this.node)
      } else {
        this.$statisticalreport.biCommonFn('逆时针旋转45度',this.node)
      }
      eventBus.$emit("rotationChange", { data: rotation });
      eventBus.$emit("rotationChangeEnd", { data: rotation });
    },
    setBgImgClick(type) {
      // if(type != 'all' && !this.form.setBg) {
      //   this.form.useallview = false
      // }
      // eventBus.$emit('setBgImgClick', {data: type == 'all' ? this.form.useallview : this.form.setBg, type: type})
      this.confirmCheck["useallview"] = false;
      if (!this.form.setBg) {
        this.form.useallview = false;
      }

      eventBus.$emit("setBgImgClick", { data: this.form.setBg, type: type });
    },
    // setBgColorConfirm(val) {
    //   if (val) {
    //     eventBus.$emit("addHistory", "设置背景色");
    //   }
    // },
    // setBgColorClick(type) {
    //   this.confirmCheck["useall"] = false;
    //   if (this.form.background_color == null) {
    //     this.form.useall = false;
    //   }

    //   eventBus.$emit("setBgColorClick", {
    //     data: this.form.background_color != null,
    //     type: type,
    //     color: this.form.background_color
    //   });
    // },
    // activeSetBgColorClick(value) {
    //   this.confirmCheck["useall"] = false;
    //   if (this.form.background_color == null) {
    //     this.form.useall = false;
    //   }
    //   eventBus.$emit("setBgColorClick", {
    //     data: value != null,
    //     type: "",
    //     color: value
    //   });
    // },
    copyNode(e) {
      const viewId = this.node.getLayer().getAttrs().viewId;
      eventBus.$emit("copyToView", {
        data: { id: viewId },
      });
      if(viewId == 9999){
         for (let view of this.viewIdList) {
          if (view.id != -1) {
            eventBus.$emit("copyToView", { data: view, type: 'all' });
          }
        }
      }
      // document.execCommand("copy");
      this.$message({
        message: "复制成功",
        type: "success",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.operate-bar{
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  font-size: 14px;
  .operate-item{
    background: #F0F2F5;
    width: 100%;
    height: 40px;
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    margin-top: 12px;
    position: relative;
    &.iconfont{
      font-size: 22px;
    }
    &:hover{
      background-color: #EBECF8;
      color: #0453F3;
    }
    &.active{
      background: #0453F3;
      color: #fff;
    }
    &.mini{
      width: 64px;
    }
    &.medium{
      width: 136px;
    }
    .new-tips{
      color: #FFC53D; 
      position: absolute;
      top:0;
      right: 7px;
    }
  }
}
.rotate-slider{
  flex: 1;
}
/deep/ .el-input--small .el-input__inner{
  height: 40px;
  line-height: 40px;
}
.tileway-container{
  position: relative;
}
.tileway-pop {
  width: 100%;
  position: absolute;
  top: -90px;
  left: 0;
  z-index:1005;
  background: #ffffff;
  box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.05),
    0px 6px 16px 0px rgba(0, 0, 0, 0.08),
    0px 3px 6px -4px rgba(0, 0, 0, 0.12);
  border-radius: 5px;
}
.opt-box {
  height: 40px;
  border-radius: 20px;
  width: 100%;
  align-items: center;
  justify-content: space-around;
  background: #F0F2F5;
  .opt-item {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    &.iconfont{
      font-size: 20px;
    }
    &.active {
      background: #F0F5FF;
      color: #0453F3;
    }
    &:hover {
      background-color: #EBECF8;
      color: #0453F3;
    }
  }
}
.primary-color{
  color: #0453F3;
}
</style>