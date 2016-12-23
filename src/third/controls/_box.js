const List = require('./../core/_list');
const Tlayout = require('./../eles/_tLayout');

let box = {
  findMoveToBottomDatas: function(a, b, c) {
    for (var d = 0; d < c.size(); d++) {
      var e = c.get(d);
      a.contains(e) && b.add(e);
    }
    for (d = 0; d < c.size(); d++) {e = c.get(d),
      box.findMoveToBottomDatas(a, b, e.getChildren());}
  },
  findMoveToTopDatas: function(a, b, c) {
    for (var d = 0; d < c.size(); d++) {
      var e = c.get(c.size() - 1 - d);
      a.contains(e) && b.add(e);
    }
    for (d = 0; d < c.size(); d++) {e = c.get(d),
      box.findMoveToTopDatas(a, b, e.getChildren());}
  },
  findMoveUpDatas: function(a, b, c) {
    var d = !1;
    for (var e = 0; e < c.size(); e++) {
      var f = c.get(e);
      a.contains(f) ? d && b.add(f) : d = !0;
    }
    for (e = 0; e < c.size(); e++) {f = c.get(e),
      box.findMoveUpDatas(a, b, f.getChildren());}
  },
  findMoveDownDatas: function(a, b, c) {
    var d = !1;
    for (var e = 0; e < c.size(); e++) {
      var f = c.get(c.size() - 1 - e);
      a.contains(f) ? d && b.add(f) : d = !0;
    }
    for (e = 0; e < c.size(); e++){ f = c.get(e),
      box.findMoveDownDatas(a, b, f.getChildren());}
  },
  doLayout: function(a, b) {
    b = b || {},
      b.type = b.type || 'round',
      b.animate = b.animate || !0,
      b.elements = b.elements || new List,
      b.repulsion = b.repulsion || 1,
      b.expandGroup = b.expandGroup || !1;
    var d = new Tlayout.AutoLayouter(a.getElementBox());
    d.getElements = function() { };
  }
};

module.exports = box;
