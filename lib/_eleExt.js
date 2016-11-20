const Element = require('./_element');
const Util = require('./_util');
const Tobj = require('./_tobj');
const SceneMode = Tobj.SceneMode;

function DisplayElement() {
  this.initialize = function() {
    DisplayElement.prototype.initialize.apply(this, arguments),
      this.elementType = 'displayElement',
      this.x = 0,
      this.y = 0,
      this.width = 32,
      this.height = 32,
      this.visible = !0,
      this.alpha = 1,
      this.rotate = 0,
      this.scaleX = 1,
      this.scaleY = 1,
      this.strokeColor = '22,124,255',
      this.borderColor = '22,124,255',
      this.fillColor = '22,124,255',
      this.shadow = !1,
      this.shadowBlur = 5,
      this.shadowColor = 'rgba(0,0,0,0.5)',
      this.shadowOffsetX = 3,
      this.shadowOffsetY = 6,
      this.transformAble = !1,
      this.zIndex = 0;
    let a = 'x,y,width,height,visible,alpha,rotate,scaleX,scaleY,strokeColor,fillColor,shadow,shadowColor,shadowOffsetX,shadowOffsetY,transformAble,zIndex'.split(',');
    this.serializedProperties = this.serializedProperties.concat(a);
  },
    this.initialize(),
    this.paint = function(a) {
      a.beginPath(),
      a.fillStyle = 'rgba(' + this.fillColor + ',' + this.alpha + ')',
      a.rect( - this.width / 2, -this.height / 2, this.width, this.height),
      a.fill(),
      a.stroke(),
      a.closePath();
    },
    this.getLocation = function() {
      return {
        x: this.x,
        y: this.y
      };
    },
    this.setLocation = function(a, b) {
      return this.x = a,
      this.y = b,
      this;
    },
    this.getCenterLocation = function() {
      return {
        x: this.x + this.width / 2,
        y: this.y + this.height / 2
      };
    },
    this.setCenterLocation = function(a, b) {
      return this.x = a - this.width / 2,
      this.y = b - this.height / 2,
      this;
    },
    this.getSize = function() {
      return {
        width: this.width,
        height: this.heith
      };
    },
    this.setSize = function(a, b) {
      return this.width = a,
      this.height = b,
      this;
    },
    this.getBound = function() {
      return {
        left: this.x,
        top: this.y,
        right: this.x + this.width,
        bottom: this.y + this.height,
        width: this.width,
        height: this.height
      };
    },
    this.setBound = function(a, b, c, d) {
      return this.setLocation(a, b),
      this.setSize(c, d),
      this;
    },
    this.getDisplayBound = function() {
      return {
        left: this.x,
        top: this.y,
        right: this.x + this.width * this.scaleX,
        bottom: this.y + this.height * this.scaleY
      };
    },
    this.getDisplaySize = function() {
      return {
        width: this.width * this.scaleX,
        height: this.height * this.scaleY
      };
    },
    this.getPosition = function(a) {
      let b, c = this.getBound();
      return 'Top_Left' == a ? b = {
        x: c.left,
        y: c.top
      }: 'Top_Center' == a ? b = {
        x: this.cx,
        y: c.top
      }: 'Top_Right' == a ? b = {
        x: c.right,
        y: c.top
      }: 'Middle_Left' == a ? b = {
        x: c.left,
        y: this.cy
      }: 'Middle_Center' == a ? b = {
        x: this.cx,
        y: this.cy
      }: 'Middle_Right' == a ? b = {
        x: c.right,
        y: this.cy
      }: 'Bottom_Left' == a ? b = {
        x: c.left,
        y: c.bottom
      }: 'Bottom_Center' == a ? b = {
        x: this.cx,
        y: c.bottom
      }: 'Bottom_Right' == a && (b = {
        x: c.right,
        y: c.bottom
      }),
      b;
    };
}
function InteractiveElement() {
  this.initialize = function() {
    InteractiveElement.prototype.initialize.apply(this, arguments),
      this.elementType = 'interactiveElement',
      this.dragable = !1,
      this.selected = !1,
      this.showSelected = !0,
      this.selectedLocation = null,
      this.isMouseOver = !1;
    let b = 'click,dbclick,mousedown,mouseup,mouseover,mouseout,mousemove,mousedrag,touchstart,touchmove,touchend'.split(','),
    d = this;
  b.forEach(function(a) {
    d[a] = function(b) {
      null != b ? this.addEventListener(a, b) : this.dispatchEvent(a);
    };
  });
}
function EditableElement() {
  this.initialize = function() {
    EditableElement.prototype.initialize.apply(this, arguments),
      this.editAble = !1,
      this.selectedPoint = null;
  },
    this.getCtrlPosition = function(a) {
      let e = this.selectedSize.height + a.dy;
          e > 1 && (this.height = e);
        }
        this.dispatchEvent('resize', a);
      }
    };
}
DisplayElement.prototype = new Element;
Object.defineProperties(DisplayElement.prototype, {
  cx: {
    get: function() {
      return this.x + this.width / 2;
    },
    set: function(a) {
      this.x = a - this.width / 2;
    }
  },
  cy: {
    get: function() {
      return this.y + this.height / 2;
    },
    set: function(a) {
      this.y = a - this.height / 2;
    }
  }
});

// c.prototype = new b,
// d.prototype = new c,
// a.DisplayElement = b,
// a.InteractiveElement = c,
// a.EditableElement = d

InteractiveElement.prototype = new DisplayElement;
EditableElement.prototype = new InteractiveElement;

// 单独挂在 t 上
module.exports = {
  DisplayElement: DisplayElement,
  InteractiveElement: InteractiveElement,
  EditableElement: EditableElement
};
