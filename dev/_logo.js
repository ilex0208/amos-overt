"use strict";

//////////////////////////////
/**
 * @author ilex
 * @description 2016-11-15 12:13:11
 */
//////////////////////////////

/**
 * 移动位置
 *
 * @param {number} x
 * @param {number} y
 */
function Point(x, y) {
  this.x = x, this.y = y;
}

/**
 * 乌龟,工具类
 * @param {any} paint
 */
function Tortoise(paint) {
  this.p = new Point(0, 0), this.w = new Point(1, 0), this.paint = paint;
}

/**
 * 乌龟,工具类
 * @param {function} fn
 * @param {number} times
 * @param {number} angle
 */
function shift(fn, times, angle) {
  return function (_tortoise) {
    for (var i = 0; i < times; i++) {
      fn(), angle && _tortoise.turn(angle), _tortoise.move(3);
    }
  };
}

/**
 * 快速旋转
 *
 * @param {function} fn
 * @param {number} times
 * @returns
 */
function spin(fn, times) {
  var _2PI = 2 * Math.PI;
  return function (_tortoise) {
    for (var i = 0; i < times; i++) {
      fn(), _tortoise.turn(_2PI / times);
    }
  };
}

/**
 * 调整比例
 *
 * @param {function} fn
 * @param {number} times
 * @param {number} ratio 调整大小的比例系数
 * @returns
 */
function scale(fn, times, ratio) {
  return function (_tortoise) {
    for (var i = 0; i < times; i++) {
      fn(), _tortoise.resize(ratio);
    }
  };
}

/**
 * 龟裂状
 *
 * @param {number} times
 * @returns
 */
function polygon(times) {
  var _2PI = 2 * Math.PI;
  return function (_tortoise) {
    for (var i = 0; i < times; i++) {
      _tortoise.forward(1), _tortoise.turn(_2PI / times);
    }
  };
}

/**
 * 星状
 *
 * @param {number} times
 * @returns
 */
function star(times) {
  var _4PI = 4 * Math.PI;
  return function (_tortoise) {
    for (var i = 0; i < times; i++) {
      _tortoise.forward(1), _tortoise.turn(_4PI / times);
    }
  };
}

/**
 * 螺旋状
 *
 * @param {function} fn
 * @param {number} times
 * @param {number} angle
 * @param {number} ratio
 * @returns
 */
function spiral(fn, times, angle, ratio) {
  return function (_tortoise) {
    for (var i = 0; i < times; i++) {
      fn(), _tortoise.forward(1), _tortoise.turn(angle), _tortoise.resize(ratio);
    }
  };
}

/**
 * 向前
 * @param {number} distance 前进的距离
 */
Tortoise.prototype.forward = function (distance) {
  var $p = this.p,
      $w = this.w;
  return $p.x = $p.x + distance * $w.x, $p.y = $p.y + distance * $w.y, this.paint && this.paint($p.x, $p.y), this;
};

/**
 * 移动
 * @param {number} distance 移动的距离
 */
Tortoise.prototype.move = function (distance) {
  var $p = this.p,
      $w = this.w;
  return $p.x = $p.x + distance * $w.x, $p.y = $p.y + distance * $w.y, this;
};

/**
 * 移动到
 * @param {number} x 横坐标
 * @param {number} y 纵坐标
 */
Tortoise.prototype.moveTo = function (x, y) {
  return this.p.x = x, this.p.y = y, this;
};

/**
 * 转动
 * @param {number} angle 旋转角度
 */
Tortoise.prototype.turn = function (angle) {
  var temp = (this.p, this.w),
      $x = Math.cos(angle) * temp.x - Math.sin(angle) * temp.y,
      $y = Math.sin(angle) * temp.x + Math.cos(angle) * temp.y;
  return temp.x = $x, temp.y = $y, this;
};

/**
 * 调整大小
 * @param {number} ratio 比例系数
 */
Tortoise.prototype.resize = function (ratio) {
  var tempW = this.w;
  return tempW.x = tempW.x * ratio, tempW.y = tempW.y * ratio, this;
};

/**
 * 保存
 */
Tortoise.prototype.save = function () {
  return null == this._stack && (this._stack = []), this._stack.push([this.p, this.w]), this;
};

/**
 * 回复
 */
Tortoise.prototype.restore = function () {
  if (null != this._stack && this._stack.length > 0) {
    var a = this._stack.pop();
    this.p = a[0], this.w = a[1];
  }
  return this;
};

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
//# sourceMappingURL=_logo.js.map