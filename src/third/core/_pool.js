const List = require('./_list');

/**
 * 创建tag
 * @param {String} tag html标签
 * @param {number} redundancy
 */
let Pool = function(tag, redundancy) {
  typeof tag == 'string' ? this.func = function() {
    return document.createElement(tag);
  } : this.func = tag,
    this.tagName = tag,
    redundancy != null && (this.redundancy = redundancy);
  this.redundancy = 2,
  this.currentIndex = -1,
  this.get = function() {
    this.currentIndex++;
    if (this.currentIndex === this.size()) {
      var a = this.func();
      return a._pool = this,
        a.style.margin = '0px',
        a.style.padding = '0px',
        this.list || (this.list = new List),
        this.list.add(a),
        a;
    }
    return this.list.get(this.currentIndex);
  },
  this.release = function(a) {
    this.list && this.list.remove(a) >= 0 && (delete a._selectData, delete a._expandData, delete a._checkData, delete a._editInfo, delete a.keepDefault, a.style.margin = '0px', a.style.padding = '0px', a.style.backgroundColor = '', a.removeAttribute('title'), this.tagName === 'img' && a.removeAttribute && (a.removeAttribute('width'), a.removeAttribute('height'), a.removeAttribute('src')), this.list.add(a), this.currentIndex--);
  },
  this.reset = function() {
    this.currentIndex = -1;
  },
  this.clear = function() {
    if (this.list){
      while (this.redundancy + this.currentIndex < this.list.size() - 1) {
        delete this.list.removeAt(this.list.size() - 1)._pool;
      }
    }
  },
  this.size = function() {
    return this.list ? this.list.size() : 0;
  };
};

module.exports = Pool;
