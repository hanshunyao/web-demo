var menus = document.getElementsByClassName("menu");
for (var i = 0; i < menus.length; i++) {
  menus[i].getElementsByTagName("h2")[0].onclick = menuClickHandler;
}

/**
 * @description: 点击菜单
 */
function menuClickHandler() {
  var allSubMenus = document.getElementsByClassName("sub-menu");
  var subMenu = this.parentElement.getElementsByClassName("sub-menu")[0];
  if (subMenu.clientHeight) {
    subMenu.style.height = "0";
  } else {
    subMenu.style.height = "150px";
    for (var i = 0; i < allSubMenus.length; i++) {
      if (allSubMenus[i] !== subMenu) {
        allSubMenus[i].style.height = "0";
      }
    }
  }
}