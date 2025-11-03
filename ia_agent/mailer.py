from typing import List
from email.message import EmailMessage
import smtplib
import os
from dotenv import load_dotenv

load_dotenv()

GMAIL_USER = os.getenv("GMAIL_USER") 
GMAIL_APP_PASSWORD = os.getenv("GMAIL_APP_PASSWORD")

def format_personalized_message(errors: List[str], recipient: str) -> str:
    username = recipient.split("@")[0].capitalize()
    intro = f"Bonjour {username},\n\n"
    body = "Nous avons détecté les erreurs suivantes dans ton dernier commit :\n\n"
    error_list = "\n".join(f"- {err}" for err in errors)
    conclusion = (
        "\n\nMerci de corriger ces points avant de pousser à nouveau.\n"
        "L'équipe IA de sécurité automatisée."
    )
    return intro + body + error_list + conclusion

def send_error_report(errors: List[str], recipient: str):
    if not GMAIL_USER or not GMAIL_APP_PASSWORD:
        print("Identifiants Gmail manquants. Vérifie ton fichier .env.")
        return

    msg = EmailMessage()
    msg.set_content(format_personalized_message(errors, recipient))
    msg['Subject'] = 'Erreurs détectées dans ton commit'
    msg['From'] = GMAIL_USER
    msg['To'] = recipient

    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as s:
            s.login(GMAIL_USER, GMAIL_APP_PASSWORD)
            s.send_message(msg)
        print(f"Email envoyé avec succès à {recipient}")
    except Exception as e:
        print("Échec de l'envoi :", e)

# Exemple d'utilisation (à commenter ou supprimer en production)
if __name__ == "__main__":
    erreurs = [
        "Fichier `.env` suivi par Git",
        "Token GitHub détecté dans `main.py`",
        "Mot de passe en dur trouvé dans `config.py`"
    ]
    destinataire = "mvogoboris123@gmail.com"
    send_error_report(erreurs, destinataire)
