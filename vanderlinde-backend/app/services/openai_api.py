from openai import OpenAI
from app.core.config import OPENAI_API_KEY

client = OpenAI(api_key=OPENAI_API_KEY)

def transcribe_audio_with_openai(temp_audio_path):
    with open(temp_audio_path, "rb") as f:
        response = client.audio.transcriptions.create(
            model="whisper-1",
            file=f
        )
    return response.text.strip()


def generate_consult_notes_with_openai(transcript):
    prompt = f"""
    You are a medical assistant AI. Summarize the following doctor-patient consultation in clear dot points.
    Extract key information like symptoms, diagnosis, medications, and suggested follow-ups.

    Transcript:
    {transcript}
    """

    response = client.chat.completions.create(model="gpt-4",
    messages=[
        {"role": "system", "content": "You are a helpful medical note assistant."},
        {"role": "user", "content": prompt}
    ])
    return response.choices[0].message.content
