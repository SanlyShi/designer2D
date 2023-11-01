<template>
  <div class="layer-box scroll-bar p10">
    <el-tree
      :data="designImgList"
      node-key="_id"
      @node-click.self="handleNodeClick"
      :expand-on-click-node="false"
      :default-expand-all="true"
      :props="props"
      ref="tree"
      draggable
      @node-drag-start="handleDragStart"
      @node-drag-enter="handleDragEnter"
      @node-drag-leave="handleDragLeave"
      @node-drag-over="handleDragOver"
      @node-drag-end="handleDragEnd"
      @node-drop="handleDrop"
      :allow-drop="allowDrop"
      :allow-drag="allowDrag"
    >
      <div class="custom-tree-node" :class="'node-'+data.type" slot-scope="{ node, data }">
        <div class="name ccc" :class="{'bg': data.type=='image' && data.getAttrs().name.indexOf('isBg') > -1}">
          <i class="iconfont iconbg bgicon" v-if="data.type=='image' && data.getAttrs().name.indexOf('isBg') > -1"></i>
          <template>
            <i class="icon_background" :style="{'background-color': data.icon}" v-if="data.type=='bgcolor'"></i>
            <div class="imgbox" v-if="data.type=='image'">
              <img :src="data.attrs.flipImgUrl" />
            </div>
            <i class="iconfont" :class="'icon'+data.icon" v-else></i>
          </template>
          <label class="ml5">{{node.label}}</label>
          <el-popover popper-class="tips" placement="top-start" trigger="hover" v-if="data.isError">
            <div class="popover-tips">
              <div class="title">
                <i class="iconfont iconinfo-circle-fill error-tips" v-if="data.errors.type=='error'"></i>
                <i class="iconfont iconinfo-circle-fill warning-tips" v-if="data.errors.type=='warning'"></i>
                <i class="iconfont iconinfo-circle-fill remind-tips" v-if="data.errors.type=='remind'"></i>
                <div class="ml5">{{data.errors.title}}</div>
              </div>
              <div class="detail" v-html="data.errors.detail"></div>
            </div>
            <i class="iconfont iconinfo-circle-fill error-tips" slot="reference" v-if="data.errors.type=='error'"></i>
            <i class="iconfont iconinfo-circle-fill warning-tips" slot="reference" v-if="data.errors.type=='warning'"></i>
            <i class="iconfont iconinfo-circle-fill remind-tips" slot="reference" v-if="data.errors.type=='remind'"></i>
          </el-popover>
        </div>
        <span v-if="data.type=='view' && data.bgcolor != ''" class="bg-color-rect" :style="'background: ' + data.bgcolor"></span>
        <div v-if="data.type!='view'" class="operates">
          <span>
            <i class="iconfont iconlock mr8 lock-icon" v-if="data.isLock" @click="toggleLock(data)"></i>
            <i class="iconfont iconeye-close mr8 hidden-icon" v-if="data.isHidden" @click="toggleHidden(data)"></i>
          </span>
          <span class="suspen">
            <i class="iconfont iconunlock-fill mr8 lock-icon" v-if="!data.isLock" @click="toggleLock(data)"></i>
            <i class="iconfont iconeye-open mr8 hidden-icon" v-if="!data.isHidden" @click="toggleHidden(data)"></i>
          </span>
        </div>
      </div>
    </el-tree>
  </div>
</template>

<script>
import eventBus from "@/utils/eventBus.js";
export default {
  data() {
    return {
      props: {
        children: "childrens",
      },
      data: [
        {
          label: "A面",
          type: "view",
          icon: "skin",
          childrens: [
            {
              label: "图片",
              type: "image",
              icon: "picture",
              isError: true,
              errors: {
                type: "error",
                title: "图片严重模糊，图片严重变形",
                detail:
                  "1. 图片像素不足放大，严重影响生产印刷清晰度 <br/>2. 图片拉伸变形指数2倍以上，请注意图案变形严重",
              },
              isLock: false,
              isHidden: true,
            },
            {
              label: "文字",
              type: "text",
              icon: "text",
              isError: true,
              errors: {
                type: "warning",
                title: "图片比较模糊，图片比较变形",
                detail:
                  "1. 图片像素不足放大，比较影响生产印刷清晰度 <br/>2. 图片拉伸变形指数1.5-2倍，请注意已经导致图案变形",
              },
              isLock: true,
              isHidden: false,
            },
            {
              label: "背景色",
              type: "bgcolor",
              icon: "#f00",
              isLock: true,
              isHidden: false,
            },
            {
              label: "背景图片",
              type: "bgimage",
              icon: "picture",
              isLock: true,
              isHidden: false,
            },
            {
              label: "组合",
              type: "group",
              icon: "group",
              isLock: true,
              isHidden: false,
              childrens: [
                {
                  label: "图片2",
                  type: "image",
                  icon: "picture",
                  isError: true,
                  errors: {
                    type: "remind",
                    title: "图片比较模糊，图片比较变形",
                    detail:
                      "1. 图片像素不足放大，比较影响生产印刷清晰度 <br/>2. 图片拉伸变形指数1.5-2倍，请注意已经导致图案变形",
                  },
                  isLock: true,
                  isHidden: false,
                },
                {
                  label: "文字2",
                  type: "text",
                  icon: "text",
                  isLock: true,
                  isHidden: false,
                },
              ],
            },
          ],
        },
        {
          label: "B面",
          type: "view",
          icon: "skin",
          childrens: [
            {
              label: "图片",
              type: "image",
              icon: "picture",
              isError: true,
              errors: {},
              isLock: true,
              isHidden: false,
            },
            {
              label: "文字",
              type: "text",
              icon: "text",
              isWarning: true,
              warnings: {},
              isLock: true,
              isHidden: false,
            },
          ],
        },
      ],
    };
  },
  computed: {
    designImgList() {
      let designImgList = this.$store.state.gallery.designImgList || [];
      for (let item of designImgList) {
        if (item.childrens && item.childrens.length > 0) {
          for (let c of item.childrens) {
            switch (c.type) {
              case "image":
                // this.$set(c, 'label', '图片')
                // this.$set(c, 'icon', 'picture')
                c.label = c.getAttrs().imageData.name;
                c.icon = "picture";
                break;
              case "text":
                // c.label = c.find('Text')[0].text()
                c.icon = "text";
                break;
            }
            if (c.isVagueData) {
              c.isError = true;
              if (c.isVagueData.text && c.transformData.text) {
                let type = Math.max(c.isVagueData.type, c.transformData.type);
                this.$set(c, "errors", {
                  type: "remind",
                  title: c.isVagueData.title + "，" + c.transformData.title,
                  detail: `1. ${c.isVagueData.text} <br/>2. ${c.transformData.text}`,
                });
                this.typeSwitch({ item: c.errors, type: type });
              } else if (c.isVagueData.text) {
                this.$set(c, "errors", {
                  type: "remind",
                  title: c.isVagueData.title,
                  detail: `1. ${c.isVagueData.text}`,
                });
                this.typeSwitch({ item: c.errors, type: c.isVagueData.type });
              } else if (c.transformData.text) {
                this.$set(c, "errors", {
                  type: "remind",
                  title: c.transformData.title,
                  detail: `1. ${c.transformData.text}`,
                });
                this.typeSwitch({ item: c.errors, type: c.transformData.type });
              } else {
                c.isError = false;
              }
            }
          }
        }
      }
      return designImgList;
    },
  },
  methods: {
    typeSwitch({ item, type }) {
      switch (type) {
        case 1:
          this.$set(item, "type", "remind");
          break;
        case 2:
          this.$set(item, "type", "warning");
          break;
        case 3:
          this.$set(item, "type", "error");
          break;
      }
    },
    handleNodeClick(data, e) {
      if (data.type == "view") {
        eventBus.$emit("changeStage", { viewId: data.id });
      } else {
        let layer = data.getLayer();
        eventBus.$emit("changeStage", { viewId: layer.attrs.viewId });
        this.$store.commit("layout/changeSelectNode", data);
        eventBus.$emit("changeSelectNode", { data: data });
        switch (data.type) {
          case "image": //图片
          case "bgimage": //背景图片
          case "bgcolor": //背景颜色
            this.$store.commit("layout/changeSelectType", "image");
            break;
          case "text": //文字
            this.$store.commit("layout/changeSelectType", "text");
            break;
          case "group": //组合
            this.$store.commit("layout/changeSelectType", "group");
            break;
        }
      }
    },
    toggleLock(data, val) {
      eventBus.$emit("nodeToggleLock", { data: data });
    },
    toggleHidden(data, val) {
      this.$set(data, "isHidden", !data.isHidden);
      eventBus.$emit("nodeToggleHidden", { data: data });
    },
    // 拖拽
    handleDragStart(node, ev) {
      // this.nodeIndexMap = {};
      // let layer = node.data.getLayer();
      // layer.find('.design').forEach((n)=>{
      //   if(layer.findOne(`.repeatImgGroup${n._id}`)){
      //     this.nodeIndexMap[n._id] = layer.findOne(`.repeatImgGroup${n._id}`).zIndex();
      //   } else {
      //     this.nodeIndexMap[n._id] = n.zIndex();
      //   }
      // });
      // console.log('dragStart => ', this.nodeIndexMap);
    },
    handleDragEnter(draggingNode, dropNode, ev) {},
    handleDragLeave(draggingNode, dropNode, ev) {},
    handleDragOver(draggingNode, dropNode, ev) {},
    handleDragEnd(draggingNode, dropNode, dropType, ev) {},
    handleDrop(draggingNode, dropNode, dropType, ev) {
      let layer = draggingNode.data.getLayer();
      let draggingZIndex = draggingNode.data.zIndex();
      let dropZIndex = dropNode.data.zIndex();
      if(layer.findOne(`.repeatImgGroup${dropNode.data._id}`)){
        dropZIndex = layer.findOne(`.repeatImgGroup${dropNode.data._id}`).zIndex();
      }
      let $repeatObj = layer.findOne(`.repeatImgGroup${draggingNode.data._id}`);
      if($repeatObj){
        $repeatObj.zIndex(dropZIndex);
        if(dropType == 'after' && draggingZIndex < dropZIndex){
          $repeatObj.moveDown();
        }
        if(dropType == 'before' && draggingZIndex > dropZIndex){
          $repeatObj.moveUp();
        }
      } else {
        draggingNode.data.zIndex(dropZIndex);
        if(dropType == 'after' && draggingZIndex < dropZIndex){
          draggingNode.data.moveDown();
        }
        if(dropType == 'before' && draggingZIndex > dropZIndex){
          draggingNode.data.moveUp();
        }
      }
      layer.batchDraw();
      eventBus.$emit('swapNodeIndex', {
        viewId: dropNode.parent.data.id,
        draggingNode,
        dropNode
      })
    },
    allowDrop(draggingNode, dropNode, type) {
      if(type == 'inner') return false;
      // 面和背景图层不能被放置
      if(dropNode.data.type == 'view') return false;
      if(dropNode.data.getAttrs().name.indexOf('isBg') > -1) return false;
      // 不同面的节点不允许交换
      if(draggingNode.parent.id != dropNode.parent.id) return false;
      return true;
    },
    allowDrag(draggingNode) {
      // 面和背景图层不允许拖拽
      if(draggingNode.data.type == 'view') return false;
      if(draggingNode.data.getAttrs().name.indexOf('isBg') > -1) return false;
      return true;
    }
  },
  mounted() {
    // 默认选中第一面
    this.$nextTick(() => {
      this.$refs.tree.setCurrentKey(this.$store.state.curNodeId);
    });
    eventBus.$on("changeTreeSelectNode", (data) => {
      if (data.data) {
        this.$refs.tree.setCurrentKey(data.data._id);
      } else {
        this.$refs.tree.setCurrentKey("view-" + data.viewId);
      }
    });
  },
  watch: {
    // designImgList: {
    //   handler(newD, oldD) {
    //     for(let item of newD) {
    //       if(item.childrens) {
    //         for(let c of item.childrens) {
    //           console.log('***********', c.type)
    //           switch(c.type) {
    //             case 'image':
    //               // this.$set(c, 'label', '图片')
    //               // this.$set(c, 'icon', 'picture')
    //               c.label = '图片'
    //               c.icon = 'picture'
    //               break;
    //           }
    //           if(c.isVagueData) {
    //             c.isError = true
    //             if(c.isVagueData.text && c.transformData.text) {
    //               let type = Math.max(c.isVagueData.type, c.transformData.type)
    //               c.errors = {type: 'remind', title: c.isVagueData.title + '，' + c.transformData.title, detail: `1. ${c.isVagueData.text} <br/>2. ${c.transformData.text}`}
    //               this.typeSwitch({item: c.errors, type: type})
    //             }else if(c.isVagueData.text) {
    //               c.errors = {type: 'remind', title: c.isVagueData.title, detail: `1. ${c.isVagueData.text}`}
    //               this.typeSwitch({item: c.errors, type: c.isVagueData.type})
    //             }else if(c.transformData.text) {
    //               c.errors = {type: 'remind', title: c.transformData.title, detail: `1. ${c.transformData.text}`}
    //               this.typeSwitch({item: c.errors, type: c.transformData.type})
    //             }
    //           }
    //         }
    //       }
    //     }
    //   },
    //   deep: true,
    //   immediate: true
    // }
  },
};
</script>

<style lang="scss" scoped>
.layer-box {
  font-size: 14px;
  height: calc(100% - 32px);
  overflow: auto;
  user-select: none;
}
.bg-color-rect {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}
/deep/ .el-tree-node__content {
  height: 40px;
  line-height: 40px;
  border: 1px solid transparent;
  border-radius: 5px;
  &:hover {
    background: #fff;
    border: 1px solid rgba(0, 0, 0, 0.45);
  }
}
// /deep/
//   .el-tree--highlight-current
//   .el-tree-node.is-current
//   > .el-tree-node__content {
//   background-color: #f0f5ff;
// }
/deep/ .el-tree-node__expand-icon {
  color: #37474f;
}
/deep/ .el-tree-node:hover {
  .suspen {
    display: block;
  }
}
/deep/ .el-tree > .el-tree-node > .el-tree-node__content {
  background-color: #f0f5ff;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #37474f;
  height: 40px;
  position: relative;
  &:hover {
    color: #000;
  }
  .name {
    &.bg{
      cursor: not-allowed;
      label{
        cursor: not-allowed;
      }
    }
    flex: 1;
    display: flex;
    align-items: center;
    padding-right: 50px;
    .bgicon{
      font-size: 15px;
      margin: 1px 5px 0 -20px;
      color: #37474f;
    }
    label {
      max-width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .imgbox {
      width: 15px;
      height: 15px;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        max-width: 15px;
        max-height: 15px;
      }
    }
  }
  .operates {
    .lock-icon {
      position: absolute;
      right: 23px;
      top: 0;
    }
    .hidden-icon {
      position: absolute;
      right: 0;
      top: 0;
    }
  }
  .suspen {
    visibility: hidden;
  }
  &.node-view {
    font-weight: 500;
  }
}
.custom-tree-node:hover {
  .suspen {
    visibility: visible;
  }
}
.icon_background {
  display: inline-block;
  width: 16px;
  height: 16px;
}
.error-tips {
  color: #ff4d4f;
}
.warning-tips {
  color: #faad14;
}
.remind-tips {
  color: #fadb14;
  cursor: pointer;
}
.flex {
  display: flex;
}
.popover-tips {
  font-size: 14px;
  .title {
    display: flex;
    align-items: center;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    padding-bottom: 5px;
  }
  .detail {
    padding-top: 5px;
    color: rgba(0, 0, 0, 0.65);
  }
}
</style>