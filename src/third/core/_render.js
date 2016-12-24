const _third = require('./../core/_third');

const _render = {
  _string: function(a, b, c, e) {
    var f = c._stringPool.get();
    f.style.whiteSpace = 'nowrap',
      f.style.verticalAlign = 'middle',
      f.style.padding = '0px 2px',
      _third.setText(f, a, e),
      f.setAttribute('title', a),
      b.appendChild(f);
  },
  _boolean: function(a, b, c) {
    var d = c._booleanPool.get();
    b._editInfo ? (d._editInfo = b._editInfo, delete b._editInfo, d.disabled = !1) : d.disabled = !0,
      d.keepDefault = !0,
      d.type = 'checkbox',
      d.style.margin = '0px 2px',
      d.style.verticalAlign = 'middle',
      d.checked = a,
      b.appendChild(d),
      b.style.textAlign === '' && (b.style.textAlign = 'center');
  },
  _color: function(a, b, c) {
    var d = c._colorPool.get();
    d.style.width = '100%',
      d.style.height = '100%',
      d.style.backgroundColor = a,
      d.setAttribute('title', a),
      b.appendChild(d);
  },
  render: function(a, b, c, d, e) {
    if (b == null) { return; }
    var f = _render['_' + a];
    f ? f(b, c, d, e) : typeof b == 'boolean' ? _render._boolean(b, c, d, e) : _render._string(b, c, d, e);
  }
};

module.exports = _render;
