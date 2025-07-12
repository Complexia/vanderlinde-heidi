### Install Dependencies
```bash
pip install -r requirements.txt
```

### Add Environment Variables
Create a .env file in dir `vanderlinde-backend` with:
```bash
OPENAI_API_KEY=sk-...
HEIDI_API_KEY=...
HEIDI_BASE_URL=https://registrar.api.heidihealth.com/api/v2/ml-scribe/open-api
HEIDI_EMAIL=test@heidihealth.com
HEIDI_INTERNAL_ID=123
```

### Run FastAPI server using `uvicorn`:
```bash
uvicorn app.main:app --reload
```

### Test with sample text to audio file
1. Generate text-to-speech
    ```bash
    python3 -m audio.text_to_speech
    ```

2. Go to root dir `vanderlinde-backend`
    ```bash
    cd vanderlinde-backend
    ```

3. Run any one of them:
    - OpenAI API:
        ```bash
        python3 -m audio.openai_test_audio
        ```
    - Heidi API
        ```bash
        python3 -m audio.heidi_test_audio
        ```