# Patient Empowerment and Health Navigation
An AI-first health navigation tool that empowers patients with instant summaries and smart follow-ups from doctor consultations. Built for the 2025 Heidi Hackathon.

---
## 🔄 Workflow
1. 🧑‍🤝‍🧑 Patient Consultation Begins
    - The patient visits the doctor.

    - With the patient’s explicit consent, the conversation is audio recorded through the web interface.

2. 👨‍⚕️ Doctor Dashboard
    - The doctor sees a list of patient profiles with current health status: `Sick`, `Recovering`, or `Healthy`.

3. 🎙️ Audio Submission
    - After the consult ends, the doctor submits the recording.

    - The audio is sent to the backend for processing.

4. 🧠 AI-Powered Summary
    - The backend uses OpenAI Whisper to transcribe the consultation.

    - GPT-4 then summarizes the transcript into structured, dot-point consult notes:

        - Symptoms discussed

        - Diagnosis

        - Medications prescribed

        - Suggested follow-ups

5. 🧾 Summary Display
    - The summary is attached under the patient’s profile.

    - A timeline of all past consultations is maintained.

6. 📈 Patient Status Update
    - Based on the AI-generated summary, the patient’s status is automatically updated:

        - `Sick` → Initial consult

        - `Recovering` → Follow-up shows improvement

        - `Healthy` → Final consult confirms recovery

7. 🔁 Continued Care
    - Future consultations can be appended to the same patient record.

    - The system tracks progression from diagnosis to recovery.

## ✨ Features

- 🎙️ Real-time audio transcription of doctor-patient consultations

- 🧠 GPT-4/Heidi powered consult

- 🔁 Follow-up actions and smart recommendations

- 📜 Logging to Heidi Health API for patient continuity

## 🚀 Tech Stack

### 🔧 Backend
- **FastAPI** – lightweight, async Python API framework
- **OpenAI GPT-4 & Whisper** – for transcription and consultation summarization
- **Heidi Health API** – For log transcripts
- **Python** – language of choice

### 🎨 Frontend
- **React + Next JS + Tailwind CSS** – UI for notes and follow-ups
- **Voice input** – direct browser mic recording
