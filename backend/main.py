from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from database import read_db
from schemas import Animal

app = FastAPI(title="EchoSource API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health_check():
    return {"status": "ok", "message": "EchoSource API is running"}


@app.get("/api/animals")
def get_animals():
    db = read_db()
    return db.get("animals", [])


@app.get("/api/animals/{animal_id}")
def get_animal(animal_id: str):
    db = read_db()
    for animal in db.get("animals", []):
        if animal["id"] == animal_id:
            return animal
    raise HTTPException(status_code=404, detail="Animal not found")
