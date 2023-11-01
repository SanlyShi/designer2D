<template>
  <div class="container">
    <!-- 对齐 -->
    <div class="align-box">
      <ul class="box">
        <li v-for="(item,index) in alignboxOptions" :key="index">
          <el-tooltip
            :enterable="false"
            ref="tooltip"
            class="item"
            popper-class="position"
            effect="dark"
            :content="item.label+shortcutsTip(item.shortType)"
            placement="top"
          >
            <span 
              :class="['iconfont align-tool-item',item.icon,item.value==form.alignType?'active':'',optLock?'zw-disabled':'']"
              @click="changeAlignType(item, 1)"
            ></span>
          </el-tooltip>
        </li>
      </ul>
      <div class="align-select-tool">
        <div class="mb10 flex flex-col-center f12">
          <span class="label mr5">分布：</span>
          <el-tooltip
            :enterable="false"
            class="item"
            effect="dark"
            popper-class="position"
            :content="item.label"
            placement="top"
            v-for="(item,index) in alignboxOptions2"
            :key="index"
          >
            <span 
              :class="['iconfont align-type cp',item.icon,index==0?'mr7':'',form.distribution==item.value?'active':'',optLock?'zw-disabled':'']"
              @click="changeAlignType(item, 2)"
            ></span>
          </el-tooltip>
        </div>
        <div class="mb4 label">对齐选区：</div>
        <el-select
          v-model="form.alignType2"
          placeholder="请选择"
          style="width:112px"
          :class="[optLock?'zw-disabled':'']"
        >
          <el-option label="对齐画布" value="1"></el-option>
        </el-select>
      </div>
    </div>
    <!-- 变换 -->
    <div class="change-box mt20">
      <div class="label mb6">变换：</div>
      <div class="flex mb8">
        <zw-unit-input
          :step="1"
          unit="X"
          :defaultValue.sync="curGalleryDataRealTime.topLeftX"
          style="width:105px"
          :class="['mr22',optLock?'zw-disabled':'']"
          @changeValue="changeOffsetX"
        ></zw-unit-input>

        <zw-unit-input
          :step="1"
          unit="Y"
          :defaultValue.sync="curGalleryDataRealTime.topLeftY"
          style="width:105px"
          :class="[optLock?'zw-disabled':'']"
          @changeValue="changeOffsetY"
        ></zw-unit-input>
<!-- 
        <zw-slide-input
          popWidth="226px"
          offset="bottom-right"
          showValueType="num"
          label="旋转"
          style="width:83px"
          :class="[optLock?'zw-disabled':'']"
          :step="1"
          unit="°"
          :max="180"
          :min="-180"
          :defaultValue.sync="curGalleryDataRealTime.nodeRotation"
          @update:defaultValue="rotationChangeEnd"
          @activeChange="rotationChange"
        /> -->
      </div>
      <div class="flex flex-col-ct">
        <zw-unit-input
          :step="1"
          unit="W"
          :min="20"
          :class="[optLock?'zw-disabled':'']"
          :defaultValue.sync="curGalleryDataRealTime.scaleWidth"
          style="width: 105px"
          @changeValue="changeWidth"
        ></zw-unit-input>
        <span
          :class="['iconfont',iconlock ?'iconlock-fill':'iconunlock-fill',optLock ? 'zw-disabled' : '']"
          style="font-size:8px;padding:0 5px;"
          @click="widthHeightKeepRatio"
        ></span>
        <zw-unit-input
          :step="1"
          unit="H"
          :min="20"
          :defaultValue.sync="curGalleryDataRealTime.scaleHeight"
          style="width:105px"
          :class="[optLock?'zw-disabled':'']"
          @changeValue="changeHeight"
        >></zw-unit-input>
        <!-- <el-tooltip
          :enterable="false"
          class="item"
          effect="dark"
          popper-class="position"
          :content="'水平翻转'+ shortcutsTip('element5')"
          placement="top"
        >
          <span
            :class="['iconfont iconsymmetry-level mr7 symmetry cp',optLock?'zw-disabled':'']"
            @click="mirrorFlip('leftRightMirror')"
          ></span>
        </el-tooltip>
        <el-tooltip
          :enterable="false"
          class="item"
          effect="dark"
          popper-class="position"
          :content="'垂直翻转'+ shortcutsTip('element6')"
          placement="top"
        >
          <span
            :class="['iconfont iconsymmetry-vertical symmetry cp',optLock?'zw-disabled':'']"
            @click="mirrorFlip('upDownMirror')"
          ></span>
        </el-tooltip> -->
      </div>
    </div>
  </div>
</template>

<script>
import ZwUnitInput from "@/components/common/ZwUnitInput";
import ZwSlideInput from "@/components/common/ZwSlideInput";
import { alignmentCanvas, linkageDesign, bgImgLinkageStart } from "@/utils/designer.js";
import {checkPlatform} from '@/utils/utils';
import eventBus from "@/utils/eventBus.js";
export default {
  components: {
    ZwUnitInput,ZwSlideInput
  },
  data(){
    return {
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
          icon: "icondistribute-level",
        },
        {
          label: "垂直",
          value: "verticalcenter",
          icon: "icondistribute-plumb",
        },
      ],
      node: null,
      iconlock: true,
      form: {
        alignType: "",
        alignType2: "1",
        width: "",
        height: "",
        offsetX: "",
        offsetY: "",
        angle: 0,
      }
    }
  },
  computed: {
    hasActiveNode(){
      return this.$store.state.layout.showType == 'image' && this.$store.state.layout.showType == 'text';
    },
    view_id: function () {
      return this.$store.getters.view_id;
    },
    curGalleryData(){
      let curGalleryData = this.$store.state.gallery.curGalleryData;
      if(curGalleryData.node){
        this.node = curGalleryData.node;
      }
      return curGalleryData;
    },
    curGalleryDataRealTime() {
      return this.$store.state.gallery.curGalleryDataRealTime;
    },
    optLock: function () {
      if(this.$store.state.layout.showType == 'image' || this.$store.state.layout.showType == 'text'){
        return this.node ? this.node.isLock : false;
      } else {
        return true;
      }
    },
    customShortcutsMap() {
      return this.$store.state.shortcut.customShortcutsMap;
    },
    product() {
      return this.$store.state.product.selectedProduct;
    },
  },
  methods: {
    changeAlignType(data, type) {
      const designObj = linkageDesign(this.product, this.view_id, this.node)
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
          item.node.fire("click");
          eventBus.$emit("addHistory", historyName, {
            nodeId: item.node.getAttrs().historyId,
          });
        }
        eventBus.$emit("cloneStage", {id: _viewId, designArr: designObj[_viewId]});
      }
    },
    changeOffsetX(data) {
      eventBus.$emit("OffsetXYChange", { data: data, type: "x" });
    },
    changeOffsetY(data) {
      eventBus.$emit("OffsetXYChange", { data: data, type: "y" });
    },
    // rotationChange(val) {
    //   eventBus.$emit("rotationChange", { data: val });
    // },
    // rotationChangeEnd(val) {
    //   eventBus.$emit("rotationChangeEnd", { data: val });
    // },
    widthHeightKeepRatio() {
      this.iconlock = !this.iconlock;
      this.node.getLayer().find("Transformer").setAttrs({
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
      if(node.hasName('isBg')) {
        bgImgLinkageStart(this.product)
      }
      let imgRatio =
        (node.width() * Math.abs(node.scaleX())) /
        (node.height() * Math.abs(node.scaleY()));
      if (type == "width") {
        node.scaleX(data / node.width());
        if (iconlock) {
          node.scaleY(
            (node.width() * Math.abs(node.scaleX())) / imgRatio / node.height()
          );
        }
      } else {
        node.scaleY(data / node.height());
        if (iconlock) {
          node.scaleX(
            (node.height() * Math.abs(node.scaleY()) * imgRatio) / node.width()
          );
        }
      }
      node.fire("click");
      if (iconlock) {
        this.curGalleryData.data.scaleWidth =
          node.width() * Math.abs(node.scaleX());
        this.curGalleryData.data.scaleHeight =
          node.height() * Math.abs(node.scaleY());
        this.$store.commit("gallery/changeCurGalleryData", this.curGalleryData);
      }
      eventBus.$emit("widthHeightChange", { node, iconlock, type });
    },
    // mirrorFlip(type) {
    //   if(this.node.type == 'image'){
    //     eventBus.$emit("mirrorFlip", { data: type });
    //   } else if(this.node.type == 'text'){
    //     if (type == "leftRightMirror") {
    //     this.node.to({
    //       scaleX: -this.node.scaleX(),
    //       duration: 0,
    //       onFinish: () => {
    //         eventBus.$emit("addHistory", "图层变换", {
    //           nodeId: this.node.getAttrs().historyId,
    //         });
    //       },
    //     });
    //   } else {
    //     this.node.to({
    //       scaleY: -this.node.scaleY(),
    //       duration: 0,
    //       onFinish: () => {
    //         eventBus.$emit("addHistory", "图层变换", {
    //           nodeId: this.node.getAttrs().historyId,
    //         });
    //       },
    //     });
    //   }
    //   setTimeout(() => {
    //     eventBus.$emit("cloneStage");
    //   }, 200);
    //   }
    // },
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
  },
  watch: {
    iconlock(nv) {
      this.$store.commit("layout/changeImgKeepRatioLock", nv);
    },
    curGalleryData(nv){
    },
    // node: function(nv){
    //   console.log('node => ', nv);
    // }
  },
  mounted(){

  }
}
</script>

<style lang="scss" scoped>
.container{
  width: 260px;
  padding: 15px 13px;
  background: #fff;
}
.align-box {
  display: flex;
  ul.box {
    list-style: none;
    width: 122px;
    height: 98px;
    li {
      float: left;
      &:nth-child(1) {
        span {
          border-top-left-radius: 5px;
        }
      }
      &:nth-child(3) {
        span {
          border-top-right-radius: 5px;
        }
      }
      &:nth-child(7) {
        span {
          border-bottom-left-radius: 5px;
        }
      }
      &:nth-child(9) {
        span {
          border-bottom-right-radius: 5px;
        }
      }
      span {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 32px;
        background: #F7F7F7;
        margin-left: -1px;
        margin-top: -1px;
        &:not(.zw-disabled) {
          cursor: pointer;
          &:hover {
            position: relative;
            background: #E6E6E6;
            z-index: 100;
          }
        }
      }
    }
  }

  .box:after {
    content: "";
    height: 0;
    visibility: hidden;
    clear: both;
    display: block;
  }

  .align-type {
    display: flex;
    width: 32px;
    height: 32px;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    background: #F7F7F7;
    &:not(.zw-disabled) {
      &:hover {
        background: #E6E6E6;
      }
    }
  }
}
.change-box {
  .symmetry {
    width: 38px;
    height: 32px;
    background: #ffffff;
    border-radius: 5px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
<style>
.el-tooltip__popper.is-dark.position{
  z-index: 3001 !important;
}
</style>