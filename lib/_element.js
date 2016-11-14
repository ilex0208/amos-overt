function Element() {
  this.initialize = function() {
    this.elementType = 'element',
      this.serializedProperties = ['elementType'],
      this.propertiesStack = [],
      this._id = '' + (new Date).getTime();
  },
    this.distroy = function() { },
    this.removeHandler = function() { },
    this.attr = function(a, b) {
      if (null != a && null != b) { this[a] = b; }
      else if (null != a) { return this[a]; }
      return this;
    },
    this.save = function() {
      var a = this,
        b = {};
      this.serializedProperties.forEach(function(c) {
        b[c] = a[c];
      }),
        this.propertiesStack.push(b);
    },
    this.restore = function() {
      if (null != this.propertiesStack && 0 != this.propertiesStack.length) {
        var a = this,
          b = this.propertiesStack.pop();
        this.serializedProperties.forEach(function(c) {
          a[c] = b[c];
        });
      }
    },
    this.toJson = function() {
      var a = this,
        b = '{',
        c = this.serializedProperties.length;
      return this.serializedProperties.forEach(function(d, e) {
        var f = a[d];
        'string' == typeof f && (f = '"' + f + '"'),
          b += '"' + d + '":' + f,
          c > e + 1 && (b += ',');
      }),
        b += '}';
    };
}
CanvasRenderingContext2D.prototype.JTopoRoundRect = function(a, b, c, d, e) {
  'undefined' == typeof e && (e = 5),
    this.beginPath(),
    this.moveTo(a + e, b),
    this.lineTo(a + c - e, b),
    this.quadraticCurveTo(a + c, b, a + c, b + e),
    this.lineTo(a + c, b + d - e),
    this.quadraticCurveTo(a + c, b + d, a + c - e, b + d),
    this.lineTo(a + e, b + d),
    this.quadraticCurveTo(a, b + d, a, b + d - e),
    this.lineTo(a, b + e),
    this.quadraticCurveTo(a, b, a + e, b),
    this.closePath();
};
CanvasRenderingContext2D.prototype.JTopoDashedLineTo = function(a, b, c, d, e) {
  'undefined' == typeof e && (e = 5);
  var f = c - a,
    g = d - b,
    h = Math.floor(Math.sqrt(f * f + g * g)),
    i = 0 >= e ? h : h / e,
    j = g / h * e,
    k = f / h * e;
  this.beginPath();
  for (var l = 0; i > l; l++) { l % 2 ? this.lineTo(a + l * k, b + l * j) : this.moveTo(a + l * k, b + l * j); }
  this.stroke();
};

module.exports = Element;
