
const manageCookie = {
  /**
   * @description: 设置cookie
   * @param {string} name cookie 的 key
   * @param {string} value cookie 的 value
   * @param {number} date 有效的秒数
   */
  set: function (name, value, date) {
    document.cookie = name + '=' + value + '; max-age=' + date;	
  },
  /**
   * @description: 移除cookie
   * @param {*} name 移除cookie的名称
   */
  remove: function (name) {
    this.set(name, '', 0);
  },
  /**
   * @description: 获取cookie
   * @param {*} name 获取cookie的名称
   */
  get: function (name) {
    var cookies = document.cookie.split('; ');	

    for (var i = 0; i < cookies.length; i++) {
      var item = cookies[i].split('=');	
      if (item[0] == name) {
        return item[1];
      }
    }
  }
}