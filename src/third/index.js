
// core
const animate = require('./core/_animgmt');
const _arrow = require('./core/_arrow');
const ExtendClass = require('./core/_ext');
const _html = require('./core/_html');
const _imageAsset = require('./core/_imageAsset');
require('./core/_init');
const List = require('./core/_list');
const _math = require('./core/_math');

const objKey2List = require('./core/_objKey2List');
const _pool = require('./core/_pool');
const _popup = require('./core/_popup');
const _position = require('./core/_position');
const _render = require('./core/_render');

const _t = require('./core/_third');
const {_third, Styles, extend} = _t;

const thirdUtil = require('./core/_thirdUtil');
const _touch = require('./core/_touch');
const UserAgent = require('./core//_userAgent');

// controls
const AlarmBox = require('./controls/_alarmBox');
const AlarmElementMapping = require('./controls/_AlarmElementMapping');
const box = require('./controls/_box');
const DataBox = require('./controls/_db');
const ColumnBox = require('./controls/_ColumnBox');
const EventDispatcher = require('./controls/_eventDispatcher');
const controls = require('./controls/_controls');
const PropertyChangeDispatcher = require('./controls/_PropertyChangeDispatcher');
const SelectionModel = require('./controls/_model');
const QuickFinder = require('./controls/_quickFinder');

// eles
const AlarmSeverity = require('./eles/_alarmSeverity');
const AlarmState = require('./eles/_alarmState');
const Follower = require('./eles/_Follower');
const Alarm = require('./eles/_tAlarm');
const Data = require('./eles/_tData');
const Dummy = require('./eles/_tDommy');
const Telement = require('./eles/_tElement');
const Group = require('./eles/_tGroup');
const Layer = require('./eles/_tLayer');
const Tlayout = require('./eles/_tLayout');
const Tlink = require('./eles/_tLink');
const Tnode = require('./eles/_tNode');
const SubNetwork = require('./eles/_tSubNetwork');
// tree

// utils
const canvasUtil = require('./utils/canvasUtil');
const colorUtil = require('./utils/colorUtil');
//constants
const Constants = require('./constants');

const third = {
  animate: animate,
  arrow: _arrow,
  ExtendClass,
  html: _html,
  ImageAsset: _imageAsset,
  List: List,
  math: _math,
  objKey2List,
  Pool: _pool,
  popup: _popup,
  Position: _position,
  _render: _render,
  _third: _third,
  Styles: Styles,
  extend: extend,
  thirdUtil: thirdUtil,
  touch: _touch,
  UserAgent: UserAgent,

  AlarmBox,
  AlarmElementMapping,
  box,
  DataBox,
  ColumnBox,
  EventDispatcher,
  controls,
  PropertyChangeDispatcher,
  SelectionModel,
  QuickFinder,
  AlarmSeverity,
  AlarmState,
  Follower,
  Alarm ,
  Data ,
  Dummy ,
  Telement ,
  Group ,
  Layer ,
  Tlayout ,
  Tlink,
  Tnode,
  SubNetwork ,


  canvasUtil: canvasUtil,
  colorUtil: colorUtil,

  Constants: Constants
};

module.exports = third;
