
const DataBox = require('./_db');
const invokeExtends = require('./../core/_ext');

let ColumnBox = function(a) {
  ColumnBox.superClass.constructor.apply(this, arguments);
  // ext
  this._name = 'ColumnBox',
  this.add = function(a, b) {
    if (!a.IColumn) {throw 'Only IColumn can be added into ColumnBox';}
    ColumnBox.superClass.add.apply(this, arguments);
  };
};

invokeExtends('third.ColumnBox', DataBox, ColumnBox);
//ColumnBox.property = new DataBox;
ColumnBox.prototype.getClassName = function(){
  return 'third.ColumnBox';
};

module.exports = ColumnBox;