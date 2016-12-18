let Base = {

};
var _List = function() {
  this._as = [];
  if (arguments.length === 1) {
    var a = arguments[0];
    a instanceof zd && (a = a._as);
    if (a instanceof Array) {
      var b = a.length;
      for (var c = 0; c < b; c++) this._as.push(a[c]);
    } else a != null && this._as.push(a);
  } else if (arguments.length > 1) {
    b = arguments.length;
    for (c = 0; c < b; c++) this._as.push(arguments[c]);
  }
};
Base.list = _List;
let Pool = {
  redundancy: 2,
  currentIndex: -1,
  get: function() {
    this.currentIndex++;
    if (this.currentIndex === this.size()) {
      var fn = this.func();
      return fn._pool = this,
        fn.style.margin = '0px',
        fn.style.padding = '0px',
        this.list || (this.list = new _List),
        this.list.add(fn),
        fn;
    }
    return this.list.get(this.currentIndex);
  },
  release: function(a) {
    this.list && this.list.remove(a) >= 0 && (delete a._selectData, delete a._expandData, delete a._checkData, delete a._editInfo, delete a.keepDefault, a.style.margin = '0px', a.style.padding = '0px', a.style.backgroundColor = '', a.removeAttribute('title'), this.tagName === 'img' && a.removeAttribute && (a.removeAttribute('width'), a.removeAttribute('height'), a.removeAttribute('src')), this.list.add(a), this.currentIndex--);
  },
  reset: function() {
    this.currentIndex = -1;
  },
  clear: function() {
    if (this.list)
      while (this.redundancy + this.currentIndex < this.list.size() - 1) delete this.list.removeAt(this.list.size() - 1)._pool;
  },
  size: function() {
    return this.list ? this.list.size() : 0;
  }
};
/**
 * 创建tag
 * @param {String} tag html标签
 * @param {number} redundancy
 */
Base.Pool = function(tag, redundancy) {
  typeof tag == 'string' ? this.func = function() {
    return document.createElement(tag);
  } : this.func = tag,
    this.tagName = tag,
    redundancy != null && (this.redundancy = redundancy);
};
