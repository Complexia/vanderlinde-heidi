from fastapi import APIRouter, File, UploadFile, Form
from fastapi.responses import JSONResponse
from app.services.heidi_api import transcribe_audio, generate_consult_notes, log_consultation
from app.services.audio_processing import save_temp_audio, delete_temp_audio
from app.utils.logger import logger
from app.services.openai_api import transcribe_audio_with_openai, generate_consult_notes_with_openai

router = APIRouter()

@router.get("/")
def home():
    return {"message": "FastAPI is working!"}

@router.post("/openapi/upload")
async def upload_audio(patient_id: str = Form(...), doctor_id: str = Form(...), audio: UploadFile = File(...)):
    temp_audio_path = await save_temp_audio(audio)

    try:
        transcript = transcribe_audio_with_openai(temp_audio_path)

        if not transcript:
            return JSONResponse(status_code=500, content={"error": "Transcript generation failed."})

        consult_notes = generate_consult_notes_with_openai(transcript)

        return {
            "transcript": transcript,
            "consult_notes": consult_notes
        }

    finally:
        delete_temp_audio(temp_audio_path)


# If using Heidi API

@router.post("/heidi/upload")
async def upload_audio(patient_id: str = Form(...), doctor_id: str = Form(...), audio: UploadFile = File(...)):
    temp_path = await save_temp_audio(audio)

    try:
        transcript = transcribe_audio(temp_path, audio)
        if not transcript:
            return JSONResponse(status_code=500, content={"error": "Transcript missing in Heidi API response"})

        logger.info("Transcript successfully received.")
        consult_notes = generate_consult_notes(transcript)
        if not consult_notes:
            return JSONResponse(status_code=500, content={"error": "Consult notes missing in Heidi API response"})

        logger.info("Consult notes successfully received.")
        result = log_consultation(patient_id, doctor_id, transcript, consult_notes)

        return {
            "transcript": transcript,
            "consult_notes": consult_notes,
            "heidi_response": result
        }

    finally:
        delete_temp_audio(temp_path)
