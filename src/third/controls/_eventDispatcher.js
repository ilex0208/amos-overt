const List = require('./../core/_list');
const Extends = require('./../core/_ext');

const EventDispatcher = function() {
  // ext
  this.contains = function(a, b) {
    if (this._ls) {
      for (var c = 0, d = this._ls.size(), e; c < d; c++) {
        e = this._ls.get(c);
        if (a === e.l && b === e.s) {return !0;}
      }
    }
    return !1;
  },
  this.add = function(a, b, c) {
    var d = {
      l: a,
      s: b,
      a: c
    };
    this._ls || (this._ls = new List),
      this._f ? (this._addPendings || (this._addPendings = new List), this._addPendings.add(d)) : d.a ? this._ls.add(d, 0) : this._ls.add(d);
  },
  this.remove = function(a, b) {
    this._ls && (this._f ? (this._removePendings || (this._removePendings = new List), this._removePendings.add({
      l: a,
      s: b
    })) : this._remove(a, b));
  },
  this._remove = function(a, b) {
    for (var c = 0,
      d = this._ls.size(), e; c < d; c++) {
      e = this._ls.get(c);
      if (e.l === a && e.s === b) {
        this._ls.removeAt(c);
        return;
      }
    }
  },
  this.fire = function(a) {
    if (this._ls) {
      var b, c = this._ls.size(),
        d;
      this._f = !0;
      for (b = 0; b < c; b++) {d = this._ls.get(b),
        d.s ? d.l.call(d.s, a) : d.l(a);}
      this._f = !1;
      if (this._removePendings) {
        c = this._removePendings.size();
        for (b = 0; b < c; b++) {d = this._removePendings.get(b),
          this._remove(d.l, d.s);}
        delete this._removePendings;
      }
      if (this._addPendings) {
        c = this._addPendings.size();
        for (b = 0; b < c; b++) {d = this._addPendings.get(b),
          d.a ? this._ls.add(d, 0) : this._ls.add(d);}
        delete this._addPendings;
      }
    }
  };
};

Extends('third.EventDispatcher', Object, EventDispatcher);

EventDispatcher.prototype.getClassName = function(){
  return 'third.EventDispatcher';
};

module.exports = EventDispatcher;
