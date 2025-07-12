from app.services.heidi_api import transcribe_audio, generate_consult_notes, log_consultation
import mimetypes

class MockUploadFile:
    def __init__(self, path):
        self.file = open(path, "rb")
        self.filename = path.split("/")[-1]
        self.content_type = mimetypes.guess_type(path)[0] or "audio/wav"

    def close(self):
        if not self.file.closed:
            self.file.close()

audio_path = "audio/sample_consultation.mp3"
mock_audio = MockUploadFile(audio_path)

try:
    transcript = transcribe_audio(audio_path, mock_audio)
    print("Transcript:\n", transcript)

    consult_notes = generate_consult_notes(transcript)
    print("\nConsult Notes:\n", consult_notes)

    result = log_consultation("patient-123", "doctor-456", transcript, consult_notes)
    print("\nHeidi Log Response:\n", result)

finally:
    mock_audio.close()
