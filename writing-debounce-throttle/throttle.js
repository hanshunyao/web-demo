/**
 * @description: 函数节流（不使用定时器）让连续的函数执行，变为固定时间段间断地执行。
 * @param {function} func 节流的函数
 * @param {number} time  节流间隔
 * @return {function} 返回添加了节流的函数
 */
function throttleNoTimeOut(func, time) {
  var lastTime = 0;
  return function (...args) {
    var nowTime = new Date();
    if (nowTime - lastTime > time) {
      func(...args);
      lastTime = nowTime;
    }
  };
}

var throttleNoTimeOutFun = throttleNoTimeOut(function (e) {
  console.log(e);
}, 500);

/**
 * @description: 函数节流（使用定时器）
 * @param {function} func 节流的函数
 * @param {number} time  节流间隔
 * @return {function} 返回添加了节流的函数
 */
function throttleUseTimeout(func, time) {
  var timmer = null;
  return function (...args) {
    if (!timmer) {
      func(...args);
      timmer = setTimeout(function () {
        timmer = null;
      }, time);
    }
  };
}
var throttleUseTimeOutFun = throttleUseTimeOut(function (e) {
  console.log(e);
}, 500);
