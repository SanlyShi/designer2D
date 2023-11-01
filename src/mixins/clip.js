import {
  rotateConvert,
  getPointAfterRotate,
  getNodePointAfterRotate,
  getEventPoint,
  loadImgs,
} from "@/utils/utils.js";
import Konva from '@/utils/konva7.2.1'
import { stageObj, linkageDesign } from '@/utils/designer.js'
export default {
  data() {
    return {
      m_clip_isCliping: false,
      m_clip_clipLayer: null,
      m_clip_clipEventChange: false, //是否执行了裁剪事件，用于判断是否需要添加历史记录
      m_clip_imageTemp: null,
      m_clip_pathTemp: null,
    };
  },
  methods: {
    // 执行裁切操作, 正在裁切状态执行保存操作，否则进入裁切状态
    async m_clip_implementClip({isClick=false} = {}){
      if(this.m_clip_isCliping){
        await this.m_clip_imgClipSave();
        this.$store.commit('clip/updateIsShowClip', false);
        if(isClick) this.curNode.fire('click')
      } else {
        if(this.curNode.getAttrs().tileType){
          this.$message({
            message: '平铺后不支持裁切，请移除平铺后重试',
            type: 'warning'
          });
          return;
        }
        let clipData = this.curNode.getAttrs().clipData;
        this.$store.commit('clip/setClipData', clipData?.clipPath || {});
        this.$store.commit('clip/updateIsShowClip', true);
        return;
      }
    },
    // 保存裁切
    m_clip_imgClipSave(){
      return new Promise(async (resolve, reject) => {
        if (!this.m_clip_isCliping) return;
        let clipPath = this.$store.state.clip.clipData;
        if(clipPath && clipPath.code){
          this.curNode.zIndex(this.clipZIndex);
          let originNodeWidth = this.curNode.width() * this.curNode.scaleX();
          let originNodeHeight = this.curNode.height() * this.curNode.scaleY();
          let stage = stageObj[`stage${this.viewId}`];
          let designLayer = stage.findOne(".designLayer");
          let path = this.m_clip_clipLayer.findOne('.clipRect');
          let _imgAttrs = JSON.parse(JSON.stringify(this.curNode.getAttrs()));
          let _pathAttrs = JSON.parse(JSON.stringify(path.getAttrs()));
          let clipData = this.m_clip_getClipData(this.curNode);
          let {imgAttrs, pathAttrs} = clipData;
          let src = await this.m_clip_getClipImage(clipData);
          let [clipedImg] = await loadImgs([src]);
          this.curNode.image(clipedImg);
          this.curNode.setAttrs({
            flipImgUrl: src,
            offsetX: this.curNode.width()/2,
            offsetY: this.curNode.height()/2,
            x: _pathAttrs.x,
            y: _pathAttrs.y,
            scaleX: pathAttrs.width * pathAttrs.scaleX / this.curNode.width(),
            scaleY: pathAttrs.height * pathAttrs.scaleY / this.curNode.height(),
            isclip: true,
            clipData
          })
          this.m_clip_isCliping = false;
          this.m_clip_clipLayer.destroy();
          this.m_clip_changeClipImgStatus(this.curNode, false);
          this.ncYSRemind({
            currentStage: stage,
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
          designLayer.batchDraw();
          this.cloneStage({ viewId: this.viewId });
          if(this.m_clip_clipEventChange || !_imgAttrs.isclip || _imgAttrs.clipData?.clipPath?.code != clipPath.code){
            this.addHistory('图片裁切', this.viewId, {
              nodeId: this.curNode.getAttrs().historyId
            })
            // 应用到整体设计元素
            const designObj = linkageDesign(this.productData, this.viewId, this.curNode)
            for(let vid in designObj){
              if(vid != this.viewId){
                const item = designObj[vid][0];
                  let percent = {
                    width: (clipData.pathAttrs.width * clipData.pathAttrs.scaleX) / (clipData.imgAttrs.width * clipData.imgAttrs.scaleX),
                    height: (clipData.pathAttrs.height * clipData.pathAttrs.scaleY) / (clipData.imgAttrs.height * clipData.imgAttrs.scaleY)
                  }
                  let nodeWidth = item.node.width() * item.node.scaleX() / percent.width;
                  let nodeHeight = item.node.height() * item.node.scaleY() / percent.height;
                  let scaleRatioX = nodeWidth / originNodeWidth;
                  let scaleRatioY = nodeHeight / originNodeHeight;
                  let pathCenterPoint = this.m_clip_getPathCenterPoint(item.node, clipData);
                  item.node.image(clipedImg);
                  item.node.setAttrs({
                    flipImgUrl: src,
                    offsetX: item.node.width()/2,
                    offsetY: item.node.height()/2,
                    scaleX: this.curNode.scaleX() / scaleRatioX,
                    scaleY: this.curNode.scaleY() / scaleRatioY,
                    x: pathCenterPoint.x,
                    y: pathCenterPoint.y,
                    isclip: true,
                    clipData
                  })
                  item.layer.batchDraw()
                  this.cloneStage({viewId: item.id});
                  this.addHistory('图片裁切', item.id, {
                    nodeId: item.node.getAttrs().historyId
                  })
              }
            }
          }
          resolve();
        } else {
          this.m_clip_imgClipCancel();
        }
        this.m_clip_releaseClipEvent(this.curNode);
      })
    },
    // 取消裁切
    async m_clip_imgClipCancel({isEmpty=false} = {}){
      if(!isEmpty){
        let lastClip = this.curNode.getAttrs().isclip;
        let lastClipStatus = this.m_clip_isCliping;
        this.m_clip_isCliping = false;
        this.m_clip_clipLayer && this.m_clip_clipLayer.destroy();
        this.m_clip_changeClipImgStatus(this.curNode, false);
        this.curNode.zIndex(this.clipZIndex);
        this.curNode.setAttrs({isclip: false, clipData: null})
        this.curNode.fire('click')
        this.cloneStage({viewId: this.viewId})
        if(lastClip && lastClipStatus){
          this.addHistory('取消图片裁切', this.viewId, {
            nodeId: this.curNode.getAttrs().historyId
          })
          // 取消整体设计联动元素裁切效果
          const designObj = linkageDesign(this.productData, this.viewId, this.curNode)
          for(let vid in designObj){
            if(vid != this.viewId){
              const item = designObj[vid][0];
              let nodeAttrs = JSON.parse(JSON.stringify(item.node.getAttrs()));
              await this.m_clip_restoreOriginImg(nodeAttrs, item.node);
              item.node.setAttrs({isclip: false, clipData:null});
              item.layer.batchDraw()
              this.cloneStage({viewId: item.id});
              this.addHistory('取消图片裁切', item.id, {
                nodeId: item.node.getAttrs().historyId
              })
            }
          }
        }
      } else {
        this.m_clip_isCliping = false;
        this.$store.commit('clip/updateIsShowClip', false);
        this.m_clip_clipLayer && this.m_clip_clipLayer.destroy();
      }
    },
    // 改变裁切路径
    async m_clip_changeClipPath(path){
      path = path || this.$store.state.clip.clipData;
      this.clipZIndex = this.curNode.zIndex();
      if (path && path.code) {
        this.curNode.moveToTop();
        this.m_clip_isCliping = true;
        await this.m_clip_initClipLayer({
          stage: stageObj[`stage${this.viewId}`], 
          node: this.curNode, 
          pathData: path
        });
        this.m_clip_initClipEvent(this.curNode);
        this.cloneStage({viewId: this.viewId})
      } else {
        this.m_clip_imgClipCancel();
      }
    },
    // 计算裁切图层中图片和路径组合的中心点
    m_clip_getGroupCenterPoint(image) {
      let path = this.m_clip_clipLayer.findOne(".clipRect");
      let imgPoints = getNodePointAfterRotate({
        node: image,
        centerPoint: { x: image.x(), y: image.y() },
        rotate: image.rotation(),
      });
      let pathPoints = getNodePointAfterRotate({
        node: path,
        centerPoint: { x: path.x(), y: path.y() },
        rotate: image.rotation(),
      });
      let minX = Math.min(
        imgPoints.p1.x,
        imgPoints.p2.x,
        imgPoints.p3.x,
        imgPoints.p4.x,
        pathPoints.p1.x,
        pathPoints.p2.x,
        pathPoints.p3.x,
        pathPoints.p4.x
      );
      let maxX = Math.max(
        imgPoints.p1.x,
        imgPoints.p2.x,
        imgPoints.p3.x,
        imgPoints.p4.x,
        pathPoints.p1.x,
        pathPoints.p2.x,
        pathPoints.p3.x,
        pathPoints.p4.x
      );
      let minY = Math.min(
        imgPoints.p1.y,
        imgPoints.p2.y,
        imgPoints.p3.y,
        imgPoints.p4.y,
        pathPoints.p1.y,
        pathPoints.p2.y,
        pathPoints.p3.y,
        pathPoints.p4.y
      );
      let maxY = Math.max(
        imgPoints.p1.y,
        imgPoints.p2.y,
        imgPoints.p3.y,
        imgPoints.p4.y,
        pathPoints.p1.y,
        pathPoints.p2.y,
        pathPoints.p3.y,
        pathPoints.p4.y
      );
      return {
        x: parseFloat((minX + (maxX - minX) / 2).toFixed(3)),
        y: parseFloat((minY + (maxY - minY) / 2).toFixed(3)),
      };
    },
    // 计算裁切图层中图片和路径转化为未旋转状态后的坐标位置
    m_clip_convertGroupNoRotate(image) {
      let path = this.m_clip_clipLayer.findOne(".clipRect");
      let centerPoint = this.m_clip_getGroupCenterPoint(image);
      let imgPoints = getNodePointAfterRotate({
        node: image,
        centerPoint: { x: image.x(), y: image.y() },
        rotate: image.rotation(),
      });
      let pathPoints = getNodePointAfterRotate({
        node: path,
        centerPoint: { x: path.x(), y: path.y() },
        rotate: image.rotation(),
      });

      let imgPointsNoRotate = {
        p1: getPointAfterRotate({
          nodePoint: imgPoints.p1,
          centerPoint,
          rotate: -image.rotation(),
        }),
        p2: getPointAfterRotate({
          nodePoint: imgPoints.p2,
          centerPoint,
          rotate: -image.rotation(),
        }),
        p3: getPointAfterRotate({
          nodePoint: imgPoints.p3,
          centerPoint,
          rotate: -image.rotation(),
        }),
        p4: getPointAfterRotate({
          nodePoint: imgPoints.p4,
          centerPoint,
          rotate: -image.rotation(),
        }),
        width: imgPoints.width,
        height: imgPoints.height,
      };
      let pathPointsNoRotate = {
        p1: getPointAfterRotate({
          nodePoint: pathPoints.p1,
          centerPoint,
          rotate: -image.rotation(),
        }),
        p2: getPointAfterRotate({
          nodePoint: pathPoints.p2,
          centerPoint,
          rotate: -image.rotation(),
        }),
        p3: getPointAfterRotate({
          nodePoint: pathPoints.p3,
          centerPoint,
          rotate: -image.rotation(),
        }),
        p4: getPointAfterRotate({
          nodePoint: pathPoints.p4,
          centerPoint,
          rotate: -image.rotation(),
        }),
        width: pathPoints.width,
        height: pathPoints.height,
      };
      return { centerPoint, imgPointsNoRotate, pathPointsNoRotate };
    },
    // 计算裁切区域左边距和上边距与图片的距离比例
    m_clip_getClipPercent(clipData) {
      let { imgAttrs, pathAttrs } = clipData;
      // let pathPos = {
      //   left: pathAttrs.x - pathAttrs.width * pathAttrs.scaleX/2,
      //   top: pathAttrs.y - pathAttrs.height * pathAttrs.scaleY/2
      // }
      // let imgPos = {
      //   left: imgAttrs.x - imgAttrs.width * imgAttrs.scaleX/2,
      //   top: imgAttrs.y - imgAttrs.height * imgAttrs.scaleY/2
      // }
      // return {
      //   left: parseFloat(Math.abs(pathPos.left - imgPos.left).toFixed(3)) / (imgAttrs.width * imgAttrs.scaleX),
      //   top: parseFloat(Math.abs(pathPos.top - imgPos.top).toFixed(3)) / (imgAttrs.height * imgAttrs.scaleY)
      // }
      return {
        left: pathAttrs.x / (imgAttrs.width * imgAttrs.scaleX),
        top: pathAttrs.y / (imgAttrs.height * imgAttrs.scaleY),
      };
    },
    // 获取裁切图片
    m_clip_getClipImage(clipData) {
      return new Promise(async (resolve, reject) => {
        let { imgAttrs, pathAttrs, clipPath } = clipData;
        let [image] = await loadImgs([imgAttrs.originImg]);
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext("2d");
        ctx.save();
        ctx.drawImage(image, 0, 0, image.width, image.height);
        ctx.restore();
        ctx.globalCompositeOperation = "destination-in";

        let pathUrl = clipPath.image;
        if(pathAttrs.xFlip || pathAttrs.yFlip){
          pathUrl = await this.m_clip_getFlipPath(clipPath.image, pathAttrs.xFlip, pathAttrs.yFlip)
        }
        const [pathImg] = await loadImgs([pathUrl])
        let percent = this.m_clip_getClipPercent(clipData);
        let left = percent.left * image.width;
        let top = percent.top * image.height;
        let pathWidth =
          ((pathAttrs.width * pathAttrs.scaleX) /
            (imgAttrs.width * imgAttrs.scaleX)) *
          image.width;
        let pathHeight =
          ((pathAttrs.height * pathAttrs.scaleY) /
            (imgAttrs.height * imgAttrs.scaleY)) *
          image.height;
        // if (pathAttrs.isFlip) {
        //   ctx.translate(left + pathWidth / 2, top + pathHeight / 2);
        //   ctx.rotate((180 * Math.PI) / 180);
        //   ctx.translate(-(left + pathWidth / 2), -(top + pathHeight / 2));
        // }
        ctx.drawImage(pathImg, left, top, pathWidth, pathHeight);

        const oImgData = ctx.getImageData(
          left,
          top,
          left + pathWidth,
          top + pathHeight
        );
        const oCanvas = document.createElement("canvas");
        oCanvas.width = pathWidth;
        oCanvas.height = pathHeight;
        const oCtx = oCanvas.getContext("2d");
        oCtx.putImageData(oImgData, 0, 0);
        const url = oCanvas.toDataURL();
        resolve(url);
      });
    },
    // 获取翻转路径图片
    async m_clip_getFlipPath(pathUrl, xFlip=false, yFlip=false){
      const [pathImg] = await loadImgs([pathUrl]);
      const canvas = document.createElement('canvas');
      canvas.width = pathImg.width;
      canvas.height = pathImg.height;
      const ctx = canvas.getContext("2d");
      const left = xFlip ? -pathImg.width : 0;
      const top = yFlip ? -pathImg.height : 0;
      ctx.scale(xFlip ? -1 : 1, yFlip ? -1 : 1)
      ctx.drawImage(pathImg, left, top, canvas.width, canvas.height);
      return canvas.toDataURL();
    },
    // 获取裁切图片【方式2, 只适用于存在clipLayer的情况, 废弃】
    m_clip_getClipImage2() {
      let clipLayer = this.m_clip_clipLayer.clone();
      clipLayer.findOne("Transformer").destroy();
      let image = clipLayer.findOne("Image");
      let path = clipLayer.findOne(".clipRect");
      let centerPoint = { x: image.x(), y: image.y() };
      let pathCenterNoRotate = getPointAfterRotate({
        nodePoint: { x: path.x(), y: path.y() },
        centerPoint,
        rotate: -path.rotation(),
      });
      path.setAttrs({ x: pathCenterNoRotate.x, y: pathCenterNoRotate.y });
      image.rotation(0);
      path.rotation(0);
      let { x, y, width, height } = path.getClientRect();
      // 裁切的像素以原图的像素为基准，实际裁多少导出多少避免对裁切图片操作进行操作模糊
      let exportWidth =
        ((path.width() * path.scaleX()) / (image.width() * image.scaleX())) *
        image.width();
      let pixelRatio = exportWidth / width;
      let src = clipLayer.toDataURL({
        x,
        y,
        width,
        height,
        quality: 1,
        pixelRatio,
      });
      clipLayer.destroy();
      return src;
    },
    // 获取裁切保存参数
    m_clip_getClipData(node) {
      let path = this.m_clip_clipLayer.findOne(".clipRect");
      let _imgAttrs = JSON.parse(JSON.stringify(node.getAttrs()));
      let _pathAttrs = JSON.parse(JSON.stringify(path.getAttrs()));
      let imgAttrs = {
        width: node.width(),
        height: node.height(),
        x: _imgAttrs.x,
        y: _imgAttrs.y,
        scaleX: _imgAttrs.scaleX,
        scaleY: _imgAttrs.scaleY,
        originImg: _imgAttrs.flipImgUrl,
      };
      let pathCenterNoRotate = getPointAfterRotate({
        nodePoint: { x: _pathAttrs.x, y: _pathAttrs.y },
        rotate: -_imgAttrs.rotation || 0,
        centerPoint: { x: imgAttrs.x, y: imgAttrs.y },
      });
      let pathAttrs = {
        width: _pathAttrs.width,
        height: _pathAttrs.height,
        x: pathCenterNoRotate.x,
        y: pathCenterNoRotate.y,
        scaleX: _pathAttrs.scaleX,
        scaleY: _pathAttrs.scaleY,
        // 路径的翻转保持跟原图一致
        xFlip: !!_imgAttrs.xFlip,
        yFlip: !!_imgAttrs.yFlip
      };
      let clipPath = this.$store.state.clip.clipData;
      // 将x,y转化为左上角的位置
      let changeX = (imgAttrs.width * imgAttrs.scaleX) / 2 - imgAttrs.x;
      let changeY = (imgAttrs.height * imgAttrs.scaleY) / 2 - imgAttrs.y;
      let pathX = pathAttrs.x + changeX;
      let pathY = pathAttrs.y + changeY;
      imgAttrs.x = 0;
      imgAttrs.y = 0;
      pathAttrs.x = Math.abs((pathX - (pathAttrs.width * pathAttrs.scaleX) / 2).toFixed(3));
      pathAttrs.y = Math.abs((pathY - (pathAttrs.height * pathAttrs.scaleY) / 2).toFixed(3));
      let clipData = { clipPath, imgAttrs, pathAttrs };
      return clipData;
    },
    // 根据路径位置获取图片的中心点
    m_clip_getOriginImgCenterPoint(curNodeAttrs){
      let {imgAttrs, pathAttrs} = curNodeAttrs.clipData;
      let percent = this.m_clip_getClipPercent(curNodeAttrs.clipData);
      // 假设原图的中心点坐标在原点位置(0,0), 计算出路径的中心
      let newPathWidth = curNodeAttrs.offsetX * 2 * curNodeAttrs.scaleX;
      let newPathHeight = curNodeAttrs.offsetY * 2 * curNodeAttrs.scaleY;
      let newImgWidth = newPathWidth * ((imgAttrs.width * imgAttrs.scaleX) / (pathAttrs.width * pathAttrs.scaleX));
      let newImgHeight = newPathHeight * ((imgAttrs.height * imgAttrs.scaleY) / (pathAttrs.height * pathAttrs.scaleY));
      let pathCenterPoint = {
        x: -newImgWidth/2 + percent.left * newImgWidth + newPathWidth/2,
        y: -newImgHeight/2 + percent.top * newImgHeight + newPathHeight/2
      }
      let pathCenterPointRotate = getPointAfterRotate({
        nodePoint: {x: pathCenterPoint.x, y: pathCenterPoint.y},
        centerPoint: {x: 0, y: 0},
        rotate: curNodeAttrs.rotation,
      });
      return {
        x: curNodeAttrs.x - pathCenterPointRotate.x,
        y: curNodeAttrs.y - pathCenterPointRotate.y
      }
    },
    // 根据图片位置和裁切数据获取裁切后的路径中心点
    m_clip_getPathCenterPoint(node, clipData){
      let {imgAttrs, pathAttrs} = clipData
      let changeX = node.x() - imgAttrs.width * imgAttrs.scaleX / 2;
      let changeY = node.y() - imgAttrs.height * imgAttrs.scaleY / 2;
      let pathX = pathAttrs.x + changeX + pathAttrs.width * pathAttrs.scaleX / 2;
      let pathY = pathAttrs.y + changeY + pathAttrs.height * pathAttrs.scaleY / 2;
      let pathCenterPoint = getPointAfterRotate({
        nodePoint: {x: pathX, y: pathY},
        centerPoint: {x: node.x(), y: node.y()},
        rotate: node.rotation()
      })
      return pathCenterPoint
    },
    // 图片翻转更新裁切区域位置
    m_clip_updateClipData(node, type){
      let nodeAttrs = JSON.parse(JSON.stringify(node.getAttrs()));
      let clipData = nodeAttrs.clipData;
      let {imgAttrs, pathAttrs} = clipData;
      let percent = this.m_clip_getClipPercent(clipData)
      if(type == 'leftRightMirror'){
        let left = percent.left * imgAttrs.width * imgAttrs.scaleX;
        clipData.pathAttrs.x = imgAttrs.width * imgAttrs.scaleX - pathAttrs.width * pathAttrs.scaleX - left;
        clipData.pathAttrs.xFlip = !clipData.pathAttrs.xFlip;
      } else if(type == 'upDownMirror'){
        let top = percent.top * imgAttrs.height * imgAttrs.scaleY;
        clipData.pathAttrs.y = imgAttrs.height * imgAttrs.scaleY - pathAttrs.height * pathAttrs.scaleY - top;
        clipData.pathAttrs.yFlip = !clipData.pathAttrs.yFlip;
      }
      return clipData
    },
    // 初始化裁切图层
    m_clip_initClipLayer({node, pathData}){
      return new Promise(async (resolve, reject) => {
        let stage = stageObj[`stage${this.viewId}`];
        let nodeAttrs = JSON.parse(JSON.stringify(node.getAttrs()));
        let designLayer = stage.findOne(".designLayer");
        let designContainerGroup = stage.findOne(".designContainerGroup");
        let clipLayer = stage.findOne(".clipLayer");
        if (clipLayer) clipLayer.destroy();
        this.m_clip_clipLayer = new Konva.Layer({
          name: "clipLayer",
          x: designLayer.x(),
          y: designLayer.y(),
          scaleX: designLayer.scaleX(),
          scaleY: designLayer.scaleY(),
        });
        let clipGroup = new Konva.Group({
          name: "clipGroup",
          x: designContainerGroup.x(),
          y: designContainerGroup.y(),
        });
        this.m_clip_clipLayer.add(clipGroup);
        stage.add(this.m_clip_clipLayer);
        // 如果操作的是裁剪过的图片，先还原原图的位置
        if(nodeAttrs.isclip && this.$store.state.clip.isPathChange.init) await this.m_clip_restoreOriginImg(nodeAttrs, node);
        this.m_clip_cloneClipImg(node)
        this.m_clip_changeClipImgStatus(node, true)
        await this.m_clip_addPath(pathData, nodeAttrs)
        resolve();
      })
    },
    // 还原裁切图片到原图
    m_clip_restoreOriginImg(curNodeAttrs, node){
      return new Promise((resolve, reject) => {
        let {imgAttrs, pathAttrs} = curNodeAttrs.clipData;
        let imgCenterPoint = this.m_clip_getOriginImgCenterPoint(curNodeAttrs)
        let originImg = new Image();
        originImg.src = imgAttrs.originImg;
        originImg.crossOrigin = 'Anonymous';
        originImg.onload = () => {
          node.image(originImg);
          let changeScaleX = (curNodeAttrs.offsetX * 2 * curNodeAttrs.scaleX) / (pathAttrs.width * pathAttrs.scaleX);
          let changeScaleY = (curNodeAttrs.offsetY * 2 * curNodeAttrs.scaleY) / (pathAttrs.height * pathAttrs.scaleY);
          node.setAttrs({
            flipImgUrl: imgAttrs.originImg,
            offsetX: node.width()/2,
            offsetY: node.height()/2,
            x: imgCenterPoint.x,
            y: imgCenterPoint.y,
            scaleX: imgAttrs.scaleX * changeScaleX,
            scaleY: imgAttrs.scaleY * changeScaleY
          })
          resolve();
        }
      });
    },
    // 复制图片到裁剪图层
    m_clip_cloneClipImg(node){
      let clipImg = this.m_clip_clipLayer.findOne("Image");
      if (clipImg) clipImg.destroy();
      let imgClone = node.clone();
      imgClone.cache();
      imgClone.filters([Konva.Filters.Contrast]);
      imgClone.contrast(0);
      imgClone.listening(false);
      imgClone.draggable(false);
      let clipGroup = this.m_clip_clipLayer.findOne('.clipGroup');
      clipGroup.add(imgClone);
      this.m_clip_clipLayer.batchDraw();
    },
    // 改变图片的滤镜效果
    m_clip_changeClipImgStatus(node, isCliping){
      const [stage, layer] = [node.getStage(), node.getLayer()];
      node.cache();
      node.filters([Konva.Filters.Contrast]);
      node.contrast(isCliping ? -50 : 0);
      if (isCliping) {
        node.addName("clipingImg");
        layer.find('Transformer').setAttrs({ rotateEnabled: false })
        layer.find('.anchorDelete').hide();
        layer.find('.anchorRotate').hide();
      } else {
        node.removeName("clipingImg");
        layer.find('Transformer').setAttrs({ rotateEnabled: true })
        layer.find('.anchorDelete').show();
        layer.find('.anchorRotate').show();
        node.clearCache();
      }
      layer.batchDraw();
    },
    // 添加裁切路径
    m_clip_addPath(pathData, curNodeAttrs){
      return new Promise(async (resolve, reject) => {
        let clipGroup = this.m_clip_clipLayer.findOne('.clipGroup');
        let image = this.m_clip_clipLayer.findOne("Image");
        let pathUrl = pathData.image;
        // 根据原图的翻转获取对应的翻转过后的路径地址
        if(curNodeAttrs.xFlip || curNodeAttrs.yFlip){
          pathUrl = await this.m_clip_getFlipPath(pathData.image, !!curNodeAttrs.xFlip, !!curNodeAttrs.yFlip);
        }
        const [pathImg] = await loadImgs([pathUrl]);
        let rotation = image.rotation();
        let path = new Konva.Rect({
          width: pathImg.width,
          height: pathImg.height,
          offsetX: pathImg.width / 2,
          offsetY: pathImg.height / 2,
          rotation,
          fillPatternImage: pathImg,
          fillPatternRepeat: "no-repeat",
          name: "clipRect",
        });
        // 初始化裁剪形状的大小和位置。如果操作的是裁剪过的图片，还原裁剪的位置，否则裁图片的最大化区域
        if(curNodeAttrs.isclip && this.$store.state.clip.isPathChange.init){
          let {pathAttrs} = curNodeAttrs.clipData;
          path.x(curNodeAttrs.x);
          path.y(curNodeAttrs.y);
          path.scaleX(curNodeAttrs.offsetX*2*curNodeAttrs.scaleX/pathAttrs.width);
          path.scaleY(curNodeAttrs.offsetY*2*curNodeAttrs.scaleY/pathAttrs.height);
        } else {
          let imageWidth = image.width() * image.scaleX();
          let imageHeight = image.height() * image.scaleY();
          let scale = Math.min(imageWidth / pathImg.width, imageHeight / pathImg.height);
          path.x(image.x());
          path.y(image.y());
          path.scaleX(scale);
          path.scaleY(scale);
        }
        clipGroup.add(path);
        path.globalCompositeOperation("destination-in");
        path.listening(false);
        // 添加缩放操作
        let tr = new Konva.Transformer({
          name: "clipTransformer",
          borderStroke: "#0453F3",       
          borderStrokeWidth: 2,
          borderDash: [2, 2],
          ignoreStroke: true,
          rotateEnabled: false,
          enabledAnchors: [
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right",
            "top-center",
            "middle-left",
            "middle-right",
            "bottom-center",
          ],
          anchorSize: 12,
          anchorCornerRadius: 12,
          anchorStroke: "#ADB8BF",
          // anchorFill: "#ADB8BF",
          boundBoxFunc: (oldBox, newBox) => {
            if (newBox.width < 20 || newBox.height < 20) {
              return oldBox;
            }
            return newBox;
          },
        });
        tr.listening(true);
        tr.nodes([path]);
        this.m_clip_clipLayer.add(tr);
        this.m_clip_clipLayer.batchDraw();
        resolve();
      });
    },
    // 原图替换成裁切图, 用于操作过程中效果图更新
    m_clip_replaceClipImage(originImg){
      return new Promise(async (resolve, reject) => {
        let clipData = this.m_clip_getClipData(this.curNode);
        let src = await this.m_clip_getClipImage(clipData);
        let pathAttrs = this.m_clip_clipLayer.findOne('.clipRect').getAttrs();
        let clipedImg = new Image();
        clipedImg.src = src;
        clipedImg.onload = function(){
          originImg.image(clipedImg);
          originImg.setAttrs({
            flipImgUrl: src,
            width: pathAttrs.width,
            height: pathAttrs.height,
            x: pathAttrs.x,
            y: pathAttrs.y,
            offsetX: pathAttrs.offsetX,
            offsetY: pathAttrs.offsetY,
            scaleX: pathAttrs.scaleX,
            scaleY: pathAttrs.scaleY,
          });
          resolve({src, pathAttrs});
        }
      })
    },
    // 裁切过程相关事件
    m_clip_initClipEvent(node){
      this.m_clip_clipEventChange = false;
      const stage = node.getStage();
      const designLayer = stage.findOne('.designLayer');
      let image = node;
      let imgTransformer = designLayer.findOne("Transformer");
      let imageClone = this.m_clip_clipLayer.findOne("Image");
      let path = this.m_clip_clipLayer.findOne(".clipRect");
      let pathTransformer = this.m_clip_clipLayer.findOne("Transformer");
      let transformStart;
      // 图片移动范围限制 start
      image.off("dragmove.clip");
      image.on("dragmove.clip", (e) => {
        this.m_clip_correctClipOriginImg(e, image)
      });
      image.off("dragend.clip");
      image.on("dragend.clip", (e) => {
        this.m_clip_correctClipOriginImg(e, image)
        this.m_clip_clipEventChange = true;
        this.cloneStage({ viewId: this.viewId })
      });
      image.dragBoundFunc((pos) => {
        if (this.m_clip_isCliping) {
          this.m_clip_imageTemp = image.clone();
          return pos;
        }
        return pos
      });
      // 图片移动范围限制 end
      // 图片缩放范围限制 start
      image.off("transformstart.clip");
      image.on("transformstart.clip", (e) => {
        if(this.m_clip_isCliping){
          let {imgPointsNoRotate, pathPointsNoRotate} = this.m_clip_convertGroupNoRotate(image)
          let eventPointNoRotate = getPointAfterRotate({
            nodePoint: {x: e.evt.x || e.evt.evt.x, y: e.evt.y || e.evt.evt.y},
            centerPoint: {x: path.x(), y: path.y()},
            rotate: -image.rotation()
          })
          transformStart = { imgPointsNoRotate, pathPointsNoRotate, eventPointNoRotate }
        }
      })
      image.off("transform.clip");
      image.on("transform.clip", (e) => {
        if(this.m_clip_isCliping){
          let {imgPointsNoRotate, pathPointsNoRotate} = this.m_clip_convertGroupNoRotate(image)
          let eventPointNoRotate = getPointAfterRotate({
            nodePoint: {x: e.evt.x, y: e.evt.y},
            centerPoint: {x: path.x(), y: path.y()},
            rotate: -image.rotation(),
          })
          if(
            (
              imgPointsNoRotate.p1.x >= pathPointsNoRotate.p1.x &&
              imgPointsNoRotate.width < transformStart.imgPointsNoRotate.width &&
              eventPointNoRotate.x >= transformStart.eventPointNoRotate.x
            ) ||
            (
              imgPointsNoRotate.p2.x <= pathPointsNoRotate.p2.x &&
              imgPointsNoRotate.width < transformStart.imgPointsNoRotate.width &&
              eventPointNoRotate.x <= transformStart.eventPointNoRotate.x
            ) ||
            (
              imgPointsNoRotate.p1.y >= pathPointsNoRotate.p1.y &&
              imgPointsNoRotate.height < transformStart.imgPointsNoRotate.height &&
              eventPointNoRotate.y >= transformStart.eventPointNoRotate.y
            ) || 
            (
              imgPointsNoRotate.p4.y <= pathPointsNoRotate.p4.y &&
              imgPointsNoRotate.height < transformStart.imgPointsNoRotate.height &&
              eventPointNoRotate.y <= transformStart.eventPointNoRotate.y
            )
          ){
            e.target.scaleX(this.m_clip_imageTemp.scaleX())
            e.target.scaleY(this.m_clip_imageTemp.scaleY())
            e.target.x(this.m_clip_imageTemp.x())
            e.target.y(this.m_clip_imageTemp.y())
          }
          // 图片缩放时,裁剪图层的图片保持一致
          imageClone.x(e.target.x());
          imageClone.y(e.target.y());
          imageClone.scaleX(e.target.scaleX());
          imageClone.scaleY(e.target.scaleY());
          this.m_clip_clipLayer.batchDraw();
        }
      });
      image.off("transformend.clip");
      image.on("transformend.clip", (e) => {
        pathTransformer.listening(true)
        this.m_clip_clipEventChange = true;
        this.cloneStage({ viewId: this.viewId })
      });
      // imgTransformer.boundBoxFunc((oldBoundBox, newBoundBox) => {
      //   if (this.m_clip_isCliping) {    
      //     this.m_clip_imageTemp = image.clone();
      //     return newBoundBox;     
      //   }
      //   return newBoundBox;
      // });
      // 图片缩放范围限制 end
      // 路径缩放范围限制 start
      path.off("transformstart.clip");
      path.on("transformstart.clip", (e) => {
        if(this.m_clip_isCliping){
          let {imgPointsNoRotate, pathPointsNoRotate} = this.m_clip_convertGroupNoRotate(image)
          let eventPointNoRotate = getPointAfterRotate({
            nodePoint: {x: e.evt.x || e.evt.evt.x, y: e.evt.y || e.evt.evt.y},
            centerPoint: {x: image.x(), y: image.y()},
            rotate: -image.rotation(),
          })
          transformStart = { imgPointsNoRotate, pathPointsNoRotate, eventPointNoRotate }
        }
      })
      path.off("transform.clip");
      path.on("transform.clip", (e) => {
        if(this.m_clip_isCliping){
          let {imgPointsNoRotate, pathPointsNoRotate} = this.m_clip_convertGroupNoRotate(image)
          let eventPointNoRotate = getPointAfterRotate({
            nodePoint: {x: e.evt.x, y: e.evt.y},
            centerPoint: {x: image.x(), y: image.y()},
            rotate: -image.rotation(),
          })
          if(
              (
                imgPointsNoRotate.p1.x >= pathPointsNoRotate.p1.x &&
                pathPointsNoRotate.width > transformStart.pathPointsNoRotate.width &&
                eventPointNoRotate.x <= transformStart.eventPointNoRotate.x
              ) ||
              (
                imgPointsNoRotate.p2.x <= pathPointsNoRotate.p2.x &&
                pathPointsNoRotate.width > transformStart.pathPointsNoRotate.width &&
                eventPointNoRotate.x >= transformStart.eventPointNoRotate.x
              ) ||
              (
                imgPointsNoRotate.p1.y >= pathPointsNoRotate.p1.y &&
                pathPointsNoRotate.height > transformStart.pathPointsNoRotate.height &&
                eventPointNoRotate.y <= transformStart.eventPointNoRotate.y
              ) || 
              (
                imgPointsNoRotate.p4.y <= pathPointsNoRotate.p4.y &&
                pathPointsNoRotate.height > transformStart.pathPointsNoRotate.height &&
                eventPointNoRotate.y >= transformStart.eventPointNoRotate.y
              )
          ){
            e.target.scaleX(this.m_clip_pathTemp.scaleX())
            e.target.scaleY(this.m_clip_pathTemp.scaleY())
            e.target.x(this.m_clip_pathTemp.x())
            e.target.y(this.m_clip_pathTemp.y())
          }
        }
      })
      path.off("transformend.clip");
      path.on("transformend.clip", (e) => {
        this.m_clip_clipEventChange = true;
        this.cloneStage({ viewId: this.viewId })
      });
      pathTransformer.boundBoxFunc((oldBoundBox, newBoundBox) => {
        if (this.m_clip_isCliping) {
          this.m_clip_pathTemp = path.clone();
          return newBoundBox
        }
        return newBoundBox;
      });
      // 路径缩放范围限制 end
    },
    // 限制裁切图片的拖动时的范围
    m_clip_correctClipOriginImg(e, image){
      if(this.m_clip_isCliping) {
        let imageClone = this.m_clip_clipLayer.findOne('Image')
        let path = this.m_clip_clipLayer.findOne('.clipRect')
        let imgWidth = image.width() * image.scaleX(), imgHeight = image.height() * image.scaleY();
        let {centerPoint, imgPointsNoRotate, pathPointsNoRotate} = this.m_clip_convertGroupNoRotate(image)
        let correctX = e.target.x(), correctY = e.target.y();
        let isChange = false;
        if(imgPointsNoRotate.p1.x > pathPointsNoRotate.p1.x) {
          isChange = true;
          correctX = pathPointsNoRotate.p1.x + imgWidth/2;
        }
        if(imgPointsNoRotate.p2.x < pathPointsNoRotate.p2.x){
          isChange = true;
          correctX = pathPointsNoRotate.p2.x - imgWidth/2;
        }
        if(imgPointsNoRotate.p1.y > pathPointsNoRotate.p1.y){
          isChange = true;
          correctY = pathPointsNoRotate.p1.y + imgHeight/2;
        }
        if(imgPointsNoRotate.p4.y < pathPointsNoRotate.p4.y){
          isChange = true;
          correctY = pathPointsNoRotate.p4.y - imgHeight/2;
        }
        if(isChange){
          const endPos = getPointAfterRotate({
            nodePoint: {x: correctX, y: correctY}, 
            centerPoint, 
            rotate: image.rotation()
          })
          e.target.x(endPos.x)
          e.target.y(endPos.y)
          e.target.getLayer().batchDraw();
        }
        // 图片移动时,裁剪图层的图片保持一致
        imageClone.x(e.target.x());
        imageClone.y(e.target.y());
        this.m_clip_clipLayer.batchDraw();
      }
    },
    // 释放裁切相关事件
    m_clip_releaseClipEvent(node){
      node.off("dragmove.clip");
      node.off("dragend.clip");
      node.off("transformstart.clip");
      node.off("transform.clip");
      node.off("transformend.clip");
      this.m_clip_imageTemp = null;
      this.m_clip_pathTemp = null;
    },
    m_clip_infoDetect(nv, ov){
      let stage = stageObj[`stage${this.viewId}`];
      // 裁切过程冻结撤销重做操作
      this.$store.commit('updateHistoryFreeze', nv);
      this.$store.commit('clip/updateClipStatus', nv);
      if(nv){
        // 裁切过程不显示位置操作弹窗
        this.$store.commit('layout/changePositionOptStatus', false);
        stage.findOne('.overspreadPath') && stage.findOne('.overspreadPath').destroy();
        let remindEle = document.querySelector(".spaceRemind");
        if(remindEle) remindEle.style.display = "none";
      }
    }
  },
  watch: {
    '$store.state.clip.isPathChange.status': {
      handler: function(nv, ov){
        this.m_clip_changeClipPath();
      }
    },
    '$store.state.clip.isClipSave': {
      handler: function(nv, ov) {
        this.m_clip_imgClipSave();
      }
    },
    'm_clip_isCliping': function(nv, ov){
      this.m_clip_infoDetect(nv, ov)
    }
  }
};
