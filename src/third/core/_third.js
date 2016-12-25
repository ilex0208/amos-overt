const ImageAsset = require('./_imageAsset');
const _cons = require('./../constants');
const Bd = _cons.Bd;
const UserAgent = require('./_userAgent');
const objKey2List = require('./_objKey2List');

// load all private modules
const extend = require('./../private/_extend');
const _tree = require('./../private/_tree');

let _third = {
  isDeserializing: !1,
  isCalculatingBus: !1,
  images: {},
  registerImage: function(a, b, e, f, g) {
    _third.images[a] = new ImageAsset(a, b, e, f, g);
  },
  getRegisteredImageNames: function() {
    return Object.keys(_third.images);
  },
  unregisterImage: function(a) {
    delete _third.images[a];
  },
  getImageAsset: function(a) {
    return _third.images[a];
  },
  /**
   * 延迟执行
   * @param {function} fn 需要延迟直线的函数
   * @param {any} fnContext 执行函数环境
   * @param {any} params fn函数执行需要的参数
   * @param {number} delay 延迟执行时间
   */
  callLater: function(fn, fnContext, params, delay) {
    return setTimeout(function() {
      fn.apply(fnContext, params);
    },
      delay || Bd.CALL_LATER_DELAY);
  },
  isEmptyObject: function(a) {
    for (let b in a) {
      console.log(b);
      return !1;
    }
    return !0;
  },
  num: function(a) {
    return typeof a == 'number' && !isNaN(a) && isFinite(a);
  },
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
  es: ['toString', 'toLocaleString', 'valueOf'],
  ip: function(a, b) {
    let c = '_' + b;
    a[_third.getter(b)] = function() {
      return this[c];
    },
      a[_third.setter(b)] = function(a) {
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
      a[_third.setter(b)] = function(a) {
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
  classCache: {},
  /**
   * 通过class name获取类
   */
  getClass: function(className) {
    let currentClass = _third.classCache[className];
    if (!currentClass) {
      let arr = className.split('.'),
        _length = arr.length;
      currentClass = window;
      for (let i = 0; i < _length; i++) {
        currentClass = currentClass[arr[i]];
      }
      _third.classCache[className] = currentClass;
    }
    return currentClass;
  },
  newInstance: function(a) {
    let b = _third.getClass(a);
    if (!b) {return null;}
    let c = arguments.length,
      e = arguments;
    if (c === 1) {return new b;}
    if (c === 2) {return new b(e[1]);}
    if (c === 3) {return new b(e[1], e[2]);}
    if (c === 4) {return new b(e[1], e[2], e[3]);}
    if (c === 5) {return new b(e[1], e[2], e[3], e[4]);}
    if (c === 6) {return new b(e[1], e[2], e[3], e[4], e[5]);}
    if (c === 7) {return new b(e[1], e[2], e[3], e[4], e[5], e[6]);}
    if (c === 8) {return new b(e[1], e[2], e[3], e[4], e[5], e[6], e[7]);}
    throw 'don\'t support args more than 7';
  },
  addMethod: function(a, b) {
    let c = a.prototype;
    for (let d in b) {c[d] = b[d];}
  },
  ext: function( classNameStr, supClass, extProperty) {
    var result;
    typeof className == 'string' && (result = classNameStr, classNameStr = _third.getClass(classNameStr));
    if (supClass) {
      var f = function() {};
      f.prototype = supClass.prototype,
        classNameStr.prototype = new f,
        classNameStr.prototype.constructor = classNameStr,
        classNameStr.supClass = supClass.prototype,
        supClass.prototype.constructor == Object.prototype.constructor && (supClass.prototype.constructor = supClass);
    }
    result && (classNameStr.prototype.getClassName = function() {
      return result;
    });
    if (extProperty) {
      var __prototype = classNameStr.prototype;
      for (var pro in extProperty){ extend.ext(pro, __prototype, extProperty);}
      var i = _third.es.length;
      for (var k = 0; k < i; k++){
        pro = _third.es[k],
        extProperty.hasOwnProperty(pro) && !extProperty.propertyIsEnumerable(pro) && (__prototype[pro] = extProperty[pro]);
      }
    }
  },
  setViewBounds: function(a, b) {
    if (!a) {return;}
    if (a.adjustBounds) {a.adjustBounds(b);}
    else {
      let c = a.style;
      !c && a.getView() && (c = a.getView().style),
        c && (c.position = 'absolute', c.left = b.x + 'px', c.top = b.y + 'px', c.width = b.width + 'px', c.height = b.height + 'px');
    }
  },
  getImageSrc: function(a) {
    let b = _third.getImageAsset(a);
    return b ? b.getSrc() ? b.getSrc() : b.getImage().getAttribute('src') : a;
  },
  nextColorCount: 0,
  nextColor: function() {
    return _third.nextColorCount >= Bd.COLORS.length && (_third.nextColorCount = 0),
      Bd.COLORS[_third.nextColorCount++];
  },
  isCtrlDown: function(a) {
    return a.ctrlKey || a.metaKey;
  },
  isShiftDown: function(a) {
    return a.shiftKey;
  },
  isAltDown: function(a) {
    return a.altKey;
  },
  setText: function(a, b, c) {
    c ? UserAgent.isFirefox ? a.textContent = b : a.innerText = b : a.innerHTML = b;
  },
  fillDescendant: function(a, b) {
    b.add(a),
      a.hasChildren() && a.getChildren().forEach(function(a) {
        _third.fillDescendant(a, b);
      });
  }
};

extend.__new = function(a, b) {
  a.newInstance = function() {
    var a = _third.getClass(this.getClassName());
    if (!a) {return null;}
    var b = arguments.length,
      c = arguments;
    if (b === 0) {return new a;}
    if (b === 1) {return new a(c[0]);}
    if (b === 2) {return new a(c[0], c[1]);}
    if (b === 3) {return new a(c[0], c[1], c[2]);}
    if (b === 4) {return new a(c[0], c[1], c[2], c[3]);}
    if (b === 5) {return new a(c[0], c[1], c[2], c[3], c[4]);}
    if (b === 6) {return new a(c[0], c[1], c[2], c[3], c[4], c[5]);}
    if (b === 7) {return new a(c[0], c[1], c[2], c[3], c[4], c[5], c[6]);}
    throw 'don\'t support args more than 7';
  };
};
extend.__tree = _tree;
_third.extend = extend;

module.exports = _third;
