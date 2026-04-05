from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import List
from datetime import datetime, timezone
import uuid
from db.database import read_animals, read_temporary_data, write_temporary_data, read_timeline, write_timeline
from schemas import Animal, AnimalDetailResponse, TemporaryDataEntry, AnimalListResponse, ConfirmRequest
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

    temp_data = read_temporary_data()
    animal_temp_data = [t for t in temp_data if t.get("animal_id") == animal_id]

    timeline = read_timeline()
    animal_timeline = [t for t in timeline if t.get("animal_id") == animal_id]

    return {**animal, "temporary_data": animal_temp_data, "timeline": animal_timeline}


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

    temp_data = read_temporary_data()
    temp_data.append(entry)
    write_temporary_data(temp_data)

    return {
        "entry_id": entry["entry_id"],
        "transcript": entry["transcript"],
        "language": stt_result["language"],
        "extracted_data": extracted_data,
    }


@router.post("/{animal_id}/confirm")
async def confirm_checkin(animal_id: str, payload: ConfirmRequest):
    temp_data = read_temporary_data()
    entry = next((e for e in temp_data if e["entry_id"] == payload.entry_id and e["animal_id"] == animal_id), None)

    if not entry:
        raise HTTPException(status_code=404, detail="Temporary entry not found")

    if payload.transcript is not None:
        entry["transcript"] = payload.transcript
    if payload.extracted_data is not None:
        entry["extracted_data"] = payload.extracted_data.dict()

    timeline = read_timeline()
    timeline.append(entry)
    write_timeline(timeline)

    updated_temp = [e for e in temp_data if e["entry_id"] != payload.entry_id]
    write_temporary_data(updated_temp)

    return {"status": "success", "entry_id": payload.entry_id}