from typing import List
from email.message import EmailMessage
import smtplib

def send_error_report(errors: List[str], recipient: str):
    msg = EmailMessage()
    msg.set_content("\n".join(errors))
    msg['Subject'] = 'Erreur dans le commit'
    msg['From'] = 'brayanduchiwa123@gmail.com'
    msg['To'] = recipient

    with smtplib.SMTP('smtp.gmail.com', 465) as s:
        s.login('brayanduchiwa123@gmail.com', 'nryt lsqs hvst xunz')
        s.send_message(msg)
