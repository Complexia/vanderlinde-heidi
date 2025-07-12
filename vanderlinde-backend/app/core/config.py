# app/core/config.py
import os
from dotenv import load_dotenv

load_dotenv()

HEIDI_API_KEY = os.getenv("HEIDI_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
HEIDI_BASE_URL = os.getenv("HEIDI_BASE_URL")
