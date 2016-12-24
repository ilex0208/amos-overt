
const _con = require('./../constants/index');
const Bd = _con.Bd;
const Follower = require('./_Follower');

const Tnode = require('./_tNode');

const invokeExtends = require('./../core/_ext');

let SubNetwork = function(a) {
  SubNetwork.superClass.constructor.call(this, a);

  // ext

  this.ISubNetwork = !0,
  this._image = Bd.IMAGE_SUBNETWORK,
  this._icon = Bd.ICON_SUBNETWORK,
  this._checkLinkAgent = function() {
    SubNetwork.superClass._checkLinkAgent.call(this);
    var a = this.getChildrenSize();
    for (var b = 0; b < a; b++) {
      var d = this.getChildAt(b);
      d instanceof Tnode && d._checkLinkAgent();
    }
  };
};

invokeExtends('third.SubNetwork', Follower, SubNetwork);
//SubNetwork.prototype = new Follower;
SubNetwork.prototype.getClassName = function(){
  return 'third.SubNetwork';
};

module.exports = SubNetwork;
