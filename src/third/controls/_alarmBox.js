const _third = require('./../core/_third')._third;
const List = require('./../core/_list');
const DataBox = require('./_db').DataBox;
const QuickFinder = require('./_quickFinder');

let AlarmElementMapping = function(a, b) {
  if (!b) {throw 'ElementBox can not be null';}
  if (!a){ throw 'AlarmBox can not be null';}
  this._elementBox = b,
  this._alarmBox = a,
  this._alarmsFinder = new QuickFinder(a, 'elementId');
};
_third.ext('third.AlarmElementMapping', Object, {
  getCorrespondingAlarms: function(a) {
    return this._alarmsFinder.find(a.getId());
  },
  getCorrespondingElements: function(a) {
    var b = this._elementBox.getDataById(a.getElementId());
    return new List(b);
  },
  dispose: function() {
    this._alarmsFinder.dispose(),
    delete this._elementBox,
    delete this._alarmBox,
    delete this._alarmsFinder;
  }
});

let AlarmBox = function(a) {
  if (!a) {throw 'elementBox can not be null.';}
  AlarmBox.superClass.constructor.call(this),
  this._elementBox = a,
  this._alarmElementMapping = new AlarmElementMapping(this, a),
  this._elementBox.addDataBoxChangeListener(this.handleElementBoxChange, this, !0),
  this.addDataBoxChangeListener(this.handleAlarmBoxChange, this, !0),
  this.addDataPropertyChangeListener(this.handleAlarmPropertyChange, this, !0);
};
_third.ext('third.AlarmBox', DataBox, {
  __accessor: ['removeAlarmWhenElementIsRemoved'],
  _name: 'AlarmBox',
  _removeAlarmWhenAlarmIsCleared: !1,
  _removeAlarmWhenElementIsRemoved: !0,
  getElementBox: function() {
    return this._elementBox;
  },
  isRemoveAlarmWhenAlarmIsCleared: function() {
    return this._removeAlarmWhenAlarmIsCleared;
  },
  setRemoveAlarmWhenAlarmIsCleared: function(a) {
    var b = this._removeAlarmWhenAlarmIsCleared;
    this._removeAlarmWhenAlarmIsCleared = a,
      this.firePropertyChange('removeAlarmWhenAlarmIsCleared', b, a),
      a && this.toDatas(function(a) {
        return a.isCleared();
      }).forEach(this.remove, this);
  },
  getAlarmElementMapping: function() {
    return this._alarmElementMapping;
  },
  setAlarmElementMapping: function(a) {
    if (!a) {throw 'alarmElementMapping can not be null';}
    if (this._alarmElementMapping === a) {return;}
    var b = this._alarmElementMapping;
    this.getDatas().forEach(this._decreaseAlarmState, this),
      this._alarmElementMapping = a,
      this.getDatas().forEach(this._increaseAlarmState, this),
      this.firePropertyChange('alarmElementMapping', b, a);
  },
  handleElementBoxChange: function(a) {
    a.kind === 'add' ? this.handleElementAdded(a.data) : a.kind === 'remove' ? (this.handleElementRemoved(a.data), this._removeAlarmWhenElementIsRemoved && this.removeAlarmsByElement(a.data)) : a.kind === 'clear' && (a.datas.forEach(this.handleElementRemoved, this), this._removeAlarmWhenElementIsRemoved && this.clear());
  },
  handleAlarmBoxChange: function(a) {
    a.kind === 'add' ? this._increaseAlarmState(a.data) : a.kind === 'remove' ? this._decreaseAlarmState(a.data) : a.kind === 'clear' && a.datas.forEach(this._decreaseAlarmState, this);
  },
  handleAlarmPropertyChange: function(a) {
    var b = a.source;
    b.isCleared() || (a.property === 'alarmSeverity' ? this.handleAlarmSeverityChange(b, a) : a.property === 'acked' && this.handleAckedChange(b, a)),
      a.property === 'cleared' && (b.isCleared() ? (this._decreaseAlarmState(b, !0), this._removeAlarmWhenAlarmIsCleared && this.remove(b)) : this._increaseAlarmState(b, !0));
  },
  handleAckedChange: function(a, b) {
    if (!a.getAlarmSeverity()) {return;}
    var c = this.getCorrespondingElements(a);
    if (c) {for (var d = 0; d < c.size(); d++) {
      var e = c.get(d);
      b.oldValue ? e.getAlarmState().decreaseAcknowledgedAlarm(a.getAlarmSeverity()) : e.getAlarmState().decreaseNewAlarm(a.getAlarmSeverity()),
        b.newValue ? e.getAlarmState().increaseAcknowledgedAlarm(a.getAlarmSeverity()) : e.getAlarmState().increaseNewAlarm(a.getAlarmSeverity());
    }}
  },
  handleAlarmSeverityChange: function(a, b) {
    var c = b.oldValue,
      d = b.newValue,
      e = this.getCorrespondingElements(a);
    if (e) {for (var f = 0; f < e.size(); f++) {
      var g = e.get(f);
      c && (a.isAcked() ? g.getAlarmState().decreaseAcknowledgedAlarm(c) : g.getAlarmState().decreaseNewAlarm(c)),
        d && (a.isAcked() ? g.getAlarmState().increaseAcknowledgedAlarm(d) : g.getAlarmState().increaseNewAlarm(d));
    }}
  },
  getCorrespondingAlarms: function(a) {
    return this._alarmElementMapping.getCorrespondingAlarms(a);
  },
  getCorrespondingElements: function(a) {
    return this._alarmElementMapping.getCorrespondingElements(a);
  },
  handleElementAdded: function(a) {
    var b = this.getCorrespondingAlarms(a);
    if (b) {for (var c = 0; c < b.size(); c++) {
      var d = b.get(c);
      if (d.isCleared()) {continue;}
      var e = d.getAlarmSeverity();
      e && (d.isAcked() ? a.getAlarmState().increaseAcknowledgedAlarm(e) : a.getAlarmState().increaseNewAlarm(e));
    }}
  },
  _increaseAlarmState: function(a, b) {
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
  _decreaseAlarmState: function(a, b) {
    if (a.isCleared() && !b) {return;}
    var c = a.getAlarmSeverity();
    if (!c) {return;}
    var d = this.getCorrespondingElements(a);
    if (d) {for (var e = 0; e < d.size(); e++) {
      var f = d.get(e);
      a.isAcked() ? f.getAlarmState().decreaseAcknowledgedAlarm(c) : f.getAlarmState().decreaseNewAlarm(c);
    }}
  },
  handleElementRemoved: function(a) {
    var b = this.getCorrespondingAlarms(a);
    b && b.forEach(function(b) {
      !b.isCleared() && b.getAlarmSeverity() && (b.isAcked() ? a.getAlarmState().decreaseAcknowledgedAlarm(b.getAlarmSeverity()) : a.getAlarmState().decreaseNewAlarm(b.getAlarmSeverity()));
    });
  },
  removeAlarmsByElement: function(a) {
    var b = this.getCorrespondingAlarms(a);
    b && b.forEach(this.remove, this);
  },
  add: function(a, b) {
    if (!a.IAlarm) {throw 'Only IAlarm can be added into AlarmBox';}
    if (this._removeAlarmWhenAlarmIsCleared && a.isCleared()) {return;}
    AlarmBox.superClass.add.apply(this, arguments);
  }
});

// 单独导出
module.exports = {
  AlarmBox: AlarmBox,
  AlarmElementMapping: AlarmElementMapping
};
