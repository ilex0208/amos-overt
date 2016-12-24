const invokeExtends = require('./../core/_ext');
/**
 * 树的id集合
 */
let List = function() {
  // 存放ID
  this._as = [];
  if (arguments.length === 1) {
    let a = arguments[0];
    a instanceof List && (a = a._as);
    if (a instanceof Array) {
      let b = a.length;
      for (let c = 0; c < b; c++) {
        this._as.push(a[c]);
      }
    } else {
      a != null && this._as.push(a);
    }
  } else if (arguments.length > 1) {
    let b = arguments.length;
    for (let c = 0; c < b; c++) {
      this._as.push(arguments[c]);
    }
  }
  this.size = function() {
    return this._as.length;
  },
  this.isEmpty = function() {
    return this._as.length === 0;
  },
  this.add = function(a, c) {
    return c === undefined ? this._as.push(a) : this._as.splice(c, 0, a);
  },
  this.addAll = function(a) {
    a instanceof List && (a = a._as);
    if (a instanceof Array) {
      var b = a.length;
      for (var c = 0; c < b; c++) {this._as.push(a[c]);}
    } else {this._as.push(a);}
  },
  this.get = function(a) {
    return this._as[a];
  },
  this.remove = function(a) {
    var b = this._as.indexOf(a);
    return b >= 0 && b < this._as.length && this.removeAt(b),
      b;
  },
  this.removeAt = function(a) {
    return this._as.splice(a, 1)[0];
  },
  this.set = function(a, b) {
    return this._as[a] = b;
  },
  this.clear = function() {
    return this._as.splice(0, this._as.length);
  },
  this.contains = function(a) {
    return this.indexOf(a) >= 0;
  },
  this.indexOf = function(a) {
    return this._as.indexOf(a);
  },
  this.forEach = function(a, b) {
    var c = this._as.length;
    for (var d = 0; d < c; d++) {
      var e = this._as[d];
      b ? a.call(b, e) : a(e);
    }
  },
  this.forEachReverse = function(a, b) {
    var c = this._as.length;
    for (var d = c - 1; d >= 0; d--) {
      var e = this._as[d];
      b ? a.call(b, e) : a(e);
    }
  },
  this.toArray = function(a, b) {
    if (a) {
      var c = [],
        d = this._as.length;
      for (var e = 0; e < d; e++) {
        var f = this._as[e];
        b ? a.call(b, f) && c.push(f) : a(f) && c.push(f);
      }
      return c;
    }
    return this._as.concat();
  },
  this.toList = function(a, b) {
    if (a) {
      var c = new List,
        d = this._as.length;
      for (var e = 0; e < d; e++) {
        var f = this._as[e];
        b ? a.call(b, f) && c.add(f) : a(f) && c.add(f);
      }
      return c;
    }
    return new List(this);
  },
  this.sort = function(a) {
    return a ? this._as.sort(a) : this._as.sort(),
      this;
  },
  this.toString = function() {
    return this._as.toString();
  };
};

invokeExtends('third.List', Object, List);
//List.property = new Object,
List.prototype.getClassName = function(){
  return 'third.List';
};
module.exports = List;
