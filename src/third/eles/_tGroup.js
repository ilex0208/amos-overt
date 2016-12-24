
const _con = require('./../constants/index');
const Bd = _con.Bd;
const Follower = require('./_Follower');

const invokeExtends = require('./../core/_ext');

let Group = function(a) {
  this._isUpdatingLocationFromChildren = !1,
    this._isAdjusting = !1,
    this._expanded = !1,
    Group.superClass.constructor.call(this, a);
  //ext
  this._image = Bd.IMAGE_GROUP,
  this._icon = Bd.ICON_GROUP,

  this.onChildAdded = function(a, b) {
    Group.superClass.onChildAdded.apply(this, arguments),
      this.updateLocationFromChildren();
  },
  this.onChildRemoved = function(a, b) {
    Group.superClass.onChildRemoved.apply(this, arguments),
      this.updateLocationFromChildren();
  },
  this.reverseExpanded = function() {
    this.setExpanded(!this.isExpanded());
  },
  this.isExpanded = function() {
    return this._expanded;
  },
  this.setExpanded = function(a) {
    if (this._expanded === a) {return;}
    var b = this._expanded;
    this._expanded = a,
      this.firePropertyChange('expanded', b, this._expanded),
      this._checkLinkAgent();
  };
};

invokeExtends('third.Group', Follower, Group);
//Group.prototype = new Follower;
Group.prototype.getClassName = function(){
  return 'third.Group';
};
module.exports = Group;
