const EventDispatcher = require('./_eventDispatcher');
const Extends = require('./../core/_ext');

let PropertyChangeDispatcher = function() {
  this._dispatcher = new EventDispatcher;
  // ext
  this.addPropertyChangeListener = function(a, b, c) {
    this._dispatcher.add(a, b, c);
  },
  this.removePropertyChangeListener = function(a, b) {
    this._dispatcher.remove(a, b);
  },
  this.firePropertyChange = function(a, b, c) {
    if (b == c) {return !1;}
    var d = {
      property: a,
      oldValue: b,
      newValue: c,
      source: this
    };
    return this._dispatcher.fire(d),
        this.onPropertyChanged(d), !0;
  },
  this.onPropertyChanged = function(a) {};
};

Extends('third.PropertyChangeDispatcher', Object, PropertyChangeDispatcher);
//PropertyChangeDispatcher.prototype = new Object;
PropertyChangeDispatcher.prototype.getClassName = function(){
  return 'third.PropertyChangeDispatcher';
};
module.exports = PropertyChangeDispatcher;