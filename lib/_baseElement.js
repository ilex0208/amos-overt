//////////////////////////////
/**
 * 容器
 * @author ilex
 * @description 2016-11-04 11:56:12
 */
//////////////////////////////
const Element = require('./_absElement');
const Util = require('./_util');
const Tobj = require('./_tobj');
const SceneMode = Tobj.SceneMode;
const Constants = require('./constants/index');
const _default = Constants.DEFAULT;

/**
 * DisplayElement 对象
 */
function DisplayElement() {
  this.initialize = function() {
    DisplayElement.prototype.initialize.apply(this, arguments),
      this.elementType = 'displayElement',
      this.x = 0,
      this.y = 0,
      this.width = 32,
      this.height = 32,
      this.visible = true,
      this.alpha = 1,
      this.rotate = 0,
      this.scaleX = 1,
      this.scaleY = 1,
      this.strokeColor = '22,124,255',
      this.borderColor = '22,124,255',
      this.fillColor = '22,124,255',
      this.shadow = false,
      this.shadowBlur = 5,
      this.shadowColor = 'rgba(0,0,0,0.5)',
      this.shadowOffsetX = 3,
      this.shadowOffsetY = 6,
      this.transformAble = false,
      this.zIndex = 0;
    let properties = 'x,y,width,height,visible,alpha,rotate,scaleX,scaleY,strokeColor,fillColor,shadow,shadowColor,shadowOffsetX,shadowOffsetY,transformAble,zIndex'.split(',');
    this.serializedProperties = this.serializedProperties.concat(properties);
  },
    this.initialize(),
    this.paint = function(ctx) {
      ctx.beginPath(),
      ctx.fillStyle = 'rgba(' + this.fillColor + ',' + this.alpha + ')',
      ctx.rect( - this.width / 2, -this.height / 2, this.width, this.height),
      ctx.fill(),
      ctx.stroke(),
      ctx.closePath();
    },
    this.getLocation = function() {
      return {
        x: this.x,
        y: this.y
      };
    },
    this.setLocation = function(x, y) {
      return this.x = x,
      this.y = y,
      this;
    },
    this.getCenterLocation = function() {
      return {
        x: this.x + this.width / 2,
        y: this.y + this.height / 2
      };
    },
    this.setCenterLocation = function(x, y) {
      return this.x = x - this.width / 2,
      this.y = y - this.height / 2,
      this;
    },
    this.getSize = function() {
      return {
        width: this.width,
        height: this.heith
      };
    },
    this.setSize = function(width, height) {
      this.width = width,
        this.height = height;
      return this;
    },
    this.getDimension = function(){
      return {
        width: this.width,
        height: this.height
      };
    },
    /**
     * 4种取值
     *  small: 25, middle: 35, large: 50, default: 32
     * 针对node设置image以后,该值生效的前提是setImage中第二个参数为false或者不填写
     */
    this.setDimension = function(dimension){
      let _dimension = dimension || _default;
      this.setSize(_dimension, _dimension);
      return this;
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
    this.setBound = function(x, y, width, height) {
      return this.setLocation(x, y),
      this.setSize(width, height),
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
    this.getPosition = function(pos) {
      let location, bound = this.getBound();
      return 'Top_Left' == pos ? location = {
        x: bound.left,
        y: bound.top
      }: 'Top_Center' == pos ? location = {
        x: this.cx,
        y: bound.top
      }: 'Top_Right' == pos ? location = {
        x: bound.right,
        y: bound.top
      }: 'Middle_Left' == pos ? location = {
        x: bound.left,
        y: this.cy
      }: 'Middle_Center' == pos ? location = {
        x: this.cx,
        y: this.cy
      }: 'Middle_Right' == pos ? location = {
        x: bound.right,
        y: this.cy
      }: 'Bottom_Left' == pos ? location = {
        x: bound.left,
        y: bound.bottom
      }: 'Bottom_Center' == pos ? location = {
        x: this.cx,
        y: bound.bottom
      }: 'Bottom_Right' == pos && (location = {
        x: bound.right,
        y: bound.bottom
      }),
      location;
    };
}

/**
 *  交互式Element
 */
function InteractiveElement() {
  this.initialize = function() {
    InteractiveElement.prototype.initialize.apply(this, arguments),
      this.elementType = 'interactiveElement',
      this.dragable = false,
      this.selected = false,
      this.showSelected = true,
      this.selectedLocation = null,
      this.isMouseOver = false;
    let properties = 'dragable,selected,showSelected,isMouseOver'.split(',');
    this.serializedProperties = this.serializedProperties.concat(properties);
  },
    this.initialize(),
    this.paintSelected = function(ctx) {
      false != this.showSelected && (ctx.save(), ctx.beginPath(), ctx.strokeStyle = 'rgba(168,202,255, 0.9)', ctx.fillStyle = 'rgba(168,202,236,0.7)', ctx.rect( - this.width / 2 - 3, -this.height / 2 - 3, this.width + 6, this.height + 6), ctx.fill(), ctx.stroke(), ctx.closePath(), ctx.restore());
    },
    this.paintMouseover = function(ctx) {
      return this.paintSelected(ctx);
    },
    this.isInBound = function(x, y) {
      return x > this.x && x < this.x + this.width * Math.abs(this.scaleX) && y > this.y && y < this.y + this.height * Math.abs(this.scaleY);
    },
    this.selectedHandler = function() {
      this.selected = true,
      this.selectedLocation = {
        x: this.x,
        y: this.y
      };
    },
    this.unselectedHandler = function() {
      this.selected = false,
      this.selectedLocation = null;
    },
    this.dbclickHandler = function(msg) {
      this.dispatchEvent('dbclick', msg);
    },
    this.clickHandler = function(msg) {
      this.dispatchEvent('click', msg);
    },
    this.mousedownHander = function(msg) {
      this.dispatchEvent('mousedown', msg);
    },
    this.mouseupHandler = function(msg) {
      this.dispatchEvent('mouseup', msg);
    },
    this.mouseoverHandler = function(msg) {
      this.isMouseOver = true,
      this.dispatchEvent('mouseover', msg);
    },
    this.mousemoveHandler = function(msg) {
      this.dispatchEvent('mousemove', msg);
    },
    this.mouseoutHandler = function(msg) {
      this.isMouseOver = false,
      this.dispatchEvent('mouseout', msg);
    },
    this.mousedragHandler = function(msg) {
      let x = this.selectedLocation.x + msg.dx,
        y = this.selectedLocation.y + msg.dy;
      this.setLocation(x, y),
      this.dispatchEvent('mousedrag', msg);
    },
    this.addEventListener = function(topic, fn) {
      let _self = this,
        action = function(data) {
          fn.call(_self, data);
        };
      return this.messageBus || (this.messageBus = new Util.MessageBus),
      this.messageBus.subscribe(topic, action),
      this;
    },
    this.dispatchEvent = function(topic, msg) {
      return this.messageBus ? (this.messageBus.publish(topic, msg), this) : null;
    },
    this.removeEventListener = function(topic) {
      this.messageBus.unsubscribe(topic);
    },
    this.removeAllEventListener = function() {
      this.messageBus = new Util.MessageBus;
    };
  let topics = 'click,dbclick,mousedown,mouseup,mouseover,mouseout,mousemove,mousedrag,touchstart,touchmove,touchend'.split(','),
    self = this;
  topics.forEach(function(topic) {
    self[topic] = function(fn) {
      null != fn ? this.addEventListener(topic, fn) : this.dispatchEvent(topic);
    };
  });
}

/**
 * 可编辑Element
 */
function EditableElement() {
  this.initialize = function() {
    EditableElement.prototype.initialize.apply(this, arguments),
      this.editAble = false,
      this.selectedPoint = null;
  },
    this.getCtrlPosition = function(pos) {
      let $x = 5, $y = 5, $pos = this.getPosition(pos);
      return {
        left: $pos.x - $x,
        top: $pos.y - $y,
        right: $pos.x + $x,
        bottom: $pos.y + $y
      };
    },
    this.selectedHandler = function(_stage) {
      EditableElement.prototype.selectedHandler.apply(this, arguments),
      this.selectedSize = {
        width: this.width,
        height: this.height
      },
      _stage.scene.mode == SceneMode.edit && (this.editAble = true);
    },
    this.unselectedHandler = function() {
      EditableElement.prototype.unselectedHandler.apply(this, arguments),
      this.selectedSize = null,
      this.editAble = false;
    };
  let points = ['Top_Left', 'Top_Center', 'Top_Right', 'Middle_Left', 'Middle_Right', 'Bottom_Left', 'Bottom_Center', 'Bottom_Right'];
  this.paintCtrl = function(ctx) {
    if (false != this.editAble) {
      ctx.save();
      for (let i = 0; i < points.length; i++) {
        let ctrPos = this.getCtrlPosition(points[i]);
        ctrPos.left -= this.cx,
          ctrPos.right -= this.cx,
          ctrPos.top -= this.cy,
          ctrPos.bottom -= this.cy;
        let $width = ctrPos.right - ctrPos.left,
          $heith = ctrPos.bottom - ctrPos.top;
        ctx.beginPath(),
          ctx.strokeStyle = 'rgba(0,0,0,0.8)',
          ctx.rect(ctrPos.left, ctrPos.top, $width, $heith),
          ctx.stroke(),
          ctx.closePath(),
          ctx.beginPath(),
          ctx.strokeStyle = 'rgba(255,255,255,0.3)',
          ctx.rect(ctrPos.left + 1, ctrPos.top + 1, $width - 2, $heith - 2),
          ctx.stroke(),
          ctx.closePath();
      }
      ctx.restore();
    }
  },
    this.isInBound = function(_left, _top) {
      this.selectedPoint = null;
      if (this.editAble == true) {
        for (let i = 0; i < points.length; i++) {
          let $ctrPos = this.getCtrlPosition(points[i]);
          if (_left > $ctrPos.left && _left < $ctrPos.right && _top > $ctrPos.top && _top < $ctrPos.bottom) {
            return this.selectedPoint = points[i],true;
          }
        }
      }
      return EditableElement.prototype.isInBound.apply(this, arguments);
    },
    this.mousedragHandler = function(msg) {
      if (null == this.selectedPoint) {
        let x = this.selectedLocation.x + msg.dx,
          y = this.selectedLocation.y + msg.dy;
        this.setLocation(x, y),
        this.dispatchEvent('mousedrag', msg);
      } else {
        if ('Top_Left' == this.selectedPoint) {
          let tlWidth = this.selectedSize.width - msg.dx,
            tlHeight = this.selectedSize.height - msg.dy,
            tlX = this.selectedLocation.x + msg.dx,
            tlY = this.selectedLocation.y + msg.dy;
          tlX < this.x + this.width && (this.x = tlX, this.width = tlWidth),
          tlY < this.y + this.height && (this.y = tlY, this.height = tlHeight);
        } else if ('Top_Center' == this.selectedPoint) {
          let tcHeight = this.selectedSize.height - msg.dy,
            tcY = this.selectedLocation.y + msg.dy;
          tcY < this.y + this.height && (this.y = tcY, this.height = tcHeight);
        } else if ('Top_Right' == this.selectedPoint) {
          let trWidth = this.selectedSize.width + msg.dx,
            trY = this.selectedLocation.y + msg.dy;
          trY < this.y + this.height && (this.y = trY, this.height = this.selectedSize.height - msg.dy),
          trWidth > 1 && (this.width = trWidth);
        } else if ('Middle_Left' == this.selectedPoint) {
          let mlWidth = this.selectedSize.width - msg.dx,
            mlX = this.selectedLocation.x + msg.dx;
          mlX < this.x + this.width && (this.x = mlX),
          mlWidth > 1 && (this.width = mlWidth);
        } else if ('Middle_Right' == this.selectedPoint) {
          let mrWidth = this.selectedSize.width + msg.dx;
          mrWidth > 1 && (this.width = mrWidth);
        } else if ('Bottom_Left' == this.selectedPoint) {
          let blWidth = this.selectedSize.width - msg.dx,
            blX = this.selectedLocation.x + msg.dx;
          blWidth > 1 && (this.x = blX, this.width = blWidth);
          let blHeight = this.selectedSize.height + msg.dy;
          blHeight > 1 && (this.height = blHeight);
        } else if ('Bottom_Center' == this.selectedPoint) {
          let bcHeight = this.selectedSize.height + msg.dy;
          bcHeight > 1 && (this.height = bcHeight);
        } else if ('Bottom_Right' == this.selectedPoint) {
          let brWidth = this.selectedSize.width + msg.dx;
          brWidth > 1 && (this.width = brWidth);
          let brHeight = this.selectedSize.height + msg.dy;
          brHeight > 1 && (this.height = brHeight);
        }
        this.dispatchEvent('resize', msg);
      }
    };
}
DisplayElement.prototype = new Element;
Object.defineProperties(DisplayElement.prototype, {
  cx: {
    get: function() {
      return this.x + this.width / 2;
    },
    set: function(value) {
      this.x = value - this.width / 2;
    }
  },
  cy: {
    get: function() {
      return this.y + this.height / 2;
    },
    set: function(value) {
      this.y = value - this.height / 2;
    }
  }
});

InteractiveElement.prototype = new DisplayElement;
EditableElement.prototype = new InteractiveElement;

// 单独挂在 t 上
module.exports = {
  DisplayElement: DisplayElement,
  InteractiveElement: InteractiveElement,
  EditableElement: EditableElement
};
