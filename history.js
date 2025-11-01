const historyDiv = document.getElementById("history");
const historyBtn = document.getElementById("historyBtn");
let historyList = [];

function addToHistory(entry) {
  historyList.push(entry);
  updateHistory();
}

function updateHistory() {
  historyDiv.innerHTML = "<h3>Historique</h3>" + historyList.map(e => `<p>${e}</p>`).join("");
}

historyBtn.addEventListener("click", () => {
  historyDiv.classList.toggle("hidden");
});
