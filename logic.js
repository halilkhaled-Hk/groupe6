let currentInput = "";
const display = document.getElementById("display");

function handleButton(symbol) {
  if (symbol === "C") {
    currentInput = "";
  } else if (symbol === "=") {
    try {
      const result = eval(currentInput);
      addToHistory(currentInput + " = " + result);
      currentInput = result.toString();
    } catch {
      currentInput = "Erreur";
    }
  } else {
    currentInput += symbol;
  }
  display.value = currentInput;
}
