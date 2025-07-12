import requests
from app.core.config import HEIDI_API_KEY, HEIDI_BASE_URL, HEIDI_EMAIL, HEIDI_INTERNAL_ID

_jwt_token = None

def get_jwt_token():
    global _jwt_token
    if _jwt_token:
        return _jwt_token

    url = f"{HEIDI_BASE_URL}/jwt"
    headers = {"Heidi-Api-Key": HEIDI_API_KEY}
    params = {
        "email": HEIDI_EMAIL,
        "third_party_internal_id": HEIDI_INTERNAL_ID,
    }

    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()
    _jwt_token = response.json()["jwt"]
    print("JWT Token:", _jwt_token)
    return _jwt_token
