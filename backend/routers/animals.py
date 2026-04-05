from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import List
from datetime import datetime, timezone
import uuid
from db.database import read_animals, read_todos, write_todos, read_history, write_history
from schemas import AnimalDetailResponse, AnimalListResponse
from services.stt_service import transcribe_audio
from services.llm_service import extract_data_with_ai

router = APIRouter(prefix="/api/animals", tags=["animals"])


@router.get("", response_model=List[AnimalListResponse])
def get_animals():
    return read_animals()


@router.get("/{animal_id}", response_model=AnimalDetailResponse)
def get_animal(animal_id: str):
    animals = read_animals()
    animal = next((a for a in animals if a["id"] == animal_id), None)

    if not animal:
        raise HTTPException(status_code=404, detail="Animal not found")

    todos_data = read_todos()
    history_data = read_history()

    animal_todos = next((t["todos"] for t in todos_data if t.get("animal_id") == animal_id), [])
    animal_history = next((h["history"] for h in history_data if h.get("animal_id") == animal_id), [])

    return {**animal, "todos": animal_todos, "history": animal_history}


@router.post("/{animal_id}/analyze-audio")
async def analyze_audio(
    animal_id: str,
    audio_file: UploadFile = File(...),
    recorded_by: str = Form(default="Volunteer"),
):
    animals = read_animals()
    if not any(a["id"] == animal_id for a in animals):
        raise HTTPException(status_code=404, detail="Animal not found")

    try:
        stt_result = await transcribe_audio(audio_file)
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))

    try:
        extracted_data = await extract_data_with_ai(stt_result["transcript"])
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))

    entry = {
        "entry_id": str(uuid.uuid4()),
        "animal_id": animal_id,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "recorded_by": recorded_by,
        "transcript": stt_result["transcript"],
        "extracted_data": extracted_data.dict(),
    }

    return {
        "entry_id": entry["entry_id"],
        "transcript": entry["transcript"],
        "language": stt_result["language"],
        "extracted_data": extracted_data,
    }