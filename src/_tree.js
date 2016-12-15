const Container = require('./_container');
const _n = require('./_node');
const Node = _n.Node;

const span = 5;

function Tree(rootDom, _scene, treeName) {
  this.rootDom = rootDom;
  this.treeDatas = buildTreeData(_scene, treeName);
  this.paintTree = function(){
    this.treeDatas.forEach((d)=>{
      _addIcon(this.rootDom, d);
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
function buildTreeData(scene, treeName){
  let result = [];
  let rootData = {
    name: 'Root' || treeName,
    icon: 'root',
    level: 1
  };
  result.push(rootData);
  scene.childs && (
    scene.childs.forEach(
      (item, index) => {
        item instanceof Container && (
           result.push({
             name: Container.text || '   ',
             icon: 'container',
             level: 2
           })
        );
        item instanceof Node && (
           result.push({
             name: Node.text || 'Node',
             icon: 'node',
             level: 3
           })
        );
      }
    )
  );
  return result;
}

let Otree = {};

function createCanvas(width, height){
  width || (width = 0),
    height || (height = 0);
  let can = document.createElement("canvas");
  return can.style.position = "absolute",
        can.style.msTouchAction = "none",
        can.width = width,
        can.height = height,
        can
}

Otree.ImageAsset = function (name, _img, w, h, svg) {
  this._name = name,
  this._width = w,
  this._height = h,
  this._svg = svg,
  typeof _img == "string" ? this._src = _img: typeof _img == "function" ? this._func = _img: this._image = _img;
  this.getName = function() {
      return this._name
  },
  this.getSrc = function() {
    return this._src
  },
  this.getSvg = function() {
    return this._svg
  },
  this.getImage = function(color, width, height) {
    if (!color || !this._image) return this._image;
    this._map || (this._map = {});
    let tempColor;
    this._svg && arguments.length === 3 ? tempColor = color + "," + width + "," + height: tempColor = color;
    let _img = this._map[tempColor];
    if (_img) return _img;
    let numColor = Otree.ImageAsset._getValue(color);
    return _img = Otree.ImageAsset._getImage(this._image, numColor, this._svg ? width: this.getWidth(), this._svg ? height: this.getHeight()),
    this._map[e] = _img,
    _img
  },
  this.getWidth = function() {
    return this._width;
  },
  this.getHeight = function() {
    return this._height;
  },
  this.getFunction = function() {
    return this._func;
  }
}

Otree.ImageAsset._canvas = createCanvas(),
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
    let can = createCanvas(width, height),
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
  let x0 = startX + maxR * maxScale,
    y0 = startY + minR * minScale,
    r0 = Math.min(maxR, g) / 24,
    x1 = startX + maxR / 2,
    y1 = startY + minR / 2,
    r1 = Math.max(maxR, minR) / 2;
  var grd = tx.createRadialGradient(x0, y0, r0, x1, y1, r1);
  return grd.addColorStop(0, sc2),
    grd.addColorStop(1, sc1),
    grd
}
