const Data = require('./_tData');
const _third = require('./../core/_third')._third;

let Layer = function(a) {
  Layer.superClass.constructor.call(this, a);
};
_third.ext('third.Layer', Data, {
  ILayer: !0,
  __accessor: ['visible', 'movable', 'editable', 'rotatable'],
  _visible: !0,
  _movable: !0,
  _editable: !0,
  _rotatable: !0,
  _name: 'Default'
});

module.exports = Layer;
