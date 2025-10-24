const display = document.getElementById("display");

// Vérifie que l'élément display existe avant de continuer
if (display) {
    const buttons = document.querySelectorAll(".btn");

    buttons.forEach((button) => {
        button.addEventListener("click", (event) => {
            const action = event.currentTarget.dataset.action;
            
            if (action) {
                handleButton(action);
            } else {
                console.warn("Aucune action définie pour ce bouton :", button);
            }
        });
    });
} else {
    console.error("Élément #display introuvable dans le DOM.");
}
