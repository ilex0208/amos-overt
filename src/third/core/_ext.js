/**
 * 原型继承
 *
 * @param {any} className 类名
 * @param {any} superClass 父类
 * @param {any} subClass 子类
 */
module.exports = function(className, superClass, subClass) {
  // 目的： 实现只继承父类的原型对象
  var F = new Function(); // 1 创建一个空函数    目的：空函数进行中转
  F.prototype = superClass.prototype; // 2 实现空函数的原型对象和超类的原型对象转换
  subClass.prototype = new F(); // 3 原型继承
  subClass.prototype.constructor = subClass; // 4还原子类的构造器
  //保存一下父类的原型对象: 一方面方便解耦  另一方面方便获得父类的原型对象
  subClass.superClass = superClass.prototype; //自定义一个子类的静态属性 接受父类的原型对象
  //判断父类的原型对象的构造器 (加保险)
  if (superClass.prototype.constructor == Object.prototype.constructor) {
    superClass.prototype.constructor = superClass; //手动还原父类原型对象的构造器
  }
};
