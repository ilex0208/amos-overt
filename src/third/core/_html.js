const _cons = require('./../constants');
const Bd = _cons.Bd;
const UserAgent = require('./_userAgent');
const _touch = require('./_touch');

/**
 * HTML 操作工具类
 * 提供创建div img
 */
let _html = {
  preventDefault: function(ev) {
    if (Bd.KEEP_DEFAULT_FUNCTION(ev)) {return;}
    ev.preventDefault ? ev.preventDefault() : ev.preventManipulation ? ev.preventManipulation() : ev.returnValue = false;
  },
  insertAfter: function(a, b) {
    return b ? b.parentNode.insertBefore(a, b.nextSibling) : a.parentNode.insertBefore(a, a.parentNode.firstChild),
            a;
  },
  forEach: function(a, b, c) {
    if (!_html.isVisible(a)) {
      return;
    }
    let d = a.childNodes.length;
    for (let e = 0; e < d; e++) {
      _html.forEach(a.childNodes[e], b, c);
    }
    c ? b.call(c, a) : b(a);
  },
  setVisible: function(a, b) {
    a.style.display = b ? 'block' : 'none';
  },
  isVisible: function(a) {
    return 'style' in a && a.style.display !== 'none';
  },
  release: function(a) {
    let b = a.childNodes.length;
    for (let c = 0; c < b; c++) {
      _html.release(a.childNodes[c]);
    }
    b > 0 && _html.clear(a),
            a._pool && a._pool.release(a);
  },
  clear: function(a) {
    while (a.firstChild) {
      a.removeChild(a.firstChild);
    }
  },
  setZoom: function(a, b) {
    let c = a.style;
    if (c.setProperty) {
      if (UserAgent.isFirefox) {
        c.setProperty('-moz-transform', 'scale(' + b + ')', null),
                    c.setProperty('-moz-transform-origin', '0 0', null);
      } else if (UserAgent.isOpera) {
        c.setProperty('-o-transform', 'scale(' + b + ')', null),
                    c.setProperty('-o-transform-origin', '0 0', null);
      }
    } else if (UserAgent.isChrome || UserAgent.isSafari) {
      c.setProperty('-webkit-transform', 'scale(' + b + ')', null),
                c.setProperty('-webkit-transform-origin', '0 0', null);
      let d = null;
      a._webkitInvaildateDiv ? d = a._webkitInvaildateDiv : (d = document.createElement('div'), a._webkitInvaildateDiv = d), !d.parentNode || d.parentNode != a ? a.appendChild(d) : a.removeChild(d);
    } else {
      UserAgent.isIE ? (c.setProperty('-ms-transform', 'scale(' + b + ')', null), c.setProperty('-ms-transform-origin', '0 0', null)) : (c.setProperty('transform', 'scale(' + b + ')', null), c.setProperty('transform-origin', '0 0', null));
    }
  },
  setCSSStyle: function(a, b, c) {
    a.style.setProperty(b, c, null);
  },
  removeCSSStyle: function(a, b) {
    a.style.removeProperty(b);
  },
  getCSSStyle: function(a, b) {
    return a.style.getPropertyValue(b);
  },
  setBorderRaidus: function(a, b) {
    UserAgent.isFirefox ? a.style.MozBorderRadius = b : a.style.borderRadius = b;
  },
  createSelect: function(a, b) {
    let c = document.createElement('select'),
      d,
      e,
      f;
    if (Array.isArray(a)) {
      for (d = 0; d < a.length; d++) {
        e = a[d],
                    f = document.createElement('option'),
                    f.innerHTML = e,
                    f.setAttribute('value', e),
                    e === b && f.setAttribute('selected', 'true'),
                    c.appendChild(f);
      }
    } else {
      for (d = 0; d < a.values.length; d++) {
        e = a.values[d],
                    f = document.createElement('option'),
                    f.innerHTML = a.map[e],
                    f.setAttribute('value', e),
                    e === b && f.setAttribute('selected', 'true'),
                    c.appendChild(f);
      }
    }
    return c;
  },
  ccreateImg: function(imgSrc) {
    var b = document.createElement('img');
    return b.style.position = 'absolute',
      typeof imgSrc == 'string' && b.setAttribute('src', imgSrc),
      b;
  },
  createView: function(overflow, b) {
    var _div = document.createElement('div');
    return _div.style.position = Bd.VIEW_POSITION,
      _div.style.fontSize = Bd.VIEW_FONT_SIZE,
      _div.style.fontFamily = Bd.VIEW_FONT_FAMILY,
      _div.style.cursor = 'default',
      _div.style.outline = 'none',
      _div.style.textAlign = 'left',
      _div.style.msTouchAction = 'none',
      _div.tabIndex = 0,
      b || (_div.onmousedown = _html.preventDefault),
      _div.style.setProperty && (_div.style.setProperty('-khtml-user-select', 'none', null), _div.style.setProperty('-webkit-user-select', 'none', null), _div.style.setProperty('-moz-user-select', 'none', null), _div.style.setProperty('-webkit-tap-highlight-color', 'rgba(0, 0, 0, 0)', null)),
      overflow && (_div.style.overflow = overflow),
      _div;
  },
  createDiv: function() {
    let a = document.createElement('div');
    return a.style.position = 'absolute',
            a.style.msTouchAction = 'none',
            a;
  },
  createSpan: function() {
    var a = document.createElement('span');
    return a;
  },
  createCanvas: function(width, height) {
    width || (width = 0),
      height || (height = 0);
    let can = document.createElement('canvas');
    // return can.style.position = 'absolute',
    return can.style.msTouchAction = 'none',
      can.width = width,
      can.height = height,
      can;
  },
  setCanvas: function(a, b, c, d, e) {
    arguments.length === 2 && (c = b.y, d = b.width, e = b.height, b = b.x),
            a.style.left = b + 'px',
            a.style.top = c + 'px',
            a.setAttribute('width', d),
            a.setAttribute('height', e),
            a._viewRect = {
              x: b,
              y: c,
              width: d,
              height: e
            };
    let f = a.getContext('2d');
    return f.shadowBlur !== 0 && (f.shadowOffsetX = 0, f.shadowOffsetY = 0, f.shadowBlur = 0, f.shadowColor = 'rgba(0,0,0,0.0)'),
            f.clearRect(0, 0, d, e),
            f.translate(-b, -c),
            f;
  },
  clone: function(a) {
    if (!a) {
      return null;
    }
    let b = {};
    for (let c in a) {
      b[c] = a[c];
    }
    return b;
  },
  num: function(a) {
    return typeof a == 'number' && !isNaN(a) && isFinite(a);
  },
  setImg: function(a, b, c) {
    a.setAttribute('src', b),
            a.style.left = c.x + 'px',
            a.style.top = c.y + 'px',
            a.style.width = c.width + 'px',
            a.style.height = c.height + 'px',
            a._viewRect = _html.clone(c);
  },
  setDiv: function(a, b, c, e, f) {
    e = _html.num(e) ? e : 0,
            a.style.left = b.x - e + 'px',
            a.style.top = b.y - e + 'px',
            a.style.width = b.width + 'px',
            a.style.height = b.height + 'px',
            a._viewRect = _html.clone(b),
            c ? a.style.backgroundColor = c : a.style.backgroundColor = '',
            e > 0 ? a.style.border = e + 'px ' + f + ' solid' : a.style.border = '';
  },
  addEventListener: function(a, b, c, d) {
    let e = '_' + a + '_';
    if (d[e]) {
      return;
    }
    let f = function(a) {
      f.instance[f.method](a);
    };
    f.method = b,
            f.instance = d,
            d[e] = f,
            c.addEventListener(a, f, !1);
  },
  removeEventListener: function(a, b, c) {
    let d = '_' + a + '_',
      e = c[d];
    e && (b.removeEventListener(a, e, !1), delete c[d]);
  },
  isValidEvent: function(a, b) {
    if (!b) {
      return !1;
    }
    if (b.target === a) {
      if (UserAgent.isFirefox) {
        if (a.clientHeight < a.scrollHeight && b.layerX < 25) {
          return !1;
        }
        if (a.clientWidth < a.scrollWidth && b.layerY < 25) {
          return !1;
        }
      } else if (b.offsetX > a.clientWidth || b.offsetY > a.clientHeight) {
        return !1;
      }
    }
    return !0;
  },
  getLogicalPoint: function(a, b, c, d) {
    c = c ? c : 1;
    let e, f = a.getBoundingClientRect();
    if (UserAgent.isTouchable && b.changedTouches && b.changedTouches.length > 0) {
      let g = b.changedTouches[0],
        h = UserAgent.isAndroid ? 0 : _touch.scrollLeft(),
        j = UserAgent.isAndroid ? 0 : _touch.scrollTop();
      e = {
        x: (g.clientX + a.scrollLeft - f.left - h) / c,
        y: (g.clientY + a.scrollTop - f.top - j) / c
      };
    } else {
      if (!_html.isValidEvent(a, b)) {
        return null;
      }
      e = {
        x: (b.clientX - f.left + a.scrollLeft) / c,
        y: (b.clientY - f.top + a.scrollTop) / c
      };
    }
    return e;
  },
  handle_mousedown: function(b, c) {
    _html.target && _html.handle_mouseup(c),
            window.addEventListener('mousemove', _html.handle_mousemove, !1),
            window.addEventListener('mouseup', _html.handle_mouseup, !1),
            _html.target = b;
  },
  handle_mousemove: function(a) {
    _html.target.handle_mousemove && _html.target.handle_mousemove(a),
            _html.target.handleMouseMove && _html.target.handleMouseMove(a);
  },
  handle_mouseup: function(b) {
    _html.target.handle_mouseup && _html.target.handle_mouseup(b),
            _html.target.handleMouseUp && _html.target.handleMouseUp(b),
            window.removeEventListener('mousemove', _html.handle_mousemove, !1),
            window.removeEventListener('mouseup', _html.handle_mouseup, !1),
            delete _html.target;
  },
  getClientPoint: function(a) {
    return {
      x: a.clientX,
      y: a.clientY
    };
  },
  windowWidth: function() {
    return typeof window.innerWidth == 'number' ? window.innerWidth : document.documentElement && document.documentElement.clientWidth ? document.documentElement.clientWidth : document.body && document.body.clientWidth ? document.body.clientWidth : 0;
  },
  windowHeight: function() {
    return typeof window.innerHeight == 'number' ? window.innerHeight : document.documentElement && document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body && document.body.clientHeight ? document.body.clientHeight : 0;
  }
};

const html = _html;
module.exports = html;
