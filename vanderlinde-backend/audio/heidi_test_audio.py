import requests

API_URL = "http://localhost:8000/consultation/heidi/upload"

PATIENT_ID = "123"
DOCTOR_ID = "456"
AUDIO_FILE_PATH = "audio/sample_consultation.mp3"

def test_heidi_api():
    try:
        with open(AUDIO_FILE_PATH, "rb") as audio_file:
            files = {
                "audio": ("sample_consultation.mp3", audio_file, "audio/wav")
            }
            data = {
                "patient_id": PATIENT_ID,
                "doctor_id": DOCTOR_ID
            }

            response = requests.post(API_URL, files=files, data=data)
            response.raise_for_status()

            result = response.json()
            print("\n Transcript:")
            print(result.get("transcript", "[No transcript returned]"))
            print("\n Consult Notes:")
            print(result.get("consult_notes", "[No notes returned]"))
            print("\n Session ID:", result.get("session_id"))

    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP error occurred: {http_err}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_heidi_api()
