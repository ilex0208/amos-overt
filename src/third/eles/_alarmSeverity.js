const _third = require('./../core/_third')._third;
const List = require('./../core/_list');

let AlarmSeverity = function(a, b, c, d, e) {
  this.value = a,
  this.name = b,
  this.nickName = c,
  this.color = d,
  this.displayName = e;
};
_third.ext('third.AlarmSeverity', Object, {
  toString: function() {
    return this.displayName ? this.displayName : this.name;
  }
}),
function() {
  var a = AlarmSeverity;
  a.severities = new List,
    a._vm = {},
    a._nm = {},
    a._cp = function(a, b) {
      if (a && b) {
        var c = a.value - b.value;
        return c > 0 ? 1 : c < 0 ? -1 : 0;
      }
      return a && !b ? 1 : !a && b ? -1 : 0;
    },
    a.forEach = function(b, c) {
      a.severities.forEach(b, c);
    },
    a.getSortFunction = function() {
      return a._cp;
    },
    a.setSortFunction = function(b) {
      a._cp = b,
        a.severities.sort(b);
    },
    a.add = function(b, c, d, e, f) {
      var g = new a(b, c, d, e, f);
      return a._vm[b] = g,
        a._nm[c] = g,
        a.severities.add(g),
        a.severities.sort(a._cp),
        g;
    },
    a.remove = function(b) {
      var c = a._nm[b];
      return c && (delete a._nm[b], delete a._vm[c.value], a.severities.remove(c)),
        c;
    },
    a.CRITICAL = a.add(500, 'Critical', 'C', '#FF0000'),
    a.MAJOR = a.add(400, 'Major', 'M', '#FFA000'),
    a.MINOR = a.add(300, 'Minor', 'm', '#FFFF00'),
    a.WARNING = a.add(200, 'Warning', 'W', '#00FFFF'),
    a.INDETERMINATE = a.add(100, 'Indeterminate', 'N', '#C800FF'),
    a.CLEARED = a.add(0, 'Cleared', 'R', '#00FF00'),
    a.isClearedAlarmSeverity = function(a) {
      return a ? a.value === 0 : !1;
    },
    a.getByName = function(b) {
      return a._nm[b];
    },
    a.getByValue = function(b) {
      return a._vm[b];
    },
    a.clear = function() {
      a.severities.clear(),
        a._vm = {},
        a._nm = {};
    },
    a.compare = function(b, c) {
      return a._cp(b, c);
    };
} ();

module.exports = AlarmSeverity;
