const historyDiv = document.getElementById("history");
const historyBtn = document.getElementById("historyBtn");
let historyList = [];

function addToHistory(entry) {
<<<<<<< HEAD
<<<<<<< HEAD
    if (!entry) return; // Empêche d'ajouter des lignes vides
=======
  historyList.push(entry);
  updateHistory();
}
>>>>>>> origin/Halil

function updateHistory() {
  historyDiv.innerHTML = "<h3>Historique</h3>" + historyList.map(e => `<p>${e}</p>`).join("");
}
<<<<<<< HEAD
=======
    const line = document.createElement("div");
    line.textContent = entry;
    historyDiv.prepend(line);
}
>>>>>>> origin/Abdoul
=======

historyBtn.addEventListener("click", () => {
  historyDiv.classList.toggle("hidden");
});
>>>>>>> origin/Halil
