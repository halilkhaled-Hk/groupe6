import requests

def create_branch_and_pr(repo: str, token: str, branch: str):
    headers = {"Authorization": f"token {token}"}
    data = {
        "title": "PR automatique suite à erreur",
        "head": branch,
        "base": "main",
        "body": "Code à auditer par l'administrateur"
    }
    requests.post(f"https://api.github.com/repos/{repo}/pulls", json=data, headers=headers)
