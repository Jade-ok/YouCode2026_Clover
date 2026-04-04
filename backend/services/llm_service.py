from schemas import ExtractedData

SYSTEM_PROMPT = """
You are an AI assistant helping veterinarians and volunteers at an animal shelter.
Given a user's voice transcript, extract the key information according to the following categories.

- health: Health-related conditions or symptoms
- behavior: Animal's behavior and temperament
- feeding: Food and water intake information (food, water)
- medications: Medication information
- action_items: Things that need to be checked or acted upon
- cautions: Precautions (aggression, allergies, etc.)

The response must strictly follow the requested JSON structure (ExtractedData schema).
"""

async def extract_data_with_ai(transcript: str) -> ExtractedData:
    # TODO: BE-3 - Pass Text -> GPT-4o-mini -> Perform Permanent/Temporary classification and JSON extraction
    return ExtractedData(
        health=["Shows symptoms of coughing"],
        action_items=["Needs a vet checkup in the afternoon"]
    )