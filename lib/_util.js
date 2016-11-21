/**
 * util
 * @author ilex
 */

var canvas = document.createElement('canvas'),
  graphics = canvas.getContext('2d'),
  alarmImageCache = {};

var isFirefox = navigator.userAgent.indexOf('Firefox') > 0;
var isIE = !(!window.attachEvent || -1 !== navigator.userAgent.indexOf('Opera'));
var isChrome = null != navigator.userAgent.toLowerCase().match(/chrome/);

function MessageBus(name) {
  var _self = this;
  this.name = name,
    this.messageMap = {},
    this.messageCount = 0,
    this.subscribe = function(topic, action) {
      var actions = _self.messageMap[topic];
      null == actions && (_self.messageMap[topic] = []),
        _self.messageMap[topic].push(action),
        _self.messageCount++;
    },
    this.unsubscribe = function(topic) {
      var actions = _self.messageMap[topic];
      if (actions && null != actions) {
        _self.messageMap[topic] = null;
        delete _self.messageMap[topic];
        _self.messageCount--;
      }
    },
    this.publish = function(topic, data, concurrency) {
      var actions = _self.messageMap[topic];
      if (null != actions) {
        for (var f = 0; f < actions.length; f++) {
          concurrency ? ! function(action, bdata) {
            setTimeout(function() {
              action(bdata);
            },
              10);
          } (actions[f], data) : actions[f](data);
        }
      }
    };
}

function getDistance(a, b, c, d) {
  var e, f;
  return null == c && null == d ? (e = b.x - a.x, f = b.y - a.y) : (e = c - a, f = d - b),
    Math.sqrt(e * e + f * f);
}

function mouseCoords(a) {
  return a = cloneEvent(a),
    a.pageX || (a.pageX = a.clientX + document.body.scrollLeft - document.body.clientLeft, a.pageY = a.clientY + document.body.scrollTop - document.body.clientTop),
    a;
}

function getEventPosition(a) {
  return a = mouseCoords(a);
}

function rotatePoint(a, b, c, d, e) {
  var f = c - a,
    g = d - b,
    h = Math.sqrt(f * f + g * g),
    i = Math.atan2(g, f) + e;
  return {
    x: a + Math.cos(i) * h,
    y: b + Math.sin(i) * h
  };
}

function rotatePoints(a, b, c) {
  for (var d = [], e = 0; e < b.length; e++) {
    var f = rotatePoint(a.x, a.y, b[e].x, b[e].y, c);
    d.push(f);
  }
  return d;
}

function _foreach(datas, f, dur) {
  if (datas.length == 0) {
    return;
  }
  var n = 0;

  function doIt(n) {
    if (n == datas.length) {
      return;
    }
    f(datas[n]);
    setTimeout(function() {
      doIt(++n);
    }, dur);
  }
  doIt(n);
}

function _for(i, m, f, dur) {
  if (m < i) {
    return;
  }
  var n = 0;

  function doIt(n) {
    if (n == m) {
      return;
    }
    f(m);
    setTimeout(function() {
      doIt(++n);
    }, dur);
  }
  doIt(n);
}

function cloneEvent(a) {
  var b = {};
  for (var c in a) {
    'returnValue' != c && 'keyLocation' != c && (b[c] = a[c]);
  }
  return b;
}

function clone(a) {
  var b = {};
  for (var c in a) {
    b[c] = a[c];
  }
  return b;
}

function isPointInRect(a, b) {
  var c = b.x,
    d = b.y,
    e = b.width,
    f = b.height;
  return a.x > c && a.x < c + e && a.y > d && a.y < d + f;
}

function isPointInLine(a, b, c) {
  var d = getDistance(b, c),
    e = getDistance(b, a),
    f = getDistance(c, a),
    g = Math.abs(e + f - d) <= .5;
  return g;
}

function removeFromArray(a, b) {
  for (var c = 0; c < a.length; c++) {
    var d = a[c];
    if (d === b) {
      a = a.del(c);
      break;
    }
  }
  return a;
}

function randomColor() {
  return Math.floor(255 * Math.random()) + ',' + Math.floor(255 * Math.random()) + ',' + Math.floor(255 * Math.random());
}

function isIntsect() { }

function getProperties(a, b) {
  for (var c = '',
    d = 0; d < b.length; d++) {
    d > 0 && (c += ',');
    var e = a[b[d]];
    'string' == typeof e ? e = '"' + e + '"' : void 0 == e && (e = null),
      c += b[d] + ':' + e;
  }
  return c;
}

function toJson(a) {
  var b = 'backgroundColor,visible,mode,rotate,alpha,scaleX,scaleY,shadow,translateX,translateY,areaSelect,paintAll'.split(','),
    c = 'text,elementType,x,y,width,height,visible,alpha,rotate,scaleX,scaleY,fillColor,shadow,transformAble,zIndex,dragable,selected,showSelected,font,fontColor,textPosition,textOffsetX,textOffsetY'.split(','),
    d = '{';
  d += 'frames:' + a.frames,
    d += ', scenes:[';
  for (var e = 0; e < a.childs.length; e++) {
    var f = a.childs[e];
    d += '{',
      d += getProperties(f, b),
      d += ', elements:[';
    for (var g = 0; g < f.childs.length; g++) {
      var h = f.childs[g];
      g > 0 && (d += ','),
        d += '{',
        d += getProperties(h, c),
        d += '}';
    }
    d += ']}';
  }
  return d += ']',
    d += '}';
}

function changeColor(a, b, c, d, e) {
  var f = canvas.width = b.width,
    g = canvas.height = b.height;
  a.clearRect(0, 0, canvas.width, canvas.height),
    a.drawImage(b, 0, 0);
  for (var h = a.getImageData(0, 0, b.width, b.height), i = h.data, j = 0; f > j; j++) {
    for (var k = 0; g > k; k++) {
      var l = 4 * (j + k * f);
      0 != i[l + 3] && (null != c && (i[l + 0] += c), null != d && (i[l + 1] += d), null != e && (i[l + 2] += e));
    }
  }
  a.putImageData(h, 0, 0, 0, 0, b.width, b.height);
  var m = canvas.toDataURL();
  return alarmImageCache[b.src] = m, m;
}

function genImageAlarm(a, b) {
  null == b && (b = 255);
  try {
    if (alarmImageCache[a.src]) {
      return alarmImageCache[a.src];
    }
    var c = new Image;
    return c.src = changeColor(graphics, a, b),
      alarmImageCache[a.src] = c,
      c;
  } catch (d) {
    console.log(d);
  }
  return null;
}

function getOffsetPosition(a) {
  if (!a) {
    return {
      left: 0,
      top: 0
    };
  }
  var b = 0, c = 0;
  if ('getBoundingClientRect' in document.documentElement) {
    var d = a.getBoundingClientRect(),
      e = a.ownerDocument,
      f = e.body,
      g = e.documentElement,
      h = g.clientTop || f.clientTop || 0,
      i = g.clientLeft || f.clientLeft || 0;
    b = d.top + (self.pageYOffset || g && g.scrollTop || f.scrollTop) - h,
      c = d.left + (self.pageXOffset || g && g.scrollLeft || f.scrollLeft) - i;
  } else {
    do {
      b += a.offsetTop || 0,
        c += a.offsetLeft || 0,
        a = a.offsetParent;
    }
    while (a);
  }
  return {
    left: c,
    top: b
  };
}

function lineF(a, b, c, d) {
  function e(a) {
    return a * f + g;
  }
  var f = (d - b) / (c - a),
    g = b - a * f;
  return e.k = f,
    e.b = g,
    e.x1 = a,
    e.x2 = c,
    e.y1 = b,
    e.y2 = d,
    e;
}

function inRange(a, b, c) {
  var d = Math.abs(b - c),
    e = Math.abs(b - a),
    f = Math.abs(c - a),
    g = Math.abs(d - (e + f));
  return 1e-6 > g ? !0 : !1;
}

function isPointInLineSeg(a, b, c) {
  return inRange(a, c.x1, c.x2) && inRange(b, c.y1, c.y2);
}

function intersection(a, b) {
  var c, d;
  return a.k == b.k ? null : (1 / 0 == a.k || a.k == -1 / 0 ? (c = a.x1, d = b(a.x1)) : 1 / 0 == b.k || b.k == -1 / 0 ?
  (c = b.x1, d = a(b.x1)) : (c = (b.b - a.b) / (a.k - b.k), d = a(c)), 0 == isPointInLineSeg(c, d, a) ? null : 0 == isPointInLineSeg(c, d, b) ? null : {
    x: c,
    y: d
  });
}

function intersectionLineBound(a, b) {
  var c = lineF(b.left, b.top, b.left, b.bottom),
    d = intersection(a, c);
  return null == d && (c = lineF(b.left, b.top, b.right, b.top), d = intersection(a, c), null == d && (c = lineF(b.right, b.top, b.right, b.bottom), d = intersection(a, c), null == d && (c = lineF(b.left, b.bottom, b.right, b.bottom), d = intersection(a, c)))),
    d;
}

requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame ||
  function(a) {
    setTimeout(a, 1e3 / 24);
  };
Array.prototype.del = function(n) {
  if (typeof n != 'number') {
    for (var i = 0; i < this.length; i++) {
      if (this[i] === n) {
        return this.slice(0, i).concat(this.slice(i + 1, this.length));
      }
    }
    return this;
  } else {
    if (n < 0) {
      return this;
    }
    return this.slice(0, n).concat(this.slice(n + 1, this.length));
  }
};

if (![].indexOf) { //IE
  Array.prototype.indexOf = function(data) {
    for (var i = 0; i < this.length; i++) {
      if (this[i] === data) {
        return i;
      }
    }
    return -1;
  };
}

if (!window.console) { //IE
  window.console = {
    log: function(msg) { },
    info: function(msg) { },
    debug: function(msg) { },
    warn: function(msg) { },
    error: function(msg) { }
  };
}

module.exports = {
  MessageBus: MessageBus,
  rotatePoint: rotatePoint,
  rotatePoints: rotatePoints,
  getDistance: getDistance,
  getEventPosition: getEventPosition,
  mouseCoords: mouseCoords,
  isFirefox: isFirefox,
  isIE: isIE,
  isChrome: isChrome,
  clone: clone,
  isPointInRect: isPointInRect,
  isPointInLine: isPointInLine,
  removeFromArray: removeFromArray,
  cloneEvent: cloneEvent,
  randomColor: randomColor,
  isIntsect: isIntsect,
  toJson: toJson,
  genImageAlarm: genImageAlarm,
  getOffsetPosition: getOffsetPosition,
  lineF: lineF,
  intersection: intersection,
  intersectionLineBound: intersectionLineBound,
  _foreach: _foreach,
  _for: _for
};
