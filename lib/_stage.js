//////////////////////////////
/**
 * stage
 * 舞台
 * @author ilex
 * @description 2016-11-05 11:56:12
 */
//////////////////////////////
const Util = require('./_util');
const Tobj = require('./_tobj');

/**
 * 鹰眼
 *
 * @param {any} stage
 * @returns
 */
function createEagleEye(stageObj) {
  return {
    hgap: 16,
    visible: false,
    exportCanvas: document.createElement('canvas'),
    /**
     * 获取图片
     * @param {number} _width
     * @param {number} _width
     * @return base64 img
     */
    getImage: function(_width, _height) {
      let bound = stageObj.getBound(),
        scalewidth = 1, // 缩放当前绘图的宽度 (1=100%, 0.5=50%, 2=200%, 依次类推)
        scaleheight = 1; // 缩放当前绘图的高度 (1=100%, 0.5=50%, 2=200%, etc.)
      this.exportCanvas.width = stageObj.canvas.width,
        this.exportCanvas.height = stageObj.canvas.height;
      if(null != _width && null != _height){
        this.exportCanvas.width = _width,
          this.exportCanvas.height = _height,
          scalewidth = _width / bound.width,
          scaleheight = _height / bound.height;
      }else{
        if(bound.width > stageObj.canvas.width){
          this.exportCanvas.width = bound.width;
        }
        if(bound.height > stageObj.canvas.height){
          this.exportCanvas.height = bound.heigh;
        }
      }
      // null != _width && null != _height ?
      // (this.exportCanvas.width = _width, this.exportCanvas.height = _height, e = _width / bound.width, f = _height / bound.height)
      // :
      // (bound.width > stageObj.canvas.width && (this.exportCanvas.width = bound.width), bound.height > stageObj.canvas.height && (this.exportCanvas.height = bound.height));
      let ctx = this.exportCanvas.getContext('2d');
      if(stageObj.childs.length > 0){
        ctx.save(),
        ctx.clearRect(0, 0, this.exportCanvas.width, this.exportCanvas.height),
        stageObj.childs.forEach(function(a) {
          if(1 == stageObj.visible){
            stageObj.save(),
            stageObj.translateX = 0,
            stageObj.translateY = 0,
            stageObj.scaleX = 1,
            stageObj.scaleY = 1,
            ctx.scale(scalewidth, scaleheight);
            if(bound.left < 0){
              stageObj.translateX = Math.abs(bound.left);
            }
            if(bound.top < 0) {
              stageObj.translateY = Math.abs(bound.top);
            }
            stageObj.paintAll = true,
            stageObj.repaint(ctx),
            stageObj.paintAll = false,
            stageObj.restore();
          }
        }),
        ctx.restore();
      }
      return this.exportCanvas.toDataURL('image/png');// base64编码图片
    },
    canvas: document.createElement('canvas'),
    update: function() {
      this.eagleImageDatas = this.getData(stageObj);
    },
    setSize: function(width, height) {
      this.width = this.canvas.width = width,
        this.height = this.canvas.height = height;
    },
    getData: function(_width, _height) {
      /**
       * 创建translate
       * 
       * @param {any} gdStage 舞台实例
       * @returns
       */
      function createTranslate(gdStage) {
        let scW = gdStage.stage.canvas.width,
          scH = gdStage.stage.canvas.height,
          tempX = scW / gdStage.scaleX / 2,
          tempY = scH / gdStage.scaleY / 2;
        return {
          translateX: gdStage.translateX + tempX - tempX * gdStage.scaleX,
          translateY: gdStage.translateY + tempY - tempY * gdStage.scaleY
        };
      }
      let ctx = this.canvas.getContext('2d');
      let limitW, limitH;
      if (stageObj.childs.length > 0) {
        ctx.save(),
          ctx.clearRect(0, 0, this.canvas.width, this.canvas.height),
          stageObj.childs.forEach(function(childStage) {
            if(true == childStage.visible){
              childStage.save(),
                childStage.centerAndZoom(null, null, ctx),
                childStage.repaint(ctx),
                childStage.restore();
            }
            // true == childStage.visible && (childStage.save(), childStage.centerAndZoom(null, null, ctx), childStage.repaint(ctx), childStage.restore());
          });
        let $translate = createTranslate(stageObj.childs[0]),
          trX = $translate.translateX * (this.canvas.width / stageObj.canvas.width) * stageObj.childs[0].scaleX,
          trY = $translate.translateY * (this.canvas.height / stageObj.canvas.height) * stageObj.childs[0].scaleY,
          bound = stageObj.getBound();
        limitW = stageObj.canvas.width / stageObj.childs[0].scaleX / bound.width;
        limitH = stageObj.canvas.height / stageObj.childs[0].scaleY / bound.height;
        limitW > 1 && (limitW = 1),
          limitH > 1 && (limitW = 1),
          trX *= limitW,
          trY *= limitH,
          bound.left < 0 && (trX -= Math.abs(bound.left) * (this.width / bound.width)),
          bound.top < 0 && (trY -= Math.abs(bound.top) * (this.height / bound.height)),
          ctx.save(),
          ctx.lineWidth = 1,
          ctx.strokeStyle = 'rgba(255,0,0,1)',
          ctx.strokeRect(- trX, -trY, ctx.canvas.width * limitW, ctx.canvas.height * limitH),
          ctx.restore();
        let l = null;
        try {
          l = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        } catch (m) { console.log(m); }
        return l;
      }
      null != limitW && null != limitH ? this.setSize(_width, _height) : this.setSize(200, 160);
      return null;
    },
    paint: function() {
      if (null != this.eagleImageDatas) {
        let ctx = stageObj.graphics;
        ctx.save(),
          ctx.fillStyle = 'rgba(211,211,211,0.3)',
          ctx.fillRect(stageObj.canvas.width - this.canvas.width - 2 * this.hgap, stageObj.canvas.height - this.canvas.height - 1, stageObj.canvas.width - this.canvas.width, this.canvas.height + 1),
          ctx.fill(),
          ctx.save(),
          ctx.lineWidth = 1,
          ctx.strokeStyle = 'rgba(0,0,0,1)',
          ctx.rect(stageObj.canvas.width - this.canvas.width - 2 * this.hgap, stageObj.canvas.height - this.canvas.height - 1, stageObj.canvas.width - this.canvas.width, this.canvas.height + 1),
          ctx.stroke(),
          ctx.restore(),
          ctx.putImageData(this.eagleImageDatas, stageObj.canvas.width - this.canvas.width - this.hgap, stageObj.canvas.height - this.canvas.height),
          ctx.restore();
      } else {
        this.eagleImageDatas = this.getData(stageObj);
      }
    },
    /**
     * 事件handler
     * @param {string} eventType
     * @param {event} eventPos
     * @param {string} st stage实例
     */
    eventHandler: function(eventType, eventPos, st) {
      let epX = eventPos.x,
        epY = eventPos.y;
      if (epX > st.canvas.width - this.canvas.width && epY > st.canvas.height - this.canvas.height) {
        epX = eventPos.x - this.canvas.width;
        epY = eventPos.y - this.canvas.height;
        if('mousedown' == eventType){
          this.lastTranslateX = st.childs[0].translateX, this.lastTranslateY = st.childs[0].translateY;
        }
        if ('mousedrag' == eventType && st.childs.length > 0) {
          let epDx = eventPos.dx,
            epDy = eventPos.dy,
            bound = st.getBound(),
            w_x_w = this.canvas.width / st.childs[0].scaleX / bound.width,
            h_y_h = this.canvas.height / st.childs[0].scaleY / bound.height;
          st.childs[0].translateX = this.lastTranslateX - epDx / w_x_w,
            st.childs[0].translateY = this.lastTranslateY - epDy / h_y_h;
        }
      } else{console.log('other');}
    }
  };
}

/**
 * 创建stage 需要参数canvas
 * 创建一个舞台,需要传递一个canvas对象
 * @param {any} $canvas
 */
function Stage($canvas) {
  Tobj.stage = this;
  let _self = this;
  let isContextMenu = true, isMenuTimeOut = null;
  /**
   * 获取事件发生的位置
   * 
   * @param {any} ev
   * @returns
   */
  function _getEventPosition(ev) {
    let evPos = Util.getEventPosition(ev),
      offPos = Util.getOffsetPosition(_self.canvas);
    return evPos.offsetLeft = evPos.pageX - offPos.left,
      evPos.offsetTop = evPos.pageY - offPos.top,
      evPos.x = evPos.offsetLeft,
      evPos.y = evPos.offsetTop,
      evPos.target = null,
      evPos;
  }
  function mouseOver(ev) {
    document.onselectstart = function() {
      return false;
    },
      this.mouseOver = true;
    let evPos = _getEventPosition(ev);
    _self.dispatchEventToScenes('mouseover', evPos),
      _self.dispatchEvent('mouseover', evPos);
  }
  function mouseOut(ev) {
    isMenuTimeOut = setTimeout(function() {
      isContextMenu = true;
    },
      500),
      document.onselectstart = function() {
        return true;
      };
    let evPos = _getEventPosition(ev);
    _self.dispatchEventToScenes('mouseout', evPos),
      _self.dispatchEvent('mouseout', evPos),
      _self.needRepaint = 0 == _self.animate ? false : true;
  }
  function mouseDown(ev) {
    let evPos = _getEventPosition(ev);
    _self.mouseDown = true,
      _self.mouseDownX = evPos.x,
      _self.mouseDownY = evPos.y,
      _self.dispatchEventToScenes('mousedown', evPos),
      _self.dispatchEvent('mousedown', evPos);
  }
  function mouseUp(ev) {
    let evPos = _getEventPosition(ev);
    _self.dispatchEventToScenes('mouseup', evPos),
      _self.dispatchEvent('mouseup', evPos),
      _self.mouseDown = false,
      _self.needRepaint = 0 == _self.animate ? false : true;
  }
  function mouseMove(ev) {
    isMenuTimeOut && (window.clearTimeout(isMenuTimeOut), isMenuTimeOut = null),
      isContextMenu = false;
    let evPos = _getEventPosition(ev);
    _self.mouseDown ? 0 == ev.button && (evPos.dx = evPos.x - _self.mouseDownX, evPos.dy = evPos.y - _self.mouseDownY, _self.dispatchEventToScenes('mousedrag', evPos), _self.dispatchEvent('mousedrag', evPos), 1 == _self.eagleEye.visible && _self.eagleEye.update()) : (_self.dispatchEventToScenes('mousemove', evPos), _self.dispatchEvent('mousemove', evPos));
  }
  function click(ev) {
    let evPos = _getEventPosition(ev);
    _self.dispatchEventToScenes('click', evPos),
      _self.dispatchEvent('click', evPos);
  }
  function dbClick(ev) {
    let evPos = _getEventPosition(ev);
    _self.dispatchEventToScenes('dbclick', evPos),
      _self.dispatchEvent('dbclick', evPos);
  }
  function mouseWheel(ev) {
    let evPos = _getEventPosition(ev);
    _self.dispatchEventToScenes('mousewheel', evPos),
      _self.dispatchEvent('mousewheel', evPos),
      null != _self.wheelZoom && (ev.preventDefault ? ev.preventDefault() : (ev = ev || window.event, ev.returnValue = false), 1 == _self.eagleEye.visible && _self.eagleEye.update());
  }
  /**
   * 添加事件
   *
   * @param {any} targetDom
   */
  function addEvent(targetDom) {
    if(Util.isIE || !window.addEventListener){
      targetDom.onmouseout = mouseOut,
      targetDom.onmouseover = mouseOver,
      targetDom.onmousedown = mouseDown,
      targetDom.onmouseup = mouseUp,
      targetDom.onmousemove = mouseMove,
      targetDom.onclick = click,
      targetDom.ondblclick = dbClick,
      targetDom.onmousewheel = mouseWheel,
      targetDom.touchstart = mouseDown,
      targetDom.touchmove = mouseMove,
      targetDom.touchend = mouseUp;
    }else{
      targetDom.addEventListener('mouseout', mouseOut),
      targetDom.addEventListener('mouseover', mouseOver),
      targetDom.addEventListener('mousedown', mouseDown),
      targetDom.addEventListener('mouseup', mouseUp),
      targetDom.addEventListener('mousemove', mouseMove),
      targetDom.addEventListener('click', click),
      targetDom.addEventListener('dblclick', dbClick);
      if(Util.isFirefox){
        targetDom.addEventListener('DOMMouseScroll', mouseWheel);
      }else{
        targetDom.addEventListener('mousewheel', mouseWheel);
      }
    }
    if(window.addEventListener){
      window.addEventListener('keydown',
        function(ev) {
          _self.dispatchEventToScenes('keydown', Util.cloneEvent(ev));
          let code = ev.keyCode;
          if(37 == code || 38 == code || 39 == code || 40 == code){
            ev.preventDefault ? ev.preventDefault() : (ev = ev || window.event, ev.returnValue = false);
          }
        },
          true);
    }
  }
  this.initialize = function(cans) {
    addEvent(cans),
      this.canvas = cans,
      this.graphics = cans.getContext('2d'),
      this.childs = [],
      this.frames = 24,
      this.messageBus = new Util.MessageBus,
      this.eagleEye = createEagleEye(this),
      this.wheelZoom = null,
      this.mouseDownX = 0,
      this.mouseDownY = 0,
      this.mouseDown = false,
      this.mouseOver = false,
      this.needRepaint = true,
      this.serializedProperties = ['frames', 'wheelZoom'];
  },
  null != $canvas && this.initialize($canvas);
  document.oncontextmenu = function() {
    return isContextMenu;
  },

  /**
   * 触发事件
   * @param {string} eventType 事件类型
   * @param {any} eventPos 发生事件的位置
   */
  this.dispatchEventToScenes = function(eventType, eventPos) {
    if(0 != this.frames){
      this.needRepaint = true;
    }
    if (1 == this.eagleEye.visible && -1 != eventType.indexOf('mouse')) {
      let c = eventPos.x,
        d = eventPos.y;
      if (c > this.width - this.eagleEye.width && d > this.height - this.eagleEye.height) {
        return void this.eagleEye.eventHandler(eventType, eventPos, this);
      }
    }
    this.childs.forEach(function(c) {
      if (1 == c.visible) {
        let d = c[eventType + 'Handler'];
        if (null == d) {throw new Error('Function not found:' + eventType + 'Handler');}
        d.call(c, eventPos);
      }
    });
  },
  /**
   * 添加一个stage
   * @param {any} st stage实例
   */
  this.add = function(st) {
    for (let i = 0; i < this.childs.length; i++){
      if (this.childs[i] === st) {
        return;
      }
    }
    st.addTo(this),this.childs.push(st);
  },
  /**
   * 移除一个stage
   * @param {any} st stage实例
   */
  this.remove = function(st) {
    if (null == st) {throw new Error('Stage.remove出错: 参数为null!');}
    for (let i = 0; i < this.childs.length; i++) {
      if (this.childs[i] === st) {
        st.stage = null,
        this.childs = this.childs.del(i);
        return this;
      }
    }
    return this;
  },
  /**
   * 清空所有
   */
  this.clear = function() {
    this.childs = [];
  },
  /**
   * 添加事件
   * @param {string} evType 事件类型
   * @param {function} fn 执行函数
   */
  this.addEventListener = function(evType, fn) {
    let _self = this,
      callback = function(msg) {
        fn.call(_self, msg);
      };
    return this.messageBus.subscribe(evType, callback),
      this;
  },
  this.removeEventListener = function(evType) {
    this.messageBus.unsubscribe(evType);
  },
  this.removeAllEventListener = function() {
    this.messageBus = new Util.MessageBus;
  },
  this.dispatchEvent = function(evType, msg) {
    return this.messageBus.publish(evType, msg),
      this;
  };
  let events = 'click,dbclick,mousedown,mouseup,mouseover,mouseout,mousemove,mousedrag,mousewheel,touchstart,touchmove,touchend,keydown,keyup'.split(','),
    tempSelf = this;
  events.forEach(function(ev) {
    tempSelf[ev] = function(fn) {
      null != fn ? this.addEventListener(ev, fn) : this.dispatchEvent(ev);
    };
  }),
  /**
   * 保存成网页图片(新打开一个页面,用于展示图片)
   * @param {number} width 区域宽
   * @param {number} heigh 区域高
   */
  this.saveImageInfo = function(width, heigh) {
    let imgData = this.eagleEye.getImage(width, heigh),
      newPage = window.open('about:blank');
    return newPage.document.write('<img src=\'' + imgData + '\' alt=\'from canvas\'/>'),
      this;
  },
  /**
   * 保存成本地图片
   * @param {number} width 区域宽
   * @param {number} heigh 区域高
   */
  this.saveAsLocalImage = function(width, heigh) {
    let imgData = this.eagleEye.getImage(width, heigh);
    return imgData.replace('image/png', 'image/octet-stream'),
      window.location.href = imgData,
      this;
  },
  this.paint = function() {
    if(null != this.canva){
      this.graphics.save();
      this.graphics.clearRect(0, 0, this.width, this.height);
      this.childs.forEach(function(item) {
        1 == item.visible && item.repaint(_self.graphics);
      });
      if(1 == this.eagleEye.visible){
        this.eagleEye.paint(this);
      }
      this.graphics.restore();
    }
    // null != this.canvas &&(this.graphics.save(),this.graphics.clearRect(0, 0, this.width, this.height),
    // this.childs.forEach(function(a) {1 == a.visible && a.repaint(_self.graphics);
    // }),1 == this.eagleEye.visible && this.eagleEye.paint(this),this.graphics.restore());
  },
  this.repaint = function() {
    0 != this.frames && (this.frames < 0 && 0 == this.needRepaint || (this.paint(), this.frames < 0 && (this.needRepaint = false)));
  },
  this.zoom = function(wheel) {
    this.childs.forEach(function(st) {
      0 != st.visible && st.zoom(wheel);
    });
  },
  this.zoomOut = function(wheel) {
    this.childs.forEach(function(st) {
      0 != st.visible && st.zoomOut(wheel);
    });
  },
  this.zoomIn = function(wheel) {
    this.childs.forEach(function(st) {
      0 != st.visible && st.zoomIn(wheel);
    });
  },
  this.centerAndZoom = function() {
    this.childs.forEach(function(st) {
      0 != st.visible && st.centerAndZoom();
    });
  },
  this.setCenter = function(_w, _h) {
    let _self = this;
    this.childs.forEach(function(st) {
      let cw = _w - _self.canvas.width / 2,
        ch = _h - _self.canvas.height / 2;
      st.translateX = -cw,
        st.translateY = -ch;
    });
  },
  this.getBound = function() {
    let bound = {
      left: Number.MAX_VALUE,
      right: Number.MIN_VALUE,
      top: Number.MAX_VALUE,
      bottom: Number.MIN_VALUE
    };
    return this.childs.forEach(function(st) {
      let eb = st.getElementsBound();
      eb.left < bound.left && (bound.left = eb.left, bound.leftNode = eb.leftNode),
        eb.top < bound.top && (bound.top = eb.top, bound.topNode = eb.topNode),
        eb.right > bound.right && (bound.right = eb.right, bound.rightNode = eb.rightNode),
        eb.bottom > bound.bottom && (bound.bottom = eb.bottom, bound.bottomNode = eb.bottomNode);
    }),
      bound.width = bound.right - bound.left,
      bound.height = bound.bottom - bound.top,
      bound;
  },
  /**
   * 将所有元素转化为json
   */
  this.toJson = function() {
    let _self = this,
      resultJson = '{"version":"' + Tobj.version + '",';
    this.serializedProperties.length;
    return this.serializedProperties.forEach(function(spItem) {
      let spItemValue = _self[spItem];
      'string' == typeof d && (spItemValue = '"' + spItemValue + '"'),
        resultJson += '"' + spItem + '":' + spItemValue + ',';
    }),
      resultJson += '"childs":[',
      this.childs.forEach(function(stItem) {
        resultJson += stItem.toJson();
      }),
      resultJson += ']',
      resultJson += '}';
  },
  /**
   * 匿名自执行函数
   */
  function() {
    0 == _self.frames ?
    setTimeout(arguments.callee, 100)
    :
    _self.frames < 0
    ?
    (_self.repaint(), setTimeout(arguments.callee, 1e3 / -_self.frames))
    :
    (_self.repaint(), setTimeout(arguments.callee, 1e3 / _self.frames));
  } (),
  /**
   * 定时器
   */
  setTimeout(function() {
    _self.mousewheel(function(target) {
      let temp = null == target.wheelDelta ? target.detail : target.wheelDelta;
      // null != this.wheelZoom && (temp > 0 ? this.zoomIn(this.wheelZoom) : this.zoomOut(this.wheelZoom));
      // 解决ff 和 chrome兼容性
      null != this.wheelZoom && (Util.isChrome ? (temp > 0 ? this.zoomOut(this.wheelZoom) : this.zoomIn(this.wheelZoom)) : (temp > 0 ? this.zoomIn(this.wheelZoom) : this.zoomOut(this.wheelZoom)));
    }),
      _self.paint();
  },
    300),
  setTimeout(function() {
    _self.paint();
  },
    1e3),
  setTimeout(function() {
    _self.paint();
  },
    3e3);
}

Stage.prototype = {
  get width() {
    return this.canvas.width;
  },
  get height() {
    return this.canvas.height;
  },
  set cursor(cur) {
    this.canvas.style.cursor = cur;
  },
  get cursor() {
    return this.canvas.style.cursor;
  },
  set mode(modeType) {
    this.childs.forEach(function(st) {
      st.mode = modeType;
    });
  }
};

module.exports = Stage;
