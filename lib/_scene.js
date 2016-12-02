//////////////////////////////
/**
 * scene
 * 画布
 * @author ilex
 * @description 2016-11-04 11:56:12
 */
//////////////////////////////
const Element = require('./_element');
const eleExt = require('./_eleExt');
const _link = require('./_link');
const _node = require('./_node');
const Tobj = require('./_tobj');
const Util = require('./_util');
const SceneMode = Tobj.SceneMode;
const MouseCursor = Tobj.MouseCursor;

const Link = _link.Link;
const Node = _node.Node;

/**
 * 画布
 *
 * @param {any} c
 * @returns
 */
function Scene(c) {
  /**
   * 创建矩形
   *
   * @param {any} x
   * @param {any} y
   * @param {any} width
   * @param {any} height
   * @returns
   */
  function createRect(x,y,width,height) {
    return function(ctx) {
      ctx.beginPath(),
        ctx.strokeStyle = 'rgba(0,0,236,0.5)',
        ctx.fillStyle = 'rgba(0,0,236,0.1)',
        ctx.rect(x,y,width,height),
        ctx.fill(),
        ctx.stroke(),
        ctx.closePath();
    };
  }
  let _self = this;
  this.initialize = function() {
    Scene.prototype.initialize.apply(this, arguments),
      this.messageBus = new Util.MessageBus,
      this.elementType = 'scene',
      this.childs = [],
      this.zIndexMap = {},
      this.zIndexArray = [],
      this.backgroundColor = '255,255,255',
      this.visible = true,
      this.alpha = 0,
      this.scaleX = 1,
      this.scaleY = 1,
      this.mode = SceneMode.normal,
      this.translate = true,
      this.translateX = 0,
      this.translateY = 0,
      this.lastTranslateX = 0,
      this.lastTranslateY = 0,
      this.mouseDown = false,
      this.mouseDownX = null,
      this.mouseDownY = null,
      this.mouseDownEvent = null,
      this.areaSelect = true,
      this.operations = [],
      this.selectedElements = [],
      this.paintAll = false;
    let properties = 'background,backgroundColor,mode,paintAll,areaSelect,translate,translateX,translateY,lastTranslatedX,lastTranslatedY,alpha,visible,scaleX,scaleY'.split(',');
    this.serializedProperties = this.serializedProperties.concat(properties);
  },
  this.initialize(),
  this.setBackground = function(bg) {
    this.background = bg;
  },
  this.addTo = function(st) {
    this.stage !== st && null != st && (this.stage = st);
  },
  null != c && (c.add(this), this.addTo(c)),
  this.show = function() {
    this.visible = true;
  },
  this.hide = function() {
    this.visible = false;
  },
  this.paint = function(ctx) {
    if (0 != this.visible && null != this.stage) {
      ctx.save(),
        this.paintBackgroud(ctx),
        ctx.restore(),
        ctx.save(),
        ctx.scale(this.scaleX, this.scaleY);
      if (1 == this.translate) {
        let offT = this.getOffsetTranslate(ctx);
        ctx.translate(offT.translateX, offT.translateY);
      }
      this.paintChilds(ctx),
        ctx.restore(),
        ctx.save(),
        this.paintOperations(ctx, this.operations),
        ctx.restore();
    }
  },
  this.repaint = function(ctx) {
    0 != this.visible && this.paint(ctx);
  },
  this.paintBackgroud = function(ctx) {
    if(null != this.background){
      ctx.drawImage(this.background, 0, 0, ctx.canvas.width, ctx.canvas.height);
    }else{
      ctx.beginPath(),
      ctx.fillStyle = 'rgba(' + this.backgroundColor + ',' + this.alpha + ')',
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height),
      ctx.closePath();
    }
  },
  this.getDisplayedElements = function() {
    let eles = [];
    for (let i = 0; i < this.zIndexArray.length; i++) {
      let temp = this.zIndexArray[i];
      let maps = this.zIndexMap[temp];
      for (let j = 0; j < maps.length; j++) {
        let ele = maps[j];
        this.isVisiable(ele) && eles.push(ele);
      }
    }
    return eles;
  },
  this.getDisplayedNodes = function() {
    let b = [];
    for (let c = 0; c < this.childs.length; c++) {
      let d = this.childs[c];
      d instanceof Node && this.isVisiable(d) && b.push(d);
      // d.elementType === 'node' && this.isVisiable(d) && b.push(d);
    }
    return b;
  },
  this.paintChilds = function(b) {
    for (let c = 0; c < this.zIndexArray.length; c++) {
      for (let d = this.zIndexArray[c], e = this.zIndexMap[d], f = 0; f < e.length; f++) {
        let g = e[f];
        if (1 == this.paintAll || this.isVisiable(g)) {
          if (b.save(), 1 == g.transformAble) {
            let h = g.getCenterLocation();
            b.translate(h.x, h.y),
              g.rotate && b.rotate(g.rotate),
              g.scaleX && g.scaleY ? b.scale(g.scaleX, g.scaleY) : g.scaleX ? b.scale(g.scaleX, 1) : g.scaleY && b.scale(1, g.scaleY);
          }
          1 == g.shadow && (b.shadowBlur = g.shadowBlur, b.shadowColor = g.shadowColor, b.shadowOffsetX = g.shadowOffsetX, b.shadowOffsetY = g.shadowOffsetY),
            g instanceof eleExt.InteractiveElement && (g.selected && 1 == g.showSelected && g.paintSelected(b), 1 == g.isMouseOver && g.paintMouseover(b)),
            g.paint(b),
            b.restore();
        }
      }
    }
  },
  this.getOffsetTranslate = function(a) {
    let b = this.stage.canvas.width,
      c = this.stage.canvas.height;
    null != a && 'move' != a && (b = a.canvas.width, c = a.canvas.height);
    let d = b / this.scaleX / 2,
      e = c / this.scaleY / 2,
      f = {
        translateX: this.translateX + (d - d * this.scaleX),
        translateY: this.translateY + (e - e * this.scaleY)
      };
    return f;
  },
  this.isVisiable = function(b) {
    if (1 != b.visible) {return false;}
    if (b instanceof Link) {return true;}
    // if (b.elementType === 'link') {return true;}
    let c = this.getOffsetTranslate(),
      d = b.x + c.translateX,
      e = b.y + c.translateY;
    d *= this.scaleX,
      e *= this.scaleY;
    let f = d + b.width * this.scaleX,
      g = e + b.height * this.scaleY;
    return d > this.stage.canvas.width || e > this.stage.canvas.height || 0 > f || 0 > g ? false : true;
  },
  this.paintOperations = function(a, b) {
    for (let c = 0; c < b.length; c++) {
      b[c](a);
    }
  },
  this.findElements = function(a) {
    let b = [];
    for (let c = 0; c < this.childs.length; c++) {
      1 == a(this.childs[c]) && b.push(this.childs[c]);
    }
    return b;
  },
  this.getElementsByClass = function(a) {
    return this.findElements(function(b) {
      // return b instanceof a;
      return b.elementType === a.elementType;
    });
  },
  this.addOperation = function(a) {
    return this.operations.push(a),
      this;
  },
  this.clearOperations = function() {
    return this.operations = [],
      this;
  },
  this.getElementByXY = function(b, c) {
    let d = null;
    for (let e = this.zIndexArray.length - 1; e >= 0; e--) {
      for (let f = this.zIndexArray[e], g = this.zIndexMap[f], h = g.length - 1; h >= 0; h--) {
        let i = g[h];
        if (i instanceof eleExt.InteractiveElement && this.isVisiable(i) && i.isInBound(b, c)) {return d = i;}
      }
    }
    return d;
  },
  this.add = function(a) {
    this.childs.push(a),
      null == this.zIndexMap[a.zIndex] && (this.zIndexMap[a.zIndex] = [], this.zIndexArray.push(a.zIndex), this.zIndexArray.sort(function(a, b) {
        return a - b;
      })),
      this.zIndexMap['' + a.zIndex].push(a);
  },
  this.remove = function(b) {
    this.childs = Util.removeFromArray(this.childs, b);
    let c = this.zIndexMap[b.zIndex];
    c && (this.zIndexMap[b.zIndex] = Util.removeFromArray(c, b)),
      b.removeHandler(this);
  },
  this.clear = function() {
    let a = this;
    this.childs.forEach(function(b) {
      b.removeHandler(a);
    }),
      this.childs = [],
      this.operations = [],
      this.zIndexArray = [],
      this.zIndexMap = {};
  },
  this.addToSelected = function(a) {
    this.selectedElements.push(a);
  },
  this.cancleAllSelected = function(a) {
    for (let b = 0; b < this.selectedElements.length; b++) {
      this.selectedElements[b].unselectedHandler(a);
    }
    this.selectedElements = [];
  },
  this.notInSelectedNodes = function(a) {
    for (let b = 0; b < this.selectedElements.length; b++) {
      if (a === this.selectedElements[b]) {
        return false;
      }
    }
    return true;
  },
  this.removeFromSelected = function(a) {
    for (let b = 0; b < this.selectedElements.length; b++) {
      let c = this.selectedElements[b];
      a === c && (this.selectedElements = this.selectedElements.del(b));
    }
  },
  this.toSceneEvent = function(b) {
    let c = Util.clone(b);
    c.x /= this.scaleX;
    c.y /= this.scaleY;
    if (1 == this.translate) {
      let d = this.getOffsetTranslate();
      c.x -= d.translateX,
        c.y -= d.translateY;
    }
    return null != c.dx && (c.dx /= this.scaleX, c.dy /= this.scaleY),
      null != this.currentElement && (c.target = this.currentElement),
      c.scene = this,
      c;
  },
  this.selectElement = function(a) {
    let b = _self.getElementByXY(a.x, a.y);
    if (null != b) {
      a.target = b, b.mousedownHander(a), b.selectedHandler(a);
      if (_self.notInSelectedNodes(b)) {
        a.ctrlKey || _self.cancleAllSelected(),
        _self.addToSelected(b);
      } else {
        1 == a.ctrlKey && (b.unselectedHandler(), this.removeFromSelected(b));
        for (let c = 0; c < this.selectedElements.length; c++) {
          let d = this.selectedElements[c];
          d.selectedHandler(a);
        }
      }
    } else {
      a.ctrlKey || _self.cancleAllSelected();
    }
    this.currentElement = b;
  },
  this.mousedownHandler = function(b) {
    let c = this.toSceneEvent(b);
    this.mouseDown = true,
      this.mouseDownX = c.x,
      this.mouseDownY = c.y,
      this.mouseDownEvent = c;
    if (this.mode == SceneMode.normal) {
      this.selectElement(c),
      (null == this.currentElement || this.currentElement instanceof Link) && 1 == this.translate && (this.lastTranslateX = this.translateX, this.lastTranslateY = this.translateY);
    }
    else {
      if (this.mode == SceneMode.drag && 1 == this.translate) {
        return this.lastTranslateX = this.translateX, void (this.lastTranslateY = this.translateY);
      }
      this.mode == SceneMode.select ? this.selectElement(c) : this.mode == SceneMode.edit && (this.selectElement(c), (null == this.currentElement || this.currentElement instanceof Link) && 1 == this.translate && (this.lastTranslateX = this.translateX, this.lastTranslateY = this.translateY));
    }
    _self.dispatchEvent('mousedown', c);
  },
  this.mouseupHandler = function(b) {
    this.stage.cursor != MouseCursor.normal && (this.stage.cursor = MouseCursor.normal),
      _self.clearOperations();
    let c = this.toSceneEvent(b);
    null != this.currentElement && (c.target = _self.currentElement, this.currentElement.mouseupHandler(c)),
      this.dispatchEvent('mouseup', c),
      this.mouseDown = false;
  },
  this.dragElements = function(b) {
    if (null != this.currentElement && 1 == this.currentElement.dragable) {
      for (let c = 0; c < this.selectedElements.length; c++) {
        let d = this.selectedElements[c];
        if (0 != d.dragable) {
          let e = Util.clone(b);
          e.target = d,
          d.mousedragHandler(e);
        }
      }}
  },
  this.mousedragHandler = function(b) {
    let c = this.toSceneEvent(b);
    this.mode == SceneMode.normal ? null == this.currentElement || this.currentElement instanceof Link ? 1 == this.translate && (this.stage.cursor = MouseCursor.closed_hand, this.translateX = this.lastTranslateX + c.dx, this.translateY = this.lastTranslateY + c.dy) : this.dragElements(c) : this.mode == SceneMode.drag ? 1 == this.translate && (this.stage.cursor = MouseCursor.closed_hand, this.translateX = this.lastTranslateX + c.dx, this.translateY = this.lastTranslateY + c.dy) : this.mode == SceneMode.select ? null != this.currentElement ? 1 == this.currentElement.dragable && this.dragElements(c) : 1 == this.areaSelect && this.areaSelectHandle(c) : this.mode == SceneMode.edit && (null == this.currentElement || this.currentElement instanceof Link ? 1 == this.translate && (this.stage.cursor = MouseCursor.closed_hand, this.translateX = this.lastTranslateX + c.dx, this.translateY = this.lastTranslateY + c.dy) : this.dragElements(c)),
      this.dispatchEvent('mousedrag', c);
  },
  this.areaSelectHandle = function(a) {
    let b = a.offsetLeft,
      c = a.offsetTop,
      f = this.mouseDownEvent.offsetLeft,
      g = this.mouseDownEvent.offsetTop,
      h = b >= f ? f : b,
      i = c >= g ? g : c,
      j = Math.abs(a.dx) * this.scaleX,
      k = Math.abs(a.dy) * this.scaleY,
      l = new createRect(h, i, j, k);
    _self.clearOperations().addOperation(l),
      b = a.x,
      c = a.y,
      f = this.mouseDownEvent.x,
      g = this.mouseDownEvent.y,
      h = b >= f ? f : b,
      i = c >= g ? g : c,
      j = Math.abs(a.dx),
      k = Math.abs(a.dy);
    for (let m = h + j,
      n = i + k,
      o = 0; o < _self.childs.length; o++) {
      let p = _self.childs[o];
      p.x > h && p.x + p.width < m && p.y > i && p.y + p.height < n && _self.notInSelectedNodes(p) && (p.selectedHandler(a), _self.addToSelected(p));
    }
  },
  this.mousemoveHandler = function(b) {
    this.mousecoord = {
      x: b.x,
      y: b.y
    };
    let c = this.toSceneEvent(b);
    if (this.mode == SceneMode.drag) {return void (this.stage.cursor = MouseCursor.open_hand);}
    this.mode == SceneMode.normal ? this.stage.cursor = MouseCursor.normal : this.mode == SceneMode.select && (this.stage.cursor = MouseCursor.normal);
    let d = _self.getElementByXY(c.x, c.y);
    null != d ? (_self.mouseOverelement && _self.mouseOverelement !== d && (c.target = d, _self.mouseOverelement.mouseoutHandler(c)), _self.mouseOverelement = d, 0 == d.isMouseOver ? (c.target = d, d.mouseoverHandler(c), _self.dispatchEvent('mouseover', c)) : (c.target = d, d.mousemoveHandler(c), _self.dispatchEvent('mousemove', c))) : _self.mouseOverelement ? (c.target = d, _self.mouseOverelement.mouseoutHandler(c), _self.mouseOverelement = null, _self.dispatchEvent('mouseout', c)) : (c.target = null, _self.dispatchEvent('mousemove', c));
  },
  this.mouseoverHandler = function(a) {
    let b = this.toSceneEvent(a);
    this.dispatchEvent('mouseover', b);
  },
  this.mouseoutHandler = function(a) {
    let b = this.toSceneEvent(a);
    this.dispatchEvent('mouseout', b);
  },
  this.clickHandler = function(a) {
    let b = this.toSceneEvent(a);
    this.currentElement && (b.target = this.currentElement, this.currentElement.clickHandler(b)),
      this.dispatchEvent('click', b);
  },
  this.dbclickHandler = function(a) {
    let b = this.toSceneEvent(a);
    this.currentElement ? (b.target = this.currentElement, this.currentElement.dbclickHandler(b)) : _self.cancleAllSelected(),
      this.dispatchEvent('dbclick', b);
  },
  this.mousewheelHandler = function(a) {
    let b = this.toSceneEvent(a);
    this.dispatchEvent('mousewheel', b);
  },
  this.touchstart = this.mousedownHander,
  this.touchmove = this.mousedragHandler,
  this.touchend = this.mousedownHander,
  this.keydownHandler = function(a) {
    this.dispatchEvent('keydown', a);
  },
  this.keyupHandler = function(a) {
    this.dispatchEvent('keyup', a);
  },
  this.addEventListener = function(a, b) {
    let c = this,
      d = function(a) {
        b.call(c, a);
      };
    return this.messageBus.subscribe(a, d),
      this;
  },
  this.removeEventListener = function(a) {
    this.messageBus.unsubscribe(a);
  },
  this.removeAllEventListener = function() {
    this.messageBus = new Util.MessageBus;
  },
  this.dispatchEvent = function(a, b) {
    return this.messageBus.publish(a, b),
      this;
  };
  let events = 'click,dbclick,mousedown,mouseup,mouseover,mouseout,mousemove,mousedrag,mousewheel,touchstart,touchmove,touchend,keydown,keyup'.split(','),
    tempSelf = this;
  return events.forEach(function(a) {
    tempSelf[a] = function(b) {
      null != b ? this.addEventListener(a, b) : this.dispatchEvent(a);
    };
  }),
  this.zoom = function(a, b) {
    null != a && 0 != a && (this.scaleX = a),
      null != b && 0 != b && (this.scaleY = b);
  },
  this.zoomOut = function(a) {
    0 != a && (null == a && (a = .8), this.scaleX /= a, this.scaleY /= a);
  },
  this.zoomIn = function(a) {
    0 != a && (null == a && (a = .8), this.scaleX *= a, this.scaleY *= a);
  },
  this.getBound = function() {
    return {
      left: 0,
      top: 0,
      right: this.stage.canvas.width,
      bottom: this.stage.canvas.height,
      width: this.stage.canvas.width,
      height: this.stage.canvas.height
    };
  },
  this.getElementsBound = function() {
    return Util.getElementsBound(this.childs);
  },
  this.translateToCenter = function(a) {
    let b = this.getElementsBound(),
      c = this.stage.canvas.width / 2 - (b.left + b.right) / 2,
      d = this.stage.canvas.height / 2 - (b.top + b.bottom) / 2;
    a && (c = a.canvas.width / 2 - (b.left + b.right) / 2, d = a.canvas.height / 2 - (b.top + b.bottom) / 2),
      this.translateX = c,
      this.translateY = d;
  },
  this.setCenter = function(a, b) {
    let c = a - this.stage.canvas.width / 2,
      d = b - this.stage.canvas.height / 2;
    this.translateX = -c,
      this.translateY = -d;
  },
  this.centerAndZoom = function(a, b, c) {
    if (this.translateToCenter(c), null == a || null == b) {
      let d = this.getElementsBound(),
        e = d.right - d.left,
        f = d.bottom - d.top,
        g = this.stage.canvas.width / e,
        h = this.stage.canvas.height / f;
      c && (g = c.canvas.width / e, h = c.canvas.height / f);
      let i = Math.min(g, h);
      if (i > 1) {return;}
      this.zoom(i, i);
    }
    this.zoom(a, b);
  },
  this.getCenterLocation = function() {
    return {
      x: _self.stage.canvas.width / 2,
      y: _self.stage.canvas.height / 2
    };
  },
  this.doLayout = function(a) {
    a && a(this, this.childs);
  },
  this.toJson = function() {
    {
      var a = this,
        b = '{';
      this.serializedProperties.length;
    }
    this.serializedProperties.forEach(function(c) {
      var d = a[c];
      'background' == c && (d = a._background.src),
        'string' == typeof d && (d = '"' + d + '"'),
        b += '"' + c + '":' + d + ',';
    }),
      b += '"childs":[';
    var c = this.childs.length;
    return this.childs.forEach(function(a, d) {
      b += a.toJson(),
        c > d + 1 && (b += ',');
    }),
      b += ']',
      b += '}';
  },
  _self;
}

Scene.prototype = new Element;
let c = {};
Object.defineProperties(Scene.prototype, {
  background: {
    get: function() {
      return this._background;
    },
    set: function(imgUrl) {
      if ('string' == typeof imgUrl) {
        let img = c[imgUrl];
        null == img && (img = new Image, img.src = imgUrl, img.onload = function() {
          c[imgUrl] = img;
        }),
          this._background = img;
      } else {this._background = imgUrl;}
    }
  }
});

module.exports = Scene;
