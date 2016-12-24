
const Data = require('./_tData');
const AlarmState = require('./_alarmState');

const _con = require('./../constants/index');
const Bd = _con.Bd;

const invokeExtends = require('./../core/_ext');


let Telement = function(a) {
  this._styleMap = this._styleMap || {},
    this._alarmState = new AlarmState(this),
    Element.superClass.constructor.call(this, a);
  // ext
  this.IElement = !0,
  this.IStyle = !0,
  this.__accessor = ['layerId'],
  this.__style = 1,
  this._layerId = Bd.LAYER_DEFAULT_ID,
  this.getAlarmState = function() {
    return this._alarmState;
  },
  this.isAdjustedToBottom = function() {
    return !1;
  },
  this.getElementUIClass = function() {
    return null;
  },
  this.getCanvasUIClass = function() {
    return null;
  },
  this.getVectorUIClass = function() {
    return null;
  };
};

invokeExtends('third.Telement', Data, Telement);
//Telement.prototype = new Data;
Telement.prototype.getClassName = function(){
  return 'third.Telement';
};

module.exports = Telement;
