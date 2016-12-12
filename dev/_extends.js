'use strict';

//////////////////////////////
/**
 * 针对stage和scene进行扩展
 * 舞台
 * @author ilex
 * @description 2016-11-05 11:56:12
 */
//////////////////////////////

var Stage = require('./_stage');
var Scene = require('./_scene');

/**
 * 筛选结果
 *
 * @param {any} items 目标集合
 * @param {any} condition 条件
 * @returns
 */
function filterResults(items, condition) {
  var result = [];
  if (0 === items.length) {
    return result;
  }
  var filterCond = condition.match(/^\s*(\w+)\s*$/);
  if (null != filterCond) {
    var tempRes = items.filter(function (item) {
      return item.elementType == filterCond[1];
    });
    null != tempRes && tempRes.length > 0 && (result = result.concat(tempRes));
  } else {
    (function () {
      var flag = false;
      filterCond = condition.match(/\s*(\w+)\s*\[\s*(\w+)\s*([>=<])\s*['"](\S+)['"]\s*\]\s*/), (null == filterCond || filterCond.length < 5) && (filterCond = condition.match(/\s*(\w+)\s*\[\s*(\w+)\s*([>=<])\s*(\d+(\.\d+)?)\s*\]\s*/), flag = true);
      if (null != filterCond && filterCond.length >= 5) {
        (function () {
          var eleType = filterCond[1],
              prop2 = filterCond[2],
              sign = filterCond[3],
              val3 = filterCond[4];
          var tempRes2 = items.filter(function (otherItem) {
            if (otherItem.elementType != eleType) {
              return false;
            }
            var val2 = otherItem[prop2];
            return true === flag && (val2 = parseInt(val2)), '=' == sign ? val2 == val3 : '>' == sign ? val2 > val3 : '<' == sign ? val3 > val2 : '<=' == sign ? val3 >= val2 : '>=' == sign ? val2 >= val3 : '!=' == sign ? val2 != val3 : false;
          });
          null != tempRes2 && tempRes2.length > 0 && (result = result.concat(tempRes2));
        })();
      }
    })();
  }
  return result;
}

var events = 'click,mousedown,mouseup,mouseover,mouseout,mousedrag,keydown,keyup'.split(',');

/**
 * 给查询结果注入属性
 *
 * @param {any} arr 数组
 * @returns
 */
function invokeProperty(arr) {
  // 注入find方法
  arr.find = function (cond) {
    return find.call(this, cond);
  };
  // 注入事件
  events.forEach(function (ev) {
    arr[ev] = function (tar) {
      for (var i = 0; i < this.length; i++) {
        this[i][ev](tar);
      }
      return this;
    };
  });
  if (arr.length > 0) {
    var item = arr[0];

    var _loop = function _loop(key) {
      var value = item[key];
      'function' == typeof value && !function (val) {
        arr[key] = function () {
          var temp = [];
          for (var j = 0; j < arr.length; j++) {
            temp.push(val.apply(arr[j], arguments));
          }
          return key;
        };
      }(value);
    };

    for (var key in item) {
      _loop(key);
    }
  }
  return arr.attr = function (itemProperty, itemValue) {
    if (null != itemProperty && null != itemValue) {
      for (var j = 0; j < this.length; j++) {
        this[j][itemProperty] = itemValue;
      }
    } else {
      if (null != itemProperty && 'string' == typeof itemProperty) {
        var attrTemp = [];
        for (var m = 0; m < this.length; m++) {
          attrTemp.push(this[m][itemProperty]);
        }
        return attrTemp;
      }
      if (null != itemProperty) {
        for (var n = 0; n < this.length; n++) {
          for (var itKey in itemProperty) {
            this[n][itKey] = itemProperty[itKey];
          }
        }
      }
    }
    return this;
  }, arr;
}

/**
 * 公用查找方法
 *
 * @param {any} condition 查找条件(string | function)
 * @returns
 */
function find(condition) {
  var tempRes = [],
      tempArrays = [];
  this instanceof Stage ? (tempRes = this.childs, tempArrays = tempArrays.concat(tempRes)) : this instanceof Scene ? tempRes = [this] : tempArrays = this, tempRes.forEach(function (tempItem) {
    tempArrays = tempArrays.concat(tempItem.childs);
  });
  var result = null;
  return result = 'function' == typeof condition ? tempArrays.filter(condition) : filterResults(tempArrays, condition), result = invokeProperty(result);
}

module.exports = find;
//# sourceMappingURL=_extends.js.map