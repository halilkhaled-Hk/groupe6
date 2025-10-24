const historyDiv = document.getElementById("history");

function addToHistory(entry) {
    if (!historyDiv) {
        console.error("L'élément #history est introuvable dans le DOM.");
        return;
    }

    const line = document.createElement("div");
    line.classList.add("history-line"); // permet de styliser facilement chaque ligne
    line.textContent = entry.trim(); // supprime les espaces inutiles

    historyDiv.prepend(line); // ajoute en haut de l’historique
}
