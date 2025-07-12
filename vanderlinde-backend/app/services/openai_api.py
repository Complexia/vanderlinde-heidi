import os
import openai

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
openai.api_key = OPENAI_API_KEY

def transcribe_audio_with_openai(temp_audio_path):
    with open(temp_audio_path, "rb") as f:
        response = openai.Audio.transcribe(
            model="whisper-1",
            file=f,
            response_format="text"
        )
    return response.strip()

def generate_consult_notes_with_openai(transcript):
    prompt = f"""
    You are a medical assistant AI. Summarize the following doctor-patient consultation in clear dot points.
    Extract key information like symptoms, diagnosis, medications, and suggested follow-ups.

    Transcript:
    {transcript}
    """

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a helpful medical note assistant."},
            {"role": "user", "content": prompt}
        ]
    )
    return response['choices'][0]['message']['content']
