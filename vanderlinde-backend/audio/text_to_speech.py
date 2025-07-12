from gtts import gTTS

text = (
    "Hello doctor. I've been feeling very tired lately and I get frequent headaches. "
    "I'm also more thirsty than usual. "
    "Hmm, have you had any weight loss or blurry vision? "
    "Yes, a little bit of both. "
    "Sounds like we should test your blood sugar levels. "
    "This could be an early sign of diabetes. "
    "I'll order a basic blood panel and follow up next week. "
    "Thank you doctor."
)

tts = gTTS(text, lang='en')
tts.save("sample_consultation.mp3")
