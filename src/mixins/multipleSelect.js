import Konva from "@/utils/konva7.2.1";
// import GROUP from "@/mixins/group";
export default {
  // mixins: [GROUP],
  data() {
    return {
      m_ms_selectRectX: 0,
      m_ms_selectRectY: 0,
      m_ms_selectRectWidth: 0,
      m_ms_selectRectHeight: 0,
      m_ms_layerCS: "",
      //当前多选选中的元素
      m_ms_selectImages: [],
      //是否按下了shift键
      m_ms_shiftKeyDown: false,
      //是否按下了鼠标
      m_ms_mouseDownState: false,
      //鼠标是否按下后在移动
      m_ms_mouseDownMoving: false,
      //在 框选范围内 的图片元素
      m_ms_boolNodes: [],
      tipTime:0
    };
  },
  mounted() {
    document.addEventListener("keydown", (e) => {
      let keyCode = e.keyCode || e.which || e.charCode;
      if (keyCode == 16) {
        // this.m_group_changeBindGroupStatus({listening: false});
        this.m_ms_shiftKeyDown = true;
        this.$store.commit("multiple/updateShiftKeyDown", true);
      }
    });
    document.addEventListener("keyup", (e) => {
      let keyCode = e.keyCode || e.which || e.charCode;
      if (keyCode == 16) {
        // this.m_group_changeBindGroupStatus({listening: true});
        this.m_ms_shiftKeyDown = false;
        this.$store.commit("multiple/updateShiftKeyDown", false);
      }
    });
    document.addEventListener("mouseup", () => {
      this.m_ms_kuangSelectDone();
    });
  },
  methods: {
    m_ms_watchImageShiftClick(image) {
      image.on("click.mms", (e) => {
        if (
          this.m_ms_shiftKeyDown &&
          !this.$store.state.multiple.fireClickState
        ) {
          this.m_ms_select("shiftclick", image);
        }
      });
    },
    m_ms_watchStageMouseEvent(currentStage, callback) {
      currentStage.on("mousedown.mms", (e) => {
        currentStage.find(".ms_layer").remove();
        currentStage.find(".rectselect").remove();
        if (e.evt) {
          this.m_ms_layerCS = [];
          this.m_ms_layerCS = new Konva.Layer({
            x: -currentStage.x(),
            y: -currentStage.y(),
            name: "ms_layer",
          });
          currentStage.add(this.m_ms_layerCS);
          if (e.target.parent == null) {
            this.m_ms_mouseDownState = true;
          }
          this.m_ms_selectRectX = e.evt.layerX;
          this.m_ms_selectRectY = e.evt.layerY;
        }
      });
      //开始框选
      currentStage.on("mousemove.mms", (e) => {
        if (this.m_ms_mouseDownState) {
          callback();
          this.m_ms_mouseDownMoving = true;
          this.m_ms_selectRectWidth = e.evt.layerX - this.m_ms_selectRectX;
          this.m_ms_selectRectHeight = e.evt.layerY - this.m_ms_selectRectY;
          this.m_ms_drawSlectRect();
          let nodes = currentStage.find(".design").filter((x) => {
            return !(
              x.isLock ||
              x.isHidden ||
              x.hasName("isBg") ||
              x.getParent()?.hasName("repeatImgGroup")
            );
          });
          //筛选获取框选到的节点元素
          this.m_ms_boolNodes = nodes.filter((image) => {
            let { x, y, width, height } = image.getClientRect({
              relativeTo: this.m_ms_layerCS,
            });
            let boolInAndUse = false;
            if (
              this.m_ms_getRectInOrNotBool(x, y, width, height) &&
              this.filterNode(image)
            ) {
              boolInAndUse = true;
            }
            return boolInAndUse;
          });
          this.tipTime = 0
        }
      });
    },
    //完成框选后
    m_ms_kuangSelectDone(e) {
      if (this.m_ms_mouseDownMoving) {
        if (!this.m_ms_shiftKeyDown) {
          //如果未按下shift，先清空所有选中，再添加在范围内的所有
          this.m_ms_select("noshiftmousemove", this.m_ms_boolNodes);
        } else {
          //如果按下shift，在范围内的，未选中过的选中，选中过的取消掉
          this.m_ms_select("shiftmousemove", this.m_ms_boolNodes);
        }
      }
      this.m_ms_mouseDownMoving = false;
      this.m_ms_mouseDownState = false;
      this.m_ms_layerCS && this.m_ms_layerCS.remove();
    },
    // m_ms_select_bak(type, selectObj, isGroupEle = false) {
    //   const curNode = isGroupEle ? selectObj : this.curNode;
    //   let changeBool = 0;
    //   //1.之前选中的取消选中，之前未选中的选中 （条件：按下shift）
    //   if (type == "shiftclick") {
    //     if (curNode && this.filterNode(curNode)) {
    //       if (!this.m_ms_selectImages.find((x) => x._id == curNode._id)) {
    //         this.m_ms_selectImages.push(curNode);
    //         this.m_ms_selectImages = this.m_ms_selectImages.filter((no) => {
    //           return this.filterNodeNotip(no);
    //         });
    //       }
    //     }
    //     if (this.filterNode(selectObj)) {
    //       if (!this.m_ms_selectImages.find((x) => x._id == selectObj._id)) {
    //         this.m_ms_selectImages.push(selectObj);
    //         this.m_ms_selectImages = this.m_ms_selectImages.filter((no) => {
    //           return this.filterNodeNotip(no);
    //         });
    //         changeBool += 1;
    //       } else {
    //         // this.m_ms_selectImages = this.m_ms_selectImages.filter((x) => {
    //         //   return x._id != selectObj._id;
    //         // });
    //         changeBool += 1;
    //       }
    //     }
    //   } else if (type == "shiftmousemove") {
    //     if (curNode && this.filterNode(curNode)) {
    //       if (!this.m_ms_selectImages.find((x) => x._id == curNode._id)) {
    //         this.m_ms_selectImages.push(curNode);
    //         this.m_ms_selectImages = this.m_ms_selectImages.filter((no) => {
    //           return this.filterNodeNotip(no);
    //         });
    //       } else {
    //         this.m_ms_selectImages = this.m_ms_selectImages.filter((x) => {
    //           return x._id != curNode._id;
    //         });
    //       }
    //     }
    //     selectObj.forEach((image) => {
    //       if (image.beInclude && this.filterNode(image.RectData)) {
    //         if (
    //           !this.m_ms_selectImages.find((x) => x._id == image.RectData._id)
    //         ) {
    //           this.m_ms_selectImages.push(image.RectData);
    //           this.m_ms_selectImages = this.m_ms_selectImages.filter((no) => {
    //             return this.filterNodeNotip(no);
    //           });
    //           changeBool += 1;
    //         } else {
    //           this.m_ms_selectImages = this.m_ms_selectImages.filter((x) => {
    //             return x._id != image.RectData._id;
    //           });
    //           changeBool += 1;
    //         }
    //       }
    //     });
    //   }
    //   //2.之前选中全部重置，然后在范围内的进行选中   (条件：未按下shift && 框选)
    //   else if (type == "noshiftmousemove") {
    //     this.m_ms_selectImages = [];
    //     selectObj.forEach((image) => {
    //       if (image.beInclude) {
    //         this.m_ms_selectImages.push(image.RectData);
    //       }
    //     });
    //     changeBool += 1;
    //   }
    //   if (changeBool > 0) {
    //     this.layerImgList.forEach((o) => {
    //       if (o.childrens.length > 0) {
    //         o.childrens.forEach((i) => {
    //           if (this.m_ms_selectImages.find((k) => k._id == i._id)) {
    //             i.isSelected = true;
    //           } else {
    //             i.isSelected = false;
    //           }
    //         });
    //       }
    //     });
    //     this.$store.commit(
    //       "multiple/updateMultipleSelectNodes",
    //       this.m_ms_selectImages
    //     );
    //   }
    // },
    m_ms_select(type, selectObj) {
      if(this.$store.state.clip.isCliping) return;
      const isGroup = Array.isArray(this.curNode);
      const curNode = isGroup
        ? this.curNode
        : this.curNode
        ? [this.curNode]
        : [];
      //1.之前选中的取消选中，之前未选中的选中 （条件：按下shift）
      if (type == "shiftclick") {
        // const filterNodes = curNode.filter((x) => {
        //   return this.filterNode(x);
        // });
        // this.m_ms_selectImages = this.m_ms_selectImages.filter((no) => {
        //   return this.filterNodeNotip(no);
        // });
        if (this.filterNode(selectObj)) {
          const filterNodes = curNode.filter((x) => {
            return this.filterNode(x);
          });
          if (filterNodes.some((x) => x._id == selectObj._id)) {
            this.m_ms_selectImages = this.m_ms_selectImages.filter(
              (x) => x._id != selectObj._id
            );
          } else {
            this.m_ms_selectImages.push(selectObj);
            this.m_ms_selectImages = this.m_ms_selectImages.filter((no) => {
              return this.filterNodeNotip(no);
            });
          }
        }
        this.tipTime = 0
      } else if (type == "shiftmousemove") {
        [].forEach.call(selectObj, (x) => {
          if (curNode.some((a) => a._id == x._id)) {
            this.m_ms_selectImages = this.m_ms_selectImages.filter(
              (a) => a._id != x._id
            );
          } else {
            this.m_ms_selectImages.push(x);
            this.m_ms_selectImages = this.m_ms_selectImages.filter((no) => {
              return this.filterNodeNotip(no);
            });
          }
        });
      }
      //2.之前选中全部重置，然后在范围内的进行选中   (条件：未按下shift && 框选)
      else if (type == "noshiftmousemove") {
        this.m_ms_selectImages = selectObj;
      }
      this.layerImgList.forEach((o) => {
        if (o.childrens.length > 0) {
          o.childrens.forEach((i) => {
            if (this.m_ms_selectImages.find((k) => k._id == i._id)) {
              i.isSelected = true;
            } else {
              i.isSelected = false;
            }
          });
        }
      });
      // 选中的节点必须按从下往上的顺序排序，否则组排序可能会导致组内排序
      const selected = [];
      const {layer} = this.getCurStageLayer({viewId: this.viewId});
      layer.find('.design').forEach(a => {
        if(this.m_ms_selectImages.some(k=>k._id == a._id)){
          selected.push(a);
        }
      });
      this.$store.commit(
        "multiple/updateMultipleSelectNodes",
        selected
      );
    },
    //画出框选框的半透明方形
    m_ms_drawSlectRect() {
      this.m_ms_boolNodes = [];
      this.m_ms_deleteNode(this.m_ms_layerCS);
      let rect = new Konva.Rect({
        x: this.m_ms_selectRectX,
        y: this.m_ms_selectRectY,
        width: this.m_ms_selectRectWidth,
        height: this.m_ms_selectRectHeight,
        fill: "#8c9899",
        name: "rectselect",
        stroke: "black",
        opacity: 0.5,
        strokeWidth: 1,
      });
      this.m_ms_layerCS.add(rect);
      this.m_ms_layerCS.draw();
    },
    //删除框
    m_ms_deleteNode(m_ms_layerCS) {
      let nodes = m_ms_layerCS.find(".rectselect");
      nodes.map((n) => {
        n.remove();
      });
    },
    //图片是否在框内
    m_ms_getRectInOrNotBool(X, Y, width, height) {
      let pointArr = [
        { x: X, y: Y },
        { x: X + width, y: Y },
        { x: X, y: Y + height },
        { x: X + width, y: Y + height },
      ];
      let pointBoolArr = pointArr.map((po) => {
        return this.m_ms_pointInRectOrNot(
          po.x,
          po.y,
          this.m_ms_selectRectX,
          this.m_ms_selectRectY,
          this.m_ms_selectRectWidth,
          this.m_ms_selectRectHeight
        );
      });
      return pointBoolArr.every((x) => x == true);
    },
    //点是否在框内
    m_ms_pointInRectOrNot(x, y, RectX, RectY, RectWidth, RectHeight) {
      let trueRectX, trueRectY;
      if (RectWidth < 0) {
        trueRectX = RectX + RectWidth;
      } else {
        trueRectX = RectX;
      }
      if (RectHeight < 0) {
        trueRectY = RectY + RectHeight;
      } else {
        trueRectY = RectY;
      }
      RectWidth = Math.abs(RectWidth);
      RectHeight = Math.abs(RectHeight);
      return (
        x <= trueRectX + RectWidth &&
        x >= trueRectX &&
        y <= trueRectY + RectHeight &&
        y >= trueRectY
      );
    },
    //获取选中节点元素数组
    m_ms_getMultipleSelectImages() {
      return this.m_ms_selectImages;
    },
    getText(node) {
      let text = "";
      if (node.isHidden) {
        text = "多选不能包含隐藏的图";
      }
      if (node.isLock) {
        text = "多选不能包含锁定的图";
      }
      if (node.getAttrs().name.indexOf("isBg") > -1) {
        text = "多选不能包含背景图";
      }
      if (node.getParent()?.hasName("repeatImgGroup")) {
        text = "多选不能包含平铺的图";
      }
      if (node.type == "view") {
        text = "多选不能包含面";
      }
      return text;
    },
    filterNode(node) {
      if (
        !node ||
        // node.hasName("designGroup") ||
        node.getParent()?.hasName("repeatImgGroup") ||
        node.getAttrs().name.indexOf("isBg") > -1 ||
        node.isLock ||
        node.isHidden
      ) {
        if (node) {
          this.tipTime += 1
          this.tipTime < 2 && this.getText(node) && this.$message.warning(this.getText(node));
        }
        return false;
      } else {
        return true;
      }
    },
    filterNodeNotip(node) {
      if (
        !node ||
        // node.hasName("designGroup") ||
        node.getParent()?.hasName("repeatImgGroup") ||
        node.getAttrs().name.indexOf("isBg") > -1 ||
        node.isLock ||
        node.isHidden
      ) {
        return false;
      } else {
        return true;
      }
    },
  },
  watch: {
    "$store.state.multiple.multipleSelectNodes": {
      handler: function (nv, ov) {
        if(this.$store.state.clip.isCliping) return;
        if (nv && nv.length) {
          this.selectNode(nv, this.viewId);
        } else {
          this.destroyTransformer();
        }
      },
    },
  },
};
