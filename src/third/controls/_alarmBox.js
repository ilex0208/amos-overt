
const DataBox = require('./_db');

const Extends = require('./../core/_ext');
const AlarmElementMapping = require('./_AlarmElementMapping');

let AlarmBox = function(a) {
  if (!a) {throw 'elementBox can not be null.';}
  AlarmBox.superClass.constructor.call(this),
  this._elementBox = a,
  this._alarmElementMapping = new AlarmElementMapping(this, a),
  this._elementBox.addDataBoxChangeListener(this.handleElementBoxChange, this, !0),
  this.addDataBoxChangeListener(this.handleAlarmBoxChange, this, !0),
  this.addDataPropertyChangeListener(this.handleAlarmPropertyChange, this, !0);
  // ext
  this.__accessor = ['removeAlarmWhenElementIsRemoved'],
  this._name = 'AlarmBox',
  this._removeAlarmWhenAlarmIsCleared = !1,
  this._removeAlarmWhenElementIsRemoved = !0,
  this.getElementBox = function() {
    return this._elementBox;
  },
  this.isRemoveAlarmWhenAlarmIsCleared = function() {
    return this._removeAlarmWhenAlarmIsCleared;
  },
  this.setRemoveAlarmWhenAlarmIsCleared = function(a) {
    var b = this._removeAlarmWhenAlarmIsCleared;
    this._removeAlarmWhenAlarmIsCleared = a,
      this.firePropertyChange('removeAlarmWhenAlarmIsCleared', b, a),
      a && this.toDatas(function(a) {
        return a.isCleared();
      }).forEach(this.remove, this);
  },
  this.getAlarmElementMapping = function() {
    return this._alarmElementMapping;
  },
  this.setAlarmElementMapping = function(a) {
    if (!a) {throw 'alarmElementMapping can not be null';}
    if (this._alarmElementMapping === a) {return;}
    var b = this._alarmElementMapping;
    this.getDatas().forEach(this._decreaseAlarmState, this),
      this._alarmElementMapping = a,
      this.getDatas().forEach(this._increaseAlarmState, this),
      this.firePropertyChange('alarmElementMapping', b, a);
  },
  this.handleElementBoxChange = function(a) {
    a.kind === 'add' ? this.handleElementAdded(a.data) : a.kind === 'remove' ? (this.handleElementRemoved(a.data), this._removeAlarmWhenElementIsRemoved && this.removeAlarmsByElement(a.data)) : a.kind === 'clear' && (a.datas.forEach(this.handleElementRemoved, this), this._removeAlarmWhenElementIsRemoved && this.clear());
  },
  this.handleAlarmBoxChange = function(a) {
    a.kind === 'add' ? this._increaseAlarmState(a.data) : a.kind === 'remove' ? this._decreaseAlarmState(a.data) : a.kind === 'clear' && a.datas.forEach(this._decreaseAlarmState, this);
  },
  this.handleAlarmPropertyChange = function(a) {
    var b = a.source;
    b.isCleared() || (a.property === 'alarmSeverity' ? this.handleAlarmSeverityChange(b, a) : a.property === 'acked' && this.handleAckedChange(b, a)),
      a.property === 'cleared' && (b.isCleared() ? (this._decreaseAlarmState(b, !0), this._removeAlarmWhenAlarmIsCleared && this.remove(b)) : this._increaseAlarmState(b, !0));
  },
  this.handleAckedChange = function(a, b) {
    if (!a.getAlarmSeverity()) {return;}
    var c = this.getCorrespondingElements(a);
    if (c) {for (var d = 0; d < c.size(); d++) {
      var e = c.get(d);
      b.oldValue ? e.getAlarmState().decreaseAcknowledgedAlarm(a.getAlarmSeverity()) : e.getAlarmState().decreaseNewAlarm(a.getAlarmSeverity()),
        b.newValue ? e.getAlarmState().increaseAcknowledgedAlarm(a.getAlarmSeverity()) : e.getAlarmState().increaseNewAlarm(a.getAlarmSeverity());
    }}
  },
  this.handleAlarmSeverityChange = function(a, b) {
    var c = b.oldValue,
      d = b.newValue,
      e = this.getCorrespondingElements(a);
    if (e) {for (var f = 0; f < e.size(); f++) {
      var g = e.get(f);
      c && (a.isAcked() ? g.getAlarmState().decreaseAcknowledgedAlarm(c) : g.getAlarmState().decreaseNewAlarm(c)),
        d && (a.isAcked() ? g.getAlarmState().increaseAcknowledgedAlarm(d) : g.getAlarmState().increaseNewAlarm(d));
    }}
  },
  this.getCorrespondingAlarms = function(a) {
    return this._alarmElementMapping.getCorrespondingAlarms(a);
  },
  this.getCorrespondingElements = function(a) {
    return this._alarmElementMapping.getCorrespondingElements(a);
  },
  this.handleElementAdded = function(a) {
    var b = this.getCorrespondingAlarms(a);
    if (b) {for (var c = 0; c < b.size(); c++) {
      var d = b.get(c);
      if (d.isCleared()) {continue;}
      var e = d.getAlarmSeverity();
      e && (d.isAcked() ? a.getAlarmState().increaseAcknowledgedAlarm(e) : a.getAlarmState().increaseNewAlarm(e));
    }}
  },
  this._increaseAlarmState = function(a, b) {
    if (a.isCleared() && !b) {return;}
    var c = a.getAlarmSeverity();
    if (c) {
      var d = this.getCorrespondingElements(a);
      if (d) {for (var e = 0; e < d.size(); e++) {
        var f = d.get(e);
        a.isAcked() ? f.getAlarmState().increaseAcknowledgedAlarm(c) : f.getAlarmState().increaseNewAlarm(c);
      }}
    }
  },
  this._decreaseAlarmState = function(a, b) {
    if (a.isCleared() && !b) {return;}
    var c = a.getAlarmSeverity();
    if (!c) {return;}
    var d = this.getCorrespondingElements(a);
    if (d) {for (var e = 0; e < d.size(); e++) {
      var f = d.get(e);
      a.isAcked() ? f.getAlarmState().decreaseAcknowledgedAlarm(c) : f.getAlarmState().decreaseNewAlarm(c);
    }}
  },
  this.handleElementRemoved = function(a) {
    var b = this.getCorrespondingAlarms(a);
    b && b.forEach(function(b) {
      !b.isCleared() && b.getAlarmSeverity() && (b.isAcked() ? a.getAlarmState().decreaseAcknowledgedAlarm(b.getAlarmSeverity()) : a.getAlarmState().decreaseNewAlarm(b.getAlarmSeverity()));
    });
  },
  this.removeAlarmsByElement = function(a) {
    var b = this.getCorrespondingAlarms(a);
    b && b.forEach(this.remove, this);
  },
  this.add = function(a, b) {
    if (!a.IAlarm) {throw 'Only IAlarm can be added into AlarmBox';}
    if (this._removeAlarmWhenAlarmIsCleared && a.isCleared()) {return;}
    AlarmBox.superClass.add.apply(this, arguments);
  };
};

Extends('third.AlarmBox', DataBox, AlarmBox);
// AlarmBox.prototype = new DataBox;

AlarmBox.prototype.getClassName = function(){
  return 'third.AlarmBox';
};

module.exports = AlarmBox;
