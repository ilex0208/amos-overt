const _tool = require('./../common/_tool');
const invokeExtends = require('./../core/_ext');

let Styles = {
  _m: {},
  setStyle: function(a, b) {
    b == null ? delete Styles._m[a] : Styles._m[a] = b;
  },
  getStyle: function(a) {
    return Styles._m[a];
  },
  getStyleProperties: function() {
    return _tool.keys(Styles._m);
  }
};

invokeExtends('third.Styles', Object, Styles);
// Styles.prototype = new Object;
Styles.prototype.getClassName = function(){
  return 'third.Styles';
};
module.exports = Styles;
