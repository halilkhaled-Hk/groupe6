from analyzer import analyze_code
from mailer import send_error_report
from github_api import create_branch_and_pr
import subprocess

def get_current_branch() -> str:
    result = subprocess.run(["git", "rev-parse", "--abbrev-ref", "HEAD"], capture_output=True, text=True)
    return result.stdout.strip()

def create_fix_branch(base_branch: str) -> str:
    import time
    new_branch = f"fix/{base_branch}-{int(time.time())}"
    subprocess.run(["git", "checkout", "-b", new_branch])
    subprocess.run(["git", "add", "."])
    subprocess.run(["git", "commit", "-m", "Fix auto IA"])
    subprocess.run(["git", "push", "--set-upstream", "origin", new_branch])
    return new_branch


def get_modified_files() -> list[str]:
    result = subprocess.run(["git", "diff", "--name-only"], capture_output=True, text=True)
    return [f for f in result.stdout.splitlines() if f.endswith((".html", ".js", ".css"))]

def main():
    files = get_modified_files()
    errors = analyze_code(files)
    if any(errors):
        send_error_report(errors, "admin@tonprojet.com")
        print(" Erreurs détectées. Commit bloqué.")
        exit(1)
    print("Aucun problème détecté. Commit autorisé.")

if __name__ == "__main__":
    main()

if any(errors):
    send_error_report(errors, "admin@tonprojet.com")
    current_branch = get_current_branch()
    if current_branch in ["main", "prod"]:
        print("Branche protégée. Création d'une branche alternative...")
        new_branch = create_fix_branch(current_branch)
        create_branch_and_pr("tonutilisateur/tonrepo", "TON_TOKEN_GITHUB", new_branch)
        print(f" Branche {new_branch} créée et PR envoyée.")
    else:
        print(" Erreurs détectées. Commit bloqué.")
    exit(1)
