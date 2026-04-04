from fastapi import APIRouter, HTTPException
from db.database import read_db, write_db

router = APIRouter(prefix="/api/animals", tags=["animals"])

@router.get("")
def get_animals():
    # BE-1.2: Fetch all animals from the database
    db = read_db()
    return db.get("animals", [])

@router.get("/{animal_id}")
def get_animal(animal_id: str):
    # BE-1.5: Fetch a specific animal by ID
    db = read_db()
    for animal in db.get("animals", []):
        if animal["id"] == animal_id:
            return animal
    raise HTTPException(status_code=404, detail="Animal not found")

@router.post("/{animal_id}/update")
async def update_animal(animal_id: str, payload: dict):
    # TODO: BE-5 - Receive finally approved Draft data and save the animal's timeline and status to the DB
    db = read_db()
    # ... update logic here ...
    # write_db(db)
    return {"status": "success", "message": f"Animal {animal_id} updated successfully."}