const _third = require('./../core/_third')._third;
const _con = require('./../constants/index');
const Bd = _con.Bd;
const Telement = require('./_tElement');
const List = require('./../core/_list');
const math = require('./../core/_math');


let Tnode = function(a) {
  this._location = {
    x: 0,
    y: 0
  },
    Tnode.superClass.constructor.call(this, a);
};
Tnode.IS_INTERESTED_NODE_PROPERTY = {
  location: 1,
  width: 1,
  height: 1,
  expanded: 1
},
_third.ext('third.Node', Telement, {
  _icon: Bd.ICON_NODE,
  _image: Bd.IMAGE_NODE,
  _angle: 0,
  getLoopedLinks: function() {
    return this._loopedLinks;
  },
  getLinks: function() {
    return this._links;
  },
  getAgentLinks: function() {
    return this._agentLinks;
  },
  getFollowers: function() {
    return this._followers;
  },
  _addFollower: function(a) {
    this._followers || (this._followers = new List),
      this._followers.add(a);
  },
  _removeFollower: function(a) {
    this._followers.remove(a),
      this._followers.isEmpty() && delete this._followers;
  },
  getFromLinks: function() {
    return this._fromLinks;
  },
  getToLinks: function() {
    return this._toLinks;
  },
  _addFromLink: function(a) {
    this._allLinks || (this._allLinks = new List),
      this._fromLinks || (this._fromLinks = new List),
      this._allLinks.add(a),
      this._fromLinks.add(a),
      this._resetLinkSet();
  },
  _addToLink: function(a) {
    this._allLinks || (this._allLinks = new List),
      this._toLinks || (this._toLinks = new List),
      this._allLinks.add(a),
      this._toLinks.add(a),
      this._resetLinkSet();
  },
  _removeFromLink: function(a) {
    this._allLinks.remove(a),
      this._fromLinks.remove(a),
      this._allLinks.size() === 0 && delete this._allLinks,
      this._fromLinks.size() === 0 && delete this._fromLinks,
      this._resetLinkSet();
  },
  _removeToLink: function(a) {
    this._allLinks.remove(a),
      this._toLinks.remove(a),
      this._allLinks.size() === 0 && delete this._allLinks,
      this._toLinks.size() === 0 && delete this._toLinks,
      this._resetLinkSet();
  },
  _resetLinkSet: function() {
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
  hasAgentLinks: function() {
    return this._agentLinks != null && !this._agentLinks.isEmpty();
  },
  getFromAgentLinks: function() {
    return this._fromAgentLinks;
  },
  getToAgentLinks: function() {
    return this._toAgentLinks;
  },
  _addFromAgentLink: function(a) {
    this._fromAgentLinks || (this._fromAgentLinks = new List),
      this._allAgentLinks || (this._allAgentLinks = new List),
      this._fromAgentLinks.add(a),
      this._allAgentLinks.add(a),
      this._resetAgentLinkSet();
  },
  _addToAgentLink: function(a) {
    this._toAgentLinks || (this._toAgentLinks = new List),
      this._allAgentLinks || (this._allAgentLinks = new List),
      this._toAgentLinks.add(a),
      this._allAgentLinks.add(a),
      this._resetAgentLinkSet();
  },
  _removeFromAgentLink: function(a) {
    this._fromAgentLinks.remove(a),
      this._allAgentLinks.remove(a),
      this._fromAgentLinks.size() === 0 && delete this._fromAgentLinks,
      this._allAgentLinks.size() === 0 && delete this._allAgentLinks,
      this._resetAgentLinkSet();
  },
  _removeToAgentLink: function(a) {
    this._toAgentLinks.remove(a),
      this._allAgentLinks.remove(a),
      this._toAgentLinks.size() === 0 && delete this._toAgentLinks,
      this._allAgentLinks.size() === 0 && delete this._allAgentLinks,
      this._resetAgentLinkSet();
  },
  _resetAgentLinkSet: function() {
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
  getImage: function() {
    return this._image;
  },
  setImage: function(a) {
    var b = this._image,
      c = this.getWidth(),
      d = this.getHeight();
    this._image = a,
      this.firePropertyChange('image', b, a),
      this.firePropertyChange('width', c, this.getWidth()),
      this.firePropertyChange('height', d, this.getHeight());
  },
  getX: function() {
    return this._location.x;
  },
  getY: function() {
    return this._location.y;
  },
  setX: function(a) {
    this.setLocation(a, this._location.y);
  },
  setY: function(a) {
    this.setLocation(this._location.x, a);
  },
  getLocation: function() {
    return this._location;
  },
  setLocation: function(a, b) {
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
  getCenterLocation: function() {
    return {
      x: this.getX() + this.getWidth() / 2,
      y: this.getY() + this.getHeight() / 2
    };
  },
  setCenterLocation: function(a, b) {
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
  translate: function(a, b) {
    this.setLocation(this.getX() + a, this.getY() + b);
  },
  getWidth: function() {
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
  setWidth: function(a) {
    var b = this._width;
    this._width = a,
      this.firePropertyChange('width', b, a);
  },
  getHeight: function() {
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
  setHeight: function(a) {
    var b = this._height;
    this._height = a,
      this.firePropertyChange('height', b, a);
  },
  setSize: function() {
    arguments.length === 2 ? (this.setWidth(arguments[0]), this.setHeight(arguments[1])) : (this.setWidth(arguments[0].width), this.setHeight(arguments[0].height));
  },
  getSize: function() {
    return {
      width: this.getWidth(),
      height: this.getHeight()
    };
  },
  getRect: function() {
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
  getOriginalRect: function() {
    return {
      x: this.getX(),
      y: this.getY(),
      width: this.getWidth(),
      height: this.getHeight()
    };
  },
  getAngle: function() {
    return this._angle;
  },
  setAngle: function(a) {
    var b = this._angle;
    this._angle = a % 360,
      this.firePropertyChange('angle', b, this._angle);
  },
  onParentChanged: function(a, b) {
    Tnode.superClass.onParentChanged.call(this, a, b),
      this._checkLinkAgent();
  }
});

module.exports = Tnode;
