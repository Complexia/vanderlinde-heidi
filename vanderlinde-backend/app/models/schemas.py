# app/models/schemas.py
from pydantic import BaseModel

class ConsultationPayload(BaseModel):
    patient_id: str
    doctor_id: str
    transcript: str
    consult_notes: str
