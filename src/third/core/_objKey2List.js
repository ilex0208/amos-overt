const List = require('./_list');

/**
 * 将一个对象的所有可枚举属性存放到list中
 * @param {object} obj
 */
module.exports = function(obj) {
  let _list = new List;
  for (let property in obj) {
    _list.add(property);
  }
  return _list;
};
