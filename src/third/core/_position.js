const _third = require('./_third');

/**
 * 获取位置,private
 */
var Position = function(a, b, c, d, e, f) {
  this._m11 = a,
    this._m12 = b,
    this._m21 = c,
    this._m22 = d,
    this._offsetX = e,
    this._offsetY = f,
    this._type = 0;
  if (this._m21 != 0 || this._m12 != 0) {this._type = 4;}
  else {
    if (this._m11 != 1 || this._m22 != 1) {this._type = 2;}
    if (this._offsetX != 0 || this._offsetY != 0) {this._type |= 1; (this._type & (2 | 1)) == 0 && (this._type = 0);}
  }
};
Position.prototype.transform = function() {
  var a;
  arguments.length === 2 ? a = {
    x: arguments[0],
    y: arguments[1]
  } : a = arguments[0];
  if (!a || !_third.num(a.x) || !_third.num(a.y)) {throw 'arguments should contain x, y';}
  switch (this._type) {
    case 0:
      return {
        x:
        a.x,
        y: a.y
      };
    case 1:
      return {
        x:
        this._offsetX + a.x,
        y: this._offsetY + a.y
      };
    case 2:
      return {
        x:
        a.x * this._m11,
        y: a.y * this._m22
      };
    case 3:
      return {
        x:
        a.x * this._m11 + this._offsetX,
        y: a.y * this._m22 + this._offsetY
      };
  }
  return {
    x: this._m11 * a.x + a.y * this._m21 + this._offsetX,
    y: this._m22 * a.y + a.x * this._m12 + this._offsetY
  };
};

module.exports = Position;
