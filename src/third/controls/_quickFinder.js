const _third = require('./../core/_third')._third;
const List = require('./../core/_list');

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
};
_third.ext('third.QuickFinder', Object, {
  _NULL_: 'third-null-key',
  getValueFunction: function() {
    return this._valueFunction;
  },
  getFilterFunction: function() {
    return this._filterFunction;
  },
  handleDataBoxChange: function(a) {
    a.kind === 'add' ? this._addData(a.data) : a.kind === 'remove' ? this._removeData(a.data) : a.kind === 'clear' && (this._map = {});
  },
  handleDataPropertyChange: function(a) {
    if (!this._filterFunction.call(this, a.source)) { return; }
    if (this._propertyType !== 'accessor' || this._propertyName !== a.property) {
      if (this._propertyType !== 'style' || !a.source.IStyle || 'S:' + this._propertyName !== a.property)
      { if (this._propertyType !== 'client' || 'C:' + this._propertyName !== a.property) { return; } }
    }
    var b = this._getMap(a.oldValue);
    b && b.remove(a.source),
      this._addData(a.source);
  },
  _getMap: function(a) {
    return a = a == null ? this._NULL_ : a,
      this._map[a];
  },
  find: function(a) {
    var b = this._getMap(a);
    return b ? b.toList() : new List;
  },
  findFirst: function(a) {
    var b = this._getMap(a);
    return !b || b.isEmpty() ? null : b.get(0);
  },
  _addData: function(a) {
    if (!this._filterFunction.call(this, a)) { return; }
    var b = this._valueFunction.call(this, a),
      c = this._getMap(b);
    c || (c = new List, b = b == null ? this._NULL_ : b, this._map[b] = c),
      c.add(a);
  },
  _removeData: function(a) {
    if (!this._filterFunction.call(this, a)) { return; }
    var b = this._valueFunction.call(this, a),
      c = this._getMap(b);
    c && (c.remove(a), c.isEmpty() && (b = b == null ? this._NULL_ : b, delete this._map[b]));
  },
  dispose: function() {
    this._dataBox.removeDataBoxChangeListener(this.handleDataBoxChange, this),
      this._dataBox.removeDataPropertyChangeListener(this.handleDataPropertyChange, this),
      delete this._dataBox;
  },
  getDataBox: function() {
    return this._dataBox;
  },
  getPropertyType: function() {
    return this._propertyType;
  },
  getPropertyName: function() {
    return this._propertyName;
  },
  isInterested: function(a) {
    return this._propertyType === 'style' && !a.IStyle ? !1 : this._propertyType === 'accessor' && this._valueFunction === this.getValue && !a[this._getter] ? !1 : !0;
  },
  getValue: function(a) {
    return this._propertyType === 'accessor' ? a[this._getter]() : this._propertyType === 'style' && a.getStyle ? a.getStyle(this._propertyName) : this._propertyType === 'client' && a.getClient ? a.getClient(this._propertyName) : null;
  }
});

module.exports = QuickFinder;
