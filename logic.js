let currentInput = "";
let resultDisplayed = false;

function handleButton(action) {
    if (action === "clear") {
        currentInput = "";
        display.textContent = "0";
    } else if (action === "delete") {
        currentInput = currentInput.slice(0, -1);
        display.textContent = currentInput || "0";
    } else if (action === "=") {
        //verifier si l'entree est vide avant de calculer
        if (currentInput === "") {
           display.textContent = "Entree vide";
            return; //sortir de la fonction pour ne rien faire
        }
        try {
            const result = eval(currentInput); //verifier si le resultat est un nombre valide
            if (isNaN(result) || ! isFinite(result)){
             display.textContent = "Calcul impossible"; //Ex: division par zero
     } else { 
            display.textContent = result;
            addToHistory(currentInput + " = " + result);
            currentInput = result.toString();
            resultDisplayed = true;
     }
            } catch (error) {
                //Gerer les erreurs de syntaxe (ex: "5+*3")
            if (error instanceof syntaxeError){
                display.textContent = "Erreur de syntaxe";
            }else{
            display.textContent = "Erreur";//pour toute autre erreur imprevue
        }
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