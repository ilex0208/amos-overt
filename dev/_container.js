'use strict';

//////////////////////////////
/**
 * 容器
 * @author ilex
 * @description 2016-11-03 11:56:12
 */
//////////////////////////////
var _e = require('./_baseElement');
var Tobj = require('./_tobj');
var _layout = require('./_layout');

var InteractiveElement = _e.InteractiveElement;
/**
 * 容器
 *
 * @param {any} name 容器名称,可以为空
 */
function Container(name) {
  this.initialize = function (_text) {
    Container.prototype.initialize.apply(this, null), this.elementType = 'container', this.zIndex = Tobj.zIndex_Container, this.width = 100, this.height = 100, this.childs = [], this.alpha = 0.5, this.dragable = true, this.childDragble = true, this.visible = true, this.fillColor = '10,100,80', this.borderWidth = 0, this.borderColor = '255,255,255', this.borderRadius = null, this.font = '12px Consolas', this.fontColor = '255,255,255', this.text = _text, this.textPosition = 'Bottom_Center', this.textOffsetX = 0, this.textOffsetY = 0, this.layout = new _layout.AutoBoundLayout();
  }, this.initialize(name), this.add = function (node) {
    this.childs.push(node), node.dragable = this.childDragble;
  }, this.remove = function (node) {
    for (var i = 0; i < this.childs.length; i++) {
      if (this.childs[i] === node) {
        node.parentContainer = null, this.childs = this.childs.del(i), node.lastParentContainer = this;
        break;
      }
    }
  }, this.removeAll = function () {
    this.childs = [];
  }, this.setLocation = function (_x, _y) {
    var changeX = _x - this.x,
        changeY = _y - this.y;
    this.x = _x, this.y = _y;
    for (var i = 0; i < this.childs.length; i++) {
      var node = this.childs[i];
      node.setLocation(node.x + changeX, node.y + changeY);
    }
  }, this.doLayout = function (fn) {
    fn && fn(this, this.childs);
  }, this.paint = function (ctx) {
    this.visible && (this.layout && this.layout(this, this.childs), ctx.beginPath(), ctx.fillStyle = 'rgba(' + this.fillColor + ',' + this.alpha + ')', null == this.borderRadius || 0 == this.borderRadius ? ctx.rect(this.x, this.y, this.width, this.height) : ctx.AmostRoundRect(this.x, this.y, this.width, this.height, this.borderRadius), ctx.fill(), ctx.closePath(), this.paintText(ctx), this.paintBorder(ctx));
  }, this.paintBorder = function (ctx) {
    if (this.borderWidth != 0) {
      ctx.beginPath(), ctx.lineWidth = this.borderWidth, ctx.strokeStyle = 'rgba(' + this.borderColor + ',' + this.alpha + ')';
      var _bw = this.borderWidth / 2;
      null == this.borderRadius || 0 == this.borderRadius ? ctx.rect(this.x - _bw, this.y - _bw, this.width + this.borderWidth, this.height + this.borderWidth) : ctx.AmostRoundRect(this.x - _bw, this.y - _bw, this.width + this.borderWidth, this.height + this.borderWidth, this.borderRadius), ctx.stroke(), ctx.closePath();
    }
  }, this.paintText = function (ctx) {
    var _text = this.text;
    if (null != _text && '' != _text) {
      ctx.beginPath(), ctx.font = this.font;
      var textW = ctx.measureText(_text).width,
          _dw = ctx.measureText('田').width;
      ctx.fillStyle = 'rgba(' + this.fontColor + ', ' + this.alpha + ')';
      var textPos = this.getTextPostion(this.textPosition, textW, _dw);
      ctx.fillText(_text, textPos.x, textPos.y), ctx.closePath();
    }
  }, this.getTextPostion = function (pos, textWidth, defaultWidth) {
    var textPos = null;
    return null == pos || 'Bottom_Center' == pos ? textPos = {
      x: this.x + this.width / 2 - textWidth / 2,
      y: this.y + this.height + defaultWidth
    } : 'Top_Center' == pos ? textPos = {
      x: this.x + this.width / 2 - textWidth / 2,
      y: this.y - defaultWidth / 2
    } : 'Top_Right' == pos ? textPos = {
      x: this.x + this.width - textWidth,
      y: this.y - defaultWidth / 2
    } : 'Top_Left' == pos ? textPos = {
      x: this.x,
      y: this.y - defaultWidth / 2
    } : 'Bottom_Right' == pos ? textPos = {
      x: this.x + this.width - textWidth,
      y: this.y + this.height + defaultWidth
    } : 'Bottom_Left' == pos ? textPos = {
      x: this.x,
      y: this.y + this.height + defaultWidth
    } : 'Middle_Center' == pos ? textPos = {
      x: this.x + this.width / 2 - textWidth / 2,
      y: this.y + this.height / 2 + defaultWidth / 2
    } : 'Middle_Right' == pos ? textPos = {
      x: this.x + this.width - textWidth,
      y: this.y + this.height / 2 + defaultWidth / 2
    } : 'Middle_Left' == pos && (textPos = {
      x: this.x,
      y: this.y + this.height / 2 + defaultWidth / 2
    }), null != this.textOffsetX && (textPos.x += this.textOffsetX), null != this.textOffsetY && (textPos.y += this.textOffsetY), textPos;
  }, this.paintMouseover = function () {}, this.paintSelected = function (ctx) {
    ctx.shadowBlur = 10; // 设置或返回用于阴影的模糊级别
    ctx.shadowColor = 'rgba(0,0,0,1)'; // 设置或返回用于阴影的颜色
    ctx.shadowOffsetX = 0; // 设置或返回阴影距形状的水平距离
    ctx.shadowOffsetY = 0; // 设置或返回阴影距形状的垂直距离
  };
}
Container.prototype = new InteractiveElement();

// 单独导出
module.exports = Container;
//# sourceMappingURL=_container.js.map