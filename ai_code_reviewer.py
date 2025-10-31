from __future__ import annotations
import os
import subprocess
import sys
import smtplib
from email.message import EmailMessage
from typing import List, Optional
from dotenv import load_dotenv
import google.generativeai as genai
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer


# === Chargement des variables d'environnement ===
load_dotenv()

GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY")
EMAIL_SENDER: Optional[str] = os.getenv("EMAIL_SENDER")
EMAIL_PASSWORD: Optional[str] = os.getenv("EMAIL_PASSWORD")

if not GEMINI_API_KEY:
    print("❌ Erreur : GEMINI_API_KEY non défini.", file=sys.stderr)
    sys.exit(1)
if not EMAIL_SENDER or not EMAIL_PASSWORD:
    print("❌ Erreur : EMAIL_SENDER ou EMAIL_PASSWORD non défini.", file=sys.stderr)
    sys.exit(1)

# === Configuration de Gemini ===
genai.configure(api_key=GEMINI_API_KEY)
MODEL_NAME: str = "models/gemini-2.5-flash"


# === Fonction d’envoi d’email avec pièce jointe PDF ===
def send_email(
    to_email: str,
    subject: str,
    body: str,
    is_html: bool = False,
    attachment_path: Optional[str] = None
) -> None:
    """Envoie un email avec ou sans pièce jointe PDF."""
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = EMAIL_SENDER
    msg["To"] = to_email

    if is_html:
        msg.add_alternative(body, subtype="html")
    else:
        msg.set_content(body)

    # Ajout de la pièce jointe PDF si elle existe
    if attachment_path and os.path.exists(attachment_path):
        with open(attachment_path, "rb") as f:
            msg.add_attachment(
                f.read(),
                maintype="application",
                subtype="pdf",
                filename=os.path.basename(attachment_path)
            )

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(EMAIL_SENDER, EMAIL_PASSWORD)
            server.send_message(msg)
        print(f"📧 Email envoyé à {to_email} {'avec pièce jointe' if attachment_path else 'sans pièce jointe'}.")
    except Exception as e:
        print(f"⚠️ Échec de l’envoi de l’email : {e}", file=sys.stderr)


# === Génération d’un rapport PDF clair ===
def generate_pdf_report(errors: str, filename: str = "ai_report.pdf") -> str:
    """Crée un rapport PDF contenant les erreurs détectées."""
    doc = SimpleDocTemplate(filename, pagesize=A4)
    styles = getSampleStyleSheet()
    elements: List = []

    elements.append(Paragraph("🚫 Rapport d'analyse syntaxique IA Gemini", styles["Title"]))
    elements.append(Spacer(1, 12))
    elements.append(Paragraph("Voici les erreurs détectées :", styles["Normal"]))
    elements.append(Spacer(1, 12))
    elements.append(Paragraph(f"<pre>{errors}</pre>", styles["Code"]))

    doc.build(elements)
    return filename


# === Récupération des fichiers en staging ===
def get_staged_files() -> List[str]:
    """Retourne la liste des fichiers à analyser (.py, .js, .ts, .tsx)."""
    try:
        result = subprocess.run(
            ["git", "diff", "--cached", "--name-only"],
            capture_output=True,
            text=True,
            check=True
        )
        files = result.stdout.strip().split("\n")
        # ✅ Extension supportée : Python, JS, TS, TSX
        extensions = (".py", ".js", ".ts", ".tsx")
        return [f for f in files if f.endswith(extensions)]
    except FileNotFoundError:
        print("❌ Git non trouvé sur le système. Vérifie ton installation Git.", file=sys.stderr)
        sys.exit(1)
    except subprocess.CalledProcessError:
        print("⚠️ Impossible de récupérer les fichiers du commit.", file=sys.stderr)
        return []


# === Récupération de l'email Git de l’auteur du commit ===
def get_commit_author_email() -> Optional[str]:
    """Retourne l’adresse email configurée dans Git."""
    try:
        result = subprocess.run(
            ["git", "config", "user.email"],
            capture_output=True,
            text=True,
            check=True
        )
        return result.stdout.strip()
    except Exception:
        return None


# === Analyse du code avec Gemini ===
def review_code_with_gemini(file_path: str) -> str:
    """Analyse un fichier et retourne les erreurs de syntaxe uniquement."""
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
    except UnicodeDecodeError:
        try:
            with open(file_path, "r", encoding="latin-1") as f:
                content = f.read()
        except Exception as e:
            return f"⚠️ Impossible de lire {file_path} : {str(e)}"

    prompt: str = f"""
Tu es un **analyseur de syntaxe strict**.
Analyse le code ci-dessous et détecte uniquement les **erreurs de syntaxe** (parenthèses, accolades, indentation, imports invalides, etc.).
Langages possibles : Python, JavaScript, TypeScript.

Code :
{content}

Réponds strictement :
- "Aucune erreur syntaxique détectée" si tout est correct.
- Sinon, liste uniquement les erreurs syntaxiques détectées (une par ligne).
"""

    try:
        model = genai.GenerativeModel(MODEL_NAME)
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        return f"⚠️ Erreur lors de l’analyse de {file_path} : {str(e)}"


# === Fonction principale ===
def main() -> None:
    """Point d’entrée principal du script d’analyse."""
    files: List[str] = get_staged_files()
    if not files:
        print("ℹ️ Aucun fichier à analyser (.py, .js, .ts, .tsx).")
        sys.exit(0)

    author_email: Optional[str] = get_commit_author_email()
    errors_detected: bool = False
    message: str = ""

    for file in files:
        review: str = review_code_with_gemini(file)
        if "aucune erreur syntaxique détectée" not in review.lower():
            errors_detected = True
            message += f"\n📄 Fichier : {file}\n{review}\n"

    if errors_detected:
        print("❌ Des erreurs de syntaxe ont été détectées :")
        print(message)

        pdf_path: str = generate_pdf_report(message)

        if author_email:
            html_body: str = f"""
            <html>
              <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #D32F2F;">🚫 Des erreurs de syntaxe ont été détectées !</h2>
                <p>Bonjour 👋,</p>
                <p>Votre commit contient des erreurs de syntaxe :</p>
                <div style="background:#f9f9f9; padding:10px; border-radius:8px;">
                  <pre style="white-space: pre-wrap; font-family: monospace;">{message}</pre>
                </div>
                <p>Un rapport PDF est joint à cet email.</p>
                <p style="margin-top:20px;">— Votre assistant IA Gemini 🤖</p>
              </body>
            </html>
            """
            send_email(
                to_email=author_email,
                subject="🚫 Erreurs de syntaxe détectées - Commit bloqué",
                body=html_body,
                is_html=True,
                attachment_path=pdf_path
            )

        sys.exit(1)  # Bloque le commit

    else:
        print("✅ Aucune erreur syntaxique détectée. Commit autorisé.")
        if author_email:
            html_body_success: str = """
            <html>
              <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #388E3C;">✅ Vérification syntaxique réussie !</h2>
                <p>Bravo 🎉, aucun problème détecté dans votre commit.</p>
                <p>Continuez vos développements sereinement !</p>
                <p style="margin-top:20px;">— Votre assistant IA Gemini 🤖</p>
              </body>
            </html>
            """
            send_email(
                to_email=author_email,
                subject="✅ Vérification syntaxique réussie - Commit validé",
                body=html_body_success,
                is_html=True
            )

        sys.exit(0)


if __name__ == "__main__":
    main()
