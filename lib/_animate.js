const Node = require('./_node');
const Util = require('./_util');

function b(b, c) {
  var d, e = null;
  return {
    stop: function() {
      return d ? (window.clearInterval(d), e && e.publish('stop'), this) : this;
    },
    start: function() {
      var a = this;
      return d = setInterval(function() {
        b.call(a);
      },
        c),
        this;
    },
    onStop: function(b) {
      return null == e && (e = new Util.MessageBus),
        e.subscribe('stop', b),
        this;
    }
  };
}
function gravity(a, c) {
  c = c || {};
  var d = c.gravity || .1,
    e = c.dx || 0,
    f = c.dy || 5,
    g = c.stop,
    h = c.interval || 30,
    i = new b(function() {
      g && g() ? (f = .5, this.stop()) : (f += d, a.setLocation(a.x + e, a.y + f));
    },
      h);
  return i;
}
function stepByStep(a, c, d, e, f) {
  var g = 1e3 / 24,
    h = {};
  for (var i in c) {
    var j = c[i],
      k = j - a[i];
    h[i] = {
      oldValue: a[i],
      targetValue: j,
      step: k / d * g,
      isDone: function(b) {
        var c = this.step > 0 && a[b] >= this.targetValue || this.step < 0 && a[b] <= this.targetValue;
        return c;
      }
    };
  }
  var l = new b(function() {
    var b = !0;
    for (var d in c) {h[d].isDone(d) || (a[d] += h[d].step, b = !1);}
    if (b) {
      if (!e) {return this.stop();}
      for (var d in c) {if (f) {
        var g = h[d].targetValue;
        h[d].targetValue = h[d].oldValue,
          h[d].oldValue = g,
          h[d].step = -h[d].step;
      } else {a[d] = h[d].oldValue;}}
    }
    return this;
  },
    g);
  return l;
}
function spring(a) {
  null == a && (a = {});
  var b = a.spring || .1,
    c = a.friction || .8,
    d = a.grivity || 0,
    e = (a.wind || 0, a.minLength || 0);
  return {
    items: [],
    timer: null,
    isPause: !1,
    addNode: function(a, b) {
      var c = {
        node: a,
        target: b,
        vx: 0,
        vy: 0
      };
      return this.items.push(c),
        this;
    },
    play: function(a) {
      this.stop(),
        a = null == a ? 1e3 / 24 : a;
      var b = this;
      this.timer = setInterval(function() {
        b.nextFrame();
      },
        a);
    },
    stop: function() {
      null != this.timer && window.clearInterval(this.timer);
    },
    nextFrame: function() {
      for (var a = 0; a < this.items.length; a++) {
        var f = this.items[a],
          g = f.node,
          h = f.target,
          i = f.vx,
          j = f.vy,
          k = h.x - g.x,
          l = h.y - g.y,
          m = Math.atan2(l, k);
        if (0 != e) {
          var n = h.x - Math.cos(m) * e,
            o = h.y - Math.sin(m) * e;
          i += (n - g.x) * b,
            j += (o - g.y) * b;
        } else {i += k * b,
          j += l * b;}
        i *= c,
          j *= c,
          j += d,
          g.x += i,
          g.y += j,
          f.vx = i,
          f.vy = j;
      }
    }
  };
}
function rotate(a, b) {
  function c() {
    return e = setInterval(function() {
      return o ? void f.stop() : (a.rotate += g || .2, void (a.rotate > 2 * Math.PI && (a.rotate = 0)));
    },
      100),
      f;
  }
  function d() {
    return window.clearInterval(e),
      f.onStop && f.onStop(a),
      f;
  }
  var e = (b.context, null),
    f = {},
    g = b.v;
  return f.run = c,
    f.stop = d,
    f.onStop = function(a) {
      return f.onStop = a,
        f;
    },
    f;
}
function gravity(a, b) {
  function c() {
    return window.clearInterval(g),
      h.onStop && h.onStop(a),
      h;
  }
  function d() {
    var d = b.dx || 0,
      i = b.dy || 2;
    return g = setInterval(function() {
      return o ? void h.stop() : (i += f, void (a.y + a.height < e.stage.canvas.height ? a.setLocation(a.x + d, a.y + i) : (i = 0, c())));
    },
      20),
      h;
  }
  var e = b.context,
    f = b.gravity || .1,
    g = null,
    h = {};
  return h.run = d,
    h.stop = c,
    h.onStop = function(a) {
      return h.onStop = a,
        h;
    },
    h;
}
function dividedTwoPiece(b, c) {
  function d(c, d, e, f, g) {
    var h = new Node;
    return h.setImage(b.image),
      h.setSize(b.width, b.height),
      h.setLocation(c, d),
      h.showSelected = !1,
      h.dragable = !1,
      h.paint = function(a) {
        a.save(),
          a.arc(0, 0, e, f, g),
          a.clip(),
          a.beginPath(),
          null != this.image ? a.drawImage(this.image, -this.width / 2, -this.height / 2) : (a.fillStyle = 'rgba(' + this.style.fillStyle + ',' + this.alpha + ')', a.rect(- this.width / 2, -this.height / 2, this.width / 2, this.height / 2), a.fill()),
          a.closePath(),
          a.restore();
      },
      h;
  }
  function e(c, e) {
    var f = c,
      g = c + Math.PI,
      h = d(b.x, b.y, b.width, f, g),
      j = d(b.x - 2 + 4 * Math.random(), b.y, b.width, f + Math.PI, f);
    b.visible = !1,
      e.add(h),
      e.add(j),
      gravity(h, {
        context: e,
        dx: .3
      }).run().onStop(function() {
        e.remove(h),
          e.remove(j),
          i.stop();
      }),
      gravity(j, {
        context: e,
        dx: -.2
      }).run();
  }
  function f() {
    return e(c.angle, h),
      i;
  }
  function g() {
    return i.onStop && i.onStop(b),
      i;
  }
  var h = c.context,
    i = (b.style, {});
  return i.onStop = function(a) {
    return i.onStop = a,
      i;
  },
    i.run = f,
    i.stop = g,
    i;
}
function repeatThrow(a, b) {
  function c(a) {
    a.visible = !0,
      a.rotate = Math.random();
    var b = g.stage.canvas.width / 2;
    a.x = b + Math.random() * (b - 100) - Math.random() * (b - 100),
      a.y = g.stage.canvas.height,
      a.vx = 5 * Math.random() - 5 * Math.random(),
      a.vy = -25;
  }
  function d() {
    return c(a),
      h = setInterval(function() {
        return o ? void i.stop() : (a.vy += f, a.x += a.vx, a.y += a.vy, void ((a.x < 0 || a.x > g.stage.canvas.width || a.y > g.stage.canvas.height) && (i.onStop && i.onStop(a), c(a))));
      },
        50),
      i;
  }
  function e() {
    window.clearInterval(h);
  }
  var f = .8,
    g = b.context,
    h = null,
    i = {};
  return i.onStop = function(a) {
    return i.onStop = a,
      i;
  },
    i.run = d,
    i.stop = e,
    i;
}
function stopAll() {
  o = !0;
}
function startAll() {
  o = !1;
}
function cycle(b, c) {
  function d() {
    return n = setInterval(function() {
      if (o) {return void m.stop();}
      var a = f.y + h + Math.sin(k) * j;
      b.setLocation(b.x, a),
        k += l;
    },
      100),
      m;
  }
  function e() {
    window.clearInterval(n);
  }
  var f = c.p1,
    g = c.p2,
    h = (c.context, f.x + (g.x - f.x) / 2),
    i = f.y + (g.y - f.y) / 2,
    j = Util.getDistance(f, g) / 2,
    k = Math.atan2(i, h),
    l = c.speed || .2,
    m = {},
    n = null;
  return m.run = d,
    m.stop = e,
    m;
}
function move(a, b) {
  function c() {
    return h = setInterval(function() {
      if (o) {return void g.stop();}
      var b = e.x - a.x,
        c = e.y - a.y,
        h = b * f,
        i = c * f;
      a.x += h,
        a.y += i,
        .01 > h && .1 > i && d();
    },
      100),
      g;
  }
  function d() {
    window.clearInterval(h);
  }
  var e = b.position,
    f = (b.context, b.easing || .2),
    g = {},
    h = null;
  return g.onStop = function(a) {
    return g.onStop = a,
      g;
  },
    g.run = c,
    g.stop = d,
    g;
}
function scale(a, b) {
  function c() {
    return j = setInterval(function() {
      a.scaleX += f,
        a.scaleY += f,
        a.scaleX >= e && d();
    },
      100),
      i;
  }
  function d() {
    i.onStop && i.onStop(a),
      a.scaleX = g,
      a.scaleY = h,
      window.clearInterval(j);
  }
  var e = (b.position, b.context, b.scale || 1),
    f = .06,
    g = a.scaleX,
    h = a.scaleY,
    i = {},
    j = null;
  return i.onStop = function(a) {
    return i.onStop = a,
      i;
  },
    i.run = c,
    i.stop = d,
    i;
}

var Animate = {
    stepByStep: stepByStep,
    rotate :rotate,
    scale :scale,
    move :move,
    cycle:cycle,
    repeatThrow :repeatThrow,
    dividedTwoPiece:dividedTwoPiece,
    gravity :gravity,
    startAll :startAll,
    stopAll :stopAll
  },
  Effect = {
    spring:spring,
    gravity :gravity
  };
var o = !1;

  // a.Effect.spring = e,
  // a.Effect.gravity = c,
  // a.Animate.stepByStep = d,
  // a.Animate.rotate = f,
  // a.Animate.scale = n,
  // a.Animate.move = m,
  // a.Animate.cycle = l,
  // a.Animate.repeatThrow = i,
  // a.Animate.dividedTwoPiece = h,
  // a.Animate.gravity = g,
  // a.Animate.startAll = k,
  // a.Animate.stopAll = j;

// 单独导出
module.exports = {
  Effect: Effect,
  Animate: Animate
};
