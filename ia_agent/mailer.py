from typing import List
from email.message import EmailMessage
import smtplib
import os
from dotenv import load_dotenv

load_dotenv()

GMAIL_USER = os.getenv("GMAIL_USER") 
GMAIL_APP_PASSWORD = os.getenv("GMAIL_APP_PASSWORD")

def send_error_report(errors: List[str], recipient: str):
    if not GMAIL_USER or not GMAIL_APP_PASSWORD:
        print("Identifiants Gmail manquants. Vérifie ton fichier .env.")
        return

    msg = EmailMessage()
    msg.set_content("\n".join(errors))
    msg['Subject'] = 'Erreur dans le commit'
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
        "Erreur : fichier .env présent dans le commit",
        "Erreur : token GitHub détecté dans main.py"
    ]
    destinataire = "tonadresse@gmail.com"
    send_error_report(erreurs, destinataire)
