import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


async def transcribe_audio(audio_file) -> dict:
    try:
        content = await audio_file.read()
        file_tuple = (audio_file.filename or "audio.m4a", content, audio_file.content_type)
        response = client.audio.transcriptions.create(
            model="whisper-1",
            file=file_tuple,
            response_format="verbose_json",
            language="en",
        )
        return {
            "transcript": response.text,
            "language": response.language,
        }
    except Exception as e:
        raise RuntimeError(f"Transcription failed: {str(e)}")
