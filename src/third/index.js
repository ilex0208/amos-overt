const _t = require('./core/_third');
const {_third, Styles, extend} = _t;
const thirdUtil = require('./core/_thirdUtil');
const animate = require('./core/_animgmt');
const _arrow = require('./core/_arrow');
const _html = require('./core/_html');
const _imageAsset = require('./core/_imageAsset');
require('./core/_init');
const _math = require('./core/_math');

const _pool = require('./core/_pool');
const _popup = require('./core/_popup');
const _touch = require('./core/_touch');
const canvasUtil = require('./utils/canvasUtil');
const List = require('./core/_list');

// controls
const ab = require('./controls/_alarmBox');
const {AlarmBox, AlarmElementMapping} = ab;
const box = require('./controls/_box');
const _db = require('./controls/_db');
const {DataBox,ColumnBox} = _db;
const EventDispatcher = require('./controls/_eventDispatcher');
const controls = require('./controls/_listBase');
const {PropertyChangeDispatcher, SelectionModel} = require('./controls/_model');
require('./controls/_quickFinder');
// core

// eles

// tree

// utils

//constants
const Constants = require('./constants');

const third = {
  ImageAsset: _imageAsset,
  Pool: _pool,
  _third: _third,
  Styles: Styles,
  extend: extend,
  thirdUtil: thirdUtil,
  animate: animate,
  arrow: _arrow,
  html: _html,
  List: List,
  math: _math,
  popup: _popup,
  touch: _touch,
  canvasUtil: canvasUtil,
  Constants: Constants,


  AlarmBox,
  AlarmElementMapping,
  box,
  DataBox,
  ColumnBox,
  EventDispatcher,
  controls,
  PropertyChangeDispatcher,
  SelectionModel
};

module.exports = third;
