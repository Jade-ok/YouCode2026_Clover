from fastapi import APIRouter, HTTPException
from typing import List
import uuid
from db.database import read_animals, write_animals, read_history, write_history, read_todos, write_todos
from schemas import AnimalDetailResponse, AnimalListResponse, ConfirmRequest
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

    # 가장 최근 데이터가 상단에 오도록 history 배열을 역순으로 뒤집어서 반환합니다.
    return {**animal, "todos": animal_todos, "history": animal_history[::-1]}


@router.post("/{animal_id}/confirm")
async def confirm_checkin(animal_id: str, payload: ConfirmRequest):
    animals = read_animals()
    animal = next((a for a in animals if a["id"] == animal_id), None)
    
    if not animal:
        raise HTTPException(status_code=404, detail="Animal not found")

    # 1. Add active_alerts to animals.json (permanent_data.cautions)
    if payload.extracted_data.active_alerts:
        for alert in payload.extracted_data.active_alerts:
            if alert.text not in animal["permanent_data"]["cautions"]:
                animal["permanent_data"]["cautions"].append(alert.text)
        write_animals(animals)

    # 2. Append transcript to history.json
    all_history = read_history()
    animal_history = next((h for h in all_history if h["animal_id"] == animal_id), None)
    new_entry = {
        "entry_id": payload.entry_id,
        "timestamp": payload.timestamp,
        "recorded_by": payload.recorded_by,
        "transcript": payload.transcript,
    }

    if animal_history:
        animal_history["history"].append(new_entry)
    else:
        all_history.append({"animal_id": animal_id, "history": [new_entry]})
    write_history(all_history)

    # 3. Append action_items to todos.json
    all_todos = read_todos()
    animal_todos = next((t for t in all_todos if t["animal_id"] == animal_id), None)
    new_todos = [{"id": str(uuid.uuid4()), "task": task.text, "is_completed": False} for task in payload.extracted_data.action_items]
    if animal_todos:
        animal_todos["todos"].extend(new_todos)
    else:
        all_todos.append({"animal_id": animal_id, "todos": new_todos})
        
    write_todos(all_todos)
    return {"status": "success", "entry_id": payload.entry_id}
