//判断是否是array
/**
 * Usage
 *  var isArray = require('./isarray');
 *  console.log(isArray([])); // => true
 *  console.log(isArray({})); // => false
 */

let toString = {}.toString;

module.exports = Array.isArray || function(arr) {
  return toString.call(arr) == '[object Array]';
};