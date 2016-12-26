// @author ilex.h

const Container = require('./_container');
const _n = require('./_node');
const Node = _n.Node;
const third = require('./_third');
const {Pool, html, canvasUtil, Constants, UserAgent} = third;

const _cons = require('./constants');
const Bd = Constants.Bd;

const _indent = Bd.TREE_INDENT, // 16
  _rowHeight = Bd.TREE_ROW_HEIGHT, // 19
  _rowLineWidth = Bd.TREE_ROW_LINE_WIDTH, // 0
  _rowLineColor = Bd.TREE_ROW_LINE_COLOR, // #DDD
  _makeVisibleOnSelected = Bd.TREE_MAKE_VISIBLE_ON_SELECTED, // true
  _keyboardRemoveEnabled = Bd.TREE_KEYBOARD_REMOVE_ENABLED, // true
  _keyboardSelectEnabled = Bd.TREE_KEYBOARD_SELECT_ENABLED, // true
  _expandIcon = Bd.TREE_EXPAND_ICON, // expand_icon
  _collapseIcon = Bd.TREE_COLLAPSE_ICON;// collapse_icon

// 缺省宽和高
const _clientWidth = 200;
const _clientHeight = 550;
const innerSpace = 5;
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

function _InvokeTreePane(treePane, _scene, treeName) {
  this.__divPool = new Pool('div', 20),
    this.__imagePool = new Pool('img', 20),
    this.__canvasPool = new Pool('canvas', 20),
    this.__spanPool = new Pool('span', 20),
    this.__textPool = new Pool('span', 20),
    this.treePane = treePane,
    this.treeDatas = buildTreeData(_scene, treeName);
  this.width = '200px';
  this.paintTree = function() {
    var _lineHeight = _rowHeight - _rowLineWidth - 2 + 'px',
      bbw = `${_rowLineWidth}px`;
    this.treeDatas.forEach((d, i) => {
      let _div = html.createDiv();
      let sty = _div.style;
      sty.position = 'absolute',
        sty.whiteSpace = 'nowrap',
        sty.lineHeight = _lineHeight,
        i !== 0 && (sty.top = i * _rowHeight + 'px'),
        sty.borderStyle = 'solid',
        sty.borderWidth = '0px',
        sty.borderBottomWidth = bbw,
        sty.borderBottomColor = _rowLineColor;
      sty.height = '19px',
        sty.width = this.width;
      d.level === 0 ? (_div.appendChild(_boolSpan(true)),_div.appendChild(_boolImg())) : _div.appendChild(_boolSpan(false));
      // 添加树节点canvas
      _addIcon2(_div, d, d.icon);
      let span = html.createSpan();
      span.style.margin = '0';
      span.style.padding = '1px 2px';
      span.style.whiteSpace = 'nowrap';
      span.style.verticalAlign = 'middle';
      span.innerHTML = d.name;
      _div.appendChild(span);
      treePane.appendChild(_div);
      initItemEvent(_div);
    });
  };
  this.initTreeView = function(parent, positions = {}) {
    this.rootView = parent;
    let _w = parent.clientWidth || _clientWidth,
      _h = parent.clientHeight || _clientHeight;
    let {top, right, bottom, left} = positions;
    this.treePane.style.position = 'absolute';
    //	e.style.position = 'relative';
    left != null && (this.treePane.style.left = left + 'px');
    top != null && (this.treePane.style.top = top + 'px');
    right != null && (this.treePane.style.right = right + 'px');
    bottom != null && (this.treePane.style.bottom = bottom + 'px');
    this.treePane.style.width = _w - innerSpace + 'px';
    this.treePane.style.height = _h - innerSpace + 'px';
    parent.appendChild(this.treePane);
  };
  this.updateTreeView = function(_scene){
    this.treeDatas = buildTreeData(_scene);
    this.paintTree();
  };
  this.paintTree();
}

function _boolSpan(isRoot){
  let span = html.createSpan();
  span.style.margin = '0';
  span.style.padding = '0';
  span.style.width = isRoot ? '0' : '32px';
  span.style.display = 'inline-block';
  return span;
}

function _boolImg(){
  let img = html.createImg(_cons.UNEXPAND);
  img.style.margin = '0';
  img.style.padding = '0';
  img.style.verticalAlign = 'middle';
  return img;
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
  if(scene){
    let rootData = treeName ? {
      name: treeName || 'Root',
      icon: rootIcon(),
      level: 0,
      eleId: scene.getId(),
      elementType: 'root'
    }
    :
    {
      icon: rootIcon(),
      level: 0,
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
              level: 1,
              eleId: item.getId(),
              elementType: item.elementType,
              alarmColor: item.alarmColor
            })
          );
          item instanceof Node && (
            result.push({
              name: item.text || 'Node',
              icon: item.icon || defaultIcon(),
              level: 2,
              eleId: item.getId(),
              elementType: item.elementType,
              alarmColor: item.alarmColor
            })
          );
        }
      )
    );
  }
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
  _canvas.style.margin = '0px 1px 0px 1px',
    // _canvas._selectData = data,
    _dom.appendChild(_canvas);
  return _dom;
}

let initItemEvent = function(itemView){
  var _self = this;
  itemView.addEventListener('change',
    function(a) {
      _self.handleChange(a);
    },
    false);
  new basicInteraction(this);
};

let basicInteraction = function(itemView) {
  this.view = itemView;
  var _self = this;
  this.view.addEventListener('scroll',
  function(a) {
    _self.handleScroll(a);
  },
  false),
  this.view.addEventListener('mousedown',
  function(a) {
    _self.handleMouseDown(a);
  },
  false),
  this.view.addEventListener('keydown',
  function(a) {
    _self.handleKeyDown(a);
  },
  false);

  this.handleMouseDown = function(a) {
    // console.log('点击了',a.target);
  },
  this.handleKeyDown = function(a) {
    var b = this.treeItem;
    if (b._currentEditor) {return;}
    if (isCtrlDown(a) && a.keyCode == 65){
      b.isKeyboardSelectEnabled() && b.selectAll().size() > 0 && b.fireInteractionEvent({kind: 'selectAll'}),
    html.preventDefault(a);
    }
    else if (a.keyCode == 46){
      b.isKeyboardRemoveEnabled() && b.removeSelection() && b.fireInteractionEvent({
        kind: 'removeElement'
      }),
      html.preventDefault(a);
    }
    else if ( !! b.isCheckMode() || a.keyCode !== 38 && a.keyCode !== 40 && a.keyCode !== 37 && a.keyCode !== 39) {
      // donothing
    }
    else {
      var c = b.getSelectionModel().getLastData();
      if (c) {
        if (a.keyCode === 38 || a.keyCode === 40) {
          var e = b.getRowDatas(),
            f = b.getRowIndexByData(c);
          f >= 0 && (a.keyCode === 38 ? f !== 0 && (c = e.get(f - 1), b.getSelectionModel().setSelection(c)) : f !== e.size() - 1 && (c = e.get(f + 1), b.getSelectionModel().setSelection(c)));
        } else {
          b.expand && (a.keyCode === 37 || a.keyCode === 39) && c.hasChildren() && (a.keyCode === 37 ? b.collapse(c) : b.expand(c));
        }
      }
      else {
        b.getRowDatas().size() > 0 && (c = b.getRowDatas().get(0), b.getSelectionModel().setSelection(c));
      }
    }
  },
  this.handleScroll = function(a) {
    // this.treeItem.invalidate();
  };
};

let TreeItem = function(a) {
  this.__divPool = new Pool('div', 20),
    this.__imagePool = new Pool('img', 20),
    this.__canvasPool = new Pool('canvas', 20),
    this.__spanPool = new Pool('span', 20),
    this.__textPool = new Pool('span', 20),
    this._view = html.createView('auto'),
    this._rootDiv = html.createDiv(),
    this._view.appendChild(this._rootDiv);
  var _self = this;
  _self.handleChange && _self._view.addEventListener('change',
    function(a) {
      _self.handleChange(a);
    },
    false);
  var d;
  UserAgent.isMSToucheable ?
    d = TreeItemMSTouchInteraction
    :
    UserAgent.isTouchable ?
    d = TreeItemTouchInteraction
    :
    d = TreeItemInteraction,
    d && new d(this);
};

let TreeItemMSTouchInteraction = function(){

};

let TreeItemTouchInteraction = function(){

};

let TreeItemInteraction = function(a) {
  this.listBase = a,
  this.view = a._view;
  var _self = this;
  this.view.addEventListener('scroll',
  function(a) {
    _self.handleScroll(a);
  },
  false),
  this.view.addEventListener('mousedown',
  function(a) {
    _self.handleMouseDown(a);
  },
  false),
  this.view.addEventListener('keydown',
  function(a) {
    _self.handleKeyDown(a);
  },
  false);

  this.handleMouseDown = function(a) {
    var b = this.listBase;
    if (a.target === b._currentEditor || a.target.parentNode === b._currentEditor) {return;}
    b._handleClick(a);
  },
  this.handleKeyDown = function(a) {
    var b = this.listBase;
    if (b._currentEditor) {return;}
    if (isCtrlDown(a) && a.keyCode == 65){
      b.isKeyboardSelectEnabled() && b.selectAll().size() > 0 && b.fireInteractionEvent({kind: 'selectAll'}),
    html.preventDefault(a);
    }
    else if (a.keyCode == 46){
      b.isKeyboardRemoveEnabled() && b.removeSelection() && b.fireInteractionEvent({
        kind: 'removeElement'
      }),
      html.preventDefault(a);
    }
    else if ( !! b.isCheckMode() || a.keyCode !== 38 && a.keyCode !== 40 && a.keyCode !== 37 && a.keyCode !== 39) {
      // donothing
    }
    else {
      var c = b.getSelectionModel().getLastData();
      if (c) {
        if (a.keyCode === 38 || a.keyCode === 40) {
          var e = b.getRowDatas(),
            f = b.getRowIndexByData(c);
          f >= 0 && (a.keyCode === 38 ? f !== 0 && (c = e.get(f - 1), b.getSelectionModel().setSelection(c)) : f !== e.size() - 1 && (c = e.get(f + 1), b.getSelectionModel().setSelection(c)));
        } else {
          b.expand && (a.keyCode === 37 || a.keyCode === 39) && c.hasChildren() && (a.keyCode === 37 ? b.collapse(c) : b.expand(c));
        }
      }
      else {
        b.getRowDatas().size() > 0 && (c = b.getRowDatas().get(0), b.getSelectionModel().setSelection(c));
      }
    }
  },
  this.handleScroll = function(a) {
    // this.listBase.invalidate();
  };
};

const isCtrlDown = (ev) => ev.ctrlKey || ev.metaKey;
const isShiftDown = (ev) => ev.shiftKey;
const isAltDown = (ev) => ev.altKey;

const AmostTree = _InvokeTreePane;

module.exports = AmostTree;
