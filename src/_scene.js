//////////////////////////////
/**
 * scene
 * 画布
 * @author ilex
 * @description 2016-11-04 11:56:12
 */
//////////////////////////////
const Element = require('./_absElement');
const _e = require('./_baseElement');
const _l = require('./_link');
const _n = require('./_node');
const Tobj = require('./_tobj');
const Util = require('./_util');
const SceneMode = Tobj.SceneMode;
const MouseCursor = Tobj.MouseCursor;

const Link = _l.Link;
const Node = _n.Node;
const InteractiveElement = _e.InteractiveElement;
/**
 * 画布
 *
 * @param {any} stage 所属stage舞台
 * @returns
 */
function Scene(stage) {
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
  null != stage && (stage.add(this), this.addTo(stage)),
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
    false !== this.visible && this.paint(ctx);
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
    let nodeArray = [];
    for (let i = 0; i < this.childs.length; i++) {
      let ele = this.childs[i];
      ele instanceof Node && this.isVisiable(ele) && nodeArray.push(ele);
      // ele.elementType === 'node' && this.isVisiable(ele) && nodeArray.push(ele);
    }
    return nodeArray;
  },
  /**
   * 绘制所有的child
   * @param {any} ctx 画布对象
   */
  this.paintChilds = function(ctx) {
    for (let i = 0; i < this.zIndexArray.length; i++) {
      let zIarr = this.zIndexArray[i], value = this.zIndexMap[zIarr];
      for (let j = 0; j < value.length; j++) {
        let ele = value[j];
        if (true === this.paintAll || this.isVisiable(ele)) {
          ctx.save();
          if (true === ele.transformAble) {
            let h = ele.getCenterLocation();
            ctx.translate(h.x, h.y),
              ele.rotate && ctx.rotate(ele.rotate),
              ele.scaleX && ele.scaleY ? ctx.scale(ele.scaleX, ele.scaleY) : ele.scaleX ? ctx.scale(ele.scaleX, 1) : ele.scaleY && ctx.scale(1, ele.scaleY);
          }
          if(true === ele.shadow){
            ctx.shadowBlur = ele.shadowBlur, ctx.shadowColor = ele.shadowColor, ctx.shadowOffsetX = ele.shadowOffsetX, ctx.shadowOffsetY = ele.shadowOffsetY;
          }
          if(ele instanceof InteractiveElement){
            if(ele.selected && true === ele.showSelected){
              ele.paintSelected(ctx);
            }
            if(true === ele.isMouseOver){
              ele.paintMouseover(ctx);
            }
          }
          ele.paint(ctx);
          ctx.restore();
        }
      }
    }
  },
  this.getOffsetTranslate = function(ctx) {
    let scW = this.stage.canvas.width,
      scH = this.stage.canvas.height;
    null != ctx && 'move' != ctx && (scW = ctx.canvas.width, scH = ctx.canvas.height);
    let valX = scW / this.scaleX / 2,
      valY = scH / this.scaleY / 2,
      offObj = {
        translateX: this.translateX + (valX - valX * this.scaleX),
        translateY: this.translateY + (valY - valY * this.scaleY)
      };
    return offObj;
  },
  this.isVisiable = function(ele) {
    if (true !== ele.visible) {return false;}
    if (ele instanceof Link) {return true;}
    // if (ele.elementType === 'link') {return true;}
    let offTrans = this.getOffsetTranslate(),
      calcX = ele.x + offTrans.translateX,
      calcY = ele.y + offTrans.translateY;
    calcX *= this.scaleX,
      calcY *= this.scaleY;
    let _width = calcX + ele.width * this.scaleX,
      _height = calcY + ele.height * this.scaleY;
    return calcX > this.stage.canvas.width || calcY > this.stage.canvas.height || 0 > _width || 0 > _height ? false : true;
  },
  /**
   * 绘制操作
   * @param {any} ctx context
   * @param {array} canvas操作
   */
  this.paintOperations = function(ctx, ops) {
    for (let i = 0; i < ops.length; i++) {
      ops[i](ctx);
    }
  },
  this.findElements = function(filterFn) {
    let eleResults = [];
    for (let i = 0; i < this.childs.length; i++) {
      true === filterFn(this.childs[i]) && eleResults.push(this.childs[i]);
    }
    return eleResults;
  },
  /**
   * 获取符合指定类型的所有元素
   * @param {any} targetEle 指定的元素类型
  */
  this.getElementsByClass = function(targetEle) {
    return this.findElements(function(ele) {
      return ele.elementType === targetEle.elementType || ele instanceof targetEle;
    });
  },
  this.addOperation = function(opFn) {
    return this.operations.push(opFn),
      this;
  },
  this.clearOperations = function() {
    return this.operations = [],
      this;
  },
  this.getElementByXY = function(eleX, eleY) {
    let eleResult = null;
    for (let i = this.zIndexArray.length - 1; i >= 0; i--) {
      let temp = this.zIndexArray[i], val = this.zIndexMap[temp];
      for (let j = val.length - 1; j >= 0; j--) {
        let eleTemp = val[j];
        if (eleTemp instanceof InteractiveElement && this.isVisiable(eleTemp) && eleTemp.isInBound(eleX, eleY)) {
          return eleResult = eleTemp;
        }
      }
    }
    return eleResult;
  },
  this.add = function(eleObj) {
    this.childs.push(eleObj),
      null == this.zIndexMap[eleObj.zIndex] && (this.zIndexMap[eleObj.zIndex] = [], this.zIndexArray.push(eleObj.zIndex), this.zIndexArray.sort(function(a, b) {
        return a - b;
      })),
      this.zIndexMap['' + eleObj.zIndex].push(eleObj);
  },
  /**
   * 清除元素
   * @param {any} eleObj 要被清除的元素
   */
  this.remove = function(eleObj) {
    this.childs = Util.removeFromArray(this.childs, eleObj);
    let val = this.zIndexMap[eleObj.zIndex];
    val && (this.zIndexMap[eleObj.zIndex] = Util.removeFromArray(val, eleObj)),
      eleObj.removeHandler(this);
  },
  /**
   * 清空画布中的所有元素
   * @param {any} eleObj 要被清除的元素
   */
  this.clear = function() {
    let _tempSelf = this;
    this.childs.forEach(function(tempEle) {
      tempEle.removeHandler(_tempSelf);
    }),
      this.childs = [],
      this.operations = [],
      this.zIndexArray = [],
      this.zIndexMap = {};
  },
  this.addToSelected = function(eleObj) {
    this.selectedElements.push(eleObj);
  },
  /**
   * 取消所有选中
   * @param {any} eleObj
   */
  this.cancleAllSelected = function(eleObj) {
    for (let i = 0; i < this.selectedElements.length; i++) {
      this.selectedElements[i].unselectedHandler(eleObj);
    }
    this.selectedElements = [];
  },
  this.notInSelectedNodes = function(eleObj) {
    for (let i = 0; i < this.selectedElements.length; i++) {
      if (eleObj === this.selectedElements[i]) {
        return false;
      }
    }
    return true;
  },
  /**
   * 删除所有选中
   * @param {any} eleObj
   */
  this.removeFromSelected = function(eleObj) {
    for (let i = 0; i < this.selectedElements.length; i++) {
      let selectObj = this.selectedElements[i];
      eleObj === selectObj && (this.selectedElements = this.selectedElements.del(i));
    }
  },
  this.toSceneEvent = function(ev) {
    let event = Util.clone(ev);
    event.x /= this.scaleX;
    event.y /= this.scaleY;
    if (1 == this.translate) {
      let offTrans = this.getOffsetTranslate();
      event.x -= offTrans.translateX,
        event.y -= offTrans.translateY;
    }
    return null != event.dx && (event.dx /= this.scaleX, event.dy /= this.scaleY),
      null != this.currentElement && (event.target = this.currentElement),
      event.scene = this,
      event;
  },
  this.selectElement = function(ev) {
    let targetEle = _self.getElementByXY(ev.x, ev.y);
    if (null != targetEle) {
      ev.target = targetEle, targetEle.mousedownHander(ev), targetEle.selectedHandler(ev);
      if (_self.notInSelectedNodes(targetEle)) {
        ev.ctrlKey || _self.cancleAllSelected(),
        _self.addToSelected(targetEle);
      } else {
        1 == ev.ctrlKey && (targetEle.unselectedHandler(), this.removeFromSelected(targetEle));
        for (let i = 0; i < this.selectedElements.length; i++) {
          let selectEle = this.selectedElements[i];
          selectEle.selectedHandler(ev);
        }
      }
    } else {
      ev.ctrlKey || _self.cancleAllSelected();
    }
    this.currentElement = targetEle;
  },
  this.mousedownHandler = function(ev) {
    let tempEvent = this.toSceneEvent(ev);
    this.mouseDown = true,
      this.mouseDownX = tempEvent.x,
      this.mouseDownY = tempEvent.y,
      this.mouseDownEvent = tempEvent;
    if (this.mode == SceneMode.normal) {
      this.selectElement(tempEvent),
      (null == this.currentElement || this.currentElement instanceof Link) && 1 == this.translate && (this.lastTranslateX = this.translateX, this.lastTranslateY = this.translateY);
    }
    else {
      if (this.mode == SceneMode.drag && 1 == this.translate) {
        return this.lastTranslateX = this.translateX, void (this.lastTranslateY = this.translateY);
      }
      this.mode == SceneMode.select ? this.selectElement(tempEvent) : this.mode == SceneMode.edit && (this.selectElement(tempEvent), (null == this.currentElement || this.currentElement instanceof Link) && 1 == this.translate && (this.lastTranslateX = this.translateX, this.lastTranslateY = this.translateY));
    }
    _self.dispatchEvent('mousedown', tempEvent);
  },
  this.mouseupHandler = function(ev) {
    this.stage.cursor != MouseCursor.normal && (this.stage.cursor = MouseCursor.normal),
      _self.clearOperations();
    let tempEvent = this.toSceneEvent(ev);
    null != this.currentElement && (tempEvent.target = _self.currentElement, this.currentElement.mouseupHandler(tempEvent)),
      this.dispatchEvent('mouseup', tempEvent),
      this.mouseDown = false;
  },
  this.dragElements = function(ev) {
    if (null != this.currentElement && 1 == this.currentElement.dragable) {
      for (let i = 0; i < this.selectedElements.length; i++) {
        let tempEle = this.selectedElements[i];
        if (0 != tempEle.dragable) {
          let tempEvent = Util.clone(ev);
          tempEvent.target = tempEle,
          tempEle.mousedragHandler(tempEvent);
        }
      }}
  },
  this.mousedragHandler = function(ev) {
    let tempEvent = this.toSceneEvent(ev);
    this.mode == SceneMode.normal ? null == this.currentElement || this.currentElement instanceof Link ?
    1 == this.translate && (this.stage.cursor = MouseCursor.closed_hand, this.translateX = this.lastTranslateX + tempEvent.dx, this.translateY = this.lastTranslateY + tempEvent.dy)
    :this.dragElements(tempEvent) : this.mode == SceneMode.drag ?
    1 == this.translate && (this.stage.cursor = MouseCursor.closed_hand, this.translateX = this.lastTranslateX + tempEvent.dx, this.translateY = this.lastTranslateY + tempEvent.dy)
    : this.mode == SceneMode.select ? null != this.currentElement ? 1 == this.currentElement.dragable && this.dragElements(tempEvent) : 1 == this.areaSelect && this.areaSelectHandle(tempEvent)
    : this.mode == SceneMode.edit && (null == this.currentElement || this.currentElement instanceof Link ?
    1 == this.translate && (this.stage.cursor = MouseCursor.closed_hand, this.translateX = this.lastTranslateX + tempEvent.dx, this.translateY = this.lastTranslateY + tempEvent.dy)
    : this.dragElements(tempEvent)),
      this.dispatchEvent('mousedrag', tempEvent);
  },
  this.areaSelectHandle = function(ev) {
    let offL = ev.offsetLeft,
      offT = ev.offsetTop,
      deOffL = this.mouseDownEvent.offsetLeft,
      deOffTop = this.mouseDownEvent.offsetTop,
      targetOffL = offL >= deOffL ? deOffL : offL,
      targetOffT = offT >= deOffTop ? deOffTop : offT,
      tarScaleX = Math.abs(ev.dx) * this.scaleX,
      tarScaleY = Math.abs(ev.dy) * this.scaleY,
      targetRect = new createRect(targetOffL, targetOffT, tarScaleX, tarScaleY);
    _self.clearOperations().addOperation(targetRect),
      offL = ev.x,
      offT = ev.y,
      deOffL = this.mouseDownEvent.x,
      deOffTop = this.mouseDownEvent.y,
      targetOffL = offL >= deOffL ? deOffL : offL,
      targetOffT = offT >= deOffTop ? deOffTop : offT,
      tarScaleX = Math.abs(ev.dx),
      tarScaleY = Math.abs(ev.dy);
    let _width = targetOffL + tarScaleX, _height = targetOffT + tarScaleY;
    for (let i = 0; i < _self.childs.length; i++) {
      let childItem = _self.childs[i];
      childItem.x > targetOffL && childItem.x + childItem.width < _width && childItem.y > targetOffT && childItem.y + childItem.height < _height && _self.notInSelectedNodes(childItem) && (childItem.selectedHandler(ev), _self.addToSelected(childItem));
    }
  },
  this.mousemoveHandler = function(ev) {
    this.mousecoord = {
      x: ev.x,
      y: ev.y
    };
    let c = this.toSceneEvent(ev);
    if (this.mode == SceneMode.drag) {return void (this.stage.cursor = MouseCursor.open_hand);}
    this.mode == SceneMode.normal ? this.stage.cursor = MouseCursor.normal : this.mode == SceneMode.select && (this.stage.cursor = MouseCursor.normal);
    let d = _self.getElementByXY(c.x, c.y);
    null != d ? (_self.mouseOverelement && _self.mouseOverelement !== d && (c.target = d, _self.mouseOverelement.mouseoutHandler(c)), _self.mouseOverelement = d, 0 == d.isMouseOver ? (c.target = d, d.mouseoverHandler(c), _self.dispatchEvent('mouseover', c)) : (c.target = d, d.mousemoveHandler(c), _self.dispatchEvent('mousemove', c))) : _self.mouseOverelement ? (c.target = d, _self.mouseOverelement.mouseoutHandler(c), _self.mouseOverelement = null, _self.dispatchEvent('mouseout', c)) : (c.target = null, _self.dispatchEvent('mousemove', c));
  },
  this.mouseoverHandler = function(ev) {
    let b = this.toSceneEvent(ev);
    this.dispatchEvent('mouseover', b);
  },
  this.mouseoutHandler = function(ev) {
    let b = this.toSceneEvent(ev);
    this.dispatchEvent('mouseout', b);
  },
  this.clickHandler = function(ev) {
    let b = this.toSceneEvent(ev);
    this.currentElement && (b.target = this.currentElement, this.currentElement.clickHandler(b)),
      this.dispatchEvent('click', b);
  },
  this.dbclickHandler = function(ev) {
    let b = this.toSceneEvent(ev);
    this.currentElement ? (b.target = this.currentElement, this.currentElement.dbclickHandler(b)) : _self.cancleAllSelected(),
      this.dispatchEvent('dbclick', b);
  },
  this.mousewheelHandler = function(ev) {
    let b = this.toSceneEvent(ev);
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
      var item = a[c];
      'background' == c && (item = a._background.src),
        'string' == typeof item && (item = '"' + item + '"'),
        b += '"' + c + '":' + item + ',';
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
let imageCache = {};
Object.defineProperties(Scene.prototype, {
  background: {
    get: function() {
      return this._background;
    },
    set: function(imgUrl) {
      if ('string' == typeof imgUrl) {
        let img = imageCache[imgUrl];
        null == img && (img = new Image, img.src = imgUrl, img.onload = function() {
          imageCache[imgUrl] = img;
        }),
          this._background = img;
      } else {this._background = imgUrl;}
    }
  }
});

module.exports = Scene;
