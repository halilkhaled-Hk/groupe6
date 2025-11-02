from ia_agent.mailer import send_error_report

errors = [
    "Erreur : fichier .env présent dans le commit",
    "Erreur : token GitHub détecté dans main.py"
]

recipient = "mvogoboris123@gmail.com"

send_error_report(errors, recipient)
