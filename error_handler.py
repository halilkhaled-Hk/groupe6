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
