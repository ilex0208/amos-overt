//////////////////////////////
/**
 * util
 * @author ilex
 */
//////////////////////////////
let targetCanvas = document.createElement('canvas'),
  graphics = targetCanvas.getContext('2d'),
  alarmImageCache = {};
const alarmDefaulOps = {
  rgbR: 255,
  rgbA: 255
};

let isFirefox = navigator.userAgent.indexOf('Firefox') > 0;
let isIE = !(!window.attachEvent || -1 !== navigator.userAgent.indexOf('Opera'));
let isChrome = null != navigator.userAgent.toLowerCase().match(/chrome/);

/**
 * 消息器
 *
 * @param {any} name
 */
function MessageBus(name) {
  let _self = this;
  this.name = name,
    this.messageMap = {},
    this.messageCount = 0,
    this.subscribe = function(topic, action) {
      let actions = _self.messageMap[topic];
      null == actions && (_self.messageMap[topic] = []),
        _self.messageMap[topic].push(action),
        _self.messageCount++;
    },
    this.unsubscribe = function(topic) {
      let actions = _self.messageMap[topic];
      if (actions && null != actions) {
        _self.messageMap[topic] = null;
        delete _self.messageMap[topic];
        _self.messageCount--;
      }
    },
    this.publish = function(topic, data, concurrency) {
      let actions = _self.messageMap[topic];
      if (null != actions) {
        for (let f = 0; f < actions.length; f++) {
          concurrency ? ! function(action, bdata) {
            setTimeout(function() {
              action(bdata);
            },
              10);
          } (actions[f], data) : actions[f](data);
        }
      }
    };
}

/**
 * 获取两个节点之间的距离
 *
 * @param {any} p1 node节点 / 第一个节点x
 * @param {any} p2 node节点 / 第一个节点y
 * @param {any} x 第二个节点x
 * @param {any} y 第二个节点y
 * @returns
 */
function getDistance(p1, p2, x, y) {
  let dx, dy;
  return null == x && null == y ? (dx = p2.x - p1.x, dy = p2.y - p1.y) : (dx = x - p1, dy = y - p2),
    Math.sqrt(dx * dx + dy * dy);
}

/**
 * 获取鼠标坐标,返回事件本身
 *
 * @param {any} ev
 * @returns
 */
function mouseCoords(ev) {
  return ev = cloneEvent(ev),
    ev.pageX || (ev.pageX = ev.clientX + document.body.scrollLeft - document.body.clientLeft, ev.pageY = ev.clientY + document.body.scrollTop - document.body.clientTop),
    ev;
}

/**
 * 获取事件点
 *
 * @param {any} ev
 * @returns
 */
function getEventPosition(ev) {
  return ev = mouseCoords(ev);
}

/**
 * 旋转点
 *
 * @param {any} bx
 * @param {any} by
 * @param {any} x
 * @param {any} y
 * @param {any} angle
 * @returns
 */
function rotatePoint(bx, by, x, y, angle) {
  let dx = x - bx;
  let dy = y - by;
  // 获取直角三角形的斜边
  let hypotenuse = Math.sqrt(dx * dx + dy * dy);
  // 方位角加上旋转角度(弧度)
  let azimuth = Math.atan2(dy, dx) + angle;
  return {
    x: bx + Math.cos(azimuth) * hypotenuse,
    y: by + Math.sin(azimuth) * hypotenuse
  };
}

/**
 * 旋转点集合
 *
 * @param {any} target
 * @param {any} points
 * @param {any} angle
 * @returns
 */
function rotatePoints(target, points, angle) {
  let result = [];
  for (let i = 0; i < points.length; i++) {
    let p = rotatePoint(target.x, target.y, points[i].x, points[i].y, angle);
    result.push(p);
  }
  return result;
}

/**
 * 封装循环
 *
 * @param {any} datas
 * @param {any} f
 * @param {any} dur 执行间隔时间
 * @returns
 */
function _foreach(datas, f, dur) {
  if (datas.length == 0) {
    return;
  }
  let n = 0;
  function doIt(n) {
    if (n == datas.length) {
      return;
    }
    f(datas[n]);
    setTimeout(function() {
      doIt(++n);
    }, dur);
  }
  doIt(n);
}

function _for(i, m, f, dur) {
  if (m < i) {
    return;
  }
  let n = 0;
  function doIt(n) {
    if (n == m) {
      return;
    }
    f(m);
    setTimeout(function() {
      doIt(++n);
    }, dur);
  }
  doIt(n);
}

/**
 * 克隆一个事件
 * (不可隆returnValue和keyLocation)
 *
 * @param {any} ev 待克隆事件
 * @returns
 */
function cloneEvent(ev) {
  let resultEvent = {};
  for (let key in ev) {
    'returnValue' != key && 'keyLocation' != key && (resultEvent[key] = ev[key]);
  }
  return resultEvent;
}

/**
 * 完全克隆一个事件
 *
 * @param {any} ev
 * @returns
 */
function clone(ev) {
  let resultEvent = {};
  for (let key in ev) {
    resultEvent[key] = ev[key];
  }
  return resultEvent;
}

/**
 * 判断点在矩形中
 *
 * @param {any} point
 * @param {any} rect
 * @returns
 */
function isPointInRect(point, rect) {
  let _x = rect.x,
    _y = rect.y,
    _width = rect.width,
    _height = rect.height;
  return point.x > _x && point.x < _x + _width && point.y > _y && point.y < _y + _height;
}

/**
 * 判断点在线上
 *
 * @param {any} point 点
 * @param {any} path1 连线1
 * @param {any} path2 连线2
 * @returns
 */
function isPointInLine(point, path1, path2) {
  let pathDis = getDistance(path1, path2),
    path1_2_point = getDistance(path1, point),
    path2_2_point = getDistance(path2, point),
    result = Math.abs(path1_2_point + path2_2_point - pathDis) <= 0.5;
  return result;
}

/**
 * 从数组中移除指定对象
 *
 * @param {any} arr
 * @param {any} obj
 * @returns 返回新的数组
 */
function removeFromArray(arr, obj) {
  for (let i = 0; i < arr.length; i++) {
    let tempObj = arr[i];
    if (tempObj === obj) {
      arr = arr.del(i);
      break;
    }
  }
  return arr;
}

/**
 * 获取随机颜色
 *
 * @returns '[0到255], [0到255], [0到255]'
 */
function randomColor() {
  return Math.floor(255 * Math.random()) + ',' + Math.floor(255 * Math.random()) + ',' + Math.floor(255 * Math.random());
}

function isIntsect() { }

/**
 * 获取属性
 *
 * @param {any} a
 * @param {any} b
 * @returns
 */
function getProperties(obj, arr) {
  let result = '';
  for (let i = 0; i < arr.length; i++) {
    if(i > 0){
      result += ',';
    }
    let e = obj[arr[i]];
    'string' == typeof e ? e = '"' + e + '"' : void 0 == e && (e = null),
      result += arr[i] + ':' + e;
  }
  return result;
}

/**
 * 将stage中的所有元素转化成json
 *
 * @param {any} stage
 * @returns
 */
function toJson(stage) {
  let sceneProperties = 'backgroundColor,visible,mode,rotate,alpha,scaleX,scaleY,shadow,translateX,translateY,areaSelect,paintAll'.split(','),
    eleProperties = 'text,elementType,x,y,width,height,visible,alpha,rotate,scaleX,scaleY,fillColor,shadow,transformAble,zIndex,dragable,selected,showSelected,font,fontColor,textPosition,textOffsetX,textOffsetY'.split(','),
    result = '{';
  result += 'frames:' + stage.frames,
    result += ', scenes:[';
  for (let i = 0; i < stage.childs.length; i++) {
    let sceneItem = stage.childs[i];
    result += '{',
      result += getProperties(sceneItem, sceneProperties),
      result += ', elements:[';
    for (let j = 0; j < sceneItem.childs.length; j++) {
      let eleItem = sceneItem.childs[j];
      j > 0 && (result += ','),
        result += '{',
        result += getProperties(eleItem, eleProperties),
        result += '}';
    }
    result += ']}';
  }
  result += ']'; // scenes结束符
  result += '}';
  return result;
}

/**
 * 构建颜色
 *
 * @param {any} ctx canvas绘图返对象,用于在画布上绘制图像(如：canvas.getContext('2D'))
 * @param {any} img image对象
 * @param {string} rgb 如:'255,255,0'
 * @returns
 */
function generateColor(ctx, img, rgba) {
  let rgbas = rgba.split(','),
    rgbR = parseInt(rgbas[0]),
    rgbG = parseInt(rgbas[1]),
    rgbA = parseInt(rgbas[2]);
  // 采用连续赋值,将img.width赋值给canvas,接着再将canvas.width赋值给临时变量tempW（此处不可拆开）
  let tmpW = targetCanvas.width = img.width,
    tmpH = targetCanvas.height = img.height;
  ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height),
    ctx.drawImage(img, 0, 0);
  // 返回 ImageData 对象，该对象为画布上指定的矩形复制像素数据
  let imgData = ctx.getImageData(0, 0, img.width, img.height);
  // 返回Uint8ClampedArray, RGBA, 0到255
  let data = imgData.data;
  for (let i = 0; i < tmpW; i++) {
    for (let j = 0; j < tmpH; j++) {
      // 构建数据索引:imagedata读取的像素数据存储在data属性里，是从上到下，从左到右的，每个像素需要占用4位数据，分别是r,g,b,alpha透明通道
      let dataIndex = 4 * (i + j * tmpW);
      0 != data[dataIndex + 3] && (
        null != rgbR && (data[dataIndex + 0] += rgbR),
        null != rgbG && (data[dataIndex + 1] += rgbG),
        null != rgbA && (data[dataIndex + 2] += rgbA)
      );
    }
  }
  ctx.putImageData(imgData, 0, 0, 0, 0, img.width, img.height);
  let dataUrl = targetCanvas.toDataURL();
  return dataUrl;
}
  // function genImageAlarm(a, b) {
  //   var c = a.src + b;
  //   if (alarmImageCache[c]) return alarmImageCache[c];
  //   var d = new Image;
  //   return d.src = changeColor(graphics, a, b),
  //   alarmImageCache[c] = d,
  //   d
  // }
/**
 * 构建告警image
 *
 * @param {any} image
 * @param {number} rgb
 * @returns
 */
function generateImageAlarm(img, alarmColor) {
  let imgSrc = img.src + alarmColor;
  try {
    if (alarmImageCache[imgSrc]) {
      return alarmImageCache[imgSrc];
    }
    else
    {
      let alarmImg = new Image;
      alarmImg.src = generateColor(graphics, img, alarmColor);
      alarmImageCache[imgSrc] = alarmImg;
      return alarmImg;
    }
  } catch (ex) {
    console.log('genImageAlarm error|@', ex);
  }
  return null;
}

/**
 * 构建颜色
 *
 * @param {any} ctx canvas绘图返对象,用于在画布上绘制图像(如：canvas.getContext('2D'))
 * @param {any} img image对象
 * @param {number} rgbR integer values between 0 and 255 (included)
 * @param {any} rgbG
 * @param {any} rgbB
 * @param {any} rgbA alpha 0~255
 * @returns
 */
function changeColor(ctx, img, rgbR, rgbG, rgbB, rgbA) {
  // 采用连续赋值,将img.width赋值给canvas,接着再将canvas.width赋值给临时变量tempW（此处不可拆开）
  let tmpW = targetCanvas.width = img.width,
    tmpH = targetCanvas.height = img.height;
  ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height),
    ctx.drawImage(img, 0, 0);
  // 返回 ImageData 对象，该对象为画布上指定的矩形复制像素数据
  let imgData = ctx.getImageData(0, 0, img.width, img.height);
  // 返回Uint8ClampedArray, RGBA, 0到255
  let data = imgData.data;
  for (let i = 0; i < tmpW; i++) {
    for (let j = 0; j < tmpH; j++) {
      // 构建数据索引:imagedata读取的像素数据存储在data属性里，是从上到下，从左到右的，每个像素需要占用4位数据，分别是r,g,b,alpha透明通道
      let dataIndex = 4 * (i + j * tmpW);
      if(0 != data[dataIndex + 3]){
        null != rgbR && (data[dataIndex + 0] += rgbR);
        null != rgbG && (data[dataIndex + 1] += rgbG);
        null != rgbB && (data[dataIndex + 2] += rgbB);
      }
      // 0 != data[dataIndex + 3] && (null != rgbData && (data[dataIndex + 0] += rgbData), null != d && (data[dataIndex + 1] += d), null != e && (data[dataIndex + 2] += e));
    }
  }
  ctx.putImageData(imgData, 0, 0, 0, 0, img.width, img.height);
  let dataUrl = targetCanvas.toDataURL();
  return alarmImageCache[img.src] = dataUrl, dataUrl;
}

/**
 * 通过具体的属性构建颜色
 *
 * @param {any} ctx canvas绘图返对象,用于在画布上绘制图像(如：canvas.getContext('2D'))
 * @param {any} img image对象
 * @param {number} rgbR integer values between 0 and 255 (included)
 * @param {any} rgbG
 * @param {any} rgbB
 * @param {any} rgbA alpha 0~255
 * @returns
 */
function changeColorByOpts(ctx, img, alarmOps) {
  let _alarmOps = Object.assign(alarmDefaulOps, alarmOps);
  let rgbR = _alarmOps.rgbR;
  let rgbG = _alarmOps.rgbG;
  let rgbB = _alarmOps.rgbB;
  let rgbA = _alarmOps.rgbA;
  targetCanvas.width = img.width,
  targetCanvas.height = img.height;
  ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height),
    ctx.drawImage(img, 0, 0);
  // 返回 ImageData 对象，该对象为画布上指定的矩形复制像素数据
  let imgData = ctx.getImageData(0, 0, img.width, img.height);
  // 返回Uint8ClampedArray, RGBA, 0到255
  let data = imgData.data;
  for (var i = 0; i < data.length; i += 4)
  {
    if(data[i + 3] != 0){
      null != rgbR && (data[i + 0] += rgbR);// R - 红色（0-255）
      null != rgbG && (data[i + 1] += rgbG);// G - 绿色（0-255）
      null != rgbB && (data[i + 2] += rgbB);// B - 蓝色（0-255）
      data[i + 3] = rgbA;// A - alpha 通道（0-255; 0 是透明的，255 是完全可见的）
    }
  }
  ctx.putImageData(imgData, 0, 0, 0, 0, img.width, img.height);
  let dataUrl = targetCanvas.toDataURL();
  return alarmImageCache[img.src] = dataUrl, dataUrl;
}

/**
 * 构建告警image
 *
 * @param {any} image
 * @param {number} rgbR RGBA 各个取值
 * @returns
 */
function genImageAlarm(img, rgbR) {
  rgbR = rgbR || 255;
  try {
    if (alarmImageCache[img.src]) {
      return alarmImageCache[img.src];
    }
    else
    {
      let alarmImg = new Image;
      alarmImg.src = changeColor(graphics, img, rgbR);
      alarmImageCache[img.src] = alarmImg;
      return alarmImg;
    }
  } catch (ex) {
    console.log('genImageAlarm error|@', ex);
  }
  return null;
}

/**
 * 构建告警image
 *
 * @param {any} image
 * @param {Object} alarmImgOps RGBA 各个取值
 * @returns
 */
function genImageAlarmByOpts(img, alarmImgOps) {
  let _ops = Object.assign(alarmDefaulOps, alarmImgOps);
  try {
    if (alarmImageCache[img.src]) {
      return alarmImageCache[img.src];
    }
    else
    {
      let alarmImg = new Image;
      alarmImg.src = changeColorByOpts(graphics, img, _ops.rgbR);
      alarmImageCache[img.src] = alarmImg;
      return alarmImg;
    }
  } catch (ex) {
    console.log('genImageAlarmByOpts error|@', ex);
  }
  return null;
}

/**
 * 获取偏移位置
 *
 * @param {any} domEle dom元素
 * @returns
 */
function getOffsetPosition(domEle) {
  if (!domEle) {
    return {
      left: 0,
      top: 0
    };
  }
  let _top = 0, _left = 0;
  if ('getBoundingClientRect' in document.documentElement) {
    let clientRect = domEle.getBoundingClientRect(),
      ownerDoc = domEle.ownerDocument,
      _body = ownerDoc.body,
      _de = ownerDoc.documentElement,
      tempTop = _de.clientTop || _body.clientTop || 0,
      tempLeft = _de.clientLeft || _body.clientLeft || 0;
    _top = clientRect.top + (self.pageYOffset || _de && _de.scrollTop || _body.scrollTop) - tempTop,
      _left = clientRect.left + (self.pageXOffset || _de && _de.scrollLeft || _body.scrollLeft) - tempLeft;
  } else {
    do {
      _top += domEle.offsetTop || 0,
        _left += domEle.offsetLeft || 0,
        domEle = domEle.offsetParent;
    }
    while (domEle);
  }
  return {
    left: _left,
    top: _top
  };
}

/**
 * 获取Line
 *
 * @param {any} x1
 * @param {any} y1
 * @param {any} x2
 * @param {any} y2
 * @returns
 */
function lineF(x1, y1, x2, y2) {
  let tmpYdividedX = (y2 - y1) / (x2 - x1),
    tmpY = y1 - x1 * tmpYdividedX;
  /**
   * 内置对象
   *
   * @param {any} num
   * @returns
   */
  function CalcLine(num) {
    return num * tmpYdividedX + tmpY;
  }
  CalcLine.k = tmpYdividedX,
    CalcLine.b = tmpY,
    CalcLine.x1 = x1,
    CalcLine.x2 = x2,
    CalcLine.y1 = y1,
    CalcLine.y2 = y2;
  return CalcLine;
}

/**
 * 判断在范围
 *
 * @param {number} range 范围
 * @param {number} num1
 * @param {number} num2
 * @returns
 */
function inRange(range, num1, num2) {
  let minus = Math.abs(num1 - num2),
    rangeNum1 = Math.abs(num1 - range),
    rangeNum2 = Math.abs(num2 - range),
    result = Math.abs(minus - (rangeNum1 + rangeNum2));
  return 1e-6 > result ? true : false;
}

/**
 * 判断点在线的有效范围内
 *
 * @param {number} xRange x范围
 * @param {number} yRange y范围
 * @param {Object} point
 * @returns
 */
function isPointInLineSeg(xRange, yRange, point) {
  return inRange(xRange, point.x1, point.x2) && inRange(yRange, point.y1, point.y2);
}

/**
 * 获取交叉点
 *
 * @param {any} a
 * @param {any} b
 * @returns
 */
function intersection(calcLine1, calcLine2) {
  let $x, $y;
  return calcLine1.k == calcLine2.k ?
    null
    :
    (
      1 / 0 == calcLine1.k || calcLine1.k == -1 / 0 ?
      ($x = calcLine1.x1,$y = calcLine2(calcLine1.x1))
      :
      1 / 0 == calcLine2.k || calcLine2.k == -1 / 0 ?
      ($x = calcLine2.x1,$y = calcLine1(calcLine2.x1))
      :
      ($x = (calcLine2.b - calcLine1.b) / (calcLine1.k - calcLine2.k), $y = calcLine1($x)),
      0 == isPointInLineSeg($x, $y, calcLine1) ?
      null
      :
      0 == isPointInLineSeg($x, $y, calcLine2) ?
      null
      :
      {x: $x, y: $y}
  );
}

/**
 * 获取交叉线的bound
 *
 * @param {any} calcLine lineF返回的CalcLine对象
 * @param {any} bound
 * @returns
 */
function intersectionLineBound(calcLine, bound) {
  // 临时CalcLine
  let tempCalcLine = lineF(bound.left, bound.top, bound.left, bound.bottom);
  // 交叉点
  let resultBound = intersection(calcLine, tempCalcLine);
  return null == resultBound && (
    tempCalcLine = lineF(bound.left, bound.top, bound.right, bound.top),
    resultBound = intersection(calcLine, tempCalcLine),
    null == resultBound && (
      tempCalcLine = lineF(bound.right, bound.top, bound.right, bound.bottom),
      resultBound = intersection(calcLine, tempCalcLine),
      null == resultBound && (
        tempCalcLine = lineF(bound.left, bound.bottom, bound.right, bound.bottom),
        resultBound = intersection(calcLine, tempCalcLine)
      )
    )
  ),
    resultBound;
}

// requestAnim shim layer by ilex
requestAnimationFrame = (function(){
  return  window.requestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.msRequestAnimationFrame ||
          window.oRequestAnimationFrame  ||
          function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000 / 24);
          };
})();
// 使用方式
// function animate() {
//     requestAnimFrame(animate);
//     draw();
// }

// requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame ||
//   function(callback) {
//     setTimeout(callback, 1000 / 24);
//   };

// 对requestAnimationFrame更牢靠的封装
// (function() {
//   var lastTime = 0;
//   var vendors = ['moz','webkit', 'ms', 'o'];
//   for(var i = 0; i < vendors.length && !window.requestAnimationFrame; i++) {
//     window.requestAnimationFrame = window[vendors[i]+'RequestAnimationFrame'];
//     window.cancelAnimationFrame = window[vendors[i]+'CancelAnimationFrame'] || window[vendors[i]+'CancelRequestAnimationFrame'];
//   }
//   if (!window.requestAnimationFrame){
//     window.requestAnimationFrame = function(callback, element) {
//       var currTime = new Date().getTime();
//       var timeToCall = Math.max(0, 16 - (currTime - lastTime));
//       var id = window.setTimeout(function() {
//         callback(currTime + timeToCall);
//       }, timeToCall);
//       lastTime = currTime + timeToCall;
//       return id;
//     };
//   }

//   if (!window.cancelAnimationFrame){
//     window.cancelAnimationFrame = function(id) {
//       clearTimeout(id);
//     };
//   }
// }());
/**
 * 扩展array方法,添加del
 * @param {any} tar 需要删除的目标索引或者目标值
 */
Array.prototype.del = function(tar) {
  if (typeof targetObj != 'number') {
    for (let i = 0; i < this.length; i++) {
      if (this[i] === tar) {
        return this.slice(0, i).concat(this.slice(i + 1, this.length));
      }
    }
    return this;
  } else {
    if (tar < 0) {
      return this;
    }
    return this.slice(0, tar).concat(this.slice(tar + 1, this.length));
  }
};

/**
 * 给不支持indexOf方法的环境添加indexOf
 * 用于返回指定数据的索引
 */
if (![].indexOf) { //IE
  Array.prototype.indexOf = function(data) {
    for (let i = 0; i < this.length; i++) {
      if (this[i] === data) {
        return i;
      }
    }
    return -1;
  };
}

/**
 * 给不支持console的环境添加
 */
if (!window.console) { //IE
  window.console = {
    log: function(msg) { },
    info: function(msg) { },
    debug: function(msg) { },
    warn: function(msg) { },
    error: function(msg) { }
  };
}

module.exports = {
  MessageBus: MessageBus,
  rotatePoint: rotatePoint,
  rotatePoints: rotatePoints,
  getDistance: getDistance,
  getEventPosition: getEventPosition,
  mouseCoords: mouseCoords,
  isFirefox: isFirefox,
  isIE: isIE,
  isChrome: isChrome,
  clone: clone,
  isPointInRect: isPointInRect,
  isPointInLine: isPointInLine,
  removeFromArray: removeFromArray,
  cloneEvent: cloneEvent,
  randomColor: randomColor,
  isIntsect: isIntsect,
  toJson: toJson,
  genImageAlarm: genImageAlarm,
  genImageAlarmByOpts: genImageAlarmByOpts,
  generateImageAlarm: generateImageAlarm,
  getOffsetPosition: getOffsetPosition,
  lineF: lineF,
  intersection: intersection,
  intersectionLineBound: intersectionLineBound,
  _foreach: _foreach,
  _for: _for
};
