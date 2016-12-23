const _third = require('./../core/_third')._third;
const Telement = require('./_tElement');

let Dummy = function(a) {
  Dummy.superClass.constructor.call(this, a);
};
_third.ext('third.Dummy',Telement, {
  IDummy: !0
});

module.exports = Dummy;
