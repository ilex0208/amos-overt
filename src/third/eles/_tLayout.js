const List = require('./../core/_list');
const _third = require('./../core/_third')._third;
const math = require('./../core/_math');
const Tnode = require('./_tNode');
const Group = require('./_tGroup');
const Tlink = require('./_tLink').Tlink;

let Tlayout = {};

Tlayout.AutoLayouter = function(a) {
  this._box = a;
};
_third.ext('third.layout.AutoLayouter', Object, {
  _expandGroup: !1,
  _repulsion: 1,
  _type: null,
  _animate: !0,
  _explicitXOffset: Number.NaN,
  _explicitYOffset: Number.NaN,
  _xOffset: 0,
  _yOffset: 0,
  isExpandGroup: function() {
    return this._expandGroup;
  },
  setExpandGroup: function(a) {
    this._expandGroup = a;
  },
  getRepulsion: function() {
    return this._repulsion;
  },
  setRepulsion: function(a) {
    this._repulsion = a;
  },
  getType: function() {
    return this._type;
  },
  isAnimate: function() {
    return this._animate;
  },
  setAnimate: function(a) {
    this._animate = a;
  },
  getElementBox: function() {
    return this._box;
  },
  getExplicitXOffset: function() {
    return this._explicitXOffset;
  },
  setExplicitXOffset: function(a) {
    this._explicitXOffset = a;
  },
  getExplicitYOffset: function() {
    return this._explicitYOffset;
  },
  setExplicitYOffset: function(a) {
    this._explicitYOffset = a;
  },
  getDimension: function(a) {
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
  isVisible: function(a) {
    return !0;
  },
  isMovable: function(a) {
    return !0;
  },
  getGroupLayoutType: function(a) {
    return this._type;
  },
  getElements: function() {
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
  getLayoutResult: function(a) {
    var b = {};
    return this.doLayoutImpl(a, null, b),
      b;
  },
  doLayout: function(a, b) {
    //return this.doLayoutImpl(a, b);
  }
});

module.exports = Tlayout;
