const scanFile = document.querySelector(".scan-file");
const scanDir = document.querySelector(".scan-dir");
const upload = document.querySelector(".upload");
const dropContent = document.querySelector(".drop-content");
const list = document.querySelector("tbody");
const fileInput = document.querySelector("input.file");
const fileInputDir = document.querySelector("input.dir");

const tempFileList = [];

/**
 * @description: 单文件
 */
scanFile.addEventListener("click", function () {
  fileInput.click();
});

/**
 * @description: 多文件
 */
fileInput.addEventListener("change", function (e) {
  tempFileList.push(...e.target.files);
  renderFilelist();
});

/**
 * @description: 后续提交文件到后台
 */
upload.addEventListener("change", function (e) {
  // 触发提交后台 tempFileList 为文件列表
});

/**
 * @description: 文件夹上传
 */
scanDir.addEventListener("click", function () {
  fileInputDir.click();
});

/**
 * @description: 捕获上传文件夹input change事件将文件推入临时列表
 */
fileInputDir.addEventListener("change", function (e) {
  tempFileList.push(...e.target.files);
  renderFilelist();
});

// 拖拽上传功能
dropContent.addEventListener("dragover", (e) => e.preventDefault());
dropContent.addEventListener("drop", (e) => {
  e.preventDefault();
  for (const item of e.dataTransfer.items) {
    // 如果 item 是文件 返回FileSystemFileEntry或FileSystemDirectoryEntry表示它。
    // 如果该项不是文件，null则返回。
    // 该特性是非标准的，请尽量不要在生产环境中使用它！
    getFileByEntry(item.webkitGetAsEntry());
  }
});

/**
 * @description: 获取文件路径信息 装填 th 信息
 * @param {*} entry
 * @param {*} path
 * @param {*} path
 * @return {*}
 */
function getFileByEntry(entry, path = "") {
  if (entry.isFile) {
    entry.file((file) => {
      file.path = `${path}${file.name}`;
      tempFileList.push(file);
      renderFilelist();
    });
  } else {
    const reader = entry.createReader();
    reader.readEntries((entries) => {
      for (const item of entries) {
        getFileByEntry(item, `${path}${entry.name}/`);
      }
    });
  }
}

/**
 * @description: 更新渲染 页面表格元素
 */
function renderFilelist() {
  list.innerHTML = "";
  tempFileList.forEach((file, index) => {
    const tr = document.createElement("tr");
    list.appendChild(tr);
    tr.innerHTML = `
            <td>${file.name}</td>
            <td>${file.webkitRelativePath || file.path}</td>
            <td>${file.type}</td>
            <td>${transformByte(file.size)}</td>
            <td onclick=delFile(${index})>删除</td>
    `;
  });
}

/**
 * @description: 根据文件大小 转换合理的展现单位
 * @param {number} size 文件大小
 * @return {string} 返回展示文件大小字符串
 */
function transformByte(size) {
  if (size < 1024 ** 2) {
    return (size / 1024).toFixed(1) + "KB";
  } else if (size < 1024 ** 3) {
    return (size / 1024 ** 2).toFixed(1) + "MB";
  } else {
    return (size / 1024 ** 3).toFixed(1) + "GB";
  }
}

/**
 * @description: 删除文件
 * @param {number} index 删除文件下标
 */
function delFile(index) {
  tempFileList.splice(index, 1);
  renderFilelist();
}
