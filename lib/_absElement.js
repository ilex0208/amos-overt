'use-strict';
//////////////////////////////
/**
 * 基础Element
 * @author ilex
 * @description 2016-11-04 10:56:12
 */
//////////////////////////////
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
      let _self = this, $property = {};
      this.serializedProperties.forEach(function(saveProperty) {
        $property[saveProperty] = _self[saveProperty];
      }),
        this.propertiesStack.push($property);
    },
    this.restore = function() {
      if (null != this.propertiesStack && 0 != this.propertiesStack.length) {
        let _self = this,
          res = this.propertiesStack.pop();
        this.serializedProperties.forEach(function(resProperty) {
          _self[resProperty] = res[resProperty];
        });
      }
    },
    this.toJson = function() {
      let _self = this,
        result = '{',
        len = this.serializedProperties.length;
      return this.serializedProperties.forEach(function(val, index) {
        let pro = _self[val];
        'string' == typeof pro && (pro = '"' + pro + '"'),
          result += '"' + val + '":' + pro,
          len > index + 1 && (result += ',');
      }),
        result += '}';
    };
}

/**
 * 自定义rect
 *
 * @param {any} x x坐标
 * @param {any} y y坐标
 * @param {any} width 宽
 * @param {any} height 高
 * @param {any} borderRadius 默认5
 */
CanvasRenderingContext2D.prototype.AmostRoundRect = function(x, y, width, height, borderRadius) {
  'undefined' == typeof borderRadius && (borderRadius = 5),
    this.beginPath(),
    this.moveTo(x + borderRadius, y),
    this.lineTo(x + width - borderRadius, y),
    this.quadraticCurveTo(x + width, y, x + width, y + borderRadius),
    this.lineTo(x + width, y + height - borderRadius),
    this.quadraticCurveTo(x + width, y + height, x + width - borderRadius, y + height),
    this.lineTo(x + borderRadius, y + height),
    this.quadraticCurveTo(x, y + height, x, y + height - borderRadius),
    this.lineTo(x, y + borderRadius),
    this.quadraticCurveTo(x, y, x + borderRadius, y),
    this.closePath();
};


/**
 * 自定义lineTo
 *
 * @param {any} x x坐标
 * @param {any} y y坐标
 * @param {any} width 宽
 * @param {any} height 高
 * @param {any} dashedPattern 默认5
 */
CanvasRenderingContext2D.prototype.AmostDashedLineTo = function(x, y, width, height, dashedPattern) {
  'undefined' == typeof dashedPattern && (dashedPattern = 5);
  let distanceW = width - x,
    distanceH = height - y,
    hypotenuse = Math.floor(Math.sqrt(distanceW * distanceW + distanceH * distanceH)), // 平方根,计算斜边
    _line = 0 >= dashedPattern ? hypotenuse : hypotenuse / dashedPattern,
    endY = distanceH / hypotenuse * dashedPattern,
    endX = distanceW / hypotenuse * dashedPattern;
  this.beginPath();
  for (let i = 0; i < _line; i++)
  {
    i % 2 ? this.lineTo(x + i * endX, y + i * endY) : this.moveTo(x + i * endX, y + i * endY);
  }
  this.stroke();
};

module.exports = Element;
