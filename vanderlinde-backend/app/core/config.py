# app/core/config.py
import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

HEIDI_API_KEY = os.getenv("HEIDI_API_KEY")
HEIDI_BASE_URL = os.getenv("HEIDI_BASE_URL")
HEIDI_EMAIL = os.getenv("HEIDI_BASE_URL")
HEIDI_INTERNAL_ID = os.getenv("HEIDI_BASE_URL")
