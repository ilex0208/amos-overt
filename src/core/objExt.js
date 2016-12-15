const _defaultClass = '_aot';
let _Jext = {
  __accessor: function (a, b) {
    var c = b.__accessor,
      e = c.length;
    for (var f = 0; f < e; f++) Extend.ip(a, c[f])
  },
  __bool: function (a, b) {
    var c = b.__bool,
      e = c.length;
    for (var f = 0; f < e; f++) Extend.ibool(a, c[f])
  },
  __client: function (a, b) {
    a.getClient = function (a) {
        return this._clientMap[a]
      },
      a.setClient = function (a, b) {
        var c = this._clientMap[a];
        return b == null ? delete this._clientMap[a] : this._clientMap[a] = b,
          this.firePropertyChange("C:" + a, c, b) && this.onClientChanged(a, c, b),
          this
      },
      a.getClientProperties = function () {
        return Extend.keys(this._clientMap)
      },
      a.onClientChanged = function (a, b, c) {}
  },
  __style: function (a, e) {
    a.getStyle = function (a, d) {
        var e = this._styleMap[a];
        return d === b && (d = !0),
          e == null && d ? c.Styles.getStyle(a) : e
      },
      a.setStyle = function (a, b) {
        var c = this._styleMap[a];
        return b == null ? delete this._styleMap[a] : this._styleMap[a] = b,
          this.firePropertyChange("S:" + a, c, b) && this.onStyleChanged(a, c, b),
          this
      },
      a.getStyleProperties = function () {
        return Extend.keys(this._styleMap)
      },
      a.onStyleChanged = function (a, b, c) {}
  },
  __new: function (a, b) {
    a.newInstance = function () {
      var a = Extend.getClass(this.getClassName());
      if (!a) return null;
      var b = arguments.length,
        c = arguments;
      if (b === 0) return new a;
      if (b === 1) return new a(c[0]);
      if (b === 2) return new a(c[0], c[1]);
      if (b === 3) return new a(c[0], c[1], c[2]);
      if (b === 4) return new a(c[0], c[1], c[2], c[3]);
      if (b === 5) return new a(c[0], c[1], c[2], c[3], c[4]);
      if (b === 6) return new a(c[0], c[1], c[2], c[3], c[4], c[5]);
      if (b === 7) return new a(c[0], c[1], c[2], c[3], c[4], c[5], c[6]);
      throw "don't support args more than 7"
    }
  },
  __property: function (a, b) {
    a.getValue = function (a, b) {
        return this._propertyType === "accessor" ? Extend.getValue(a, this._propertyName) : this._propertyType === "style" && a.getStyle ? a.getStyle(this._propertyName) : this._propertyType === "client" && a.getClient ? a.getClient(this._propertyName) : this._propertyType === "field" ? a[this._propertyName] : null
      },
      a.setValue = function (a, b, c) {
        if (this._propertyType === "accessor") a[Extend.setter(this._propertyName)](b);
        else {
          if (this._propertyType === "style" && a.setStyle) return a.setStyle(this._propertyName, b);
          if (this._propertyType === "client" && a.setClient) return a.setClient(this._propertyName, b);
          this._propertyType === "field" && (a[this._propertyName] = b)
        }
      }
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
  ext: function (proper, cla, objPro) {
    _Jext.map[proper] === 1 ? _Jext[proper](cla, objPro) : cla[proper] = objPro[proper]
  }
};
let Extend = {
  isDeserializing: !1,
  isCalculatingBus: !1,
  images: {},
  registerImage: function (a, b, e, f, g) {
    d.images[a] = new c.ImageAsset(a, b, e, f, g)
  },
  getRegisteredImageNames: function () {
    return Object.keys(d.images)
  },
  unregisterImage: function (a) {
    delete d.images[a]
  },
  getImageAsset: function (a) {
    return d.images[a]
  },
  getter: function (a) {
    var b = a.charAt(0).toUpperCase() + a.slice(1),
      c = /ble$/.test(a) || /ed$/.test(a) ? "is" : "get";
    return c + b
  },
  setter: function (a) {
    var b = a.charAt(0).toUpperCase() + a.slice(1);
    return "set" + b
  },
  _id: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"],
  id: function () {
    var a = [];
    for (var b = 0; b < 32; b++){
      a[b] = this._id[Math.floor(Math.random() * 16)];
    }
    return a[12] = "4",
      a[16] = this._id[a[16] & 3 | 8],
      a.join("")
  },
  keys: function (a) {
    var b = new zd;
    for (var c in a) b.add(c);
    return b
  },
  ibool: function (a, b) {
    var c = "_" + b,
      e = b.charAt(0).toUpperCase() + b.slice(1);
    a["is" + e] = function () {
        return this[c]
      },
      a[Extend.setter(b)] = function (a) {
        var d = this[c];
        this[c] = a,
          this.firePropertyChange(b, d, a)
      }
  },
  getValue: function (a, b, c) {
    var d = b.charAt(0).toUpperCase() + b.slice(1),
      e = "get" + d,
      f = "is" + d;
    return c ? c === "boolean" ? a[f]() : a[e]() : a[e] ? a[e]() : a[f] ? a[f]() : a[b]
  },
  setValue: function (a, b, c) {
    a["set" + b.charAt(0).toUpperCase() + b.slice(1)](c)
  },
  ip: function (a, b) {
    var c = "_" + b;
    a[Extend.getter(b)] = function () {
        return this[c]
      },
      a[Extend.setter(b)] = function (a) {
        var d = this[c];
        this[c] = a,
          this.firePropertyChange(b, d, a)
      }
  },
  es: ["toString", "toLocaleString", "valueOf"],
  classCache: {},
  getClass: function (name) {
    let targetClass = Extend.classCache[name];
    if (!targetClass) {
      let names = name.split("."),
        nameSize = names.length;
      targetClass = _defaultClass;
      for (let i = 0; i < nameSize; i++) {
        targetClass = targetClass[names[i]];
      }
      ExtenclassCache[name] = targetClass;
    }
    return targetClass;
  },
  newInstance: function (_cla) {
    let _class = Extend.getClass(_cla);
    if (!_class) return null;
    let _length = arguments.length,
      args = arguments;
    if (_length === 1) {
      return new _class;
    }
    if (_length === 2) {
      return new _class(args[1]);
    }
    if (_length === 3) {
      return new _class(args[1], args[2]);
    }
    if (_length === 4) {
      return new _class(args[1], args[2], args[3]);
    }
    if (_length === 5) {
      return new _class(args[1], args[2], args[3], args[4]);
    }
    if (_length === 6) {
      return new _class(args[1], args[2], args[3], args[4], args[5]);
    }
    if (_length === 7) {
      return new _class(args[1], args[2], args[3], args[4], args[5], args[6]);
    }
    if (_length === 8) {
      return new _class(args[1], args[2], args[3], args[4], args[5], args[6], args[7]);
    }
    throw "don't support args more than 7"
  },
  ext: function (_class, targetObj, objProperties) {
    let result;
    typeof _class == "string" && (result = _class, _class = Extend.getClass(_class));
    if (targetObj) {
      let newFun = function () {};
      newFun.prototype = targetObj.prototype,
        _class.prototype = new newFun,
        _class.prototype.constructor = _class,
        _class.superClass = targetObj.prototype,
        targetObj.prototype.constructor == Object.prototype.constructor && (targetObj.prototype.constructor = targetObj)
    }
    result && (_class.prototype.getClassName = function () {
      return result
    });
    if (objProperties) {
      let _cp = _class.prototype;
      for (let key in objProperties) {
        _Jext.ext(key, _cp, objProperties);
      }
      let size = Extend.es.length;
      for (let k = 0; k < size; k++) {
        key = Extend.es[k],
          objProperties.hasOwnProperty(key) && !objProperties.propertyIsEnumerable(key) && (_cp[key] = objProperties[key]);
      }
    }
  }
};

module.exports = Extend;
