const Tobj = require('./_tobj');
const eleExt = require('./_eleExt');
const Util = require('./_util');

function b(c) {
  this.initialize = function(c) {
    b.prototype.initialize.apply(this, arguments),
      this.elementType = 'node',
      this.zIndex = Tobj.zIndex_Node,
      this.text = c,
      this.font = '12px Consolas',
      this.fontColor = '255,255,255',
      this.borderWidth = 0,
      this.borderColor = '255,255,255',
      this.borderRadius = null,
      this.dragable = !0,
      this.textPosition = 'Bottom_Center',
      this.textOffsetX = 0,
      this.textOffsetY = 0,
      this.transformAble = !0,
      this.inLinks = null,
      this.outLinks = null;
    let d = 'text,font,fontColor,textPosition,textOffsetX,textOffsetY,borderRadius'.split(',');
    this.serializedProperties = this.serializedProperties.concat(d);
  },
    this.initialize(c),
    this.paint = function(a) {
      if (this.image) {
        let b = a.globalAlpha;
        a.globalAlpha = this.alpha,
          null != this.image.alarm && null != this.alarm ? a.drawImage(this.image.alarm, -this.width / 2, -this.height / 2, this.width, this.height) : a.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height),
          a.globalAlpha = b;
      } else {a.beginPath(),
        a.fillStyle = 'rgba(' + this.fillColor + ',' + this.alpha + ')',
        null == this.borderRadius || 0 == this.borderRadius ? a.rect(- this.width / 2, -this.height / 2, this.width, this.height) : a.JTopoRoundRect(- this.width / 2, -this.height / 2, this.width, this.height, this.borderRadius),
        a.fill(),
        a.closePath();}
      this.paintText(a),
        this.paintBorder(a),
        this.paintCtrl(a),
        this.paintAlarmText(a);
    },
    this.paintAlarmText = function(a) {
      if (null != this.alarm && '' != this.alarm) {
        let b = this.alarmColor || '255,0,0',
          c = this.alarmAlpha || .5;
        a.beginPath(),
          a.font = this.alarmFont || '10px 微软雅黑';
        let d = a.measureText(this.alarm).width + 6,
          e = a.measureText('田').width + 6,
          f = this.width / 2 - d / 2,
          g = -this.height / 2 - e - 8;
        a.strokeStyle = 'rgba(' + b + ', ' + c + ')',
          a.fillStyle = 'rgba(' + b + ', ' + c + ')',
          a.lineCap = 'round',
          a.lineWidth = 1,
          a.moveTo(f, g),
          a.lineTo(f + d, g),
          a.lineTo(f + d, g + e),
          a.lineTo(f + d / 2 + 6, g + e),
          a.lineTo(f + d / 2, g + e + 8),
          a.lineTo(f + d / 2 - 6, g + e),
          a.lineTo(f, g + e),
          a.lineTo(f, g),
          a.fill(),
          a.stroke(),
          a.closePath(),
          a.beginPath(),
          a.strokeStyle = 'rgba(' + this.fontColor + ', ' + this.alpha + ')',
          a.fillStyle = 'rgba(' + this.fontColor + ', ' + this.alpha + ')',
          a.fillText(this.alarm, f + 2, g + e - 4),
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
    this.paintBorder = function(a) {
      if (0 != this.borderWidth) {
        a.beginPath(),
          a.lineWidth = this.borderWidth,
          a.strokeStyle = 'rgba(' + this.borderColor + ',' + this.alpha + ')';
        let b = this.borderWidth / 2;
        null == this.borderRadius || 0 == this.borderRadius ? a.rect(- this.width / 2 - b, -this.height / 2 - b, this.width + this.borderWidth, this.height + this.borderWidth) : a.JTopoRoundRect(- this.width / 2 - b, -this.height / 2 - b, this.width + this.borderWidth, this.height + this.borderWidth, this.borderRadius),
          a.stroke(),
          a.closePath();
      }
    },
    this.getTextPostion = function(a, b, c) {
      let d = null;
      return null == a || 'Bottom_Center' == a ? d = {
        x: -this.width / 2 + (this.width - b) / 2,
        y: this.height / 2 + c
      } : 'Top_Center' == a ? d = {
        x: -this.width / 2 + (this.width - b) / 2,
        y: -this.height / 2 - c / 2
      } : 'Top_Right' == a ? d = {
        x: this.width / 2,
        y: -this.height / 2 - c / 2
      } : 'Top_Left' == a ? d = {
        x: -this.width / 2 - b,
        y: -this.height / 2 - c / 2
      } : 'Bottom_Right' == a ? d = {
        x: this.width / 2,
        y: this.height / 2 + c
      } : 'Bottom_Left' == a ? d = {
        x: -this.width / 2 - b,
        y: this.height / 2 + c
      } : 'Middle_Center' == a ? d = {
        x: -this.width / 2 + (this.width - b) / 2,
        y: c / 2
      } : 'Middle_Right' == a ? d = {
        x: this.width / 2,
        y: c / 2
      } : 'Middle_Left' == a && (d = {
        x: -this.width / 2 - b,
        y: c / 2
      }),
        null != this.textOffsetX && (d.x += this.textOffsetX),
        null != this.textOffsetY && (d.y += this.textOffsetY),
        d;
    },
    this.setImage = function(b, c) {
      if (null == b) {throw new Error('Node.setImage(): 参数Image对象为空!');}
      let d = this;
      if ('string' == typeof b) {
        let e = j[b];
        null == e ? (e = new Image, e.src = b, e.onload = function() {
          j[b] = e,
            1 == c && d.setSize(e.width, e.height);
          let f = Util.genImageAlarm(e);
          f && (e.alarm = f),
            d.image = e;
        }) : (c && this.setSize(e.width, e.height), this.image = e);
      } else {this.image = b,
        1 == c && this.setSize(b.width, b.height);}
    },
    this.removeHandler = function(a) {
      let b = this;
      this.outLinks && (this.outLinks.forEach(function(c) {
        c.nodeA === b && a.remove(c);
      }), this.outLinks = null),
        this.inLinks && (this.inLinks.forEach(function(c) {
          c.nodeZ === b && a.remove(c);
        }), this.inLinks = null);
    };
}
function Node() {
  Node.prototype.initialize.apply(this, arguments);
}
function TextNode(a) {
  this.initialize(),
    this.text = a,
    this.elementType = 'TextNode',
    this.paint = function(a) {
      a.beginPath(),
        a.font = this.font,
        this.width = a.measureText(this.text).width,
        this.height = a.measureText('田').width,
        a.strokeStyle = 'rgba(' + this.fontColor + ', ' + this.alpha + ')',
        a.fillStyle = 'rgba(' + this.fontColor + ', ' + this.alpha + ')',
        a.fillText(this.text, -this.width / 2, this.height / 2),
        a.closePath(),
        this.paintBorder(a),
        this.paintCtrl(a),
        this.paintAlarmText(a);
    };
}
function LinkNode(a, b, c) {
  this.initialize(),
    this.text = a,
    this.href = b,
    this.target = c,
    this.elementType = 'LinkNode',
    this.isVisited = !1,
    this.visitedColor = null,
    this.paint = function(a) {
      a.beginPath(),
        a.font = this.font,
        this.width = a.measureText(this.text).width,
        this.height = a.measureText('田').width,
        this.isVisited && null != this.visitedColor ? (a.strokeStyle = 'rgba(' + this.visitedColor + ', ' + this.alpha + ')', a.fillStyle = 'rgba(' + this.visitedColor + ', ' + this.alpha + ')') : (a.strokeStyle = 'rgba(' + this.fontColor + ', ' + this.alpha + ')', a.fillStyle = 'rgba(' + this.fontColor + ', ' + this.alpha + ')'),
        a.fillText(this.text, -this.width / 2, this.height / 2),
        this.isMouseOver && (a.moveTo(- this.width / 2, this.height), a.lineTo(this.width / 2, this.height), a.stroke()),
        a.closePath(),
        this.paintBorder(a),
        this.paintCtrl(a),
        this.paintAlarmText(a);
    },
    this.mousemove(function() {
      let a = document.getElementsByTagName('canvas');
      if (a && a.length > 0) {for (let b = 0; b < a.length; b++) {a[b].style.cursor = 'pointer';}}
    }),
    this.mouseout(function() {
      let a = document.getElementsByTagName('canvas');
      if (a && a.length > 0) {for (let b = 0; b < a.length; b++) {a[b].style.cursor = 'default';}}
    }),
    this.click(function() {
      '_blank' == this.target ? window.open(this.href) : location = this.href,
        this.isVisited = !0;
    });
}
function CircleNode(a) {
  this.initialize(arguments),
    this._radius = 20,
    this.beginDegree = 0,
    this.endDegree = 2 * Math.PI,
    this.text = a,
    this.paint = function(a) {
      a.save(),
        a.beginPath(),
        a.fillStyle = 'rgba(' + this.fillColor + ',' + this.alpha + ')',
        a.arc(0, 0, this.radius, this.beginDegree, this.endDegree, !0),
        a.fill(),
        a.closePath(),
        a.restore(),
        this.paintText(a),
        this.paintBorder(a),
        this.paintCtrl(a),
        this.paintAlarmText(a);
    },
    this.paintSelected = function(a) {
      a.save(),
        a.beginPath(),
        a.strokeStyle = 'rgba(168,202,255, 0.9)',
        a.fillStyle = 'rgba(168,202,236,0.7)',
        a.arc(0, 0, this.radius + 3, this.beginDegree, this.endDegree, !0),
        a.fill(),
        a.stroke(),
        a.closePath(),
        a.restore();
    };
}
function g(a, b, c) {
  this.initialize(),
    this.frameImages = a || [],
    this.frameIndex = 0,
    this.isStop = !0;
  let d = b || 1e3;
  this.repeatPlay = !1;
  let e = this;
  this.nextFrame = function() {
    if (!this.isStop && null != this.frameImages.length) {
      if (this.frameIndex++ , this.frameIndex >= this.frameImages.length) {
        if (!this.repeatPlay) {return;}
        this.frameIndex = 0;
      }
      this.setImage(this.frameImages[this.frameIndex], c),
        setTimeout(function() {
          e.nextFrame();
        },
          d / a.length);
    }
  };
}
function h(a, b, c, d, e) {
  this.initialize();
  let f = this;
  this.setImage(a),
    this.frameIndex = 0,
    this.isPause = !0,
    this.repeatPlay = !1;
  let g = d || 1e3;
  e = e || 0,
    this.paint = function(a) {
      if (this.image) {
        let b = this.width,
          d = this.height;
        a.save(),
          a.beginPath(),
          a.fillStyle = 'rgba(' + this.fillColor + ',' + this.alpha + ')';
        let f = (Math.floor(this.frameIndex / c) + e) * d,
          g = Math.floor(this.frameIndex % c) * b;
        a.drawImage(this.image, g, f, b, d, -b / 2, -d / 2, b, d),
          a.fill(),
          a.closePath(),
          a.restore(),
          this.paintText(a),
          this.paintBorder(a),
          this.paintCtrl(a),
          this.paintAlarmText(a);
      }
    },
    this.nextFrame = function() {
      if (!this.isStop) {
        if (this.frameIndex++ , this.frameIndex >= b * c) {
          if (!this.repeatPlay) {return;}
          this.frameIndex = 0;
        }
        setTimeout(function() {
          f.isStop || f.nextFrame();
        },
          g / (b * c));
      }
    };
}
function AnimateNode() {
  let a = null;
  return a = arguments.length <= 3 ? new g(arguments[0], arguments[1], arguments[2]) : new h(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]),
    a.stop = function() {
      a.isStop = !0;
    },
    a.play = function() {
      a.isStop = !1,
        a.frameIndex = 0,
        a.nextFrame();
    },
    a;
}
let j = {};
b.prototype = new eleExt.EditableElement,
  Node.prototype = new b,
  TextNode.prototype = new Node,
  LinkNode.prototype = new TextNode,
  CircleNode.prototype = new Node,
  Object.defineProperties(CircleNode.prototype, {
    radius: {
      get: function() {
        return this._radius;
      },
      set: function(a) {
        this._radius = a;
        let b = 2 * this.radius,
          c = 2 * this.radius;
        this.width = b,
          this.height = c;
      }
    },
    width: {
      get: function() {
        return this._width;
      },
      set: function(a) {
        this._radius = a / 2,
          this._width = a;
      }
    },
    height: {
      get: function() {
        return this._height;
      },
      set: function(a) {
        this._radius = a / 2,
          this._height = a;
      }
    }
  }),
  g.prototype = new Node,
  h.prototype = new Node,
  AnimateNode.prototype = new Node,

// g.prototype = new c,
// h.prototype = new c,
// i.prototype = new c,
// a.Node = c,
// a.TextNode = d,
// a.LinkNode = e,
// a.CircleNode = f,
// a.AnimateNode = i

// 单独导出
module.exports = {
  Node: Node,
  TextNode: TextNode,
  LinkNode: LinkNode,
  CircleNode: CircleNode,
  AnimateNode: AnimateNode
};
