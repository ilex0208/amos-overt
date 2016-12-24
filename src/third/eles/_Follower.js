const Tnode = require('./_tNode');
const _third = require('./../core/_third');
const invokeExtends = require('./../core/_ext');

/**
 * 之下的
 */
let Follower = function(a) {
  this._isUpdatingFollower = !1,
    this._isUpdatingLocation = !1,
    Follower.superClass.constructor.call(this, a);
  // ext
  this._host = null,
  this.getHost = function() {
    return this._host;
  },
  this.setHost = function(a) {
    if (this === a || this._host === a) {return;}
    var b = this._host;
    b && b._removeFollower(this),
      this._host = a,
      this._host && this._host._addFollower(this),
      this.firePropertyChange('host', b, a),
      this.onHostChanged(b, a);
  },
  this.onStyleChanged = function(a, b, d) {
    Follower.superClass.onStyleChanged.call(this, a, b, d),
      Follower.IS_INTERESTED_FOLLOWER_STYLE[a] && this.updateFollower(null);
  },
  this.setLocation = function() {
    if (this._isUpdatingLocation) {return;}
    this._isUpdatingLocation = !0,
      Follower.superClass.setLocation.apply(this, arguments),
      this._isUpdatingLocation = !1;
  },
  this.onHostChanged = function(a, b) {
    this.updateFollower(null);
  },
  this.handleHostPropertyChange = function(a) {
    this.updateFollower(a);
  },
  this.updateFollower = function(a) {
    if (this._isUpdatingFollower || _third.isDeserializing){ return;}
    this._isUpdatingFollower = !0,
      this.updateFollowerImpl(a),
      this._isUpdatingFollower = !1;
  },
  this.isHostOn = function(a) {
    if (!a) {return !1;}
    var b = {},
      d = this._host;
    while (d && d != this && !b[d.getId()]) {
      if (d === a) {return !0;}
      b[d.getId()] = d,
        d instanceof Follower ? d = d.getHost() : d = null;
    }
    return !1;
  },
  this.isLoopedHostOn = function(a) {
    return this.isHostOn(a) && a.isHostOn(this);
  };
};
Follower.IS_INTERESTED_HOST_GRID_PROPERTY = {
  location: 1,
  width: 1,
  height: 1,
  'S:grid.row.count': 1,
  'S:grid.column.count': 1,
  'S:grid.row.percents': 1,
  'S:grid.column.percents': 1,
  'S:grid.border': 1,
  'S:grid.border.left': 1,
  'S:grid.border.right': 1,
  'S:grid.border.top': 1,
  'S:grid.border.bottom': 1,
  'S:grid.padding': 1,
  'S:grid.padding.left': 1,
  'S:grid.padding.right': 1,
  'S:grid.padding.top': 1,
  'S:grid.padding.bottom': 1
},
Follower.IS_INTERESTED_FOLLOWER_STYLE = {
  'follower.row.index': 1,
  'follower.column.index': 1,
  'follower.row.span': 1,
  'follower.column.span': 1,
  'follower.padding': 1,
  'follower.padding.left': 1,
  'follower.padding.right': 1,
  'follower.padding.top': 1,
  'follower.padding.bottom': 1
};

invokeExtends('third.Follower', Tnode, Follower);
//Follower.prototype = new Tnode;
Follower.prototype.getClassName = function(){
  return 'third.Follower';
};

module.exports = Follower;
