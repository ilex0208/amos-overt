function b(a, b) {
  this.x = a,
    this.y = b;
}
function Tortoise(a) {
  this.p = new b(0, 0),
    this.w = new b(1, 0),
    this.paint = a;
}
function shift(a, b, c) {
  return function(d) {
    for (var e = 0; b > e; e++) {
      a(),
        c && d.turn(c),
        d.move(3);
    }
  };
}
function spin(a, b) {
  var c = 2 * Math.PI;
  return function(d) {
    for (var e = 0; b > e; e++) {
      a(),
        d.turn(c / b);
    }
  };
}
function scale(a, b, c) {
  return function(d) {
    for (var e = 0; b > e; e++) {
      a(),
        d.resize(c);
    }
  };
}
function polygon(a) {
  var b = 2 * Math.PI;
  return function(c) {
    for (var d = 0; a > d; d++) {
      c.forward(1),
        c.turn(b / a);
    }
  };
}
function star(a) {
  var b = 4 * Math.PI;
  return function(c) {
    for (var d = 0; a > d; d++) {
      c.forward(1),
        c.turn(b / a);
    }
  };
}
function spiral(a, b, c, d) {
  return function(e) {
    for (var f = 0; b > f; f++) {
      a(),
        e.forward(1),
        e.turn(c),
        e.resize(d);
    }
  };
}

Tortoise.prototype.forward = function(a) {
  var b = this.p,
    c = this.w;
  return b.x = b.x + a * c.x,
    b.y = b.y + a * c.y,
    this.paint && this.paint(b.x, b.y),
    this;
};
Tortoise.prototype.move = function(a) {
  var b = this.p,
    c = this.w;
  return b.x = b.x + a * c.x,
    b.y = b.y + a * c.y,
    this;
};
Tortoise.prototype.moveTo = function(a, b) {
  return this.p.x = a,
    this.p.y = b,
    this;
};
Tortoise.prototype.turn = function(a) {
  var b = (this.p, this.w),
    c = Math.cos(a) * b.x - Math.sin(a) * b.y,
    d = Math.sin(a) * b.x + Math.cos(a) * b.y;
  return b.x = c,
    b.y = d,
    this;
};
Tortoise.prototype.resize = function(a) {
  var b = this.w;
  return b.x = b.x * a,
    b.y = b.y * a,
    this;
};
Tortoise.prototype.save = function() {
  return null == this._stack && (this._stack = []),
    this._stack.push([this.p, this.w]),
    this;
};
Tortoise.prototype.restore = function() {
  if (null != this._stack && this._stack.length > 0) {
    var a = this._stack.pop();
    this.p = a[0],
      this.w = a[1];
  }
  return this;
};
// j.Tortoise = c,
// j.shift = d,
// j.spin = e,
// j.polygon = g,
// j.spiral = i,
// j.star = h,
// j.scale = f,
// a.Logo = j

var Logo = {
  Tortoise: Tortoise,
  shift: shift,
  spin: spin,
  polygon: polygon,
  spiral: spiral,
  star: star,
  scale: scale
};

module.exports = Logo;
