const Data = require('./_tData');

const Extends = require('./../core/_ext');

let Layer = function(a) {
  Layer.superClass.constructor.call(this, a);
  // ext
  this.ILayer = !0,
  this.__accessor = ['visible', 'movable', 'editable', 'rotatable'],
  this._visible = !0,
  this._movable = !0,
  this._editable = !0,
  this._rotatable = !0,
  this._name = 'Default';
};

Extends('third.Layer', Data, Layer);
//Layer.prototype = new Data;
Layer.prototype.getClassName = function(){
  return 'third.Layer';
};

module.exports = Layer;
