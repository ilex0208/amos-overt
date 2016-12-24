const _tool = require('./../common/_tool');

const Styles = require('./../core/_styles');

let extend = {
  __accessor: function(a, b) {
    var c = b.__accessor,
      e = c.length;
    for (var f = 0; f < e; f++){ _tool.ip(a, c[f]);}
  },
  __bool: function(a, b) {
    var c = b.__bool,
      e = c.length;
    for (var f = 0; f < e; f++) {_tool.ibool(a, c[f]);}
  },
  __client: function(a, b) {
    a.getClient = function(a) {
      return this._clientMap[a];
    },
      a.setClient = function(a, b) {
        var c = this._clientMap[a];
        return b == null ? delete this._clientMap[a] : this._clientMap[a] = b,
          this.firePropertyChange('C:' + a, c, b) && this.onClientChanged(a, c, b),
          this;
      },
      a.getClientProperties = function() {
        return _tool.keys(this._clientMap);
      },
      a.onClientChanged = function(a, b, c) { };
  },
  __style: function(a, e) {
    a.getStyle = function(a, d) {
      var e = this._styleMap[a];
      return d === undefined && (d = !0),
        e == null && d ? Styles.getStyle(a) : e;
    },
      a.setStyle = function(a, b) {
        var c = this._styleMap[a];
        return b == null ? delete this._styleMap[a] : this._styleMap[a] = b,
          this.firePropertyChange('S:' + a, c, b) && this.onStyleChanged(a, c, b),
          this;
      },
      a.getStyleProperties = function() {
        return _tool.keys(this._styleMap);
      },
      a.onStyleChanged = function(a, b, c) { };
  },
  __property: function(a, b) {
    a.getValue = function(a, b) {
      return this._propertyType === 'accessor' ? _tool.getValue(a, this._propertyName) : this._propertyType === 'style' && a.getStyle ? a.getStyle(this._propertyName) : this._propertyType === 'client' && a.getClient ? a.getClient(this._propertyName) : this._propertyType === 'field' ? a[this._propertyName] : null;
    },
      a.setValue = function(a, b, c) {
        if (this._propertyType === 'accessor') {a[_tool.setter(this._propertyName)](b);}
        else {
          if (this._propertyType === 'style' && a.setStyle) {return a.setStyle(this._propertyName, b);}
          if (this._propertyType === 'client' && a.setClient) {return a.setClient(this._propertyName, b);}
          this._propertyType === 'field' && (a[this._propertyName] = b);
        }
      };
  },
  map: {
    __accessor: 1,
    __bool: 1,
    __client: 1,
    __style: 1,
    __new: 1,
    __tree: 1,
    __property: 1
  },
  ext: function(a, b, c) {
    extend.map[a] === 1 ? extend[a](b, c) : b[a] = c[a];
  }
};

module.exports = extend;
