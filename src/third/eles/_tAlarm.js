const Data = require('./_tData');
const Extends = require('./../core/_ext');

let Alarm = function(a, b, d, e, f) {
  Alarm.superClass.constructor.call(this, a),
    this._elementId = b,
    this._alarmSeverity = d,
    this._acked = e || !1,
    this._cleared = f || !1;
  // ext
  this.IAlarm = !0,
  this.getElementId = function() {
    return this._elementId;
  },
  this.__accessor = ['acked', 'cleared', 'alarmSeverity'];
};

Extends('third.Alarm', Data, Alarm);
//Alarm.prototype = new Data;
Alarm.prototype.getClassName = function(){
  return 'third.Alarm';
};

module.exports = Alarm;

