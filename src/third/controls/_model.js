const EventDispatcher = require('./_eventDispatcher');
const List = require('./../core/_list');
const _third = require('./../core/_third')._third;

let PropertyChangeDispatcher = function() {
  this._dispatcher = new EventDispatcher;
};
_third.ext('third.PropertyChangeDispatcher', Object, {
  addPropertyChangeListener: function(a, b, c) {
    this._dispatcher.add(a, b, c);
  },
  removePropertyChangeListener: function(a, b) {
    this._dispatcher.remove(a, b);
  },
  firePropertyChange: function(a, b, c) {
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
  onPropertyChanged: function(a) {}
});

let SelectionModel = function(a) {
  SelectionModel.superClass.constructor.apply(this, arguments),
    this._selectionMode = 'multipleSelection',
    this._selectionList = new List,
    this._selectionChangeDispatcher = new EventDispatcher,
    this._selectionMap = {},
    this._setDataBox(a);
};
_third.ext('third.SelectionModel', PropertyChangeDispatcher, {
  getSelectionMode: function() {
    return this._selectionMode;
  },
  setSelectionMode: function(a) {
    if (this._selectionMode === a) {return;}
    if (a !== 'noneSelection' && a !== 'singleSelection' && a !== 'multipleSelection'){ return;}
    this.clearSelection();
    var b = this._selectionMode;
    this._selectionMode = a,
      this.firePropertyChange('selectionMode', b, this._selectionMode);
  },
  getDataBox: function() {
    return this._dataBox;
  },
  _setDataBox: function(a) {
    if (!a) {throw 'dataBox can not be null';}
    if (this._dataBox === a){ return;}
    this._dataBox && (this.clearSelection(), this._dataBox.removeDataBoxChangeListener(this.handleDataBoxChange, this));
    var b = this._dataBox;
    this._dataBox = a,
      this._dataBox.addDataBoxChangeListener(this.handleDataBoxChange, this, !0),
      this.firePropertyChange('dataBox', b, this._dataBox);
  },
  dispose: function() {
    this.clearSelection(),
      this._dataBox.removeDataBoxChangeListener(this.handleDataBoxChange, this);
  },
  handleDataBoxChange: function(a) {
    if (a.kind === 'remove') {
      var b = a.data;
      this.contains(b) && (this._selectionList.remove(b), delete this._selectionMap[b.getId()], this.fireSelectionChange('remove', new List(b)));
    } else {a.kind === 'clear' && this.clearSelection();}
  },
  getFilterFunction: function() {
    return this._filterFunction;
  },
  setFilterFunction: function(a) {
    if (this._filterFunction === a) {return;}
    this.clearSelection();
    var b = this._filterFunction;
    this._filterFunction = a,
      this.firePropertyChange('filterFunction', b, this._filterFunction);
  },
  fireSelectionChange: function(a, b, c) {
    c && (this._selectionList.forEach(function(a) {
      c.contains(a) ? c.remove(a) : c.add(a);
    }), b = c.toList()),
      this._selectionChangeDispatcher.fire({
        kind: a,
        datas: new List(b)
      });
  },
  addSelectionChangeListener: function(a, b, c) {
    this._selectionChangeDispatcher.add(a, b, c);
  },
  removeSelectionChangeListener: function(a, b) {
    this._selectionChangeDispatcher.remove(a, b);
  },
  _filterList: function(a, b) {
    var c = new List(a);
    for (var d = 0; d < c.size(); d++) {
      var e = c.get(d);
      if (this._filterFunction && !this._filterFunction(e) || b && this.contains(e) || !b && !this.contains(e) || !this._dataBox.contains(e)) {c.removeAt(d),
        d--;}
    }
    return c;
  },
  appendSelection: function(a) {
    if (this._selectionMode === 'noneSelection') {return;}
    var b = this._filterList(a, !0);
    if (b.isEmpty()) {return;}
    var c = null;
    this._selectionMode === 'singleSelection' && (c = new List(this._selectionList), this._selectionList.clear(), this._selectionMap = {},
      b = new List(b.get(b.size() - 1)));
    for (var d = 0; d < b.size(); d++) {
      var e = b.get(d);
      this._selectionList.add(e),
        this._selectionMap[e.getId()] = e;
    }
    this.fireSelectionChange('append', b, c);
  },
  removeSelection: function(a) {
    var b = this._filterList(a);
    if (b.size() === 0) {return;}
    for (var c = 0; c < b.size(); c++) {
      var d = b.get(c);
      this._selectionList.remove(d),
        delete this._selectionMap[d.getId()];
    }
    this.fireSelectionChange('remove', b);
  },
  toSelection: function(a, b) {
    return this._selectionList.toList(a, b);
  },
  getSelection: function() {
    return this._selectionList;
  },
  setSelection: function(a) {
    if (this._selectionMode === 'noneSelection') {return;}
    if (this._selectionList.size() === 0 && a == null) {return;}
    var b = new List(this._selectionList);
    this._selectionList.clear(),
      this._selectionMap = {};
    var c = this._filterList(a, !0);
    this._selectionMode === 'singleSelection' && c.size() > 1 && (c = new List(c.get(c.size() - 1)));
    for (var d = 0; d < c.size(); d++) {
      var e = c.get(d);
      this._selectionList.add(e),
        this._selectionMap[e.getId()] = e;
    }
    this.fireSelectionChange('set', null, b);
  },
  clearSelection: function() {
    if (this._selectionList.size() > 0) {
      var a = this._selectionList.toList();
      this._selectionList.clear(),
        this._selectionMap = {},
        this.fireSelectionChange('clear', a);
    }
  },
  selectAll: function() {
    if (this._selectionMode === 'noneSelection') {return;}
    var a = this._dataBox.toDatas(),
      b = 0,
      c = null;
    if (this._filterFunction){
      for (b = 0; b < a.size(); b++) {c = a.get(b),
        this._filterFunction(c) || (a.removeAt(b), b--);}}
    var d = new List(this._selectionList);
    this._selectionList.clear(),
      this._selectionMap = {},
      this._selectionMode === 'singleSelection' && a.size() > 1 && (a = new List(a.get(a.size() - 1)));
    for (b = 0; b < a.size(); b++) {c = a.get(b),
      this._selectionList.add(c),
      this._selectionMap[c.getId()] = c;}
    this.fireSelectionChange('all', null, d);
  },
  size: function() {
    return this._selectionList.size();
  },
  contains: function(a) {
    return a ? this._selectionMap[a.getId()] != null : !1;
  },
  getLastData: function() {
    return this._selectionList.size() > 0 ? this._selectionList.get(this._selectionList.size() - 1) : null;
  },
  getFirstData: function() {
    return this._selectionList.size() > 0 ? this._selectionList.get(0) : null;
  },
  isSelectable: function(a) {
    return a ? this._selectionMode === 'noneSelection' ? !1 : this._filterFunction && !this._filterFunction(a) ? !1 : !0 : !1;
  }
});

// 单独导出
module.exports = {
  PropertyChangeDispatcher: PropertyChangeDispatcher,
  SelectionModel: SelectionModel
};
