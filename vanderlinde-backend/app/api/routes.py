from fastapi import APIRouter, File, UploadFile, Form
from fastapi.responses import JSONResponse
from app.services.heidi_api import transcribe_audio, generate_consult_notes, log_consultation
from app.services.audio_processing import save_temp_audio, delete_temp_audio
from app.utils.logger import logger

# In case you want to use OpenAI as fallback option or use it as a feedback loop
# from app.services.openai_api import transcribe_audio_with_openai, generate_consult_notes_with_openai

router = APIRouter()

@router.post("/upload")
async def upload_audio(patient_id: str = Form(...), doctor_id: str = Form(...), audio: UploadFile = File(...)):
    temp_path = await save_temp_audio(audio)

    try:
        transcript = transcribe_audio(temp_path, audio) # transcribe_audio_with_openai(temp_path)
        if not transcript:
            return JSONResponse(status_code=500, content={"error": "Transcript missing in Heidi API response"})

        logger.info("Transcript successfully received.")
        consult_notes = generate_consult_notes(transcript) # generate_consult_notes_with_openai(transcript)
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
