// ============================================================
//  BT1: Trang giới thiệu tương tác
//  - Lời chào theo buổi (sáng/chiều/tối) dùng Date
//  - Đổi màu nền ngẫu nhiên
//  - Bật/Tắt Dark Mode
// ============================================================

// 1) Lời chào theo buổi — chạy khi trang vừa tải xong
function setGreetingByTime() {
  const greetingEl = document.getElementById("greeting");
  const hour = new Date().getHours(); // 0–23
  let message;

  if (hour >= 5 && hour < 12) {
    message = "☀️ Chào buổi sáng! Chúc bạn một ngày năng động.";
  } else if (hour >= 12 && hour < 18) {
    message = "🌤️ Chào buổi chiều! Hãy nghỉ ngơi một chút nhé.";
  } else if (hour >= 18 && hour < 22) {
    message = "🌆 Chào buổi tối! Bạn đã ăn tối chưa?";
  } else {
    message = "🌙 Khuya rồi, nhớ đi ngủ sớm nhé!";
  }

  greetingEl.innerText = message;
}

// 2) Đổi màu nền ngẫu nhiên
const COLORS = [
  "#f5f5f5", "#fff3e0", "#e8f5e9", "#e3f2fd",
  "#fce4ec", "#f3e5f5", "#fffde7", "#e0f7fa"
];

function getRandomColor() {
  const idx = Math.floor(Math.random() * COLORS.length);
  return COLORS[idx];
}

function changeBackgroundColor() {
  // Không đổi màu khi đang ở Dark Mode (giữ dark mode được ưu tiên)
  if (document.body.classList.contains("dark-mode")) return;

  const newColor = getRandomColor();
  document.body.style.backgroundColor = newColor;
}

// 3) Bật / tắt Dark Mode
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    document.body.style.backgroundColor = "#1e1e2e";
  } else {
    document.body.style.backgroundColor = "";
  }
}

// ============================================================
//  Đăng ký sự kiện (addEventListener)
// ============================================================
document.addEventListener("DOMContentLoaded", function () {
  setGreetingByTime();

  document
    .getElementById("changeColorBtn")
    .addEventListener("click", changeBackgroundColor);

  document
    .getElementById("toggleModeBtn")
    .addEventListener("click", toggleDarkMode);
});