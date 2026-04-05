from fastapi import APIRouter, HTTPException
from typing import List
from db.database import read_animals, read_temporary_data, read_timeline, write_timeline
from schemas import AnimalDetailResponse, AnimalListResponse, ConfirmRequest

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


@router.post("/{animal_id}/confirm")
async def confirm_checkin(animal_id: str, payload: ConfirmRequest):
    animals = read_animals()
    if not any(a["id"] == animal_id for a in animals):
        raise HTTPException(status_code=404, detail="Animal not found")

    timeline = read_timeline()
    entry = {
        "entry_id": payload.entry_id,
        "animal_id": animal_id,
        "timestamp": payload.timestamp,
        "recorded_by": payload.recorded_by,
        "transcript": payload.transcript,
        "extracted_data": payload.extracted_data.model_dump(),
    }
    timeline.append(entry)
    write_timeline(timeline)

    return {"status": "success", "entry_id": payload.entry_id}
