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
    var a = 'x,y,width,height,visible,alpha,rotate,scaleX,scaleY,strokeColor,fillColor,shadow,shadowColor,shadowOffsetX,shadowOffsetY,transformAble,zIndex'.split(',');
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
      var b, c = this.getBound();
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
    var a = 'dragable,selected,showSelected,isMouseOver'.split(',');
    this.serializedProperties = this.serializedProperties.concat(a);
  },
    this.initialize(),
    this.paintSelected = function(a) {
      0 != this.showSelected && (a.save(), a.beginPath(), a.strokeStyle = 'rgba(168,202,255, 0.9)', a.fillStyle = 'rgba(168,202,236,0.7)', a.rect( - this.width / 2 - 3, -this.height / 2 - 3, this.width + 6, this.height + 6), a.fill(), a.stroke(), a.closePath(), a.restore());
    },
    this.paintMouseover = function(a) {
      return this.paintSelected(a);
    },
    this.isInBound = function(a, b) {
      return a > this.x && a < this.x + this.width * Math.abs(this.scaleX) && b > this.y && b < this.y + this.height * Math.abs(this.scaleY);
    },
    this.selectedHandler = function() {
      this.selected = !0,
      this.selectedLocation = {
        x: this.x,
        y: this.y
      };
    },
    this.unselectedHandler = function() {
      this.selected = !1,
      this.selectedLocation = null;
    },
    this.dbclickHandler = function(a) {
      this.dispatchEvent('dbclick', a);
    },
    this.clickHandler = function(a) {
      this.dispatchEvent('click', a);
    },
    this.mousedownHander = function(a) {
      this.dispatchEvent('mousedown', a);
    },
    this.mouseupHandler = function(a) {
      this.dispatchEvent('mouseup', a);
    },
    this.mouseoverHandler = function(a) {
      this.isMouseOver = !0,
      this.dispatchEvent('mouseover', a);
    },
    this.mousemoveHandler = function(a) {
      this.dispatchEvent('mousemove', a);
    },
    this.mouseoutHandler = function(a) {
      this.isMouseOver = !1,
      this.dispatchEvent('mouseout', a);
    },
    this.mousedragHandler = function(a) {
      var b = this.selectedLocation.x + a.dx,
        c = this.selectedLocation.y + a.dy;
      this.setLocation(b, c),
      this.dispatchEvent('mousedrag', a);
    },
    this.addEventListener = function(b, c) {
      var d = this,
        e = function(a) {
          c.call(d, a);
        };
      return this.messageBus || (this.messageBus = new Util.MessageBus),
      this.messageBus.subscribe(b, e),
      this;
    },
    this.dispatchEvent = function(a, b) {
      return this.messageBus ? (this.messageBus.publish(a, b), this) : null;
    },
    this.removeEventListener = function(a) {
      this.messageBus.unsubscribe(a);
    },
    this.removeAllEventListener = function() {
      this.messageBus = new Util.MessageBus;
    };
  var b = 'click,dbclick,mousedown,mouseup,mouseover,mouseout,mousemove,mousedrag,touchstart,touchmove,touchend'.split(','),
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
      var b = 5,
        c = 5,
        d = this.getPosition(a);
      return {
        left: d.x - b,
        top: d.y - c,
        right: d.x + b,
        bottom: d.y + c
      };
    },
    this.selectedHandler = function(b) {
      EditableElement.prototype.selectedHandler.apply(this, arguments),
      this.selectedSize = {
        width: this.width,
        height: this.height
      },
      b.scene.mode == SceneMode.edit && (this.editAble = !0);
    },
    this.unselectedHandler = function() {
      EditableElement.prototype.unselectedHandler.apply(this, arguments),
      this.selectedSize = null,
      this.editAble = !1;
    };
  var b = ['Top_Left', 'Top_Center', 'Top_Right', 'Middle_Left', 'Middle_Right', 'Bottom_Left', 'Bottom_Center', 'Bottom_Right'];
  this.paintCtrl = function(a) {
    if (0 != this.editAble) {
      a.save();
      for (var c = 0; c < b.length; c++) {
        var d = this.getCtrlPosition(b[c]);
        d.left -= this.cx,
          d.right -= this.cx,
          d.top -= this.cy,
          d.bottom -= this.cy;
        var e = d.right - d.left,
          f = d.bottom - d.top;
        a.beginPath(),
          a.strokeStyle = 'rgba(0,0,0,0.8)',
          a.rect(d.left, d.top, e, f),
          a.stroke(),
          a.closePath(),
          a.beginPath(),
          a.strokeStyle = 'rgba(255,255,255,0.3)',
          a.rect(d.left + 1, d.top + 1, e - 2, f - 2),
          a.stroke(),
          a.closePath();
      }
      a.restore();
    }
  },
    this.isInBound = function(a, c) {
      if (this.selectedPoint = null, 1 == this.editAble) for (var e = 0; e < b.length; e++) {
        var f = this.getCtrlPosition(b[e]);
        if (a > f.left && a < f.right && c > f.top && c < f.bottom) {return this.selectedPoint = b[e],!0;}
      }
      return EditableElement.prototype.isInBound.apply(this, arguments);
    },
    this.mousedragHandler = function(a) {
      if (null == this.selectedPoint) {
        var b = this.selectedLocation.x + a.dx,
          c = this.selectedLocation.y + a.dy;
        this.setLocation(b, c),
        this.dispatchEvent('mousedrag', a);
      } else {
        if ('Top_Left' == this.selectedPoint) {
          var d = this.selectedSize.width - a.dx,
            e = this.selectedSize.height - a.dy,
            b = this.selectedLocation.x + a.dx,
            c = this.selectedLocation.y + a.dy;
          b < this.x + this.width && (this.x = b, this.width = d),
          c < this.y + this.height && (this.y = c, this.height = e);
        } else if ('Top_Center' == this.selectedPoint) {
          var e = this.selectedSize.height - a.dy,
            c = this.selectedLocation.y + a.dy;
          c < this.y + this.height && (this.y = c, this.height = e);
        } else if ('Top_Right' == this.selectedPoint) {
          var d = this.selectedSize.width + a.dx,
            c = this.selectedLocation.y + a.dy;
          c < this.y + this.height && (this.y = c, this.height = this.selectedSize.height - a.dy),
          d > 1 && (this.width = d);
        } else if ('Middle_Left' == this.selectedPoint) {
          var d = this.selectedSize.width - a.dx,
            b = this.selectedLocation.x + a.dx;
          b < this.x + this.width && (this.x = b),
          d > 1 && (this.width = d);
        } else if ('Middle_Right' == this.selectedPoint) {
          var d = this.selectedSize.width + a.dx;
          d > 1 && (this.width = d);
        } else if ('Bottom_Left' == this.selectedPoint) {
          var d = this.selectedSize.width - a.dx,
            b = this.selectedLocation.x + a.dx;
          d > 1 && (this.x = b, this.width = d);
          var e = this.selectedSize.height + a.dy;
          e > 1 && (this.height = e);
        } else if ('Bottom_Center' == this.selectedPoint) {
          var e = this.selectedSize.height + a.dy;
          e > 1 && (this.height = e);
        } else if ('Bottom_Right' == this.selectedPoint) {
          var d = this.selectedSize.width + a.dx;
          d > 1 && (this.width = d);
          var e = this.selectedSize.height + a.dy;
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
