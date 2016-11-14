const Stage = require('./_stage');
const Scene = require('./_scene');

function b(a, b) {
  var c = [];
  if (0 == a.length) {
    return c;
  }
  var d = b.match(/^\s*(\w+)\s*$/);
  if (null != d) {
    var e = a.filter(function(a) {
      return a.elementType == d[1];
    });
    null != e && e.length > 0 && (c = c.concat(e));
  } else {
    var f = !1;
    if (d = b.match(/\s*(\w+)\s*\[\s*(\w+)\s*([>=<])\s*['"](\S+)['"]\s*\]\s*/), (null == d || d.length < 5) && (d = b.match(/\s*(\w+)\s*\[\s*(\w+)\s*([>=<])\s*(\d+(\.\d+)?)\s*\]\s*/), f = !0), null != d && d.length >= 5) {
      var g = d[1],
        h = d[2],
        i = d[3],
        j = d[4];
      e = a.filter(function(a) {
        if (a.elementType != g) {
          return !1;
        }
        var b = a[h];
        return 1 == f && (b = parseInt(b)),
            '=' == i ? b == j : '>' == i ? b > j : '<' == i ? j > b : '<=' == i ? j >= b : '>=' == i ? b >= j : '!=' == i ? b != j : !1;
      }),
        null != e && e.length > 0 && (c = c.concat(e));
    }
  }
  return c;
}

var events = 'click,mousedown,mouseup,mouseover,mouseout,mousedrag,keydown,keyup'.split(',');

function c(a) {
  if (a.find = function(a) {
    return find.call(this, a);
  },
    events.forEach(function(b) {
      a[b] = function(a) {
        for (var c = 0; c < this.length; c++) {
          this[c][b](a);
        }
        return this;
      };
    }), a.length > 0) {
    var b = a[0];
    for (var c in b) {
      var f = b[c];
      'function' == typeof f && !
        function(b) {
          a[c] = function() {
            for (var c = [], d = 0; d < a.length; d++) {
              c.push(b.apply(a[d], arguments));
            }
            return c;
          };
        }(f);
    }
  }
  return a.attr = function(a, b) {
    if (null != a && null != b) {
      for (var c = 0; c < this.length; c++) {
        this[c][a] = b;
      }
    } else {
      if (null != a && 'string' == typeof a) {
        for (var d = [], c = 0; c < this.length; c++) {
          d.push(this[c][a]);
        }
        return d;
      }
      if (null != a) {
        for (var c = 0; c < this.length; c++) {
          for (var e in a) {
            this[c][e] = a[e];
          }
        }
      }
    }
    return this;
  },
    a;
}

function find(d) {
  var e = [],
    f = [];
  this instanceof Stage ? (e = this.childs, f = f.concat(e)) : this instanceof Scene ? e = [this] : f = this,
    e.forEach(function(a) {
      f = f.concat(a.childs);
    });
  var g = null;
  return g = 'function' == typeof d ? f.filter(d) : b(f, d),
    g = c(g);
}

// a.Stage.prototype.find = d,
// a.Scene.prototype.find = d
module.exports = find;
