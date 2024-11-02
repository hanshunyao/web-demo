const $ = require("../Library/jQuery.min.js");
// 深拷贝
const data = {
  level: 1,
  children: [
    {
      level: 2,
      children: [],
    },
  ],
};
// JSON.parse(JSON.stringify) 缺点是 不能拷贝函数
const deepClone1 = JSON.parse(JSON.stringify(stu));
// jQuery $.extend(deep,target,object1,objectN)
const deepClone2 = {};
$.extend(true, deepClone2, data);
// 递归
function deepClone(target) {
  let result;
  // 判断是否是对象类型
  if (typeof target === "object") {
    // 判断是否是数组类型
    if (Array.isArray(target)) {
      result = []; // 如果是数组,创建一个空数组
      // 遍历数组的键
      for (let i in target) {
        // 递归调用
        result.push(deepClone(target[i]));
      }
    } else if (target === null) {
      // 再判断是否是 null
      // 如果是，直接等于 null
      result = null;
    } else if (target.constructor === RegExp) {
      // 判断是否是正则对象
      // 如果是,直接赋值拷贝
      result = target;
    } else if (target.constructor === Date) {
      // 判断是否是日期对象
      // 如果是,直接赋值拷贝
      result = target;
    } else {
      // 则是对象
      // 创建一个空对象
      result = {};
      // 遍历该对象的每一个键
      for (let i in target) {
        // 递归调用
        result[i] = deepClone(target[i]);
      }
    }
  } else {
    // 表示不是对象类型，则是简单数据类型  直接赋值
    result = target;
  }
  // 返回结果
  return result;
}
const deepClone3 = deepClone(data);
