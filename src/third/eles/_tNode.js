const _third = require('./../core/_third');
const _con = require('./../constants/index');
const Bd = _con.Bd;
const Telement = require('./_tElement');
const List = require('./../core/_list');
const math = require('./../core/_math');

const invokeExtends = require('./../core/_ext');


let Tnode = function(a) {
  this._location = {
    x: 0,
    y: 0
  },
    Tnode.superClass.constructor.call(this, a);
  // ext
  this._icon = Bd.ICON_NODE,
  this._image = Bd.IMAGE_NODE,
  this._angle = 0,
  this.getLoopedLinks = function() {
    return this._loopedLinks;
  },
  this.getLinks = function() {
    return this._links;
  },
  this.getAgentLinks = function() {
    return this._agentLinks;
  },
  this.getFollowers = function() {
    return this._followers;
  },
  this._addFollower = function(a) {
    this._followers || (this._followers = new List),
      this._followers.add(a);
  },
  this._removeFollower = function(a) {
    this._followers.remove(a),
      this._followers.isEmpty() && delete this._followers;
  },
  this.getFromLinks = function() {
    return this._fromLinks;
  },
  this.getToLinks = function() {
    return this._toLinks;
  },
  this._addFromLink = function(a) {
    this._allLinks || (this._allLinks = new List),
      this._fromLinks || (this._fromLinks = new List),
      this._allLinks.add(a),
      this._fromLinks.add(a),
      this._resetLinkSet();
  },
  this._addToLink = function(a) {
    this._allLinks || (this._allLinks = new List),
      this._toLinks || (this._toLinks = new List),
      this._allLinks.add(a),
      this._toLinks.add(a),
      this._resetLinkSet();
  },
  this._removeFromLink = function(a) {
    this._allLinks.remove(a),
      this._fromLinks.remove(a),
      this._allLinks.size() === 0 && delete this._allLinks,
      this._fromLinks.size() === 0 && delete this._fromLinks,
      this._resetLinkSet();
  },
  this._removeToLink = function(a) {
    this._allLinks.remove(a),
      this._toLinks.remove(a),
      this._allLinks.size() === 0 && delete this._allLinks,
      this._toLinks.size() === 0 && delete this._toLinks,
      this._resetLinkSet();
  },
  this._resetLinkSet = function() {
    delete this._loopedLinks;
    if (!this._allLinks || this._allLinks.size() === 0) {
      delete this._links;
      return;
    }
    var a;
    this._allLinks.forEach(function(b) {
      b.isLooped() && (a || (a = {}), a[b._id] || (this._loopedLinks || (this._loopedLinks = new List), this._loopedLinks.add(b), a[b._id] = b));
    },
        this),
      a ? (this._links = new List, this._allLinks.forEach(function(b) {
        a[b._id] ? a[b._id] !== !1 && (a[b._id] = !1, this._links.add(b)) : this._links.add(b);
      },
        this)) : this._links = this._allLinks;
  },
  this.hasAgentLinks = function() {
    return this._agentLinks != null && !this._agentLinks.isEmpty();
  },
  this.getFromAgentLinks = function() {
    return this._fromAgentLinks;
  },
  this.getToAgentLinks = function() {
    return this._toAgentLinks;
  },
  this._addFromAgentLink = function(a) {
    this._fromAgentLinks || (this._fromAgentLinks = new List),
      this._allAgentLinks || (this._allAgentLinks = new List),
      this._fromAgentLinks.add(a),
      this._allAgentLinks.add(a),
      this._resetAgentLinkSet();
  },
  this._addToAgentLink = function(a) {
    this._toAgentLinks || (this._toAgentLinks = new List),
      this._allAgentLinks || (this._allAgentLinks = new List),
      this._toAgentLinks.add(a),
      this._allAgentLinks.add(a),
      this._resetAgentLinkSet();
  },
  this._removeFromAgentLink = function(a) {
    this._fromAgentLinks.remove(a),
      this._allAgentLinks.remove(a),
      this._fromAgentLinks.size() === 0 && delete this._fromAgentLinks,
      this._allAgentLinks.size() === 0 && delete this._allAgentLinks,
      this._resetAgentLinkSet();
  },
  this._removeToAgentLink = function(a) {
    this._toAgentLinks.remove(a),
      this._allAgentLinks.remove(a),
      this._toAgentLinks.size() === 0 && delete this._toAgentLinks,
      this._allAgentLinks.size() === 0 && delete this._allAgentLinks,
      this._resetAgentLinkSet();
  },
  this._resetAgentLinkSet = function() {
    delete this._agentLinks;
    if (!this._allAgentLinks || this._allAgentLinks.size() === 0) {
      return;
    }
    var a = {};
    this._allAgentLinks.forEach(function(b) {
      a[b._id] ? this._agentLinks || (this._agentLinks = new List) : a[b._id] = b;
    },
        this),
      this._agentLinks ? this._allAgentLinks.forEach(function(b) {
        a[b._id] && (this._agentLinks.add(b), delete a[b._id]);
      },
        this) : this._agentLinks = this._allAgentLinks;
  },
  this.getImage = function() {
    return this._image;
  },
  this.setImage = function(a) {
    var b = this._image,
      c = this.getWidth(),
      d = this.getHeight();
    this._image = a,
      this.firePropertyChange('image', b, a),
      this.firePropertyChange('width', c, this.getWidth()),
      this.firePropertyChange('height', d, this.getHeight());
  },
  this.getX = function() {
    return this._location.x;
  },
  this.getY = function() {
    return this._location.y;
  },
  this.setX = function(a) {
    this.setLocation(a, this._location.y);
  },
  this.setY = function(a) {
    this.setLocation(this._location.x, a);
  },
  this.getLocation = function() {
    return this._location;
  },
  this.setLocation = function(a, b) {
    var c;
    arguments.length === 2 ? c = {
      x: arguments[0],
      y: arguments[1]
    } : c = arguments[0];
    if (!_third.num(c.x) || !_third.num(c.y)) {
      return;
    }
    if (c.x === this._location.x && c.y === this._location.y) {
      return;
    }
    var e = this._location;
    this._location = c,
      this.firePropertyChange('location', e, c);
  },
  this.getCenterLocation = function() {
    return {
      x: this.getX() + this.getWidth() / 2,
      y: this.getY() + this.getHeight() / 2
    };
  },
  this.setCenterLocation = function(a, b) {
    var c;
    arguments.length === 2 ? c = {
      x: arguments[0],
      y: arguments[1]
    } : c = _third.clone(arguments[0]);
    if (!_third.num(c.x) || !_third.num(c.y)) {
      return;
    }
    c.x -= this.getWidth() / 2,
      c.y -= this.getHeight() / 2,
      this.setLocation(c);
  },
  this.translate = function(a, b) {
    this.setLocation(this.getX() + a, this.getY() + b);
  },
  this.getWidth = function() {
    if (_third.num(this._width) && this._width >= 0) {
      return this._width;
    }
    var a = _third.getImageAsset(this._image);
    if (a) {
      var b = a.getWidth();
      if (_third.num(b) && b >= 0) {
        return b;
      }
    }
    return Bd.NODE_WIDTH;
  },
  this.setWidth = function(a) {
    var b = this._width;
    this._width = a,
      this.firePropertyChange('width', b, a);
  },
  this.getHeight = function() {
    if (_third.num(this._height) && this._height >= 0) {
      return this._height;
    }
    var a = _third.getImageAsset(this._image);
    if (a) {
      var b = a.getHeight();
      if (_third.num(b) && b >= 0) {
        return b;
      }
    }
    return Bd.NODE_HEIGHT;
  },
  this.setHeight = function(a) {
    var b = this._height;
    this._height = a,
      this.firePropertyChange('height', b, a);
  },
  this.setSize = function() {
    arguments.length === 2 ? (this.setWidth(arguments[0]), this.setHeight(arguments[1])) : (this.setWidth(arguments[0].width), this.setHeight(arguments[0].height));
  },
  this.getSize = function() {
    return {
      width: this.getWidth(),
      height: this.getHeight()
    };
  },
  this.getRect = function() {
    if (this._angle === 0) {
      return this.getOriginalRect();
    }
    var a = math.createMatrix(this._angle * Math.PI / 180, this.getX() + this.getWidth() / 2, this.getY() + this.getHeight() / 2),
      b = [{
        x: this.getX(),
        y: this.getY()
      }, {
        x: this.getX() + this.getWidth(),
        y: this.getY()
      }, {
        x: this.getX() + this.getWidth(),
        y: this.getY() + this.getHeight()
      }, {
        x: this.getX(),
        y: this.getY() + this.getHeight()
      }];
    for (var c = 0,
      d = b.length; c < d; c++) {
      b[c] = a.transform(b[c]);
    }
    var e = math.getRect(b);
    return e;
  },
  this.getOriginalRect = function() {
    return {
      x: this.getX(),
      y: this.getY(),
      width: this.getWidth(),
      height: this.getHeight()
    };
  },
  this.getAngle = function() {
    return this._angle;
  },
  this.setAngle = function(a) {
    var b = this._angle;
    this._angle = a % 360,
      this.firePropertyChange('angle', b, this._angle);
  },
  this.onParentChanged = function(a, b) {
    Tnode.superClass.onParentChanged.call(this, a, b),
      this._checkLinkAgent();
  };
};
Tnode.IS_INTERESTED_NODE_PROPERTY = {
  location: 1,
  width: 1,
  height: 1,
  expanded: 1
};

invokeExtends('third.Tnode', Telement, Tnode);
//Tnode.prototype = new Telement;
Tnode.prototype.getClassName = function(){
  return 'third.Tnode';
};

module.exports = Tnode;
