const Tnode = require('./_tNode');
const _con = require('./../constants/index');
const Bd = _con.Bd;

const Extends = require('./../core/_ext');

let Tlink = function(a, b, d) {
  Tlink.superClass.constructor.call(this, a instanceof Tnode ? null : a),
  a instanceof Tnode && (d = b, b = a),
  this.setFromNode(b),
  this.setToNode(d);

  // ext
  this._fromNode = null,
  this._toNode = null,
  this._fromAgent = null,
  this._toAgent = null,
  this._icon = Bd.ICON_LINK,
  this.getFromNode = function() {
    return this._fromNode;
  },
  this.getToNode = function() {
    return this._toNode;
  },
  this.getFromAgent = function() {
    return this._fromAgent;
  },
  this.getToAgent = function() {
    return this._toAgent;
  },
  this.setFromNode = function(a) {
    if (this._fromNode === a) {return;}
    var b = this._fromNode;
    this._fromNode = a,
      b && b._removeFromLink(this),
      this._fromNode && this._fromNode._addFromLink(this),
      this._checkAgentNode(),
      this.firePropertyChange('fromNode', b, a);
  },
  this.setToNode = function(a) {
    if (this._toNode === a){ return;}
    var b = this._toNode;
    this._toNode = a,
      b && b._removeToLink(this),
      this._toNode && this._toNode._addToLink(this),
      this._checkAgentNode(),
      this.firePropertyChange('toNode', b, a);
  },
  this.isLooped = function() {
    return this._fromNode === this._toNode && this._fromNode != null && this._toNode != null;
  },
  this._setBundleLinks = function(a) {
    this._bundleLinks = a,
      this.firePropertyChange('bundleLinks', !0, !1);
  },
  this.getBundleLinks = function() {
    return this._bundleLinks;
  },
  this.getBundleCount = function() {
    return this._bundleLinks ? this._bundleLinks.getLinks().size() : 1;
  },
  this.getBundleIndex = function() {
    return this._bundleLinks ? this._bundleLinks.getLinks().indexOf(this) : 0;
  },
  this.reverseBundleExpanded = function() {
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
  this.isBundleAgent = function() {
    return this._bundleLinks != null && this._bundleLinks.getLinks().size() > 1 && this === this._bundleLinks.getLinks().get(0) && !this.getStyle('link.bundle.expanded');
  },
  this.isAdjustedToBottom = function() {
    return Bd.IS_LINK_ADJUSTED_TO_BOTTOM;
  };
};
Tlink.IS_INTERESTED_BUNDLE_STYLE = {
  'link.bundle.enable': 1,
  'link.bundle.id': 1,
  'link.bundle.independent': 1
};

Extends('third.Tlink', Element, Tlink);
//Tlink.prototype = new Element;
Tlink.prototype.getClassName = function(){
  return 'third.Tlink';
};


module.exports = Tlink;
