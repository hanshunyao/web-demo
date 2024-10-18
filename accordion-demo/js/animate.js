/**
 * @description: 自动计算动画的渐变过程
 * @param {*} options 传入 初始位置（必传）、结束位置（必传）、动画变化时间、每步间隔时间、变化次数、进行中回调函数 以及 结束回调函数
 */
function createAnimation(options) {
  var from = options.from; // 起始值
  var to = options.to; // 结束值
  var totalMS = options.totalMS || 1000; // 变化总时间
  var duration = options.duration || 15; // 动画间隔时间
  var times = Math.floor(totalMS / duration); // 变化的次数
  var dis = (to - from) / times; // 每一次变化改变的值
  var curTimes = 0; // 当前变化的次数
  var timerId = setInterval(function () {
    from += dis;
    curTimes++; // 当前变化增加一次
    if (curTimes >= times) {
      // 变化的次数达到了
      from = to; // 变化完成了
      clearInterval(timerId); // 不再变化了
      options.onend && options.onend();
    }
    options.onmove && options.onmove(from);
  }, duration);
}

