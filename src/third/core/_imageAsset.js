const html = require('./_html');

/**
 * ImageAsset
 */
const ImageAsset = function(a, b, c, d, e) {
  this._name = a,
    this._width = c,
    this._height = d,
    this._svg = e,
    typeof b == 'string' ? this._src = b : typeof b == 'function' ? this._func = b : this._image = b;
  this._canvas = html.createCanvas(),
  this._colors = {},
  this.getName = function() {
    return this._name;
  },
  this.getSrc = function() {
    return this._src;
  },
  this.getSvg = function() {
    return this._svg;
  },
  this._getValue = function(a) {
    var b = ImageAsset._colors[a];
    if (b != null) { return b; }
    var d = ImageAsset._canvas;
    d.width = 3,
      d.height = 3;
    var e = d.getContext('2d');
    e.clearRect(0, 0, 3, 3),
      e.fillStyle = a,
      e.beginPath(),
      e.rect(0, 0, 3, 3),
      e.closePath(),
      e.fill();
    var f = e.getImageData(1, 1, 1, 1).data;
    return b = (f[0] << 16) + (f[1] << 8) + f[2],
      ImageAsset._colors[a] = b,
      b;
  },
  this._getImage = function(a, b, c, d) {
    var e = html.createCanvas(c, d),
      f = e.getContext('2d');
    f.drawImage(a, 0, 0, c, d);
    try {
      var g = f.getImageData(0, 0, c, d),
        h = g.data;
      for (var i = 0,
        j = h.length; i < j; i += 4) {
        var k = h[i + 0],
          l = h[i + 1],
          m = h[i + 2],
          n = k * 77 + l * 151 + m * 28 >> 8;
        n = n << 16 | n << 8 | n,
          n &= b,
          h[i + 0] = n >> 16 & 255,
          h[i + 1] = n >> 8 & 255,
          h[i + 2] = n & 255;
      }
      f.putImageData(g, 0, 0);
    } catch (p) {
      return a;
    }
    return e;
  },
  this.getImage = function(a, b, d) {
    if (!a || !this._image) {
      return this._image;
    }
    this._map || (this._map = {});
    var e;
    this._svg && arguments.length === 3 ? e = a + ',' + b + ',' + d : e = a;
    var f = this._map[e];
    if (f) {
      return f;
    }
    var g = ImageAsset._getValue(a);
    return f = ImageAsset._getImage(this._image, g, this._svg ? b : this.getWidth(), this._svg ? d : this.getHeight()),
      this._map[e] = f,
      f;
  },
  this.getWidth = function() {
    return this._width;
  },
  this.getHeight = function() {
    return this._height;
  },
  this.getFunction = function() {
    return this._func;
  };
};

module.exports = ImageAsset;
