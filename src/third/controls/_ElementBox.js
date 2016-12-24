const DataBox = require('./_db');
const AlarmBox = require('./_alarmBox');
// const LayerBox = require('./_LayerBox');
// const AlarmStatePropagator = require('./_AlarmStatePropagator');
const EventDispatcher = require('./_eventDispatcher');
const List = require('./../core/_list');
const invokeExtends = require('./../core/_ext');

let ElementBox = function(a) {
  ElementBox.superClass.constructor.apply(this, arguments),
  this._styleMap = {},
  this._alarmBox = new AlarmBox(this),
  // this._layerBox = new LayerBox(this),
  // this._alarmStatePropagator = new AlarmStatePropagator(this),
  // this._alarmStatePropagator.setEnable(!0),
  this._indexChangeDispatcher = new EventDispatcher;

  // ext
  this.IStyle = !0,
  this.__style = 1,
  this._name = 'ElementBox',
  this.add = function(a, b) {
    if (!a) {return;}
    if (!a.IElement) {throw 'Only IElement can be added into ElementBox';}
    ElementBox.superClass.add.apply(this, arguments),
    this.adjustElementIndex(a);
  },
  this.onDataPropertyChanged = function(a, b) {
    ElementBox.IS_INTERESTED_ADJUSTELEMENTINDEX_PROPERTY[b.property] && this.adjustElementIndex(a),
    ElementBox.superClass.onDataPropertyChanged.apply(this, arguments);
  },
  this.addIndexChangeListener = function(a, b, c) {
    this._indexChangeDispatcher.add(a, b, c);
  },
  this.removeIndexChangeListener = function(a, b) {
    this._indexChangeDispatcher.remove(a, b);
  },
  // this.sendToTop = function(a) {
  //   if (!this.contains(a)) {return;}
  //   if (a !== this.getDatas().get(this.size() - 1)) {
  //     var b = this.getDatas().indexOf(a);
  //     this.getDatas().removeAt(b),
  //     this.getDatas().add(a),
  //     this._indexChangeDispatcher.fire({
  //       element: a,
  //       oldIndex: b,
  //       newIndex: this.size() - 1
  //     });
  //   }
  //   a instanceof c.Link && (a.getFromAgent() && !a.getFromAgent().isAdjustedToBottom() && this.sendToTop(a.getFromAgent()), a.getToAgent() && !a.getToAgent().isAdjustedToBottom() && this.sendToTop(a.getToAgent())),
  //   a instanceof Cd && a.getFollowers() && a.getFollowers().forEach(function(b) {
  //     if (b.isRelatedTo(a)) return;
  //     if (a instanceof c.Follower && b.isLoopedHostOn(a)) return;
  //     this.sendToTop(b);
  //   },
  //   this);
  //   if (a.ISubNetwork) return;
  //   if (a instanceof Dd && !a.isExpanded()) return;
  //   a.getChildren().forEach(function(a) {
  //     a instanceof c.Link || this.sendToTop(a);
  //   },
  //   this);
  // },
  // this.sendToBottom = function(a, b) {
  //   if (a === b) {return;}
  //   if (!this.contains(a)) {return;}
  //   if (b && !this.contains(b)) {return;}
  //   var d = this.getDatas().remove(a),
  //     e = 0;
  //   b && (e = this.getDatas().indexOf(b)),
  //   this.getDatas().add(a, e),
  //   d != e && (this._indexChangeDispatcher.fire({
  //     element: a,
  //     oldIndex: d,
  //     newIndex: e
  //   }), a.getParent() && !a.getParent().ISubNetwork && !(a.getParent() instanceof c.Link) && this.sendToBottom(a.getParent(), a));
  // },
  this.fireIndexChange = function(a, b, c) {
    this._indexChangeDispatcher.fire({
      element: a,
      oldIndex: b,
      newIndex: c
    });
  },
  this.adjustElementIndex = function(a) {
    if (!this.contains(a)) {return;}
    a.isAdjustedToBottom() ? (this.sendToBottom(a), a.getChildren().forEach(this.adjustElementIndex, this)) : this.sendToTop(a);
  },
  this.forEachByLayer = function(a, b, c) {
    var d = this.size(),
      e = this.getDatas();
    if (!b) {this._layerBox.forEachByDepthFirst(function(b) {
      for (var f = 0; f < d; f++) {
        var g = e.get(f);
        if (this._layerBox.getLayerByElement(g) === b) {if (c) {
          if (a.call(c, g) === !1) {return;}
        } else if (a(g) === !1) {return;}}
      }
    },
    null, this);}
    else {for (var f = 0; f < d; f++) {
      var g = e.get(f);
      if (this._layerBox.getLayerByElement(g) === b) {if (c) {
        if (a.call(c, g) === !1) {return;}
      } else if (a(g) === !1) {return;}}
    }}
  },
  this.forEachByLayerReverse = function(a, b, c) {
    var d = new List;
    this.forEachByLayer(function(a) {
      d.add(a, 0);
    },
    b),
    d.forEach(a, c);
  },
  this.getLayerBox = function() {
    return this._layerBox;
  },
  this.getAlarmBox = function() {
    return this._alarmBox;
  },
  this.getAlarmStatePropagator = function() {
    return this._alarmStatePropagator;
  };
  // this.startBatch = function(a, b) {
  //   c._isInitializing = !0,
  //   c._bundleLinks = {},
  //   c._links = {},
  //   a.call(b);
  //   var d, e;
  //   for (var f in c._links) {d = c._links[f],
  //   d._checkAgentNodeImpl();}
  //   for (var f in c._bundleLinks){ e = c._bundleLinks[f],
  //   rd.resetBundleLinks(e[0], e[1]);}
  //   c._bundleLinks = null,
  //   c._links = null,
  //   c._isInitializing = !1;
  // }
};
ElementBox.IS_INTERESTED_ADJUSTELEMENTINDEX_PROPERTY = {
  fromAgent: 1,
  toAgent: 1,
  expanded: 1,
  parent: 1,
  host: 1
};

invokeExtends('third.ElementBox', DataBox, ElementBox);
//ElementBox.property = new DataBox,
ElementBox.prototype.getClassName = function(){
  return 'third.ElementBox';
};

module.exports = ElementBox;
