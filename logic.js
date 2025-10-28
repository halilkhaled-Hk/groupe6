let currentInput = "";
let resultDisplayed = false;

<<<<<<< HEAD
// Liste des caractères valides pour éviter les injections dans eval
const validChars = /^[0-9+\-*/.()]+$/;

function handleButton(action) {
    switch (action) {
        case "clear":
            currentInput = "";
            display.textContent = "0";
            break;

        case "delete":
            currentInput = currentInput.slice(0, -1);
            display.textContent = currentInput || "0";
            break;

        case "=":
            if (!currentInput) return;
            if (!validChars.test(currentInput)) {
                display.textContent = "Erreur";
                return;
            }
            try {
                const result = eval(currentInput);
                display.textContent = result;
                addToHistory(`${currentInput} = ${result}`);
                currentInput = result.toString();
                resultDisplayed = true;
            } catch (error) {
                display.textContent = "Erreur";
                console.error("Erreur de calcul :", error);
            }
            break;

        default:
            if (resultDisplayed) {
                currentInput = "";
                resultDisplayed = false;
            }
            currentInput += action;
            display.textContent = currentInput;
            break;
    }
}

// Bouton de changement de thème
document.getElementById("theme-toggle").addEventListener("click", () => {
    document.body.classList.toggle("dark");
});
=======
function handleButton(action) {
    if (action === "clear") {
        currentInput = "";
        display.textContent = "0";
    } else if (action === "delete") {
        currentInput = currentInput.slice(0, -1);
        display.textContent = currentInput || "0";
    } else if (action === "=") {
        try {
            const result = eval(currentInput);
            display.textContent = result;
            addToHistory(currentInput + " = " + result);
            currentInput = result.toString();
            resultDisplayed = true;
        } catch {
            display.textContent = "Erreur";
        }
    } else {
        if (resultDisplayed) {
            currentInput = "";
            resultDisplayed = false;
        }
        currentInput += action;
        display.textContent = currentInput;
    }
}

document.getElementById("theme-toggle").addEventListener("click", () => {
    document.body.classList.toggle("dark");
});
>>>>>>> origin/Abdoul
