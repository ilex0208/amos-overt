const Stage = require('./_stage');
const Scene = require('./_scene');

function b(a, b) {
  let c = [];
  if (0 == a.length) {
    return c;
  }
  let d = b.match(/^\s*(\w+)\s*$/);
  if (null != d) {
    let e = a.filter(function(a) {
      return a.elementType == d[1];
    });
    null != e && e.length > 0 && (c = c.concat(e));
  } else {
    let f = !1;
    if (d = b.match(/\s*(\w+)\s*\[\s*(\w+)\s*([>=<])\s*['"](\S+)['"]\s*\]\s*/), (null == d || d.length < 5) && (d = b.match(/\s*(\w+)\s*\[\s*(\w+)\s*([>=<])\s*(\d+(\.\d+)?)\s*\]\s*/), f = !0), null != d && d.length >= 5) {
      let g = d[1],
        h = d[2],
        i = d[3],
        j = d[4];
      e = a.filter(function(a) {
        if (a.elementType != g) {
          return !1;
        }
        let b = a[h];
        return 1 == f && (b = parseInt(b)),
            '=' == i ? b == j : '>' == i ? b > j : '<' == i ? j > b : '<=' == i ? j >= b : '>=' == i ? b >= j : '!=' == i ? b != j : !1;
      }),
        null != e && e.length > 0 && (c = c.concat(e));
    }
  }
  return c;
}

let events = 'click,mousedown,mouseup,mouseover,mouseout,mousedrag,keydown,keyup'.split(',');

function c(a) {
  a.find = function(a) {
    return find.call(this, a);
  };
  events.forEach(function(ev) {
    a[b] = function(a) {
      for (let c = 0; c < this.length; c++) {
        this[c][ev](a);
      }
      return this;
    };
  });
  if (a.length > 0) {
    let b = a[0];
    for (let c in b) {
      let f = b[c];
      'function' == typeof f && !function(b) {
          a[c] = function() {
            for (let c = [], d = 0; d < a.length; d++) {
              c.push(b.apply(a[d], arguments));
            }
            return c;
          };
        }(f);
    }
  }
  return a.attr = function(a, b) {
    if (null != a && null != b) {
      for (let c = 0; c < this.length; c++) {
        this[c][a] = b;
      }
    } else {
      if (null != a && 'string' == typeof a) {
        for (let d = [], c = 0; c < this.length; c++) {
          d.push(this[c][a]);
        }
        return d;
      }
      if (null != a) {
        for (let c = 0; c < this.length; c++) {
          for (let e in a) {
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
  let e = [],
    f = [];
  this instanceof Stage ? (e = this.childs, f = f.concat(e)) : this instanceof Scene ? e = [this] : f = this,
    e.forEach(function(a) {
      f = f.concat(a.childs);
    });
  let g = null;
  return g = 'function' == typeof d ? f.filter(d) : b(f, d),
    g = c(g);
}

module.exports = find;
