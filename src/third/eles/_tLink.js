const Tnode = require('./_tNode');
const _third = require('./../core/_third')._third;
const _con = require('./../constants/index');
const Bd = _con.Bd;

let Tlink = function(a, b, d) {
  Tlink.superClass.constructor.call(this, a instanceof Tnode ? null : a),
  a instanceof Tnode && (d = b, b = a),
  this.setFromNode(b),
  this.setToNode(d);
};
Tlink.IS_INTERESTED_BUNDLE_STYLE = {
  'link.bundle.enable': 1,
  'link.bundle.id': 1,
  'link.bundle.independent': 1
},
_third.ext('third.Link', Element, {
  _fromNode: null,
  _toNode: null,
  _fromAgent: null,
  _toAgent: null,
  _icon: Bd.ICON_LINK,
  getFromNode: function() {
    return this._fromNode;
  },
  getToNode: function() {
    return this._toNode;
  },
  getFromAgent: function() {
    return this._fromAgent;
  },
  getToAgent: function() {
    return this._toAgent;
  },
  setFromNode: function(a) {
    if (this._fromNode === a) {return;}
    var b = this._fromNode;
    this._fromNode = a,
      b && b._removeFromLink(this),
      this._fromNode && this._fromNode._addFromLink(this),
      this._checkAgentNode(),
      this.firePropertyChange('fromNode', b, a);
  },
  setToNode: function(a) {
    if (this._toNode === a){ return;}
    var b = this._toNode;
    this._toNode = a,
      b && b._removeToLink(this),
      this._toNode && this._toNode._addToLink(this),
      this._checkAgentNode(),
      this.firePropertyChange('toNode', b, a);
  },
  isLooped: function() {
    return this._fromNode === this._toNode && this._fromNode != null && this._toNode != null;
  },
  _setBundleLinks: function(a) {
    this._bundleLinks = a,
      this.firePropertyChange('bundleLinks', !0, !1);
  },
  getBundleLinks: function() {
    return this._bundleLinks;
  },
  getBundleCount: function() {
    return this._bundleLinks ? this._bundleLinks.getLinks().size() : 1;
  },
  getBundleIndex: function() {
    return this._bundleLinks ? this._bundleLinks.getLinks().indexOf(this) : 0;
  },
  reverseBundleExpanded: function() {
    if (this._bundleLinks && this._bundleLinks.getLinks().size() > 0) {
      var a, b, c = this._bundleLinks.getLinks(),
        d = !this.getStyle('link.bundle.expanded');
      for (a = 0; a < c.size(); a++) {b = c.get(a),
        b.setStyle('link.bundle.expanded', d);}
      var e = this._bundleLinks.getSiblings();
      for (a = 0; a < e.size(); a++) {
        var f = e.get(a);
        if (f != this._bundleLinks) {
          c = f.getLinks();
          for (var g = 0; g < c.size(); g++) {b = c.get(g),
            b.firePropertyChange('bundleLinks', null, f);}
        }
      }
      return !0;
    }
    return !1;
  },
  isBundleAgent: function() {
    return this._bundleLinks != null && this._bundleLinks.getLinks().size() > 1 && this === this._bundleLinks.getLinks().get(0) && !this.getStyle('link.bundle.expanded');
  },
  isAdjustedToBottom: function() {
    return Bd.IS_LINK_ADJUSTED_TO_BOTTOM;
  }
});
let Follower = function(a) {
  this._isUpdatingFollower = !1,
    this._isUpdatingLocation = !1,
    Follower.superClass.constructor.call(this, a);
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
},
_third.ext('third.Follower', Tnode, {
  _host: null,
  getHost: function() {
    return this._host;
  },
  setHost: function(a) {
    if (this === a || this._host === a) {return;}
    var b = this._host;
    b && b._removeFollower(this),
      this._host = a,
      this._host && this._host._addFollower(this),
      this.firePropertyChange('host', b, a),
      this.onHostChanged(b, a);
  },
  onStyleChanged: function(a, b, d) {
    Follower.superClass.onStyleChanged.call(this, a, b, d),
      Follower.IS_INTERESTED_FOLLOWER_STYLE[a] && this.updateFollower(null);
  },
  setLocation: function() {
    if (this._isUpdatingLocation) {return;}
    this._isUpdatingLocation = !0,
      Follower.superClass.setLocation.apply(this, arguments),
      this._isUpdatingLocation = !1;
  },
  onHostChanged: function(a, b) {
    this.updateFollower(null);
  },
  handleHostPropertyChange: function(a) {
    this.updateFollower(a);
  },
  updateFollower: function(a) {
    if (this._isUpdatingFollower || _third.isDeserializing){ return;}
    this._isUpdatingFollower = !0,
      this.updateFollowerImpl(a),
      this._isUpdatingFollower = !1;
  },
  isHostOn: function(a) {
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
  isLoopedHostOn: function(a) {
    return this.isHostOn(a) && a.isHostOn(this);
  }
});


// 单独导出
module.exports = {
  Tlink: Tlink,
  Follower: Follower
};
