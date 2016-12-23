const EventDispatcher = require('./_eventDispatcher');
const SelectionModel = require('./_model').SelectionModel;
const PropertyChangeDispatcher = require('./_model').PropertyChangeDispatcher;
const List = require('./../core/_list');
const _third = require('./../core/_third')._third;

const _con = require('./../constants/index');
const Bd = _con.Bd;

const Tnode = require('./../eles/_tNode');
const Tlink = require('./../eles/_tLink').Tlink;
const Follower = require('./../eles/_tLink').Follower;
const box = require('./_box');

let DataBox = function(a) {
  DataBox.superClass.constructor.apply(this, arguments),
  arguments.length === 1 && (this._name = a),
  this._dataList = new List,
  this._dataMap = {},
  this._rootList = new List,
  this._rootMap = {},
  this._clientMap = {},
  this._dataBoxChangeDispatcher = new EventDispatcher,
  this._dataPropertyChangeDispatcher = new EventDispatcher,
  this._hierarchyChangeDispatcher = new EventDispatcher,
  this._selectionModel = new SelectionModel(this);
};
_third.ext('third.DataBox', PropertyChangeDispatcher, {
  IClient: !0,
  __client: 1,
  __new: 1,
  _limit: -1,
  _name: 'DataBox',
  _icon: Bd.ICON_DATABOX,
  __accessor: ['name', 'icon', 'toolTip'],
  getSelectionModel: function() {
    return this._selectionModel;
  },
  size: function() {
    return this._dataList.size();
  },
  isEmpty: function() {
    return this._dataList.isEmpty();
  },
  getLimit: function() {
    return this._limit;
  },
  setLimit: function(a) {
    var b = this._limit;
    this._limit = a,
      this.firePropertyChange('limit', b, a),
      this._checkLimit();
  },
  _checkLimit: function() {
    this._limit >= 0 && this.size() > this._limit && this.removeFirst(this.size() - this._limit);
  },
  removeFirst: function(a) {
    arguments.length === 0 && (a = 1);
    while (a > 0 && this._dataList.size() > 0) {
      var b = this._dataList.get(0);
      this.remove(b),
        a--;
    }
  },
  getSiblings: function(a) {
    if (!this.contains(a)){ throw a + ' dosen\'t belong to this dataBox';}
    var b = a.getParent();
    return b ? b.getChildren() : this._rootList;
  },
  getRoots: function() {
    return this._rootList;
  },
  getSiblingIndex: function(a) {
    return a.getParent() ? a.getParent().getChildren().indexOf(a) : this._rootList.indexOf(a);
  },
  getDatas: function() {
    return this._dataList;
  },
  getDataAt: function(a) {
    return this._dataList.get(a);
  },
  toDatas: function(a, b) {
    return this._dataList.toList(a, b);
  },
  forEach: function(a, b) {
    this._dataList.forEach(a, b);
  },
  forEachReverse: function(a, b) {
    this._dataList.forEachReverse(a, b);
  },
  forEachByDepthFirst: function(a, b, c) {
    if (b) {this._depthFirst(a, b, c);}
    else {
      var d = this._rootList.size();
      for (var e = 0; e < d; e++) {
        var f = this._rootList.get(e);
        if (this._depthFirst(a, f, c) === !1) {return;}
      }
    }
  },
  _depthFirst: function(a, b, c) {
    var d = b.getChildrenSize();
    for (var e = 0; e < d; e++) {
      var f = b.getChildAt(e);
      if (this._depthFirst(a, f, c) === !1) {return !1;}
    }
    if (c) {
      if (a.call(c, b) === !1){ return !1;}
    } else if (a(b) === !1) {return !1;}
  },
  forEachByBreadthFirst: function(a, b, c) {
    var d = new List;
    b ? d.add(b) : this._rootList.forEach(d.add, d);
    while (d.size() > 0) {
      b = d.removeAt(0),
        b.getChildren().forEach(d.add, d);
      if (c) {
        if (a.call(c, b) === !1) {return;}
      } else if (a(b) === !1) {return;}
    }
  },
  add: function(a, b) {
    if (!a) {return;}
    arguments.length === 1 && (b = -1);
    var c = a.getId();
    if (this._dataMap.hasOwnProperty(c)) {throw 'Data with ID \'' + c + '\' already exists';}
    this._dataMap[c] = a,
      this._dataList.add(a),
      a.getParent() || (this._rootMap[c] = a, b >= 0 ? this._rootList.add(a, b) : this._rootList.add(a)),
      a.addPropertyChangeListener(this.handleDataPropertyChange, this, !0),
      this._dataBoxChangeDispatcher.fire({
        kind: 'add',
        data: a
      }),
      this._checkLimit();
  },
  remove: function(a) {
    this.removeById(a.getId());
  },
  removeSelection: function() {
    this._selectionModel.toSelection().forEach(function(a) {
      this.remove(a);
    },
      this);
  },
  removeById: function(a) {
    var b = this.getDataById(a);
    if (!b) {return;}
    b instanceof Tlink && (b.setFromNode(null), b.setToNode(null)),
      b instanceof Tnode && b.getLinks() && b.getLinks().toList().forEach(function(a) {
        this.remove(a);
      },
        this),
      b instanceof Tnode && b.getFollowers() && b.getFollowers().toList().forEach(function(a) {
        a.setHost(null);
      }),
      b instanceof Follower && b.getHost() && b.setHost(null),
      b.toChildren().forEach(function(a) {
        this.remove(a);
      },
        this),
      b.getParent() && b.getParent().removeChild(b),
      this._dataList.remove(b),
      delete this._dataMap[a],
      this._rootMap[a] && (delete this._rootMap[a], this._rootList.remove(b)),
      this._dataBoxChangeDispatcher.fire({
        kind: 'remove',
        data: b
      }),
      b.removePropertyChangeListener(this.handleDataPropertyChange, this);
  },
  clear: function() {
    if (this._dataList.size() > 0) {
      this._dataList.forEach(function(a) {
        a.removePropertyChangeListener(this.handleDataPropertyChange, this);
      },
        this);
      var a = this._dataList.toList();
      this._dataList.clear(),
        this._dataMap = {},
        this._rootList.clear(),
        this._rootMap = {},
        this._dataBoxChangeDispatcher.fire({
          kind: 'clear',
          datas: a
        });
    }
  },
  getDataById: function(a) {
    return this._dataMap[a];
  },
  containsById: function(a) {
    return this._dataMap.hasOwnProperty(a);
  },
  contains: function(a) {
    return a ? this._dataMap[a._id] === a : !1;
  },
  moveTo: function(a, b) {
    if (!this.contains(a)) {throw a + ' dosen\'t belong to this dataBox';}
    var c = this.getSiblings(a),
      d = c.indexOf(a);
    if (d === b || d < 0){ return;}
    b >= 0 && b <= c.size() && (c.remove(a), b > c.size() && b-- , c.add(a, b), this._hierarchyChangeDispatcher.fire({
      data: a,
      oldIndex: d,
      newIndex: b
    }));
  },
  moveUp: function(a) {
    var b = this.getSiblings(a);
    this.moveTo(a, b.indexOf(a) - 1);
  },
  moveDown: function(a) {
    var b = this.getSiblings(a);
    this.moveTo(a, b.indexOf(a) + 1);
  },
  moveToTop: function(a) {
    this.moveTo(a, 0);
  },
  moveToBottom: function(a) {
    var b = this.getSiblings(a);
    this.moveTo(a, b.size());
  },
  moveSelectionUp: function(a) {
    a || (a = this._selectionModel);
    var b = new List;
    box.findMoveUpDatas(a, b, this._rootList),
      b.forEach(this.moveUp, this);
  },
  moveSelectionDown: function(a) {
    a || (a = this._selectionModel);
    var b = new List;
    box.findMoveDownDatas(a, b, this._rootList),
      b.forEach(this.moveDown, this);
  },
  moveSelectionToTop: function(a) {
    a || (a = this._selectionModel);
    var b = new List;
    box.findMoveToTopDatas(a, b, this._rootList),
      b.forEach(this.moveToTop, this);
  },
  moveSelectionToBottom: function(a) {
    a || (a = this._selectionModel);
    var b = new List;
    box.findMoveToBottomDatas(a, b, this._rootList),
      b.forEach(this.moveToBottom, this);
  },
  handleDataPropertyChange: function(a) {
    var b = a.source;
    if (a.property === 'parent') {
      var c = b.getId();
      b.getParent() ? this._rootMap[c] && (delete this._rootMap[c], this._rootList.remove(b)) : this._rootMap[c] || (this._rootMap[c] = b, this._rootList.add(b));
    }
    this.onDataPropertyChanged(b, a),
      this._dataPropertyChangeDispatcher.fire(a);
  },
  onDataPropertyChanged: function(a, b) { },
  addDataBoxChangeListener: function(a, b, c) {
    this._dataBoxChangeDispatcher.add(a, b, c);
  },
  removeDataBoxChangeListener: function(a, b) {
    this._dataBoxChangeDispatcher.remove(a, b);
  },
  addDataPropertyChangeListener: function(a, b, c) {
    this._dataPropertyChangeDispatcher.add(a, b, c);
  },
  removeDataPropertyChangeListener: function(a, b) {
    this._dataPropertyChangeDispatcher.remove(a, b);
  },
  addHierarchyChangeListener: function(a, b, c) {
    this._hierarchyChangeDispatcher.add(a, b, c);
  },
  removeHierarchyChangeListener: function(a, b) {
    this._hierarchyChangeDispatcher.remove(a, b);
  }
});

let ColumnBox = function(a) {
  ColumnBox.superClass.constructor.apply(this, arguments);
};
_third.ext('third.ColumnBox', DataBox, {
  _name: 'ColumnBox',
  add: function(a, b) {
    if (!a.IColumn) {throw 'Only IColumn can be added into ColumnBox';}
    ColumnBox.superClass.add.apply(this, arguments);
  }
}),

// 单独导出
module.exports = {
  DataBox: DataBox,
  ColumnBox: ColumnBox
};
