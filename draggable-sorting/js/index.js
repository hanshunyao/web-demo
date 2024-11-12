const sortableList = document.getElementById("sortableList");
let draggingElement = null;

sortableList.addEventListener("dragstart", function (e) {
  e.target.classList.add("dragging");
  draggingElement = e.target;
});

sortableList.addEventListener("dragover", function (e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
  if (e.target !== draggingElement && e.target.tagName === "LI") {
    const targetMsg = e.target.getBoundingClientRect();
    const mouseY = e.clientY - targetMsg.top;
    const targetHeight = targetMsg.height;
    if (mouseY < targetHeight / 2) {
      sortableList.insertBefore(draggingElement, e.target);
    } else {
      sortableList.insertBefore(draggingElement, e.target.nextSibling);
    }
  }
});

sortableList.addEventListener("dragend", function (e) {
  e.target.classList.remove("dragging");
  draggingElement = null;
});
