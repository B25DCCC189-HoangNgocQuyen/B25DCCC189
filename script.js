// ============================================================
//  BÀI TẬP THỰC HÀNH 2: MÁY TÍNH ĐƠN GIẢN (CALCULATOR)
//  Kiến thức áp dụng:
//    - Khai báo biến bằng let / const
//    - Kiểu dữ liệu: Number, String, Boolean
//    - Toán tử số học và so sánh
//    - Cấu trúc điều kiện if - else, switch - case
//    - Hàm (function)
//    - Thao tác DOM: getElementById, querySelectorAll, innerText
//    - Xử lý sự kiện: addEventListener
// ============================================================

// ---------- 1) Lấy các phần tử trên giao diện ----------
const displayEl = document.getElementById("display");     // dòng số chính
const expressionEl = document.getElementById("expression"); // dòng phép tính phụ

// ---------- 2) Trạng thái của máy tính ----------
let currentInput = "0";   // số đang nhập (dạng chuỗi)
let previousInput = null; // số đã nhập trước đó
let operator = null;      // phép toán đang chờ: + - * / %
let justCalculated = false; // vừa bấm "=" hay chưa

// ---------- 3) Cập nhật màn hình ----------
function updateScreen() {
  displayEl.innerText = currentInput;

  if (operator !== null && previousInput !== null) {
    expressionEl.innerText = previousInput + " " + getOperatorSymbol(operator);
  } else {
    expressionEl.innerText = "";
  }
}

// Đổi ký hiệu toán tử sang dạng dễ đọc (dùng switch - case)
function getOperatorSymbol(op) {
  switch (op) {
    case "+": return "+";
    case "-": return "−";
    case "*": return "×";
    case "/": return "÷";
    case "%": return "%";
    default:  return "";
  }
}

// ---------- 4) Bấm một phím số (hoặc dấu phẩy thập phân) ----------
function inputNumber(value) {
  // Nếu vừa bấm "=" mà nhập số mới thì bắt đầu lại từ đầu
  if (justCalculated) {
    currentInput = "0";
    justCalculated = false;
  }

  if (value === ".") {
    // Mỗi số chỉ được có tối đa một dấu thập phân
    if (currentInput.includes(".")) return;
    currentInput = currentInput + ".";
    updateScreen();
    return;
  }

  // Thay số 0 đứng đầu, ngược lại thì nối thêm chữ số
  if (currentInput === "0") {
    currentInput = value;
  } else {
    currentInput = currentInput + value;
  }

  updateScreen();
}

// ---------- 5) Bấm một phím toán tử ----------
function inputOperator(op) {
  justCalculated = false;

  // Đã có phép toán đang chờ -> tính kết quả trung gian trước
  if (operator !== null && previousInput !== null) {
    const result = calculate(Number(previousInput), Number(currentInput), operator);

    if (result === null) return; // có lỗi (ví dụ chia cho 0)

    previousInput = String(result);
    currentInput = String(result);
  } else {
    previousInput = currentInput;
  }

  operator = op;
  currentInput = "0";
  updateScreen();

  // Sau khi chọn toán tử, màn hình chính hiển thị lại số trước đó cho dễ nhìn
  displayEl.innerText = previousInput;
}

// ---------- 6) Hàm tính toán (kiểm tra điều kiện đầu vào) ----------
function calculate(a, b, op) {
  // Kiểm tra dữ liệu đầu vào có hợp lệ không
  if (isNaN(a) || isNaN(b)) {
    showError("Dữ liệu không hợp lệ");
    return null;
  }

  let result;

  switch (op) {
    case "+":
      result = a + b;
      break;
    case "-":
      result = a - b;
      break;
    case "*":
      result = a * b;
      break;
    case "/":
      if (b === 0) {
        showError("Không thể chia cho 0");
        return null;
      }
      result = a / b;
      break;
    case "%":
      if (b === 0) {
        showError("Không thể chia cho 0");
        return null;
      }
      result = a % b;
      break;
    default:
      return null;
  }

  // Làm tròn để tránh lỗi số thực kiểu 0.1 + 0.2 = 0.30000000000000004
  return Math.round(result * 1e10) / 1e10;
}

// ---------- 7) Bấm dấu "=" ----------
function handleEquals() {
  // Chưa chọn phép toán thì không làm gì
  if (operator === null || previousInput === null) return;

  const a = Number(previousInput);
  const b = Number(currentInput);
  const result = calculate(a, b, operator);

  if (result === null) return;

  expressionEl.innerText =
    previousInput + " " + getOperatorSymbol(operator) + " " + currentInput + " =";

  currentInput = String(result);
  previousInput = null;
  operator = null;
  justCalculated = true;

  displayEl.innerText = currentInput;
}

// ---------- 8) Phím C (Clear) và ⌫ (xoá 1 ký tự) ----------
function clearAll() {
  currentInput = "0";
  previousInput = null;
  operator = null;
  justCalculated = false;
  updateScreen();
}

function deleteLast() {
  if (justCalculated) {
    clearAll();
    return;
  }

  if (currentInput.length <= 1) {
    currentInput = "0";
  } else {
    currentInput = currentInput.slice(0, -1);
  }

  updateScreen();
}

// ---------- 9) Hiển thị lỗi ngắn gọn trên màn hình ----------
function showError(message) {
  expressionEl.innerText = "⚠️ " + message;
  displayEl.innerText = "Lỗi";

  currentInput = "0";
  previousInput = null;
  operator = null;
  justCalculated = true;
}

// ============================================================
//  10) ĐĂNG KÝ SỰ KIỆN CHO TẤT CẢ CÁC NÚT BẤM
// ============================================================
document.addEventListener("DOMContentLoaded", function () {
  const keys = document.querySelectorAll(".key");

  // Lặp qua từng nút và gắn addEventListener
  keys.forEach(function (key) {
    key.addEventListener("click", function () {
      const number = key.dataset.number;     // data-number="7"
      const op = key.dataset.operator;       // data-operator="+"
      const action = key.dataset.action;     // data-action="clear"

      if (number !== undefined) {
        inputNumber(number);
      } else if (op !== undefined) {
        inputOperator(op);
      } else if (action === "clear") {
        clearAll();
      } else if (action === "delete") {
        deleteLast();
      } else if (action === "equals") {
        handleEquals();
      }
    });
  });

  // Bonus: cho phép gõ bằng bàn phím máy tính
  document.addEventListener("keydown", function (event) {
    const k = event.key;

    if (k >= "0" && k <= "9") {
      inputNumber(k);
    } else if (k === "." || k === ",") {
      inputNumber(".");
    } else if (k === "+" || k === "-" || k === "*" || k === "/" || k === "%") {
      inputOperator(k);
    } else if (k === "Enter" || k === "=") {
      event.preventDefault();
      handleEquals();
    } else if (k === "Backspace") {
      deleteLast();
    } else if (k === "Escape") {
      clearAll();
    }
  });

  updateScreen();
});
