import Color from "./color";
import { _getFontFamily } from "@/apis/text.js";
import store from '../store';
import {SDKCONFIG} from './sdkConfig';
let startLoadFont = false
let fontList = []
// 节流
export const throttle = (fn, wait = 500, isImmediate = false) => {
  let timerId = null;
  let flag = true;
  let resultFunc = null;
  if (isImmediate) {
    resultFunc = function () {
      let context = this;
      clearTimeout(timerId);
      if (flag) {
        fn.apply(context, arguments);
        flag = false;
      }
      timerId = setTimeout(() => {
        flag = true;
      }, wait);
    };
    resultFunc.cancel = function () {
      clearTimeout(timerId);
      flag = true;
    };
  } else {
    resultFunc = function () {
      let context = this;
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        fn.apply(context, arguments);
      }, wait);
    };
    resultFunc.cancel = function () {
      clearTimeout(timerId);
    };
  }
  return resultFunc;
}

// export const throttle2 = (func, wait = 500) => {
//   let timer = null;
//   return (...args) => {
//     if(timer) return;
//     timer = setTimeout(() => {
//       func.call(this, ...args);
//       timer = null;
//     }, wait);
//   }
// };

// 防抖
export const debounce = (func, wait = 500, immediate = true) => {
  let timer = null;
  return (...args) => {
    if (timer) {
      clearTimeout(timer);
    }
    if(immediate){
      func.apply(this, args);
      immediate = false;
      timer = setTimeout(()=>{
        timer = null;
      }, wait)
    } else {
      timer = setTimeout(() => {
        func.apply(this, args);
        immediate = true;
      }, wait);
    }
  };
};

// 深克隆
export function deepClone(data) {
  var type = getType(data);
  var obj;
  if (type === "array") {
    obj = [];
  } else if (type === "object") {
    obj = {};
  } else {
    //不再具有下一层次
    return data;
  }
  if (type === "array") {
    for (var i = 0, len = data.length; i < len; i++) {
      obj.push(deepClone(data[i]));
    }
  } else if (type === "object") {
    for (var key in data) {
      obj[key] = deepClone(data[key]);
    }
  }
  return obj;
}

// 判断对象类型
function getType(obj) {
  if (obj === null) return "null";
  if (obj === undefined) return "undefined";
  return Object.prototype.toString
    .call(obj)
    .slice(8, -1)
    .toLowerCase();
}

// 判断是否为空
export const isEmpty = (v) => {
  if (typeof v == "undefined" || v == null || v == "") {
    return true;
  }
  return (
    (Array.isArray(v) && v.length == 0) ||
    (Object.prototype.isPrototypeOf(v) && Object.keys(v).length == 0)
  );
};

// 获取当前时间
export const p = (s) => {
  return s < 10 ? "0" + s : s;
};
export const getCurTime = (time) => {
  var myDate = time ? new Date(time) : new Date();
  var year = myDate.getFullYear();
  var month = myDate.getMonth() + 1;
  var date = myDate.getDate();
  var h = myDate.getHours();
  var m = myDate.getMinutes();
  var s = myDate.getSeconds();
  return (
    year + "-" + p(month) + "-" + p(date) + " " + p(h) + ":" + p(m) + ":" + p(s)
  );
};

export const _channelInputLimit = (e) => {
  let key = e.key;
  // 不允许输入'e'和'.'
  if (key === "e" || key === ".") {
    e.returnValue = false;
    return false;
  }
  return true;
};
//保留两位小数
export const _two_decimal = (e, data, key) => {
  e.target.value = e.target.value.replace(/[^\d.]/g, "");
  e.target.value = e.target.value.replace(/^\./g, "");
  e.target.value = e.target.value.replace(/\.{2,}/g, ".");
  e.target.value = e.target.value
    .replace(".", "$#$")
    .replace(/\./g, "")
    .replace("$#$", ".");
  e.target.value = e.target.value.replace(/([0-9]+\.[0-9]{2})[0-9]*/, "$1");
  if (data && key) {
    data[key] = e.target.value;
  }
};

// 全屏/取消全屏
export const changeFullScreen = (status) => {
  if (status == 1) {
    let doc = document.documentElement || document.body;
    if (doc.requestFullscreen) {
      // W3C
      doc.requestFullscreen();
    } else if (doc.mozRequestFullScreen) {
      // Firefox
      doc.mozRequestFullScreen();
    } else if (doc.webkitRequestFullScreen) {
      // Chrome等
      doc.webkitRequestFullScreen();
    } else if (doc.msRequestFullscreen) {
      doc.msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
};

// 判断元素是否可见
export const isEleHidden = (element) => {
  return element.offsetParent === null;
};

export const formateColor = ({ color }) => {
  if (!color || color == 'transparent') {
    return {
      value: '',
      alpha: '',
      color: ''
    };
  } else {
    const formateColor = new Color({
      enableAlpha: false,
      format: "hex",
    });
    formateColor.fromString(color);
    return {
      value: formateColor.value,
      alpha: formateColor._alpha / 100,
      color: color,
    };
  }
}
export const getFonts = function () {
  startLoadFont = true
  return new Promise((resolve) => {
    _getFontFamily().then(res => {
      let data = Object.values(res.data);
      let fontFamilyList = [];
      for (let el of data) {
        let obj = {
          hasNormalFontType: "",
          hasBoldFontType: "",
          hasItalicFontType: "",
          hasBoldAndItalicFontType: ""
        };
        let fontFamilieId = el.id;
        obj.id = fontFamilieId;
        obj.label = el.cn_name || el.name;
        for (let font of el.fonts) {
          let { id, name, style, ttf, weight, woff } = font;
          let fontName =
            name + "_" + fontFamilieId + "_" + id + "_" + font.name;
          if (style == "normal" && weight == "normal") {
            obj.hasNormalFontType = fontName;
          } else if (style == "normal" && weight == "bold") {
            obj.hasBoldFontType = fontName;
          } else if (style == "italic" && weight == "normal") {
            obj.hasItalicFontType = fontName;
          } else if (style == "italic" && weight == "bold") {
            obj.hasBoldAndItalicFontType = fontName;
          }
          if(process.env.NODE_ENV === 'development'){
            woff = woff.replace(/^http:\/\/[^/]+/, "");
            ttf = ttf.replace(/^http:\/\/[^/]+/, "");
          }
          let src = "";
          if (ttf && woff) {
            src =
              'url("' +
              woff +
              '") format("woff"),' +
              'url("' +
              ttf +
              '") format("truetype")';
          } else if (ttf && !woff) {
            src = 'url("' + ttf + '") format("truetype")';
          } else if (!ttf && woff) {
            src = 'url("' + woff + '") format("woff")';
          }
          obj.value = fontName;
          obj.src = src
          obj.weight = weight
          obj.style = style
          obj.bold = font.bold
        }
        fontFamilyList.push(obj);
      }
      fontList = JSON.parse(JSON.stringify(fontFamilyList))
      resolve()
      store.commit("layout/setfontFamilyList", fontFamilyList);
    });
  })
}
export function amazonLoadFont(fontFamily, font, all) {
  return new Promise(async (resolve) => {
    await checkGetFontList()
    let _fontFamily = fontFamily
    let fontObj = JSON.parse(JSON.stringify(font))
    let item = fontList.find(item => item.value.includes(_fontFamily))
    if(item) { //亚马逊订单的字体使用的是我们平台有的字体
      _fontFamily = item.value
      fontObj.src = item.src //font要传回出去给designReferenceDrawingPop.vue使用，所以这里给fontObj赋值
    } else {
      if(fontObj.src === '') { //服务器没有字体，取平台第一个字体
        _fontFamily = fontList[0].value
      } else {
        fontList = fontList.concat(fontObj)
      }
    }
    fontObj.value = _fontFamily
    await loadFont(_fontFamily, all)
    resolve(fontObj)
  })
}
export function loadFont(fontFamily, all) {
  return new Promise(async (resolve, reject) => {
    await checkGetFontList()
    const fontObj = fontList.find(item => item.value === fontFamily)
    if (document.fonts && !checkFont(fontObj.value)) {
      let fontFace = new FontFace(fontObj.value, fontObj.src, { weight: fontObj.weight, style: fontObj.style });
      fontFace.load().then(function (loadedFontFace) {
        document.fonts.add(loadedFontFace);
        if (loadedFontFace.family == fontObj.value) {
          resolve()
        }
      }).catch(e => {
      }).finally(() => {
        resolve()
      });
    } else {
      resolve();
    }
    if(all) {
      for(let item of fontList) {
        if (document.fonts && !checkFont(item.value)) {
          let fontFace = new FontFace(item.value, item.src, { weight: item.weight, style: item.style });
          await fontFace.load().then(function (loadedFontFace) {
            document.fonts.add(loadedFontFace);
          })
        }
      }
    }
  });
}
export function checkFont(name) {
  let values = document.fonts.values();
  let isHave = false;
  let item = values.next();
  while (!item.done && !isHave) {
    let fontFace = item.value;
    if (fontFace.family == name) {
      isHave = true;
    }
    item = values.next();
  }
  return isHave;
}
function checkGetFontList() {
  return new Promise(async (resolve) => {
    if(!startLoadFont) {
      await getFonts()

    }
    if(!fontList.length) {
      const interval = setInterval(() => {
        if(fontList.length) {
          resolve()
          clearInterval(interval)
        }
      }, 100)
    } else {
      resolve()
    }
  })
}

// 判断系统类型, windows or mac
export function checkPlatform() {
  let u = window.navigator.userAgent;
  if (u.indexOf("Windows NT") > -1) {
    return "windows";
  } else if (u.indexOf("Mac") > -1) {
    return "mac";
  } else {
    return "";
  }
}

// 获取快捷键映射数据
export function getShortcutsMap(data) {
  let ret = {};
  for (let panel of data) {
    let iData = panel.data;
    if (panel.hasGroup) {
      iData = iData.reduce((prev, cur) => {
        prev = prev.concat(cur.data);
        return prev;
      }, []);
    }
    for (let item of iData) {
      if (item.hasMultiple) {
        for (let i = 0; i < item.items.length; i++) {
          ret[item.items[i].id] = item.items[i];
        }
      } else {
        ret[item.id] = item;
      }
    }
  }
  return ret;
}

//获取地址栏参数
 export function GetQueryString(name){
  // var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
  // var r = window.location.search.substr(1).match(reg);
  // if(r!=null)return  unescape(r[2]); return null;
  const map = (window.location.href.match(/([^?#=&]+)=([^&]*)/g) || []).reduce(
    (a, v) => (
      (a[v.slice(0, v.indexOf("="))] = v.slice(v.indexOf("=") + 1)), a
    ),
    {}
  );
  return map[name] || null;
}

//获取地址栏所有参数
export function GetAllQueryString(){
  let queryObj = {}
  window.location.search.substr(1).split("&").forEach(item => {
    queryObj[item.split('=')[0]] = decodeURI(item.split('=')[1])
  })
  return queryObj
}

// 动态加载js文件
export function asyncLoadJS(url){
  return new Promise((resolve, reject) => {
    let srcArr = document.getElementsByTagName('script'); 
    let hasLoaded = false;
    for(let i=0; i<srcArr.length; i++){
      if(srcArr[i].src == url) {
        hasLoaded = true;
        break;
      }
    }
    if(hasLoaded){
      resolve();
      return;
    }
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    document.body.appendChild(script);
    script.onload = () => {
      resolve();
    }
    script.onerror = () => {
      reject();
    }
  });
}

// 动态加载css文件
export function asyncLoadCSS(url){
  return new Promise((resolve, reject) => {
    let srcArr = document.getElementsByTagName('link'); 
    let hasLoaded = false;
    for(let i=0; i<srcArr.length; i++){
      if(srcArr[i].href == url) {
        hasLoaded = true;
        break;
      }
    }
    if(hasLoaded){
      resolve();
      return;
    }
    let link = document.createElement('link');
    link.type = 'text/css';
    link.href = url;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    link.onload = () => {
      resolve();
    }
    link.onerror = () => {
      reject();
    }
  });
}

export function getBrowserInfo(){
  var agent = navigator.userAgent.toLowerCase() ;
  var regStr_ie = /msie [\d.]+;/gi ;
  var regStr_ff = /firefox\/[\d.]+/gi
  var regStr_chrome = /chrome\/[\d.]+/gi ;
  var regStr_saf = /safari\/[\d.]+/gi ;
  //IE
  if(agent.indexOf("msie") > 0) {
    return agent.match(regStr_ie) ;
  }
  //firefox
  if(agent.indexOf("firefox") > 0) {
    return agent.match(regStr_ff) ;
  }
  //Safari
  if(agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0){
    return agent.match(regStr_saf) ;
  }
  //Chrome
  if(agent.indexOf("chrome") > 0) {
    return agent.match(regStr_chrome) ;
  } 
}

export function genLocalStorageKey(key){
  let prefix = '';
  if(SDKCONFIG.platform != 'ZWKJ'){
    prefix = `SDK${SDKCONFIG.platform}${SDKCONFIG.customerCode}${SDKCONFIG.storeCode}_`;
  }
  return prefix + key;
}

export function getSDKUserCode(options){
  let userCode = options.userInfo.code || '';
  const localStorageKey = genLocalStorageKey('customerRandomCode');
  if(!userCode){
    let randomCode = localStorage.getItem(localStorageKey);
    if(randomCode){
      userCode = randomCode
    } else {
      userCode = options.storeInfo.storeCode + new Date().getTime() + parseInt(Math.random()*1000000000);
      localStorage.setItem(localStorageKey, userCode);
    }
  }
  return userCode;
}

// 旋转角度转换, 角度转化为[-180, 180]
export const rotateConvert = (rotate) => {
  rotate = parseFloat(rotate || 0) % 360;
  if(rotate > 180) {
    return rotate - 360
  } else if(rotate < -180) {
    return rotate + 180
  }
  return rotate;
}

// 图片全部加载完毕
export const loadImgs = (urls = [], crossOrigin) => {
  const loadImg = (url) => {
    return new Promise((resolve, reject) => {
      if(!url) resolve('')
      const image = new Image();
      image.src = url;
      image.setAttribute("crossOrigin", crossOrigin || "anonymous");
      image.onload = () => { resolve(image) }
      image.onerror = () => { reject() }
    });
  }
  const promises = urls.map(url => loadImg(url));
  return Promise.all(promises);
}

// 计算点nodePoint绕中心点centerPoint旋转某个角度后的坐标
export const getPointAfterRotate = ({nodePoint, centerPoint, rotate=0}) => {
  let nodeRotate = rotate * Math.PI / 180
  return {
    x: (nodePoint.x - centerPoint.x) * Math.cos(nodeRotate) - (nodePoint.y - centerPoint.y) * Math.sin(nodeRotate) + centerPoint.x,
    y: (nodePoint.x - centerPoint.x) * Math.sin(nodeRotate) + (nodePoint.y - centerPoint.y) * Math.cos(nodeRotate) + centerPoint.y
  }
}

// 已知元素中心点，求元素绕中心点centerPoint旋转某个角度后的四个角的坐标
export const getNodePointAfterRotate = ({node, centerPoint, rotate=0}) => {
  centerPoint = centerPoint || {x: node.x(), y: node.y()}
  let nodeWidth = Math.abs(node.width() * node.scaleX())
  let nodeHeight = Math.abs(node.height() * node.scaleY())
  let p1 = {x: node.x() - nodeWidth/2, y: node.y() - nodeHeight/2}
  let p2 = {x: node.x() + nodeWidth/2, y: node.y() - nodeHeight/2}
  let p3 = {x: node.x() + nodeWidth/2, y: node.y() + nodeHeight/2}
  let p4 = {x: node.x() - nodeWidth/2, y: node.y() + nodeHeight/2}
  let points = {
    p1: getPointAfterRotate({nodePoint: p1, centerPoint, rotate}),
    p2: getPointAfterRotate({nodePoint: p2, centerPoint, rotate}),
    p3: getPointAfterRotate({nodePoint: p3, centerPoint, rotate}),
    p4: getPointAfterRotate({nodePoint: p4, centerPoint, rotate}),
    width: nodeWidth,
    height: nodeHeight
  }
  return points;
}

// 已知元素左上角坐标，求元素中心点坐标
export const getNodeCenterPoint = (point, width, height, rotate=0) => {
  return getPointAfterRotate({
    nodePoint: {
      x: point.x + width / 2,
      y: point.y + height / 2
    },
    centerPoint: point,
    rotate,
  });
}

// 已知元素中心点坐标，求元素左上角坐标
export const getNodeLTPoint = (point, width, height, rotate=0) => {
  return getPointAfterRotate({
    nodePoint: {
      x: point.x - width / 2,
      y: point.y - height / 2
    },
    centerPoint: point,
    rotate,
  });
}

// 获取多个元素最大矩形大小
export const getNodesClientRect = (nodes) => {
  let xArr = [], yArr = [];
  [].forEach.call(nodes, node => {
    const nodeRect = node.getClientRect();
    xArr.push(nodeRect.x, nodeRect.x + width);
    yArr.push(nodeRect.y, nodeRect.y + nodeRect.height);
  })
  const minX = Math.min(...xArr);
  const maxX = Math.max(...xArr);
  const minY = Math.min(...yArr);
  const maxY = Math.max(...yArr);
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  }
}

// 获取事件的点相对于印刷区域的实际坐标
export const getEventPoint = (e, layer) => {
  let {layerX, layerY} = e
  let stage = layer.getStage()
  let scaleX = layer.scaleX(), scaleY = layer.scaleY()
  return {
    x: (layerX - stage.x()) / scaleX - layer.x(),
    y: (layerY - stage.y()) / scaleY - layer.y()
  }
}

// 获取节点在解绑后的位置
export const getUnbindNodeAttrs = (group, node) => {
  const groupAttrs = group.getAttrs();
  const nodeAttrs = node.getAttrs();
  const transform = group
    .getTransform()
    .copy()
    .multiply(node.getTransform().copy());
  let scaleX = (nodeAttrs.scaleX || 1) * (groupAttrs.scaleX || 1);
  let scaleY = (nodeAttrs.scaleY || 1) * (groupAttrs.scaleY || 1);
  let rotation = rotateConvert(
    (nodeAttrs.rotation || 0) + (groupAttrs.rotation || 0)
  );
  // 计算中心点位置
  const ltPoint = { x: transform.m[4], y: transform.m[5] };
  const centerPoint = getNodeCenterPoint(
    ltPoint,
    node.width() * scaleX,
    node.height() * scaleY,
    rotation
  );
  return {
    scaleX,
    scaleY,
    rotation,
    x: centerPoint.x,
    y: centerPoint.y,
  };
}

// 计算元素以中心点放大/缩小之后，左上角坐标的变化
export const getLTPointChange = (before, after, rotate) => {
  console.log(before, after, rotate)
  // 假设中心点为(0,0)
  const centerPoint = {x: 0, y: 0};
  const point1 = getNodeLTPoint(centerPoint, before.width, before.height, rotate);
  const point2 = getNodeLTPoint(centerPoint, after.width, after.height, rotate);
  return {
    changeX: point2.x - point1.x,
    changeY: point2.y - point1.y
  }
}

// 计算组元素放大/缩小后,中心点的变化
export const getCenterPointChange = (before, after, rotate) => {
  // 假设左上角坐标(0,0)
  const ltPoint = {x: 0, y: 0};
  const point1 = getNodeCenterPoint(ltPoint, before.width, before.height, rotate);
  const point2 = getNodeCenterPoint(ltPoint, after.width, after.height, rotate);
  return {
    x: point2.x - point1.x,
    y: point2.y - point1.y
  }
}