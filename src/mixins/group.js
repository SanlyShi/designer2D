import { getNodeCenterPoint, rotateConvert, getUnbindNodeAttrs } from "@/utils/utils";
import Konva from "@/utils/konva7.2.1";
import { stageObj, bgImgLinkageStart } from "@/utils/designer";
import eventBus from "@/utils/eventBus";
export default {
  data() {
    return {
      m_group_isBinding: false,
    };
  },
  computed: {
    multipleSelectNodes() {
      return this.$store.state.multiple.multipleSelectNodes
    }
  },
  methods: {
    // 编组
    m_group_bind({ nodes, viewId = this.viewId } = {}) {
      if (!nodes.length) return;
      if (nodes.length == 1) {
        this.$store.commit('multiple/updateFireClickState',1)
        nodes[0].fire("click");
        return;
      }
      this.m_group_isBinding = true;
      this.addTransformer({nodes});
      return;
      const curS = this.getCurStageLayer({viewId});
      curS.layer.find('.design').removeName('groupNode');
      const group = new Konva.Group({
        name: "designGroup",
        type: 'group',
        draggable: true,
      });
      curS.designContainerGroup.add(group);
      let maxZIndex = 0;
      const nodeIds = nodes.map(a=>a._id);
      // 拷贝的图层顺序必须跟原图片顺序一致
      curS.layer.find('.design').map(node => {
        if(nodeIds.includes(node._id)){
          node.addName('groupNode');
          const nodeClone = new Konva.Rect({
            name: 'virtualGroupNode',
            width: node.width(),
            height: node.height(),
            x: node.x(),
            y: node.y(),
            offsetX: node.width() / 2,
            offsetY: node.height() / 2,
            scaleX: node.scaleX(),
            scaleY: node.scaleY(),
            rotation: node.rotation(),
            imgId: node._id,
            draggable: false,
            // fill: i%2==0 ? 'red' : 'green',
            // opacity: 0.4
          });
          curS.designContainerGroup.add(nodeClone);
          nodeClone.moveTo(group);
          maxZIndex = Math.max(maxZIndex, node.getZIndex());
        }
      })
      group.zIndex(maxZIndex+1);
      curS.layer.batchDraw();
      // 组节点操作事件
      this.$set(group, "isLock", false);
      this.m_group_initGroupEvent(group);
      group.fire('click');
    },
    // 解组
    m_group_unbind({ group = null, viewId = this.viewId, clear=false, update=true } = {}) {
      const curS = this.getCurStageLayer({ viewId });
      group = group || curS.layer.findOne(".designGroup");
      if (!group) return;
      this.m_group_isBinding = false;
      const nodes = curS.layer.find('.groupNode');
      [].forEach.call(nodes, node => { node.removeName('groupNode') })
      if(clear && !this.m_ms_shiftKeyDown){
        this.m_ms_selectImages = [];
        this.$store.commit("multiple/updateMultipleSelectNodes",this.m_ms_selectImages);
      }
      // this.$store.commit("layout/changeSelectType", null);
      this.m_group_releaseGroupEvent(group);
      group?.destroy();
      if(update){
        curS.layer.batchDraw();
        this.cloneStage({ viewId });
      }
    },
    // 获取节点在解绑后的位置
    m_group_getAllUnbindNodeAttrs(group) {
      const nodes = group.find("Rect");
      if (!nodes.length) return;
      let nodeAttrsMap = {};
      [].forEach.call(nodes, (node) => {
        const imgId = node.getAttrs().imgId;
        nodeAttrsMap[imgId] = getUnbindNodeAttrs(group, node);
      });
      return nodeAttrsMap;
    },
    // 批量更新组节点位置
    m_group_updateGroupNodes(group){
      const curS = this.getCurStageLayer({ viewId: this.viewId });
      const nodeAttrsMap = this.m_group_getAllUnbindNodeAttrs(group);
      const nodes = curS.layer.find('.groupNode');
      [].forEach.call(nodes, (node) => {
        const { scaleX, scaleY, rotation, x, y } = nodeAttrsMap[node._id];
        node.setAttrs({ scaleX, scaleY, rotation, x, y });
      });
    },
    // 组节点操作事件
    m_group_initGroupEvent(group) {
      group.find('Rect').forEach(node => {
        node.on('click', e => {
          if(this.m_ms_shiftKeyDown){
            const nodeId = node.getAttrs().imgId;
            const index = this.m_ms_selectImages.findIndex(a => a._id == nodeId);
            if(index > -1){
              this.m_ms_selectImages.splice(index, 1);
              this.$store.commit("multiple/updateMultipleSelectNodes", this.m_ms_selectImages);
            }
            if (e.evt && e.evt.which != 3) {
              document.getElementById("designMenu").style.display = "none";
            }

            // const currentStage = stageObj[`stage${this.viewId}`]; 
            // const nodeId = node.getAttrs().imgId;
            // const nodeTarget = currentStage.findOne(`.design${nodeId}`);
            // const index = this.m_ms_selectImages.findIndex(a => a._id == nodeId);
            // if(index > -1){
            //   this.m_ms_selectImages.splice(index, 1);
            //   this.$store.commit("multiple/updateMultipleSelectNodes", this.m_ms_selectImages);
            // }
            // if(nodeTarget){
            //   this.m_ms_select('shiftclick', nodeTarget, true);
            // }
            // if (e.evt && e.evt.which != 3) {
            //   document.getElementById("designMenu").style.display = "none";
            // }
          }
        });
      });
      group.on("click", (e) => {
        this.curNode = group;
        this.$store.commit("layout/changeSelectType", "group");
        const currentStage = stageObj[`stage${this.viewId}`]; 
        const nodes = currentStage.find('.groupNode');
        this.addTransformer({
          currentStage,
          viewId: this.viewId,
          node: group,
          isGroup: true,
        });
        this.saveImageData({
          node: group,
          subnodes: nodes,
          isGroup: true,
          viewId: this.viewId,
        });
        this.checkViewOverspread({currentStage});
      });
      group.on("dragstart", (e) => {
        if (e.evt && e.evt.which != 3) {
          document.getElementById("designMenu").style.display = "none";
        }
        bgImgLinkageStart(this.productData);
      });
      group.on("transformstart", (e) => {
        bgImgLinkageStart(this.productData);
      });
      group.on("dragmove", (e) => {
        const currentStage = stageObj[`stage${this.viewId}`];
        this.anchorGroupFourceupdate({ node: group, viewId: this.viewId });
        this.m_group_updateGroupNodes(group);
        if(this.isShowRuler) this.nodeSnapping();
        this.isOuterPrintArea({ currentStage, node: group });
        this.drawSizeTip({ currentStage, node: group });
        this.checkViewOverspread({currentStage});
        const nodes = currentStage.find('.groupNode');
        nodes.forEach(node => {
          this.ncYSRemind({ currentStage, node, isGroup: true });
        })
      });
      group.on("transform", (e) => {
        const currentStage = stageObj[`stage${this.viewId}`];
        this.anchorGroupFourceupdate({ node: group, viewId: this.viewId });
        this.m_group_updateGroupNodes(group);
        this.isOuterPrintArea({ currentStage, node: group });
        this.drawSizeTip({ currentStage, node: group });
        this.checkViewOverspread({currentStage});
        const nodes = currentStage.find('.groupNode');
        nodes.forEach(node => {
          this.ncYSRemind({ currentStage, node, isGroup: true });
        })
      });
      group.on("dragend", (e) => {
        this.m_group_updateGroupNodes(group);
        this.removeSnapGuideLine();
        const currentStage = stageObj[`stage${this.viewId}`];
        const nodes = currentStage.find('.groupNode');
        this.saveImageData({
          node: group,
          subnodes: nodes,
          isGroup: true,
          viewId: this.viewId,
        });        
        [].forEach.call(nodes, node => {
          if(node.type == 'image'){
            this.imgTransformEnd({viewId: this.viewId, node, type: 'drag', isGroup: true});
          } else {
            this.textTransformEnd({ viewId: this.viewId, textGroup: node, isGroup: true });
          }
          this.bgImgLinkageEnd({viewId: this.viewId, node, type: 'drag', isGroup: true});
        });
      });
      group.on("transformend", (e) => {
        this.m_group_updateGroupNodes(group);
        const currentStage = stageObj[`stage${this.viewId}`];
        const nodes = currentStage.find('.groupNode');
        this.saveImageData({
          node: group,
          subnodes: nodes,
          isGroup: true,
          viewId: this.viewId,
        });
        [].forEach.call(nodes, node => {
          if(node.type == 'image'){
            this.imgTransformEnd({viewId: this.viewId, node, type: 'transform', isGroup: true});
          } else {
            this.textTransformEnd({ viewId: this.viewId, textGroup: node, isGroup: true });
          }
          this.bgImgLinkageEnd({viewId: this.viewId, node, type: 'transform', isGroup: true});
        });
      });
    },
    m_group_releaseGroupEvent(node) {
      node.off("dragstart");
      node.off("dragmove");
      node.off("dragend");
      node.off("transformstart");
      node.off("transform");
      node.off("transformend");
    },
    m_group_changeBindGroupStatus({listening=true} = {}){
      const curS = this.getCurStageLayer({ viewId:this.viewId });
      const designGroup = curS.stage.findOne('.designGroup');
      designGroup && designGroup.setAttrs({listening});
      // if(designGroup){
      //   const nodes = designGroup.find('Rect');
      //   nodes.forEach(item => {
      //     item.setAttrs({listening})
      //   })
      // }
    },
  },
  watch: {
    // multipleSelectNodes(nv, ov) {
      // this.m_group_unbind();
      // this.m_group_bind({nodes: nv, viewId: this.viewId})
    // }
  },
  mounted () {
    // eventBus.$on('rebindGroup', data => {
    //   const {group, nodes, update, rotation} = data;
    //   if(update){
    //     this.m_group_updateGroupNodes(group);
    //   }
    //   this.m_group_unbind();
    //   this.m_group_bind({ nodes: nodes });
    // });
  },
};
