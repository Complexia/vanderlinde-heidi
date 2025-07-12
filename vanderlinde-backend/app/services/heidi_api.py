import requests
from app.core.config import HEIDI_BASE_URL
from app.services.heidi_auth import get_jwt_token

def _auth_headers():
    return {"Authorization": f"Bearer {get_jwt_token()}"}

# print("Headers:", _auth_headers)

def start_session():
    response = requests.post(
        f"{HEIDI_BASE_URL}/sessions",
        headers=_auth_headers()
    )
    response.raise_for_status()
    return response.json()["id"]

def init_transcription(session_id):
    response = requests.post(
        f"{HEIDI_BASE_URL}/sessions/{session_id}/restful-segment-transcription",
        headers=_auth_headers(),
    )
    response.raise_for_status()
    return response.json()["id"]

def upload_audio_chunk(session_id, recording_id, audio_file, filename, content_type):
    response = requests.post(
        f"{HEIDI_BASE_URL}/sessions/{session_id}/restful-segment-transcription/{recording_id}:transcribe",
        headers=_auth_headers(),
        files={"file": (filename, audio_file, content_type)},
        data={"index": "0"},
    )
    response.raise_for_status()
    return response

def finish_transcription(session_id, recording_id):
    response = requests.post(
        f"{HEIDI_BASE_URL}/sessions/{session_id}/restful-segment-transcription/{recording_id}:finish",
        headers=_auth_headers(),
    )
    response.raise_for_status()
    return response

def get_transcript(session_id):
    response = requests.get(
        f"{HEIDI_BASE_URL}/sessions/{session_id}/transcript",
        headers=_auth_headers()
    )
    response.raise_for_status()
    return response.json().get("transcript")

def generate_consult_notes(session_id):
    response = requests.post(
        f"{HEIDI_BASE_URL}/sessions/{session_id}/consult-note",
        headers=_auth_headers()
    )
    response.raise_for_status()
    return response.json().get("result")
