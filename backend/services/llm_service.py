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
  "active_alerts": [{"text": "summarized alert", "source": "exact phrase copied from transcript"}],
  "action_items": [{"text": "summarized task", "source": "exact phrase copied from transcript"}]
}

For "source": copy the exact phrase or sentence from the transcript that this item came from. This will be used to highlight the relevant part of the transcript.

active_alerts: Anything staff MUST know before interacting with or feeding this animal. Include:
- (Permanent/Chronic): Long-term or incurable health conditions (e.g., diabetes, chronic allergies)
- Food restrictions, dietary limitations, or special diet requirements
- Allergies (food, environmental, medication)
- Behavioral warnings (aggression, anxiety, fear triggers)
- Medication or treatment cautions
- Any note that says the animal "cannot", "must not", "should not", or "is not allowed" something

action_items: Specific tasks that need to be done. Include:
- (Temporary/Actionable): Acute issues curable with brief treatment (e.g., minor wounds, ear mites), one-time tasks, vet checkups, and immediate medication needs. Formulate these as actionable tasks.
- Feeding tasks (e.g. "feed only prescription diet", "give small meals 3x a day")
- Medical tasks (e.g. "schedule vet checkup", "apply ointment to left ear")
- Follow-up observations (e.g. "monitor stool", "watch for vomiting")
- Any to-do mentioned by the volunteer

If something involves both a restriction AND a task (e.g. "she's allergic to chicken, so only feed the green bag food"), put the restriction in active_alerts AND the task in action_items.
Always capture any numeric measurements or changes (e.g. "gained 3kg", "temperature was 40°C"). If the value is concerning or abnormal, put it in active_alerts. If it needs follow-up, put it in action_items. If both apply, put it in both — always include the specific value so the next volunteer has context.

If a field has no relevant information, use an empty list [].
Always respond in English, regardless of the language of the transcript.
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
