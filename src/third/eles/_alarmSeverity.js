
const List = require('./../core/_list');
const invokeExtends = require('./../core/_ext');

/**
 * 告警级别
 *
 * @param {any} value
 * @param {any} name
 * @param {any} nickName
 * @param {any} color
 * @param {any} displayName
 */
let AlarmSeverity = function(value, name, nickName, color, displayName) {
  this.value = value,
  this.name = name,
  this.nickName = nickName,
  this.color = color,
  this.displayName = displayName;
  // ext
  this.toString = function() {
    return this.displayName ? this.displayName : this.name;
  };
};

invokeExtends('third.AlarmSeverity', Object, AlarmSeverity);
//AlarmSeverity.prototype = new Object;
AlarmSeverity.prototype.getClassName = function(){
  return 'third.AlarmSeverity';
};

!function() {
  var _alarmSeverity = AlarmSeverity;
  _alarmSeverity.severities = new List,
    _alarmSeverity._vm = {},
    _alarmSeverity._nm = {},
    _alarmSeverity._cp = function(alarmA, alarmB) {
      if (alarmA && alarmB) {
        var c = alarmA.value - alarmB.value;
        return c > 0 ? 1 : c < 0 ? -1 : 0;
      }
      return alarmA && !alarmB ? 1 : !alarmA && alarmB ? -1 : 0;
    },
    _alarmSeverity.forEach = function(b, c) {
      _alarmSeverity.severities.forEach(b, c);
    },
    _alarmSeverity.getSortFunction = function() {
      return _alarmSeverity._cp;
    },
    _alarmSeverity.setSortFunction = function(b) {
      _alarmSeverity._cp = b,
        _alarmSeverity.severities.sort(b);
    },
    _alarmSeverity.add = function(b, c, d, e, f) {
      var g = new _alarmSeverity(b, c, d, e, f);
      return _alarmSeverity._vm[b] = g,
        _alarmSeverity._nm[c] = g,
        _alarmSeverity.severities.add(g),
        _alarmSeverity.severities.sort(_alarmSeverity._cp),
        g;
    },
    _alarmSeverity.remove = function(b) {
      var c = _alarmSeverity._nm[b];
      return c && (delete _alarmSeverity._nm[b], delete _alarmSeverity._vm[c.value], _alarmSeverity.severities.remove(c)),
        c;
    },
    _alarmSeverity.CRITICAL = _alarmSeverity.add(500, 'Critical', 'C', '#FF0000'),
    _alarmSeverity.MAJOR = _alarmSeverity.add(400, 'Major', 'M', '#FFA000'),
    _alarmSeverity.MINOR = _alarmSeverity.add(300, 'Minor', 'm', '#FFFF00'),
    _alarmSeverity.WARNING = _alarmSeverity.add(200, 'Warning', 'W', '#00FFFF'),
    _alarmSeverity.INDETERMINATE = _alarmSeverity.add(100, 'Indeterminate', 'N', '#C800FF'),
    _alarmSeverity.CLEARED = _alarmSeverity.add(0, 'Cleared', 'R', '#00FF00'),
    _alarmSeverity.isClearedAlarmSeverity = function(a) {
      return a ? _alarmSeverity.value === 0 : !1;
    },
    _alarmSeverity.getByName = function(b) {
      return _alarmSeverity._nm[b];
    },
    _alarmSeverity.getByValue = function(b) {
      return _alarmSeverity._vm[b];
    },
    _alarmSeverity.clear = function() {
      _alarmSeverity.severities.clear(),
        _alarmSeverity._vm = {},
        _alarmSeverity._nm = {};
    },
    _alarmSeverity.compare = function(b, c) {
      return _alarmSeverity._cp(b, c);
    };
} ();

module.exports = AlarmSeverity;
