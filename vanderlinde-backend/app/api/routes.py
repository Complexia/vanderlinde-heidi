from fastapi import APIRouter, File, UploadFile, Form
from fastapi.responses import JSONResponse
from app.services.heidi_api import (
    start_session,
    init_transcription,
    upload_audio_chunk,
    finish_transcription,
    get_transcript,
    generate_consult_notes,
)
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
        # Step 1: Start session
        session_id = start_session()
        logger.info(f"Session started: {session_id}")

        # Step 2: Init transcription
        recording_id = init_transcription(session_id)
        logger.info(f"Recording started: {recording_id}")

        # Step 3: Upload audio chunk
        with open(temp_path, "rb") as f:
            upload_audio_chunk(session_id, recording_id, f, audio.filename, audio.content_type)

        # Step 4: Finish transcription
        finish_transcription(session_id, recording_id)
        logger.info("Transcription finished")

        # Step 5: Get transcript
        transcript = get_transcript(session_id)
        if not transcript:
            return JSONResponse(status_code=500, content={"error": "Transcript missing in Heidi API response"})

        logger.info("Transcript successfully received")

        # Step 6: Generate consult notes
        consult_notes = generate_consult_notes(session_id)
        if not consult_notes:
            return JSONResponse(status_code=500, content={"error": "Consult notes missing in Heidi API response"})

        logger.info("Consult notes successfully received")

        return {
            "session_id": session_id,
            "transcript": transcript,
            "consult_notes": consult_notes
        }

    except Exception as e:
        logger.error(f"Error in Heidi transcription flow: {str(e)}")
        return JSONResponse(status_code=500, content={"error": str(e)})

    finally:
        delete_temp_audio(temp_path)
