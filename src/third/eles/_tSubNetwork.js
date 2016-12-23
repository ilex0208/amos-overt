const _third = require('./../core/_third')._third;

const _con = require('./../constants/index');
const Bd = _con.Bd;
const Follower = require('./_tLink').Follower;

const Tnode = require('./_tNode');

let SubNetwork = function(a) {
  SubNetwork.superClass.constructor.call(this, a);
};
_third.ext('third.SubNetwork', Follower, {
  ISubNetwork: !0,
  _image: Bd.IMAGE_SUBNETWORK,
  _icon: Bd.ICON_SUBNETWORK,
  _checkLinkAgent: function() {
    SubNetwork.superClass._checkLinkAgent.call(this);
    var a = this.getChildrenSize();
    for (var b = 0; b < a; b++) {
      var d = this.getChildAt(b);
      d instanceof Tnode && d._checkLinkAgent();
    }
  }
}),

module.exports = SubNetwork;
