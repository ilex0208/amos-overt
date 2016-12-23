const _third = require('./../core/_third')._third;
const _con = require('./../constants/index');
const Bd = _con.Bd;
const Follower = require('./_tLink').Follower;

let Group = function(a) {
  this._isUpdatingLocationFromChildren = !1,
    this._isAdjusting = !1,
    this._expanded = !1,
    Group.superClass.constructor.call(this, a);
};
_third.ext('third.Group', Follower, {
  _image: Bd.IMAGE_GROUP,
  _icon: Bd.ICON_GROUP,

  onChildAdded: function(a, b) {
    Group.superClass.onChildAdded.apply(this, arguments),
      this.updateLocationFromChildren();
  },
  onChildRemoved: function(a, b) {
    Group.superClass.onChildRemoved.apply(this, arguments),
      this.updateLocationFromChildren();
  },
  reverseExpanded: function() {
    this.setExpanded(!this.isExpanded());
  },
  isExpanded: function() {
    return this._expanded;
  },
  setExpanded: function(a) {
    if (this._expanded === a) {return;}
    var b = this._expanded;
    this._expanded = a,
      this.firePropertyChange('expanded', b, this._expanded),
      this._checkLinkAgent();
  }
});

module.exports = Group;
