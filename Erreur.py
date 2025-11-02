# Erreur 1 : Token GitHub exposé
GITHUB_TOKEN = "ghp_1234567890abcdefEXEMPLE"

# Erreur 2 : Inclusion d’un fichier .env dans le projet
with open(".env", "r") as f:
    secrets = f.read()

# Erreur 3 : Fichier compilé Python inutile
# (simulé ici par une ligne qui représenterait un .pyc)
__pycache__ = "mailer.cpython-313.pyc"

# Erreur 4 : Mot de passe en dur
db_password = "supersecret123"

# Erreur 5 : Clé API exposée
API_KEY = "sk_test_abcdef1234567890EXEMPLE"
