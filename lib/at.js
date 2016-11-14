/**
 * aptTopo
 * ==>0.3.0
 * @author ilex
 */

let _animate = require('./_animate');
let _chart = require('./_chart');
let _container = require('./_container');
let _eleExt = require('./_eleExt');
let _element = require('./_element');
let _layout = require('./_layout');
let _link = require('./_link');
let _logo = require('./_logo');
let _node = require('./_node');
let _scene = require('./_scene');
let _stage = require('./_stage');
let _util = require('./_util');
let find = require('./_stage.scence');
let _tobj = require('./_tobj');

_stage.prototype.find = find,
_scene.prototype.find = find;

function createStageFromJson(jsonStr, canvas) {
  var jsonObj;
  eval('jsonObj = ' + jsonStr);
  var stage = new Stage(canvas);
  for (var k in jsonObj) { 'childs' != k && (stage[k] = jsonObj[k]); }
  var scenes = jsonObj.childs;
  return scenes.forEach(function (a) {
    var b = new Scene(stage);
    for (var c in a) { 'childs' != c && (b[c] = a[c]), 'background' == c && (b.background = a[c]); }
    var d = a.childs;
    d.forEach(function (a) {
      var c = null,
        d = a.elementType;
      'node' == d ? c = new _node.Node : 'CircleNode' == d && (c = new _node.CircleNode);
      for (var e in a) { c[e] = a[e]; }
      b.add(c);
    });
  }),
    stage;
}

_util.loadStageFromJson = function loadStageFromJson(json, canvas) {
  var stageObj;
  var obj = eval(json),stage = new Stage(canvas);
  for (var k in stageObj) {
    if ('scenes' != k) { stage[k] = obj[k]; }
    else {
      for (var scenes = obj.scenes, i = 0; i < scenes.length; i++) {
        var sceneObj = scenes[i],
          scene = new Scene(stage);
        for (var p in sceneObj) {
          if ('elements' != p) { scene[p] = sceneObj[p]; }
          else {
            for (var nodeMap = {}, elements = sceneObj.elements, m = 0; m < elements.length; m++) {
              var elementObj = elements[m], type = elementObj.elementType, element;
              'Node' == type && (element = new Node);
              for (var mk in elementObj) { element[mk] = elementObj[mk]; }
              nodeMap[element.text] = element,
                scene.add(element);
            }
          }
        }
      }
    }
  }
  return console.log(stage),stage;
}

_util.getElementsBound = function getElementsBound(a) {
  for (var b = {
      left: Number.MAX_VALUE,
      right: Number.MIN_VALUE,
      top: Number.MAX_VALUE,
      bottom: Number.MIN_VALUE
    },
    c = 0; c < a.length; c++) {
    var d = a[c];
    d instanceof _link.Link || (b.left > d.x && (b.left = d.x, b.leftNode = d), b.right < d.x + d.width && (b.right = d.x + d.width, b.rightNode = d), b.top > d.y && (b.top = d.y, b.topNode = d), b.bottom < d.y + d.height && (b.bottom = d.y + d.height, b.bottomNode = d));
  }
  return b.width = b.right - b.left,
    b.height = b.bottom - b.top,
    b;
}

module.exports = {
  AEffect: _animate.Effect,
  Animate: _animate.Animate,
  BarChartNode: _chart.BarChartNode,
  PieChartNode: _chart.PieChartNode,
  Container: _container,
  DisplayElement: _eleExt.DisplayElement,
  InteractiveElement: _eleExt.InteractiveElement,
  EditableElement: _eleExt.EditableElement,
  Element: _element,
  Layout: _layout,
  layout: _layout,
  Link: _link.Link,
  FoldLink: _link.FoldLink,
  FlexionalLink: _link.FlexionalLink,
  CurveLink: _link.CurveLink,
  Logo: _logo,
  Node: _node.Node,
  TextNode: _node.TextNode,
  LinkNode: _node.LinkNode,
  CircleNode: _node.CircleNode,
  AnimateNode: _node.AnimateNode,
  Util: _util,
  Scene: _scene,
  Stage: _stage,
  Tobj:_tobj,
  createStageFromJson: createStageFromJson
};