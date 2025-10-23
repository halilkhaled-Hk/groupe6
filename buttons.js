const buttons = [
  "7", "8", "9", "/",
  "4", "5", "6", "*",
  "1", "2", "3", "-",
  "0", ".", "C", "+",
  "="
];

const buttonsContainer = document.getElementById("buttons");

buttons.forEach(symbol => {
  const btn = document.createElement("button");
  btn.textContent = symbol;
  btn.className = "btn";
  btn.addEventListener("click", () => handleButton(symbol));
  buttonsContainer.appendChild(btn);
});
