const Container = require('./_container');
const _n = require('./_node');
const Node = _n.Node;
const third = require('./third/index');
const {Pool, html, canvasUtil} = third;
const _cons = require('./constants');

/**
 * root 节点Icon
 */
const rootIcon = () => {
  let ri = new Image();
  ri.src = _cons.ROOT_ICON;
  return ri;
};

/**
 * 默认缺省Icon
 */
const defaultIcon = () => {
  let di = new Image();
  di.src = _cons.DEFAULT_ICON;
  return di;
};

function Tree(rootDom, _scene, treeName) {
  this.__divPool = new Pool('div', 20),
    this.__imagePool = new Pool('img', 20),
    this.__canvasPool = new Pool('canvas', 20),
    this.__spanPool = new Pool('span', 20),
    this.__textPool = new Pool('span', 20),
    this.rootDom = rootDom,
    this.treeDatas = buildTreeData(_scene, treeName);
  this.paintTree = function() {
    let _rowHeight = 23,
      _rowLineWidth = 5,
      _rowLineColor = '#CCC';
    var _lineHeight = _rowHeight - _rowLineWidth - 2 + 'px';
    this.treeDatas.forEach((d, i) => {
      let _div = html.createDiv();
      let sty = _div.style;
      sty.position = 'absolute',
        sty.whiteSpace = 'nowrap',
        sty.lineHeight = _lineHeight,
        i !== 0 && (sty.top = i * _rowHeight + 'px'),
        sty.borderStyle = 'solid',
        sty.borderWidth = '0px',
        sty.borderBottomWidth = _rowLineWidth + 'px',
        sty.borderBottomColor = _rowLineColor,
      rootDom.appendChild(_addIcon2(_div, d, d.icon));
      let span = html.createSpan();
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
    icon: rootIcon(),
    level: 1,
    eleId: scene.getId(),
    elementType: 'root'
  };
  result.push(rootData);
  scene.childs && (
    scene.childs.forEach(
      (item, index) => {
        item instanceof Container && (
          result.push({
            name: item.text || '   ',
            icon: item.icon || defaultIcon(),
            level: 2,
            eleId: item.getId(),
            elementType: item.elementType,
            alarmColor: item.alarmColor
          })
        );
        item instanceof Node && (
          result.push({
            name: item.text || 'Node',
            icon: item.icon || defaultIcon(),
            level: 3,
            eleId: item.getId(),
            elementType: item.elementType,
            alarmColor: item.alarmColor
          })
        );
      }
    )
  );
  return result;
}

/**
 * 创建Icon
 *
 * @param {any} _dom
 * @param {any} ele
 * @param {any} img
 */
function _addIcon2(_dom, ele, img, nodeType) {
  let _canvas = html.createCanvas();
  let alarmColor = ele.alarmColor;
  if (img) {
    let _width = img.width,
      _height = img.height;
    _canvas.style.verticalAlign = 'middle',
      _canvas.setAttribute('width', _width),
      _canvas.setAttribute('height', _height);
    let ctx = _canvas.getContext('2d');
    ctx.clearRect(0, 0, _width, _height),
      ctx.drawImage(img, 0, 0, _width, _height),
      // 逆时针画弧线
      alarmColor && (
        ctx.fillStyle = canvasUtil.createRadialGradient(ctx, alarmColor, 'white', 1, _height - 9, 8, 8, 0.75, 0.25),
        ctx.beginPath(),
        ctx.arc(5, _height - 5, 4, 0, Math.PI * 2, true),
        ctx.closePath(),
        ctx.fill()
      );
  } else {
    _canvas = this.__imagePool.get(),
      _canvas.style.verticalAlign = 'middle',
      _canvas.setAttribute('src', ele.getImageSrc(nodeType));
  }
  _canvas.style.margin = '0 1px 0 1px',
    // _canvas._selectData = data,
    _dom.appendChild(_canvas);
  return _dom;
}


module.exports = Tree;
