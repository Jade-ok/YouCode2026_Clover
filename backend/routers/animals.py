from fastapi import APIRouter, HTTPException
from typing import List
from db.database import read_animals, read_temporary_data, write_temporary_data
from schemas import Animal, AnimalDetailResponse, TemporaryDataEntry, AnimalListResponse

router = APIRouter(prefix="/api/animals", tags=["animals"])

@router.get("", response_model=List[AnimalListResponse])
def get_animals():
    # BE-1.2: Fetch all animals (Profile only for list view)
    return read_animals()

@router.get("/{animal_id}", response_model=AnimalDetailResponse)
def get_animal(animal_id: str):
    # BE-1.5: Fetch a specific animal and attach its temporary data
    animals = read_animals()
    animal = next((a for a in animals if a["id"] == animal_id), None)
    
    if not animal:
        raise HTTPException(status_code=404, detail="Animal not found")
        
    temp_data = read_temporary_data()
    animal_temp_data = [t for t in temp_data if t.get("animal_id") == animal_id]
    
    return {**animal, "temporary_data": animal_temp_data}

@router.post("/{animal_id}/update")
async def update_animal(animal_id: str, payload: TemporaryDataEntry):
    # BE-5: Append new temporary data entry safely
    animals = read_animals()
    if not any(a["id"] == animal_id for a in animals):
        raise HTTPException(status_code=404, detail="Animal not found")
        
    temp_data = read_temporary_data()
    temp_data.append(payload.dict())
    write_temporary_data(temp_data)
    
    return {"status": "success", "message": f"Temporary data for animal {animal_id} updated successfully."}