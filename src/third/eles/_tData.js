
const PropertyChangeDispatcher = require('./../controls/_model').PropertyChangeDispatcher;
const List = require('./../core/_list');
const _third = require('./../core/_third')._third;

const _con = require('./../constants/index');
const Bd = _con.Bd;

let Data = function(a) {
  Data.superClass.constructor.apply(this, arguments),
    this._childList = new List,
    this._childMap = {},
    this._clientMap = {};
  if (a === undefined || a === null) {this._id = _third.id();}
  else if (typeof a == 'string' || typeof a == 'number' || typeof a == 'boolean') {this._id = a;}
  else {
    for (var e in a)
      {if (e === 'clients')
       { for (var f in a.clients) {this._clientMap[f] = a.clients[f];}}
      else if (e === 'styles')
        {for (var g in a.styles) {this._styleMap[g] = a.styles[g];}}
    else {a[e] != null && (this['_' + e] = a[e]);}}
    this._id == null && (this._id = _third.id());
  }
};
_third.ext('three.Data', PropertyChangeDispatcher, {
  IData: !0,
  IClient: !0,
  __client: 1,
  __new: 1,
  _parent: null,
  __accessor: ['name', 'name2', 'icon', 'toolTip'],
  _icon: Bd.ICON_DATA,
  getId: function() {
    return this._id;
  },
  getChildren: function() {
    return this._childList;
  },
  getChildrenSize: function() {
    return this._childList.size();
  },
  toChildren: function(a, b) {
    return this._childList.toList(a, b);
  },
  addChild: function(a, c) {
    c === undefined && (c = this._childList.size());
    if (!a || a === this) {return !1;}
    if (this._childMap[a.getId()]) {return !1;}
    if (this.isDescendantOf(a)) {return !1;}
    a.getParent() && a.getParent().removeChild(a);
    if (c < 0 || c > this._childList.size()) {c = this._childList.size();}
    return this._childList.add(a, c),
      this._childMap[a._id] = a,
      a.setParent(this),
      this.firePropertyChange('children', null, a),
      this.onChildAdded(a, c), !0;
  },
  onChildAdded: function(a, b) {},
  removeChild: function(a) {
    if (!a) {return !1;}
    if (!this._childMap[a._id]) {return !1;}
    var b = this._childList.remove(a);
    return delete this._childMap[a._id],
      this.firePropertyChange('children', a, null),
      a.setParent(null),
      this.onChildRemoved(a, b), !0;
  },
  onChildRemoved: function(a, b) {},
  getChildAt: function(a) {
    return this._childList.get(a);
  },
  clearChildren: function() {
    if (this._childList.size() === 0) {return !1;}
    var a = this._childList.toArray(),
      b = a.length;
    for (var c = 0; c < b; c++) {this.removeChild(a[c]);}
    return this.onChildrenCleared(a), !0;
  },
  onChildrenCleared: function(a) {},
  getParent: function() {
    return this._parent;
  },
  setParent: function(a) {
    if (this._isUpdatingParent || this._parent === a || this === a) {return;}
    if (a && a.isDescendantOf(this)) {return;}
    var b = this._parent;
    this._parent = a,
      this._isUpdatingParent = !0,
      b && b.removeChild(this),
      a && a.addChild(this),
      delete this._isUpdatingParent,
      this.firePropertyChange('parent', b, a),
      this.onParentChanged(b, a);
  },
  onParentChanged: function(a, b) {},
  hasChildren: function() {
    return this._childList.size() > 0;
  },
  isRelatedTo: function(a) {
    return a ? this.isDescendantOf(a) || a.isDescendantOf(this) : !1;
  },
  isParentOf: function(a) {
    return a ? this._childMap[a._id] != null : !1;
  },
  isDescendantOf: function(a) {
    if (!a) {return !1;}
    if (!a.hasChildren()) {return !1;}
    var b = this._parent;
    while (b) {
      if (a === b) {return !0;}
      b = b.getParent();
    }
    return !1;
  },
  toString: function() {
    return this.getName() ? this.getName() : this._id;
  }
});

module.exports = Data;
