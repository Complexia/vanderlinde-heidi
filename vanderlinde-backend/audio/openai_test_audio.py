import requests
# from app.core.config import OPENAI_API_KEY

# print("Loaded API key:", OPENAI_API_KEY[:8], "...")

files = {
    "audio": open("audio/sample_consultation.mp3", "rb")
}

data = {
    "patient_id": "123",
    "doctor_id": "456"
}
response = requests.post("http://localhost:8000/consultation/openapi/upload", files=files, data=data)

print(response.json())
