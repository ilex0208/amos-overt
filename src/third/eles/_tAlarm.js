const Data = require('./_tData');
const _third = require('./../core/_third')._third;

let Alarm = function(a, b, d, e, f) {
  Alarm.superClass.constructor.call(this, a),
    this._elementId = b,
    this._alarmSeverity = d,
    this._acked = e || !1,
    this._cleared = f || !1;
};
_third.ext('third.Alarm', Data, {
  IAlarm: !0,
  getElementId: function() {
    return this._elementId;
  },
  __accessor: ['acked', 'cleared', 'alarmSeverity']
});

module.exports = Alarm;
