//////////////////////////////
/**
 * 主入口
 * @author ilex
 * @doc
 *  import _aot from 'amos-overt';
 */
//////////////////////////////
let _animate = require('./_animate');
let _chart = require('./_chart');
let _container = require('./_container');
let _e = require('./_baseElement');
let Element = require('./_absElement');
let _layout = require('./_layout');
let _l = require('./_link');
let _logo = require('./_logo');
let _n = require('./_node');
let Scene = require('./_scene');
let Stage = require('./_stage');
let _util = require('./_util');
let find = require('./_extends');
let _tobj = require('./_tobj');
let Constants = require('./constants/index');

Stage.prototype.find = find,
Scene.prototype.find = find;

/**
 * 从json文件创建
 * 
 * @param {any} jsonStr
 * @param {any} canvas
 * @returns
 */
function createStageFromJson(jsonStr, $canvas) {
  let jsonObj;
  eval('jsonObj = ' + jsonStr);
  let $stage = new Stage($canvas);
  for (let k in jsonObj) { 'childs' != k && ($stage[k] = jsonObj[k]); }
  let scenes = jsonObj.childs;
  return scenes.forEach(function(sce) {
    let $sce = new Scene($stage);
    for (let key in sce) {
      'childs' != key && ($sce[key] = sce[key]),
        'background' == key && ($sce.background = sce[key]);
    }
    let childItems = sce.childs;
    childItems.forEach(function(item) {
      let tempEle = null,
        type = item.elementType;
      'node' == type ? tempEle = new _n.Node : 'CircleNode' == type && (tempEle = new _n.CircleNode);
      for (let proKey in item) { tempEle[proKey] = item[proKey]; }
      $sce.add(tempEle);
    });
  }),
    $stage;
}

/**
 * 从json文件加载
 * 
 * @param {any} json
 * @param {any} canvas
 * @returns
 */
_util.loadStageFromJson = function loadStageFromJson(json, $canvas) {
  let stageObj;
  let obj = eval(json),stage = new Stage($canvas);
  for (let k in stageObj) {
    if ('scenes' != k) { stage[k] = obj[k]; }
    else {
      for (let scenes = obj.scenes, i = 0; i < scenes.length; i++) {
        let sceneObj = scenes[i],
          $scene = new Scene(stage);
        for (let p in sceneObj) {
          if ('elements' != p) { $scene[p] = sceneObj[p]; }
          else {
            for (let nodeMap = {}, elements = sceneObj.elements, m = 0; m < elements.length; m++) {
              let elementObj = elements[m], type = elementObj.elementType, element;
              'Node' == type && (element = new Node);
              for (let mk in elementObj) { element[mk] = elementObj[mk]; }
              nodeMap[element.text] = element,
                $scene.add(element);
            }
          }
        }
      }
    }
  }
  return console.log(stage),stage;
};

_util.getElementsBound = function getElementsBound(a) {
  let b = {
    left: Number.MAX_VALUE,
    right: Number.MIN_VALUE,
    top: Number.MAX_VALUE,
    bottom: Number.MIN_VALUE
  };
  for (let c = 0; c < a.length; c++) {
    let d = a[c];
    d instanceof _l.Link || (b.left > d.x && (b.left = d.x, b.leftNode = d), b.right < d.x + d.width && (b.right = d.x + d.width, b.rightNode = d), b.top > d.y && (b.top = d.y, b.topNode = d), b.bottom < d.y + d.height && (b.bottom = d.y + d.height, b.bottomNode = d));
  }
  return b.width = b.right - b.left,
    b.height = b.bottom - b.top,
    b;
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
  Tobj:_tobj,
  createStageFromJson: createStageFromJson,
  Constants: Constants
};
