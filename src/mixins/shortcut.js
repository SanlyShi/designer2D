
import { stageObj } from '@/utils/designer.js'
import {_getDesignActionConfigs} from '@/apis/common';
import { getShortcutsMap, changeFullScreen, GetQueryString } from "@/utils/utils";
import eventBus from "@/utils/eventBus.js";
export default {
  methods: {
    // 快捷键操作
    initShortCuts() {
      let self = this;
      self.isSpaceKey = false;
      self.isAltKey = false;
      // 移动画板
      // document
      //   .getElementById("stageContainer")
      //   .addEventListener("mousedown", function (e) {
      //     if (
      //       e.target.tagName.toUpperCase() == "CANVAS" &&
      //       e.which == 1 &&
      //       self.isSpaceKey
      //     ) {
      //       let domObj = document.querySelector("#container" + self.viewId);
      //       let domLeft = parseFloat(domObj.style.left);
      //       let domTop = parseFloat(domObj.style.top);
      //       let startX = e.clientX,
      //         startY = e.clientY;
      //       // document.querySelector("#container" + self.viewId).style.cursor =
      //       //   "grabbing";
      //       let currentStage = stageObj[`stage${self.viewId}`];
      //       currentStage.content.style.cursor = "grabbing";
      //       self.canvasStartMove = true;
      //       document.onmousemove = function (e) {
      //         let changeX = e.clientX - startX;
      //         let changeY = e.clientY - startY;
      //         domObj.style.left = domLeft + changeX + "px";
      //         domObj.style.top = domTop + changeY + "px";
      //         // 更新偏移值
      //         self.stageOffsetChangeX = changeX;
      //         self.stageOffsetChangeY = changeY;
      //         self.printAreaTip({ currentStage });
      //         if (self.showTouchAnimation) {
      //           self.touchAnimationPos();
      //         }
      //       };
      //     }
      //     e.stopPropagation();
      //   });
      // document.addEventListener("mouseup", function (e) {
      //   document.onmousemove = null;
      //   document.querySelector(
      //     "#container" + self.viewId
      //   ).style.cursor = self.isSpaceKey ? "grab" : "initial";
      //   stageObj[
      //     `stage${self.viewId}`
      //   ].content.style.cursor = self.isSpaceKey ? "grab" : "";
      //   if (self.canvasStartMove) {
      //     self.stageOffsetX += self.stageOffsetChangeX || 0;
      //     self.stageOffsetY += self.stageOffsetChangeY || 0;
      //   }
      //   self.canvasStartMove = false;
      // });
      // window.addEventListener("keyup", function (e) {
      //   self.isSpaceKey = false;
      //   document.querySelector("#container" + self.viewId).style.cursor =
      //     "initial";
      // });
      // Alt+滚轮缩放画布
      window.addEventListener(
        "mousewheel",
        (e) => {
          if (!self.isAltKey) return;
          if (e.wheelDelta) {
            if (e.wheelDelta > 0) {
              self.addStageWidth();
            }
            if (e.wheelDelta < 0) {
              self.reduceStageWidth();
            }
          } else if (e.detail) {
            if (e.detail > 0) {
              self.addStageWidth();
            }
            if (e.detail < 0) {
              self.reduceStageWidth();
            }
          }
          e.preventDefault();
        },
        { passive: false }
      );
      window.addEventListener("keydown", function (e) {
        let keyCode = e.keyCode || e.which || e.charCode;
        let ctrlKey = self.sysPlatform == "windows" ? e.ctrlKey : e.metaKey;
        let shiftKey = e.shiftKey;
        let altKey = e.altKey;
        let winKey = self.sysPlatform == "windows" ? e.metaKey : e.ctrlKey;
        // console.log('eee => ', keyCode, winKey, e);
        let stage = stageObj[`stage${self.viewId}`];
        if (shiftKey || self.$store.state.layout.showType == "group") {
          stage.find("Transformer").setAttrs({
            keepRatio: true,
          });
        }
        if (altKey) {
          self.isAltKey = true;
        }
        // 当出现登录弹窗时，不执行快捷操作
        if (self.checkIsLoginHandler()) return;
        // 自定义产品弹窗打开时，不执行快捷键操作
        if (self.isShowCustomBoard) return;
        // 当用户正在输入时，不执行快捷键操作
        if (self.$store.state.shortcut.hasInputFous) return;
        // 快捷键弹窗显示时，不执行除ctrl+shift+k键(快捷开关)之外的快捷键操作
        let isQuickItem = self.checkSpecialQuickItem(
          {
            ctrlKey,
            shiftKey,
            altKey,
            winKey,
            keyCode,
          },
          "system13"
        );
        if (self.$store.state.shortcut.isShowShortcut && !isQuickItem) return;
        // 对颜色选择特殊处理, 如果当前有打开的颜色面板并且快捷键不是I(拾色器)，则不执行快捷键操作
        let colorPickerOpened = self.colorPickerOpened();
        let isColorPickerItem = self.checkSpecialQuickItem(
          {
            ctrlKey,
            shiftKey,
            altKey,
            winKey,
            keyCode,
          },
          "base25"
        );
        if (colorPickerOpened && colorPickerOpened.length && !isColorPickerItem)
          return;
        // 文字编辑打开时，不执行除Enter键(确认文本)之外快捷键操作
        // let isTextConfirmItem = self.checkSpecialQuickItem(
        //   {
        //     ctrlKey,
        //     shiftKey,
        //     altKey,
        //     winKey,
        //     keyCode,
        //   },
        //   "text11"
        // );
        if (self.editTextPop) return;
        let views = self.productData.views;
        const hasImgActive = self.$store.state.layout.showType == "image";
        const hasTextActive = self.$store.state.layout.showType == "text";
        const hasGroupActive = self.$store.state.layout.showType == "group";
        //拖动画布
        let dragStageKeyItem =
          self.$store.state.shortcut.customShortcutsMap["canvas33"];
        let dragStageKey = dragStageKeyItem ? dragStageKeyItem.keys.key : 32;
        if (
          !ctrlKey &&
          !shiftKey &&
          !altKey &&
          !winKey &&
          keyCode == dragStageKey
        ) {
          if (!self.isSpaceKey) {
            let currentStage = stageObj[`stage${self.viewId}`];
            currentStage.content.style.cursor = "grab";
            currentStage.setAttrs({
              draggable: true,
            });
            for (let item of currentStage.find(".design")) {
              item.setAttrs({
                listening: false,
              });
            }
            document
              .getElementById(`stageContainer`)
              .addEventListener("mousedown", mousedownGrabbing);
            document
              .getElementById(`stageContainer`)
              .addEventListener("mouseup", mouseupGrabbing);
          }
          self.isSpaceKey = true;
          return;
        }
        for (let i = 0; i < self.shortcuts.length; i++) {
          let shortcut = self.shortcuts[i];
          let _type = shortcut.id,
            _complexkey = shortcut.complexKey,
            _key = shortcut.keys.key,
            _isCtrl = _complexkey.includes("Ctrl"),
            _isShift = _complexkey.includes("Shift"),
            _isAlt = _complexkey.includes("Alt"),
            _isWin = _complexkey.includes("Win");
          let isSameKeyCode =
            _key instanceof Array
              ? _key.includes(String(keyCode)) || _key.includes(keyCode)
              : _key == keyCode;
          if (
            ctrlKey == _isCtrl &&
            shiftKey == _isShift &&
            altKey == _isAlt &&
            winKey == _isWin &&
            _key != "" &&
            isSameKeyCode
          ) {
            let imgNode,
              textNode,
              needUpdateEffect = false;
            const nodesArr = hasGroupActive ? self.curNode : [self.curNode];

            /*** 文字快捷键埋点 ****/
            self.$statisticalreport.textCommonBi(_type)

            switch (_type) {
              case "base1": //上移动(每次移动 1px)
                if (hasImgActive || hasTextActive) {
                  let y = self.curNode.y();
                  self.curNode.y(y - 1);
                  self.selectNode([self.curNode]);
                  needUpdateEffect = true;
                }
                break;
              case "base2": //下移动(每次移动 1px)
                if (hasImgActive || hasTextActive) {
                  let y = self.curNode.y();
                  self.curNode.y(y + 1);
                  self.selectNode([self.curNode]);
                  needUpdateEffect = true;
                }
                break;
              case "base3": //左移动(每次移动 1px)
                if (hasImgActive || hasTextActive) {
                  let x = self.curNode.x();
                  self.curNode.x(x - 1);
                  self.selectNode([self.curNode]);
                  needUpdateEffect = true;
                }
                break;
              case "base4": //右移动(每次移动 1px)
                if (hasImgActive || hasTextActive) {
                  let x = self.curNode.x();
                  self.curNode.x(x + 1);
                  self.selectNode([self.curNode]);
                  needUpdateEffect = true;
                }
                break;
              case "base5": //快速上移动(每次移动 10px)
                if (hasImgActive || hasTextActive) {
                  let y = self.curNode.y();
                  self.curNode.y(y - 10);
                  self.selectNode([self.curNode]);
                  needUpdateEffect = true;
                }
                break;
              case "base6": //快速下移动(每次移动 10px)
                if (hasImgActive || hasTextActive) {
                  let y = self.curNode.y();
                  self.curNode.y(y + 10);
                  self.selectNode([self.curNode]);
                  needUpdateEffect = true;
                }
                break;
              case "base7": //快速左移动(每次移动 10px)
                if (hasImgActive || hasTextActive) {
                  let x = self.curNode.x();
                  self.curNode.x(x - 10);
                  self.selectNode([self.curNode]);
                  needUpdateEffect = true;
                }
                break;
              case "base8": //快速右移动(每次移动 10px)
                if (hasImgActive || hasTextActive) {
                  let x = self.curNode.x();
                  self.curNode.x(x + 10);
                  self.selectNode([self.curNode]);
                  needUpdateEffect = true;
                }
                break;
              case "base9": //上对齐
                var { prevAlignStatus } = self.$store.state.layout;
                var alignType = "topcenter";
                if (prevAlignStatus == "centerleft") {
                  alignType = "topleft";
                } else if (prevAlignStatus == "centercenter") {
                  alignType = "topcenter";
                } else if (prevAlignStatus == "centerright") {
                  alignType = "topright";
                } else if (prevAlignStatus == "bottomleft") {
                  alignType = "centerleft";
                } else if (prevAlignStatus == "bottomcenter") {
                  alignType = "centercenter";
                } else if (prevAlignStatus == "bottomright") {
                  alignType = "centerright";
                }
                if (hasImgActive) {
                  eventBus.$emit("imgAlign", alignType);
                  self.$store.commit("layout/changePrevAlignStatus", alignType);
                  needUpdateEffect = true;
                }
                if (hasTextActive) {
                  eventBus.$emit("textAlign", alignType);
                  self.$store.commit("layout/changePrevAlignStatus", alignType);
                  needUpdateEffect = true;
                }
                break;
              case "base10": //下对齐
                var { prevAlignStatus } = self.$store.state.layout;
                var alignType = "bottomcenter";
                if (prevAlignStatus == "topleft") {
                  alignType = "centerleft";
                } else if (prevAlignStatus == "topcenter") {
                  alignType = "centercenter";
                } else if (prevAlignStatus == "topright") {
                  alignType = "centerright";
                } else if (prevAlignStatus == "centerleft") {
                  alignType = "bottomleft";
                } else if (prevAlignStatus == "centercenter") {
                  alignType = "bottomcenter";
                } else if (prevAlignStatus == "centerright") {
                  alignType = "bottomright";
                }
                if (hasImgActive) {
                  eventBus.$emit("imgAlign", alignType);
                  self.$store.commit("layout/changePrevAlignStatus", alignType);
                  needUpdateEffect = true;
                }
                if (hasTextActive) {
                  eventBus.$emit("textAlign", alignType);
                  self.$store.commit("layout/changePrevAlignStatus", alignType);
                  needUpdateEffect = true;
                }
                break;
              case "base11": //左对齐
                var { prevAlignStatus } = self.$store.state.layout;
                var alignType = "centerleft";
                if (prevAlignStatus == "topcenter") {
                  alignType = "topleft";
                } else if (prevAlignStatus == "centercenter") {
                  alignType = "centerleft";
                } else if (prevAlignStatus == "bottomcenter") {
                  alignType = "bottomleft";
                } else if (prevAlignStatus == "topright") {
                  alignType = "topcenter";
                } else if (prevAlignStatus == "centerright") {
                  alignType = "centercenter";
                } else if (prevAlignStatus == "bottomright") {
                  alignType = "bottomcenter";
                }
                if (hasImgActive) {
                  eventBus.$emit("imgAlign", alignType);
                  self.$store.commit("layout/changePrevAlignStatus", alignType);
                  needUpdateEffect = true;
                }
                if (hasTextActive) {
                  eventBus.$emit("textAlign", alignType);
                  self.$store.commit("layout/changePrevAlignStatus", alignType);
                  needUpdateEffect = true;
                }
                break;
              case "base12": //右对齐
                var { prevAlignStatus } = self.$store.state.layout;
                var alignType = "centerright";
                if (prevAlignStatus == "topleft") {
                  alignType = "topcenter";
                } else if (prevAlignStatus == "centerleft") {
                  alignType = "centercenter";
                } else if (prevAlignStatus == "bottomleft") {
                  alignType = "bottomcenter";
                } else if (prevAlignStatus == "topcenter") {
                  alignType = "topright";
                } else if (prevAlignStatus == "centercenter") {
                  alignType = "centerright";
                } else if (prevAlignStatus == "bottomcenter") {
                  alignType = "bottomright";
                }
                if (hasImgActive) {
                  eventBus.$emit("imgAlign", alignType);
                  self.$store.commit("layout/changePrevAlignStatus", alignType);
                  needUpdateEffect = true;
                }
                if (hasTextActive) {
                  eventBus.$emit("textAlign", alignType);
                  self.$store.commit("layout/changePrevAlignStatus", alignType);
                  needUpdateEffect = true;
                }
                break;
              case "base13": //放大
                if (hasImgActive) {
                  eventBus.$emit("changeImgScale", 1);
                }
                if (hasTextActive) {
                  eventBus.$emit("changeTextScale", 1);
                }
                break;
              case "base14": //缩小
                if (hasImgActive) {
                  eventBus.$emit("changeImgScale", -1);
                }
                if (hasTextActive) {
                  eventBus.$emit("changeTextScale", -1);
                }
                break;
              case "base15": //复制
                if (!hasGroupActive) {
                  self.clipboardCopy();
                }
                break;
              case "base16": //创建副本
                if (hasImgActive || hasTextActive || hasGroupActive) {
                  // [].forEach.call(nodesArr, node => {
                  eventBus.$emit("copyToView", {
                    data: {
                      id: self.viewId,
                      nodes: nodesArr,
                    },
                    copyToCurrentView: true,
                  });
                  // })
                  self.$message({
                    message: "复制成功",
                    type: "success",
                  });
                }
                break;
              case "base17": //粘贴
                if (!hasGroupActive) {
                  self.clipboardPaste();
                }
                break;
              case "base18": //剪切
                if (hasImgActive || hasTextActive) {
                  self.noMessage = true;
                  // document.execCommand("copy");
                  self.clipboardCopy();
                  self.noMessage = false;
                  self.deleteNode({
                    node: self.curNode,
                    viewId: self.viewId,
                  });
                  self.$message({
                    message: "剪切成功",
                    type: "success",
                  });
                }
                break;
              case "base19": //全选
                break;
              case "base20": //撤销
              self.$statisticalreport.clickNotDesignItemBtn('撤销')
                eventBus.$emit("undoHistory");
                break;
              case "base21": //重做
              self.$statisticalreport.clickNotDesignItemBtn('重做')
                eventBus.$emit("redoHistory");
                break;
              case "base22": //编组
                break;
              case "base23": //解组
                break;
              case "base24": //保存
                if (GetQueryString("isShowSave") !== "0") {
                  eventBus.$emit("saveProduct");
                }
                break;
              case "base25": //拾色器
                // 如果有颜色面板弹窗时使用颜色面板弹窗的拾色器
                // 没有时,如果左侧是背景色,则使用背景色的拾色器
                if (colorPickerOpened && colorPickerOpened.length) {
                  eventBus.$emit("handleMarkColor");
                  document.getElementById("pickcolorCenterBtn").click();
                } else {
                  let { leftType, selectedBgTab } = self.$store.state.layout;
                  if (leftType == "background" && selectedBgTab == 2) {
                    eventBus.$emit("handleMarkColor", { type: "bgcolor" });
                    document.getElementById("pickcolorCenterBtn").click();
                  }
                }
                break;
              case "canvas32": //设置背景色
                // 打开颜色面板，没有打开时才执行
                if (!(colorPickerOpened && colorPickerOpened.length)) {
                  self.$store.commit("layout/changeLeftType", "background");
                  self.$store.commit("layout/updateSelectedBgTab", 2);
                }
                break;
              case "base26": //删除
                if (hasImgActive || hasTextActive || hasGroupActive) {
                  self.deleteNode({
                    node: self.curNode,
                    viewId: self.viewId,
                  });
                }
                break;
              case "element1": //置于顶层
                if (hasImgActive) {
                  eventBus.$emit("changeImgZIndex", "top");
                }
                if (hasTextActive) {
                  eventBus.$emit("changeTextZIndex", "top");
                }
                if (hasGroupActive) {
                  eventBus.$emit("changeGroupZIndex", "top");
                }
                break;
              case "element2": //置于底层
                if (hasImgActive) {
                  eventBus.$emit("changeImgZIndex", "bottom");
                }
                if (hasTextActive) {
                  eventBus.$emit("changeTextZIndex", "bottom");
                }
                if (hasGroupActive) {
                  eventBus.$emit("changeGroupZIndex", "bottom");
                }
                break;
              case "element3": //上移一层
                if (hasImgActive) {
                  eventBus.$emit("changeImgZIndex", "prev");
                }
                if (hasTextActive) {
                  eventBus.$emit("changeTextZIndex", "prev");
                }
                if (hasGroupActive) {
                  eventBus.$emit("changeGroupZIndex", "prev");
                }
                break;
              case "element4": //下移一层
                if (hasImgActive) {
                  eventBus.$emit("changeImgZIndex", "next");
                }
                if (hasTextActive) {
                  eventBus.$emit("changeTextZIndex", "next");
                }
                if (hasGroupActive) {
                  eventBus.$emit("changeGroupZIndex", "next");
                }
                break;
              case "element5": //水平翻转
                if (hasImgActive) {
                  eventBus.$emit("mirrorFlip", { data: "leftRightMirror" });
                }
                if (hasTextActive) {
                  eventBus.$emit("textMirrorFlip", "leftRightMirror");
                }
                break;
              case "element6": //垂直翻转
                if (hasImgActive) {
                  eventBus.$emit("mirrorFlip", { data: "upDownMirror" });
                }
                if (hasTextActive) {
                  eventBus.$emit("textMirrorFlip", "upDownMirror");
                }
                break;
              case "element7": //透明度0
                break;
              case "element8": //透明度0.1
                break;
              case "element9": //透明度0.2
                break;
              case "element10": //透明度0.3
                break;
              case "element11": //透明度0.4
                break;
              case "element12": //透明度0.5
                break;
              case "element13": //透明度0.6
                break;
              case "element14": //透明度0.7
                break;
              case "element15": //透明度0.8
                break;
              case "element16": //透明度0.9
                break;
              case "element17": //锁定、解锁
                eventBus.$emit("nodeToggleLock", {
                  data: self.curNode,
                });
                e;
                break;
              case "element18": //宽度最大化
                if (hasImgActive) {
                  eventBus.$emit("imgMaximizationChange", {
                    data: { value: "widthMaximization" },
                  });
                  self.selectNode([self.curNode]);
                }
                if (hasTextActive) {
                  eventBus.$emit("textMaximizationChange", {
                    data: { value: "widthMaximization" },
                  });
                  self.selectNode([self.curNode]);
                }
                break;
              case "element19": //高度最大化
                if (hasImgActive) {
                  eventBus.$emit("imgMaximizationChange", {
                    data: { value: "heightMaximization" },
                  });
                  self.selectNode([self.curNode]);
                }
                if (hasTextActive) {
                  eventBus.$emit("textMaximizationChange", {
                    data: { value: "heightMaximization" },
                  });
                  self.selectNode([self.curNode]);
                }
                break;
              case "element20": //最大化设计
                if (hasImgActive) {
                  eventBus.$emit("imgMaximizationChange", {
                    data: { value: "imgFull" },
                  });
                  self.selectNode([self.curNode]);
                }
                if (hasTextActive) {
                  eventBus.$emit("textMaximizationChange", {
                    data: { value: "imgFull" },
                  });
                  self.selectNode([self.curNode]);
                }
                break;
              case "element21": //铺满设计区域
                if (hasImgActive) {
                  eventBus.$emit("imgMaximizationChange", {
                    data: { value: "imgAdaptFull" },
                  });
                  self.selectNode([self.curNode]);
                }
                if (hasTextActive) {
                  eventBus.$emit("textMaximizationChange", {
                    data: { value: "imgAdaptFull" },
                  });
                  self.selectNode([self.curNode]);
                }
                break;
              case "element22": //顺时针旋转45°
              case "element23": //逆时针旋转45°
                if (hasImgActive || hasTextActive) {
                  let curDeg = self.curNode.rotation();
                  let newDeg =
                    parseFloat(curDeg) + (_type == "element22" ? 45 : -45);
                  if (newDeg > 180) {
                    newDeg = newDeg - 360;
                  } else if (newDeg < -180) {
                    newDeg = newDeg + 180;
                  }
                  self.curNode.rotation(newDeg);
                  self.selectNode([self.curNode]);
                  self.addHistory("图层变换", self.viewId, {
                    nodeId: self.curNode.getAttrs().historyId,
                  });
                  needUpdateEffect = true;
                  if(_type == "element22") {
                    self.$statisticalreport.biCommonFn('顺时针旋转45度',self.curNode)
                  } else {
                    self.$statisticalreport.biCommonFn('逆时针旋转45度',self.curNode)
                  }
                }
                break;
              case "gallery1": //裁切
                if (hasImgActive) {
                  self.m_clip_implementClip({ isClick: true });
                  self.$statisticalreport.biCommonFn('裁切', self.curNode)
                }
                break;
              case "gallery2": //抠图
                break;
              case "gallery3": //清晰度
                break;
              case "gallery4": //滤镜
                if (hasImgActive) {
                  eventBus.$emit("toggleImgFilter");
                }
                break;
              case "gallery5": //平铺
                if (hasImgActive) {
                  let curType = self.curNode.getAttrs().tileType;
                  let type = "";
                  if (!curType) {
                    type = "basicsTile";
                  } else if (curType == "basicsTile") {
                    type = "Mirror";
                  } else if (curType == "Mirror") {
                    type = "XSpacedTile";
                  } else if (curType == "XSpacedTile") {
                    type = "YSpacedTile";
                  } else if (curType == "YSpacedTile") {
                    // type = "6";
                    type = "";
                  }
                  eventBus.$emit("repeatChange", {
                    data: { value: type },
                  });
                  self.selectNode([self.curNode]);
                }
                break;
              // case "gallery6": //作为背景应用所有面
              //   eventBus.$emit("applyBgAllView", true);
              //   break;
              // case "gallery7": //设为背景
              //   eventBus.$emit("applyBg", true);
              //   break;
              case "text1": //文字加粗
                if (hasTextActive) {
                  textNode = self.curNode.findOne("Text");
                  var fontStyle = textNode.fontStyle();
                  var isBold = fontStyle.indexOf("bold") > -1;
                  fontStyle = fontStyle
                    .replace(/bold/g, "")
                    .replace(/\s+/g, " ")
                    .trim();
                  textNode.fontStyle(isBold ? fontStyle : fontStyle + " bold");
                  self.selectNode([self.curNode]);
                  self.addHistory("文字工具", self.viewId, {
                    nodeId: self.curNode.getAttrs().historyId,
                  });
                  needUpdateEffect = true;
                }
                break;
              case "text2": //文字斜体
                if (hasTextActive) {
                  textNode = self.curNode.findOne("Text");
                  var fontStyle = textNode.fontStyle();
                  var isItalic = fontStyle.indexOf("italic") > -1;
                  fontStyle = fontStyle
                    .replace(/italic/g, "")
                    .replace(/\s+/g, " ")
                    .trim();
                  textNode.fontStyle(
                    isItalic ? fontStyle : fontStyle + " italic"
                  );
                  self.selectNode([self.curNode]);
                  self.addHistory("文字工具", self.viewId, {
                    nodeId: self.curNode.getAttrs().historyId,
                  });
                  needUpdateEffect = true;
                }
                break;
              case "text3": //文字删除线
                if (hasTextActive) {
                  textNode = self.curNode.findOne("Text");
                  var decoration = textNode.textDecoration();
                  var isLineThrough = decoration.indexOf("line-through") > -1;
                  decoration = decoration
                    .replace(/line\-through/g, "")
                    .replace(/\s+/g, " ")
                    .trim();
                  textNode.textDecoration(
                    isLineThrough ? decoration : decoration + " line-through"
                  );
                  self.selectNode([self.curNode]);
                  self.addHistory("文字工具", self.viewId, {
                    nodeId: self.curNode.getAttrs().historyId,
                  });
                  needUpdateEffect = true;
                }
                break;
              case "text4": //文字下划线
                if (hasTextActive) {
                  textNode = self.curNode.findOne("Text");
                  var decoration = textNode.textDecoration();
                  var isUnderline = decoration.indexOf("underline") > -1;
                  decoration = decoration
                    .replace(/underline/g, "")
                    .replace(/\s+/g, " ")
                    .trim();
                  textNode.textDecoration(
                    isUnderline ? decoration : decoration + " underline"
                  );
                  self.selectNode([self.curNode]);
                  self.addHistory("文字工具", self.viewId, {
                    nodeId: self.curNode.getAttrs().historyId,
                  });
                  needUpdateEffect = true;
                }
                break;
              case "text5": //文字左对齐
                if (hasTextActive) {
                  textNode = self.curNode.findOne("Text");
                  textNode.align("left");
                  self.selectNode([self.curNode]);
                  self.addHistory("文字对齐", self.viewId, {
                    nodeId: self.curNode.getAttrs().historyId,
                  });
                  needUpdateEffect = true;
                }
                break;
              case "text6": //文字居中对齐
                if (hasTextActive) {
                  textNode = self.curNode.findOne("Text");
                  textNode.align("center");
                  self.selectNode([self.curNode]);
                  self.addHistory("文字对齐", self.viewId, {
                    nodeId: self.curNode.getAttrs().historyId,
                  });
                  needUpdateEffect = true;
                }
                break;
              case "text7": //文字右对齐
                if (hasTextActive) {
                  textNode = self.curNode.findOne("Text");
                  textNode.align("right");
                  self.selectNode([self.curNode]);
                  self.addHistory("文字对齐", self.viewId, {
                    nodeId: self.curNode.getAttrs().historyId,
                  });
                  needUpdateEffect = true;
                }
                break;
              case "text8": //文字两端对齐
                if (hasTextActive) {
                  textNode = self.curNode.findOne("Text");
                  textNode.align("justify");
                  self.selectNode([self.curNode]);
                  self.addHistory("文字对齐", self.viewId, {
                    nodeId: self.curNode.getAttrs().historyId,
                  });
                  needUpdateEffect = true;
                }
                break;
              case "text9": //文字上标
                break;
              case "text10": //文字下标
                break;
              case "text11": //编辑/确认文本
                if (hasTextActive) {
                  self.editTextPop
                    ? self.confirmEditText()
                    : self.curNode.findOne("Text").fire("dblclick");
                  needUpdateEffect = true;
                }
                break;
              case "system1": //页面全屏
                changeFullScreen(1);
                break;
              case "system2": //左侧折叠切换
                self.$store.commit(
                  "layout/toggleLeft",
                  !self.$store.state.layout.isLeftHidden
                );
                break;
              case "system3": //右侧折叠切换
                self.$store.commit(
                  "layout/toggleRight",
                  !self.$store.state.layout.isRightHidden
                );
                break;
              case "system4": //左右同时折叠
                let { isLeftHidden, isRightHidden, isFullScreen, prevFStatus } =
                  self.$store.state.layout;
                if (isFullScreen) {
                  changeFullScreen(-1);
                } else {
                  if (isLeftHidden && isRightHidden) {
                    if (prevFStatus == "full") {
                      self.$store.commit("layout/toggleLeft", false);
                      self.$store.commit("layout/toggleRight", false);
                      self.$store.commit("layout/changePrevFStatus", "normal");
                    } else {
                      changeFullScreen(1);
                    }
                  } else {
                    self.$store.commit("layout/toggleLeft", true);
                    self.$store.commit("layout/toggleRight", true);
                  }
                }
                break;
              case "system5": //产品面板
                self.$store.commit("layout/changeLeftType", "product");
                if (self.$store.state.layout.isLeftHidden) {
                  self.$store.commit("layout/toggleLeft", false);
                }
                break;
              case "system6": //图库面板
                self.$store.commit("layout/changeLeftType", "gallery");
                if (self.$store.state.layout.isLeftHidden) {
                  self.$store.commit("layout/toggleLeft", false);
                }
                break;
              case "system7": //文字面板
                self.$store.commit("layout/changeLeftType", "text");
                if (self.$store.state.layout.isLeftHidden) {
                  self.$store.commit("layout/toggleLeft", false);
                }
                break;
              case "system8": //上传面板
                self.$statisticalreport.clickNotDesignItemBtn('上传')
                self.$store.commit("layout/changeLeftType", "upload");
                if (self.$store.state.layout.isLeftHidden) {
                  self.$store.commit("layout/toggleLeft", false);
                }
                break;
              // case "system9": //海报面板
              //   break;
              // case "system10": //设计面板
              //   break;
              case "system11": //图层面板
                let isShowLayer = self.$store.state.layout.isShowLayer;
                if (self.$store.state.layout.isLeftHidden) {
                  self.$store.commit("layout/toggleLeft", false);
                  self.$store.commit("layout/toggleLayer", true);
                } else {
                  self.$store.commit("layout/toggleLayer", !isShowLayer);
                }
                break;
              // case "system12": //操作记录面板
              //   break;
              case "system13": //快捷键面板
                self.$store.commit(
                  "shortcut/toggleShortCut",
                  !self.$store.state.shortcut.isShowShortcut
                );
                break;
              case "system14": //最大化效果图切换
                eventBus.$emit(
                  "largePreview",
                  !self.$store.state.gallery.isLargePreview
                );
                break;
              case "system15": //产品说明
                if (self.$store.state.layout.showType == "product") {
                  eventBus.$emit(
                    "showProductInfo",
                    !self.$store.state.product.isShowProductPop
                  );
                }
                break;
              case "other1": //搜索
                let searchInput = document.querySelectorAll(
                  ".sidebar-main .searchbar .search-input"
                );
                searchInput.forEach((inputEl) => {
                  if (inputEl && inputEl.offsetParent !== null) {
                    inputEl.focus();
                  }
                });
                break;
              case "other2": //加入购物车面板
                eventBus.$emit("addToCart");
                break;
              case "other3": //帮助说明
                window.open(
                  "https://www.hicustom.com/frontend/HelperDocument/documentList?cat_id=20"
                );
                break;
              case "canvas1": //缩小画板
                self.reduceStageWidth();
                break;
              case "canvas2": //放大画板
                self.addStageWidth();
                break;
              case "canvas3": //复位画板
                self.resetStageWidth();
                break;
              case "canvas4": //清空画板
                self.$statisticalreport.clickNotDesignItemBtn('清空')
                self.emptyDesign();
                break;
              case "canvas5": //切换印刷区域1
                self.changeStage({ viewId: views[0].id });
                break;
              case "canvas6": //切换印刷区域2
                if (views.length > 1) {
                  self.changeStage({ viewId: views[1].id });
                }
                break;
              case "canvas7": //切换印刷区域3
                if (views.length > 2) {
                  self.changeStage({ viewId: views[2].id });
                }
                break;
              case "canvas8": //切换印刷区域4
                if (views.length > 3) {
                  self.changeStage({ viewId: views[3].id });
                }
                break;
              case "canvas9": //切换印刷区域5
                if (views.length > 4) {
                  self.changeStage({ viewId: views[4].id });
                }
                break;
              case "canvas10": //切换印刷区域6
                if (views.length > 5) {
                  self.changeStage({ viewId: views[5].id });
                }
                break;
              case "canvas11": //切换印刷区域7
                if (views.length > 6) {
                  self.changeStage({ viewId: views[6].id });
                }
                break;
              case "canvas12": //切换印刷区域8
                if (views.length > 7) {
                  self.changeStage({ viewId: views[7].id });
                }
                break;
              case "canvas13": //切换印刷区域9
                if (views.length > 8) {
                  self.changeStage({ viewId: views[8].id });
                }
                break;
              case "canvas14": //首个印刷区域
                self.changeStage({ viewId: views[0].id });
                break;
              case "canvas15": //上一个印刷区域
                var vIndex = views.findIndex((a) => a.id == self.viewId);
                if (vIndex > 0) {
                  self.changeStage({
                    viewId: views[vIndex - 1].id,
                  });
                }
                break;
              case "canvas16": //下一个印刷区域
                var vIndex = views.findIndex((a) => a.id == self.viewId);
                if (vIndex < views.length - 1) {
                  self.changeStage({
                    viewId: views[vIndex + 1].id,
                  });
                }
                break;
              case "canvas17": //末个印刷区域
                self.changeStage({
                  viewId: views[views.length - 1].id,
                });
                break;
              case "canvas18": //复制到所有印刷区域
                if (hasImgActive || hasTextActive || hasGroupActive) {
                  for (let view of views) {
                    if (view.id != self.viewId) {
                      eventBus.$emit("copyToView", {
                        data: { id: view.id, nodes: nodesArr },
                        type: "all",
                      });
                    }
                  }
                  self.$message({
                    message: "复制成功",
                    type: "success",
                  });
                }
                break;
              case "canvas19": //复制到第1个印刷区域
                if (hasImgActive || hasTextActive || hasGroupActive) {
                  eventBus.$emit("copyToView", {
                    data: { id: views[0].id, nodes: nodesArr },
                  });
                }
                self.$message({
                  message: "复制成功",
                  type: "success",
                });
                break;
              case "canvas20": //复制到第2个印刷区域
                if (hasImgActive || hasTextActive || hasGroupActive) {
                  if (views.length > 1) {
                    eventBus.$emit("copyToView", {
                      data: { id: views[1].id, nodes: nodesArr },
                    });
                    self.$message({
                      message: "复制成功",
                      type: "success",
                    });
                  }
                }
                break;
              case "canvas21": //复制到第3个印刷区域
                if (hasImgActive || hasTextActive || hasGroupActive) {
                  if (views.length > 2) {
                    eventBus.$emit("copyToView", {
                      data: { id: views[2].id, nodes: nodesArr },
                    });
                    self.$message({
                      message: "复制成功",
                      type: "success",
                    });
                  }
                }
                break;
              case "canvas22": //复制到第4个印刷区域
                if (hasImgActive || hasTextActive || hasGroupActive) {
                  if (views.length > 3) {
                    eventBus.$emit("copyToView", {
                      data: { id: views[3].id, nodes: nodesArr },
                    });
                    self.$message({
                      message: "复制成功",
                      type: "success",
                    });
                  }
                }
                break;
              case "canvas23": //复制到第5个印刷区域
                if (hasImgActive || hasTextActive || hasGroupActive) {
                  if (views.length > 4) {
                    eventBus.$emit("copyToView", {
                      data: { id: views[4].id, nodes: nodesArr },
                    });
                    self.$message({
                      message: "复制成功",
                      type: "success",
                    });
                  }
                }
                break;
              case "canvas24": //复制到第6个印刷区域
                if (hasImgActive || hasTextActive || hasGroupActive) {
                  if (views.length > 5) {
                    eventBus.$emit("copyToView", {
                      data: { id: views[5].id, nodes: nodesArr },
                    });
                    self.$message({
                      message: "复制成功",
                      type: "success",
                    });
                  }
                }
                break;
              case "canvas25": //复制到第7个印刷区域
                if (hasImgActive || hasTextActive || hasGroupActive) {
                  if (views.length > 6) {
                    eventBus.$emit("copyToView", {
                      data: { id: views[6].id, nodes: nodesArr },
                    });
                    self.$message({
                      message: "复制成功",
                      type: "success",
                    });
                  }
                }
                break;
              case "canvas26": //复制到第8个印刷区域
                if (hasImgActive || hasTextActive || hasGroupActive) {
                  if (views.length > 7) {
                    eventBus.$emit("copyToView", {
                      data: { id: views[7].id, nodes: nodesArr },
                    });
                    self.$message({
                      message: "复制成功",
                      type: "success",
                    });
                  }
                }
                break;
              case "canvas27": //复制到第9个印刷区域
                if (hasImgActive || hasTextActive || hasGroupActive) {
                  if (views.length > 8) {
                    eventBus.$emit("copyToView", {
                      data: { id: views[8].id, nodes: nodesArr },
                    });
                    self.$message({
                      message: "复制成功",
                      type: "success",
                    });
                  }
                }
                break;
              case "canvas28": //显示或隐藏网格线
                self.$statisticalreport.clickNotDesignItemBtn('网格线')
                self.$store.commit(
                  "layout/toggleGridLine",
                  !self.$store.state.layout.isShowGridLine
                );
                eventBus.$emit(
                  "addGridLine",
                  self.$store.state.layout.isShowGridLine
                );
                break;
              case "canvas29": //显示或隐藏标尺
              self.$statisticalreport.clickNotDesignItemBtn('标尺')
                self.$store.commit("layout/toggleRuler", !self.isShowRuler);
                eventBus.$emit("toggleRuler", self.isShowRuler);
                break;
              case "canvas30": //显示或隐藏标尺线
              self.$statisticalreport.clickNotDesignItemBtn('标尺线')
                self.toggleRulerLine(!self.$store.state.layout.isShowRulerLine);
                break;
              case "canvas31": //显示或隐藏辅助线
              self.$statisticalreport.clickNotDesignItemBtn('辅助线')
                self.$store.commit(
                  "layout/toggleAuxiliaryLine",
                  !self.isShowAuxiliaryLine
                );
                eventBus.$emit("toggleAuxiliaryLine", self.isShowAuxiliaryLine);
                break;
            }
            if (needUpdateEffect) {
              self.cloneStage({ viewId: self.viewId });
            }
            e.preventDefault();
            e.returnValue = false;
            break;
          }
        }
        // 仅alt keydown事件会没掉
        if (altKey && keyCode == 18) {
          e.preventDefault();
          e.returnValue = false;
        }
      });

      window.addEventListener("keyup", (e) => {
        let currentStage = stageObj[`stage${this.viewId}`];
        //画布拖动start
        self.isSpaceKey = false;
        currentStage.content.style.cursor = "initial";
        currentStage.setAttrs({
          draggable: false,
        });
        for (let item of currentStage.find(".design")) {
          item.setAttrs({
            listening: true,
          });
        }
        document
          .getElementById(`stageContainer`)
          .removeEventListener("mousedown", mousedownGrabbing);
        document
          .getElementById(`stageContainer`)
          .removeEventListener("mouseup", mouseupGrabbing);
        //画布拖动end

        //transformer keepratio
        currentStage.find("Transformer").setAttrs({
          keepRatio:
            self.$store.state.layout.showType == "group" ? true : false,
        });
        self.isAltKey = false;
      });

      // 防止用户Alt+Tab切换窗口后回到页面，直接按鼠标滚动可以操作画布放大缩小
      window.addEventListener("mouseup", function (e) {
        if (self.isAltKey) self.isAltKey = false;
      });
      if (document.hidden != undefined) {
        document.addEventListener("visibilitychange", () => {
          if (document.hidden) {
            self.isAltKey = false;
          }
        });
      }
      function mousedownGrabbing() {
        let currentStage = stageObj[`stage${self.viewId}`];
        currentStage.content.style.cursor = "grabbing";
      }
      function mouseupGrabbing() {
        let currentStage = stageObj[`stage${self.viewId}`];
        currentStage.content.style.cursor = "grab";
      }
    },
    // 判断当前是否处于登录操作中
    checkIsLoginHandler(){
      let loginHandler = false;
      let externalPops = [
        document.querySelector('#c-login-popup'),
        document.querySelector('#c-remoteLoginedTip'),
        document.querySelector('#c-login-errDia')
      ]
      for(let ele of externalPops){
        if(ele && ele.clientWidth !=0 && ele.clientHeight != 0){
          loginHandler = true;
          break;
        }
      }
      return loginHandler;
    },
    // 判断当前是否有打开的颜色选择面板
    colorPickerOpened() {
      let colorPickers = document.querySelectorAll(".zw-color-picker-pop");
      let visibleCp = Array.from(colorPickers).filter((c) => {
        return c.clientWidth != 0 && c.clientHeight != 0;
      });
      return visibleCp;
    },
    // 判断当前按下的快捷键是哪个，做特殊判断用
    checkSpecialQuickItem({ ctrlKey, shiftKey, altKey, winKey, keyCode }, quickId) {
      let quickItem = this.$store.state.shortcut.customShortcutsMap[quickId];
      let _isCtrl = quickItem.complexKey.includes("Ctrl"),
        _isShift = quickItem.complexKey.includes("Shift"),
        _isAlt = quickItem.complexKey.includes("Alt"),
        _isWin = quickItem.complexKey.includes("Win"),
        _keyCode = quickItem.keys.key;
      let isSameKeyCode =
        _keyCode instanceof Array
          ? _keyCode.includes(String(keyCode)) || _keyCode.includes(keyCode)
          : _keyCode == keyCode;
      if (
        ctrlKey == _isCtrl &&
        shiftKey == _isShift &&
        altKey == _isAlt &&
        winKey == _isWin && 
        isSameKeyCode
      ) {
        return true;
      } else {
        return false;
      }
    },
    updateShortcutInfo(newData, oldData) {
      let { defaultShortcuts } = this.$store.state.shortcut;
      let defaultSCMap = getShortcutsMap(
        JSON.parse(JSON.stringify(defaultShortcuts))
      );
      this.$store.commit("shortcut/updateDefaultshortcutsMap", defaultSCMap);
      if(newData){
        let customSCMap = JSON.parse(JSON.stringify(defaultSCMap));
        for(let id in newData){
          customSCMap[id].complexKey = newData[id].complexKey || [];
          customSCMap[id].keys = newData[id].keys;
        }
        this.$store.commit("shortcut/updateCustomShortcutsMap", customSCMap);
      } else {
        this.$store.commit("shortcut/updateCustomShortcutsMap", defaultSCMap);
      }
      this.$store.commit("shortcut/updateOldCustomShortcuts", oldData || []);
    },
  },
  async mounted() {
    // 更新当前用户快捷键数据, 如果用户首次进入系统未设置快捷键时，使用默认的快捷键
    if(this.$sdkConfig.platformIsZWKJ){
      let ret = await _getDesignActionConfigs();
      const {new_custom_action_list, old_custom_action_list} = ret.data;
      for(let key in new_custom_action_list){
        if(new_custom_action_list[key].complex_key){
          new_custom_action_list[key].complexKey = new_custom_action_list[key].complex_key;
          delete new_custom_action_list[key].complex_key;
        }
      }
      this.updateShortcutInfo(new_custom_action_list, old_custom_action_list);
    } else {
      this.updateShortcutInfo();
    }

    this.initShortCuts();
  },
};
