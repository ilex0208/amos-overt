const Util = require('./_util');
const Tobj = require('./_tobj');

function b(a) {
  return {
    hgap: 16,
    visible: !1,
    exportCanvas: document.createElement('canvas'),
    getImage: function(b, c) {
      var d = a.getBound(),
        e = 1,
        f = 1;
      this.exportCanvas.width = a.canvas.width,
        this.exportCanvas.height = a.canvas.height,
        null != b && null != c ? (this.exportCanvas.width = b, this.exportCanvas.height = c, e = b / d.width, f = c / d.height) : (d.width > a.canvas.width && (this.exportCanvas.width = d.width), d.height > a.canvas.height && (this.exportCanvas.height = d.height));
      var g = this.exportCanvas.getContext('2d');
      return a.childs.length > 0 && (g.save(), g.clearRect(0, 0, this.exportCanvas.width, this.exportCanvas.height), a.childs.forEach(function(a) {
        1 == a.visible && (a.save(), a.translateX = 0, a.translateY = 0, a.scaleX = 1, a.scaleY = 1, g.scale(e, f), d.left < 0 && (a.translateX = Math.abs(d.left)), d.top < 0 && (a.translateY = Math.abs(d.top)), a.paintAll = !0, a.repaint(g), a.paintAll = !1, a.restore());
      }), g.restore()),
        this.exportCanvas.toDataURL('image/png');
    },
    canvas: document.createElement('canvas'),
    update: function() {
      this.eagleImageDatas = this.getData(a);
    },
    setSize: function(a, b) {
      this.width = this.canvas.width = a,
        this.height = this.canvas.height = b;
    },
    getData: function(b, c) {
      function d(a) {
        var b = a.stage.canvas.width,
          c = a.stage.canvas.height,
          d = b / a.scaleX / 2,
          e = c / a.scaleY / 2;
        return {
          translateX: a.translateX + d - d * a.scaleX,
          translateY: a.translateY + e - e * a.scaleY
        };
      }
      null != j && null != k ? this.setSize(b, c) : this.setSize(200, 160);
      var e = this.canvas.getContext('2d');
      if (a.childs.length > 0) {
        e.save(),
          e.clearRect(0, 0, this.canvas.width, this.canvas.height),
          a.childs.forEach(function(a) {
            1 == a.visible && (a.save(), a.centerAndZoom(null, null, e), a.repaint(e), a.restore());
          });
        var f = d(a.childs[0]),
          g = f.translateX * (this.canvas.width / a.canvas.width) * a.childs[0].scaleX,
          h = f.translateY * (this.canvas.height / a.canvas.height) * a.childs[0].scaleY,
          i = a.getBound(),
          j = a.canvas.width / a.childs[0].scaleX / i.width,
          k = a.canvas.height / a.childs[0].scaleY / i.height;
        j > 1 && (j = 1),
          k > 1 && (j = 1),
          g *= j,
          h *= k,
          i.left < 0 && (g -= Math.abs(i.left) * (this.width / i.width)),
          i.top < 0 && (h -= Math.abs(i.top) * (this.height / i.height)),
          e.save(),
          e.lineWidth = 1,
          e.strokeStyle = 'rgba(255,0,0,1)',
          e.strokeRect(- g, -h, e.canvas.width * j, e.canvas.height * k),
          e.restore();
        var l = null;
        try {
          l = e.getImageData(0, 0, e.canvas.width, e.canvas.height);
        } catch (m) { console.log(m); }
        return l;
      }
      return null;
    },
    paint: function() {
      if (null != this.eagleImageDatas) {
        var b = a.graphics;
        b.save(),
          b.fillStyle = 'rgba(211,211,211,0.3)',
          b.fillRect(a.canvas.width - this.canvas.width - 2 * this.hgap, a.canvas.height - this.canvas.height - 1, a.canvas.width - this.canvas.width, this.canvas.height + 1),
          b.fill(),
          b.save(),
          b.lineWidth = 1,
          b.strokeStyle = 'rgba(0,0,0,1)',
          b.rect(a.canvas.width - this.canvas.width - 2 * this.hgap, a.canvas.height - this.canvas.height - 1, a.canvas.width - this.canvas.width, this.canvas.height + 1),
          b.stroke(),
          b.restore(),
          b.putImageData(this.eagleImageDatas, a.canvas.width - this.canvas.width - this.hgap, a.canvas.height - this.canvas.height),
          b.restore();
      } else {this.eagleImageDatas = this.getData(a);}
    },
    eventHandler: function(a, b, c) {
      var d = b.x,
        e = b.y;
      if (d > c.canvas.width - this.canvas.width && e > c.canvas.height - this.canvas.height) {
        if (d = b.x - this.canvas.width, e = b.y - this.canvas.height, 'mousedown' == a && (this.lastTranslateX = c.childs[0].translateX, this.lastTranslateY = c.childs[0].translateY), 'mousedrag' == a && c.childs.length > 0) {
          var f = b.dx,
            g = b.dy,
            h = c.getBound(),
            i = this.canvas.width / c.childs[0].scaleX / h.width,
            j = this.canvas.height / c.childs[0].scaleY / h.height;
          c.childs[0].translateX = this.lastTranslateX - f / i,
            c.childs[0].translateY = this.lastTranslateY - g / j;
        }
      } else{console.log('other');}
    }
  };
}
function Stage(c) {
  function d(b) {
    var c = Util.getEventPosition(b),
      d = Util.getOffsetPosition(n.canvas);
    return c.offsetLeft = c.pageX - d.left,
      c.offsetTop = c.pageY - d.top,
      c.x = c.offsetLeft,
      c.y = c.offsetTop,
      c.target = null,
      c;
  }
  function e(a) {
    document.onselectstart = function() {
      return !1;
    },
      this.mouseOver = !0;
    var b = d(a);
    n.dispatchEventToScenes('mouseover', b),
      n.dispatchEvent('mouseover', b);
  }
  function f(a) {
    p = setTimeout(function() {
      o = !0;
    },
      500),
      document.onselectstart = function() {
        return !0;
      };
    var b = d(a);
    n.dispatchEventToScenes('mouseout', b),
      n.dispatchEvent('mouseout', b),
      n.needRepaint = 0 == n.animate ? !1 : !0;
  }
  function g(a) {
    var b = d(a);
    n.mouseDown = !0,
      n.mouseDownX = b.x,
      n.mouseDownY = b.y,
      n.dispatchEventToScenes('mousedown', b),
      n.dispatchEvent('mousedown', b);
  }
  function h(a) {
    var b = d(a);
    n.dispatchEventToScenes('mouseup', b),
      n.dispatchEvent('mouseup', b),
      n.mouseDown = !1,
      n.needRepaint = 0 == n.animate ? !1 : !0;
  }
  function i(a) {
    p && (window.clearTimeout(p), p = null),
      o = !1;
    var b = d(a);
    n.mouseDown ? 0 == a.button && (b.dx = b.x - n.mouseDownX, b.dy = b.y - n.mouseDownY, n.dispatchEventToScenes('mousedrag', b), n.dispatchEvent('mousedrag', b), 1 == n.eagleEye.visible && n.eagleEye.update()) : (n.dispatchEventToScenes('mousemove', b), n.dispatchEvent('mousemove', b));
  }
  function j(a) {
    var b = d(a);
    n.dispatchEventToScenes('click', b),
      n.dispatchEvent('click', b);
  }
  function k(a) {
    var b = d(a);
    n.dispatchEventToScenes('dbclick', b),
      n.dispatchEvent('dbclick', b);
  }
  function l(a) {
    var b = d(a);
    n.dispatchEventToScenes('mousewheel', b),
      n.dispatchEvent('mousewheel', b),
      null != n.wheelZoom && (a.preventDefault ? a.preventDefault() : (a = a || window.event, a.returnValue = !1), 1 == n.eagleEye.visible && n.eagleEye.update());
  }
  function m(b) {
    Util.isIE || !window.addEventListener ? (b.onmouseout = f, b.onmouseover = e, b.onmousedown = g, b.onmouseup = h, b.onmousemove = i, b.onclick = j, b.ondblclick = k, b.onmousewheel = l, b.touchstart = g, b.touchmove = i, b.touchend = h) : (b.addEventListener('mouseout', f), b.addEventListener('mouseover', e), b.addEventListener('mousedown', g), b.addEventListener('mouseup', h), b.addEventListener('mousemove', i), b.addEventListener('click', j), b.addEventListener('dblclick', k), Util.isFirefox ? b.addEventListener('DOMMouseScroll', l) : b.addEventListener('mousewheel', l)),
      window.addEventListener && (window.addEventListener('keydown',
        function(b) {
          n.dispatchEventToScenes('keydown', Util.cloneEvent(b));
          var c = b.keyCode; (37 == c || 38 == c || 39 == c || 40 == c) && (b.preventDefault ? b.preventDefault() : (b = b || window.event, b.returnValue = !1));
        },
        !0), window.addEventListener('keyup',
          function(b) {
            n.dispatchEventToScenes('keyup', Util.cloneEvent(b));
            var c = b.keyCode; (37 == c || 38 == c || 39 == c || 40 == c) && (b.preventDefault ? b.preventDefault() : (b = b || window.event, b.returnValue = !1));
          },
          !0));
  }
  Tobj.stage = this;
  var n = this;
  this.initialize = function(c) {
    m(c),
      this.canvas = c,
      this.graphics = c.getContext('2d'),
      this.childs = [],
      this.frames = 24,
      this.messageBus = new Util.MessageBus,
      this.eagleEye = b(this),
      this.wheelZoom = null,
      this.mouseDownX = 0,
      this.mouseDownY = 0,
      this.mouseDown = !1,
      this.mouseOver = !1,
      this.needRepaint = !0,
      this.serializedProperties = ['frames', 'wheelZoom'];
  },
    null != c && this.initialize(c);
  var o = !0,p = null;
  document.oncontextmenu = function() {
    return o;
  },
    this.dispatchEventToScenes = function(a, b) {
      if (0 != this.frames && (this.needRepaint = !0), 1 == this.eagleEye.visible && -1 != a.indexOf('mouse')) {
        var c = b.x,
          d = b.y;
        if (c > this.width - this.eagleEye.width && d > this.height - this.eagleEye.height) {return void this.eagleEye.eventHandler(a, b, this);}
      }
      this.childs.forEach(function(c) {
        if (1 == c.visible) {
          var d = c[a + 'Handler'];
          if (null == d) {throw new Error('Function not found:' + a + 'Handler');}
          d.call(c, b);
        }
      });
    },
    this.add = function(a) {
      for (var b = 0; b < this.childs.length; b++) if (this.childs[b] === a) {return;}
      a.addTo(this),this.childs.push(a);
    },
    this.remove = function(a) {
      if (null == a) {throw new Error('Stage.remove出错: 参数为null!');}
      for (var b = 0; b < this.childs.length; b++) {if (this.childs[b] === a) {return a.stage = null,
        this.childs = this.childs.del(b),
        this;}}
      return this;
    },
    this.clear = function() {
      this.childs = [];
    },
    this.addEventListener = function(a, b) {
      var c = this,
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
  var q = 'click,dbclick,mousedown,mouseup,mouseover,mouseout,mousemove,mousedrag,mousewheel,touchstart,touchmove,touchend,keydown,keyup'.split(','),
    r = this;
  q.forEach(function(a) {
    r[a] = function(b) {
      null != b ? this.addEventListener(a, b) : this.dispatchEvent(a);
    };
  }),
    this.saveImageInfo = function(a, b) {
      var c = this.eagleEye.getImage(a, b),
        d = window.open('about:blank');
      return d.document.write('<img src=\'' + c + '\' alt=\'from canvas\'/>'),
        this;
    },
    this.saveAsLocalImage = function(a, b) {
      var c = this.eagleEye.getImage(a, b);
      return c.replace('image/png', 'image/octet-stream'),
        window.location.href = c,
        this;
    },
    this.paint = function() {
      null != this.canvas && (this.graphics.save(), this.graphics.clearRect(0, 0, this.width, this.height), this.childs.forEach(function(a) {
        1 == a.visible && a.repaint(n.graphics);
      }), 1 == this.eagleEye.visible && this.eagleEye.paint(this), this.graphics.restore());
    },
    this.repaint = function() {
      0 != this.frames && (this.frames < 0 && 0 == this.needRepaint || (this.paint(), this.frames < 0 && (this.needRepaint = !1)));
    },
    this.zoom = function(a) {
      this.childs.forEach(function(b) {
        0 != b.visible && b.zoom(a);
      });
    },
    this.zoomOut = function(a) {
      this.childs.forEach(function(b) {
        0 != b.visible && b.zoomOut(a);
      });
    },
    this.zoomIn = function(a) {
      this.childs.forEach(function(b) {
        0 != b.visible && b.zoomIn(a);
      });
    },
    this.centerAndZoom = function() {
      this.childs.forEach(function(a) {
        0 != a.visible && a.centerAndZoom();
      });
    },
    this.setCenter = function(a, b) {
      var c = this;
      this.childs.forEach(function(d) {
        var e = a - c.canvas.width / 2,
          f = b - c.canvas.height / 2;
        d.translateX = -e,
          d.translateY = -f;
      });
    },
    this.getBound = function() {
      var a = {
        left: Number.MAX_VALUE,
        right: Number.MIN_VALUE,
        top: Number.MAX_VALUE,
        bottom: Number.MIN_VALUE
      };
      return this.childs.forEach(function(b) {
        var c = b.getElementsBound();
        c.left < a.left && (a.left = c.left, a.leftNode = c.leftNode),
          c.top < a.top && (a.top = c.top, a.topNode = c.topNode),
          c.right > a.right && (a.right = c.right, a.rightNode = c.rightNode),
          c.bottom > a.bottom && (a.bottom = c.bottom, a.bottomNode = c.bottomNode);
      }),
        a.width = a.right - a.left,
        a.height = a.bottom - a.top,
        a;
    },
    this.toJson = function() {
      {
        var b = this,
          c = '{"version":"' + Tobj.version + '",';
        this.serializedProperties.length;
      }
      return this.serializedProperties.forEach(function(a) {
        var d = b[a];
        'string' == typeof d && (d = '"' + d + '"'),
          c += '"' + a + '":' + d + ',';
      }),
        c += '"childs":[',
        this.childs.forEach(function(a) {
          c += a.toJson();
        }),
        c += ']',
        c += '}';
    },
    function() {
      0 == n.frames ? setTimeout(arguments.callee, 100) : n.frames < 0 ? (n.repaint(), setTimeout(arguments.callee, 1e3 / -n.frames)) : (n.repaint(), setTimeout(arguments.callee, 1e3 / n.frames));
    } (),
    setTimeout(function() {
      n.mousewheel(function(a) {
        var b = null == a.wheelDelta ? a.detail : a.wheelDelta;
        null != this.wheelZoom && (b > 0 ? this.zoomIn(this.wheelZoom) : this.zoomOut(this.wheelZoom));
      }),
        n.paint();
    },
      300),
    setTimeout(function() {
      n.paint();
    },
      1e3),
    setTimeout(function() {
      n.paint();
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
  set cursor(a) {
    this.canvas.style.cursor = a;
  },
  get cursor() {
    return this.canvas.style.cursor;
  },
  set mode(a) {
    this.childs.forEach(function(b) {
      b.mode = a;
    });
  }
};

module.exports = Stage;
