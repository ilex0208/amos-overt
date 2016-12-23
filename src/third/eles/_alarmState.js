const _third = require('./../core/_third')._third;
const AlarmSeverity = require('./_alarmSeverity');

let AlarmState = function(a) {
  this._e = a,
    this._nm = {},
    this._am = {},
    this._ps = null,
    this._haa = null,
    this._hna = null,
    this._hoa = null,
    this._hta = null,
    this._hls = !1,
    this._aac = 0,
    this._nac = 0;
};
_third.ext('third.AlarmState', Object, {
  _ep: !0,
  _f: function() {
    this._c1(),
      this._c2(),
      this._c3(),
      this._c4(),
      this._c5(),
      this._c6(),
      this._c7(),
      this._e.firePropertyChange('alarmState', null, this);
  },
  getHighestAcknowledgedAlarmSeverity: function() {
    return this._haa;
  },
  getHighestNewAlarmSeverity: function() {
    return this._hna;
  },
  getHighestOverallAlarmSeverity: function() {
    return this._hoa;
  },
  getHighestNativeAlarmSeverity: function() {
    return this._hta;
  },
  hasLessSevereNewAlarms: function() {
    return this._hls;
  },
  _c1: function() {
    var a = null;
    for (var b in this._am) {
      b = AlarmSeverity.getByName(b);
      if (AlarmSeverity.isClearedAlarmSeverity(b)) {continue;}
      if (this.getAcknowledgedAlarmCount(b) === 0) {continue;}
      a ? a = AlarmSeverity.compare(a, b) > 0 ? a : b : a = b;
    }
    this._haa = a;
  },
  _c2: function() {
    var a = null;
    for (var b in this._nm) {
      b = AlarmSeverity.getByName(b);
      if (AlarmSeverity.isClearedAlarmSeverity(b)) {continue;}
      if (this.getNewAlarmCount(b) === 0) {continue;}
      a ? a = AlarmSeverity.compare(a, b) > 0 ? a : b : a = b;
    }
    this._hna = a;
  },
  _c3: function() {
    if (!this._hna) {
      this._hls = !1;
      return;
    }
    for (var a in this._nm) {
      a = AlarmSeverity.getByName(a);
      if (AlarmSeverity.isClearedAlarmSeverity(a)) {continue;}
      if (this.getNewAlarmCount(a) === 0) {continue;}
      if (AlarmSeverity.compare(this._hna, a) > 0) {
        this._hls = !0;
        return;
      }
    }
    this._hls = !1;
  },
  _c4: function() {
    var a = this._haa,
      b = this._hna,
      d = this._ps;
    this._hoa = a,
      AlarmSeverity.compare(b, this._hoa) > 0 && (this._hoa = b),
      AlarmSeverity.compare(d, this._hoa) > 0 && (this._hoa = d);
  },
  _c5: function() {
    var a = this._haa,
      b = this._hna;
    this._hta = a,
      AlarmSeverity.compare(b, this._hta) > 0 && (this._hta = b);
  },
  increaseAcknowledgedAlarm: function(a, b) {
    b == null && (b = 1);
    if (b === 0) { return; }
    var c = this._am[a.name];
    c == null && (c = 0),
      c += b,
      this._am[a.name] = c,
      this._f();
  },
  increaseNewAlarm: function(a, b) {
    b == null && (b = 1);
    if (b === 0) { return; }
    var c = this._nm[a.name];
    c == null && (c = 0),
      c += b,
      this._nm[a.name] = c,
      this._f();
  },
  decreaseAcknowledgedAlarm: function(a, b) {
    b == null && (b = 1);
    if (b === 0) { return; }
    var c = this._am[a.name];
    c == null && (c = 0),
      c -= b;
    if (c < 0) { throw 'Alarm count can not be negative'; }
    this._am[a.name] = c,
      this._f();
  },
  decreaseNewAlarm: function(a, b) {
    b == null && (b = 1);
    if (b === 0) { return; }
    var c = this._nm[a.name];
    c == null && (c = 0),
      c -= b;
    if (c < 0) { throw 'Alarm count can not be negative'; }
    this._nm[a.name] = c,
      this._f();
  },
  acknowledgeAlarm: function(a) {
    this.decreaseNewAlarm(a, 1),
      this.increaseAcknowledgedAlarm(a, 1);
  },
  acknowledgeAllAlarms: function(a) {
    if (a) {
      var b = this.getNewAlarmCount(a);
      this.decreaseNewAlarm(a, b),
        this.increaseAcknowledgedAlarm(a, b);
    } else { for (var d in this._nm) { this.acknowledgeAllAlarms(AlarmSeverity.getByName(d)); } }
  },
  _c6: function() {
    this._aac = 0;
    for (var a in this._am) {
      a = AlarmSeverity.getByName(a),
      this._aac += this.getAcknowledgedAlarmCount(a);
    }
  },
  getAcknowledgedAlarmCount: function(a) {
    if (a) {
      var b = this._am[a.name];
      return b == null ? 0 : b;
    }
    return this._aac;
  },
  getAlarmCount: function(a) {
    return this.getAcknowledgedAlarmCount(a) + this.getNewAlarmCount(a);
  },
  _c7: function() {
    this._nac = 0;
    for (var a in this._nm) {
      a = AlarmSeverity.getByName(a),
      this._nac += this.getNewAlarmCount(a);
    }
  },
  getNewAlarmCount: function(a) {
    if (a) {
      var b = this._nm[a.name];
      return b == null ? 0 : b;
    }
    return this._nac;
  },
  setNewAlarmCount: function(a, b) {
    this._nm[a.name] = b,
      this._f();
  },
  removeAllNewAlarms: function(a) {
    a ? delete this._nm[a] : this._nm = {},
      this._f();
  },
  setAcknowledgedAlarmCount: function(a, b) {
    this._am[a.name] = b,
      this._f();
  },
  removeAllAcknowledgedAlarms: function(a) {
    a ? delete this._am[a.name] : this._am = {},
      this._f();
  },
  isEmpty: function() {
    return this._hoa == null;
  },
  clear: function() {
    this._am = {},
      this._nm = {},
      this._f();
  },
  getPropagateSeverity: function() {
    return this._ps;
  },
  setPropagateSeverity: function(a) {
    this._ep || (a = null);
    if (this._ps === a) { return; }
    var b = this._ps;
    this._ps = a,
      this._f(),
      this._e.firePropertyChange('propagateSeverity', b, a);
  },
  isEnablePropagation: function() {
    return this._ep;
  },
  setEnablePropagation: function(a) {
    var b = this._ep;
    this._ep = a,
      this._e.firePropertyChange('enablePropagation', b, a) && (a || this.setPropagateSeverity(null));
  }
});


module.exports = AlarmState;
