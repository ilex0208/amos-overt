const List = require('./_list');
const _third = require('./_third');

/**
 * 动画管理
 */
const animate = {};
animate.Animate = function() {
  this.current = 0,
    this.step = 8,
    this.delay = 4,
    this.finishFunction = null,
    this.shouldBeFinished = !1,
    this.getCurrentDelay = function() {
      return this.delay * this.current + 1;
    },
    this.action = function(a) { };
},
animate.AnimateProperty = function(a, b, c) {
  this.objects = a,
    this.newValues = b,
    this.finishFunction = c,
    this.oldValues = new List;
  var d = this.objects.size();
  for (var e = 0; e < d; e++) {
    var f = this.objects.get(e);
    this.oldValues.add(this.getPropertyValue(f));
  }

  this.action = function(a) {
    var b = this.objects.size();
    for (var c = 0; c < b; c++) {
      var d = this.objects.get(c),
        e = this.oldValues.get(c),
        f = this.newValues.get(c);
      this.currentAction(d, e, f, a);
    }
  },
    this.getPropertyValue = function(a) { },
    this.currentAction = function(a, b, c, d) { };
},
animate.AnimateBounds = function(a, b, c) {
  this.node = a,
    this.newBounds = b,
    this.oldBounds = a.getRect(),
    this.finishFunction = c;
  this.shouldBeFinished = !0,
    this.action = function(a) {
      var b = this.oldBounds,
        c = this.newBounds;
      this.node.setLocation(b.x + (c.x - b.x) * a, b.y + (c.y - b.y) * a),
        this.node.setSize(b.width + (c.width - b.width) * a, b.height + (c.height - b.height) * a);
    };
},
animate.AnimateCenterLocation = function(a, b, d) {
  animate.AnimateCenterLocation.superClass.constructor.call(this, a, b, d);
  this.getPropertyValue = function(a) {
    return a.getCenterLocation();
  },
    this.currentAction = function(a, b, c, d) {
      var e = b.x + (c.x - b.x) * d,
        f = b.y + (c.y - b.y) * d;
      a.setCenterLocation(e, f);
    };
},
animate.AnimateLocation = function(a, b, d) {
  animate.AnimateLocation.superClass.constructor.call(this, a, b, d);
  this.getPropertyValue = function(a) {
    return a.getLocation();
  },
    this.currentAction = function(a, b, c, d) {
      var e = b.x + (c.x - b.x) * d,
        f = b.y + (c.y - b.y) * d;
      a.setLocation(e, f);
    };
},
animate.AnimateScrollPosition = function(a, b, c) {
  this.view = a,
    this.oldHorizontalOffset = a.scrollLeft,
    this.oldVerticalOffset = a.scrollTop,
    this.newHorizontalOffset = b,
    this.newVerticalOffset = c;
  this.action = function(a) {
    this.view.scrollLeft = this.oldHorizontalOffset + (this.newHorizontalOffset - this.oldHorizontalOffset) * a,
      this.view.scrollTop = this.oldVerticalOffset + (this.newVerticalOffset - this.oldVerticalOffset) * a;
  };
},
animate.AnimateZoom = function(a, b, c) {
  this.view = a,
    this.oldZoom = a.getZoom(),
    this.newZoom = b,
    this.finishFunction = c;
  this.shouldBeFinished = !0,
    this.action = function(a) {
      this.view.setZoom(this.oldZoom + (this.newZoom - this.oldZoom) * a, !1);
    };
},
animate.AnimateXZoom = function(a, b, c) {
  this.view = a,
    this.oldXZoom = a.getXZoom(),
    this.newXZoom = b,
    this.finishFunction = c;
  this.shouldBeFinished = !0,
    this.action = function(a) {
      this.view.setXZoom(this.oldXZoom + (this.newXZoom - this.oldXZoom) * a, !1);
    };
},
animate.AnimateYZoom = function(a, b, c) {
  this.view = a,
    this.oldYZoom = a.getYZoom(),
    this.newYZoom = b,
    this.finishFunction = c;
  this.shouldBeFinished = !0,
    this.action = function(a) {
      this.view.setYZoom(this.oldYZoom + (this.newYZoom - this.oldYZoom) * a, !1);
    };
},
animate.AnimateXYZoom = function(a, b, c, d) {
  this.view = a,
    this.oldXZoom = a.getXZoom(),
    this.newXZoom = b,
    this.oldYZoom = a.getYZoom(),
    this.newYZoom = c,
    this.finishFunction = d;
  this.shouldBeFinished = !0,
    this.action = function(a) {
      this.view.setXZoom(this.oldXZoom + (this.newXZoom - this.oldXZoom) * a, !1),
        this.view.setYZoom(this.oldYZoom + (this.newYZoom - this.oldYZoom) * a, !1);
    };
},
animate.AnimateSubNetwork = function(a, b, c) {
  this.network = a,
    this.subNetwork = b,
    this.finishFunction = c;
  this.shouldBeFinished = !0,
    this.action = function(a) {
      a > .5 ? (this.network.getView().style.opacity = a * 2 - 1, this.network._setCurrentSubNetwork(this.subNetwork)) : this.network.getView().style.opacity = 1 - a * 2;
    };
},
animate.AnimateManager = {
  timer: null,
  animate: null,
  start: function(a, b) {
    var e = animate.AnimateManager;
    a.current < 0 && (a.current = 0),
      b ? _third.callLater(e.startImpl, null, [a], b) : e.startImpl(a);
  },
  startImpl: function(a) {
    var b = animate.AnimateManager;
    b.animate && b.endAnimate(),
      b.animate = a,
      b.timer = setTimeout(b.tick, a.getCurrentDelay());
  },
  tick: function() {
    var a = animate.AnimateManager,
      b = a.animate;
    if (!b) {
      return;
    }
    if (b.current < 0) {
      b.current++;
      return;
    }
    b.current < b.step && (b.current++ , b.action(b.current / b.step), a.timer = setTimeout(a.tick, b.getCurrentDelay())),
      b.current >= b.step && a.endAnimate();
  },
  endAnimate: function() {
    var a = animate.AnimateManager;
    if (a.animate) {
      a.animate.shouldBeFinished && a.animate.current < a.animate.step && (a.animate.current = a.animate.step, a.animate.action(a.animate.current / a.animate.step));
      var b = a.animate.finishFunction;
      a.animate = null,
        a.timer && (clearTimeout(a.timer), a.timer = null),
        b && b();
    } else {
      a.timer && (clearTimeout(a.timer), a.timer = null);
    }
  }
};

module.exports = animate;
