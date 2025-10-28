const historyDiv = document.getElementById("history");

function addToHistory(entry) {
    const line = document.createElement("div");
    const now = new Date().toLocaleString();//date et heure
    line.textContent = '${now} - ${entry}';
    historyDiv.prepend(line);
}