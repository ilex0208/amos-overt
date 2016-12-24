const _tool = require('./../common/_tool');
const List = require('./_list');
const Position = require('./_position');

var math = {
  getDistance: function(a, b) {
    var c = b.x - a.x,
      d = b.y - a.y;
    return Math.sqrt(c * c + d * d);
  },
  getCenterPoint: function(a, b) {
    return {
      x: (a.x + b.x) / 2,
      y: (a.y + b.y) / 2
    };
  },
  isPointInPolygon: function(a, b) {
    a = a._as;
    var c = 0,
      d = 0,
      e = !1,
      f = a.length;
    for (c = 0, d = f - 1; c < f; d = c++) {
      var g = a[c],
        h = a[d];
      g.y > b.y != h.y > b.y && b.x < (h.x - g.x) * (b.y - g.y) / (h.y - g.y) + g.x && (e = !e);
    }
    return e;
  },
  unionRect: function(a, b) {
    if (a && !b) {return _tool.clone(a);}
    if (!a && b) {return _tool.clone(b);}
    if (a && b) {
      var c = {};
      return c.x = Math.min(a.x, b.x),
        c.y = Math.min(a.y, b.y),
        c.width = Math.max(a.x + a.width, b.x + b.width) - c.x,
        c.height = Math.max(a.y + a.height, b.y + b.height) - c.y,
        c;
    }
    return null;
  },
  intersects: function(a, b) {
    if (!a || !b) {return !1;}
    var c = b.width,
      d = b.height,
      e = a.width,
      f = a.height;
    if (e <= 0 || f <= 0 || c <= 0 || d <= 0){ return !1;}
    var g = b.x,
      h = b.y,
      i = a.x,
      j = a.y;
    return e += i,
      f += j,
      c += g,
      d += h,
      (e < i || e > g) && (f < j || f > h) && (c < g || c > i) && (d < h || d > j);
  },
  intersection: function(a, b) {
    if (!a || !b) {return !1;}
    var c = b.x,
      d = b.y,
      e = a.x,
      f = a.y,
      g = c;
    g += b.width;
    var h = d;
    h += b.height;
    var i = e;
    i += a.width;
    var j = f;
    return j += a.height,
      c < e && (c = e),
      d < f && (d = f),
      g > i && (g = i),
      h > j && (h = j),
      g -= c,
      h -= d,
      g === 0 || h === 0 ? null : {
        x: c,
        y: d,
        width: g,
        height: h
      };
  },
  contains: function(a, b) {
    var c = b.x,
      d = b.y,
      e = b.width,
      f = b.height,
      g = a.width,
      h = a.height;
    if ((g | h | e | f) < 0) {return !1;}
    var i = a.x,
      j = a.y;
    if (c < i || d < j) {return !1;}
    g += i,
      e += c;
    if (e <= c) {
      if (g >= i || e > g) {return !1;}
    } else if (g >= i && e > g) {return !1;}
    h += j,
      f += d;
    if (f <= d) {
      if (h >= j || f > h) {return !1;}
    } else if (h >= j && f > h) {return !1;}
    return !0;
  },
  getLinePoints: function(a) {
    if (!a) {return null;}
    var b = new List;
    return a.forEach(function(a) {
      b.addAll(a);
    }),
      b;
  },
  getLineRect: function(a) {
    var b = math.getLinePoints(a);
    return math.getRect(b);
  },
  getRect: function(a, b) {
    if (!a) {return null;}
    a._as && (a = a._as);
    var c = a.length;
    if (c <= 0) {return null;}
    var d = a[0];
    b = b || {
      x: d.x,
      y: d.y,
      width: 0,
      height: 0
    };
    for (var e = 1; e < c; e++) {
      d = a[e];
      if (d instanceof List){ math.getRect(d, b);}
      else {
        var f = Math.min(b.x, d.x),
          g = Math.max(b.x + b.width, d.x),
          h = Math.min(b.y, d.y),
          i = Math.max(b.y + b.height, d.y);
        b.x = f,
          b.y = h,
          b.width = g - f,
          b.height = i - h;
      }
    }
    return b;
  },
  addPadding: function(a, b, c, d) {
    arguments.length === 3 && (d = -1);
    var e = b.getStyle(c) * d;
    e != 0 && math.grow(a, e, e),
      e = b.getStyle(c + '.left') * d,
      e != 0 && (a.x -= e, a.width += e),
      e = b.getStyle(c + '.right') * d,
      e != 0 && (a.width += e),
      e = b.getStyle(c + '.top') * d,
      e != 0 && (a.y -= e, a.height += e),
      e = b.getStyle(c + '.bottom') * d,
      e != 0 && (a.height += e),
      a.width < 0 && (a.width = -a.width, a.x -= a.width),
      a.height < 0 && (a.height = -a.height, a.y -= a.height);
  },
  grow: function(a, b, c) {
    var d = a.width + b + b;
    if (d < 0) {return;}
    var e = a.height + c + c;
    if (e < 0) {return;}
    a.x -= b,
      a.y -= c,
      a.width = d,
      a.height = e;
  },
  containsPoint: function(a, b, c) {
    return arguments.length < 3 && (c = b.y, b = b.x),
      !a || b < a.x || c < a.y || b > a.x + a.width || c > a.y + a.height ? !1 : !0;
  },
  getHotSpot: function(a, b, c, d, e) {
    if (e === 'oval') {
      var f = .35;
      return {
        x: a + c * .5 + c * f,
        y: b + d / 2 - Math.sqrt(.25 - f * f) * d
      };
    }
    if (e === 'circle') {
      var g = a + c / 2,
        h = b + d / 2,
        i = Math.min(c, d) / 2;
      a = g - i,
        b = h - i,
        c = i * 2,
        d = i * 2;
      var j = c / 2,
        k = d / 2,
        l = j * k / Math.sqrt(j * j + k * k);
      return {
        x: a + c / 2 + l,
        y: b + d / 2 - l
      };
    }
    var m = {
      x: a + c,
      y: b
    };
    return c > 3 && (m.x -= 3),
      d > 3 && (m.y += 3),
      m;
  },
  getCircleRect: function(a) {
    var b = Math.min(a.width, a.height) / 2;
    return {
      x: a.x + a.width / 2 - b,
      y: a.y + a.height / 2 - b,
      width: b * 2,
      height: b * 2
    };
  },
  getEllipsePoint: function(a, b) {
    if (!a || !b) {return null;}
    var c = a.x + a.width / 2,
      d = a.y + a.height / 2,
      e = b.x - c,
      f = b.y - d,
      g = a.width / 2,
      h = a.height / 2,
      i = Math.sqrt(1 / (1 / g / g + f * f / e / e / h / h));
    e < 0 && (i = -i);
    var j;
    return e == 0 ? f > 0 ? j = h : j = -h : j = i * f / e,
    {
      x: c + i,
      y: d + j
    };
  },
  createMatrix: function(a, b, c) {
    var d = Math.sin(a),
      e = Math.cos(a),
      f = b * (1 - e) + c * d,
      g = c * (1 - e) - b * d;
    return new Position(e, d, -d, e, f, g);
  },
  reversePath: function(a) {
    var b = new List,
      c = null,
      d;
    a._as && (a = a._as);
    for (var e = a.length - 1; e >= 0; e--) {d = a[e],
      b.add(math._getReversePath(d, c)),
      c = d;}
    return b;
  },
  _getPoint: function(a) {
    return a._as && (a = a._as),
      a instanceof Array ? a[a.length - 1] : a;
  },
  _getControlPoint: function(a) {
    return a._as && (a = a._as),
      a instanceof Array ? a[a.length - 2] : a;
  },
  _getReversePath: function(a, b) {
    var c = math._getPoint(a);
    return b && b._as && (b = b._as),
      b != null && b instanceof Array ? b.length == 2 ? new List([b[0], c]) : new List([b[1], b[0], c]) : c;
  },
  _getLength: function(a, b) {
    var c = math._getPoint(b),
      d = math._getPoint(a);
    a instanceof List && (a = a._as);
    if (a instanceof Array) {return math.calculateCurveLength(c, a, 1);}
    var e = d.y - c.y,
      f = d.x - c.x;
    return Math.sqrt(f * f + e * e);
  },
  getPathInfo: function(a, b, c, d, e) {
    var f = math._getPoint(b),
      g = math._getPoint(a),
      h;
    a instanceof List && (a = a._as);
    if (a instanceof Array) {
      e < 0 && (e = math._getLength(a, b));
      var i = c / e,
        j = math.calculatePointInfoOnCurveLine(f, a, i);
      f = j.point,
        h = j.angle,
        c = 0;
    } else {h = Math.atan2(g.y - f.y, g.x - f.x);}
    return math.transformPoint(f, h, c, d);
  },
  transformPoint: function(a, b, c, d) {
    var e = {
        x: c,
        y: d
      },
      f = math.createMatrix(b, 0, 0);
    return e = f.transform(e),
      e.x += a.x,
      e.y += a.y,
    {
      point: e,
      angle: b
    };
  },
  calculatePointInfoOnStraightLine: function(a, b, c, d) {
    var e = Math.atan2(b.y - a.y, b.x - a.x);
    return math.transformPoint(a, e, c, d);
  },
  calculatePointInfoOnCurveLine: function(a, b, c) {
    if (c < 0 || c > 1) {throw 'Illegal arguments';}
    return b._as && (b = b._as),
      b.length == 2 ? math._calculatePointInfoOnCurveLine2(a, b[0], b[1], c) : math._calculatePointInfoOnCurveLine3(a, b[0], b[1], b[2], c);
  },
  _calculatePointInfoOnCurveLine2: function(a, b, c, d) {
    var e = 2 * (a.x + c.x - 2 * b.x) * d + 2 * b.x - 2 * a.x,
      f = 2 * (a.y + c.y - 2 * b.y) * d + 2 * b.y - 2 * a.y,
      g = Math.atan2(f, e),
      h = (a.x + c.x - 2 * b.x) * d * d + (2 * b.x - 2 * a.x) * d + a.x,
      i = (a.y + c.y - 2 * b.y) * d * d + (2 * b.y - 2 * a.y) * d + a.y;
    return {
      point: {
        x: h,
        y: i
      },
      angle: g
    };
  },
  _calculatePointInfoOnCurveLine3: function(a, b, c, d, e) {
    var f, g, h;
    f = 1 - e,
      g = f * f * f,
      h = e * e * e;
    var i = g * a.x + 3 * e * f * f * b.x + 3 * e * e * f * c.x + h * d.x,
      j = g * a.y + 3 * e * f * f * b.y + 3 * e * e * f * c.y + h * d.y;
    return {
      point: {
        x: i,
        y: j
      },
      angle: Math.atan2(math._bezeSpeedY(a, b, c, d, e), math._bezeSpeedX(a, b, c, d, e))
    };
  },
  calculateCurveLength: function(a, b, c) {
    return b._as && (b = b._as),
      b.length == 2 ? math._calculateCurveLength(a, b[0], b[1], c) : math._calculateBezierCurveLength(a, b[0], b[1], b[2], c);
  },
  _calculateCurveLength: function(a, b, c, d) {
    if (d <= 0 || d > 1) {return 0;}
    var e = Math.floor(d * (Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y)) + Math.sqrt((c.x - b.x) * (c.x - b.x) + (c.y - b.y) * (c.y - b.y))) / 2),
      f = 0;
    e <= 0 && (e = 1);
    var g = d / e,
      h, i, j = 0;
    for (var k = 0; k < e; k++) {j = g * k,
      h = 2 * (a.x + c.x - 2 * b.x) * j + 2 * b.x - 2 * a.x,
      i = 2 * (a.y + c.y - 2 * b.y) * j + 2 * b.y - 2 * a.y,
      h *= g,
      i *= g,
      f += Math.sqrt(h * h + i * i);}
    return f;
  },
  _calculateBezierCurveLength: function(a, b, c, d, e) {
    if (e <= 0 || e > 1) {return 0;}
    var f = 1e4,
      g = Math.floor(f * e); (g & 1) == 1 && g++;
    if (g == 0) {return 0;}
    var h = Math.floor(g / 2),
      i = 0,
      j = 0,
      k = e / g,
      m;
    for (m = 0; m < h; m++) {i += math._bezeSpeed(a, b, c, d, (2 * m + 1) * k);}
    for (m = 1; m < h; m++) {j += math._bezeSpeed(a, b, c, d, 2 * m * k);}
    return (math._bezeSpeed(a, b, c, d, 0) + math._bezeSpeed(a, b, c, d, 1) + 2 * j + 4 * i) * k / 3;
  },
  _bezeSpeedX: function(a, b, c, d, e) {
    var f = 1 - e;
    return - 3 * a.x * f * f + 3 * b.x * f * f - 6 * b.x * f * e + 6 * c.x * f * e - 3 * c.x * e * e + 3 * d.x * e * e;
  },
  _bezeSpeedY: function(a, b, c, d, e) {
    var f = 1 - e;
    return - 3 * a.y * f * f + 3 * b.y * f * f - 6 * b.y * f * e + 6 * c.y * f * e - 3 * c.y * e * e + 3 * d.y * e * e;
  },
  _bezeSpeed: function(a, b, c, d, e) {
    var f = math._bezeSpeedX(a, b, c, d, e),
      g = math._bezeSpeedY(a, b, c, d, e);
    return Math.sqrt(f * f + g * g);
  },
  getPointObject: function(a, b) {
    if (!b || b.size() == 0) {return a;}
    var c = new List;
    b = b._as,
      a = a._as;
    var d = 0,
      e, f, g = b.length,
      h = a.length;
    for (e = 0; e < g; e++) {
      f = b[e];
      if (d == h) {break;}
      'cubicto' === f ? d < h - 2 && c.add([a[d++], a[d++], a[d++]]) : 'quadto' === f ? d < h - 1 && c.add([a[d++], a[d++]]) : d < h && c.add(a[d++]);
    }
    for (; d < h; d++) {c.add(a[d]);}
    return c;
  },
  calculateLineLength: function(a, b) {
    if (!a || a.size() < 2) {return 0;}
    if (b) {return math.calculateLineLength(math.getPointObject(a, b));}
    a = a._as;
    var c, d = a.length,
      e, f, g, h, i, j, k = 0;
    for (c = 0; c < d; c++) {
      g = a[c];
      if (c == 0) {
        e = g;
        continue;
      }
      f = g,
        f instanceof List && (f = f._as),
        f instanceof Array ? (h = math.calculateCurveLength(e, f, 1), e = f[f.length - 1]) : (j = g.y - e.y, i = g.x - e.x, h = Math.sqrt(i * i + j * j), e = f),
        k += h;
    }
    return k;
  },
  toDegrees: function(a) {
    return a * 180 / Math.PI;
  },
  toRadians: function(a) {
    return a / 180 * Math.PI;
  },
  getRadiansBetweenLines: function(a, b) {
    return Math.atan2(b.y - a.y, b.x - a.x);
  },
  getAngle: function(a, b) {
    return a.x === b.x ?
    b.y === a.y ?
    0
    :
    b.y > a.y ?
    Math.PI / 2
    :
    -Math.PI / 2
    :
    Math.atan((b.y - a.y) / (b.x - a.x));
  }
};

module.exports = math;
