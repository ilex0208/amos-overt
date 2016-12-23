const List = require('./../core/_list');
const math = require('./../core/_math');
const Tnode = require('./_tNode');
const Group = require('./_tGroup');
const Tlink = require('./_tLink');

const Extends = require('./../core/_ext');

let Tlayout = {};

Tlayout.AutoLayouter = function(a) {
  this._box = a;

  // ext

  this._expandGroup = !1,
  this._repulsion = 1,
  this._type = null,
  this._animate = !0,
  this._explicitXOffset = Number.NaN,
  this._explicitYOffset = Number.NaN,
  this._xOffset = 0,
  this._yOffset = 0,
  this.isExpandGroup = function() {
    return this._expandGroup;
  },
  this.setExpandGroup = function(a) {
    this._expandGroup = a;
  },
  this.getRepulsion = function() {
    return this._repulsion;
  },
  this.setRepulsion = function(a) {
    this._repulsion = a;
  },
  this.getType = function() {
    return this._type;
  },
  this.isAnimate = function() {
    return this._animate;
  },
  this.setAnimate = function(a) {
    this._animate = a;
  },
  this.getElementBox = function() {
    return this._box;
  },
  this.getExplicitXOffset = function() {
    return this._explicitXOffset;
  },
  this.setExplicitXOffset = function(a) {
    this._explicitXOffset = a;
  },
  this.getExplicitYOffset = function() {
    return this._explicitYOffset;
  },
  this.setExplicitYOffset = function(a) {
    this._explicitYOffset = a;
  },
  this.getDimension = function(a) {
    if (a instanceof Group && a.getChildrenSize() > 0) {
      var b = null;
      for (var c = 0,
        d = a.getChildrenSize(); c < d; c++) {
        var e = a.getChildAt(c);
        e instanceof Tnode && (b ? b = math.unionRect(b, e.getRect()) : b = e.getRect());
      }
      return b ? {
        width: b.width,
        height: b.height
      } : null;
    }
    return {
      width: a.getWidth(),
      height: a.getHeight()
    };
  },
  this.isVisible = function(a) {
    return !0;
  },
  this.isMovable = function(a) {
    return !0;
  },
  this.getGroupLayoutType = function(a) {
    return this._type;
  },
  this.getElements = function() {
    var a, b = this._box,
      d = b.getSelectionModel().size() > 1;
    d ? a = b.getSelectionModel().getSelection() : (a = new List, b.forEachByBreadthFirst(a.add, null, a)),
      this._xOffset = -1,
      this._yOffset = -1;
    var e = new List;
    for (var f = 0,
      g = a.size(); f < g; f++) {
      var h = a.get(f);
      if (this.isVisible(h)) {if (h instanceof Tlink) {e.add(h);}
        else if (this.isMovable(h) && h instanceof Tnode) {
          e.add(h);
          if (d) {
            if (this._xOffset < 0 || h.getX() < this._xOffset) {this._xOffset = h.getX();}
            if (this._yOffset < 0 || h.getY() < this._yOffset) {this._yOffset = h.getY();}
          }
        }}
    }
    return d || (isNaN(this._explicitXOffset) ? this._xOffset = 50 / this._repulsion : this._xOffset = this._explicitXOffset, isNaN(this._explicitYOffset) ? this._yOffset = 50 / this._repulsion : this._yOffset = this._explicitYOffset),
      e;
  },
  this.getLayoutResult = function(a) {
    var b = {};
    return this.doLayoutImpl(a, null, b),
      b;
  },
  this.doLayout = function(a, b) {
    //return this.doLayoutImpl(a, b);
  };
};

Extends('third.Tlayout.AutoLayouter', Object, Tlayout.AutoLayouter);
//Tlayout.AutoLayouter.prototype = new Object;
Tlayout.AutoLayouter.prototype.getClassName = function(){
  return 'third.Tlayout.AutoLayouter';
};

module.exports = Tlayout;
