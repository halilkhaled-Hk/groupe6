// Création dynamique des boutons de la calculatrice
const buttons = [
  "7", "8", "9", "÷",
  "4", "5", "6", "×",
  "1", "2", "3", "-",
  "0", ".", "C", "+",
  "="
];

const buttonsContainer = document.getElementById("buttons");
const display = document.getElementById("display");

buttons.forEach(symbol => {
  const btn = document.createElement("button");
  btn.textContent = symbol;
  btn.className = "btn";
  btn.addEventListener("click", () => handleButton(symbol));
  buttonsContainer.appendChild(btn);
});

// Ajout d'un bouton pour changer de thème
const themeBtn = document.createElement("button");
themeBtn.textContent = "🌙";
themeBtn.className = "theme-toggle";
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeBtn.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});
document.querySelector(".controls").appendChild(themeBtn);
