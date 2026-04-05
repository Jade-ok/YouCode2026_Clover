import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


async def transcribe_audio(audio_file) -> dict:
    try:
        response = client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file,
            response_format="verbose_json",
        )
        return {
            "transcript": response.text,
            "language": response.language,
        }
    except Exception as e:
        raise RuntimeError(f"Transcription failed: {str(e)}")
