const box = document.querySelector(".box");
const start = document.querySelector(".start");
const pause = document.querySelector(".pause");
const cancel = document.querySelector(".cancel");
const finish = document.querySelector(".finish");
const reverse = document.querySelector(".reverse");
const timeChange = document.querySelector(".timeChange");

// 设置一个动画
const aniamteCtrl = box.animate([
  {transform: 'translateX(0px)'},
  {backgroundColor: 'red'},
  {borderRadius: '100%', transform: 'translateX(500px)', backgroundColor: 'green'}
], {
  duration: 3000,
  fill: 'forwards'
});

// 绑定每个按钮的绑定事件
start.onclick = function() {
  aniamteCtrl.play();
}
cancel.onclick = function() {
  aniamteCtrl.cancel();
}
finish.onclick = function() {
  aniamteCtrl.finish();
}
pause.onclick = function() {
  aniamteCtrl.pause();
}
reverse.onclick = function() {
  aniamteCtrl.reverse();
}
timeChange.onchange = function(e) {
  aniamteCtrl.currentTime = e.target.value;
}

/**
 * @description: 这个地方写的不太好 使用了requestAnimationFrame(callback)数据会被覆盖，先用这个代替一下
 * @return {*}
 */
setInterval(()=>{
  timeChange.value = aniamteCtrl.currentTime;
},1000)