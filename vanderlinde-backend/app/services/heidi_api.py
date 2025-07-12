import os
import requests
from app.core.config import HEIDI_API_KEY, HEIDI_BASE_URL

headers = {"Authorization": f"Bearer {HEIDI_API_KEY}"}

def transcribe_audio(temp_path, audio):
    with open(temp_path, "rb") as f:
        response = requests.post(
            f"{HEIDI_BASE_URL}/audio/transcriptions",
            files={"file": (audio.filename, f, audio.content_type)},
            headers=headers
        )
    response.raise_for_status()
    return response.json().get("transcript")

def generate_consult_notes(transcript):
    response = requests.post(
        f"{HEIDI_BASE_URL}/consultation-notes",
        json={"transcript": transcript},
        headers=headers
    )
    response.raise_for_status()
    return response.json().get("consult_notes")

def log_consultation(patient_id, doctor_id, transcript, consult_notes):
    payload = {
        "patient_id": patient_id,
        "doctor_id": doctor_id,
        "transcript": transcript,
        "consult_notes": consult_notes
    }
    response = requests.post(
        f"{HEIDI_BASE_URL}/consultations",
        json=payload,
        headers=headers
    )
    response.raise_for_status()
    return response.json()
