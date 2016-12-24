
const UserAgent = require('./_userAgent');
const popup = require('./_popup');
const math = require('./_math');
const html = require('./_html');
const arrow = require('./_arrow');
const _third = require('./_third');

/**
 * third Util
 */
const thirdUtil = {
  getVersion: function() {
    return '3.0.1';
  },
  registerImage: function(a, b, c, e, f) {
    _third.registerImage(a, b, c, e, f);
  },
  getRegisteredImageNames: function() {
    return _third.getRegisteredImageNames();
  },
  unregisterImage: function(a) {
    _third.unregisterImage(a);
  },
  getImageAsset: function(a) {
    return _third.getImageAsset(a);
  },
  validateLicense: function(a) {
    _third.validateLicense(a);
  },
  isTypeOf: function(a, b) {
    if (a === b){ return !0;}
    let c = a.superClass;
    while (c) {
      if (c === b.prototype){ return !0;}
      c = c.constructor.superClass;
    }
    return !1;
  },
  setFocus: function(a) {
    if (document.activeElement === a) {return;}
    let b, c, d = document.documentElement,
      e = document.body,
      f;
    d && (UserAgent.isIE || UserAgent.isOpera || d.scrollLeft || d.scrollTop) ? (b = d.scrollLeft, c = d.scrollTop, f = d) : e && (b = e.scrollLeft, c = e.scrollTop, f = e),
      a.focus(),
      f && (f.scrollLeft = b, f.scrollTop = c);
  },
  isOpera: UserAgent.isOpera,
  isIE: UserAgent.isIE,
  isFirefox: UserAgent.isFirefox,
  isChrome: UserAgent.isChrome,
  isSafari: UserAgent.isSafari,
  isIPhone: UserAgent.isIPhone,
  isIPod: UserAgent.isIPod,
  isIPad: UserAgent.isIPad,
  isAndroid: UserAgent.isAndroid,
  isWebOS: UserAgent.isWebOS,
  isTouchable: UserAgent.isTouchable,
  ext: function(a, b, c) {
    _third.ext(a, b, c);
  },
  getValue: function(a, b, c) {
    return _third.getValue(a, b, c);
  },
  setValue: function(a, b, c) {
    _third.setValue(a, b, c);
  },
  grow: function(a, b, c) {
    math.grow(a, b, c);
  },
  containsPoint: function(a, b, c) {
    return math.containsPoint.apply(null, arguments);
  },
  intersects: function(a, b) {
    return math.intersects(a, b);
  },
  getRect: function(a) {
    return math.getRect(a);
  },
  unionRect: function(a, b) {
    return math.unionRect(a, b);
  },
  createDiv: function() {
    return html.createDiv();
  },
  createCanvas: function() {
    return html.createCanvas();
  },
  setCanvas: function(a, b, c, d, e) {
    return html.setCanvas.apply(null, arguments);
  },
  getClass: function(a) {
    return _third.getClass(a);
  },
  getAllClassNames: function() {
    let a = [],
      b;
    for (b in _third.classCache) {a.push(b);}
    return a;
  },
  newInstance: function(a) {
    return _third.newInstance.apply(null, arguments);
  },
  isDeserializing: function() {
    return _third.isDeserializing;
  },
  addEventListener: function(a, b, c, d) {
    html.addEventListener(a, b, c, d);
  },
  removeEventListener: function(a, b, c) {
    html.removeEventListener(a, b, c);
  },
  drawArrow: function(a, b, c, d, e, f, g, h, i, j, k, l) {
    arrow.drawArrow.apply(null, arguments);
  },
  transformPoint: function(a, b, c, d) {
    return math.transformPoint(a, b, c, d);
  },
  getToolTipDiv: function() {
    return popup.getToolTipDiv();
  },
  showToolTip: function(a, b) {
    popup.showToolTip(a, b);
  },
  hideToolTip: function() {
    popup.hideToolTip();
  },
  resetToolTip: function() {
    popup.resetToolTip();
  },
  setCSSStyle: function(a, b, c) {
    html.setCSSStyle(a, b, c);
  },
  removeCSSStyle: function(a, b) {
    html.removeCSSStyle(a, b);
  },
  getCSSStyle: function(a, b) {
    return html.getCSSStyle(a, b);
  },
  toDegrees: function(a) {
    return math.toDegrees(a);
  },
  toRadians: function(a) {
    return math.toDegrees(a);
  },
  getRadiansBetweenLines: function(a, b) {
    return math.getRadiansBetweenLines(a, b);
  },
  getElementsBounds: function(a, b) {
    let d = null;
    return a.forEach(function(a) {
      if (a.getRect) {
        let e, f;
        b && (f = b.getElementUI(a), f && (e = f.getViewRect())),
            e || (e = a.getRect()),
            d ? d = thirdUtil.unionRect(d, e) : d = e;
      }
    }),
      d;
  },
  getPointIndex: function(a, b, c) {
    c || (c = 10);
    if (a)
      {for (let d = a.size(); d--; d >= 0)
        {if (math.getDistance(a.get(d), b) <= c) {return d;}}}
    return -1;
  },
  registerVectorShape: function(a, b) {
    _third.g['_' + a] = b;
  },
  rotateCanvas: function(a, b, c) {
    a.translate(b.x + b.width / 2, b.y + b.height / 2),
      a.rotate(c * Math.PI / 180),
      a.translate(-(b.x + b.width / 2), -(b.y + b.height / 2));
  }
};

module.exports = thirdUtil;
