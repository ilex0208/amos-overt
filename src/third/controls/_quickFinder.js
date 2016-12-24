const _third = require('./../core/_third');
const List = require('./../core/_list');
const invokeExtends = require('./../core/_ext');

let QuickFinder = function(a, b, c, e, f) {
  this._map = {};
  if (!a) {throw 'dataBox can not be null';}
  if (!b){ throw 'propertyName can not be null';}
  this._dataBox = a,
    this._propertyName = b,
    this._propertyType = c || 'accessor',
    this._propertyType === 'accessor' && (this._getter = _third.getter(b)),
    this._valueFunction = e || this.getValue,
    this._filterFunction = f || this.isInterested,
    this._dataBox.forEach(this._addData, this),
    this._dataBox.addDataBoxChangeListener(this.handleDataBoxChange, this, !0),
    this._dataBox.addDataPropertyChangeListener(this.handleDataPropertyChange, this, !0);

  // ext

  this._NULL_ = 'third-null-key',
  this.getValueFunction = function() {
    return this._valueFunction;
  },
  this.getFilterFunction = function() {
    return this._filterFunction;
  },
  this.handleDataBoxChange = function(a) {
    a.kind === 'add' ? this._addData(a.data) : a.kind === 'remove' ? this._removeData(a.data) : a.kind === 'clear' && (this._map = {});
  },
  this.handleDataPropertyChange = function(a) {
    if (!this._filterFunction.call(this, a.source)) { return; }
    if (this._propertyType !== 'accessor' || this._propertyName !== a.property) {
      if (this._propertyType !== 'style' || !a.source.IStyle || 'S:' + this._propertyName !== a.property)
      { if (this._propertyType !== 'client' || 'C:' + this._propertyName !== a.property) { return; } }
    }
    var b = this._getMap(a.oldValue);
    b && b.remove(a.source),
      this._addData(a.source);
  },
  this._getMap = function(a) {
    return a = a == null ? this._NULL_ : a,
      this._map[a];
  },
  this.find = function(a) {
    var b = this._getMap(a);
    return b ? b.toList() : new List;
  },
  this.findFirst = function(a) {
    var b = this._getMap(a);
    return !b || b.isEmpty() ? null : b.get(0);
  },
  this._addData = function(a) {
    if (!this._filterFunction.call(this, a)) { return; }
    var b = this._valueFunction.call(this, a),
      c = this._getMap(b);
    c || (c = new List, b = b == null ? this._NULL_ : b, this._map[b] = c),
      c.add(a);
  },
  this._removeData = function(a) {
    if (!this._filterFunction.call(this, a)) { return; }
    var b = this._valueFunction.call(this, a),
      c = this._getMap(b);
    c && (c.remove(a), c.isEmpty() && (b = b == null ? this._NULL_ : b, delete this._map[b]));
  },
  this.dispose = function() {
    this._dataBox.removeDataBoxChangeListener(this.handleDataBoxChange, this),
      this._dataBox.removeDataPropertyChangeListener(this.handleDataPropertyChange, this),
      delete this._dataBox;
  },
  this.getDataBox = function() {
    return this._dataBox;
  },
  this.getPropertyType = function() {
    return this._propertyType;
  },
  this.getPropertyName = function() {
    return this._propertyName;
  },
  this.isInterested = function(a) {
    return this._propertyType === 'style' && !a.IStyle ? !1 : this._propertyType === 'accessor' && this._valueFunction === this.getValue && !a[this._getter] ? !1 : !0;
  },
  this.getValue = function(a) {
    return this._propertyType === 'accessor' ? a[this._getter]() : this._propertyType === 'style' && a.getStyle ? a.getStyle(this._propertyName) : this._propertyType === 'client' && a.getClient ? a.getClient(this._propertyName) : null;
  };
};

invokeExtends('third.QuickFinder', Object, QuickFinder);
//QuickFinder.prototype = new Object;
QuickFinder.prototype.getClassName = function(){
  return 'third.QuickFinder';
};

module.exports = QuickFinder;
