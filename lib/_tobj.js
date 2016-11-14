const Stage = require('./_stage');
const Scene = require('./_scene');
const _node = require('./_node');

let Tobj = {
  version: '0.4.8',
  zIndex_Container: 1,
  zIndex_Link: 2,
  zIndex_Node: 3,
  SceneMode: {
    normal: 'normal',
    drag: 'drag',
    edit: 'edit',
    select: 'select'
  },
  MouseCursor: {
    normal: 'default',
    pointer: 'pointer',
    top_left: 'nw-resize',
    top_center: 'n-resize',
    top_right: 'ne-resize',
    middle_left: 'e-resize',
    middle_right: 'e-resize',
    bottom_left: 'ne-resize',
    bottom_center: 'n-resize',
    bottom_right: 'nw-resize',
    move: 'move',
    open_hand: 'url(./img/cur/openhand.cur) 8 8, default',
    closed_hand: 'url(./img/cur/closedhand.cur) 8 8, default'
  },
  createStageFromJson: function(jsonStr, canvas) {
    var jsonObj;
    eval('jsonObj = ' + jsonStr);
    var stage = new Stage(canvas);
    for (var k in jsonObj) {'childs' != k && (stage[k] = jsonObj[k]);}
    var scenes = jsonObj.childs;
    return scenes.forEach(function(a) {
      var b = new Scene(stage);
      for (var c in a) {'childs' != c && (b[c] = a[c]),'background' == c && (b.background = a[c]);}
      var d = a.childs;
      d.forEach(function(a) {
        var c = null,
          d = a.elementType;
        'node' == d ? c = new _node.Node : 'CircleNode' == d && (c = new _node.CircleNode);
        for (var e in a) {c[e] = a[e];}
        b.add(c);
      });
    }),
        stage;
  }
};

module.exports = Tobj;
