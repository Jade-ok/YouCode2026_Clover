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
  "active_alerts": ["urgent health issues, symptoms, behavioral warnings, or cautions that staff must be aware of"],
  "action_items": ["specific tasks that need to be done for this animal"]
}

If a field has no relevant information, use an empty list [].
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
