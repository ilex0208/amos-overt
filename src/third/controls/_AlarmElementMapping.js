
const List = require('./../core/_list');
const QuickFinder = require('./_quickFinder');
const invokeExtends = require('./../core/_ext');

let AlarmElementMapping = function(a, b) {
  if (!b) {
    throw 'ElementBox can not be null';
  }
  if (!a){
    throw 'AlarmBox can not be null';
  }
  this._elementBox = b,
  this._alarmBox = a,
  this._alarmsFinder = new QuickFinder(a, 'elementId');
  // ext
  this.getCorrespondingAlarms = function(a) {
    return this._alarmsFinder.find(a.getId());
  },
  this.getCorrespondingElements = function(a) {
    var b = this._elementBox.getDataById(a.getElementId());
    return new List(b);
  },
  this.dispose = function() {
    this._alarmsFinder.dispose(),
    delete this._elementBox,
    delete this._alarmBox,
    delete this._alarmsFinder;
  };
};


invokeExtends('third.Data', Object, AlarmElementMapping);
//AlarmElementMapping.prototype = new Object;
AlarmElementMapping.prototype.getClassName = function(){
  return 'third.AlarmElementMapping';
};

module.exports = AlarmElementMapping;
