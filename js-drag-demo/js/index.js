// 让便签可被拖动，但不能超出视口
var moveBar = document.querySelector('.move-bar')
var note = document.querySelector('.note')
moveBar.onmousedown = function (e) {
  // 记录鼠标按下时的坐标
  var mouseDownX = e.clientX;
  var mouseDownY = e.clientY;
  // 记录鼠标按下时 元素距离视口的距离
  var rect = moveBar.getBoundingClientRect();
  var rectX = rect.left;
  var rectY = rect.top;
  // 获取视口宽高 元素宽高
  var windowWidth = document.documentElement.clientWidth;
  var windowHeight = document.documentElement.clientHeight;
  var eleWidth = note.offsetWidth;
  var eleHeight = note.offsetHeight;
  var maxLeft = windowWidth - eleWidth;
  var maxTop = windowHeight - eleHeight
  // 在指定区域触发移动后，希望增加误造作的容错，监听全屏幕的移动，防止移动出区域导致监听失败。松开鼠标同理。
  window.onmousemove = function (e) {
    // 使用 鼠标按下时的 位置于当前位置 计算出 移动距离
    var disX = e.clientX - mouseDownX;
    var disY = e.clientY - mouseDownY;
    // 使用计算距离计算出 元素现在位置
    var eleLeft = rectX + disX;
    var eleTop = rectY + disY;
    // 控制挪动位置 无法挪动出视口，对 元素的位置做限制
    if (eleLeft < 0) {
      eleLeft = 0
    }
    if (eleLeft > maxLeft) {
      eleLeft = maxLeft
    }
    if (eleTop < 0) {
      eleTop = 0
    }
    if (eleTop > maxTop) {
      eleTop = maxTop
    }
    note.style.left = eleLeft + 'px';
    note.style.top = eleTop + 'px';
  }
  // 鼠标抬起后，删除监听
  window.onmouseup = function () {
    window.onmousemove = null;
    window.onmouseup = null;
  }
}
