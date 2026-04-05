# Pydantic models for data validation (Frontend <-> Backend <-> AI)
from pydantic import BaseModel
from typing import List, Optional


class ExtractedData(BaseModel):
    active_alerts: List[str] = []
    action_items: List[str] = []


class HistoryEntry(BaseModel):
    entry_id: str
    timestamp: str
    recorded_by: str
    transcript: str


class Todo(BaseModel):
    id: str
    task: str
    is_completed: bool = False


class ConfirmRequest(BaseModel):
    entry_id: str
    timestamp: str
    recorded_by: str
    transcript: str
    extracted_data: ExtractedData


class AnimalProfile(BaseModel):
    name: str
    species: str
    breed: str
    gender: str
    age: str
    cage_location: str
    photo: Optional[str] = None


class PermanentData(BaseModel):
    intake_date: str
    chronic_conditions: List[str] = []
    cautions: List[str] = []


class Animal(BaseModel):
    id: str
    profile: AnimalProfile
    permanent_data: PermanentData


class AnimalListResponse(BaseModel):
    id: str
    profile: AnimalProfile


class AnimalDetailResponse(Animal):
    history: List[HistoryEntry] = []
    todos: List[Todo] = []
