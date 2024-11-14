/**
 * @description: 给定最小值最大值 随机一个数
 * @param {number} min 最小值
 * @param {number} max 最大值
 * @return {number} 随机数
 */
function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * @description: 生成随机 0-9, a-z
 * @return {*} 随机的字符串
 */
function getRandomAlpha() {
  // 正常情况：0-9,a-z 加入数组，随机位置返回
  // 取巧方法：36 0~35 转换成36进制 生成的就是 0-9,a-z
  return parseInt(getRandom(0, 36)).toString(36);
}

/**
 * @description: 生成随机汉字
 * @return {string} 随机的汉字
 */
function getRandomChinese() {
  return String.fromCharCode(parseInt(getRandom(0x4e00, 0x9fff)));
}

const cloud = document.querySelector(".cloud");

/**
 * @description: 启动函数、入口函数
 */
function run() {
  // 生成元素
  const textEle = document.createElement("div");
  cloud.appendChild(textEle);
  textEle.className = "text";

  // 元素内部随机数字字母
  // textEle.innerText = getRandomAlpha();

  // 生成随机的文字呢（汉语）
  textEle.innerText = getRandomChinese();
  // 元素初始水平偏移位置
  const dx = getRandom(0, 310);
  // 完成动画
  const animate = textEle.animate(
    [
      { transform: `translateX(${dx}px)`, offset: 0 },
      { transform: `translate(${dx}px, 290px)`, offset: 0.7 },
      { transform: `translate(${dx}px, 290px)`, offset: 1 },
    ],
    {
      duration: getRandom(1600, 3000),
      easing: "linear",
      fill: "forwards",
    }
  );

  animate.onfinish = function () {
    textEle.remove();
  };
  requestAnimationFrame(run);
}

// window.requestAnimationFrame() 方法会告诉浏览器你希望执行一个动画。它要求浏览器在下一次重绘之前，调用用户提供的回调函数。
requestAnimationFrame(run);
