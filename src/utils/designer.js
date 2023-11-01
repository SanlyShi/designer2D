let stageObj = {};
let cacheProductPrintAreas = [];
const overallDesignView = {
  en_name: "整体设计",
  // width: 700, //java接口去除，保持统一性去除
  // height: 700,
  id: 9999,
  name: "整体设计",
  pointSvg: "",
  pointout_print_areas: [],
  print_area_image: "",
  print_area: {
    // viewWidth: 700,
    view_width: 700,
    width: 700,
    height: 700,
    id: 9999,
    offset_x: 0,
    offset_y: 0,
    soft_svg: "",
  },
};
function linkageDesign(product, thisViewId, curNode, isLockOperation) {
  const isGroup = Array.isArray(curNode);
  let designArr = []
  if(isGroup) {
    [].forEach.call(curNode, item => {
      designArr = designArr.concat(_linkageDesign(product, thisViewId, item, isLockOperation))
    });
  } else {
    designArr = _linkageDesign(product, thisViewId, curNode, isLockOperation)
  }
  let designObj = {}
  for(let item of designArr) {
    if(!designObj[item.id]) {
      designObj[item.id] = []
    }
    designObj[item.id].push(item)
  }
  return designObj
}

function _linkageDesign(product, thisViewId, curNode, isLockOperation) {
  let designArr = [];
  let productViews = JSON.parse(JSON.stringify(product.views));
  if (thisViewId == 9999) {
    productViews.unshift(overallDesignView);
  }
  productViews.forEach((item) => {
    const stage = stageObj[`stage${item.id}`];
    const layer = stage.findOne(".designLayer");
    let node = null;
    if (product.imgFull && product.bg_ind == -1 && curNode.hasName("isBg")) {  //全副产品是否支持独立背景设计 => bg_ind: 1：支持独立设计，-1：不支持
      //背景
      //模板会出现非全副模板用于全副产品，导致背景图不是所有面都有背景图
      if (layer.findOne(".isBg")) {
        if (isLockOperation || !layer.findOne(".isBg").isLock) {
          //isLockOperation：操作锁定  ｜｜ 非锁定
          node = layer.findOne(".isBg");
        }
      }
    } else if (thisViewId == 9999) {
      //整体设计
      layer.find(".overallDesign").forEach((design) => {
        if (
          design.getAttrs().overallDesignId ==
          curNode.getAttrs().overallDesignId
        ) {
          if (isLockOperation || !design.isLock) {
            node = design;
          }
        }
      });
    } else if (item.id == thisViewId) {
      //当前面设计
      node = curNode;
    }
    if (
      thisViewId != 9999 &&
      !curNode.hasName("isBg") &&
      thisViewId == item.id
    ) {
      //非背景图的整体设计 移动单独面，取消联动性
      layer.find(".overallDesign").forEach((design) => {
        design.removeName("overallDesign");
        let attrs = design.getAttrs();
        delete attrs.overallDesignId;
        design.setAttrs(attrs);
      });
    }
    if (node) {
      designArr.push({ id: item.id, node, layer, stage });
    }
  });
  return designArr;
}

function bgImgLinkageStart(product) {
  product.views.forEach((view) => {
    const stage = stageObj[`stage${view.id}`];
    const layer = stage.findOne(".designLayer");
    layer.find(".isBg").forEach((item) => {
      item.setAttrs({
        changeStartX: item.x(),
        changeStartY: item.y(),
        changeStartScaleX: item.scaleX(),
        changeStartScaleY: item.scaleY(),
      });
    });
  });
}

function convertSizeToMm(designeSize, dpi) {
  var pixelToMm = function (pixel, dpi) {
    return (pixel * 25.4) / dpi;
  };
  return {
    height: pixelToMm(designeSize.height, dpi),
    width: pixelToMm(designeSize.width, dpi),
  };
}

var throttle = function (fn, delay, mustRunDelay) {
  var timer = null;
  var t_start;
  return function () {
    var context = this,
      args = arguments,
      t_curr = +new Date();
    clearTimeout(timer);
    if (!t_start) {
      t_start = t_curr;
    }
    if (t_curr - t_start >= mustRunDelay) {
      fn.apply(context, args);
      t_start = t_curr;
    } else {
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    }
  };
};

var windowResize = function (fn) {
  let startWindowWidth = getWindowWidth();
  return function () {
    let context = this,
      args = arguments;
    let currWindowWidth = getWindowWidth();
    if (startWindowWidth < 1450 && currWindowWidth >= 1450) {
      fn.apply(context, args);
      startWindowWidth = currWindowWidth;
    } else if (startWindowWidth > 1450 && currWindowWidth <= 1450) {
      fn.apply(context, args);
      startWindowWidth = currWindowWidth;
    }
  };
};
var getWindowWidth = function () {
  if (window.innerWidth) {
    return window.innerWidth;
  } else if (document.body && document.body.clientWidth) {
    return document.body.clientWidth;
  }
};

let getRotatePoint = function ({ node, rotation }) {
  const degToRad = Math.PI / 180;

  const rotatePoint = ({ x, y }, deg) => {
    const rcos = Math.cos(deg * degToRad),
      rsin = Math.sin(deg * degToRad);
    return { x: x * rcos - y * rsin, y: y * rcos + x * rsin };
  };

  //current rotation origin (0, 0) relative to desired origin - center (node.width()/2, node.height()/2)
  const topLeft = {
    x: (-node.width() * node.scaleX()) / 2,
    y: (-node.height() * node.scaleY()) / 2,
  };
  const current = rotatePoint(topLeft, rotation);
  return current;
};

let getStyle = function (dom, attr) {
  return dom.currentStyle
    ? dom.currentStyle[attr]
    : getComputedStyle(dom, false)[attr];
};

let designTextSep = function (text) {
  return new Promise((resolve, reject) => {
    let textArr = [];
    let textType = "ch";
    function aa(text) {
      let chineseReg = /[\u4e00-\u9fa5]/g;
      let notChineseReg = /[^\u4e00-\u9fa5]/g;
      let chineseIndex = chineseReg.exec(text)
        ? chineseReg.exec(text)["index"] - 1
        : -1;
      let notChineseIndex = notChineseReg.exec(text)
        ? notChineseReg.exec(text)["index"] - 1
        : -1;
      if (chineseIndex >= 0 && notChineseIndex >= 0) {
        let minIndex = Math.min(chineseIndex, notChineseIndex),
          maxIndex = Math.max(chineseIndex, notChineseIndex);
        if (chineseIndex > notChineseIndex) {
          textType = "en";
        } else {
          textType = "ch";
        }
        textArr.push({
          textType,
          text: text.substring(minIndex, maxIndex),
        });
        text = text.substring(maxIndex, text.length);
        if (text.length > 0) {
          aa(text);
        } else {
          resolve(textArr);
        }
      } else {
        if (chineseIndex >= 0) {
          textType = "ch";
        } else {
          textType = "en";
        }
        textArr.push({
          textType,
          text: text,
        });
        resolve(textArr);
      }
    }
    aa(text);
  });
};

function alignmentCanvas({ node, data }) {
  let stage = node.getStage();
  let layer = node.getLayer();
  let printAreaRect = stage.findOne(".print_area_border_outer"); //设计区域
  let nodeWidth = node.width() * Math.abs(node.scaleX()),
    nodeHeight = node.height() * Math.abs(node.scaleY());
  let layerWidth = printAreaRect.width(),
    layerHeight = printAreaRect.height();
  switch (data.value) {
    case "topleft":
      node.setAttrs({
        x: nodeWidth / 2,
        y: nodeHeight / 2,
      });
      break;
    case "topcenter":
      node.setAttrs({
        x: layerWidth / 2,
        y: nodeHeight / 2,
      });
      break;
    case "topright":
      node.setAttrs({
        x: layerWidth - nodeWidth / 2,
        y: nodeHeight / 2,
      });
      break;
    case "centerleft":
      node.setAttrs({
        x: nodeWidth / 2,
        y: layerHeight / 2,
      });
      break;
    case "centercenter":
      node.setAttrs({
        x: layerWidth / 2,
        y: layerHeight / 2,
      });
      break;
    case "centerright":
      node.setAttrs({
        x: layerWidth - nodeWidth / 2,
        y: layerHeight / 2,
      });
      break;
    case "bottomleft":
      node.setAttrs({
        x: nodeWidth / 2,
        y: layerHeight - nodeHeight / 2,
      });
      break;
    case "bottomcenter":
      node.setAttrs({
        x: layerWidth / 2,
        y: layerHeight - nodeHeight / 2,
      });
      break;
    case "bottomright":
      node.setAttrs({
        x: layerWidth - nodeWidth / 2,
        y: layerHeight - nodeHeight / 2,
      });
      break;
    case "horizontalcenter":
      node.setAttrs({
        x: layerWidth / 2,
      });
      break;
    case "verticalcenter":
      node.setAttrs({
        y: layerHeight / 2,
      });
      break;
  }
  layer.batchDraw();
}

function ClearBr({ str, type }) {
  switch (type) {
    case 1: //去除换行
      str = str.replace(/<\/?.+?>/g, "");
      str = str.replace(/[\r\n]/g, "");
      break;
    case 2: //去除空格
      str = str.replace(/\s+/g, "");
      break;
    default:
      str = str.replace(/<\/?.+?>/g, "");
      str = str.replace(/[\r\n]/g, "");
      str = str.replace(/\s+/g, "");
      break;
  }

  return str;
}
function calcTwoTransform(transform, rad, Konva) {
  let rotationTran = new Konva.Transform();
  rotationTran.rotate(rad);
  let invertTran = rotationTran.copy().invert();
  let mulTransform = invertTran.multiply(transform);
  return {
    gTransform: `matrix(${rotationTran.m[0]}, ${rotationTran.m[1]}, ${rotationTran.m[2]}, ${rotationTran.m[3]}, ${rotationTran.m[4]}, ${rotationTran.m[5]})`,
    transform: `matrix(${mulTransform.m[0]}, ${mulTransform.m[1]}, ${mulTransform.m[2]}, ${mulTransform.m[3]}, ${mulTransform.m[4]}, ${mulTransform.m[5]})`,
  };
}

function imgSizeCalculate({ imageData, viewId, productData }) {
  let viewerSize = convertSizeToMm(
    { width: imageData.size.width, height: imageData.size.height },
    productData.dpi
  );
  var defaultConfig = getDesigneConfiguration({ viewId: viewId }),
    defaultScale = convertDefaultScale(viewerSize, defaultConfig.config),
    defaultScaleHeight = convertDefaultScaleHeight(
      viewerSize.height * defaultScale,
      defaultConfig.config.height
    );
  //防止除不尽
  var iw =
    viewerSize.width * defaultScale * defaultScaleHeight >
    defaultConfig.config.width
      ? defaultConfig.config.width
      : viewerSize.width * defaultScale * defaultScaleHeight;
  var ih =
    viewerSize.height * defaultScale * defaultScaleHeight >
    defaultConfig.config.height
      ? defaultConfig.config.height
      : viewerSize.height * defaultScale * defaultScaleHeight;
  // imageWidth = iw
  // imageHeight = ih
  return { width: iw, height: ih, viewerSize: viewerSize };
}
function getDesigneConfiguration({ viewId }) {
  let rel = cacheProductPrintAreas,
    _rel;
  for (var i = 0, ii = rel.length; i < ii; i++) {
    if (rel[i].defaultViews == viewId) {
      _rel = rel[i];
      break;
    }
  }

  return _rel;
}
function convertDefaultScale(size, _size) {
  if (size.width > _size.width) {
    return _size.width / size.width;
  } else {
    return 1;
  }
}
/**
 * 宽不能超过印刷区， 同理高也不能超出，再计算
 */
function convertDefaultScaleHeight(curViewerSizeHeight, defaultConfigHeight) {
  if (curViewerSizeHeight > defaultConfigHeight) {
    return defaultConfigHeight / curViewerSizeHeight;
  }

  return 1;
}
function getCurStageLayer({ viewId }) {
  let stage = stageObj[`stage${viewId}`];
  let layer = stage.findOne(".designLayer");
  let layerBg = stage.findOne(".layerBg");
  let layerBgGroup = stage.findOne(".layerBgGroup");
  let designRect = layer.findOne(".print_area_border_outer");
  let designContainerGroup = layer.findOne(".designContainerGroup");
  const mainImgLayer = stage.findOne(".mainImgLayer");
  return {
    stage: stage,
    layer: layer,
    layerBg,
    layerBgGroup,
    designRect: designRect,
    designContainerGroup,
    mainImgLayer
  };
}
function editTextSetTextareaStyle(textGroup, viewId) {
  const textarea = document.getElementById('editingText')
  if(!textarea) return
  let textGroupScale = {
    x: Math.abs(textGroup.scaleX()),
    y: Math.abs(textGroup.scaleY())
  }
  let {stage, layer} = getCurStageLayer({ viewId });
  var stageBox = stage.container().getBoundingClientRect();
  let rotation = textGroup.rotation();
  let topleftPoint = getAbsoluteNodeTopLeftXY({node: textGroup})
  // so position of textarea will be the sum of positions above:
  var areaPosition = {
    x: stageBox.left + topleftPoint.x,
    y: stageBox.top + topleftPoint.y,
  };
  let contentEditableDiv = textarea.childNodes[0]
  let span = textarea.childNodes[0].childNodes[0]
  const text = textGroup.findOne('Text')
  const fontStyle = text.fontStyle()
  contentEditableDiv.style.display = "inline-block"
  contentEditableDiv.style.outline = 'none';
  contentEditableDiv.contentEditable = true
  span.innerText = text.text();
  textarea.style.position = 'absolute';
  textarea.style.top = areaPosition.y + 'px';
  textarea.style.left = areaPosition.x + 'px';
//   textarea.style.width = textGroup.width() - text.padding() * 2 + 'px';
//   textarea.style.height =
//     textGroup.height() - text.padding() * 2 + 5 + 'px';
  textarea.style.fontSize = text.fontSize() + 'px';
  textarea.style.padding = '0px';
  textarea.style.margin = '0px';
  // textarea.style.overflow = 'auto';
  textarea.style.background = 'none';
  // textarea.style.outline = 'none';
  textarea.style.resize = 'none';
  // textarea.style.lineHeight = text.lineHeight();
  textarea.style.fontFamily = text.fontFamily();
  textarea.style.transformOrigin = 'left top';
  textarea.style.textAlign = text.align();
  textarea.style.fontStyle = fontStyle.indexOf('italic') != -1 ? 'italic' : '';
  textarea.style.fontWeight = fontStyle.indexOf('bold') != -1 ? 'bold' : '';
  textarea.style.color = text.fill();
  textarea.style.border = "1px solid #6CD0FF"
  textarea.spellcheck = false
  // textarea.style.display = "inline-block"
  // textarea.style.verticalAlign = "text-top"
  var transform = '';
  if (rotation) {
    transform += 'rotateZ(' + rotation + 'deg)';
  }

  var px = 0;
  // also we need to slightly move textarea on firefox
  // because it jumps a bit
  var isFirefox =
    navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  if (isFirefox) {
    px += 2 + Math.round(text.fontSize() / 20);
  }
  px += (getTextBaseline(text) * textGroupScale.y)
  transform += 'translateY(' + px + 'px)';
  transform += `scale(${textGroupScale.x * layer.scaleX()}, ${textGroupScale.y * layer.scaleY()})`;

  textarea.style.transform = transform;

  // reset height
  textarea.style.height = 'auto';
}
function getTextBaseline (text) {
  let nodeAttrs = text.getAttrs()
  let result = {}
  let span = document.createElement('span')
  span.innerHTML = "aa"
  span.style.display = "inline-block"
  span.style.fontSize = nodeAttrs.fontSize + 'px'
  span.style.fontFamily = nodeAttrs.fontFamily

  let div = document.createElement('div')
  div.style.display = 'inline-block'
  div.style.width = "1px"
  div.style.height = 0
  let block = document.createElement('div')
  block.appendChild(span)
  block.appendChild(div)

  document.body.appendChild(block)
  div.style.verticalAlign = "baseline"
  result.ascent = div.offsetTop - span.offsetTop

  div.style.verticalAlign = "bottom"
  result.height = div.offsetTop - span.offsetTop

  result.descent = result.height - result.ascent

  document.body.removeChild(block)
  return result.descent
}
function getRotateNodePoint({ node, layer = null }) {
  //获取元素最大矩形各个点坐标
  let boundingBox;
  if (layer) {
    let designContainerGroup = layer.findOne(".designContainerGroup");
    boundingBox = node.getClientRect({ relativeTo: designContainerGroup });
  } else {
    boundingBox = node.getClientRect();
  }

  return {
    HStart: boundingBox.y,
    HCenter: boundingBox.y + boundingBox.height / 2,
    HEnd: boundingBox.y + boundingBox.height,
    VStart: boundingBox.x,
    VCenter: boundingBox.x + boundingBox.width / 2,
    VEnd: boundingBox.x + boundingBox.width,
    width: boundingBox.width,
    height: boundingBox.height,
  };
}
function getAbsoluteNodeTopLeftXY({ node, layer, flag='', centerPoint = null }) {
  //已知元素中心点，获取元素左上角坐标/各个点坐标
  let width = Math.abs(node.width() * node.scaleX() * node.getLayer().scaleX()),
    height = Math.abs(node.height() * node.scaleY() * node.getLayer().scaleX());
  let r = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) / 2; //图片中心点绕圆旋转的半径
  let oringAngle = Math.atan(height / width);
  let oringAngle2 = Math.atan(width / height);
  let tansAngle = (node.rotation() * Math.PI) / 180 + oringAngle;
  let tansAngle2 = (node.rotation() * Math.PI) / 180 + oringAngle2;
  if(!flag){
    let rotateNodePoint = {};
    if(centerPoint) {
      rotateNodePoint = {VCenter: centerPoint.x, HCenter: centerPoint.y}
    } else {
      rotateNodePoint = getRotateNodePoint({ node, layer });
    }
    return {
      x:
        rotateNodePoint.VCenter.toFixed(3) -
        (r * Math.cos(tansAngle)).toFixed(3),
      y:
        rotateNodePoint.HCenter.toFixed(3) -
        (r * Math.sin(tansAngle)).toFixed(3),
    };
  } else {
    return {
      //top-left
      x: parseFloat((node.x() - r * Math.cos(tansAngle)).toFixed(3)),
      y: parseFloat((node.y() - r * Math.sin(tansAngle)).toFixed(3)),
      //top-right
      x2: parseFloat((node.x() + r * Math.sin(tansAngle2)).toFixed(3)),
      y2: parseFloat((node.y() - r * Math.cos(tansAngle2)).toFixed(3)),
      //bottom-right
      x3: parseFloat((node.x() + r * Math.cos(tansAngle)).toFixed(3)),
      y3: parseFloat((node.y() + r * Math.sin(tansAngle)).toFixed(3)),
      //bottom-left
      x4: parseFloat((node.x() - r * Math.sin(tansAngle2)).toFixed(3)),
      y4: parseFloat((node.y() + r * Math.cos(tansAngle2)).toFixed(3))
    }
  }
}
function getNodeCenterXY({ node, layer, posi }) {
  //已知元素左上角坐标，求元素中心点坐标
  let width = Math.abs(node.width() * node.scaleX() * node.getLayer().scaleX()),
    height = Math.abs(node.height() * node.scaleY() * node.getLayer().scaleX());
  let r = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) / 2; //图片中心点绕圆旋转的半径
  let oringAngle = Math.atan(height / width);
  let tansAngle = (node.rotation() * Math.PI) / 180 + oringAngle;
  // let rotateNodePoint = this.getRotateNodePoint({node, layer})

  return {
    x: parseFloat(posi.x) + r * Math.cos(tansAngle),
    y: parseFloat(posi.y) + r * Math.sin(tansAngle),
  };

  // let dx
  // if(node.rotation() > -90 && node.rotation() < 90) {
  //   dx = Math.sqrt(Math.pow(r, 2) + Math.pow(rotateNodePoint.height / 2, 2))
  //   return {x: }
  // }else {
  //   dx = Math.sqrt(Math.pow(r, 2) + Math.pow(rotateNodePoint.width / 2, 2))
  // }
}
function destroy3DModelIs3D(threeDApp) {
  for (let i = 0; i < threeDApp.length; i++) {
    const app = threeDApp[i];
    if(app.code.indexOf(`is3dModel`) != -1) {
      let drawApp = app.drawApp;
      drawApp.destroy();
      threeDApp.splice(i, 1);
    }
  }
}
function destroy3DModel({threeDApp, detailImages, deleteNum = -1, isDeleteLarge = false}) {
  let _deleteNum = deleteNum
  for (let i = 0; i < threeDApp.length; i++) {
    const app = threeDApp[i];
    _deleteNum -= app.modelNum;
    let drawApp = app.drawApp, code = app.code;
    if(isDeleteLarge && code.indexOf('-large-') == -1) continue //只删大图模型，小图不删
    drawApp.destroy();
    drawApp = null;
    threeDApp.splice(i, 1);
    i--;
    if(deleteNum >= 0) {
      if(code.indexOf('is3dModel') == -1 && code.indexOf('mainImage') == -1) {
        const colorId = code.split('colorId-')[1].split('-')[0]
        const renderIndex = code.split('renderIndex-')[1].split('-')[0]
        if(code.indexOf('large') == -1) {
          detailImages[colorId][renderIndex].rendered = false
        }
      }
      if (_deleteNum <= 0) break;
    }
  }
}
export {
  stageObj,
  cacheProductPrintAreas,
  overallDesignView,
  linkageDesign,
  bgImgLinkageStart,
  convertSizeToMm,
  throttle,
  getRotatePoint,
  getStyle,
  designTextSep,
  alignmentCanvas,
  ClearBr,
  windowResize,
  calcTwoTransform,
  imgSizeCalculate,
  getTextBaseline,
  editTextSetTextareaStyle,
  getRotateNodePoint,
  getAbsoluteNodeTopLeftXY,
  getNodeCenterXY,
  destroy3DModel,
  destroy3DModelIs3D
};
