from typing import List
from email.message import EmailMessage
import smtplib
import os
from dotenv import load_dotenv

load_dotenv()
GMAIL_USER = os.getenv("GMAIL_USER") 
GMAIL_APP_PASSWORD = os.getenv("GMAIL_APP_PASSWORD")

def send_error_report(errors: List[str], recipient: str):
    msg = EmailMessage()
    msg.set_content("\n".join(errors))
    msg['Subject'] = 'Erreur dans le commit'
    msg['From'] = GMAIL_USER
    msg['To'] = recipient

    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as s:
        s.login(GMAIL_USER, GMAIL_APP_PASSWORD)
        s.send_message(msg)
