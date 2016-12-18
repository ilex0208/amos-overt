const colorUtil = require('./core/colorUtil');
const Container = require('./_container');
const _n = require('./_node');
const Node = _n.Node;
const _cons = require('./constants/');
const Bd = _cons.Bd;
const span = 5;

function Tree(rootDom, _scene, treeName, img) {
  this.__divPool = new Otree.Pool("div", 20),
    this.__imagePool = new Otree.Pool("img", 20),
    this.__canvasPool = new Otree.Pool("canvas", 20),
    this.__spanPool = new Otree.Pool("span", 20),
    this.__textPool = new Otree.Pool("span", 20),
    this.rootDom = rootDom,
    this.treeDatas = buildTreeData(_scene, treeName);
  let tempImg;
  typeof img === 'string' ? (tempImg = new Image(), tempImg.src = img) : (tempImg = img);
  this.paintTree = function () {
    _rowHeight = 30;
    _rowLineWidth = 10;
    _rowLineColor = '#CCC';
    var _lineHeight = _rowHeight - _rowLineWidth - 2 + "px";
    this.treeDatas.forEach((d, i) => {
      let _div = Otree.createDiv();
      let sty = _div.style;
       sty.position = "absolute",
        sty.whiteSpace = "nowrap",
        sty.lineHeight = _lineHeight,
        sty.top = i * _rowHeight + "px",
        sty.borderStyle = "solid",
        sty.borderWidth = "0px",
        sty.borderBottomWidth = _rowLineWidth + "px",
        sty.borderBottomColor = _rowLineColor,
      rootDom.appendChild(_addIcon2(_div, d, tempImg));
      let span = Otree.createSpan();
      span.style.margin = '0';
      span.padding = '1px 2px';
      span.whiteSpace = 'nowrap';
      span.verticalAlign = 'middle';
      span.innerHTML = d.name;
      _div.appendChild(span);
    });
  };
  this.paintTree();
}

/**
 * 构建树 data
 *
 * @param {any} scene
 * @param {any} treeName
 * @returns
 */
function buildTreeData(scene, treeName) {
  let result = [];
  let rootData = {
    name: 'Root' || treeName,
    icon: 'root',
    level: 1,
    eleId: scene.getId()
  };
  result.push(rootData);
  scene.childs && (
    scene.childs.forEach(
      (item, index) => {
        item instanceof Container && (
          result.push({
            name: item.text || '   ',
            icon: 'container',
            level: 2,
            eleId: item.getId(),
            alarmColor: item.alarmColor
          })
        );
        item instanceof Node && (
          result.push({
            name: item.text || 'Node',
            icon: 'node',
            level: 3,
            eleleIde: item.getId(),
            alarmColor: item.alarmColor
          })
        );
      }
    )
  );
  return result;
}

let Otree = {
  preventDefault: function(ev) {
      if (Bd.KEEP_DEFAULT_FUNCTION(ev)) return;
      ev.preventDefault ? ev.preventDefault() : ev.preventManipulation ? ev.preventManipulation() : ev.returnValue = false
  },
  createImg: function (imgSrc) {
    var b = document.createElement("img");
    return b.style.position = "absolute",
      typeof imgSrc == "string" && b.setAttribute("src", imgSrc),
      b
  },
  createView: function (overflow, b) {
    var _div = document.createElement("div");
    return _div.style.position = Bd.VIEW_POSITION,
      _div.style.fontSize = Bd.VIEW_FONT_SIZE,
      _div.style.fontFamily = Bd.VIEW_FONT_FAMILY,
      _div.style.cursor = "default",
      _div.style.outline = "none",
      _div.style.textAlign = "left",
      _div.style.msTouchAction = "none",
      _div.tabIndex = 0,
      b || (_div.onmousedown = Otree.preventDefault),
      _div.style.setProperty && (_div.style.setProperty("-khtml-user-select", "none", null), _div.style.setProperty("-webkit-user-select", "none", null), _div.style.setProperty("-moz-user-select", "none", null), _div.style.setProperty("-webkit-tap-highlight-color", "rgba(0, 0, 0, 0)", null)),
      overflow && (_div.style.overflow = overflow),
      _div
  },
  createDiv: function () {
    var a = document.createElement("div");
    return a.style.position = "absolute",
      a.style.msTouchAction = "none",
      a
  },
  createSpan: function () {
    var a = document.createElement("span");
    return a;
  },
  createCanvas: function (width, height) {
    width || (width = 0),
      height || (height = 0);
    let can = document.createElement("canvas");
    return can.style.position = "absolute",
      can.style.msTouchAction = "none",
      can.width = width,
      can.height = height,
      can
  }
};

Otree.ImageAsset = function (name, _img, w, h, svg) {
  this._name = name,
    this._width = w,
    this._height = h,
    this._svg = svg,
    typeof _img == "string" ? this._src = _img : typeof _img == "function" ? this._func = _img : this._image = _img;
  this.getName = function () {
      return this._name
    },
    this.getSrc = function () {
      return this._src
    },
    this.getSvg = function () {
      return this._svg
    },
    this.getImage = function (color, width, height) {
      if (!color || !this._image) return this._image;
      this._map || (this._map = {});
      let tempColor;
      this._svg && arguments.length === 3 ? tempColor = color + "," + width + "," + height : tempColor = color;
      let _img = this._map[tempColor];
      if (_img) return _img;
      let numColor = Otree.ImageAsset._getValue(color);
      return _img = Otree.ImageAsset._getImage(this._image, numColor, this._svg ? width : this.getWidth(), this._svg ? height : this.getHeight()),
        this._map[e] = _img,
        _img
    },
    this.getWidth = function () {
      return this._width;
    },
    this.getHeight = function () {
      return this._height;
    },
    this.getFunction = function () {
      return this._func;
    }
}

Otree.ImageAsset._canvas = Otree.createCanvas(),
  Otree.ImageAsset._colors = {},
  Otree.ImageAsset._getValue = function (color) {
    let co = Otree.ImageAsset._colors[color];
    if (co != null) {
      return co;
    }
    let can = Otree.ImageAsset._canvas;
    can.width = 3,
      can.height = 3;
    let ctx = can.getContext("2d");
    ctx.clearRect(0, 0, 3, 3),
      ctx.fillStyle = color,
      ctx.beginPath(),
      ctx.rect(0, 0, 3, 3),
      ctx.closePath(),
      ctx.fill();
    let imgDataArr = ctx.getImageData(1, 1, 1, 1).data;
    return co = (imgDataArr[0] << 16) + (imgDataArr[1] << 8) + imgDataArr[2],
      Otree.ImageAsset._colors[color] = co,
      co;
  },
  Otree.ImageAsset._getImage = function (img, color, width, height) {
    let can = Otree.createCanvas(width, height),
      ctx = can.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);
    try {
      let imgData = ctx.getImageData(0, 0, width, height),
        imgDataArr = imgData.data,
        len = imgDataArr.length;
      for (let i = 0; i < len; i += 4) {
        let rgbR = imgDataArr[i + 0],
          rgbG = imgDataArr[i + 1],
          rgbB = imgDataArr[i + 2],
          tempRgb = rgbR * 77 + rgbG * 151 + rgbB * 28 >> 8;
        tempRgb = tempRgb << 16 | tempRgb << 8 | tempRgb,
          tempRgb &= color,
          imgDataArr[i + 0] = tempRgb >> 16 & 255,
          imgDataArr[i + 1] = tempRgb >> 8 & 255,
          imgDataArr[i + 2] = tempRgb & 255;
      }
      ctx.putImageData(imgData, 0, 0);
    } catch (exp) {
      return img;
    }
    return can;
  };
/**
 * 创建tag
 * @param {String} tag html标签
 * @param {number} redundancy
 */
Otree.Pool = function (tag, redundancy) {
  typeof tag == "string" ? this.func = function () {
      return document.createElement(tag);
    } : this.func = tag,
    this.tagName = tag,
    redundancy != null && (this.redundancy = redundancy);
};

/**
 * 创建Icon
 *
 * @param {any} _dom
 * @param {any} ele
 * @param {any} nodeType
 * @param {any} data
 */
function _addIcon(_dom, ele, nodeType, data) {
  let imgAsset = ele.getImageAsset(nodeType),
    innerColor = ele.getInnerColor(ele),
    alarmColor = ele.alarmColor,
    _canvas;
  if (imgAsset && imgAsset.getImage()) {
    let _width = imgAsset.getWidth(),
      _height = imgAsset.getHeight();
    _canvas = ele.getCanvas(),
      _canvas.style.verticalAlign = "middle",
      _canvas.setAttribute("width", _width),
      _canvas.setAttribute("height", _height);
    let ctx = _canvas.getContext("2d");
    ctx.clearRect(0, 0, _width, _height),
      ctx.drawImage(imgAsset.getImage(innerColor), 0, 0, _width, _height),
      // 逆时针画弧线
      alarmColor && (
        ctx.fillStyle = createRadialGradient(ctx, alarmColor, "white", 1, _height - 9, 8, 8, 0.75, 0.25),
        ctx.beginPath(),
        ctx.arc(5, _height - 5, 4, 0, Math.PI * 2, true),
        ctx.closePath(),
        ctx.fill()
      );
  } else {
    _canvas = this.__imagePool.get(),
      _canvas.style.verticalAlign = "middle",
      _canvas.setAttribute("src", ele.getImageSrc(nodeType));
  }
  _canvas.style.margin = "0 1px 0 1px",
    _canvas._selectData = data,
    _dom.appendChild(_canvas);
}

/**
 * 创建Icon
 *
 * @param {any} _dom
 * @param {any} ele
 * @param {any} img
 */
function _addIcon2(_dom, ele, img) {
  let _canvas = Otree.createCanvas();
  let alarmColor = ele.alarmColor;
  if (img) {
    let _width = img.width,
      _height = img.height;
    _canvas.style.verticalAlign = "middle",
      _canvas.setAttribute("width", _width),
      _canvas.setAttribute("height", _height);
    let ctx = _canvas.getContext("2d");
    ctx.clearRect(0, 0, _width, _height),
      ctx.drawImage(img, 0, 0, _width, _height),
      // 逆时针画弧线
      alarmColor && (
        ctx.fillStyle = createRadialGradient(ctx, alarmColor, "white", 1, _height - 9, 8, 8, 0.75, 0.25),
        ctx.beginPath(),
        ctx.arc(5, _height - 5, 4, 0, Math.PI * 2, true),
        ctx.closePath(),
        ctx.fill()
      );
  } else {
    _canvas = this.__imagePool.get(),
      _canvas.style.verticalAlign = "middle",
      _canvas.setAttribute("src", ele.getImageSrc(nodeType));
  }
  _canvas.style.margin = "0 1px 0 1px",
    // _canvas._selectData = data,
    _dom.appendChild(_canvas);
  return _dom;
}

/**
 * 创建放射状/环形的渐变
 *
 * @param {any} ctx 画布对象
 * @param {any} sc1 开始颜色
 * @param {any} sc2 结束颜色
 * @param {any} startX 起始位置x
 * @param {any} startY 起始位置y
 * @param {any} maxR 最大半径
 * @param {any} minR 最小半径
 * @param {any} maxScale 最大范围
 * @param {any} minScale 最小范围
 * @returns
 */
function createRadialGradient(ctx, sc1, sc2, startX, startY, maxR, minR, maxScale, minScale) {
  sc1 = colorUtil.isRgbColor(sc1) ? colorUtil.toHexColor(sc1) : sc1;
  sc2 = colorUtil.isRgbColor(sc2) ? colorUtil.toHexColor(sc2) : sc2;
  let x0 = startX + maxR * maxScale,
    y0 = startY + minR * minScale,
    r0 = Math.min(maxR, minR) / 24,
    x1 = startX + maxR / 2,
    y1 = startY + minR / 2,
    r1 = Math.max(maxR, minR) / 2;
  var grd = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
  return grd.addColorStop(0, sc2),
    grd.addColorStop(1, sc1),
    grd
}

module.exports = Tree;
