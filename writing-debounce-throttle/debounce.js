/**
 * @description: 函数防抖，防止函数在极短的时间内反复调用，造成资源的浪费
 * @param {function} func 防抖的函数
 * @param {number} time  防抖间隔
 * @return {function} 返回添加了防抖的函数
 */
function debounce(func, time) {
  var timmer = null;
  return function (...args) {
    if (timmer) {
      clearTimeout(timmer);
    }
    timmer = setTimeout(() => {
      func(...args);
    }, time);
  };
}

var debounceFun = debounce(function (e) {
  console.log(e);
}, 500);
