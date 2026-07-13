// JavaScript Document
// 打开或关闭弹窗
function togglePopup(id) {
    var popup = document.getElementById("popup" + id);
    if (popup.style.display === "block") {
        popup.style.display = "none"; // 关闭弹窗
    } else {
        popup.style.display = "block"; // 打开弹窗
    }
}

// 关闭弹窗
function closePopup(id) {
    var popup = document.getElementById("popup" + id);
    popup.style.display = "none";
}
