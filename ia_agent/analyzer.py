from typing import List
import openai

def analyze_code(files: List[str]) -> List[str]:
    errors = []
    for file in files:
        with open(file, 'r') as f:
            content = f.read()
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "Tu es un auditeur HTML/JS/CSS"},
                {"role": "user", "content": content}
            ]
        )
        errors.append(response['choices'][0]['message']['content'])
    return errors
