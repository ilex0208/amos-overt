
const objKey2List = require('./../core/_objKey2List');
const UserAgent = require('./../core/_userAgent');

let _tool = {
  getter: function(a) {
    let b = a.charAt(0).toUpperCase() + a.slice(1),
      c = /ble$/.test(a) || /ed$/.test(a) ? 'is' : 'get';
    return c + b;
  },
  setter: function(a) {
    let b = a.charAt(0).toUpperCase() + a.slice(1);
    return 'set' + b;
  },
  _id: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'],
  id: function() {
    let a = [];
    for (let b = 0; b < 32; b++) {a[b] = this._id[Math.floor(Math.random() * 16)];}
    return a[12] = '4',
      a[16] = this._id[a[16] & 3 | 8],
      a.join('');
  },
  keys: function(a) {
    return objKey2List(a);
  },
  ip: function(a, b) {
    let c = '_' + b;
    a[_tool.getter(b)] = function() {
      return this[c];
    },
      a[_tool.setter(b)] = function(a) {
        let d = this[c];
        this[c] = a,
          this.firePropertyChange(b, d, a);
      };
  },
  ibool: function(a, b) {
    let c = '_' + b,
      e = b.charAt(0).toUpperCase() + b.slice(1);
    a['is' + e] = function() {
      return this[c];
    },
      a[_tool.setter(b)] = function(a) {
        let d = this[c];
        this[c] = a,
          this.firePropertyChange(b, d, a);
      };
  },
  getValue: function(a, b, c) {
    let d = b.charAt(0).toUpperCase() + b.slice(1),
      e = 'get' + d,
      f = 'is' + d;
    return c ? c === 'boolean' ? a[f]() : a[e]() : a[e] ? a[e]() : a[f] ? a[f]() : a[b];
  },
  setValue: function(a, b, c) {
    a['set' + b.charAt(0).toUpperCase() + b.slice(1)](c);
  },
  clone: function(a) {
    if (!a) {return null;}
    let b = {};
    for (let c in a) {b[c] = a[c];}
    return b;
  },
  setText: function(a, b, c) {
    c ? UserAgent.isFirefox ? a.textContent = b : a.innerText = b : a.innerHTML = b;
  },
  fillDescendant: function(a, b) {
    b.add(a),
      a.hasChildren() && a.getChildren().forEach(function(a) {
        _tool.fillDescendant(a, b);
      });
  },
  setFocus: function(a) {
    if (document.activeElement === a) {return;}
    let b, c, d = document.documentElement,
      e = document.body,
      f;
    d && (UserAgent.isIE || UserAgent.isOpera || d.scrollLeft || d.scrollTop) ? (b = d.scrollLeft, c = d.scrollTop, f = d) : e && (b = e.scrollLeft, c = e.scrollTop, f = e),
      a.focus(),
      f && (f.scrollLeft = b, f.scrollTop = c);
  }
};


module.exports = _tool;
