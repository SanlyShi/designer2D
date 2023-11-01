<template>
  <div id="designer">
    <div class="designer-body">
      <div class="view-box" id="viewBox">
        <div class="view-item active" id="view1">A面</div>
        <div class="path-select">
          <div
            class="path-item"
            @click="startClip('M256 136l120-87.8-16.1 147.8 136.1 60-136.1 60 16.1 147.8-120-87.8-120 87.8 16.1-147.8-136.1-60 136.1-60-16.1-147.8z')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              enable-background="new 0 0 512 512"
            >
              <path
                d="M256 136l120-87.8-16.1 147.8 136.1 60-136.1 60 16.1 147.8-120-87.8-120 87.8 16.1-147.8-136.1-60 136.1-60-16.1-147.8z"
              />
            </svg>
          </div>
        </div>
        <button @click="saveClip">应用</button>
        <button @click="cancelClip">取消</button>
      </div>
      <div class="stage-box" id="stageBox">
        <div :style="{width: stageSize+'px', height: stageSize+'px'}">
          <div class="stage-item" id="stage1" v-show="viewId==1"></div>
        </div>
      </div>
    </div>
    <div class="designer-footer">
      <div>印刷品质</div>
      <div>
        <p>男款短袖标准T恤</p>
        <a>胸前定制区域</a>
      </div>
      <div>放大器</div>
    </div>
  </div>
</template>

<script>
import Konva from "@/utils/konva7.2.1";
const imgSrc = require("@/assets/img/test/car.jpg");
export default {
  data() {
    return {
      stageSize: 500,
      stage: null,
      layer: null,
      viewId: 1,
      isCliping: false,
      clipLayer: null
    };
  },
  methods: {
    calcStageSize() {
      let $box = document.querySelector("#stageBox");
      let { width, height } = $box.getBoundingClientRect();
      // console.log("boxSize => ", width, height);
      this.stageSize = Math.min(width, height);
    },
    initCanvasByView(viewId) {
      let self = this;
      var stage = new Konva.Stage({
        container: "stage" + viewId,
        width: self.stageSize,
        height: self.stageSize
      });
      var layer = new Konva.Layer();
      stage.add(layer);

      this.stage = stage;
      this.layer = layer;
      this.addImage();
    },
    addImage() {
      let self = this;
      Konva.Image.fromURL(imgSrc, function(image) {
        image.x(image.width() / 2 + 100);
        image.y(image.height() / 2 + 200);
        image.offsetX(image.width() / 2);
        image.offsetY(image.height() / 2);
        image.draggable(true);
        self.layer.add(image);
        self.layer.draw();
        image.on("click tap", function(e) {
          image.removeName("clipingImg");
          image.addName("clipingImg");
          if (self.stage.find(".imgTransformer")) {
            self.stage.find(".imgTransformer").destroy();
          }
          let tr = new Konva.Transformer({
            name: "imgTransformer",
            rotateAnchorOffset: 30,
            enabledAnchors: [
              "top-left",
              "top-right",
              "bottom-left",
              "bottom-right"
            ]
          });
          self.layer.add(tr);
          tr.attachTo(image);
        });
      });
    },
    initClipLayer() {
      if (this.clipLayer) {
        this.clipLayer.destroy();
      }
      let clipLayer = new Konva.Layer({
        name: "clipLayer",
        x: 0,
        y: 0
      });
      this.stage.add(clipLayer);
      this.clipLayer = clipLayer;
      this.cloneClipImg();
    },
    cloneClipImg() {
      let clipImg = this.clipLayer.findOne("Image");
      if (clipImg) {
        clipImg.destroy();
      }
      let imageClone = this.layer.findOne(".clipingImg").clone();
      imageClone.cache();
      imageClone.filters([Konva.Filters.Contrast]);
      imageClone.contrast(0);
      imageClone.listening(false);
      this.clipLayer.add(imageClone);
      this.clipLayer.batchDraw();
    },
    addPath(data) {
      data =
        // "M12.582,9.551C3.251,16.237,0.921,29.021,7.08,38.564l-2.36,1.689l4.893,2.262l4.893,2.262l-0.568-5.36l-0.567-5.359l-2.365,1.694c-4.657-7.375-2.83-17.185,4.352-22.33c7.451-5.338,17.817-3.625,23.156,3.824c5.337,7.449,3.625,17.813-3.821,23.152l2.857,3.988c9.617-6.893,11.827-20.277,4.935-29.896C35.591,4.87,22.204,2.658,12.582,9.551z";
        "M256 136l120-87.8-16.1 147.8 136.1 60-136.1 60 16.1 147.8-120-87.8-120 87.8 16.1-147.8-136.1-60 136.1-60-16.1-147.8z";
      let self = this;
      let image = this.clipLayer.findOne("Image");
      let zIndex = image.zIndex();
      let path = new Konva.Path({
        x: 0,
        y: 0,
        data: data,
        fill: "white",
        zIndex: zIndex + 100
      });
      path.listening(false);
      path.globalCompositeOperation("destination-in");
      this.clipLayer.add(path);
      // 初始化裁剪形状的大小和位置
      let imageRect = image.getClientRect();
      let pathRect = path.getClientRect();
      let pathScale = Math.min(
        (image.width() * image.scaleX()) / pathRect.width,
        (image.height() * image.scaleY()) / pathRect.height
      );
      path.scale({ x: pathScale, y: pathScale });
      path.x(image.x() - pathRect.x * pathScale);
      path.y(image.y() - pathRect.y * pathScale);
      path.offsetX(pathRect.width / 2);
      path.offsetY(pathRect.height / 2);
      path.rotation(image.rotation());
      // 添加缩放操作
      let tr = new Konva.Transformer({
        name: "clipTransformer",
        rotateAnchorOffset: 30,
        rotateEnabled: false,
        enabledAnchors: ["top-left", "top-right", "bottom-left", "bottom-right"]
      });
      tr.listening(true);
      tr.attachTo(path);
      this.clipLayer.add(tr);
      this.clipLayer.batchDraw();
    },
    initClipEvent() {
      let self = this;
      let image = this.layer.findOne(".clipingImg");
      let imageClone = this.clipLayer.findOne("Image");
      let path = this.clipLayer.findOne("Path");
      let imgTransformer = this.layer.findOne(".imgTransformer");
      let pathTransformer = this.clipLayer.findOne("Transformer");
      // 图片移动或缩放时,裁剪图层的图片保持一致
      image.off("dragmove.clip");
      image.on("dragmove.clip", function(e) {
        imageClone.x(e.target.x());
        imageClone.y(e.target.y());
        self.clipLayer.batchDraw();
      });
      image.off("transform.clip");
      image.on("transform.clip", function(e) {
        imageClone.scaleX(e.target.scaleX());
        imageClone.scaleY(e.target.scaleY());
        imageClone.x(e.target.x());
        imageClone.y(e.target.y());
        imageClone.offsetX(e.target.offsetX());
        imageClone.offsetY(e.target.offsetY());
        imageClone.rotation(e.target.rotation());
        self.clipLayer.batchDraw();
      });
      // 裁剪区域必须始终保持在图片内部
      image.dragBoundFunc(function(pos) {
        if (self.isCliping) {
          let imgRect = image.getClientRect(),
            pathRect = path.getClientRect(),
            rotation = image.rotation(),
            rotationDeg = (rotation * Math.PI) / 180;
          let minX = pathRect.x + pathRect.width - imgRect.width;
          let maxX = pathRect.x;
          let minY = pathRect.y + pathRect.height - imgRect.height;
          let maxY = pathRect.y;
          // let imgWidth = image.width() * image.scaleX();
          // let distY = Math.abs(imgWidth * Math.sin(rotationDeg);
          // 由于设计器中的图片都设了偏移，x,y指的是图片的中心点，所以需要对x,y再做转换
          minX = minX + imgRect.width / 2;
          maxX = maxX + imgRect.width / 2;
          minY = minY + imgRect.height / 2;
          maxY = maxY + imgRect.height / 2;
          let _x = Math.max(minX, pos.x);
          _x = Math.min(maxX, _x);
          let _y = Math.max(minY, pos.y);
          _y = Math.min(maxY, _y);
          return {
            x: _x,
            y: _y
          };
        }
        return pos;
      });
      imgTransformer.boundBoxFunc(function(oldBoundBox, newBoundBox) {
        // console.log("img transform => ", oldBoundBox, newBoundBox);
        if (self.isCliping) {
          let pathRect = path.getClientRect();
          if (
            newBoundBox.x > pathRect.x ||
            newBoundBox.y > pathRect.y ||
            newBoundBox.x + newBoundBox.width < pathRect.x + pathRect.width ||
            newBoundBox.y + newBoundBox.height < pathRect.y + pathRect.height
          ) {
            return oldBoundBox;
          } else {
            return newBoundBox;
          }
        }
        return newBoundBox;
      });
      // 路径缩放不能超出图片范围
      pathTransformer.boundBoxFunc(function(oldBoundBox, newBoundBox) {
        // console.log("path transform => ", oldBoundBox, newBoundBox);
        if (self.isCliping) {
          let imgRect = image.getClientRect();
          if (
            newBoundBox.x < imgRect.x ||
            newBoundBox.y < imgRect.y ||
            newBoundBox.x + newBoundBox.width > imgRect.x + imgRect.width ||
            newBoundBox.y + newBoundBox.height > imgRect.y + imgRect.height
          ) {
            return oldBoundBox;
          } else {
            return newBoundBox;
          }
        }
        return newBoundBox;
      });
    },
    startClip(path) {
      if (this.layer.findOne(".clipingImg")) {
        this.isCliping = true;

        // 将底层图片灰显
        this.changeClipImgStatus(true);

        // 初始化裁剪画布
        this.initClipLayer();
        this.addPath(path);
        this.initClipEvent();
      }
    },
    changeClipImgStatus(isCliping) {
      let tr = this.layer.findOne(".imgTransformer");
      let image = this.layer.findOne(".clipingImg");
      image.cache();
      image.filters([Konva.Filters.Contrast]);
      image.contrast(isCliping ? -50 : 0);
      if (!isCliping) {
        image.removeName("clipingImg");
        tr.destroy();
      } else {
        tr.rotateEnabled(false);
      }
      this.layer.batchDraw();
    },
    saveClip() {
      if (!this.isCliping) return;
      let self = this;
      // let group = new Konva.Group({
      //   clip: { x, y, width, height },
      //   draggable: true,
      // });
      // group.add(path);
      this.clipLayer.find("Transformer").destroy();
      let path = this.clipLayer.findOne("Path");
      let { x, y, width, height } = path.getClientRect();
      // 生成一张新的图片并添加
      this.clipLayer.toDataURL({
        x,
        y,
        width,
        height,
        callback: function(res) {
          self.cancelClip();
          let clipedImg = new Image();
          clipedImg.src = res;
          clipedImg.onload = function() {
            var image = new Konva.Image({
              x: x,
              y: y,
              image: clipedImg,
              width: width,
              height: height,
              draggable: true
            });
            self.layer.add(image);
            self.layer.batchDraw();
            self.layer.findOne("Image").hide();
          };
        }
      });
    },
    cancelClip() {
      if (!this.isCliping) return;
      this.isCliping = false;
      this.clipLayer.destroy();
      this.changeClipImgStatus(false);
    }
  },
  mounted() {
    this.calcStageSize();
    this.initCanvasByView(1);
  }
};
</script>

<style lang="scss" scoped>
#designer {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.designer-body {
  flex: 1;
  padding: 15px 30px;
  display: flex;
  .view-box {
    margin-right: 15px;
    .view-item {
      width: 60px;
      height: 60px;
      border: 1px solid #ccc;
      border-radius: 4px;
      margin-top: 10px;
      &.active {
        border-color: red;
      }
    }
  }
  .stage-box {
    flex: 1;
    background: #ccc;
    display: flex;
    justify-content: center;
    align-items: center;
    > div {
      background: cornflowerblue;
      position: relative;
    }
    .stage-item {
      background: #fff url("~@/assets/img/design/Transparent_bg1.png") repeat
        top left;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
}
.designer-footer {
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.path-select {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.path-item {
  width: 40px;
}
</style>