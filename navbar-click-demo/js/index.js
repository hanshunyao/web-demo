  // 点击li时，切换active到被点击的li上
  var lis = document.querySelectorAll(".menu li");
  for (var i = 0; i < lis.length; i++) {
    lis[i].onclick = function () {
      // 去掉之前被选中的li的active
      var beforeActive = document.querySelector(".menu .active");
      beforeActive.classList.remove("active");
      this.classList.add("active");
    };
  }