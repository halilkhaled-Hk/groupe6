const display = document.getElementById("display");

// Vérifie que l'élément display existe avant de continuer
if (display) {
    const buttons = document.querySelectorAll(".btn");

    buttons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const action = e.currentTarget.dataset.action;
            if (!action) {
                console.warn("Aucune action définie pour ce bouton :", btn);
                return;
            }

            // Animation visuelle sur le bouton
            btn.classList.add("active");
            setTimeout(() => btn.classList.remove("active"), 150);

            try {
                handleButton(action);
            } catch (error) {
                console.error("Erreur lors du traitement du bouton :", error);
            }
        });
    });
} else {
    console.error("Élément #display introuvable dans le DOM.");
}
