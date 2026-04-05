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
  "active_alerts": [...],
  "action_items": [...]
}

active_alerts: Anything staff MUST know before interacting with or feeding this animal. Include:
- (Permanent/Chronic): Long-term or incurable health conditions (e.g., diabetes, chronic allergies)
- Food restrictions, dietary limitations, or special diet requirements
- Allergies (food, environmental, medication)
- Behavioral warnings (aggression, anxiety, fear triggers)
- Medication or treatment cautions
- Any note that says the animal "cannot", "must not", "should not", or "is not allowed" something
- Abnormal or concerning measurements (e.g. "weight dropped to 3kg", "temperature is 40.5°C", "blood sugar is high")

action_items: Specific tasks that need to be done. Include:
- (Temporary/Actionable): Acute issues curable with brief treatment (e.g., minor wounds, ear mites), one-time tasks, vet checkups, and immediate medication needs. Formulate these as actionable tasks.
- Feeding tasks (e.g. "feed only prescription diet", "give small meals 3x a day")
- Medical tasks (e.g. "schedule vet checkup", "apply ointment to left ear")
- Follow-up observations (e.g. "monitor stool", "watch for vomiting")
- Any to-do mentioned by the volunteer
- Measurements that should be tracked or rechecked (e.g. "recheck weight next week", "monitor blood glucose daily") — include the specific value mentioned so the next volunteer has context

If something involves both a restriction AND a task (e.g. "she's allergic to chicken, so only feed the green bag food"), put the restriction in active_alerts AND the task in action_items.
If a measurement is mentioned (weight, temperature, blood glucose, heart rate, etc.), always record it. Put it in active_alerts if the value seems abnormal or worrying, and in action_items if it needs follow-up or monitoring.

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
