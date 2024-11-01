const $ = require("../Library/jQuery.min.js");
// 浅拷贝
const data = {
  level: 1,
  children: [
    {
      level: 2,
      children: [],
    },
  ],
};

// 直接赋值
const shallowCopy1 = data;
// Object.assign 将多个对象的属性分配到一个对象并返回
const shallowCopy2 = Object.assign({}, data);
// ES6 扩展运算符
const shallowCopy3 = { ...data };
// arr slice 拷贝数组
const shallowCopy4 = { level: 1, children: data.children.slice() };
// arr concat 拷贝数组
const shallowCopy5 = { level: 1, children: data.children.concat() };
// jQuery $.extend
// $.extend 参数
// deep：true 深拷贝 false 浅拷贝
// target：要拷贝的目标对象
// object1：待拷贝到第一个对象的对象
// objectN：待拷贝到第N个对象的对象
const shallowCopy6 = {};
$.extend(shallowCopy6, data);
