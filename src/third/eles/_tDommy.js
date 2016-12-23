
const Telement = require('./_tElement');
const Extends = require('./../core/_ext');

let Dummy = function(a) {
  Dummy.superClass.constructor.call(this, a);
  // ext
  this.IDummy = !0;
};

Extends('third.Dummy', Telement, Dummy);
//Dummy.prototype = new Telement;
Dummy.prototype.getClassName = function(){
  return 'third.Dummy';
};

module.exports = Dummy;
