'use strict';

//////////////////////////////
/**
 * 主入口
 * @author ilex
 * @doc
 *  import _aot from 'amos-overt';
 */
//////////////////////////////
var _animate = require('./_animate');
var _chart = require('./_chart');
var _container = require('./_container');
var _e = require('./_baseElement');
var Element = require('./_absElement');
var _layout = require('./_layout');
var _l = require('./_link');
var _logo = require('./_logo');
var _n = require('./_node');
var Scene = require('./_scene');
var Stage = require('./_stage');
var _util = require('./_util');
var find = require('./_extends');
var _tobj = require('./_tobj');
var Constants = require('./constants/index');

Stage.prototype.find = find, Scene.prototype.find = find;

/**
 * 从json文件创建
 *
 * @param {any} jsonStr
 * @param {any} canvas
 * @returns
 */
function createStageFromJson(jsonStr, $canvas) {
  var jsonObj = void 0;
  eval('jsonObj = ' + jsonStr);
  var $stage = new Stage($canvas);
  for (var k in jsonObj) {
    'childs' != k && ($stage[k] = jsonObj[k]);
  }
  var scenes = jsonObj.childs;
  return scenes.forEach(function (sce) {
    var $sce = new Scene($stage);
    for (var key in sce) {
      'childs' != key && ($sce[key] = sce[key]), 'background' == key && ($sce.background = sce[key]);
    }
    var childItems = sce.childs;
    childItems.forEach(function (item) {
      var tempEle = null,
          type = item.elementType;
      'node' == type ? tempEle = new _n.Node() : 'CircleNode' == type && (tempEle = new _n.CircleNode());
      for (var proKey in item) {
        tempEle[proKey] = item[proKey];
      }
      $sce.add(tempEle);
    });
  }), $stage;
}

/**
 * 从json文件加载
 *
 * @param {any} json
 * @param {any} canvas
 * @returns
 */
_util.loadStageFromJson = function loadStageFromJson(json, $canvas) {
  var stageObj = void 0;
  var obj = eval(json),
      stage = new Stage($canvas);
  for (var k in stageObj) {
    if ('scenes' != k) {
      stage[k] = obj[k];
    } else {
      for (var scenes = obj.scenes, i = 0; i < scenes.length; i++) {
        var sceneObj = scenes[i],
            $scene = new Scene(stage);
        for (var p in sceneObj) {
          if ('elements' != p) {
            $scene[p] = sceneObj[p];
          } else {
            for (var nodeMap = {}, elements = sceneObj.elements, m = 0; m < elements.length; m++) {
              var elementObj = elements[m],
                  type = elementObj.elementType,
                  element = void 0;
              'Node' == type && (element = new Node());
              for (var mk in elementObj) {
                element[mk] = elementObj[mk];
              }
              nodeMap[element.text] = element, $scene.add(element);
            }
          }
        }
      }
    }
  }
  return console.log(stage), stage;
};

_util.getElementsBound = function getElementsBound(a) {
  var b = {
    left: Number.MAX_VALUE,
    right: Number.MIN_VALUE,
    top: Number.MAX_VALUE,
    bottom: Number.MIN_VALUE
  };
  for (var c = 0; c < a.length; c++) {
    var d = a[c];
    d instanceof _l.Link || (b.left > d.x && (b.left = d.x, b.leftNode = d), b.right < d.x + d.width && (b.right = d.x + d.width, b.rightNode = d), b.top > d.y && (b.top = d.y, b.topNode = d), b.bottom < d.y + d.height && (b.bottom = d.y + d.height, b.bottomNode = d));
  }
  return b.width = b.right - b.left, b.height = b.bottom - b.top, b;
};

module.exports = {
  AEffect: _animate.Effect,
  Animate: _animate.Animate,
  BarChartNode: _chart.BarChartNode,
  PieChartNode: _chart.PieChartNode,
  Container: _container,
  DisplayElement: _e.DisplayElement,
  InteractiveElement: _e.InteractiveElement,
  EditableElement: _e.EditableElement,
  Element: Element,
  Layout: _layout,
  layout: _layout,
  Link: _l.Link,
  FoldLink: _l.FoldLink,
  FlexionalLink: _l.FlexionalLink,
  CurveLink: _l.CurveLink,
  Logo: _logo,
  Node: _n.Node,
  TextNode: _n.TextNode,
  LinkNode: _n.LinkNode,
  CircleNode: _n.CircleNode,
  AnimateNode: _n.AnimateNode,
  Util: _util,
  Scene: Scene,
  Stage: Stage,
  Tobj: _tobj,
  createStageFromJson: createStageFromJson,
  Constants: Constants
};
//# sourceMappingURL=at.js.map