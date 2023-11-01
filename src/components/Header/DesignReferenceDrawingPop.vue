<template>
  <div ref="designReferenceDrawingPop" class="design-reference-drawing-pop" v-zwdrag>
    <div class="title">
      <a @click="downloadAmazonCustomData()">下载定制数据</a>
      <i class="iconfont iconclose-fill cp" @click="closeDesignReferenceDrawingPop"></i>
    </div>
    <div class="design-reference-drawing-content">
      <el-carousel
        trigger="click"
        :autoplay="false"
        arrow="always"
        :loop="true"
      >
        <el-carousel-item v-for="(item,index) in amazonViewImgObj.viewArr" :key="index">
          <div class="map-preview-img">
            <img :src="item.viewImage" alt="">
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div v-if="amazonViewImgObj.from" class="img-msg">
      <span>参考图(来源:{{amazonViewImgObj.from}})</span>
      <span>颜色:{{amazonViewImgObj.color}}</span>
      <span>尺码：{{amazonViewImgObj.size}}</span>
    </div>
    <div v-if="amazonViewImgObj.name" class="img-msg-two">
      <span>参考图(来源:{{amazonViewImgObj.name}})</span>
      <span>颜色:{{amazonViewImgObj.color}}</span>
      <span>尺码：{{amazonViewImgObj.size}}</span>
    </div>
  </div>
</template>

<script>
import Konva from "@/utils/konva7.2.1";
import { stageObj, imgSizeCalculate } from "@/utils/designer.js";
import { amazonLoadFont, GetQueryString } from "@/utils/utils";
import { _amazonOrder, downloadAmazonCustomData } from "@/apis/amazon.js";
import { _getPhotoDetail } from '@/apis/gallery.js'
export default {
  props: {
    
  },
  data() {
    return  {
      svgString: `<?xml version="1.0" encoding="UTF-8" standalone="no" ?>
        <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="3200" height="3200" viewBox="0 0 400 400" xml:space="preserve">
        <desc>Created with Fabric.js 3.2.0</desc>
        <defs>
        </defs>
        <g clip-path="url(#CLIPPATH_17)"  >
        <g transform="matrix(0.14853738 -0.0043448 0.0043448 0.14853738 194.20118059 177.89606216)"  >
        <clipPath id="CLIPPATH_17" >
          <rect transform="matrix(1 0 0 1 198.5 201)" x="-184" y="-100.5" rx="0" ry="0" width="368" height="201" />
        </clipPath>
          <image style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"  xlink:href="d9d9e2f3-0a9c-4e25-ba0f-bfad1139d7c0.jpg" x="-1158" y="-1544" width="2667" height="2667"></image>
        </g>
        </g>
        <g transform="matrix(0.94760749 0 0 0.94760749 200.5 134)" style=""  >
            <text xml:space="preserve" font-family="Pacifico" font-size="22.413223140495866" font-style="normal" font-weight="normal" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1; white-space: pre;" ><tspan x="-51.05355759" y="7.04088992" >01/24/2022</tspan></text>
        </g>
        <g transform="matrix(0.06461272 0 0 0.06461272 199 198.5)" style=""  >
            <text xml:space="preserve" font-family="Pacifico" font-size="107.39669421487602" font-style="normal" font-weight="normal" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1; white-space: pre;" ><tspan x="-2460.81590384" y="33.73759752" style="white-space: pre; ">Las Promesas De Dios Son Como Las Estrellas; Entre más oscura ES LA NOCHE, Mas Fuertemente BRILLAN . </tspan></text>
        </g>
        <g transform="matrix(0.94760749 0 0 0.94760749 199.5 266.5)" style=""  >
            <text xml:space="preserve" font-family="Pacifico" font-size="17.74380165289256" font-style="normal" font-weight="normal" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1; white-space: pre;" ><tspan x="-59.39581652" y="5.57403785" >Dios Cuida d Mi</tspan></text>
        </g>
        </svg>`,
      anUnrecognizedFont: false,
    }
  },
  mounted() {
    let $btn = document.querySelector('.design-reference-drawing-btn');
    let $designReferenceDrawingPop = this.$refs.designReferenceDrawingPop;
    let btnRect = $btn.getBoundingClientRect();
    $designReferenceDrawingPop.style.top = btnRect.y + 36 + 'px';
    $designReferenceDrawingPop.style.left = btnRect.x - 150 + 'px';
  },
  computed: {
    amazonViewImgObj() {
      return this.$store.state.product.amazonViewImgObj
    },
    isLoading() {
      return this.$store.getters.initLoading;
    },
    productData() {
      return this.$store.state.product.selectedProduct;
    }
  },
  methods: {
    closeDesignReferenceDrawingPop() {
      this.$emit('closeDesignReferenceDrawingPop')
    },
    parseSVG(svgString) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgString, 'image/svg+xml');
      return doc;
    },
    async getElement() {
      if(window.location.search.indexOf("isAmazonOrder") == -1) {
        return
      }
      let res = await _amazonOrder({order_item_code: GetQueryString('orderItemId')})
      if(res.data.wait_update) { //定制数据解析中，请重试或直接设计
        this.$message({
            dangerouslyUseHTMLString: true,
            message: `<span>${res.msg}</span> <a href="javascript:location.reload();">刷新</a>`,
            showClose: true,
            duration: 0,
            type: 'warning',
        });
        return
      }
      this.$message({
        showClose: true,
        message: '请根据参考图选择相应产品设计',
        type: 'warning',
        duration: 0
      });
      this.$store.commit('product/updateAmazonViewImgObj', res.data)
      let allNodeAttrsArr = []
      for(let i = 0; i < this.productData.views.length; i++) {
        if(res.data.viewArr[i]) {
          if(res.data.storeParseStatus == 1) { //java合成一张图
            allNodeAttrsArr.push({
              type: 'image',
              storeParseStatus: 1,
              imageData: res.data.viewArr[i].designImage,
              viewId: this.productData.views[i].id
            })
          } else if(res.data.storeParseStatus == 2) { //使用原始图
            let currentStage = stageObj[`stage${this.productData.views[i].id}`];
            let layerBgGroup = currentStage.findOne(".layerBgGroup");
            let designLayer = currentStage.findOne(".designLayer");
            let viewNodeAttrsArr = await this.getSvgElement(res.data.viewArr[i], layerBgGroup.width(), designLayer, this.productData, this.productData.views[i].id)
            allNodeAttrsArr = allNodeAttrsArr.concat(viewNodeAttrsArr)
          }
        }
      }
      this.$store.commit('product/updateAmazonOriginalLayer', { data: allNodeAttrsArr, done: true })
    },
    getSvgElement(amazonViewData, layerBgWidth, designLayer, productData, viewId) {
      return new Promise(async (resolve) => {
        const doc = this.parseSVG(amazonViewData.svgStr)
        const elements = doc.getElementsByTagName('*')
        let svgWidth = 0, svgHeight = 0, svgViewBoxWidth = 0, svgViewBoxHeight = 0, svgRatio = 0, svgRatio2 = 0;
        const designContainerGroup = designLayer.findOne('.designContainerGroup')
        let twoCanvasRatio = 0
        let attrs = {}
        let nodeAttrsArr = []
        let konvaText = null
        for (const element of elements) {
          switch(element.nodeName) {
            case 'svg':
              svgWidth = element.getAttribute('width')
              svgHeight = element.getAttribute('height')
              const viewBox = element.getAttribute('viewBox').split(' ')
              svgViewBoxWidth = viewBox[2]
              svgViewBoxHeight = viewBox[3]
              svgRatio = svgViewBoxWidth / svgWidth
              svgRatio2 = svgWidth / svgViewBoxWidth
              twoCanvasRatio = svgWidth / layerBgWidth
              break;
            case 'image':
              let imgCode = element.getAttribute('xlink:href')
              let res = await _getPhotoDetail({galleryId: imgCode})
              let imageData = res.data
              attrs = this.getTransform(element)
              let imgRealWidth = parseFloat(element.getAttribute('width'))
              let imgRealHeight = parseFloat(element.getAttribute('height'))
              let imgRealWidthPx = imgRealWidth / svgRatio * attrs.scaleX
              let imgRealHeightPx = imgRealHeight / svgRatio * attrs.scaleY
              let inCanvasImgWidth = imgRealWidthPx / twoCanvasRatio
              let inCanvasImgHeight = imgRealHeightPx / twoCanvasRatio
              let img = new Image()
              img.setAttribute("crossOrigin", "anonymous")
              img.src = imageData.designImg3
              await (() => {
                return new Promise((resolve) => {
                  img.onload = function () {
                    attrs.viewId = viewId
                    attrs.type = 'image'
                    attrs.storeParseStatus = 2
                    attrs.x = (attrs.x + parseFloat(element.getAttribute('x')) * attrs.scaleX) / svgRatio / twoCanvasRatio
                    attrs.y = (attrs.y + parseFloat(element.getAttribute('y')) * attrs.scaleY) / svgRatio / twoCanvasRatio
                    attrs.scaleX = inCanvasImgWidth / this.width
                    attrs.scaleY = inCanvasImgHeight / this.height
                    attrs.x = (attrs.x - designContainerGroup.x())+ this.width * attrs.scaleX / 2
                    attrs.y = (attrs.y - designContainerGroup.y()) + this.height * attrs.scaleY / 2

                    attrs.offsetX = this.width / 2
                    attrs.offsetY = this.height / 2
                    attrs.flipImgUrl = imageData.designImg3
                    attrs.layerScale = designLayer.scaleX()
                    attrs.stageWidth = layerBgWidth * designLayer.scaleX()
                    attrs.draggable = true
                    attrs.name = 'design designImg'

                    let imgSize = imgSizeCalculate({ imageData, viewId, productData });
                    let imageWidth = imgSize.width;
                    let imageHeight = imgSize.height;
                    let ratio = designLayer.getAttrs().ratio
                    attrs.initScaleX = imageWidth / ratio / this.width
                    attrs.initScaleY = imageHeight / ratio / this.height
                    attrs.imageData = imageData
                    attrs.maxImgSize = imgSize.viewerSize
                    nodeAttrsArr.push(attrs)
                    resolve()
                  }
                })
              })()
              break;
            case 'text':
              let fontFamily = element.getAttribute('font-family')
              let fontSrc = ''
              for(let item of amazonViewData.fonts) {
                if(item.name === fontFamily) {
                  fontSrc = item.url
                }
              }
              let font = {
                value: fontFamily,
                src: '',
                weight: 'normal', 
                style: 'normal',
                bold: false
              }
              if(fontSrc.includes('woff')) {
                font.src = 'url("' +
                            fontSrc +
                            '") format("woff"),'
              } else if(fontSrc.includes('ttf')) {
                font.src += 'url("' +
                              fontSrc +
                              '") format("truetype")'
              }
              /*等待字体加载完成*/
              let fontObj = await amazonLoadFont(
                fontFamily,
                font,
                false
              )
              if(fontObj.src === '' && !this.anUnrecognizedFont) {
                this.anUnrecognizedFont = true
                this.$message({
                  showClose: true,
                  message: '存在无法识别的字体，请注意核实字体效果',
                  type: 'error',
                  duration: 0
                })
              }
              fontFamily = fontObj.value
              let designText = []
              let style = element.style
              attrs = this.getTransform(element)
              attrs.type = 'text'
              attrs.viewId = viewId
              attrs.storeParseStatus = 2
              attrs.x = (attrs.x) / svgRatio / twoCanvasRatio - designContainerGroup.x()
              attrs.y = (attrs.y) / svgRatio / twoCanvasRatio - designContainerGroup.y()
              for(let tspan of element.childNodes) {
                designText.push(tspan.innerHTML)
              }
              attrs.designFill = ''
              attrs.designText = designText.join('\n')
              attrs.proFontFamily = fontFamily
              // attrs.proFontFamily = 'Academic M54_1_1_Academic M54'
              attrs.proFontSize = parseInt(element.getAttribute('font-size'))
              attrs.textColor = style.fill
              attrs.proStroke = style.stroke == "none" ? '' : style.stroke
              attrs.proStrokeWidth = parseInt(style.strokeWidth)
              attrs.strokeValue = parseInt(style.strokeWidth)
              attrs.proTextDecoration = ''
              attrs.textAlign = 'center'
              attrs.proFontStyle = ''
              konvaText = new Konva.Text({
                text: attrs.designText,
                fontSize: attrs.proFontSize,
                wrap: "char",
                fontFamily: attrs.proFontFamily,
                fontStyle: attrs.proFontStyle,
                textDecoration: attrs.proTextDecoration,
                strokeWidth: attrs.proStrokeWidth,
                stroke: attrs.proStroke,
                verticalAlign: "bottom",
                align: attrs.textAlign
              })
              attrs.width = konvaText.width()
              attrs.height = konvaText.height()
              attrs.offsetX = konvaText.width() / 2
              attrs.offsetY = konvaText.height() / 2
              
              attrs.oldData = true
              attrs.layerScale = designLayer.scaleX()
              attrs.stageWidth = layerBgWidth * designLayer.scaleX()
              attrs.draggable = true
              attrs.name = 'design designText'
              nodeAttrsArr.push(attrs)
              break;
          }
        }
        resolve(nodeAttrsArr)
      })
    },
    getTransform(element) {
      const parentNode = element.parentNode
      const parentNodeTransformStr = parentNode.getAttribute('transform')
      const parentNodeTransform = parentNodeTransformStr.slice(7, parentNodeTransformStr.length - 1).split(' ')
      const transform = new Konva.Transform(parentNodeTransform)
      let attrs = transform.decompose()
      attrs.x = parseFloat(attrs.x)
      attrs.y = parseFloat(attrs.y)
      attrs.scaleX = parseFloat(attrs.scaleX)
      attrs.scaleY = parseFloat(attrs.scaleY)
      return attrs
    },
    downloadAmazonCustomData() {
      const fastId = this.amazonViewImgObj.fastdfsId
      const customized_url = this.amazonViewImgObj.customized_url
      const data = {
        order_item_code : GetQueryString('orderItemId'),
        order_id : this.amazonViewImgObj.order_id,
        order_from_id: this.amazonViewImgObj.order_from_id
      }
      downloadAmazonCustomData(data).then(() => {
        if(fastId > 0){
            window.open('/merchant/platformExportRecord/index');
        }else{
            window.open(customized_url);
        }
      })
    }
  },
  watch: {
    isLoading(nv, ov){
      if(!nv){
        this.getElement()
      }
    },
  },
  directives: {
    zwdrag: {
      inserted: function(el, binding){
        // 拖拽
        let $titEl = el.firstChild;
        el.moveHandler = function(e){
          let winWidth = document.documentElement.clientWidth || document.body.clientWidth;
          let winHeight = document.documentElement.clientHeight || document.body.clientHeight;
          let {left,top,width,height} = el.startPos.elRect;
          let changeX = e.clientX - el.startPos.x;
          let changeY = e.clientY - el.startPos.y;
          let _left = left + changeX;
          let _top = top + changeY;
          if(_left < 0) _left = 0;
          if(_top < 0) _top = 0;
          if(_left + width > winWidth) _left = winWidth - width;
          if(_top + height > winHeight) _top = winHeight - height;
          el.style.left = _left + 'px';
          el.style.top = _top + 'px';
        }
        $titEl.addEventListener('mousedown', function(e){
          el.startPos = {
            x: e.clientX,
            y: e.clientY,
            elRect: el.getBoundingClientRect(),
          }
          document.addEventListener('mousemove', el.moveHandler, false);
        });
        document.addEventListener('mouseup', function(){
          document.removeEventListener('mousemove', el.moveHandler, false);
        }, false);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.design-reference-drawing-pop {
    position: fixed;
    top: 44px;
    left: -110px;
    background: white;
    z-index: 10;
    box-shadow: 0px 6px 18px #ccc;
    z-index: 99;
    .design-reference-drawing-content {
      width: 300px;
      height: 300px;
    }
    .title {
      display: flex;
      justify-content: space-between;
      padding: 8px 14px;
      cursor: move;
      a {
        cursor: pointer;
      }
    }
    &>.iconclose-fill {
      position: absolute;
      right: 10px;
      top: 10px;
      font-size: 24px;
      z-index: 4;
    }
    .map-preview-img {
      width: 100%;
      height: 100%;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .img-msg {
      width: 100%;
      display: flex;
      justify-content: space-around;
      background: white;
      padding: 10px 0;
      span {
        position: relative;
        &:not(:last-child) {
          &:after {
            content: '';
            position: absolute;
            top: -3px;
            right: -13px;
            width: 1px;
            height: 16px;
            background: #D5D5D5;
          }
        }
      }
    }
    .img-msg-two {
      width: 100%;
      // display: flex;
      // justify-content: space-around;
      background: white;
      padding: 10px 0;
      span {
        margin-right: 10px;
        // position: relative;
        // &:not(:last-child) {
        //   &:after {
        //     content: '';
        //     position: absolute;
        //     top: -3px;
        //     right: -13px;
        //     width: 1px;
        //     height: 16px;
        //     background: #D5D5D5;
        //   }
        // }
      }
    }
}
</style>