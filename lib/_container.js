const eleExt = require('./_eleExt');
const Tobj = require('./_tobj');
const _layout = require('./_layout');

function Container(c) {
  this.initialize = function(c) {
    Container.prototype.initialize.apply(this, null),
      this.elementType = 'container',
      this.zIndex = Tobj.zIndex_Container,
      this.width = 100,
      this.height = 100,
      this.childs = [],
      this.alpha = .5,
      this.dragable = !0,
      this.childDragble = !0,
      this.visible = !0,
      this.fillColor = '10,100,80',
      this.borderWidth = 0,
      this.borderColor = '255,255,255',
      this.borderRadius = null,
      this.font = '12px Consolas',
      this.fontColor = '255,255,255',
      this.text = c,
      this.textPosition = 'Bottom_Center',
      this.textOffsetX = 0,
      this.textOffsetY = 0,
      this.layout = new _layout.AutoBoundLayout;
  },
    this.initialize(c),
    this.add = function(a) {
      this.childs.push(a),
        a.dragable = this.childDragble;
    },
    this.remove = function(a) {
      for (let b = 0; b < this.childs.length; b++) {if (this.childs[b] === a) {
        a.parentContainer = null,
          this.childs = this.childs.del(b),
          a.lastParentContainer = this;
        break;
      }}
    },
    this.removeAll = function() {
      this.childs = [];
    },
    this.setLocation = function(a, b) {
      let c = a - this.x,
        d = b - this.y;
      this.x = a,
        this.y = b;
      for (let e = 0; e < this.childs.length; e++) {
        let f = this.childs[e];
        f.setLocation(f.x + c, f.y + d);
      }
    },
    this.doLayout = function(a) {
      a && a(this, this.childs);
    },
    this.paint = function(a) {
      this.visible && (this.layout && this.layout(this, this.childs), a.beginPath(), a.fillStyle = 'rgba(' + this.fillColor + ',' + this.alpha + ')', null == this.borderRadius || 0 == this.borderRadius ? a.rect(this.x, this.y, this.width, this.height) : a.JTopoRoundRect(this.x, this.y, this.width, this.height, this.borderRadius), a.fill(), a.closePath(), this.paintText(a), this.paintBorder(a));
    },
    this.paintBorder = function(a) {
      if (0 != this.borderWidth) {
        a.beginPath(),
          a.lineWidth = this.borderWidth,
          a.strokeStyle = 'rgba(' + this.borderColor + ',' + this.alpha + ')';
        let b = this.borderWidth / 2;
        null == this.borderRadius || 0 == this.borderRadius ? a.rect(this.x - b, this.y - b, this.width + this.borderWidth, this.height + this.borderWidth) : a.JTopoRoundRect(this.x - b, this.y - b, this.width + this.borderWidth, this.height + this.borderWidth, this.borderRadius),
          a.stroke(),
          a.closePath();
      }
    },
    this.paintText = function(a) {
      let b = this.text;
      if (null != b && '' != b) {
        a.beginPath(),
          a.font = this.font;
        let c = a.measureText(b).width,
          d = a.measureText('田').width;
        a.fillStyle = 'rgba(' + this.fontColor + ', ' + this.alpha + ')';
        let e = this.getTextPostion(this.textPosition, c, d);
        a.fillText(b, e.x, e.y),
          a.closePath();
      }
    },
    this.getTextPostion = function(a, b, c) {
      let d = null;
      return null == a || 'Bottom_Center' == a ? d = {
        x: this.x + this.width / 2 - b / 2,
        y: this.y + this.height + c
      } : 'Top_Center' == a ? d = {
        x: this.x + this.width / 2 - b / 2,
        y: this.y - c / 2
      } : 'Top_Right' == a ? d = {
        x: this.x + this.width - b,
        y: this.y - c / 2
      } : 'Top_Left' == a ? d = {
        x: this.x,
        y: this.y - c / 2
      } : 'Bottom_Right' == a ? d = {
        x: this.x + this.width - b,
        y: this.y + this.height + c
      } : 'Bottom_Left' == a ? d = {
        x: this.x,
        y: this.y + this.height + c
      } : 'Middle_Center' == a ? d = {
        x: this.x + this.width / 2 - b / 2,
        y: this.y + this.height / 2 + c / 2
      } : 'Middle_Right' == a ? d = {
        x: this.x + this.width - b,
        y: this.y + this.height / 2 + c / 2
      } : 'Middle_Left' == a && (d = {
        x: this.x,
        y: this.y + this.height / 2 + c / 2
      }),
        null != this.textOffsetX && (d.x += this.textOffsetX),
        null != this.textOffsetY && (d.y += this.textOffsetY),
        d;
    },
    this.paintMouseover = function() { },
    this.paintSelected = function(a) {
      a.shadowBlur = 10,
        a.shadowColor = 'rgba(0,0,0,1)',
        a.shadowOffsetX = 0,
        a.shadowOffsetY = 0;
    };
}
Container.prototype = new eleExt.InteractiveElement;

// 单独导出
module.exports = Container;
