const EventDispatcher = require('./_eventDispatcher');
const SelectionModel = require('./_model');
const PropertyChangeDispatcher = require('./_PropertyChangeDispatcher');
const List = require('./../core/_list');

const _con = require('./../constants/index');
const Bd = _con.Bd;

const Tnode = require('./../eles/_tNode');
const Tlink = require('./../eles/_tLink');
const Follower = require('./../eles/_Follower');
const box = require('./_box');
const Extends = require('./../core/_ext');

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
  // ext
  this.IClient = !0,
  this.__client = 1,
  this.__new = 1,
  this._limit = -1,
  this._name = 'DataBox',
  this._icon = Bd.ICON_DATABOX,
  this.__accessor = ['name', 'icon', 'toolTip'],
  this.getSelectionModel = function() {
    return this._selectionModel;
  },
  this.size = function() {
    return this._dataList.size();
  },
  this.isEmpty = function() {
    return this._dataList.isEmpty();
  },
  this.getLimit = function() {
    return this._limit;
  },
  this.setLimit = function(a) {
    var b = this._limit;
    this._limit = a,
      this.firePropertyChange('limit', b, a),
      this._checkLimit();
  },
  this._checkLimit = function() {
    this._limit >= 0 && this.size() > this._limit && this.removeFirst(this.size() - this._limit);
  },
  this.removeFirst = function(a) {
    arguments.length === 0 && (a = 1);
    while (a > 0 && this._dataList.size() > 0) {
      var b = this._dataList.get(0);
      this.remove(b),
        a--;
    }
  },
  this.getSiblings = function(a) {
    if (!this.contains(a)){ throw a + ' dosen\'t belong to this dataBox';}
    var b = a.getParent();
    return b ? b.getChildren() : this._rootList;
  },
  this.getRoots = function() {
    return this._rootList;
  },
  this.getSiblingIndex = function(a) {
    return a.getParent() ? a.getParent().getChildren().indexOf(a) : this._rootList.indexOf(a);
  },
  this.getDatas = function() {
    return this._dataList;
  },
  this.getDataAt = function(a) {
    return this._dataList.get(a);
  },
  this.toDatas = function(a, b) {
    return this._dataList.toList(a, b);
  },
  this.forEach = function(a, b) {
    this._dataList.forEach(a, b);
  },
  this.forEachReverse = function(a, b) {
    this._dataList.forEachReverse(a, b);
  },
  this.forEachByDepthFirst = function(a, b, c) {
    if (b) {this._depthFirst(a, b, c);}
    else {
      var d = this._rootList.size();
      for (var e = 0; e < d; e++) {
        var f = this._rootList.get(e);
        if (this._depthFirst(a, f, c) === !1) {return;}
      }
    }
  },
  this._depthFirst = function(a, b, c) {
    var d = b.getChildrenSize();
    for (var e = 0; e < d; e++) {
      var f = b.getChildAt(e);
      if (this._depthFirst(a, f, c) === !1) {return !1;}
    }
    if (c) {
      if (a.call(c, b) === !1){ return !1;}
    } else if (a(b) === !1) {return !1;}
  },
  this.forEachByBreadthFirst = function(a, b, c) {
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
  this.add = function(a, b) {
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
  this.remove = function(a) {
    this.removeById(a.getId());
  },
  this.removeSelection = function() {
    this._selectionModel.toSelection().forEach(function(a) {
      this.remove(a);
    },
      this);
  },
  this.removeById = function(a) {
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
  this.clear = function() {
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
  this.getDataById = function(a) {
    return this._dataMap[a];
  },
  this.containsById = function(a) {
    return this._dataMap.hasOwnProperty(a);
  },
  this.contains = function(a) {
    return a ? this._dataMap[a._id] === a : !1;
  },
  moveTo = function(a, b) {
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
  this.moveUp = function(a) {
    var b = this.getSiblings(a);
    this.moveTo(a, b.indexOf(a) - 1);
  },
  this.moveDown = function(a) {
    var b = this.getSiblings(a);
    this.moveTo(a, b.indexOf(a) + 1);
  },
  this.moveToTop = function(a) {
    this.moveTo(a, 0);
  },
  this.moveToBottom = function(a) {
    var b = this.getSiblings(a);
    this.moveTo(a, b.size());
  },
  this.moveSelectionUp = function(a) {
    a || (a = this._selectionModel);
    var b = new List;
    box.findMoveUpDatas(a, b, this._rootList),
      b.forEach(this.moveUp, this);
  },
  this.moveSelectionDown = function(a) {
    a || (a = this._selectionModel);
    var b = new List;
    box.findMoveDownDatas(a, b, this._rootList),
      b.forEach(this.moveDown, this);
  },
  this.moveSelectionToTop = function(a) {
    a || (a = this._selectionModel);
    var b = new List;
    box.findMoveToTopDatas(a, b, this._rootList),
      b.forEach(this.moveToTop, this);
  },
  this.moveSelectionToBottom = function(a) {
    a || (a = this._selectionModel);
    var b = new List;
    box.findMoveToBottomDatas(a, b, this._rootList),
      b.forEach(this.moveToBottom, this);
  },
  this.handleDataPropertyChange = function(a) {
    var b = a.source;
    if (a.property === 'parent') {
      var c = b.getId();
      b.getParent() ? this._rootMap[c] && (delete this._rootMap[c], this._rootList.remove(b)) : this._rootMap[c] || (this._rootMap[c] = b, this._rootList.add(b));
    }
    this.onDataPropertyChanged(b, a),
      this._dataPropertyChangeDispatcher.fire(a);
  },
  this.onDataPropertyChanged = function(a, b) { },
  this.addDataBoxChangeListener = function(a, b, c) {
    this._dataBoxChangeDispatcher.add(a, b, c);
  },
  this.removeDataBoxChangeListener = function(a, b) {
    this._dataBoxChangeDispatcher.remove(a, b);
  },
  this.addDataPropertyChangeListener = function(a, b, c) {
    this._dataPropertyChangeDispatcher.add(a, b, c);
  },
  this.removeDataPropertyChangeListener = function(a, b) {
    this._dataPropertyChangeDispatcher.remove(a, b);
  },
  this.addHierarchyChangeListener = function(a, b, c) {
    this._hierarchyChangeDispatcher.add(a, b, c);
  },
  this.removeHierarchyChangeListener = function(a, b) {
    this._hierarchyChangeDispatcher.remove(a, b);
  };
};

Extends('third.DataBox', PropertyChangeDispatcher, DataBox);
//DataBox.property = new PropertyChangeDispatcher,
DataBox.prototype.getClassName = function(){
  return 'third.DataBox';
};

// 单独导出
module.exports = DataBox;
