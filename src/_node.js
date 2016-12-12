//////////////////////////////
/**
 * node
 * @author ilex
 * @description 2016-12-01 11:56:12
 */
//////////////////////////////

const Tobj = require('./_tobj');
const _e = require('./_baseElement');
const Util = require('./_util');
// 获取可编辑element
const EditableElement = _e.EditableElement;
/**
 * 抽象node,基类
 *
 * @param {any} nodeText
 */
function AbstractNode(nodeText) {
  this.initialize = function(text) {
    AbstractNode.prototype.initialize.apply(this, arguments),
      this.elementType = 'node',
      this.zIndex = Tobj.zIndex_Node,
      this.text = text,
      this.font = '12px Consolas',
      this.fontColor = '255,255,255',
      this.borderWidth = 0,
      this.borderColor = '255,255,255',
      this.borderRadius = null,
      this.dragable = true,
      this.textPosition = 'Bottom_Center',
      this.textOffsetX = 0,
      this.textOffsetY = 0,
      this.transformAble = true,
      this.inLinks = null,
      this.outLinks = null;
    let properties = 'text,font,fontColor,textPosition,textOffsetX,textOffsetY,borderRadius'.split(',');
    this.serializedProperties = this.serializedProperties.concat(properties);
  },
  this.initialize(nodeText),
  this.paint = function(ctx) {
    if (this.image) {
      let $globalAlpha = ctx.globalAlpha;
      ctx.globalAlpha = this.alpha;
      if(null != this.alarmImage && null != this.alarm){
        ctx.drawImage(this.alarmImage, -this.width / 2, -this.height / 2, this.width, this.height);
      }else{
        ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
      }
      // null != this.alarmImage && null != this.alarm ? ctx.drawImage(this.alarmImage, -this.width / 2, -this.height / 2, this.width, this.height) : ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
      ctx.globalAlpha = $globalAlpha;
    } else {
      ctx.beginPath();
      ctx.fillStyle = 'rgba(' + this.fillColor + ',' + this.alpha + ')';
      if(null == this.borderRadius || 0 == this.borderRadius){
        ctx.rect(- this.width / 2, -this.height / 2, this.width, this.height);
      }else{
        ctx.AmostRoundRect(- this.width / 2, -this.height / 2, this.width, this.height, this.borderRadius);
      }
      // null == this.borderRadius || 0 == this.borderRadius ? ctx.rect(- this.width / 2, -this.height / 2, this.width, this.height) : ctx.AmostRoundRect(- this.width / 2, -this.height / 2, this.width, this.height, this.borderRadius);
      ctx.fill();
      ctx.closePath();
    }
    this.paintText(ctx);
    this.paintBorder(ctx);
    this.paintCtrl(ctx);
    this.paintAlarmText(ctx);
  },
  this.paintAlarmText = function(ctx) {
    if (null != this.alarm && '' != this.alarm) {
      let tempAlarmColor = this.alarmColor || '255,0,0',
        tempAlarmAlpha = this.alarmAlpha || 0.5;
      ctx.beginPath(),
        ctx.font = this.alarmFont || '10px 微软雅黑';
      let alarmW = ctx.measureText(this.alarm).width + 6,
        defaultW = ctx.measureText('田').width + 6,
        $x = this.width / 2 - alarmW / 2,
        $y = -this.height / 2 - defaultW - 8;
      ctx.strokeStyle = 'rgba(' + tempAlarmColor + ', ' + tempAlarmAlpha + ')',
        ctx.fillStyle = 'rgba(' + tempAlarmColor + ', ' + tempAlarmAlpha + ')',
        ctx.lineCap = 'round',
        ctx.lineWidth = 1,
        ctx.moveTo($x, $y),
        ctx.lineTo($x + alarmW, $y),
        ctx.lineTo($x + alarmW, $y + defaultW),
        ctx.lineTo($x + alarmW / 2 + 6, $y + defaultW),
        ctx.lineTo($x + alarmW / 2, $y + defaultW + 8),
        ctx.lineTo($x + alarmW / 2 - 6, $y + defaultW),
        ctx.lineTo($x, $y + defaultW),
        ctx.lineTo($x, $y),
        ctx.fill(),
        ctx.stroke(),
        ctx.closePath(),
        ctx.beginPath(),
        ctx.strokeStyle = 'rgba(' + this.fontColor + ', ' + this.alpha + ')',
        ctx.fillStyle = 'rgba(' + this.fontColor + ', ' + this.alpha + ')',
        ctx.fillText(this.alarm, $x + 2, $y + defaultW - 4),
        ctx.closePath();
    }
  },
  this.paintText = function(ctx) {
    let tempText = this.text;
    if (null != tempText && '' != tempText) {
      ctx.beginPath(),
        ctx.font = this.font;
      let tempTextW = ctx.measureText(tempText).width,
        defaultW = ctx.measureText('田').width;
      ctx.fillStyle = 'rgba(' + this.fontColor + ', ' + this.alpha + ')';
      let textPos = this.getTextPostion(this.textPosition, tempTextW, defaultW);
      ctx.fillText(tempText, textPos.x, textPos.y),
        ctx.closePath();
    }
  },
  this.paintBorder = function(ctx) {
    if (0 != this.borderWidth) {
      ctx.beginPath(),
        ctx.lineWidth = this.borderWidth,
        ctx.strokeStyle = 'rgba(' + this.borderColor + ',' + this.alpha + ')';
      let bW = this.borderWidth / 2;
      null == this.borderRadius || 0 == this.borderRadius ? ctx.rect(- this.width / 2 - bW, -this.height / 2 - bW, this.width + this.borderWidth, this.height + this.borderWidth) : ctx.AmostRoundRect(- this.width / 2 - bW, -this.height / 2 - bW, this.width + this.borderWidth, this.height + this.borderWidth, this.borderRadius),
        ctx.stroke(),
        ctx.closePath();
    }
  },
  this.getTextPostion = function(posType, _w, _h) {
    let posResult = null;
    return null == posType || 'Bottom_Center' == posType ? posResult = {
      x: -this.width / 2 + (this.width - _w) / 2,
      y: this.height / 2 + _h
    } : 'Top_Center' == posType ? posResult = {
      x: -this.width / 2 + (this.width - _w) / 2,
      y: -this.height / 2 - _h / 2
    } : 'Top_Right' == posType ? posResult = {
      x: this.width / 2,
      y: -this.height / 2 - _h / 2
    } : 'Top_Left' == posType ? posResult = {
      x: -this.width / 2 - _w,
      y: -this.height / 2 - _h / 2
    } : 'Bottom_Right' == posType ? posResult = {
      x: this.width / 2,
      y: this.height / 2 + _h
    } : 'Bottom_Left' == posType ? posResult = {
      x: -this.width / 2 - _w,
      y: this.height / 2 + _h
    } : 'Middle_Center' == posType ? posResult = {
      x: -this.width / 2 + (this.width - _w) / 2,
      y: _h / 2
    } : 'Middle_Right' == posType ? posResult = {
      x: this.width / 2,
      y: _h / 2
    } : 'Middle_Left' == posType && (posResult = {
      x: -this.width / 2 - _w,
      y: _h / 2
    }),
      null != this.textOffsetX && (posResult.x += this.textOffsetX),
      null != this.textOffsetY && (posResult.y += this.textOffsetY),
      posResult;
  },
  /**
   * node节点设置image
   * @param {any} img 可以是image路径,也可以是Image对象
   * @param {boolean} isSelfSize 是否是image自身大小
   */
    this.setImage = function(img, isSelfSize) {
      if (null == img) {throw new Error('Node.setImage(): 参数Image对象为空!');}
      var _tempSelf = this;
      if ('string' == typeof img) {
        var image = imageCache[img];
        null == image ? (
          image = new Image, image.src = img, image.onload = function() {
            imageCache[img] = image,
            true === isSelfSize && _tempSelf.setSize(image.width, image.height),
            _tempSelf.image = image,
            _tempSelf.alarmColor = null == _tempSelf.alarmColor ? '255,0,0': _tempSelf.alarmColor;
          }
        ) : (
          isSelfSize && this.setSize(image.width, image.height),
          _tempSelf.image = image,
          _tempSelf.alarmColor = null == _tempSelf.alarmColor ? '255,0,0': _tempSelf.alarmColor
        );
      } else {
        this.image = img,
          _tempSelf.alarmColor = null == _tempSelf.alarmColor ? '255,0,0': _tempSelf.alarmColor,
          true === isSelfSize && this.setSize(img.width, img.height);
      }
    },
    /**
   * node节点设置image
   * @param {any} img 可以是image路径,也可以是Image对象
   * @param {boolean} isSelfSize 是否是image自身大小
   * @param {Object} alarmImgOps 自定义告警属性
   */
  this.setImageByOpts = function(img, isSelfSize, alarmImgOps) {
    if (null == img) {throw new Error('Node.setImage(): 参数Image对象为空!');}
    let _tempSelf = this;
    if ('string' == typeof img) {
      let image = imageCache[img];
      null == image ? (image = new Image, image.src = img, image.onload = function() {
        imageCache[img] = image,
          true === isSelfSize && _tempSelf.setSize(image.width, image.height);
        let alarmImg = Util.genImageAlarmByOpts(image, alarmImgOps);
        alarmImg && (image.alarm = alarmImg),
          _tempSelf.image = image;
      }) : (isSelfSize && this.setSize(image.width, image.height), this.image = image);
    } else {
      this.image = img,
      true === isSelfSize && this.setSize(img.width, img.height);
    }
  },
  this.removeHandler = function($scene) {
    let _tempSelf = this;
    this.outLinks && (this.outLinks.forEach(function(oLink) {
      oLink.nodeA === _tempSelf && $scene.remove(oLink);
    }), this.outLinks = null),
      this.inLinks && (this.inLinks.forEach(function(iLink) {
        iLink.nodeZ === _tempSelf && $scene.remove(iLink);
      }), this.inLinks = null);
  };
}

/**
 * 普通node
 */
function Node() {
  Node.prototype.initialize.apply(this, arguments);
}

/**
 *带text node
 *
 * @param {any} a
 */
function TextNode(text) {
  this.initialize(),
    this.text = text,
    this.elementType = 'TextNode',
    this.paint = function(ctx) {
      ctx.beginPath(),
        ctx.font = this.font,
        this.width = ctx.measureText(this.text).width,
        this.height = ctx.measureText('田').width,
        ctx.strokeStyle = 'rgba(' + this.fontColor + ', ' + this.alpha + ')',
        ctx.fillStyle = 'rgba(' + this.fontColor + ', ' + this.alpha + ')',
        ctx.fillText(this.text, -this.width / 2, this.height / 2),
        ctx.closePath(),
        this.paintBorder(ctx),
        this.paintCtrl(ctx),
        this.paintAlarmText(ctx);
    };
}

/**
 * 带超链接的node
 *
 * @param {any} text 显示文本
 * @param {any} href 超链接
 * @param {any} tar a标签的target属性  _blank || _parent || _self || _top
 */
function LinkNode(text, href, tar) {
  this.initialize(),
  this.text = text,
  this.href = href,
  this.target = tar,
  this.elementType = 'LinkNode',
  this.isVisited = false,
  this.visitedColor = null,
  this.paint = function(ctx) {
    ctx.beginPath(),
      ctx.font = this.font,
      this.width = ctx.measureText(this.text).width,
      this.height = ctx.measureText('田').width;
    if(this.isVisited && null != this.visitedColor){
      ctx.strokeStyle = 'rgba(' + this.visitedColor + ', ' + this.alpha + ')';
      ctx.fillStyle = 'rgba(' + this.visitedColor + ', ' + this.alpha + ')';
    }else{
      ctx.strokeStyle = 'rgba(' + this.fontColor + ', ' + this.alpha + ')';
      ctx.fillStyle = 'rgba(' + this.fontColor + ', ' + this.alpha + ')';
    }
    ctx.fillText(this.text, -this.width / 2, this.height / 2);
    if(this.isMouseOver){
      ctx.moveTo(- this.width / 2, this.height);
      ctx.lineTo(this.width / 2, this.height);
      ctx.stroke();
    }
    ctx.closePath(),
      this.paintBorder(ctx),
      this.paintCtrl(ctx),
      this.paintAlarmText(ctx);
  },
  this.mousemove(function() {
    let cav = document.getElementsByTagName('canvas');
    if (cav && cav.length > 0) {
      for (let i = 0; i < cav.length; i++) {
        cav[i].style.cursor = 'pointer';
      }
    }
  }),
  this.mouseout(function() {
    let cav = document.getElementsByTagName('canvas');
    if (cav && cav.length > 0) {
      for (let i = 0; i < cav.length; i++) {
        cav[i].style.cursor = 'default';
      }
    }
  }),
  this.click(function() {
    '_blank' == this.target ? window.open(this.href) : location = this.href,
      this.isVisited = true;
  });
}

/**
 * 圆形node
 *
 * @param {any} text
 */
function CircleNode(text) {
  this.initialize(arguments),
  this._radius = 20,
  this.beginDegree = 0,
  this.endDegree = 2 * Math.PI,
  this.text = text,
  this.paint = function(ctx) {
    ctx.save(),
      ctx.beginPath(),
      ctx.fillStyle = 'rgba(' + this.fillColor + ',' + this.alpha + ')',
      ctx.arc(0, 0, this.radius, this.beginDegree, this.endDegree, true),
      ctx.fill(),
      ctx.closePath(),
      ctx.restore(),
      this.paintText(ctx),
      this.paintBorder(ctx),
      this.paintCtrl(ctx),
      this.paintAlarmText(ctx);
  },
  this.paintSelected = function(ctx) {
    ctx.save(),
      ctx.beginPath(),
      ctx.strokeStyle = 'rgba(168,202,255, 0.9)',
      ctx.fillStyle = 'rgba(168,202,236,0.7)',
      ctx.arc(0, 0, this.radius + 3, this.beginDegree, this.endDegree, true),
      ctx.fill(),
      ctx.stroke(),
      ctx.closePath(),
      ctx.restore();
  };
}

/**
 * 创建默认动画node
 *
 * @param {any} imgs img集合
 * @param {any} delay 执行间隔时间
 * @param {any} isImageSize
 */
function DefaultAnimateNode(imgs, delay, isImageSize) {
  this.initialize(),
    this.frameImages = imgs || [],
    this.frameIndex = 0,
    this.isStop = true;
  let millsec = delay || 1000;
  this.repeatPlay = false;
  let _self = this;
  this.nextFrame = function() {
    if (!this.isStop && null != this.frameImages.length) {
      if (this.frameIndex++ , this.frameIndex >= this.frameImages.length) {
        if (!this.repeatPlay) {return;}
        this.frameIndex = 0;
      }
      this.setImage(this.frameImages[this.frameIndex], isImageSize),
        setTimeout(function() {
          _self.nextFrame();
        },
          millsec / imgs.length);
    }
  };
}

/**
 * 用户自定义动画node
 *
 * @param {any} imgSrc
 * @param {any} row 行
 * @param {any} c 列
 * @param {any} d
 * @param {any} offset 行偏移量
 */
function CustomAnimateNode(imgSrc, row, column, delay, offset) {
  this.initialize();
  let _self = this;
  this.setImage(imgSrc),
    this.frameIndex = 0,
    this.isPause = true,
    this.repeatPlay = false;
  let millsec = delay || 1000;
  offset = offset || 0,
    this.paint = function(ctx) {
      if (this.image) {
        let swidth = this.width, // 被剪切图像的宽度
          sheight = this.height; // 被剪切图像的高度
        ctx.save(),
          ctx.beginPath(),
          ctx.fillStyle = 'rgba(' + this.fillColor + ',' + this.alpha + ')';
        let sy = (Math.floor(this.frameIndex / column) + offset) * sheight, // 开始剪切的 y 坐标位置
          sx = Math.floor(this.frameIndex % column) * swidth;// 开始剪切的 x 坐标位置
        ctx.drawImage(this.image, sx, sy, swidth, sheight, -swidth / 2, -sheight / 2, swidth, sheight),
          ctx.fill(),
          ctx.closePath(),
          ctx.restore(),
          this.paintText(ctx),
          this.paintBorder(ctx),
          this.paintCtrl(ctx),
          this.paintAlarmText(ctx);
      }
    },
    this.nextFrame = function() {
      if (!this.isStop) {
        if (this.frameIndex++ , this.frameIndex >= row * column) {
          if (!this.repeatPlay) {return;}
          this.frameIndex = 0;
        }
        setTimeout(function() {
          _self.isStop || _self.nextFrame();
        },
          millsec / (row * column));
      }
    };
}

/**
 * AnimateNode
 *
 * @returns
 */
function AnimateNode() {
  let _anode = null;
  return _anode = arguments.length <= 3 ? new DefaultAnimateNode(arguments[0], arguments[1], arguments[2]) : new CustomAnimateNode(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]),
    _anode.stop = function() {
      _anode.isStop = true;
    },
    _anode.play = function() {
      _anode.isStop = false,
        _anode.frameIndex = 0,
        _anode.nextFrame();
    },
    _anode;
}

let imageCache = {};

AbstractNode.prototype = new EditableElement,
  Node.prototype = new AbstractNode,
  Object.defineProperties(Node.prototype, {
    alarmColor: {
      get: function() {
        return this._alarmColor;
      },
      set: function(ac) {
        this._alarmColor = ac;
        if (null != this.image) {
          var alarmImg = Util.generateImageAlarm(this.image, ac);
          alarmImg && (this.alarmImage = alarmImg);
        }
      }
    }
  }),
  TextNode.prototype = new Node,
  LinkNode.prototype = new TextNode,
  CircleNode.prototype = new Node;

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
});

DefaultAnimateNode.prototype = new Node,
CustomAnimateNode.prototype = new Node,
AnimateNode.prototype = new Node;

// 单独导出
module.exports = {
  Node: Node,
  TextNode: TextNode,
  LinkNode: LinkNode,
  CircleNode: CircleNode,
  AnimateNode: AnimateNode
};
