import os
import json
from dotenv import load_dotenv
from openai import OpenAI
from schemas import ExtractedData

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

SYSTEM_PROMPT = """
You are an AI assistant helping veterinarians and volunteers at an animal shelter.
Given a voice transcript from a shelter volunteer, extract key care information into the following JSON structure.

Return ONLY valid JSON with these exact fields:
{
  "health": ["list of health conditions or symptoms mentioned"],
  "behavior": ["list of behavior observations"],
  "feeding": {"food": "food intake description", "water": "water intake description"},
  "medications": ["list of medications mentioned"],
  "action_items": ["list of things that need to be done"],
  "cautions": ["list of cautions or warnings"]
}

If a field has no relevant information, use an empty list [] or null for feeding.
Do not include any explanation or markdown — only the JSON object.
"""


async def extract_data_with_ai(transcript: str) -> ExtractedData:
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Transcript: {transcript}"},
            ],
            response_format={"type": "json_object"},
            temperature=0.2,
        )
        raw = json.loads(response.choices[0].message.content)
        return ExtractedData(**raw)
    except Exception as e:
        raise RuntimeError(f"AI extraction failed: {str(e)}")
