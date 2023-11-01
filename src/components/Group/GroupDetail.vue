<template>
  <div class="group-detail-box" style="padding:0 20px" v-if="showType=='group'">
    <div class="flex opt-box mt12">
      <!-- <el-popover placement="bottom" width="86" trigger="click" popper-class="zw-slide-prop">
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
      </el-popover> -->
      <el-popover
        placement="bottom"
        title="移动图层"
        width="86"
        trigger="click"
        popper-class="zw-slide-prop"
        :disabled="showType!='group'"
      >
        <ZwSlidepop
          title="图层顺序"
          preLabel="上移"
          nextLabel="下移"
          :value.sync="curViewIndex"
          @change="changeViewIndex"
          @handlePreNext="handlePreNext"
          @activeChange="viewIndexActiveChange"
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
            :class="['iconfont','iconlayers','opt-item cp',(optLock||!viewIndexMax)?'zw-disabled':'']"
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
          :class="['iconfont','iconfile-add','opt-item cp',(optLock)?'zw-disabled':'']"
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
            :class="['iconfont','iconfile-add-to','opt-item cp',optLock || viewIdList.length <= 1?'zw-disabled':'']"
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
</template>

<script>
import eventBus from "@/utils/eventBus.js";
import ZwSlidepop from "@/components/common/ZwSlidepop";
import { stageObj, linkageDesign, alignmentCanvas } from "@/utils/designer.js";
import {checkPlatform, genLocalStorageKey, getNodeCenterPoint, getLTPointChange, getCenterPointChange} from '@/utils/utils';
export default {
  name: "GroupDetail",
  components: {
    ZwSlidepop,
  },
  data() {
    return {
      curViewSize: 0,
      curViewIndex: 0,
      viewIndexMin: 0,
      viewIndexMax: 0,
      iconlock: true,
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
      viewId: 0,
      layer: null,
      node: null,
      selectedNodes: null,
      designs: null,
      layerAction:""//用于判断图层顺序
    };
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
      return this.selectedNodes ? this.selectedNodes[0].isLock : false;
    },
    showType() {
      return this.$store.state.layout.showType;
    },
    curGalleryData() {
      let curGalleryData = this.$store.state.gallery.curGalleryData;
      this.node = curGalleryData?.node;
      return curGalleryData;
    },
    customShortcutsMap() {
      return this.$store.state.shortcut.customShortcutsMap;
    },
    product() {
      return this.$store.state.product.selectedProduct;
    },
  },
  watch: {
    "curGalleryData.node._id": {
      handler(nv) {
        if(nv){
          this.updateData();
        }
      },
      immediate: true,
    },
    "$store.state.group.groupChange": {
      handler(nv){
        this.updateData();
      }
    },
    iconlock(nv) {
      this.$store.commit("layout/changeImgKeepRatioLock", nv);
    },
  },
  mounted() {
    eventBus.$on("changeGroupZIndex", (position) => {
      switch (position) {
        case "top": //顶层
          if (this.curViewIndex < this.viewIndexMax) {
            this.implementRange(this.viewIndexMax);
          }
          break;
        case "bottom": //底层
          if (this.curViewIndex > this.viewIndexMin) {
            this.implementRange(0);
          }
          break;
        case "prev": //上移一层
          if (this.curViewIndex < this.viewIndexMax) {
            this.implementRange(this.curViewIndex + 1);
          }
          break;
        case "next": //下移一层
          if (this.curViewIndex > this.viewIndexMin) {
            this.implementRange(this.curViewIndex - 1);
          }
          break;
      }
    });
  },
  methods: {
    updateData(){
      if(this.curGalleryData?.type != 'group') return;
      const selectedNodes = this.curGalleryData.subnodes;  
      const layer = selectedNodes[0].getLayer();
      const designs = layer.find('.design').filter(a => !a.hasName('isBg'));
      // 默认组选中的层级位于组中元素最上层那个位置
      const index = designs.reverse().findIndex(a => selectedNodes.some(k=>k._id==a._id));
      this.viewIndexMax = designs.length - selectedNodes.length;
      this.curViewIndex = this.viewIndexMax - index;
      this.layer = layer;
      this.selectedNodes = selectedNodes;
      this.viewId = layer.getAttrs().viewId
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
    //切换图层
    changeViewIndex(val) {
      if(!this.selectedNodes.length) return;
      this.implementRange(val);
    },
    handlePreNext(val) {
      if(!this.selectedNodes.length) return;
      this.implementRange(this.curViewIndex + val);
    },
    implementRange(newIndex){
      const oldIndex = this.curViewIndex;
      this.curViewIndex = newIndex;
      // 获取重排后的索引
      const designs = this.layer.find('.design').filter(a => !a.hasName('isBg'));
      const minZIndex = designs[0].getZIndex();
      const selectedIds = this.selectedNodes.map(a=>a._id);      
      // const selectMinIndex = designs.findIndex(a => selectedIds[0] == a._id);
      // const selectMaxIndex = designs.findIndex(a => selectedIds[selectedIds.length-1] == a._id);
      // const preNodeId = selectMinIndex>0 ? designs[selectMinIndex-1]._id : null;
      // const nextNodeId = selectMaxIndex<designs.length-1 ? designs[selectMaxIndex+1]._id : null;
      // let unbindDesigns = designs.filter(a => !selectedIds.includes(a._id));
      // unbindDesigns.splice(newIndex, 0, ...this.selectedNodes);
      // switch(position){
      //   case "top": //顶层
      //     unbindDesigns.splice(unbindDesigns.length, 0, ...this.selectedNodes);
      //     break;
      //   case "bottom": //底层
      //     unbindDesigns.splice(0, 0, ...this.selectedNodes);
      //     break;
      //   case "prev": //上移一层
      //     const nextNodeIndex = unbindDesigns.findIndex(a => a._id == nextNodeId);
      //     unbindDesigns.splice(nextNodeIndex+1, 0, ...this.selectedNodes);
      //     break;
      //   case "next": //下移一层
      //     const preNodeIndex = unbindDesigns.findIndex(a => a._id == preNodeId);
      //     unbindDesigns.splice(preNodeIndex, 0, ...this.selectedNodes);
      //     break;
      // }
      let unbindDesigns = designs.filter(a => !selectedIds.includes(a._id));
      unbindDesigns.splice(newIndex, 0, ...this.selectedNodes);
      
      let newIndexMap = {};
      [].forEach.call(unbindDesigns, (node, i) => {
        newIndexMap[node._id] = minZIndex + i;
      });
      // console.log('unbindDesigns = ', unbindDesigns.map(a=>a._id));
      // 执行操作
      designs.forEach(node => {
        node.zIndex(newIndexMap[node._id]);
        // 组排序由于元素可能改变的级数大于1, 整体设计关联的元素只做上移或下移一层操作
        if(selectedIds.includes(node._id)){
          const designObj = linkageDesign(this.product, this.viewId, node);
          for(let vid in designObj){
            if(vid != this.viewId){
              const item = designObj[vid][0];
              oldIndex > newIndex ? item.node.moveDown() : item.node.moveUp();
              item.node.getLayer().batchDraw();
              eventBus.$emit('changeViewIndex', {isGroup: true, viewId: item.id})
              eventBus.$emit('addHistory', '图层排序', {
                nodeId: item.node.getAttrs().historyId
              })
            }
          }  
        }
      });
      this.layer.batchDraw();
      // 更新效果图
      eventBus.$emit('changeViewIndex', {isGroup: true, viewId: this.view_id})
      // 组元素的历史记录只需要记录其中一个就可以
      eventBus.$emit('addHistory', '图层排序', {
        nodeId: this.selectedNodes[0].getAttrs().historyId
      });
      this.$nextTick(()=>{
        const biList={
            'up':'图层上移',
            'down':'图层下移',
        }
        this.$statisticalreport.clickDesignItemEditBtn(biList[this.layerAction],'组合')
        })
      // 同步更新左侧图层数据
      this.updateLayerTreeData();
    },
    viewIndexActiveChange(val){
      this.layerAction =val.type
    },
    updateLayerTreeData(){
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
        }
      }
      this.$store.commit("gallery/getDesignImgList", {
        data: designImgList,
      });
    },
    //缩放图层
    changeViewSize(val) {},
    scalePreNext(val) {
      const width = this.node.width(), height = this.node.height();
      const scaleX = this.node.scaleX(), scaleY = this.node.scaleY();
      const initX = this.node.x(), initY = this.node.y();
      const groupTransform = this.node.getTransform().copy();
      const initPos = [];
      this.node.find('Rect').forEach(a =>{
        initPos.push({x: a.x(), y: a.y()})
      })
      switch(val){
        case 1:
          this.node.scaleX(scaleX > 0 ? scaleX + 0.1 : scaleX - 0.1);
          this.node.scaleY(scaleY > 0 ? scaleY + 0.1 : scaleY - 0.1);
          break;
        case -1:
          this.node.scaleX(scaleX > 0 ? scaleX - 0.1 : scaleX + 0.1);
          this.node.scaleY(scaleY > 0 ? scaleY - 0.1 : scaleY + 0.1);
          break;
      }
      // const change = getCenterPointChange(
      //   {width: width * scaleX, height: height * scaleY},
      //   {width: width * this.node.scaleX(), height: height * this.node.scaleY()},
      //   this.node.rotation() || 0
      // );
      // console.log('change =', change)
      // this.node.find('Rect').forEach((a,i)=>{
      //   a.x(initPos[i].x - change.x);
      //   a.y(initPos[i].y - change.y);
      // })

      // const groupTransform2 = this.node.getTransform().copy();
      // console.log('22', this.node.x(), this.node.y())
      // console.log('222', groupTransform2.m);
      // console.log('===', groupTransform2.decompose())
      // this.node.x(initX - groupTransform2.m[4]);
      // this.node.y(initY - groupTransform2.m[5]);
      // console.log('333', this.node.getTransform().copy().m)
      // const nodes = this.curGalleryData.data.subnodes;
      // eventBus.$emit('rebindGroup', {group: this.node, nodes, update: true, rotation});
      // nodes[0]?.getLayer().batchDraw();

      // const change = getLTPointChange(
      //   {width: width * scaleX, height: height * scaleY},
      //   {width: width * this.node.scaleX(), height: height * this.node.scaleY()},
      //   this.node.rotation() || 0
      // )
      // this.node.x(groupTransform.m[4] + change.changeX);
      // this.node.y(groupTransform.m[5] + change.changeY);
      // this.node.getLayer().batchDraw();
     
      // const nodes = this.curGalleryData.data.subnodes;
      // [].forEach.call(nodes, node => {
      //   const designArr = linkageDesign(this.product, this.view_id, node);
      //   designArr.forEach(item => {
      //     switch (val) {
      //         case 1:
      //           item.node.scaleX(
      //             item.node.scaleX() > 0
      //               ? item.node.scaleX() + 0.1
      //               : item.node.scaleX() - 0.1
      //           );
      //           item.node.scaleY(
      //             item.node.scaleY() > 0
      //               ? item.node.scaleY() + 0.1
      //               : item.node.scaleY() - 0.1
      //           );
      //           break;
      //         case -1:
      //           item.node.scaleX(
      //             item.node.scaleX() > 0
      //               ? item.node.scaleX() - 0.1
      //               : item.node.scaleX() + 0.1
      //           );
      //           item.node.scaleY(
      //             item.node.scaleY() > 0
      //               ? item.node.scaleY() - 0.1
      //               : item.node.scaleY() + 0.1
      //           );
      //           break;
      //       }
      //       item.layer.batchDraw();
      //       eventBus.$emit("cloneStage", {id: item.id, node: item.node});
      //   });
      // })
      // this.node.fire("click");
    },
    //锁定
    handleoptLock() {
      eventBus.$emit("nodeToggleLock", { data: this.selectedNodes });
    },
    //删除
    handleoptDelete() {
      eventBus.$emit("nodeToggleDelete", this.selectedNodes);
    },
    // 复制到面
    copyToView(item) {
      const nodes = this.curGalleryData.subnodes;
      if (item.id == -1) {
        for (let view of this.viewIdList) {
          if (view.id != -1) {
            eventBus.$emit("copyToView", {
              data: { 
                id: view.id,
                nodes
              },
              type: 'all'
            });
          }
        }
      } else {
        eventBus.$emit("copyToView", {
          data: { 
            id: item.id,
            nodes
          },
        });
      }
      this.$refs.copyToView.doClose();
      this.$message({
        message: "复制成功",
        type: "success",
      });
    },
    // 创建副本
    copyNode(e) {
      const nodes = this.curGalleryData.subnodes;
      eventBus.$emit("copyToView", {
        data: { 
          id: this.viewId,
          nodes
        },
        copyToCurrentView: true,
      });
      if(this.viewId == 9999){
        for (let view of this.viewIdList) {
          if (view.id != -1) {
            eventBus.$emit("copyToView", {
              data: { 
                id: view.id,
                nodes
              },
              type: 'all'
            });
          }
        }
      }
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