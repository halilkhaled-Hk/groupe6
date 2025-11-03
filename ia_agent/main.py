# from analyzer import analyze_code
# from mailer import send_error_report
# from github_api import create_branch_and_pr
# import subprocess
# import time
# import sys
# import os
# from dotenv import load_dotenv

# # Charger les variables d'environnement
# load_dotenv()
# GITHUB_USER = os.getenv("GITHUB_USER")
# GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
# MAIL_RECIPIENT = os.getenv("MAIL_RECIPIENT")

# def get_current_branch() -> str:
#     """Récupère le nom de la branche Git actuelle"""
#     result = subprocess.run(
#         ["git", "rev-parse", "--abbrev-ref", "HEAD"],
#         capture_output=True, text=True
#     )
#     return result.stdout.strip()

# def create_fix_branch(base_branch: str) -> str:
#     """Crée automatiquement une branche de correction"""
#     new_branch = f"fix/{base_branch}-{int(time.time())}"
#     subprocess.run(["git", "checkout", "-b", new_branch])
#     subprocess.run(["git", "add", "."])
#     subprocess.run(["git", "commit", "-m", "Fix auto IA"])
#     subprocess.run(["git", "push", "--set-upstream", "origin", new_branch])
#     return new_branch

# def get_modified_files() -> list[str]:
#     """Récupère la liste des fichiers modifiés à analyser"""
#     result = subprocess.run(
#         ["git", "diff", "--name-only"],
#         capture_output=True, text=True
#     )
#     return [f for f in result.stdout.splitlines() if f.endswith((".html", ".js", ".css"))]

# def main():
#     """Point d’entrée principal de la vérification IA"""
#     files = get_modified_files()
#     errors = analyze_code(files)

#     if errors:
#         send_error_report(errors, MAIL_RECIPIENT)
#         current_branch = get_current_branch()

#         # Branche protégée → création automatique d'une branche de correction
#         if current_branch in ["main", "prod"]:
#             print("Branche protégée. Création d'une branche alternative...")
#             new_branch = create_fix_branch(current_branch)
#             create_branch_and_pr(f"{GITHUB_USER}/groupe6", GITHUB_TOKEN, new_branch)
#             print(f"Branche {new_branch} créée et PR envoyée.")
#         else:
#             print(" Erreurs détectées. Commit bloqué.")
#         sys.exit(1)
#     else:
#         print("Aucun problème détecté. Commit autorisé.")
#         sys.exit(0)

# if __name__ == "__main__":
#     main()

import subprocess
import uuid
from ia_agent.mailer import send_error_report

def detect_errors() -> list:
    errors = []

    # Simule la détection de secrets
    result = subprocess.run(["git", "grep", "-i", "ghp_"], capture_output=True, text=True)
    if result.stdout:
        errors.append("Token GitHub détecté :\n" + result.stdout)

    # Vérifie présence de .env dans l'index
    result = subprocess.run(["git", "ls-files", ".env"], capture_output=True, text=True)
    if result.stdout:
        errors.append("Fichier .env suivi par Git")

    return errors

def create_error_branch(base_branch="main") -> str:
    new_branch = f"error-fix-{uuid.uuid4().hex[:6]}"
    subprocess.run(["git", "checkout", "-b", new_branch, base_branch])
    print(f"Nouvelle branche créée : {new_branch}")
    return new_branch

def commit_and_push(branch: str):
    subprocess.run(["git", "add", "."])
    subprocess.run(["git", "commit", "-m", "Correction automatique des erreurs"])
    subprocess.run(["git", "push", "-u", "origin", branch])
    print("Branche poussée sur GitHub")

def open_pull_request(branch: str):
    subprocess.run(["gh", "pr", "create", "--base", "main", "--head", branch,
                    "--title", "Correction automatique", "--body", "Cette PR corrige les erreurs détectées."])
    print("Pull request créée")

def main():
    errors = detect_errors()
    if errors:
        print("Erreurs détectées :", errors)
        branch = create_error_branch()
        send_error_report(errors, "mvogoboris123@gmail.com")
        commit_and_push(branch)
        open_pull_request(branch)
    else:
        print("Aucun problème détecté dans le commit.")

if __name__ == "__main__":
    main()
