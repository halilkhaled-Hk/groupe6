from analyzer import analyze_code
from mailer import send_error_report
from github_api import create_branch_and_pr
import subprocess
import time
import sys
import os
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()
GITHUB_USER = os.getenv("GITHUB_USER")
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
MAIL_RECIPIENT = os.getenv("MAIL_RECIPIENT")

def get_current_branch() -> str:
    """Récupère le nom de la branche Git actuelle"""
    result = subprocess.run(
        ["git", "rev-parse", "--abbrev-ref", "HEAD"],
        capture_output=True, text=True
    )
    return result.stdout.strip()

def create_fix_branch(base_branch: str) -> str:
    """Crée automatiquement une branche de correction"""
    new_branch = f"fix/{base_branch}-{int(time.time())}"
    subprocess.run(["git", "checkout", "-b", new_branch])
    subprocess.run(["git", "add", "."])
    subprocess.run(["git", "commit", "-m", "Fix auto IA"])
    subprocess.run(["git", "push", "--set-upstream", "origin", new_branch])
    return new_branch

def get_modified_files() -> list[str]:
    """Récupère la liste des fichiers modifiés à analyser"""
    result = subprocess.run(
        ["git", "diff", "--name-only"],
        capture_output=True, text=True
    )
    return [f for f in result.stdout.splitlines() if f.endswith((".html", ".js", ".css"))]

def main():
    """Point d’entrée principal de la vérification IA"""
    files = get_modified_files()
    errors = analyze_code(files)

    if errors:
        send_error_report(errors, MAIL_RECIPIENT)
        current_branch = get_current_branch()

        # Branche protégée → création automatique d'une branche de correction
        if current_branch in ["main", "prod"]:
            print("Branche protégée. Création d'une branche alternative...")
            new_branch = create_fix_branch(current_branch)
            create_branch_and_pr(f"{GITHUB_USER}/groupe6", GITHUB_TOKEN, new_branch)
            print(f"Branche {new_branch} créée et PR envoyée.")
        else:
            print(" Erreurs détectées. Commit bloqué.")
        sys.exit(1)
    else:
        print("Aucun problème détecté. Commit autorisé.")
        sys.exit(0)
 
if __name__ == "__main__":
    main()
