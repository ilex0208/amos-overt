
const List = require('./_list');
const math = require('./_math');
const Position = require('./_position');

var arrow = {
  shapeMap: {},
  init: function() {
    arrow.register('arrow.standard', arrow.createStandardArrow()),
      arrow.register('arrow.delta', arrow.createDeltaArrow()),
      arrow.register('arrow.diamond', arrow.createDiamondArrow()),
      arrow.register('arrow.short', arrow.createShortArrow()),
      arrow.register('arrow.slant', arrow.createSlantArrow());
  },
  createStandardArrow: function() {
    var a = new List;
    return a.add({
      x: -1,
      y: -5 / 9
    }),
      a.add({
        x: -0.75,
        y: 0
      }),
      a.add({
        x: -1,
        y: 5 / 9
      }),
      a.add({
        x: 0,
        y: 0
      }),
      a.add({
        x: -1,
        y: -5 / 9
      }),
      a;
  },
  createDeltaArrow: function() {
    var a = new List;
    return a.add({
      x: -1,
      y: -5 / 9
    }),
      a.add({
        x: -1,
        y: 5 / 9
      }),
      a.add({
        x: 0,
        y: 0
      }),
      a.add({
        x: -1,
        y: -5 / 9
      }),
      a;
  },
  createDiamondArrow: function() {
    var a = new List;
    return a.add({
      x: -7 / 12,
      y: 5 / 9
    }),
      a.add({
        x: -14 / 12,
        y: 0
      }),
      a.add({
        x: -7 / 12,
        y: -5 / 9
      }),
      a.add({
        x: 0,
        y: 0
      }),
      a.add({
        x: -7 / 12,
        y: 5 / 9
      }),
      a;
  },
  createShortArrow: function() {
    var a = new List;
    return a.add({
      x: -8 / 12,
      y: 6 / 9
    }),
      a.add({
        x: -5 / 12,
        y: 0
      }),
      a.add({
        x: -8 / 12,
        y: -6 / 9
      }),
      a.add({
        x: 0,
        y: 0
      }),
      a.add({
        x: -8 / 12,
        y: 6 / 9
      }),
      a;
  },
  createSlantArrow: function() {
    var a = new List;
    return a.add({
      x: -1,
      y: -5 / 9
    }),
      a.add({
        x: -6.5 / 12,
        y: 0
      }),
      a.add({
        x: -0.75,
        y: 4 / 9
      }),
      a.add({
        x: 0,
        y: 0
      }),
      a.add({
        x: -1,
        y: -5 / 9
      }),
      a;
  },
  register: function(a, b) {
    arrow.shapeMap[a] = b;
  },
  getShape: function(a) {
    if (a) {return arrow.shapeMap[a];}
    throw 'shape type can\'t be null';
  },
  _drawArrow: function(a, b, c, d, e, f) {
    b = b._as;
    var g, h = b.length,
      i = new List,
      j, m;
    m = new Position(e, 0, 0, f, d.x, d.y);
    for (g = 0; g < h; g++) {i.add(m.transform(b[g]));}
    i = i._as,
      m = math.createMatrix(c + Math.PI, d.x, d.y);
    var n = i[0];
    n = m.transform(n),
      a.moveTo(n.x, n.y);
    for (g = 1; g < h; g++) {j = i[g],
      j instanceof List && (j = j._as),
      j instanceof Array ? (j[0] = m.transform(j[0]), j[1] = m.transform(j[1]), a.quadraticCurveTo(j[0].x, j[0].y, j[1].x, j[1].y)) : (j = m.transform(j), a.lineTo(j.x, j.y));}
  },
  drawLinkArrow: function(a, b, c) {
    if (c.size() < 2) {return;}
    a._element.getStyle('arrow.from') && arrow._drawFromArrow(a, b, c),
      a._element.getStyle('arrow.to') && arrow._drawToArrow(a, b, c);
  },
  _drawFromArrow: function(a, b, c) {
    var d = a._element,
      e = d.getStyle('arrow.from.fill'),
      f = d.getStyle('arrow.from.outline.width');
    if (e || f >= 0) {
      var g = d.getStyle('arrow.from.width'),
        h = d.getStyle('arrow.from.height'),
        i = d.getStyle('arrow.from.xoffset');
      if (i > 0 && i < 1) {
        var j;
        a.getLineLength ? j = a.getLineLength() : j = a._element.getLineLength(),
          i *= j;
      } else{ a.getLineLength && (i += arrow.calculateArrowXOffsetAtEdge(c, a, !0));}
      var k = d.getStyle('arrow.from.yoffset'),
        l = d.getStyle('arrow.from.shape');
      arrow.drawArrow(b, g, h, c, !0, l, e, d.getStyle('arrow.from.color'), i, k, f, d.getStyle('arrow.from.outline.color'));
    }
  },
  _drawToArrow: function(a, b, c) {
    var d = a._element,
      e = d.getStyle('arrow.to.fill'),
      f = d.getStyle('arrow.to.outline.width');
    if (e || f >= 0) {
      var g = d.getStyle('arrow.to.width'),
        h = d.getStyle('arrow.to.height'),
        i = d.getStyle('arrow.to.xoffset');
      if (i > 0 && i < 1) {
        var j;
        a.getLineLength ? j = a.getLineLength() : j = a._element.getLineLength(),
          i *= j;
      } else {a.getLineLength && (i += arrow.calculateArrowXOffsetAtEdge(c, a, !1));}
      var k = d.getStyle('arrow.to.yoffset'),
        l = d.getStyle('arrow.to.shape');
      arrow.drawArrow(b, g, h, c, !1, l, e, d.getStyle('arrow.to.color'), i, k, f, d.getStyle('arrow.to.outline.color'));
    }
  }
};
arrow.init();

module.exports = arrow;
