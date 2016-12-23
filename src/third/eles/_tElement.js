
const Data = require('./_tData');
const AlarmState = require('./_alarmState');
const _third = require('./../core/_third')._third;

const _con = require('./../constants/index');
const Bd = _con.Bd;
let Telement = function(a) {
  this._styleMap = this._styleMap || {},
    this._alarmState = new AlarmState(this),
    Element.superClass.constructor.call(this, a);
};
_third.ext('third.Telement', Data, {
  IElement: !0,
  IStyle: !0,
  __accessor: ['layerId'],
  __style: 1,
  _layerId: Bd.LAYER_DEFAULT_ID,
  getAlarmState: function() {
    return this._alarmState;
  },
  isAdjustedToBottom: function() {
    return !1;
  },
  getElementUIClass: function() {
    return null;
  },
  getCanvasUIClass: function() {
    return null;
  },
  getVectorUIClass: function() {
    return null;
  }
});

module.exports = Telement;
